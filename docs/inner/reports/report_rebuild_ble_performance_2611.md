---
title: Android BLE 多设备并发连接 实践
description: Android 多 BLE 设备并发连接及 3 秒业务就绪目标的可行性论证、重构方案与验收标准
keywords: [Android, BLE, GATT, 多设备, 并发连接, 多线程, 3秒, SLO, 重构]
---


import ImgText from '@site/src/components/ImgText/ImgText'; 

 
本次 BLE 连接稳定性与性能指标改造主要围绕 **“多设备尽量 3 秒内 ready、设备重启后尽快重连、可观测可追踪”** 三个目标展开。

### 本次优化内容总结

#### 1. 多设备连接调度改造

新增/改造了 [BlesLinkScheduler.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/BlesLinkScheduler.java)。

核心变化：

- 由原来的“所有绑定设备同时 `connectGatt()`”改为调度连接。
- 使用单线程串行调度模型。
- 当前最大并发连接数为：

```java
MAX_CONCURRENT_CONNECT = 3
```

- 单设备 ready 超时时间：

```java
READY_TIMEOUT_MS = 3000
```
```

整体链路变为：

```text
Devices.allAction(true)
↓
BlesLinkScheduler.connectAll(bindDevices)
↓
最多 3 台同时进入连接流程
↓
3 秒未 ready 则释放连接槽
↓
进入重试/重发现策略
```

---

#### 2. 避免多设备同时冲击 Android BLE 栈

修改 [Devices.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/Devices.java)。

原来 `allAction(true)` 会直接对所有绑定设备发起连接，容易导致：

- `status 133`
- connect 超时
- GATT busy
- 服务发现失败
- 多设备互相拖慢

现在改为：

```java
BlesLinkScheduler.single().connectAll(bindDevices());
```

这对多设备稳定性影响很大。

---

#### 3. 断线/超时重连策略优化

[BlesLinkScheduler.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/BlesLinkScheduler.java) 现在控制：

- 连接槽释放
- ready timeout
- 进入定向扫描

当前策略：

```text
设备断开 / 3 秒未 ready
↓
失败后进入 MAC 定向扫描
↓
扫描命中目标设备广播
↓
立即重新加入连接调度
```

---

#### 4. 设备关机再开机后的重发现机制

修改 [Ble.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/Ble.java)。

新增/调整了绑定设备重发现扫描：

- `startReconnectScan(Set<String> targetMacs)`
- `stopReconnectScan()`
- `_reconnectScanResult`
- MAC 过滤：
  ```java
  ScanFilter.Builder().setDeviceAddress(mac).build()
  ```
- 扫描模式：
  ```java
  SCAN_MODE_BALANCED
  ```

作用：

```text
设备离线较久
↓
启动 MAC 定向扫描
↓
设备重新开机广播
↓
扫描命中
↓
立即调度连接
```

相比全量扫描，MAC filter + balanced 模式更省电、噪声更低。

---

#### 5. 移除连接前指数退避

用户已在 [BleDevice.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/BleDevice.java) 中移除：

- `ExponentialBackoff`
- `Thread.sleep(delay)`
- 连接成功后的 `exponentialBackoff.reset()`

这会提升重连响应速度，避免外设重新开机后还因为历史退避而等待几秒甚至十几秒。

---

#### 6. GATT 操作串行化加强

在 [BleDevice.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/BleDevice.java) 中，多数 GATT 操作已通过 `BleIoQueue` 串行执行，包括：

- `discoverServices`
- `requestMtu`
- `setCharacteristicNotification`
- `writeDescriptor`
- `readCharacteristic`
- `writeCharacteristic`

这样可以减少 Android BLE 栈常见的并发问题：

```text
GATT busy
status 133
callback 乱序
descriptor/write/read 互相抢占
```

---

#### 7. 旧 GATT callback 防污染

在 [BleDevice.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/BleDevice.java) 的主要 callback 中加入：

```java
if (gatt != _gatt) return;
```

覆盖路径包括：

- `onConnectionStateChange`
- `onServicesDiscovered`
- `onCharacteristicRead`
- `onCharacteristicWrite`
- `onDescriptorWrite`
- `onCharacteristicChanged`
- `onReadRemoteRssi`
- `onMtuChanged`

作用：

```text
旧连接 callback 晚到
↓
不会污染新连接队列/状态
```

对频繁断开/重连尤其重要。

---

#### 8. 服务发现失败和 descriptor 写失败立即重连

在 [BleDevice.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/BleDevice.java) 中加强失败路径：

#### 服务发现失败

现在会立即：

- 记录失败
- bump queue generation
- `setState(0)`
- `refreshDeviceCache()`
- 调度重连

不再单纯等待 3 秒 ready timeout。

#### descriptor 写失败

现在也会立即：

- 记录失败
- bump queue generation
- `setState(0)`
- `refreshDeviceCache()`
- 调度重连

这能更快释放连接槽，避免坏连接占用多设备调度资源。

---


#### 9. 新增独立性能指标工具类

新增 [PerformanceTool.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/core/tools/PerformanceTool.java)。

职责：

- 记录 BLE 关键事件
- 记录开始时间、结束时间、耗时
- 维护设备维度关键时间点
- 通过 [FileTool.java](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/core/tools/FileTool.java) 输出 CSV

输出文件：

```text
cacheDir/ble_performance_metrics.csv
```

CSV 字段：

```csv
timestamp,mac,model,eventName,startTime,endTime,durationMs,bleScanFoundTime,addedBindDeviceTime,connectStartTime,connectSuccessTime,serviceDiscoveredTime,notifySubscribedTime,statusCode,extra
```

当前已接入事件：

- BLE 扫描发现
- 添加绑定设备
- 开始连接
- 连接成功
- 服务发现开始
- 服务发现完成
- notify 订阅开始
- notify 订阅成功/失败
- ready
- 连接失败
- ready timeout

---

## 长时间前台运行情况说明

:::info
当前 3台设备 分别为:
- Y917(D1)
- Y906(M9)
- DECG(心之声)
:::

| 机型 | 数量 | 时长 | 耗电量 | 备注 |
| --- | --- | --- | ---- | ---- |
| Pixel 7P | 3台 | 5h | 5% | <ImgText src="/img/inner/report_rebuild_ble_pro7.png" width={120} /> |






### 针对连接提升的影响排名

下面按“对多设备 3 秒 ready、连接稳定性、重连速度”的综合影响排序。

---

#### 第 1 名：多设备连接调度器 BlesLinkScheduler

影响最大。

原因：

- 避免所有绑定设备同时 `connectGatt()`。
- 限制并发，降低 Android BLE 栈压力。
- 3 秒未 ready 自动释放槽位。
- 失败设备不会拖慢其他设备。

影响范围：

```text
多设备连接速度
多设备稳定性
status 133 概率
连接槽释放效率
整体 3 秒 ready 成功率
```

这是最核心的架构优化。

---

#### 第 2 名：GATT 操作串行化 + 旧 callback 防污染

影响非常大。

原因：

BLE GATT 操作天然需要串行。现在大部分 GATT 操作进入 `BleIoQueue`，并且 callback 增加：

```java
if (gatt != _gatt) return;
```

可以明显减少：

- 旧连接 callback 污染新连接
- GATT busy
- descriptor/write/read 乱序
- 断开重连后的状态错乱

影响范围：

```text
ready 成功率
notify 订阅成功率
数据收发稳定性
重连后的可靠性
```

---

#### 第 3 名：移除连接前指数退避

影响主要体现在重连速度。

原因：

之前外设关机较久后，退避可能增长到：

```text
300ms → 600ms → 1200ms → 2400ms → 4800ms → 9600ms → 15000ms
```

设备重新开机时，手机可能仍在等待退避 sleep。

移除后：

```text
调度器到点
↓
立即 connectGatt
```

影响范围：

```text
设备重启后重连速度
前台连接响应速度
直连重试效率
```

---

#### 第 4 名：服务发现/descriptor 失败立即释放并重连

影响很实际。

原因：

原来失败后可能等 3 秒 ready timeout 才释放连接槽。现在失败点能立即：

```text
记录失败
断开/close
释放状态
调度重连
```

影响范围：

```text
失败恢复速度
多设备连接槽利用率
异常设备不阻塞其他设备
```

---

# 最终排序表

| 排名 | 优化项 | 对连接提升影响 |
|---:|---|---|
| 1 | [BlesLinkScheduler](file:///Users/henrygao/Documents/Work/yaseeJava/yasee/src/main/java/com/yasee/yasee/protocols/ble/BlesLinkScheduler.java) 多设备调度 | 最大，直接提升多设备稳定性 |
| 2 | GATT 串行化 + 旧 callback 防污染 | 极大，提升 ready 和数据通道稳定性 |
| 3 | 移除连接前指数退避 | 很大，提升重连响应速度 |
| 4 | 服务发现/descriptor 失败立即重连 | 很大，减少无效等待 |



## 资料引用
- [BluetoothDevice API](https://developer.android.com/reference/android/bluetooth/BluetoothDevice)
- [Android GATT 连接指南](https://developer.android.google.cn/develop/connectivity/bluetooth/ble/connect-gatt-server?hl=en)
