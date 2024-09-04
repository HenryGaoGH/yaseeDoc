---
title: 欢迎您, 供应商们
description: 欢迎来到Yasee 文档中心
keywords: [欢迎, Yasee, 供应商, SDK, 集成, BLE, 交互, Hook, 协议]
---


# 欢迎您, 我的朋友
--- 

:::warning
本篇文章的主要目的是充当目录和导航的作用, 如果您对此了如指掌,可以忽略这部分内容;或者直接去对应模块了解详细的内容!
:::



## Yasee SDK 介绍
Yasee SDK 是一款功能强大的开发工具包，专注于智能设备的蓝牙连接和管理。是Yasee 对外开放产品的底层支持,集成了Yasee SDK,\
就可以无缝的支持 **功能清单** 中罗列的完整检测产品以及检测项目.

通过 Yasee SDK，开发者可以轻松实现设备的蓝牙连接、绑定及管理，包括搜索设备、设备重连、以及高效的设备指令收发功能。\
无论是设备的初始配置，还是后续的连接管理，Yasee SDK 都提供了全面的支持，帮助开发者快速集成和控制多种蓝牙设备，\
为用户提供流畅的智能设备体验。

集成 Yasee SDK 的优势包括：

1. **快速集成**：Yasee SDK 提供了简洁易用的接口，开发者可以快速集成蓝牙连接和设备管理功能，大大缩短开发周期。

2. **稳定可靠**：Yasee SDK 经过充分测试，能够在各种设备和环境下保持稳定的连接和高效的设备管理，确保用户体验的连续性和可靠性。

3. **全面功能**：SDK 支持设备的搜索、绑定、连接、重连及指令收发等全方位的功能，使得开发者无需额外编写复杂的逻辑，就能实现智能设备的全面控制。

4. **高兼容性**：Yasee SDK 适用于多种蓝牙设备和应用场景，提供了良好的兼容性和扩展性，帮助开发者应对多样化的需求。

5. **技术支持**：集成 SDK 后，开发者可以获得专业的技术支持，快速解决开发过程中遇到的问题，确保项目顺利推进。

通过集成 Yasee SDK，开发者不仅能够大幅提高开发效率，还能提供稳定、高效的蓝牙设备管理体验，增强产品竞争力。



## 快捷目录

这里是快捷的访问目录,可以帮助您快速到达想去的部分
<!-- - [Git 工作流程](git_process/mobile_branch.md) -->
- 直达 [Yasee SDK功能清单](#yasee-sdk-功能清单)
- 直达 [Yasee SDK(Android)](yasee_android/intro.md)
- 直达 [Yasee SDK(iOS)](yasee_ios/used_doc.md)
- 直达 [Yasee Plugin (Flutter)](yasee_flutter/used_doc.md)




## Yasee SDK 功能清单

Yasee SDK 提供了广泛的设备支持和检测功能，涵盖多个健康监测设备。SDK 目前支持 TMD 设备和体脂设备，分别可用于检测血压、尿酸、血糖、体脂等多种健康指标。TMD 设备支持包括血压、血糖、血氧、肺功能等在内的多个检测项目，体脂设备则支持 8 电极和 4 电极的体脂测量。具体设备和检测项如下所示:

### 支持设备,包含:
- [x] TMD设备 (Y906、911、916、917)
- [x] 体脂设备 (MY_SCALE、iconmon、Y900、 E263、E22017)
- [ ] ~~心电设备 (T9、M5、T20)~~

### TMD 设备支持的检测项
- [x] 血压
- [x] 尿酸
- [x] 血糖
- [x] 血酮
- [x] 血氧
- [x] 尿液
- [x] 肺功能
- [x] 血脂
- [x] 体温
- [x] 荧光
    - [x] C 反应蛋白
- [ ] 糖化血红蛋白


### 体脂 设备支持的检测项
- [x] 体脂 (8电极 & 4电极)


### ~~心电 设备支持的检测项~~
- [ ] ~~心电检测~~
- [ ] ~~动态体温检测~~


### 脉诊 设备支持的检测项
- [ ] 脉诊检测

--- 




## Yasee SDK 架构设计
为了更好的了解 Yasee SDK 的运行机制,可以查阅当前的架构设计,加深对Yasee SDK的理解.
![架构设计](/img/yasee_jgt.png)




## Yasee SDK 集成步骤

这里简要概述Yasee SDK的集成步骤, 需要注意的是: 不管是 iOS端、还是Android端亦或Flutter端 都是一样的集成步骤,以及使用方式;接下来我将带领大家串一下集成流程:
1. 明确 需要使用的集成 平台 及 平台要求
    - 如果您是 iOS 平台集成, 可以查阅 [iOS集成文档](yasee_ios/used_doc.md)
    - 如果您是 Android 平台集成, 可以查阅 [Android集成文档](yasee_android/intro.md)
    - 如果您是 Flutter 平台集成, 可以查阅 [Flutter集成文档](yasee_flutter/used_doc.md)
2. 了解 Yasee SDK 提供的功能

    - 如果您是 iOS 平台集成, 可以在此处查看Demo演示了解功能支持情况[iOS Demo演示](yasee_ios/demo.md), \
    如果您是技术人员也可以查阅 **[iOS 完整 Api 文档](http://henrygao.hopto.org/ios_doc/documentation/yasee_ios "Api 文档")**
    - 如果您是 Android 平台集成, 可以在此处查看Demo演示了解功能支持情况[Android Demo演示](yasee_android/demo_word.md), \
    如果您是技术人员也可以查阅 **[Android 完整Api文档](https://henrygaogh.github.io/yasee-doc.io/)** 
    - 如果您是 Flutter 平台集成, 可以在此处查看Demo演示了解功能支持情况[Flutter Demo演示](yasee_flutter/demo.md), \
    如果您是技术人员也可以查阅 **[Yasee Flutter Plugin Api文档](http://henrygao.hopto.org/flutter_doc/)**
3. 熟悉 Yasee 接口设计理念 以及 Api使用方式

    对于 Yasee SDK 接口设计来讲, 三端(iOS、Android、Flutter) 都保持高度的一致性, 主要包含两个要点:
    1. 完全遵循 OOP 
    2. 单一原则 SRP
    
    比如, 如果想要知道 设备连接状态怎么办?     - 找 Notify\
    想要了解绑定列表的变化怎么办?             - 找 Notify\
    想要获取设备返回来的数据怎么办?           - 找 Notify\
    是的 只要是想 获取变更 和 订阅变化 无论如何 SDK 内部都通过 Notify 做集中化处理和转发;\

    关于更多的 Notify介绍可查阅: 
    - iOS 👉 [Notify](yasee_ios/used_doc.md#通知相关内容)
    - Android 👉 [Notify](yasee_android/intro.md#通知相关内容)
    - Flutter 👉 [Notify](yasee_flutter/used_doc.md#通知相关内容)

4. 检验集成后的功能完备及测试工作

    对于 App 来讲,集成完成SDK之后 可以详细进行校验功能 和 测试.







<!-- ### Git 工作流程 -->

<!-- ## Yasee SDK(Android) -->



<!-- ## Yasee SDK(iOS) -->



<!-- ## Yasee Plugin (Flutter) -->