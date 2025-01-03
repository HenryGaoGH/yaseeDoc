---
title: 串口Demo 展示
description: 领导及同事, 这里是我们内部的文档中心,可以通过这里看我们自己的文档
keywords: [欢迎, Yasee, 同事, 领导, SDK, 集成, BLE, 交互, Hook, 协议, 玉成, 动态体温, 心电]
---

import ImgText from '@site/src/components/ImgText/ImgText';

# 串口对接 Demo 展示
---


## 现情况说明
:::danger
目前的支持的设备仅限 M10; 并且目前的检测项支持为:血糖、尿酸、血酮; 都为 **老版本**


:::
支持的检测项及计划为:
| 产品         | 功能       | 备注       |
|------------ |-----------| -----------|
| M10(PDA)    | 血糖       | 已支持     |
|             | 尿酸       | 已支持     |
|             | 血酮       | 已支持     | 
|             | 血脂       | 暂缓       |
|             | 糖化       | 暂缓       |


--- 


## 演示说明


### 进入串口测试页面
<ImgText width={160} src="/img/inner/serial_joined_page.gif" text="1. 进入Android Demo 程序<br />2. 点击右上角更多图标,点击串口测试<br />3. 进入串口测试页面" />


### 检测流程展示
<ImgText width={160} src="/img/inner/serial_checking_show.gif" text="1. 插入外挂(T5 老设备)<br />2. 插入试纸条(血糖、尿酸、血酮)<br />3. 响应串口数据并展示可视化数据" right={true}/>


### 异常展示
<ImgText width={160} src="/img/inner/serial_error_show.gif" text="1. 过程中出现错误应返回错误响应<br />" />



---


## 测试说明

### 测试准备工作
1. **老版本的 T5外挂**
2. **老版本的 血糖、尿酸、血酮试纸**
3. **M10 PDA**


### 测试内容概要
需要完成一下测试要求:
1. 串口可用性测试
2. 串口连通性测试
3. 检测项测试(血糖、尿酸、血酮); 是否完整支持
4. 流程完备性测试 (错误、返回值、等)



## Demo 工程下载

[Android Demo Apk下载](/files/yasee.apk)