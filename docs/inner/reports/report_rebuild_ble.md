---
title: Android BLE 多设备并发连接 拆解 
description: Android 多 BLE 设备并发连接及 3 秒业务就绪目标的可行性论证、重构方案与验收标准
keywords: [Android, BLE, GATT, 多设备, 并发连接, 多线程, 3秒, SLO, 重构]
---

# Android BLE 多设备并发连接 拆解

## 摘要

> **裁定：Android 支持同时维护多个 BLE GATT 连接，因此多设备并发连接在能力层面可行；但 Android 与 Bluetooth 官方规范均未承诺扫描、连接、服务发现和业务初始化可在 3 秒内完成。**
>
> 因此，“3 秒”应定义为指定设备数、手机型号、外设状态和射频环境下的性能 **SLO（服务等级目标）**，不能定义为跨机型、跨设备的硬性 **SLA（服务等级协议）**。多线程重构可以消除 SDK 内部队列互相阻塞，但不能突破系统蓝牙栈、控制器、广播周期、射频环境或外设响应速度的限制。

建议以“单设备内 GATT 操作串行、多设备会话并行、全局连接窗口限流”为重构原则，并通过 P50/P95/P99、3 秒达标率和错误码分布验证目标。

## 1. 问题定义

### 1.1 “3 秒”的起止点

若不先统一口径，“连接耗时”将无法比较。建议记录以下时间点：

| 时间点 | 含义 |
| --- | --- |
| `T0` | SDK 收到连接请求 |
| `Tscan` | 首次扫描到目标设备；已知且可直连时可为空 |
| `Tconnected` | 收到 `onConnectionStateChange(..., STATE_CONNECTED)` |
| `Tservices` | 收到成功的 `onServicesDiscovered` |
| `Tnotify` | 必要通知/指示的 CCCD 写入成功 |
| `Tready` | 设备协议握手、鉴权或初始化完成，可以收发业务数据 |

本文默认以 **`Tready - T0 <= 3 秒`** 作为“3 秒业务就绪”的完整目标。如果产品只要求 `Tconnected - T0 <= 3 秒`，必须明确标注为“GATT 已连接”，不能称为“设备已可用”。

### 1.2 “多并发”的口径

“多并发”必须附带设备数 `N`。Android 官方公开 API 支持查询多个 GATT 连接，但未对所有 Android 设备承诺统一的最大并发数量。因此不采用“Android 固定最多连接 7/15/20 台”等未经官方保证的数字。

建议首轮按 `N = 1 / 2 / 3 / 5` 分档测试，再根据目标机型实测结果确定生产配置；连接窗口应可配置，不应无限制同时调用 `connectGatt()`。

### 1.3 测试场景

必须区分以下场景，不能将其中某一种结果外推为全部场景：

- 已知地址直连 / 先扫描再连接；
- 外设已唤醒并持续可连接广播 / 休眠或未广播；
- 冷连接 / 已连接后的业务恢复 / 断线重连；
- 已配对 / 首次配对或需要用户确认；
- 前台 / 后台；
- 强、中、弱信号及不同干扰环境。

## 2. 举证：为什么“多设备并发连接”可行

### 2.1 Android API 具备多 GATT 设备管理能力

Android `BluetoothManager.getConnectedDevices(BluetoothProfile.GATT)` 返回 GATT Profile 下的已连接设备列表，`getDevicesMatchingConnectionStates(...)` 也返回多个符合状态的设备。这证明 Android API 模型允许同时管理多个 GATT 设备，而非只允许单设备连接。

