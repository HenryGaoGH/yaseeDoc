---
sidebar_position: 2
---

import ImgText from '@site/src/components/ImgText/ImgText';
import Tag from '@site/src/components/Tag';


# Customized SDK Integration Protocol
---

## Notes

The current version for customized devices is as below:
- <Tag text="GLM devices (GLM-xx)" color="green" />
- <Tag text="more..." color="red" />


:::danger

For customized devices, you can only search for the currently agreed devices list, but cannot search for other devices!!

For example, (GLM devices) you can only search for GLM devices.
:::


## Preparations
:::warning
This part is very important, which determines whether you can use Bluetooth connection or not. Without permission, you cannot use Yasee SDK!!!

!! Please check the [Complete API Documentation] without any exsamples (https://doc.yasee.com.cn/android_doc/index.html)** 
:::

Firstly, the following conditions are needed to connect to Yasee SDK:
1. You should have an Android version of Pie or above for your mobile phone, which is **Android 9** or above. You can check the version with below method:
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
2. Declare the necessary **permission list** here. If any problems, please refer to [Android official documentation]
(https://developer.android.com/guide/topics/connectivity/bluetooth)
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
Once the declaration is completed, you need to dynamically apply for permissions in the App. 
Below is the sample code for applying for permissions
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

3. Initialize **Yasee SDK**
After steps 1 and 2 completed without any omissions, you need to start importing and initializing the Yasee SDK.
You can import the AAR (Android Archive) package in the Android project as below:

  1. Import the AAR package with Gradle

  - Local AAR package

If you have a local AAR package, you can put it in the libs directory of the project and then configure it in the file: build.gradle.

    1.	Place the AAR package in the libs directory
Place an AAR file, such as libs/yasee.aar, in the libs directory of your module (usually an app module).
    2.	Configure it in the build.gradle file
Add the following code in the build.gradle file of the module:

  ```gradle
  repositories {
      flatDir {
          dirs 'libs'
      }
  }

  dependencies {
      implementation(name: 'yasee', ext: 'aar')
  }
  ```



  - **Remote AAR Package**

If your AAR package is hosted in a remote repository, you can import it in the build.gradle file by adding the repository address and dependencies.

  1.	Add the remote repository address
  ```gradle
  repositories {
      maven {
          url 'https://your.remote.repository/url'
      }
  }

  dependencies {
      implementation 'com.example:yasee:1.0.0'
  }
  ```

There are mainly two ways to import AAR packages: local import and remote import. Just select the method that suitable for your project requirements and make the corresponding configuration in the build.gradle file. 
After the configuration is completed and the project will be synchronized, and Android Studio will automatically import and parse the contents in the AAR package.


4. If necessary, please refer to the **[Complete document] without any examples.(https://doc.yasee.com.cn/android_doc/index.html)**

---


## Outline
Next, we will guide you for the integration and use of the official Yasee SDK with the following steps.
- Preparations
  - Permission Declaration
  - Permissions request during runtime
  - Yasee SDK Initialization
  - Context information related to Android(``Yasee``)
  - Data notification related
  - Device connection notification
  - Device message sending and receiving notifications
  - Device binding change notification
  - Bluetooth-related operations
  - Yasee devices searching
  - Yasee devices connecting
  - Obtain test items supported by the device
  - Obtain instructions supported by the test items
  - Send and receive bidirectional instructions with peripheral devices


## Official Start


### Exception handling & parameter conditions
👉[**Complete Api documentation**](https://henrygaogh.github.io/yasee-doc.io)👈 is essential for an SDK;\
It is important in handling exceptions and understanding parameters.
Therefore, the SDK will have visual parameter prompts during use, such as:
<ImgText width={100} src="/img/alert_used.png" text="During encoding, you can view detailed parameter information" />
During obtaining data objects and model objects, conventional exception capture needs to be done as below:
``` java
// Null value judgment
if (value == null) return;

// try exception capture
try {
    // There may be a crash under certain conditions
} catch (ArithmeticException err) {
    // Failed logic processing
}
```

### Innitialize the Yasee SDK
Initialization is a must, but the first step to integrate Yasee SDK is as below,
```java
/// Required - Sets the context used by the entire SDK
Yasee.getSingle().context = getApplicationContext();

/// Optional - Set the time which the search will automatically stop (in seconds; default is 10 seconds)
/// BleConfig(Integer scanTimer)
Yasee.getSingle().bleConfig = new BleConfig(5);

```
For the models in the examples, if you have any ambiguity in understanding, please refer to the detailed comments:
- For details please click [User](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/configs/User.html "learn more")
- For details please click [BleConfig](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/configs/BleConfig.html "learn more")

:::warning
Set the time for automatic search pause. Not necessary; can be ignored.

:::



### Relevant content Notifications
All notifications and data interactions related to the Yasee SDK are handled by Notify, including but not limited to,
- [x] Binding, unbinding and searching of devices (``NotifyType.(searchDevices|bindDevices)``)
- [x] Device connection and disconnection (``NotifyType.deviceLink``)
- [x] Communication data of the device  (``NotifyType.deviceData``)
- [x] Historical data of the device  (``NotifyType.testHistory``)


First of all, what we need to understand is the type of notification. Only by understanding the type of notification can we better listen for various notifications from the SDK
```java
/**
 * Information type
 * /// Notification type
 *     /// Device Bluetooth status
 *     case bleState
 *     /// Device search list
 *     case searchDevices
 *     /// Device binding list
 *     case bindDevices
 *     /// Device connection status
 *     case deviceLink
 *     /// Device transmits data
 *     case deviceData
 *     /// Device historical data
 *     case testHistory
 */
public enum NotifyType {

    /*
    * Device Bluetooth status
    * */
    bleState,

    /**
     * Device search list
     */
    searchDevices,

    /**
     * Device binding list
     */
    bindDevices,

    /**
     * Device connection changes
     */
    deviceLink,


    /**
     * Device data Notify
     */
    deviceData       // Device data Notify

    /**
     * Historical data Notify
     */
    testHistory       // Device data Notify
}
```

The type of data can be distinguished by the type of message notification, and what type of data is used to receive the data type
[data type](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/models/NotifyResp.BleNotifyData.html), mainly contains:
- ``NotifyContent.BleLink``
    - Connection status
    - The device being operated

- ``NotifyContent.BleNotifyData``
    - The object for data parsing
    - The device being operated
    - The original data frame used interactively


- ``NotifyContent.testHistory``
    - Historical detailed data

- ``NotifyContent.BleSearch`` (Not available for now)

For the model in the example, if there are any misunderstandings, you can refer to the detailed annotations and explanations.
- For details please click [NotifyContent](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/models/NotifyResp.BleNotifyData.html "learn more")


```java 
// Take "receiving data" as an example. First, create the listening and receiving interface:

NotifyInterface _ni = new NotifyInterface() {
    @Override
    public NotifyType getType() {
        // The type of data you want to receive (set according to your own needs)
        return NotifyType.deviceData;
    }

    @Override
    public void message(NotifyResp data) {
        NotifyResp.BleNotifyData data = (NotifyResp.BleNotifyData) data.data;
        HashMap _m = (HashMap) data.data;
        String text = String.format("%s\n start============\n  Original: %s\n  Instruction type:%s \n  Instruction visualization data:%s\nend================\n", binding.sendData.getText(),Arrays.toString(data.raw),data.step.name(), _m==null ? "" : _m.toString());
        Logs.print(text);
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                // Update operation
            }
        });
    }
};

```




### Operations related to device control
The steps related to Bluetooth are relatively fixed and basically include searching, connecting and sending messages.
```java
// Device searching
Yasee.getSingle().scan();

// Device connecting
(BleDevice) device.connect();

// Connect a local device via mac address and device name
// It is mainly used when the device has already cached device information locally, such as reconnection, cache pickup, etc
// BleDevice(String mac, AdvertisementData Avdadata)
BleDevice device = new BleDevice("MAC",AdvertisementData);
// Here, null value judgments can be used to interrupt exceptions
if (device == null) throw new IllegalArgumentException("Failed to obtain the device");
device.connect();

// Disconnect the device
(BleDevice) device.disconnect();

// Obtain the list of test items supported by the device
// For example, the GLM device only acquires (three-in-one) blood glucose
List<Check> checks = Products.supportChecks((BleDevice) device);

// Obtain the instructions supported by the test items
// For example, GLM devices 
// Terminate measurement, time calibration, obtain historical overview, obtain historical details
List<Cmd> cmds = checks.get(0).getCmds();

// Send control commands (time calibration, obtain historical overview, obtain historical details, obtain Code, etc.)
(BleDevice) device.send(ccs.get(0).handwareCode,cs.get(0).id,null); 

// Notify is used for sending and receiving

```
For the model in the example, if there are any misunderstandings, you can refer to the detailed annotations and explanations.
- For details please click [BleDevice](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/ble/BleDevice.html "learn more")
- For details please click [Check](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/models/Check.html "learn more")
- For details please click [Products](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/tools/Products.html "learn more")


### Set the default binding list

Yasee SDK support Initialize the binding list, and according to the initialization and automatic connection of the initialized equipment list (https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/configs/BleConfig.html#reconnect ); 
First, we need to obtain a `List<BleDecive>` object;

:::warning
The auto-connection function depends on the Settings of the initialized device and is controlled by the reconnect field in BleConfig. 
If you need to set up auto-connection, you need to configure this attribute. 
By default, auto-connection is supported!!
:::

Below is the device initialization:
```java

/// Obtain the List<BleDevice> array
List<BleDevice> alls = Devices.getSingle().getDevices()

/// Obtain the device management object
Devices single = Devices.getSingle()


/// Set the default device to initialize. This operation enables the device to enter automatic connection (on condition that automatic connection is configured).
single.initDevices(List<BleDevice>);


```

For the model in the example, if there are any misunderstandings, you can refer to the detailed annotations and explanations.
- For details please click [Devices](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/ble/Devices.html "learn more")






## Demo download
- [Android download](/files/yasee.apk)




## AAR download
**It is recommended to use the Demo for try or refer to this document before connection**
- [AAR download](/files/yasee_tailor.aar)


