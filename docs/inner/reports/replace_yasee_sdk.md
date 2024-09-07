---
title: Yasee SDK 替换报告
description: 领导及同事, 这里是我们内部的文档中心,可以通过这里看我们自己的文档
keywords: [欢迎, Yasee, 同事, 领导, SDK, 集成, BLE, 交互, Hook, 协议]
---

import ImgText from '@site/src/components/ImgText/ImgText';

# Yasee SDK 替换分析报告


## 输出目标
出具 详细并合理的分析报告, 得出以下建议内容结论:

1. 明确出替换 Yasee SDK 带来哪些 [**修改内容**](#需要修改的内容有哪些)
2. 明确使用 Yasee SDK 采用的 [**新架构设计**](#架构设计)
3. 决定采用 哪一种替换方案; 目前两种:
    - [**直接替换**](#直接替换)
    - [**A/B替换**](#ab-替换-采用ab测试的理念)





## 需要修改的内容有哪些:
1. 页面 - 绑定列表
2. 页面 - 搜索列表
3. 页面 - 所有检测项的弹窗 (需要 进行 provider替换)
4. 逻辑 - 检测项流程交互逻辑
5. 逻辑 - 监听蓝牙状态接口

## 架构设计
对于新的架构 需要满足以下能力:
1. 采用 App 级别状态控制
2. 独立封装 检测流程 控制单元
3. 提升视图层级为一等 (任何视图下都可响应测量过程 和 控制测量过程)
4. 跨层级 数据共享传递
5. 统一 数据获取源(绑定设备列表)

![替换SDK架构设计](/img/inner/inner_replace_sdk_architecture.png "替换SDK架构设计")


## 扩展能力体现 (新SDK下 支持 的额外扩展功能)
    - 多设备同时检测
    - 全局蓝牙开关检测 (无须额外代码)
    - 全局数据接收发送的能力

多设备同时检测:

<ImgText text="多设备同时检测" src="/img/inner/global_data.gif" width={100} />


<ImgText text="全局蓝牙开关检测 (无须额外代码):" src="/img/inner/global_ble_state.gif" right={true} width={100} />


<ImgText text="全局数据接收发送的能力" src="/img/inner/more_devices.gif" width={100} />




## 替换方案

对于两种方式而言, 心电目前的情况为维持现状, 不做修改

### 直接替换
    顾名思义,直接替换掉 TMD设备支持的检测项 和 体脂 部分的 的底层实现
    
### A/B 替换 (采用A/B测试的理念)
    在新迭代中 一部分 应用商店 上线 Yasee SDK 底层的 百合医App; 另一部分 采用原来的方式 继续运行;
    在规定的时间范围内, 得出 Yasee SDK 稳定性的 报告; 继而再全面替换






