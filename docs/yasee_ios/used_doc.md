---
sidebar_position: 2
---

import ImgText from '@site/src/components/ImgText/ImgText';

# 使用文档
--- 

## 导读
本篇文章将带领大家一起集成 iOS 端的Yasee SDK, 如果想要了解更多Yasee SDK支持的功能;请查阅 [完整的功能清单](./menu.md),来了解支持的功能.\
如果您关注的是Android设备的对接,请移步[Android对接文档](../yasee_android/intro.md).\
那么接下来我将带大家一起了解和使用Yasee SDK iOS端对接步骤和注意事项, Let's go!

:::danger
在iOS系统中,因为隐私防护的原因,无法获取到物理设备的真实MAC地址,可通过在广播数据中提供! 其次,也是因为隐私防护政策,连接外设 使用的是系统编排的UUID字符串(效果等同于MAC),

因此自动重连的稳定性不如Android.主要原因为Remote ID 过期或无效:
1.	外设设备重置或固件更新：如果设备的固件进行了更新或设备被重置，设备的某些内部参数可能会改变，这可能导致 UUID 发生变化。
2.	系统重启或蓝牙重启：在极少数情况下，如果设备的操作系统重启或蓝牙模块重新启动，之前存储的 UUID 可能会变得无效或不再可用。
3.	设备长时间不活跃：如果某个设备在很长一段时间内不被使用，它的缓存信息可能会被系统清除，从而导致 UUID 无法再次被恢复使用。
4.	与系统缓存相关的问题：iOS 系统可能会对一些设备信息进行缓存，尤其是在 CoreBluetooth 中。当系统缓存数据被清除时，存储的 UUID 可能会失效。
5.	外设的 MAC 地址改变：虽然在 BLE 连接中不直接使用 MAC 地址，但一些底层实现可能依赖于设备的 MAC 地址进行标识。如果设备的 MAC 地址改变（例如在某些硬件配置下发生变化），可能会导致对应的 UUID 也随之改变。
:::


## 准备工作
[iOS 完整 Api 文档](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios "Api 文档")
:::warning
这部分的内容是必须的! 


在没有事例的情况下,可以查阅 [详细的Api文档](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios)
:::

首先,Yasee SDK 对接需要完成以下不部分的声明和要求:
- 手机系统版本
```
需要系统在 iOS 13.0 及以上(目前最新的版本为iOS18)
```
- 必要权限
```
// 这里只列出键
Privacy - Bluetooth Always Usage Description
Privacy - Bluetooth Peripheral Usage Description
NSBluetoothWhileInUseUsageDescription
```
- 后台模式 (可选)

    需要设置 Background Modes


- [隐私权先声明 (Apple 24/5/1 正式实施)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)
<table>
<thead>
<tr>
<th>Type</th>
<th>Reasons</th>
<th>SDK使用原因</th>
</tr>
</thead>
<tbody>
<tr>
<td>User Defaults</td>
<td>CA92.1: Access info from same app, per documentation</td>
<td>用于缓存蓝牙扫描到的设备信息，以加快连接</td>
</tr>
<tr>
<td>File Timestamp</td>
<td>C617.1: Inside app or group container, per documentation</td>
<td>使用stat函数获取SDK日志文件的大小和时间，以达到自动清除SDK日志文件</td>
</tr>
<tr>
<td>System Boot Time</td>
<td>35F9.1: Measure time on-device, per documentation</td>
<td>使用mach_absolute_time函数，用于记录输出日志的时间</td>
</tr>
</tbody>
</table>


## 大纲
接下来,我们将分为以下几个步骤,带领您集成、以及使用Yasee 官方 SDK.
- 准备工作
  - 声明权限
- 初始化 Yasee SDK
  - 蓝牙配置信息 (``BleConfig``)
  - 人员配置信息 (``User``)
- 蓝牙相关操作
  - 搜索 Yasee 设备
  - 连接 Yasee 设备
  - 获取 设备 支持 检测项
  - 获取 检测项 支持的 指令
  - 收发 与 外设的 双向指令
- 数据通知相关
  - 设备连接 通知 
  - 设备收发信息通知
  - 设备 绑定 变更通知

## 正式开始
对于一个SDK而言,👉[**完整的Api文档**](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios)👈是必不可少的.\
在处理异常和参数理解上有重要的意义,
因此, SDK在使用中会有可视化的参数提示,如:
<ImgText width={100} src="/img/ios_alert_used.png" text="在编码过程中,可以查看详细的参数信息<br>以及对每一个参数的具体说明" />
得益于swift强大的异常处理能力,在swift中您有多重方式来避免您的程序出现异常情况:
``` swift
// 空值判断
if value == nil { return }

// 可选拆包
if case let ok = Bool? {}

// guard解包
guard let value = T? else { return }


// do 异常捕获
do {
    // 概率下可存在 奔溃的情况
} catch let err {
    // 失败的逻辑处理
}
```

