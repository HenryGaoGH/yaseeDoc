# 欢迎您, 供应商们
--- 

在这里, 您可以了解到 Yasee 的供应商对接标准,我们提供了两种对接方式:
- 使用标准协议规范
- 使用Hook机制

两种对接方式 没有本质的区别, 作为方案商来讲,提供的信息没有差别, 
只是按照方案商更熟悉的技术方式对接

## 目录

- [协议对接方式(推荐)](third/ble_protol.md)
- [Ble Hook 方式(不推荐)](third/ble_hook.md)

## 图例,名词解释 
- 方案商提供的SDK - 算法库(之后简称 `算法库`)
- 连接的方案商ble设备(如:心电仪、脉诊、体脂等等设备),之后简称 `外设`
- Yasee SDK 提供 蓝牙的一体化管理, 之后简称 `Yasee`


## 注意事项
以供应商视角 - 目前供应商需要做的内容主要是数据提供和算法解析,抛开技术讲流程分三步走:
1. 明确提供的内容 **包含哪些**
    - 服务、特征信息 (**UUID、作用**)
    - **主动交互**的指令、数据
    - **签名、校验结果**
    - **数据解析结果**

2. 整理提供数据获取方式,并输出**调用文档**
    - 内容整合实现
    - 输出调用文档

3. 提供给 Yasee 并**连调** - 完成