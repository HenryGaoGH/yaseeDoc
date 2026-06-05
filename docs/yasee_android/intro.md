---
sidebar_position: 2
---

import ImgText from '@site/src/components/ImgText/ImgText';


# 集成文档
---

## 准备工作
:::warning
这部分的内容是尤为重要的, 决定了是否可以使用蓝牙, 没有蓝牙权限是无法使用Yasee SDK!!!

!! 没有示例的情况下,查阅 **[完整Api文档](https://doc.yasee.com.cn/android_doc/index.html)**
:::

首先,对接Yasee SDK 需要遵循以下条件:
1. 需要您的手机Android 版本在 Pie 及以上,也就是 **Android 9** 版本及以上,使用以下方式可以查看版本的信息
  ```java
  public class DeviceInfo {
      public static void logDeviceInfo() {
          Log.d("DeviceInfo", "Brand: " + Build.BRAND);
          Log.d("DeviceInfo", "Device: " + Build.DEVICE);
          Log.d("DeviceInfo", "Model: " + Build.MODEL);
          Log.d("DeviceInfo", "ID: " + Build.ID);
          Log.d("DeviceInfo", "Manufacturer: " + Build.MANUFACTURER);
          Log.d("DeviceInfo", "Product: " + Build.PRODUCT);
          Log.d("DeviceInfo", "SDK: " + Build.VERSION.SDK_INT);
          Log.d("DeviceInfo", "Release: " + Build.VERSION.RELEASE);
          Log.d("DeviceInfo", "Incremental: " + Build.VERSION.INCREMENTAL);
      }
  }
  ```
2. 需要声明必要的**权限列表**,此处如有遇到问题,请查阅 [Android官方文档](https://developer.android.com/guide/topics/connectivity/bluetooth)
```xml
<uses-permission
    android:name="android.permission.BLUETOOTH"
    android:maxSdkVersion="30"/>
<uses-permission
    android:name="android.permission.BLUETOOTH_ADMIN"
    android:maxSdkVersion="30"/>
<uses-permission
    android:name="android.permission.ACCESS_COARSE_LOCATION"
    android:maxSdkVersion="30"/>
<uses-permission
     android:name="android.permission.ACCESS_FINE_LOCATION"
     android:maxSdkVersion="30"/>
<uses-permission
    android:usesPermissionFlags="neverForLocation"
    android:name="android.permission.BLUETOOTH_SCAN"/>
<uses-permission
    android:name="android.permission.BLUETOOTH_ADVERTISE" />
<uses-permission
    android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-feature
    android:name="android.hardware.bluetooth_le"
    android:required="true"/>

```
声明完成之后,需要在App中动态申请权限,以下为申请权限示例代码:
```java
    private boolean checkBLEConnectionPermission() {
        boolean isGranted = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED
                    && ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED) {
                isGranted = true;
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                    && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                isGranted = true;
            }
        } else {
            isGranted = true;
        }
        return isGranted;
    }
```

3. 需要初始化 **Yasee SDK**
在1、2 步骤执行完成,并没有任何遗漏之后,要开始导入并且初始化Yasee SDK.
在 Android 工程中导入 AAR（Android Archive）包可以通过以下几种方式进行：

  1. 使用 Gradle 导入 AAR 包

  - 本地 AAR 包

  如果你有一个本地的 AAR 包，可以将它放在工程的 libs 目录下，然后在 build.gradle 文件中进行配置。

    1.	将 AAR 包放入 libs 目录
  在你的模块（通常是 app 模块）的 libs 目录中放置 AAR 文件，例如 libs/mylibrary.aar。
    2.	在 build.gradle 文件中配置
  在模块的 build.gradle 文件中添加以下代码：

  ```gradle
  repositories {
      flatDir {
          dirs 'libs'
      }
  }

  dependencies {
      implementation(name: 'mylibrary', ext: 'aar')
  }
  ```



  - **远程 AAR 包**

  如果你的 AAR 包托管在远程仓库中，可以通过在 build.gradle 文件中添加仓库地址和依赖项来导入。

  1.	添加远程仓库地址
  ```gradle
  repositories {
      maven {
          url 'https://your.remote.repository/url'
      }
  }

  dependencies {
      implementation 'com.example:yourlibrary:1.0.0@aar'
  }
  ```
  导入 AAR 包主要有两种方式：本地导入和远程导入。选择适合你的项目需求的方法，并在 build.gradle 文件中进行相应的配置。完成配置后，同步项目，Android Studio 将会自动导入并解析 AAR 包中的内容。


4. 需要 在没有示例的情况下,查阅 **[完整文档](https://doc.yasee.com.cn/android_doc/index.html)**

---


## 大纲
接下来,我们将分为以下几个步骤,带领您集成、以及使用Yasee 官方 SDK.
- 准备工作
  - 声明权限
  - 运行时请求权限
- 初始化 Yasee SDK
  - 蓝牙配置信息 (``BleConfig``)
  - Android相关的上下文信息 (``Yasee``)
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


### 异常处理情况 & 参数情况
对于一个SDK而言,👉[**完整的Api文档**](https://henrygaogh.github.io/yasee-doc.io)👈是必不可少的;\
在 处理异常和参数理解上有重要的意义,
因此, SDK在使用中会有可视化的参数提示,如:
<ImgText width={100} src="/img/alert_used.png" text="在编码过程中,可以查看详细的参数信息" />
在获取数据对象和模型对象的时候,常规的异常捕获需要做到:
``` java
// 空值判断
if (value == null) return;

// try 异常捕获
try {
    // 概率下可存在 奔溃的情况
} catch (ArithmeticException err) {
    // 失败的逻辑处理
}
```

### 初始化 Yasee SDK
初始化操作是必须要做的操作,集成Yasee SDK第一步 却是以下内容步.
```java
/// 设置整个SDK所使用到的上下文环境
Yasee.getSingle().context = getApplicationContext();

/// 设置搜索自动暂停的时间 (秒级)
/// BleConfig(Integer scanTimer)
Yasee.getSingle().bleConfig = new BleConfig(5);

/// 设置人员信息
/// 设置当前的使用人,
/// 主要是为了 肺功能 和 体脂上的人员信息设置
/// User(Integer sex(1-男,2-女), Integer age, Integer smoking(1-抽,0-不), Integer height(cm), Integer weight(kg))
Yasee.getSingle().currentUser = new User(1,20,0,178,75);
```
对于示例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [User](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/configs/User.html "详细了解")
- 详细请点击 [BleConfig](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/configs/BleConfig.html "详细了解")

:::warning
设置当前的人员信息,主要的功能是为了 肺功能 和 体脂中的人员信息设置! 如果没有这两种检测项的测量可忽略
:::



### 通知相关内容
所有的有关Yasee SDK 的 通知 和 数据交互,都是通过 Notify来处理的,包含但未来不限于:
- [x] 设备的绑定、解绑与搜索 (``NotifyType.(searchDevices|bindDevices)``)
- [x] 设备的连接与断开 (``NotifyType.deviceLink``)
- [x] 设备的通讯数据  (``NotifyType.deviceData``)
- [x] 设备的历史数据数据  (``NotifyType.testHistory``)

首先我们需要了解的是通知的类型,只有了解了通知的类型才能更好的监听来自SDK的各类信息通知:
```java
/**
 * 信息类型
 * /// 通知的类型
 *     /// 设备蓝牙状态
 *     case bleState
 *     /// 设备搜索列表
 *     case searchDevices
 *     /// 设备绑定列表
 *     case bindDevices
 *     /// 设备连接状态
 *     case deviceLink
 *     /// 设备传输数据
 *     case deviceData
 *     /// 设备历史数据
 *     case testHistory
 */
public enum NotifyType {

    /*
    * 设备蓝牙状态
    * */
    bleState,

    /**
     * 设备搜索列表
     */
    searchDevices,

    /**
     * 设备绑定列表
     */
    bindDevices,

    /**
     * 设备连接变化
     */
    deviceLink,


    /**
     * 设备数据内容 Notify
     */
    deviceData       // 设备数据内容 Notify

    /**
     * 设备历史数据内容 Notify
     */
    testHistory       // 设备数据内容 Notify
}
```
可以通过 消息通知的类型,来区分数据的类型是什么, 并且使用什么类型的数据来接收数据类型
[数据类型](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/models/NotifyResp.BleNotifyData.html), 主要包含:
- ``NotifyContent.BleLink``
    - 连接状态
    - 被操作的设备

- ``NotifyContent.BleNotifyData``
    - 数据解析的对象
    - 被操作的设备
    - 交互使用的原始数据帧


- ``NotifyContent.BleSearch`` (暂未使用)

对于示例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [NotifyContent](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/models/NotifyResp.BleNotifyData.html "详细了解")


```java
// 以 接收数据为例. 首先创建 监听接收接口:

NotifyInterface _ni = new NotifyInterface() {
    @Override
    public NotifyType getType() {
        // 想要接收的数据类型 (按照自己的需求来设置)
        return NotifyType.deviceData;
    }

    @Override
    public void message(NotifyResp data) {
        NotifyResp.BleNotifyData data = (NotifyResp.BleNotifyData) data.data;
        HashMap _m = (HashMap) data.data;
        String text = String.format("%s\n start============\n  原始: %s\n  指令类型:%s \n  指令可视化数据:%s\nend================\n", binding.sendData.getText(),Arrays.toString(data.raw),data.step.name(), _m==null ? "" : _m.toString());
        Logs.print(text);
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                // 更新操作
            }
        });
    }
};

```




### 设备控制相关操作
蓝牙相关的步骤,比较固定,基本包含 搜索、连接、发送控制指令

具体检测项操作步骤可查阅 [👉 BLE检测流程详解](../comm/comm_third_process_ble)
```java
// 搜索设备
Yasee.getSingle().scan();

// 连接设备
(BleDevice) device.connect();

// 通过 mac 地址和 设备名称连接一个位置设备
// 主要是在 设备已经缓存了设备信息在本地时使用, 如 重连、缓存器拾取等
// BleDevice(String mac, AdvertisementData Avdadata)
BleDevice device = new BleDevice("MAC",AdvertisementData);
// 这里可以使用 空值判断来中断异常
if (device == null) throw new IllegalArgumentException("获取设备失败");
device.connect();

// 断开设备
(BleDevice) device.disconnect();

// 获取 设备 支持的 检测项列表
List<Check> checks = Products.supportChecks((BleDevice) device);

// 获取 检测项 支持的 指令
List<Cmd> cmds = checks.get(0).getCmds();

// 发送 控制命令 (测量、停止、 获取Code 等等 )
(BleDevice) device.send(ccs.get(0).handwareCode,cs.get(0).id,null);

// 发送 接收使用 Notify 通知

```
对于示例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [BleDevice](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/ble/BleDevice.html "详细了解")
- 详细请点击 [Check](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/models/Check.html "详细了解")
- 详细请点击 [Products](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/tools/Products.html "详细了解")


### 设置默认的绑定列表
Yasee SDK 支持 初始化绑定列表,并根据初始化的设备列表进行[自动连接操作](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/configs/BleConfig.html#reconnect);首先我们需要获取一个``List<BleDecive>``对象;
:::warning
自动连接功能取决于初始化设备的设置,由BleConfig中的reconnect字段控制,如果需要设置自动连接,需要配置此属性,默认情况支持自动连接!!
:::

以下为设备初始化:
```java

/// 获得List<BleDevice> 数组
List<BleDevice> alls = Devices.getSingle().getDevices()

/// 获取 设备管理对象
Devices single = Devices.getSingle()


/// 设置初始化 默认的设备,此操作可以让设备进入自动连接(前提是配置了自动连接)
single.initDevices(List<BleDevice>);


```
对于示例中的模型,如有理解歧义,可查看详细的注释说明:
- 详细请点击 [Devices](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/ble/Devices.html "详细了解")



## 混淆规则
```groovy

### Proguard
# Yasee
-keepattributes Signature
-keep class com.google.gson.** { *; }
-keep class com.yasee.gson.** { *; }
-keepclassmembers class * { @com.google.gson.annotations.SerializedName <fields>; }
-keep class com.google.gson.reflect.TypeToken { *; }

-keep class com.yasee.yasee.Yasee { public *; }
-keep class com.yasee.yasee.Notify { public *; }
-keep class com.yasee.yasee.core.interfaces.NotifyInterface { public *; }
-keep class com.yasee.yasee.core.models.** { public *; }
-keep class com.yasee.yasee.core.configs.** { public *; }
-keep class com.yasee.yasee.core.enums.** { public *; }
-keep class com.yasee.yasee.core.receivers.** { public *; }
-keep class com.yasee.yasee.core.tools.ByteTool { public *; }
-keep class com.yasee.yasee.core.tools.BleDeviceTypeAdapter { public *; }
-keep class com.yasee.yasee.core.tools.Products { public *; }
-keep class com.yasee.yasee.core.tools.YLocalBroadcast { public *; }
-keep class com.yasee.yasee.core.abstracts.AbstractsSerialActivity { public *; }
-keep class com.yasee.yasee.core.abstracts.Device { public *; }
-keep class com.yasee.yasee.core.abstracts.Platforms { public *; }
-keep class com.yasee.yasee.protocols.ble.BleDevice { public *; }
-keep class com.yasee.yasee.Devices { public *; }
-keep class com.yasee.yasee.protocols.serial.SerialDevice { public *; }
-keep class com.yasee.yasee.protocols.wifi.WifiDevice { public *; }
-keep class com.yasee.yasee.platforms.** { <init>(); }
-keepclassmembers class com.yasee.yasee.platforms.** { public <init>(); }

-keep class com.yyh.sdk.ecg.ui.widget.**{*;}
-keep class com.yyh.sdk.ecg.biz.**{*;}
-keep class com.yyh.sdk.ecg.bean.**{*;}
-keep class com.yyh.sdk.ecg.constant.**{*;}
-keep class com.yyh.sdk.ecg.ble.** {  <init>(...); }

-keep class cn.icomon.icdevicemanager.ICDeviceManager { *; }
-keep class cn.icomon.icdevicemanager.ICBluetoothSystem { *; }
-keep public interface cn.icomon.icdevicemanager.ICBluetoothSystem$ICBluetoothDelegate { *; }
-keep public class cn.icomon.icdevicemanager.ICBluetoothSystem$ICOPBleCharacteristic { *; }
-keep public enum cn.icomon.icdevicemanager.ICBluetoothSystem$ICOPBleWriteDataType { *; }
-keep class cn.icomon.icdevicemanager.manager.setting.ICSettingManagerImpl { *; }
-keep class cn.icomon.icdevicemanager.manager.algorithms.ICBodyFatAlgorithmsImpl { *; }
-keep class cn.icomon.icdevicemanager.ICDeviceManagerDelegate { *; }
-keep class cn.icomon.icdevicemanager.model.** { *; }
-keep class cn.icomon.icdevicemanager.ICDeviceManagerSettingManager { *; }
-keep public interface cn.icomon.icdevicemanager.ICDeviceManagerSettingManager$ICSettingCallback { *; }
-keep class com.icomon.icbodyfatalgorithms.** { *; }
-keep class cn.icomon.icbleprotocol.** { *; }
-keep class cn.icomon.icdevicemanager.ICBodyFatAlgorithmsManager { *; }
-keep class cn.icomon.icdevicemanager.ICBluetoothSystem.** { *; }
-keep class cn.icomon.icdevicemanager.callback.** { *; }



-keepattributes *Annotation*
-keep class **.annotation.** { *; }
-keep class javax.annotation.** { *; }
-keep class org.jetbrains.annotations.** { *; }
-keep class org.conscrypt.** { *; }
-keep class org.codehaus.mojo.animal_sniffer.** { *; }


# 禁用日志以保护敏感信息（可选）
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** e(...);
    public static *** w(...);
    public static *** i(...);
    public static *** v(...);
}

# 尽可能地优化和缩小代码
-optimizationpasses 5
-overloadaggressively

-allowaccessmodification

# Preserve some attributes that may be required for reflection.
-keepattributes AnnotationDefault,
                EnclosingMethod,
                InnerClasses,
                RuntimeVisibleAnnotations,
                RuntimeVisibleParameterAnnotations,
                RuntimeVisibleTypeAnnotations,
                Signature

-dontnote com.android.vending.licensing.ILicensingService
-dontnote com.google.vending.licensing.ILicensingService
-dontnote com.google.android.vending.licensing.ILicensingService

# For native methods, see https://www.guardsquare.com/manual/configuration/examples#native
-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# Keep setters in Views so that animations can still work.
-keepclassmembers public class * extends android.view.View {
    void set*(***);
    *** get*();
}

# We want to keep methods in Activity that could be used in the XML attribute onClick.
-keepclassmembers class * extends android.app.Activity {
    public void *(android.view.View);
}

# For enumeration classes, see https://www.guardsquare.com/manual/configuration/examples#enumerations
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

# Preserve annotated Javascript interface methods.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-dontnote android.support.**
-dontnote androidx.**
-dontwarn android.support.**
-dontwarn androidx.**

# Understand the @Keep support annotation.

# These classes are duplicated between android.jar and org.apache.http.legacy.jar.
-dontnote org.apache.http.**
-dontnote android.net.http.**

# These classes are duplicated between android.jar and core-lambda-stubs.jar.
-dontnote java.lang.invoke.**



### ============== ConsumerProguardFiles
-keep class com.google.gson.** { *; }
-keep class com.yasee.gson.** { *; }


-dontwarn java.beans.Transient
-dontwarn javax.annotation.Nullable
-dontwarn javax.annotation.concurrent.GuardedBy
-dontwarn kycmr.org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn kycmr.org.conscrypt.Conscrypt$ProviderBuilder
-dontwarn kycmr.org.conscrypt.Conscrypt
-dontwarn kycmr.org.jetbrains.annotations.NotNull
-dontwarn kycmr.org.jetbrains.annotations.Nullable
-dontwarn kycmr.org.w3c.dom.Node


```




## Demo & SDK 下载

[点我直达](download)
