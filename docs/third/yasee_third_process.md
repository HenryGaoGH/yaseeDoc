---
sidebar_position: 1
---


import Tag from '@site/src/components/Tag';



# Yasee SDK 生态合作伙伴模块(协议模块) 理念剖析
--- 


## 导读
为了更好的令生态合作伙伴集成进入Yasee SDK体系,本片文档会根据目前的Yasee协议模块部分分析和说明


## 概要说明
对于接入通讯交互流程中,需要关注的部分如下:
1. AdvertisementData 数据处理 (广播数据)
2. 服务特征列表 (包含什么服务、特征,分别是干什么用的)
3. 交互数据的解析 (主要是 硬件上传过程中的数据)
4. App 发送到 外设 的数据
5. 签名、校验


因此, 协议流程 需要 三方提供以上数据获取的方法, 并出具调用文档,

综述 - <Tag color="orange" text="生态合作伙伴,需要做的内容" /> 为: 

封装自己的算法库(之后简称 `算法库`),其中包含如下功能: 
1. Yasee 提供 AdvertisementData 数据 传递给 算法库, 算法库经过处理之后返回 `有用的信息(例如:MAC地址、功能列表、等等自定义信息)` 给 Yasee,
2. 获取设备的服务特征列表,此过程可直接提供,也可 暴露方法获取
3. **交互数据解析** - 算法库提供数据解析功能, Yasee 端提供硬件设备上传的原始数据给到 算法库, 算法库返回解析后的结构化数据给Yasee. Yasee 不干预解析过程
4. `算法库` 需要发送给 `外设` 的数据, 可直接提供,也可 调用获取.
5. 签名、校验, `Yasee` 提供与 `外设` 交互产生的原始数据, `算法库` 返回是不是校验通过

--- 


## 整体流程

- <Tag color="green" text="绿色部分为 - 生态合作伙伴需要做的内容" />
- <Tag color="orange" text="橙色部分为 - 协议对接方式 需要双方处理部分" />
- <Tag color="gray" text="其余部分为 - Yasee 已完成内容" />


![对接流程图鉴](/img/yasee_fangan_link.png "对接流程图鉴")