### 初始化 Yasee SDK
初始化操作是必须要做的操作,iOS支持一步初始化,只需要 一步即可初始化完成.\
集成Yasee SDK第一步 却是以下内容步.
```swift
// 初始化 Yasee | 默认只需要这一步就可以初始化完成啦
let _ = Yasee.single

/// 设置搜索自动暂停的时间 (秒级) | 可选默认是 10秒
Yasee.single.bleConfig.scanTime = 5
/// 是否重连 (Boolean) | 可选默认是true
Yasee.single.bleConfig.reconnect = true

/// 设置人员信息
/// 设置当前的使用人, 
/// 主要是为了 肺功能 和 体脂上的人员信息设置 
/// User(Integer sex(1-男,2-女), Integer age, Integer smoking(1-抽,0-不), Integer height(cm), Integer weight(kg))
Yasee.single.currentUser = User(sex: 1, age: 24, smoking: 1, height: 178, weight: 65)
```
对于事例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [User](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios/user "详细了解")
- 详细请点击 [BleConfig](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios/bleconfig "详细了解")

:::warning
设置当前的人员信息,主要的功能是为了 肺功能 和 体脂中的人员信息设置! 如果没有这两种检测项的测量可忽略
:::


### 蓝牙相关操作
蓝牙相关的步骤,比较固定,基本包含 搜索、连接、发送信息
```swift
// 搜索蓝牙
Yasee.single.scan()

// 连接设备
(device as BleDevice).connect();

// 断开设备
(device as BleDevice).cancel()

//获取 设备 支持的 检测项列表
let cheks: [Check] = (device as BleDevice).supportChecks

//获取 检测项 支持的 指令
let cheks: [Cmd] = (check as Check).cmds

// 收发 与 外设的 双向指令
try? device.send(cmd.unsign) // 发送 接收使用 Notify 通知

```
对于事例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [BleDevice](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios/bledevice "详细了解")
- 详细请点击 [Check](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios/check "详细了解")
- 详细请点击 [Cmd](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios/cmd "详细了解")



### 通知相关内容
所有的有关Yasee SDK 的 通知 和 数据交互,都是通过 Notify来处理的,包含但未来不限于:
- [x] 设备的绑定与解绑 (``NotifyBleDevice``)
- [x] 设备的连接与断开 (``NotifyLink``)
- [x] 设备的通讯数据  (``NotifyDeviceData``)

首先我们需要了解的是通知的类型,只有了解了通知的类型才能更好的监听来自SDK的各类信息通知:
```swift 
/// 通知的类型
enum NotifyType : String {
    /// 设备蓝牙状态
    case bleState
    /// 设备搜索列表
    case searchDevices
    /// 设备绑定列表
    case bindDevices
    /// 设备连接状态
    case deviceLink
    /// 设备传输数据
    case deviceData
}

// 获取蓝牙状态
let call : NotifyCall<NotifyBleState> = { res in 
    // 处理蓝牙状态信息
}
Notify.single.listen(call)


// 获取 外设 交互信息
let call : NotifyCall<NotifyDeviceData> = { res in 
    // 处理 外设 交互信息
}
Notify.single.listen(call)


// 获取 外设 交互信息
let call : NotifyCall<NotifyDeviceData> = { res in 
    // 处理 外设 交互信息
}
Notify.single.listen(call)


```


### 设置默认的绑定列表
Yasee SDK 支持 初始化绑定列表,并根据初始化的设备列表进行**自动连接操作**;首先我们需要获取一个``[BleDecive]``对象;
:::warning
自动连接功能取决于初始化设备的设置,由BleConfig中的reconnect字段控制,如果需要设置自动连接,需要配置此属性,默认情况不支持自动连接!!
:::

以下为设备初始化:
```swift
/// lds 为 持久化的数据
do {
    let jdds = try JSONDecoder().decode([BleDevice].self, from: lds)
    dds.initDevice(jdds)
} catch let err {
    print("Yasee-SDK: 错误: \(err.localizedDescription)")
}


/// 获取 设备管理对象
let single = Devices.single


/// 设置初始化 默认的设备,此操作可以让设备进入自动连接(前提是配置了自动连接)
single.initDevice([BleDevice]);


```
对于事例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [Devices](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios/devices "详细了解")



## 大功告成!
请敬请探索 Yasee 为您带来的丰富功能吧~

如果需要更多功能实现,可查阅 [iOS 完整 Api 文档](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios "Api 文档")