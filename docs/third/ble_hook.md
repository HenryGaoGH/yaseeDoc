---
sidebar_position: 2
---

import Tag from '@site/src/components/Tag';
import ImgText from '@site/src/components/ImgText/ImgText';


# 有限BLE交互流程Hook
---

如果还不了解, 生态合作伙伴模块的逻辑流程请阅读 [Yasee SDK 生态合作伙伴模块(协议模块) 理念剖析](yasee_third_process.md),先了解设计理念有助于更好的集成.

:::warning
目前非必需的情况下 Yasee 推荐 使用 **协议方式** 对接
:::


## 概要说明
对于 Hook 的方式, Yasee 提供了 **有限的 BLE 操作回调** <sup>⚠️</sup>,因此 接下来将带方案商们来见证在此规则下的 <Tag text="最佳实践" /> 策略
:::warning
有限的 BLE 操作回调:

仅限于Gatt连接成功后的操作内容,因为 生态合作伙伴无权操作设备的连接、断开以及重连过程!!

还需要注意 iOS 和 Android的方法、以及调用差异, 总结来说 就是 外设连接成功之后的hook内容
:::
目前有限的 BLE Hook包含以下内容:
- 发现服务
- 发现特征
- 获取 特征 值变化更新
- 设置状态更新

等等一系列 连接成功之后的协议内容, 因此也就意味着 方案商需要对HOOK的回调内容做响应, 以及调用 特征、服务的发现时机; Notify设置通知;数据发送等逻辑的处理.


## 流程图鉴
<ImgText src="/img/hook_process.png" />

## 示例展示和说明

当选择 Hook 方式, 方案商们需要接管设备连接成功之后的所有步骤, 包括但不限于:
1. 发现特征(需要合适的时机调用,并传递服务信息)
2. 主动 设置 读、写、通知等等一系列属性

Yasee Hook部分逻辑:
```swift 
/// 获取到 服务
public func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: (any Error)?) {
    // Yasee 方 通知 方案商
}

/// 获取到 特征
public func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: (any Error)?) {
    // Yasee 方 通知 方案商
}

/// 获取到值变化
public func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: (any Error)?) {
    // Yasee 方 通知 方案商
}

/// 设置 通知之后
public func peripheral(_ peripheral: CBPeripheral, didUpdateNotificationStateFor characteristic: CBCharacteristic, error: (any Error)?) {
    // Yasee 方 通知 方案商
}
... 等等Hook
```

方案商需要处理的部分:
1. 获得全部services 之后处理自己的业务逻辑
2. 主动请求 设置 特征, 并携带 业务服务信息
3. 主动请求 设置 读、写、通知等等一些列内容, 并携带业务信息
4. 通道建立成功, Yasee 转发外设数据, 方案商处理业务数据
5. 主动发送结果 给 Yasee