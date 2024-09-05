---
sidebar_position: 1
keywords: [欢迎, Yasee, 生态合作伙伴, SDK, 集成, BLE, 交互, Hook, 协议]
---

import Tag from '@site/src/components/Tag';


# 性能报告
--- 



## 搜索数量对比

<Tag text="App - 蓝色" color='deepskyblue' />
<Tag text="SDK(iOS) - 绿色" color='green' />
<Tag text="SDK(Android) - 灰色" color='gray' />
**每次搜索的设备数量(采样数 10次,统一搜索时长5S,iPhone12、P40)**

### 结论
先说结论:
- 提升
    **对于 App 有较明显 提升👆**
- 稳定性
    **稳定性提升不明显,基本都较为稳定;未出现比较大的波动情况**

### 数据 和 图表
![搜索数量](/img/ios_search_num.png "搜索数量")


## SDK VS. App 连接速度

### 结论
先说结论:
- 提升
    **相较于App有大幅提升**
- 稳定性
    **SDK 更为稳定! 无论是正常或复杂环境,连接波动不大;正常环境下平均稳定在2.1秒左右连接;复杂环境下平均稳定在2.6秒左右**

### 正常环境下
**四台设备,进行20次冷启动;记录连接完成的时间**
<Tag text="SDK - 蓝色" color='deepskyblue' />
<Tag text="App - 绿色" color='green' />
![连接速度](/img/ios_speed_sdk_app.png "连接速度")

### 复杂环境
:::warning
所谓复杂环境是 在生产车间中,非常多的设备在发射信号
:::
**四台设备,进行20次冷启动;记录连接完成的时间**

<Tag text="SDK - 蓝色" color='deepskyblue' />
<Tag text="App - 绿色" color='green' />
![连接速度](/img/ios_speed_sdk_app_kn.png "连接速度")


## 设备平均速度

### 设备平均速度 - 正常
**四台设备,进行20次冷启动;记录连接完成的时间;设备平均速度**
![连接速度](/img/ios_avg.png "连接速度")


### 设备平均速度 - 复杂
**四台设备,进行20次冷启动;记录连接完成的时间;设备平均速度**
![连接速度](/img/ios_avg_kn.png "连接速度")



## 体脂秤 VS. TMD
<Tag text="App - 蓝色" color='deepskyblue' />
<Tag text="SDK - 橙色" color='orange' />
<Tag text="SDK - 绿色" color='green' />

### 结论
先说结论:
先说结论:
- 稳定性
    **无论是在 App和SDK中 体脂秤设备表现更为稳定,无答复波动现象;**
- 速度
    **速度方面;有较大的差别! 体脂秤设备更为快速**
### 数据 图表
![体脂秤 VS. TMD](/img/ios_wl_vs_tmd.png "体脂秤 VS. TMD")


### 原始数据下载
- [原始数据](/files/raw_data.zip)
- [测试用例](/excel/ios_test.xlsx)