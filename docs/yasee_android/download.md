import Tag from '@site/src/components/Tag';

# 资源下载
---
:::info

包含了以下内容:

- [x] SDK(AAR)文件
<!--- [x] DEMO 工程文件-->
- [x] DEMO APK 文件
:::

---


## SDK-最新版本
**建议对接前使用 Demo 体验或者查阅本文档**

### [点击下载: 0.9.395](/files/aar_0_9_395/aar/yasee-release.aar)

#### 更新内容
- <Tag text="新增" color="green" /> 增加混淆注入规则
- <Tag text="优化" color="orange" /> Demo 优化 ECG 三导数据的独立展示
- <Tag text="优化" color="orange" /> 优化心电多通道独立数据处理
- <Tag text="新增" color="green" /> 增加 ECG 解析策略，实现多端对齐

---

## SDK-历史版本

### [点击下载: 0.9.394](/files/aar_0_9_394/aar/yasee-release.aar)

#### 更新内容

##### 设备与协议支持
- <Tag text="新增" color="green" /> 增加对 YB15B 设备的支持
- <Tag text="新增" color="green" /> 支持 EPC01 心电设备
- <Tag text="新增" color="green" /> 增加串口设备的序列化规范
- <Tag text="新增" color="green" /> 增加动态地址类型的序列化与解析
- <Tag text="兼容" color="green" /> 兼容 Android 15 以上的动态地址类型

##### 对码流程
- <Tag text="修复" color="red" /> 修复三合一设备对码无 code 的问题
- <Tag text="优化" color="orange" /> 更新血脂对码错误信息
- <Tag text="优化" color="orange" /> 血脂、糖化在插入流程（83）不再上报 code，统一在 `pwd` 流程上报；三合一设备保持不变

##### 连接与性能
- <Tag text="优化" color="orange" /> 更新设备基类，移除 loop gson
- <Tag text="优化" color="orange" /> 将退避策略的初始延迟缩短为 300ms
- <Tag text="移除" color="red" /> 移除失败次数过多的搜索逻辑
- <Tag text="优化" color="orange" /> 优化连接流程，针对 GATT 30s 超时提前至 8s 处理
- <Tag text="优化" color="orange" /> 单设备 IoQueue 独享线程，多设备线程互不 delay，提升处理速度
- <Tag text="修复" color="red" /> 修复去抖工具在后台线程创建时的异常

##### 构建与依赖
- <Tag text="新增" color="green" /> 增加混淆规则
- <Tag text="升级" color="orange" /> 康云 SDK 升级至版本 11，修复闪光灯偏黄时因要求白底而报错的问题
- <Tag text="其他" color="gray" /> 其他细节优化

### [点击下载: 0.9.384](/files/aar_0_9_384/aar/yasee-release.aar)

#### 优化内容:
- <Tag text="新增" color="green" /> 3导心电断点续测的支持
- <Tag text="优化" color="orange" /> ECG 整合版本（统一调用体验）
- <Tag text="优化" color="orange" /> gson 循环解析（串口设备）
- <Tag text="优化" color="orange" /> 更新康云 SDK，增加对新 opencv 库支持

### [点击下载: 0.9.347](/files/aar_0_9_347/aar/yasee-release.aar)

#### 优化内容:
- <Tag text="优化" color="green" /> 混淆策略更新
- <Tag text="优化" color="green" /> X86 ABI 删减


### [点击下载: 0.9.338](/files/aar_0_9_338/aar/yasee-release.aar)

#### 优化内容:
- <Tag text="优化" color="green" /> 血压错误 Code 对应和解决方案说明~


### [点击下载: 0.9.337](/files/aar_0_9_337/aar/yasee-release.aar)

#### 新增功能:
- <Tag text="增加" color="orange" /> 更新增加 盈养搜索、数据收发、连接等 环节
- <Tag text="增加" color="orange" /> 增加文件压缩工具
- <Tag text="增加" color="orange" /> 增加byte转文件工具
- <Tag text="增加" color="orange" /> 增加CheckDecoder 接口(统一分离检测项解析过程)
- <Tag text="增加" color="orange" /> 增加DecoderRegistry注册解析单元; 减少GC压力
- <Tag text="增加" color="orange" /> 增加 线程模型 & RingBuffer


#### 优化内容:
- <Tag text="优化" color="green" /> split 工具类; 时间复杂度为O(1)
- <Tag text="优化" color="green" /> 更新设备基类减少GC
- <Tag text="优化" color="green" /> 更新蓝牙服务测配置表 & 增加预计算策略
- <Tag text="优化" color="green" /> 优化BleIoQueue数据内容
- <Tag text="优化" color="green" /> 优化串行处理设备的IO操作

#### 删除内容:
- ~**弃用** Stream 高阶方式~
- ~**弃用** 部分类型推断式声明~




### [点击下载: 0.9.300](/files/aar_0_9_300/aar/yasee-release.aar)
新增功能:
- <Tag text="优化" color="green" /> 白细胞 WI-FI新权限声明 
- <Tag text="优化" color="green" /> 设备管理模块 断开、更新、绑定等功能 
- <Tag text="优化" color="green" /> 糖化 错误信息 和 倒计时 
- <Tag text="优化" color="green" /> BLE重连逻辑 (独立线程处理)
- <Tag text="优化" color="green" /> ble 连接&断开操作到 主线程中
- <Tag text="修复" color="red" /> 部分检测项(已知脉诊)byte 转换帧数据不对 crash 问题
- ~**弃用**~ 异步管理器
- <Tag text="优化" color="green" /> 血脂拔条逻辑; 拔出不会报错;并可以继续测量流程
- <Tag text="增加" color="orange" /> 写入响应超时 (send 指令之后 3s内无任何响应; 报错)


---


<!--## Demo-工程

### 最新Demo
- [v0_9_338](/files/demo/0_9_338.zip)

### 历史版本
- [v0_9_337](/files/demo/0_9_337.zip)
- [v0_9_300](/files/demo/android_demo.zip)



----->



## DEMO-APK-下载

### 最新 APK
- [APK-0.9.395](/files/apk_0_9_395/app-release.apk)

### 历史 APK
- [APK-0.9.394](/files/apk_0_9_394/app-release.apk)
- [APK-0.9.338](/files/apk_0_9_338/app-release.apk)
- [APK-0.9.337](/files/apk_0_9_337/app-release.apk)
- [APK-0.9.300](/files/apk_0_9_300/app-release.apk)
