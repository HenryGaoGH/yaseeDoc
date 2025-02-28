---
sidebar_position: 3
---

import ImgText from '@site/src/components/ImgText/ImgText';
import Tag from '@site/src/components/Tag';

# Yasee 调试工具 使用说明 (Apk)
--- 


## 图鉴

在以下内容中; 对于高频出现的名称,统一做如下解释:
- <Tag text="主机" color="red" /> 可单独使用的设备
    1. D系列设备
    2. E系列设备(生态产品)
    3. M系列设备
- <Tag text="外挂" color="pink" /> 必须配合主机使用的设备
    1. T系列设备
- <Tag text="App" color="black" /> Yasee 官方提供的 App (百合医)

## 总览功能说明

### 蓝牙
    - [x] 扫描&连接 Yasee 支持的设备列表 (自研、生态合作产品)
    - [x] 查看 产品所支持的检测项列表 & 以及 每个检测项的交互指令
    - [x] 查看 App 与 主机间的 通信
        - 原始通信数据 (hex)
        - 可视化数据 
            - 流程阶段信息
            - 详细错误信息
            - 详细的检测信息
            - 等等

### 串口
    - [x] 查看 产品所支持的检测项列表 & 以及 每个检测项的交互指令
    - [x] 查看 App 与 主机间的 通信
        - 原始通信数据 (hex)
        - 可视化数据 
            - 流程阶段信息
            - 详细错误信息
            - 详细的检测信息
            - 等等

### WI-FI (暂不支持)



## 前置准备
:::warning
**! 调试工具 程序 不会像 完整的App具备完整的健壮性支持; 运行前 需要人为确保各个权限、蓝牙状态等处理活跃 !**
:::

- **开启蓝牙权限**
- **打开蓝牙**
- **打开位置权限(部分设备需要)**
- **打开文件权限(部分设备需要)**


## 功能演示

<Tag text="蓝牙" color='deepskyblue' />
--- 

### 展示说明
<ImgText width={230} src={"/img/android_demo_overview.png"} cotents={[
    "1. 通讯方式切换按钮 - 可以切换通讯方式",
    "2. Ble 搜索结果 - 可以展示蓝牙搜索结果; 点击绑定连接 可以连接设备",
    "3. 直连区 - 可以根据具体的MAC 地址连接设备",
    "4. 筛选按钮 - 可以筛选当前已搜索到设备的 厂商设备",
    "5. 搜索按钮 - 搜索所有Yasee支持的设备",
]} />


### 已连接设备页面 & 检测项 & 可交互指令
<ImgText width={230} src={"/img/android_demo_link_device.gif"} cotents={[
    "1. 点击设备进行连接; 连接成功进入 设备详情页",
    "2. 详情页下部分是展示 检测项支持列表; 点击可以查看 检测项的交互指令",
    "3. 点击检测项 可以查看 检测项的交互指令列表",
    "4. 点击交互指令 可以查看 交互指令的交互数据",
    "5. 交互数据 可以帮助 相关人员 排查问题、分析流程",
]} right />


--- 



<Tag text="串口" color='deepskyblue' /> 
--- 
<ImgText width={230} src={"/img/android_demo_serial_process.gif"} cotents={[
    "目前的串口支持的设备仅限 M10; 检测项 支持 血糖、尿酸、血酮 等",
    "1. 点击串口类型按钮 - 进入串口详情页面",
    "2. 详情页下部分是展示 检测项支持列表; 点击可以查看 检测项的交互指令",
    "3. 点击检测项 可以查看 检测项的交互指令列表",
    "4. 点击交互指令 可以查看 交互指令的交互数据",
    "5. 交互数据 可以帮助 相关人员 排查问题、分析流程",
]} />

--- 


<Tag text="通用功能" color='deepskyblue' />
--- 


### 交互数据查看
<ImgText right width={230} src={"/img/android_demo_check_flow.png"} cotents={[
    "1. 交互数据 可以帮助 相关人员 排查问题、分析流程",
    "2. 一条完整的指令都会包含 开始标志 和 结束的标志",
    "3. 交互数据包含 利于硬件&嵌入式开发人员查看的原始帧数据(hex)",
    "4. 也包含 利于测试人员、非技术相关人员查看的 可视化数据(便于理解)",
    "5. 对应内容含义:</br> start-检测流程开始; </br> end-检测流程结束;</br>  countDown-等待过程(加压、倒计时、实时过程等);</br>  result-检测结果;</br>  error-错误信息;</br>  message-提示信息;</br>  battery-电量信息;</br>  pwd-密码信息; ",
]} />


--- 


## Demo 工程下载 
[Android Demo 工程下载](/files/android_demo.zip)
[Android Apk 程序下载](/files/yasee.apk)