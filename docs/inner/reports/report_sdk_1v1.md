---
title: 防盗用&含过期 SDK 专用
description: 领导及同事, 这里是我们内部的文档中心,可以通过这里看我们自己的文档
keywords: [欢迎, Yasee, 同事, 领导, SDK, 集成, BLE, 交互, Hook, 协议, 玉成, 动态体温, 心电]
---

import Tag from '@site/src/components/Tag';

# 防盗用&含过期 专用SDK 


## 简要说明
目前随着下游客户的增多; Yasee SDK下载和滥用的风险增加; 希望建立一个专用的防盗用&含过期 SDK。来专门用于某个B端下游客户.

目前; 已通过 构建云服务、动态构建apk、签发license的方式; 为客户提供防盗用&含过期的SDK。

签发的 **SDK** 具有以下特点:
- 专门为 某个 B端客户App构建; 不同的App 不可使用; 做到了 1对1 的 防盗用作用
- 包含 过期时间; 在过期时间内 正常使用SDK; 过期之后 不可用
- 完全离线可用; 无需联网



## 整体流程
![](/img/inner/report_sdk_1v1.png)


## 需要做的事情(Yasee)
- [ ] 搭建 开放平台 (Yasee); 提供B端客户 注册、登陆、注册应用、下载SDK
- [ ] 搭建 云构建服务器; 高质量的动态构建 apk; 并对apk、license 进行签发
- [ ] Yasee SDK 内容 防盗用、过期、串改 等措施