import Tag from '@site/src/components/Tag';

# 资源下载
---
:::info

包含了以下内容:

- [x] FrameWork文件
- [x] DEMO 工程文件
:::

---


## SDK-最新版本
**建议对接前使用 Demo 体验或者查阅本文档**

### [点击下载: 0.9.395](/files/ios_0_9_395/yasee_ios.framework.zip)

#### 更新内容
- <Tag text="新增" color="green" /> 增加混淆注入规则
- <Tag text="优化" color="orange" /> Demo 优化 ECG 三导数据的独立展示
- <Tag text="优化" color="orange" /> 优化心电多通道独立数据处理
- <Tag text="新增" color="green" /> 增加 ECG 解析策略，实现多端对齐

---

## SDK-历史版本

### [点击下载: 0.9.394](/files/ios_0_9_394/yasee_ios.framework.zip)

#### 更新内容

##### 设备与协议支持
- <Tag text="新增" color="green" /> 增加对 YB15B 设备的支持
- <Tag text="新增" color="green" /> 支持 EPC01 心电设备

##### 对码流程
- <Tag text="修复" color="red" /> 修复三合一设备对码无 code 的问题
- <Tag text="优化" color="orange" /> 更新血脂对码错误信息
- <Tag text="优化" color="orange" /> 血脂、糖化在插入流程（83）不再上报 code，统一在 `pwd` 流程上报；三合一设备保持不变

##### 依赖更新
- <Tag text="其他" color="gray" /> 其他细节优化

### [点击下载: 0.9.384](/files/ios_0_9_384/yasee_ios.framework.zip)

#### 优化内容:
- <Tag text="新增" color="green" /> 更新糖化、血脂对码支持
- <Tag text="新增" color="green" /> 3导心电断点续测的支持
- <Tag text="优化" color="orange" /> ECG 整合版本（统一调用体验）
- <Tag text="优化" color="orange" /> gson 循环解析（串口设备）
- <Tag text="优化" color="orange" /> 更新康云 SDK，增加对心 opencv 库支持

### [点击下载: 0.9.342](/files/ios_0_9_342/yasee_ios.framework.zip)

### [点击下载: 0.9.338](/files/ios_0_9_338/yasee_ios.framework.zip)

#### 优化内容:
- <Tag text="优化" color="green" /> 血压错误 Code 对应和解决方案说明~




---


## Demo-工程

### 最新Demo
- [iOS-0.9.338](/files/yasee_ios_demo.zip)

### 历史版本



---



## 三方Frameworks

- opencv
- Zxing
- IC
- Hlw
- MedicalTest

[Frameworks](/files/thirds.zip)


---
