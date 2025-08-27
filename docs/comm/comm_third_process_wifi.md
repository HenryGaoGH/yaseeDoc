


# WI-FI 设备使用说明

:::danger
!!! ⚠️ 当前 WI-FI设备仅支持 Android 设备!
:::

## 连接流程
1. 构造 Wi-Fi 设备 对象
2. 获取 设备 支持的检测项
3. 通过 检测项 获取 交互指令
4. 设置 数据 交互 回调接口



### 构造 Wi-Fi 设备 对象

白细胞设备仪器 机身会附带 二维码信息; 通过 二维码信息 获取到 设备SSID信息; 通过 SSID 信息 构造 Wi-Fi 设备 对象。
```java
/// 构建Wi-Fi设备对象
private WifiDevice wifiDevice = new WifiDevice("");

```


### 获取 设备 支持的检测项
- 详细请点击 [Products](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/tools/Products.html "详细了解")
- 关于 Check 信息; 详细请点击 [Check](https://doc.yasee.com.cn/android_doc/com/yasee/yasee/core/models/Check.html "详细了解")
```java
/// 获取设备 支持的 检测项
List<Check> checks = Products.supportChecks(wifiDevice);

```


### 通过 检测项 获取 交互指令
```java
/// 获取 检测项 对应的交互指令
List<Cmd> cmds = check.getCmds();

```


### 设置 数据 交互 回调接口
详细内容查阅: [NotifyData](../yasee_android/intro.md#通知相关内容)


--- 


## 完整事例
```java

// 二维码内容如下:
https://wechat.yasee.com.cn/wxLogin/#/csc?dt=ECS2300&mac=373219850643

主要是 dt字段 作为 SSID 信息

/// 构建Wi-Fi设备对象
private WifiDevice wifiDevice = new WifiDevice(dt字段);


List<Check> checks = Products.supportChecks(wifiDevice);
List<Cmd> cmds = checks.get(0).getCmds();

ParmsModel pm = new ParmsModel();

/// 假定 扫描的设备 SSID信息为
pm.wifiName = dt字段;

// 测量
binding.masschipStart.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        Check check = checks.get(0);
        wifiDevice.send(check,cmds.get(1).id,pm);
    }
});
// 获取ID
binding.masschipStatus.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        Check check = checks.get(0);
        wifiDevice.send(check,cmds.get(5).id,pm);
    }
});

// 连接
binding.masschipLink.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        Check check = checks.get(0);
        wifiDevice.send(check,cmds.get(0).id,pm);
    }
});
// 断开
binding.masschipUnlink.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        Check check = checks.get(0);
        wifiDevice.send(check,cmds.get(2).id,pm);
    }
});

// 复位
binding.masschipReset.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        Check check = checks.get(0);
        wifiDevice.send(check,cmds.get(3).id,pm);
    }
});

```