官方依据：[Android `BluetoothManager`](https://developer.android.com/reference/android/bluetooth/BluetoothManager#getConnectedDevices(int))。

需要限定的是：该 API 证明的是“支持多个”，**不代表官方承诺任意并发数量或特定连接时延**。

### 2.2 每个设备可拥有独立 GATT 会话和异步回调

`BluetoothDevice.connectGatt()` 为目标设备创建 `BluetoothGatt` 客户端，连接结果及后续 GATT 操作由 `BluetoothGattCallback` 异步返回。API 26 的重载允许指定 `Handler`，新 API 还支持显式 `Executor`，因此应用能够隔离不同设备的回调处理与业务状态。

官方依据：

- [连接到 GATT 服务端](https://developer.android.com/develop/connectivity/bluetooth/ble/connect-gatt-server)
- [`BluetoothDevice.connectGatt`](https://developer.android.com/reference/android/bluetooth/BluetoothDevice#connectGatt(android.content.Context,boolean,android.bluetooth.BluetoothGattCallback,int))

线程隔离能减少应用层相互等待，但这里的“回调并行”不等于蓝牙控制器能让全部无线过程同时完成。

### 2.3 项目已有优化证明应用层阻塞值得治理

项目 SDK 历史版本已进行以下优化：

- `0.9.394`：将 GATT 30 秒超时提前至 8 秒处理；
- `0.9.394`：单设备 `IoQueue` 独享线程，多设备线程互不 `delay`；
- `0.9.300`：BLE 重连使用独立线程处理，并规范连接/断开调用线程。

这些记录说明项目过去确实存在多设备共享队列导致互相阻塞的风险，按设备隔离队列有实际价值。它们只能证明优化方向合理，不能直接证明“3 秒必达”。项目依据：[Android SDK 历史版本说明](../../yasee_android/download.md)。

## 3. 质证：为什么不能承诺所有设备 3 秒内就绪

### 3.1 连接流程是多阶段异步链路

`connectGatt()` 的连接结果通过回调异步返回；连接后仍需调用异步的 `discoverServices()`，随后通常还要启用通知、写入 CCCD，并执行厂商协议握手。`onConnectionStateChange(STATE_CONNECTED)` 只代表 GATT 连接状态变化，不代表服务发现和业务初始化已经完成。

官方依据：

- [`BluetoothGatt.discoverServices()`](https://developer.android.com/reference/android/bluetooth/BluetoothGatt#discoverServices())：明确说明服务发现为异步操作，完成后触发 `onServicesDiscovered`；
- [`BluetoothGattCallback`](https://developer.android.com/reference/android/bluetooth/BluetoothGattCallback#onConnectionStateChange(android.bluetooth.BluetoothGatt,int,int))：连接状态、服务发现、描述符写入均为不同回调。

**质证结论：**只测到 `Tconnected` 会低估真实可用时间，3 秒验收必须明确是否包含 `Tservices`、`Tnotify` 和 `Tready`。

### 3.2 扫描发现时间不可由 App 单方面控制

BLE 扫描结果通过 `ScanCallback` 异步返回，能否及时发现设备取决于外设是否广播、广播周期、手机扫描调度、权限、位置/附近设备设置、信号与干扰。Android 官方建议找到目标后立即停止扫描、不要循环扫描并为扫描设置时限；官方示例中的 10 秒只是示例超时，并非系统规定的扫描耗时。

官方依据：

- [Android：查找 BLE 设备](https://developer.android.com/develop/connectivity/bluetooth/ble/find-ble-devices)
- [AOSP：Bluetooth Low Energy](https://source.android.com/docs/core/connect/bluetooth/ble)

**质证结论：**若 `T0` 从“开始扫描”计算，外设休眠、广播间隔较长或弱信号时不能保证 3 秒；已知地址、目标正在可连接广播时成功概率更高。

### 3.3 系统栈和控制器是共享资源，存在拥塞与超时

Android 定义了 `GATT_CONNECTION_CONGESTED`，明确表示远端设备连接可能拥塞；也定义了 `GATT_CONNECTION_TIMEOUT`，说明设备超出范围或未作为可连接设备广播时可能超时。应用创建更多线程不会增加手机蓝牙控制器、射频时隙或系统 GATT 栈容量。

官方依据：[`BluetoothGatt` 状态码](https://developer.android.com/reference/android/bluetooth/BluetoothGatt)。

**质证结论：**多线程只能处理 CPU 侧工作，不能把系统与无线链路变成无限并行。过度同时发起连接反而可能放大拥塞，应通过连接窗口限流。

### 3.4 协议参数存在较大合法范围

Android `onConnectionUpdated` 文档给出的连接间隔合法范围为 7.5 ms～4000 ms，监督超时范围为 0.1 s～32 s。`requestConnectionPriority(HIGH)` 只是请求低延迟连接参数，官方建议仅在快速传输大量数据时使用，并在完成后恢复 `BALANCED`；`setPreferredPhy()` 也只是建议，实际是否切换取决于双方能力，控制器可覆盖设置。

官方依据：

- [`BluetoothGattCallback.onConnectionUpdated`](https://developer.android.com/reference/android/bluetooth/BluetoothGattCallback#onConnectionUpdated(android.bluetooth.BluetoothGatt,int,int,int,int))
- [`BluetoothGatt.requestConnectionPriority`](https://developer.android.com/reference/android/bluetooth/BluetoothGatt#requestConnectionPriority(int))
- [`BluetoothGatt.setPreferredPhy`](https://developer.android.com/reference/android/bluetooth/BluetoothGatt#setPreferredPhy(int,int,int))

**质证结论：**官方 API 没有给出 3 秒完成上界，“高优先级”与“首选 PHY”也不能作为 3 秒保证手段。

### 3.5 Android 硬件与厂商实现存在差异

AOSP 明确指出 BLE 使用依赖设备芯片支持，扫描过滤等能力也与控制器/固件实现相关。不同 SoC、Android 版本、厂商蓝牙栈和功耗策略会造成连接数量、调度及后台表现差异；外设自身还可能限制可同时连接的 central 数量。

官方依据：[AOSP：Bluetooth Low Energy](https://source.android.com/docs/core/connect/bluetooth/ble)。Bluetooth 技术与互操作性的规范入口见 [Bluetooth SIG Core Specification 6.1](https://www.bluetooth.com/specifications/specs/core-specification-6-1/)，该入口同样未给出适用于所有 Android 与外设组合的“3 秒业务就绪”承诺。

**质证结论：**单一手机、单一外设的一次成功不能证明跨机型 SLA；必须使用机型和外设矩阵做统计验证。

### 3.6 资源未及时释放会降低后续连接稳定性

Android 官方要求不再使用 GATT client 时尽早调用 `close()`。仅调用 `disconnect()`、未处理超时/取消路径或保留失效 `BluetoothGatt`，可能造成资源长期占用。

官方依据：

- [Android：关闭 GATT 连接](https://developer.android.com/develop/connectivity/bluetooth/ble/connect-gatt-server#close-gatt)
- [`BluetoothGatt.close()`](https://developer.android.com/reference/android/bluetooth/BluetoothGatt#close())

**质证结论：**3 秒优化不能只关注“发起连接”，还必须确保失败、取消和断开路径最终释放资源。

## 4. 裁定与适用边界

| 场景 | 3 秒目标判断 | 说明 |
| --- | --- | --- |
| 已知设备地址、外设已唤醒且正在可连接广播、近距离、少量设备 | **可作为高概率 SLO** | 仍需目标机型实测，不能写成系统保证 |
| 已扫描到目标后开始计时 | **比全流程更可控** | 必须注明不包含扫描耗时 |
| 从启动扫描到业务就绪 | **可以优化，不能硬保证** | 发现时间受外设广播与环境影响 |
| 外设休眠、未广播、超距或弱信号 | **不可承诺** | App 无法单方面建立连接 |
| 首次配对或需要用户操作 | **不可承诺** | 存在系统交互及不确定等待 |
| 大量设备同时连接 | **需分档实测** | 官方没有统一最大并发数或时延保证 |
| 后台、锁屏或厂商严格省电模式 | **需单独验收** | 调度和进程存活受系统策略影响 |

最终产品口径建议为：

> 在约定手机与外设矩阵、设备已唤醒且可连接、指定信号范围和并发数 `N` 下，以 `Tready - T0` 统计 3 秒达标率；目标值以压测基线评审后确定。异常场景进入超时、重试或用户引导，不承诺跨设备 100% 达标。

## 5. 重构方案

### 5.1 架构原则

```mermaid
flowchart TD
    API[业务连接请求] --> Manager[Devices]
    Manager --> Coordinator[BlesLinkScheduler<br/>去重、优先级、并发窗口]
    Coordinator --> L1[BleDevice A]
    Coordinator --> L2[BleDevice B]
    Coordinator --> LN[BleDevice N]
    L1 --> S1[BleDeviceLinkQueue A<br/>设备内串行]
    L2 --> S2[BleDeviceLinkQueue B<br/>设备内串行]
    LN --> SN[BleDeviceLinkQueue N<br/>设备内串行]
    
    S1 --> Q1[BleDeviceQueue A<br/>设备内串行]
    S2 --> Q2[BleDeviceQueue B<br/>设备内串行]
    SN --> QN[BleDeviceQueue N<br/>设备内串行]
    Q1 --> Stack[Android Bluetooth Stack / Controller]
    Q2 --> Stack
    QN --> Stack

    N["📝 备注：这里需要注意 Devices 为设备管理统筹"]:::note
    classDef note fill:#fff3cd,stroke:#ffc107,color:#856404,stroke-dasharray: 5 5
```

- **多设备之间并行：**每个设备持有独立 `BleDeviceQueue`、`BluetoothGatt` 和操作队列，避免设备 A 的延迟阻塞设备 B。
- **单设备内部串行：**服务发现、MTU、通知描述符、read/write 等按回调逐项推进，不应对同一个 GATT 无序多线程调用。
- **全局连接限流：**`BlesLinkScheduler` 只允许可配置数量的连接尝试同时在途；剩余请求按优先级排队。
- **状态唯一来源：**回调只投递标准化事件，由 BlesLinkScheduler 决定下一步，避免回调线程直接修改多处共享状态。

### 5.2 组件职责

#### `Devices`

- 使用稳定设备标识维护 `sessionMap`；
- 对重复连接请求去重，并复用同一 in-flight 结果；
- 对外输出连接阶段、失败原因和阶段耗时；
- 统一处理蓝牙关闭、权限丢失及 SDK 生命周期。

#### `BlesLinkScheduler`

- 管理可配置的连接窗口，不无限并发调用 `connectGatt()`；
- 支持业务优先级、公平调度和取消排队请求；
- 根据机型和压测结果调整窗口，不在代码中假定 Android 固定并发上限；
- 扫描时使用 `ScanFilter` 尽快筛选目标，全部目标发现后停止扫描。

#### `BleDevice`

每个设备采用独立状态机：

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Scanning: 需要扫描
    Idle --> Connecting: 已知且可直连
    Scanning --> Connecting: 发现目标
    Connecting --> Discovering: GATT connected
    Discovering --> Subscribing: services discovered
    Subscribing --> Handshaking: notifications ready
    Handshaking --> Ready: protocol ready
    Scanning --> Failed: timeout/error
    Connecting --> Failed: timeout/error
    Discovering --> Failed: timeout/error
    Subscribing --> Failed: timeout/error
    Handshaking --> Failed: timeout/error
    Ready --> Disconnecting: disconnect/cancel
    Failed --> Closing
    Disconnecting --> Closing
    Closing --> Idle: GATT closed
```

要求：

- 每次尝试带 `attemptId`，忽略旧连接的迟到回调；
- 连接式 BLE 设备在适用 API 上显式使用 `TRANSPORT_LE`，避免双模设备的 transport 歧义；
- 对扫描、连接、服务发现、订阅、握手分别设置阶段超时；
- 任意失败、取消和断开路径最终执行 `disconnect()`（适用时）与 `close()`；
- 重试采用有界指数退避并加入随机抖动，避免多设备同步重试形成尖峰；
- 已 `Ready` 的设备不要因新的批量连接请求被重复初始化。

#### `BleDeviceQueue`

- 同一设备同一时间只允许一个需要回调确认的 GATT 操作在途；
- 收到对应回调后再推进下一项，并校验操作类型、UUID 与 `attemptId`；
- 每项操作独立超时，不使用全局 sleep 阻塞其他设备；
- Android 33+ 优先使用带 `byte[] value` 的新读写 API，避免可变 characteristic value 带来的竞态；
- `requestConnectionPriority(HIGH)` 仅在确有快速初始化/传输需要且设备支持时短时请求，完成后恢复 `BALANCED`。

### 5.3 线程模型

建议使用“**状态串行化，而不是线程数量最大化**”：

- 每个 Gatt 的状态转换在固定串行执行器 IoQueue 中完成；
- 不同 Gatt 可并发运行；肥胖等级
- 
- GATT 回调快速封装为不可变事件后投递，不在回调中执行算法、JSON 解析或磁盘 I/O；
- CPU 密集解析进入共享有界计算线程池，日志/文件操作进入 I/O 池；
- 主线程只承担系统 API 要求或 UI 事件分发，不执行阻塞等待；
- 线程池、队列和重试均设置上限，避免设备数增大时线性创建无限线程。

## 6. 3 秒性能预算

预算用于定位瓶颈，不是官方时限。建议首先分别统计“已扫描到目标后”和“包含扫描”的两套指标。

| 阶段 | 记录指标 | 优化方向 |
| --- | --- | --- |
| 扫描发现 | `Tscan - T0` | 已知设备按产品能力选择直连；使用过滤器；目标齐全后立即停扫 |
| GATT 连接 | `Tconnected - Tscan/T0` | 去重、适度连接窗口、外设预唤醒、显式 LE transport |
| 服务发现 | `Tservices - Tconnected` | 避免重复发现；校验缓存/Service Changed 行为 |
| 通知订阅 | `Tnotify - Tservices` | 单设备队列串行；只订阅必要特征；逐项确认 CCCD 写入 |
| 业务握手 | `Tready - Tnotify` | 减少非必要指令与固定 delay；使用回调/协议事件推进 |
| 总耗时 | `Tready - T0` | 按设备数、机型、场景统计 P50/P95/P99 与达标率 |

禁止为了“看起来小于 3 秒”而把 `STATE_CONNECTED` 提前映射为业务 `Ready`。如阶段超过预算，应上报具体阶段和原因，而不是统一记为“连接失败”。

## 7. 可观测性与错误归因

每次连接至少记录：

- 匿名化设备标识、设备型号/协议、手机型号、Android 版本、App/SDK 版本；
- 是否需要扫描、前后台、是否已配对、连接窗口大小、尝试序号；
- `T0/Tscan/Tconnected/Tservices/Tnotify/Tready`；
- 扫描 RSSI、GATT `status/newState`、失败阶段、超时类型；
- 主动取消、蓝牙关闭、权限缺失、外设未广播、拥塞、系统超时等标准化原因；
- 每轮开始和结束时的活跃 session/GATT 数，便于发现资源泄漏。

日志中的 MAC、用户信息等应脱敏；性能统计按阶段聚合，不能只统计成功样本。

## 8. 验证与验收

### 8.1 测试矩阵

| 维度 | 建议覆盖 |
| --- | --- |
| 并发设备数 | `1 / 2 / 3 / 5`，生产上限由结果决定 |
| 连接类型 | 冷连接、断线重连、已连接恢复 |
| 发现方式 | 已知地址/设备对象、从扫描开始 |
| 外设状态 | 已唤醒可连接、休眠后唤醒、不可连接 |
| App 状态 | 前台、后台、锁屏恢复 |
| 信号 | 强/中/弱 RSSI；有/无 2.4 GHz 干扰 |
| 配对 | 已配对、未配对、配对信息失效 |
| 手机 | Pixel、Samsung、小米、OPPO、vivo 等目标主流机型及最低 Android 版本 |
| 规模 | 每个核心组合至少 100 轮；稳定性场景建议 1000 轮或持续压测 |

### 8.2 指标

- `Tconnected - T0` 与 `Tready - T0` 的 P50/P95/P99；
- 单设备与“本批全部设备”3 秒达标率；
- 首次成功率、最终成功率、平均重试次数；
- 各阶段超时率及 GATT 状态码分布；
- 并发数增加后的耗时退化曲线；
- 断开后资源回收成功率、长稳内存/线程/GATT 数量；
- 对其他已连接设备的数据吞吐、丢包和测量流程影响。

### 8.3 验收门槛

当前没有目标机型与外设的基线数据，因此本文不虚构具体达标率。建议流程：

1. 先按上述埋点采集现状基线；
2. 产品、客户端、SDK 与测试共同确定核心场景和目标并发数 `N`；
3. 根据基线确定 P95、P99、3 秒达标率和最终成功率门槛；
4. 将非受控场景单列为降级指标，不纳入“3 秒硬保证”；
5. 重构前后使用同一矩阵、同一外设固件和同一环境做对照测试。

## 9. 风险与降级策略

| 风险 | 降级或处理 |
| --- | --- |
| 3 秒内未就绪 | UI 展示当前阶段，后台继续到业务超时；不要立即判定永久失败 |
| 外设未广播/休眠 | 提示唤醒、靠近设备或检查占用情况 |
| 并发拥塞 | 动态缩小连接窗口，将剩余设备排队 |
| 弱信号或反复断开 | 有界退避重试；达到阈值后提示用户干预 |
| 首次配对 | 单独进入配对流程，不纳入无交互 3 秒 SLO |
| 后台限制 | 前台服务等方案需结合具体业务和 Android 政策单独设计 |
| 外设仅允许单 central | 明确提示设备被占用；不能通过 App 多线程绕过 |
| GATT 资源异常 | 取消当前 session，完整 `close()` 后再按退避策略重建 |

## 10. 结论

1. **能力可行：**Android GATT API 支持多个已连接设备，每个设备可建立独立会话，项目已有按设备隔离队列的优化基础。
2. **时间不可硬保证：**扫描、连接、服务发现、通知订阅和业务握手均为异步阶段；系统栈、控制器、射频环境、Android 厂商实现及外设状态都不由应用线程完全控制。
3. **重构有价值：**每设备独立状态机与操作队列可以消除 SDK 自身阻塞；全局连接协调器可避免过度并发造成拥塞。
4. **3 秒应作为受控 SLO：**明确 `N`、起止点、目标机型、外设状态与环境，通过 P50/P95/P99、达标率和错误分布验收，不能宣传为全 Android 平台硬 SLA。

## 11. 官方与权威资料

- Android Developers：[Connect to a GATT server](https://developer.android.com/develop/connectivity/bluetooth/ble/connect-gatt-server)
- Android Developers：[Find BLE devices](https://developer.android.com/develop/connectivity/bluetooth/ble/find-ble-devices)
- Android API：[`BluetoothDevice.connectGatt`](https://developer.android.com/reference/android/bluetooth/BluetoothDevice#connectGatt(android.content.Context,boolean,android.bluetooth.BluetoothGattCallback,int))
- Android API：[`BluetoothGatt`](https://developer.android.com/reference/android/bluetooth/BluetoothGatt)
- Android API：[`BluetoothGattCallback`](https://developer.android.com/reference/android/bluetooth/BluetoothGattCallback)
- Android API：[`BluetoothManager`](https://developer.android.com/reference/android/bluetooth/BluetoothManager)
- AOSP：[Bluetooth Low Energy](https://source.android.com/docs/core/connect/bluetooth/ble)
- Bluetooth SIG：[Core Specification 6.1](https://www.bluetooth.com/specifications/specs/core-specification-6-1/)
