import Tag from '@site/src/components/Tag';

# 资源下载
---
:::info

包含了以下内容:

- [x] SDK(AAR)文件
- [x] DEMO 工程文件
- [x] DEMO APK 文件
:::

---


## SDK-最新版本
**建议对接前使用 Demo体验或者查阅本文档**
### [点击下载: 0.9.300](/files/aar_0_9_300/aar/yasee-release.aar)
新增功能:
- <Tag text="优化" color="green" /> 白细胞 WI-FI新权限声明 
- <Tag text="优化" color="green" /> 设备管理模块 断开、更新、绑定等功能 
- <Tag text="优化" color="green" /> 糖化 错误信息 和 倒计时 
- <Tag text="优化" color="green" /> BLE重连逻辑 (独立线程处理)
- <Tag text="优化" color="green" /> ble 连接&断开操作到 主线程中
- <Tag text="修复" color="red" /> 部分检测项(已知脉诊)byte 转换帧数据不对 crash 问题
- ~**弃用**~ 异步管理器
- <Tag text="优化" color="green" /> 血脂拔条逻辑; 拔出不会报错;并可以继续测量流程
- <Tag text="增加" color="orange" /> 写入响应超时 (send 指令之后 3s内无任何响应; 报错)



## SDK-历史版本

### [点击下载: 0.9.292](/files/yasee-0.9.292.aar)
新增功能:
- 拍照识别 CRP试纸功能
- 血脂拔出试纸 不中断测量
- 动态体温 Y920、YS1
- 动态血糖 Y921、YC01
- 脉诊增加型号支持: YMZ01、YMZ02
- ...  

### [点击下载: 0.9.289](/files/yasee.aar)
常规优化...




## Demo-工程
---
- [DEMO PROJECT](/files/android_demo.zip)





## DEMO-APK-下载
---

- [APK-0.9.300](/files/apk_0_9_300/app-release.apk)


### 历史版本
- ...
