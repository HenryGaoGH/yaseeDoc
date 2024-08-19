---
sidebar_position: 1
---

import Tag from '@site/src/components/Tag';


# 性能报告
--- 



## 搜索数量对比
<Tag text="App - 蓝色" color='deepskyblue' />
<Tag text="SDK(iOS) - 绿色" color='green' />
<Tag text="SDK(Android) - 灰色" color='gray' />
**每次搜索的设备数量(采样数 10次,统一搜索时长5S,iPhone12、P40)**
![搜索数量](/img/ios_search_num.png "搜索数量")


## SDK VS. App 连接速度

### 正常环境下
**四台设备,进行20次冷启动;记录连接完成的时间**
<Tag text="SDK - 蓝色" color='deepskyblue' />
<Tag text="App - 绿色" color='green' />
![连接速度](/img/ios_speed_sdk_app.png "连接速度")

### 复杂环境
所谓复杂环境是 在生产车间中,非常多的设备在发射信号


## 设备平均速度
**四台设备,进行20次冷启动;记录连接完成的时间;设备平均速度**
![连接速度](/img/ios_avg.png "连接速度")



## 体脂秤 VS. TMD
<Tag text="App - 蓝色" color='deepskyblue' />
<Tag text="SDK - 橙色" color='orange' />
<Tag text="SDK - 绿色" color='green' />
![体脂秤 VS. TMD](/img/ios_wl_vs_tmd.png "体脂秤 VS. TMD")