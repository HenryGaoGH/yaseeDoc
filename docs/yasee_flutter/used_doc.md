---
sidebar_position: 1
---

import ImgText from '@site/src/components/ImgText/ImgText';

# 集成文档
--- 


## 导读
本篇文章展示的是Flutter的集成使用,因为 Flutter插件底层是依赖于 iOS 和 Android平台的原生代码,所以对于不同手机系统的限制条件可以去阅读 [iOS使用文档](../yasee_ios/used_doc.md) 和 [Android使用文档](../yasee_android/intro.md)

最后如果想更多了解Api内容 可以查阅 [Yasee Flutter Plugin Api文档](https://doc.yasee.com.cn/flutter_doc/)

其次 Flutter中的Api 完全来之不同的平台原生代码,因此 如有定制化的需求可以阅读相关的原生文档!

## 准备工作
:::warning
准备工作的内容完全需要满足iOS 、Android端的要求.具体请查看 [iOS使用文档](../yasee_ios/used_doc.md) 和 [Android使用文档](../yasee_android/intro.md)!! 
如果想要了解更多的 flutter API 可以查阅 [Yasee Flutter Plugin Api文档](https://doc.yasee.com.cn/flutter_doc/)
:::

## 大纲
接下来,我们将分为以下几个步骤,带领您集成、以及使用Yasee Flutter 版本插件.
- 初始化 Yasee SDK
  - 蓝牙配置信息 (``BleConfig``)
  - 人员配置信息 (``User``)
- 数据通知相关
  - 设备连接 通知 
  - 设备收发信息通知
  - 设备 绑定 变更通知
- 蓝牙相关操作
  - 搜索 Yasee 设备
  - 连接 Yasee 设备
  - 获取 设备 支持 检测项
  - 获取 检测项 支持的 指令
  - 收发 与 外设的 双向指令

## 正式开始
对于一个SDK而言,👉[**完整的Api文档**](https://doc.yasee.com.cn/flutter_doc/)👈是必不可少的.\
在处理异常和参数理解上有重要的意义,
因此, SDK在使用中会有可视化的参数提示,如:
<ImgText width={100} src="/img/flutter_alert_used.png" text="在编码过程中,可以查看详细的参数信息<br>以及对每一个参数的具体说明" />
对于异常处理,在dart中您可以使用try..catch的方式来捕获异常:
``` dart
// 空值判断
if (value == null) { return }

// do 异常捕获
try {
    // 概率下可存在 奔溃的情况
} catch (err) {
    // 失败的逻辑处理
}
```

### 初始化 Yasee SDK
:::warning
对于 Flutter的插件来讲,初始化的步骤已经在 内部实现了, 
使用者可以无需关注插件的初始化步骤!

直接使用提供的Api即可.
:::

### 配置相关的信息
```dart

/// 是否重连 (Boolean) | 可选默认是true  
/// 设置搜索自动暂停的时间 (秒级) | 可选默认是 10秒
Yasee.configBle(reconnect: true,scanTime: 5);


/// 设置人员信息
/// 设置当前的使用人, 
/// 主要是为了 肺功能 和 体脂上的人员信息设置 
/// User(Integer sex(1-男,2-女), Integer age, Integer smoking(1-抽,0-不), Integer height(cm), Integer weight(kg))
Yasee.configUser(sex, age, smoking, height, weight)
```
对于事例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [configUser](https://doc.yasee.com.cn/flutter_doc/yasee_plugin_method_channel/MethodChannelYaseePlugin/configUser.html "详细了解")
- 详细请点击 [configBle](https://doc.yasee.com.cn/flutter_doc/yasee_plugin_method_channel/MethodChannelYaseePlugin/configBle.html "详细了解")

:::warning
设置当前的人员信息,主要的功能是为了 肺功能 和 体脂中的人员信息设置! 如果没有这两种检测项的测量可忽略
:::





### 通知相关内容
所有的有关Yasee Flutter Plugin 的 通知 和 数据交互,都是通过 Stream 来处理的,包含但未来不限于:
- [x] 设备的绑定与解绑 (``notifyBindDevices``)
- [x] 设备的搜索 (``notifySearchDevices``)
- [x] 设备的蓝牙状态 (``notifyBleState``)
- [x] 设备的通讯数据  (``notifyDeviceData``)

首先我们需要了解的是通知的类型,只有了解了通知的类型才能更好的监听来自SDK的各类信息通知:
```dart
/// 通知的类型
NotifyDevicesEntity         /// 绑定列表 & 搜索列表
NotifyBleStateEntity        /// 设备状态
NotifyDeviceDataEntity      /// 设备数据收发内容


// 获取蓝牙状态
Yasee.notifyBleState.listen((state)=>{

});


// 获取 绑定列表
Yasee.notifyBindDevices.listen((data)=>{
    
});

// 获取 搜索列表
Yasee.notifySearchDevices.listen((data)=>{
    
});

// 获取 外设 交互信息
Yasee.notifyDeviceData.listen((data)=>{
    
});


```



### 蓝牙相关操作
蓝牙相关的步骤,比较固定,基本包含 搜索、连接、发送信息
```swift
// 搜索蓝牙
Yasee.scan()

// 连接设备
(device as DeviceEntity).connect();

// 断开设备
(device as DeviceEntity).cancel();

//获取 设备 支持的 检测项列表
Future<List<CheckEntity>?> cheks = (device as DeviceEntity).supportChecks;

//获取 检测项 支持的 指令
Future<List<CmdEntity>?> cmds = (check as CheckEntity).cmds

// 收发 与 外设的 双向指令
try? device.send(checkId,cmdId) // 发送 接收使用 Notify 通知

```
对于事例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [DeviceEntity](https://doc.yasee.com.cn/flutter_doc/models_device_entity/DeviceEntity-class.html "详细了解")
- 详细请点击 [CheckEntity](https://doc.yasee.com.cn/flutter_doc/models_check_entity/CheckEntity-class.html "详细了解")
- 详细请点击 [CmdEntity](https://doc.yasee.com.cn/flutter_doc/models_cmd_entity/CmdEntity-class.html "详细了解")





### 设置默认的绑定列表
Yasee Flutter Plugin 支持 初始化绑定列表,并根据初始化的设备列表进行**自动连接操作**;首先我们需要获取一个``[DeviceEntity]``对象;
:::warning
自动连接功能取决于初始化设备的设置,由BleConfig中的reconnect字段控制,如果需要设置自动连接,需要配置此属性,默认情况不支持自动连接!!
:::

以下为设备初始化:
```dart

/// 设备绑定列表 (需要自己维护 本地存储逻辑!!)
static late List<dynamic> bindsObj = [];


/// 设置初始化 默认的设备,此操作可以让设备进入自动连接(前提是配置了自动连接)
Yasee.configDevices(bindsObj);

```



## 集成成功!

如果需要更多功能实现,可查阅 [Yasee Flutter Plugin Api 文档](https://doc.yasee.com.cn/flutter_doc/)