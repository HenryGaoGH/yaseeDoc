---
title: iOS端蓝牙重连补偿
description: iOS端蓝牙重连,iOS重连限制,
keywords: [欢迎, Yasee, 同事, 领导, SDK, 集成, BLE, 重连, 限制, iOS, 卸载重装]
---

import Tag from '@site/src/components/Tag';
import ImgText from '@site/src/components/ImgText/ImgText';



## 问题分析

目前,针对已知的系统级的差异, 在iOS端设备中存在某些限制(隐私防护更为严格):
1. MAC地址 不允许访问
2. <Tag text="极端情况" color="red" /> 重连机制受限

本次的方案, 重点关注 极端情况下的 重连问题; 目前的极端情况在 [iOS 极端情况说明](../../yasee_ios/used_doc.md#导读) 有介绍;

在这里,简单回顾下几种情况:

- **外设**
    - 外设原因, 外设通过升级固件、设置了动态MAC的隐私机制; 会导致无法重连情况 
	- RPA（Resolvable Private Address）支持, 是 BLE协议中 重要的隐私保护增强手段.(目前咱们的外设是不支持)

- **iOS设备**
    - iPhone手机重启手机或者蓝牙重启的情况, (极少数情况,目前Apple也没有具体的情况说明)
        - **正常的重启手机 和 蓝牙重启是不会出现的**
    - 系统蓝牙栈缓存数据因蓝牙模块Crash、系统异常重建被清除时, (极少数情况下, 目前Apple也没有具体的情况)


对于,目前客户提出的连接不上的情况, 需要澄清的是, 程序问题导致的重连不上, 并非是达到了上述iOS的重连限制. 本次的方案, 重点关注的是这个极端情况下的重连限制.


## 推荐的最佳实践做法

目前iOS提供有限的ble 连接措施. 并遵循重连的受限机制. 按照Apple 的最佳实践, 可以使用搜索设备重新连接的方式作为 **最终重连补偿**.

并且遵循以下流程(流程需合理控制功耗和无线电使用):
![iOS端重连最佳实践](/img/inner/ios_reconnect_best_way.png)



## 方案
目前,依照 Apple 的 ble 重连最佳实践, 方案有且只有一个:
- **增加 重新扫描连接设备的 补偿方案.**

并遵循 Apple 最佳实践做法, 合理控制 无线电波和功耗情况; 结合App的具体使用方式来进行.

在以下情况进行自动重新连接:
-  现流程 (回顾)
	1. 冷启动
	2. 蓝牙开关
	3. 权限开关

- 增加流程
	1. 重新连接 - 完整扫描周边设备,

触发条件:

用户点击**重新连接**, 会触发重新扫描周边设备, 重新连接. (目前只有iOS端有这个操作), Android端 点击 **重新连接** 保持现状不做修改

:::info
为什么选择让用户自动点击 重新连接?  
因为重连过程决定因素很多. 如遇一下情况并不是因为iOS设备的重连限制, 只是因为其他原因导致:
- **主机关机状态**
- **主机被别人连接了**
- **主机出现异常了**
:::

调整后流程为:
<ImgText src="/img/inner/ios_reconnnect_best_way_progress.png" text="<br/>1. 首先, iOS SDK级别增加 根据设备名称(广播名称、MAC)进行重新连接的方法.
<br/><br/>2. Flutter端增加 判定设备逻辑, 如iOS设备则 触发重新扫描周边设备, 重新连接的逻辑.
<br/><br/>3. iOS端 连接并更新设备RemoteID" width={600} />






## 调研参考文献
[ADG 白皮书](https://developer.apple.com/accessories/Accessory-Design-Guidelines.pdf)
、[CBperipheral](https://developer.apple.com/documentation/corebluetooth/cbperipheral)
、[CoreBluetouch](https://developer.apple.com/library/archive/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/BestPracticesForInteractingWithARemotePeripheralDevice/BestPracticesForInteractingWithARemotePeripheralDevice.html#//apple_ref/doc/uid/TP40013257-CH6-SW9)

