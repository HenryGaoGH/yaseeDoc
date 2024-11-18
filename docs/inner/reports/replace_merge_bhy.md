---
title: 合并百合医方案
description: 领导及同事, 这里是我们内部的文档中心,可以通过这里看我们自己的文档
keywords: [欢迎, Yasee, 同事, 领导, SDK, 集成, BLE, 交互, Hook, 协议]
---

import Tag from '@site/src/components/Tag'; 

# 百合医 合并


## 现状分析

目前百合医分为两个版本:
1. 目前正常迭代版本 (业务版本)  - 以下简称 **业务版**
2. Yasee SDK 替换完毕的版本   -  以下简称 **新版**

其中 **新版** 和 **业务版** 差别两个 迭代内容, 具体内容主要为:
1. IM替换版本 
2. 众测版本 
3. 颗粒度较小的修改(文字、提示、颜色等等)
4. 删减、位移的部分内容.

其中 差异化 内容包含如下:
- <Tag text="新增" color="#009ad6" />
- <Tag text="删除" color="green" />
- <Tag text="修改" color="gray" />

![两个版本差异化分析](/img/inner/diff_new_old.png)



欲合并冲突文件分析:
- <Tag text="Dart" color="#009ad6" />
- <Tag text="pbxproj" color="green" />
- <Tag text="png" color="gray" />
- <Tag text="svg" color="orange" />
- <Tag text="xcscheme" color="red" />
- <Tag text="yaml" color="#8552a1" />
![欲合并冲突文件分析](/img/inner/diff_u.png)





## 原始记录信息
- [main_expo 记录](/files/main_expo_log.log)
- [最新版本 记录](/files/main_expo_log.log)




## 方案

从以下方面考虑:
- 时间方面
    1. 业务版本上线时间 (预计本周二)
    2. 新版(三合一插拔新指令 SDK 集成, 预计周一完成)
优先保证线上版本发布时间节点.

- 需求完成程度
    1. 尽可能在各自分支中处理完成 需求功能, 尽可能的避免需求交叉.


因此,得出如下内容:
1. 合并时间 预计为 **本周二(11月19号)**, 合并时间预计为 2天
2. 保证 各自 需求尽量完善