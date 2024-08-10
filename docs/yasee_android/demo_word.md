---
sidebar_position: 3
---

import ImgText from '@site/src/components/ImgText/ImgText';

# Demo Apk 使用说明
--- 


## 总览功能说明
<ImgText src={"/img/demo_scan.png"} text={"1. 搜索蓝牙，弹出扫描弹窗，点击扫描<br><br>2. 直连设备，弹窗后输入mac地址（如：00:00:00:00:00:5F），点击连接进行连接<br><br>3. 清除所有绑定设备，会有提示弹窗，重启demo，绑定页面将是当前空白页面"} />


## 连接设备 & 重复扫描
<ImgText src={"/img/demo_link.png"} text={"1. 点击蓝牙设备名称将跳转详情页面<br><br>2. 未找到想连接蓝牙设备可重复操作扫描按钮"} />



## 设备详情 & 测量展示 & 断开连接
<ImgText src={"/img/demo_info.png"} text={"- 点击蓝牙设备后，进入详情页"} />
:::warning
提示：系统会保存当前设备到绑定设备列表，重新打开demo可看到之前连接设备。
:::


## 绑定列表 & 自动连接
<ImgText src={"/img/demo_bind.png"} text={""} />
:::warning
提示：当前为启动页面默认展示绑定设备列表。未绑定设备会显示空页面，搜索时会替换当前页面，返回只能重启app。当前清除按钮只能清除所有设备，
:::