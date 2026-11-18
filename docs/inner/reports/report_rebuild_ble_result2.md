---
title: Android BLE 多设备连接 3 秒 READY 可控性验证报告
description: Android BLE 多设备连接 3 秒 READY 可控性验证报告
keywords: [Android, BLE, GATT, 多设备, 并发连接, 多线程, 3秒, SLO, 重构]
---


import ImgText from '@site/src/components/ImgText/ImgText'; 
import Tag from '@site/src/components/Tag'; 
import Row from '@site/src/components/Row';
import ChartLine from '@site/src/components/ChartLine';
import ChartBar from '@site/src/components/ChartBar';
import HDetail from '@site/src/components/HDetail';
import CsvTable from '@site/src/components/CsvTable';

# Android BLE 多设备连接 3 秒 READY 可控性验证报告

**文档类型：** 技术验证与评审报告  
**验证对象：** Android BLE SDK、多设备连接、自研 BLE 硬件  
**核心指标：** 3 秒内达到业务 READY 状态  
**测试状态：** 待测试  
**版本：** V1.1  
**日期：** 2026-11-16

---


# 00 | 优化措施


随着 Android 终端连接 BLE 设备数量增加，设备扫描、GATT 建连、服务发现、Notification 订阅及业务初始化等环节可能对整体 READY 时间产生影响。

本次专项验证围绕 Android BLE 多设备连接场景，评估连接链路性能及应用层对 READY 时间的控制能力。

考虑到自研 Android BLE SDK 主要是对 Android 原生 BLE API 的轻量封装，本次不再单独开展 SDK 与 Android 原生 API 的性能 A/B 对照测试，而是将重点放在 SDK 基础功能正确性、硬件性能差异、Android 终端差异、多设备并发能力及 3 秒 READY 可控性上。




## 0.1 | 优化内容
主要做减法 和 职责拆分:
### 新增
1. <Tag text={"新增"} /> `BlesLinkScheduler` 调度管理; 负责 连接、重连、任务编排、时机控制(后台、前台)
2. <Tag text={"新增"} /> 前后台应用识别; 控制 调度 逻辑; 后台停止一切重连、任务执行; 保持已连接的 IO.
3. <Tag text={"新增"} /> IO Queue 增加 read 入列; 
4. <Tag text={"新增"} /> 连接过程中; 因服务 和 特征 设置导致的重连后置; 
5. <Tag text={"新增"} /> 最大并发连接数(3)、 超时设置(3)

### 移除
1. <Tag text={"移除"} color="red" /> `linkQueue` 控制连接独立线程
2. <Tag text={"移除"} color="red" /> 指数退避; 度绝 历史退避等待几秒甚至几十秒才连接的情况
3. <Tag text={"移除"} color="red" /> 频繁 申请设备连接






# 01｜测试背景与目的

## 1.1 测试背景

随着 Android 终端连接 BLE 设备数量增加，设备扫描、GATT 建连、服务发现、Notification 订阅及业务初始化等环节可能对整体 READY 时间产生影响。

本次专项验证围绕 Android BLE 多设备连接场景，评估连接链路性能及应用层对 READY 时间的控制能力。

考虑到自研 Android BLE SDK 主要是对 Android 原生 BLE API 的轻量封装，本次不再单独开展 SDK 与 Android 原生 API 的性能 A/B 对照测试，而是将重点放在 SDK 基础功能正确性、硬件性能差异、Android 终端差异、多设备并发能力及 3 秒 READY 可控性上。


## 1.2 单设备 连接性能

### 说明
当前 测试 包含 对一个设备的连接情况说明. 
测试次数 同为 20次; 每次连接时长限制为 10秒(按照3s限制 重试 3次左右)

**设备**
- 手机: Pixel 7 Pro (Android 17)
- 体脂称设备 (E263)
- 血压设备 (Y917)


### 结论

体脂称设备 连接性能较好; 大部分可在 **1.121s** 左右实现 Redy 状态. **无 超时、错误**情况.

血压设备 稍慢; 大部分 **1.835s** 实现 Redy状态; 有**3次**超时 **1次**错误.

**数据信息**
<ChartBar
  data={[
    { 
      label: 'E263', 
      measurements: [
        {name: "E263-平均",value: 1.121,color: 'green'},
        {name: "E263-超时次数",value: 0,color: 'orange'},
        {name: "E263-错误次数",value: 0,color: 'red'},
      ] 
    },
    { 
      label: 'Y917', 
      measurements: [
        {name: "Y917-平均",value: 1.835,color: 'green'},
        {name: "Y917-超时次数",value: 3,color: 'orange'},
        {name: "Y917-错误次数",value: 1,color: 'red'},
      ] 
    },
  ]}
/>


### 测试原始数据
- Y917[原始数据](/excel/single_Y917_8656.csv); 
- E263[原始数据](/excel/single_e263_0054.csv); 
<HDetail>
  <Row>
    <CsvTable src="/excel/single_Y917_8656.csv" />
    <CsvTable src="/excel/single_e263_0054.csv" />
  </Row>
</HDetail>




## 1.3 4台设备 连接性能

### 说明
当前 测试 包含 对4台设备的连接情况说明. 
测试次数 同为 23次; 每次连接时长限制为 10秒 (按照3s限制 重试 3次左右)

**设备: **
- 手机: Pixel 7 Pro (Android 17)
- 体脂称设备 (E263)
- 血压设备 (Y917)
- 脉诊设备 (MIWD北京方案)
- 主机设备 (Y906)


### 结论
体脂称、脉诊设备 连接性能较好; 大部分可在 **1.5s 内** 实现 Redy 状态. 无超时现象; 均有两次 GATT错误捕捉; 立马进行重连整体未超过 3s

其次为Y906主机; 连接性能尚可; 大部分在 **2s 内** 实现 Redy 状态. **2次**超时;快速重连; 未捕捉到 GATT错误

血压设备 稍慢; 部分可在 **2.3s 内** 实现 Redy状态; **9次**超时; **2次** 连续超时; **6秒未连接上**. 未捕捉到 GATT错误

<ChartBar
  data={[
    { 
      label: '平均时长', 
      measurements: [
        {name: "Y906",value: 1.548,color: 'pink'},
        {name: "E263",value: 1.306,color: 'green'},
        {name: "MIWD",value: 0.681,color: 'blue'},
        {name: "Y917",value: 2.044,color: 'red'},
      ] 
    },
    { 
      label: '超时次数', 
      measurements: [
        {name: "Y906",value: 2,color: 'pink'},
        {name: "E263",value: 0,color: 'green'},
        {name: "MIWD",value: 0,color: 'blue'},
        {name: "Y917",value: 9,color: 'red'},
      ] 
    },
    { 
      label: '错误次数', 
      measurements: [
        {name: "Y906",value: 1,color: 'pink'},
        {name: "E263",value: 2,color: 'green'},
        {name: "MIWD",value: 2,color: 'blue'},
        {name: "Y917",value: 0,color: 'red'},
      ] 
    },
  ]}
/>


### 测试原始数据
测试原始数据: [原始数据](/excel/four_links.csv)
<HDetail>
  <CsvTable src="/excel/four_links.csv" />
</HDetail>



## 1.4 4台相同设备 连接性能


### 说明
当前 测试 包含 对4台设备的连接情况说明. 
测试次数 同为 20次; 每次连接时长限制为 20秒(按照3s限制 重试 6次左右)

**设备:**
- Pixel 7 Pro
- 4台 血压设备 (Y917)
- 4台 Y906主机
- 4台 心之声设备


### 结论

Y906主机设备 连接性能相对较好; 大部分可在 **2s 内** 实现 Redy 状态. **2次**超时情况; 捕捉到**1次**GATT错误;

Y917设备 连接情况稍可; 大部分可在 **2s 内** 实现 Redy状态; **33次**超时情况; 仅捕捉到**1次**GATT错误;

EAIECG心电设备 连接情况稍慢; 大部分可在 **3s 内** 实现 Redy状态; 如下分为两种情况:
1. 监督时长 **3s**: **60次**超时情况; 每台设备均有不同数量的超时.  仅捕捉到**2次**GATT错误;
2. 监督时长 **4s**: **11次**超时情况; 每台设备均有少量超时.  未捕捉到GATT错误;

EAIECG设备; 通过增加 监督时长; 可明显改善 超时情况.

**Y906**
<ChartBar
  data={[
    { 
      label: '平均时长', 
      measurements: [
        {name: "00DE",value: 1.559,color: 'pink'},
        {name: "00A8",value: 1.640,color: 'pink'},
        {name: "05E5",value: 1.363,color: 'pink'},
        {name: "0001",value: 2.035,color: 'pink'},
        {name: "sum-avg",value: 1.649,color: 'red'},
      ] 
    },
    { 
      label: '超时次数', 
      measurements: [
        {name: "00DE",value: 0,color: 'pink'},
        {name: "00A8",value: 1,color: 'pink'},
        {name: "05E5",value: 1,color: 'pink'},
        {name: "0001",value: 0,color: 'pink'},
        {name: "sum",value: 2,color: 'orange'},
      ] 
    },
    { 
      label: '错误次数', 
      measurements: [
        {name: "00DE",value: 0,color: 'pink'},
        {name: "00A8",value: 0,color: 'pink'},
        {name: "05E5",value: 1,color: 'pink'},
        {name: "0001",value: 0,color: 'pink'},
        {name: "sum",value: 1,color: 'orange'},
      ] 
    },
  ]}
/>


**Y917**
<ChartBar
  data={[
    { 
      label: '平均时长', 
      measurements: [
        {name: "887C",value: 1.199,color: 'green'},
        {name: "8656",value: 1.852,color: 'green'},
        {name: "1182",value: 1.197,color: 'green'},
        {name: "9948",value: 2.092,color: 'green'},
        {name: "sum-avg",value: 1.591,color: 'red'},
      ] 
    },
    { 
      label: '超时次数', 
      measurements: [
        {name: "887C",value: 1,color: 'green'},
        {name: "8656",value: 15,color: 'green'},
        {name: "1182",value: 1,color: 'green'},
        {name: "9948",value: 16,color: 'green'},
        {name: "sum",value: 33,color: 'orange'},
      ] 
    },
    { 
      label: '错误次数', 
      measurements: [
        {name: "887C",value: 0,color: 'green'},
        {name: "8656",value: 0,color: 'green'},
        {name: "1182",value: 1,color: 'green'},
        {name: "9948",value: 0,color: 'green'},
        {name: "sum",value: 1,color: 'orange'},
      ] 
    },
  ]}
/>


**EAIECG(心电 监督超时 3s、13次)**
<ChartBar
  data={[
    { 
      label: '平均时长', 
      measurements: [
        {name: "00E3",value: 2.182,color: 'blue'},
        {name: "004C",value: 2.593,color: 'blue'},
        {name: "0116",value: 2.546,color: 'blue'},
        {name: "00E9",value: 2.709,color: 'blue'},
        {name: "sum-avg",value: 2.444,color: 'red'},
      ] 
    },
    { 
      label: '超时次数', 
      measurements: [
        {name: "00E3",value: 2,color: 'blue'},
        {name: "004C",value: 15,color: 'blue'},
        {name: "0116",value: 27,color: 'blue'},
        {name: "00E9",value: 15,color: 'blue'},
        {name: "sum",value: 60,color: 'red'},
      ] 
    },
    { 
      label: '错误次数', 
      measurements: [
        {name: "00E3",value: 0,color: 'blue'},
        {name: "004C",value: 0,color: 'blue'},
        {name: "0116",value: 2,color: 'blue'},
        {name: "00E9",value: 0,color: 'blue'},
        {name: "sum",value: 2,color: 'red'},
      ] 
    },
  ]}
/>

**EAIECG(心电 监督超时 4s、13次)**
<ChartBar
  data={[
    { 
      label: '平均时长', 
      measurements: [
        {name: "00E3",value: 2.669,color: 'blue'},
        {name: "004C",value: 3.231,color: 'blue'},
        {name: "0116",value: 2.081,color: 'blue'},
        {name: "00E9",value: 2.746,color: 'blue'},
        {name: "sum-avg",value: 2.682,color: 'red'},
      ] 
    },
    { 
      label: '超时次数', 
      measurements: [
        {name: "00E3",value: 5,color: 'blue'},
        {name: "004C",value: 1,color: 'blue'},
        {name: "0116",value: 1,color: 'blue'},
        {name: "00E9",value: 3,color: 'blue'},
        {name: "sum",value: 11,color: 'red'},
      ] 
    },
    { 
      label: '错误次数', 
      measurements: [
        {name: "00E3",value: 0,color: 'blue'},
        {name: "004C",value: 0,color: 'blue'},
        {name: "0116",value: 0,color: 'blue'},
        {name: "00E9",value: 0,color: 'blue'},
        {name: "sum",value: 0,color: 'red'},
      ] 
    },
  ]}
/>


### 测试原始数据
- [原始数据-917](/excel/four_eq_d1.csv)
- [原始数据-906](/excel/four_eq_m9.csv)
- [原始数据-ecg-3s](/excel/four_eq_ecg_3s.csv)
- [原始数据-ecg-4s](/excel/four_eq_ecg_4s.csv)


<HDetail>
    <Row>
        <CsvTable src="/excel/four_eq_d1.csv" />
        <CsvTable src="/excel/four_eq_m9.csv" />
        <CsvTable src="/excel/four_eq_ecg_3s.csv" />
        <CsvTable src="/excel/four_eq_ecg_4s.csv" />
    </Row>
</HDetail>






## 1.5 多机型; 4台设备 验证

### 说明
当前 测试 包含 对一个设备的连接情况说明. 

主机设备: 
- 体脂称设备 (E263)
- 血压设备 (Y917)
- 脉诊设备 (MIWD北京方案)
- 主机设备 (Y906)

手机设备:
- 华为 HLK-AL00 (Android 10)
- Pixel 7 Pro (Android 17)
- 红米 Pad (Android 14)

测试次数 同为 20次; 每次连接时长限制为 10秒(按照3s限制 重试 3次左右)

### 结论:

在华为手机、Android10中; 连接速度相对稍差, 可在 **3秒内**完成连接. 超时次数 **很高 数量为41次**; 主要集中在 Y906 设备, 有 **1次**捕捉到 GATT错误.

在谷歌手机、Android15中; 连接速度相对较好, 可在 **2.5秒内**完成连接. 超时次数较少 **数量为2次**; 主要集中在 Y906 设备, 未捕捉到 GATT错误.

在红米Pad手机、Android13中; 连接速度相对较好, 可在 **2.5秒内**完成连接. 超时次数较少 **数量为1次**; 主要集中在 Y906 设备, 有**2次**捕捉到 GATT错误.


**连接速度**
<ChartBar
  data={[
    { 
      label: '华为 HLK-AL00', 
      measurements: [
        {name: "E263",value: 1.694,color: 'green'},
        {name: "Y917",value: 1.452,color: 'red'},
        {name: "Y906",value: 2.257,color: 'pink'},
        {name: "MIWD",value: 1.309,color: 'blue'},
      ] 
    },
    { 
      label: 'Pixel 7 Pro', 
      measurements: [
        {name: "E263",value: 1.371,color: 'green'},
        {name: "Y917",value: 1.731,color: 'red'},
        {name: "Y906",value: 1.325,color: 'pink'},
        {name: "MIWD",value: 0.618,color: 'blue'},
      ] 
    },
    { 
      label: '红米 Pad', 
      measurements: [
        {name: "E263",value: 1.974,color: 'green'},
        {name: "Y917",value: 1.662,color: 'red'},
        {name: "Y906",value: 1.721,color: 'pink'},
        {name: "MIWD",value: 0.798,color: 'blue'},
      ] 
    },
  ]}
/>

**超时次数**
<ChartBar
  data={[
    { 
      label: '华为 HLK-AL00', 
      measurements: [
        {name: "E263",value: 0,color: 'green'},
        {name: "Y917",value: 4,color: 'red'},
        {name: "Y906",value: 41,color: 'pink'},
        {name: "MIWD",value: 0,color: 'blue'},
      ] 
    },
    { 
      label: 'Pixel 7 Pro', 
      measurements: [
        {name: "E263",value: 0,color: 'green'},
        {name: "Y917",value: 0,color: 'red'},
        {name: "Y906",value: 2,color: 'pink'},
        {name: "MIWD",value: 0,color: 'blue'},
      ] 
    },
    { 
      label: '红米 Pad', 
      measurements: [
        {name: "E263",value: 0,color: 'green'},
        {name: "Y917",value: 2,color: 'red'},
        {name: "Y906",value: 1,color: 'pink'},
        {name: "MIWD",value: 0,color: 'blue'},
      ] 
    },
  ]}
/>


**错误次数**
<ChartBar
  data={[
    { 
      label: '华为 HLK-AL00', 
      measurements: [
        {name: "E263",value: 0,color: 'green'},
        {name: "Y917",value: 4,color: 'red'},
        {name: "Y906",value: 0,color: 'pink'},
        {name: "MIWD",value: 0,color: 'blue'},
      ] 
    },
    { 
      label: 'Pixel 7 Pro', 
      measurements: [
        {name: "E263",value: 0,color: 'green'},
        {name: "Y917",value: 0,color: 'red'},
        {name: "Y906",value: 0,color: 'pink'},
        {name: "MIWD",value: 0,color: 'blue'},
      ] 
    },
    { 
      label: '红米 Pad', 
      measurements: [
        {name: "E263",value: 0,color: 'green'},
        {name: "Y917",value: 2,color: 'red'},
        {name: "Y906",value: 0,color: 'pink'},
        {name: "MIWD",value: 0,color: 'blue'},
      ] 
    },
  ]}
/>


### 测试原始数据: 
- [原始数据-红米Pad](/excel/four_phone_xm.csv) 
- [原始数据-Pixel7p](/excel/four_phone_p7.csv)
- [原始数据-华为](/excel/four_phone_hw.csv)

<HDetail>
    <Row>
        <CsvTable src="/excel/four_phone_xm.csv" />
        <CsvTable src="/excel/four_phone_p7.csv" />
        <CsvTable src="/excel/four_phone_hw.csv" />
    </Row>
</HDetail>


## 1.6 其他App 对比

当前的验证有局限性; 不能完整说明问题.仅供参考.

按照 10轮测试; 测出数据为 10 条;



### 信息


**设备说明**

手机: Pixel 7 Pro
App: 阿福、 Demo(SDK)
阿福款体脂秤、E263(百合医款)


**时间说明**

阿福时间统计说明: 等待体脂秤自然熄屏; App测 展示正在连接中
E263时间统计: 严格按照 日志统计时间计算





<ChartBar
  data={[
    { 
      label: 'E263', 
      measurements: [
        {name: "阿福",value: 2.23,color: 'red'},
        {name: "Demo",value: 2.23,color: 'green'},
      ] 
    },
  ]}
/>




## 总结

基于当前测试数据，可以得出以下结论。

### 1. 总体结论

本次重构通过引入 `BlesLinkScheduler`、限制最大并发连接数、统一连接超时与快速重试策略，并移除独立 `linkQueue` 和指数退避，提升了连接任务的可调度性和失败后的恢复速度。测试中大多数设备能够在 **3 秒内进入 READY 状态**，说明当前方案已具备将多数连接过程控制在 3 秒目标范围内的能力。

但 **3 秒 READY 目前只能作为调度目标和 SLO，不能作为所有设备、手机和并发场景下的绝对保证**。BLE 建连、服务发现、特征读取、Notification 订阅及设备侧握手均受 Android 蓝牙栈、手机型号、设备固件和无线环境影响，应用层无法为每个阶段提供固定的完成时间。

### 2. 主要测试发现

1. **单设备连接整体稳定。** E263 平均约 **1.121 秒**，测试中未出现超时或错误；Y917 平均约 **1.835 秒**，但出现 3 次超时和 1 次错误，表明不同硬件的连接稳定性存在明显差异。
2. **四台异构设备并发连接基本可控。** E263、MIWD 和 Y906 的平均 READY 时间均在约 2 秒以内；Y917 平均约 **2.044 秒**，但超时次数明显更多，并出现连续重试后 6 秒仍未连接成功的情况，是当前混合设备场景中的主要风险点。
3. **同型号设备批量连接会放大硬件差异。** 四台 Y906 的总体表现较稳定；四台 Y917 虽然成功样本的平均时间约 **1.591 秒**，但累计出现 33 次超时。说明平均耗时不能单独反映连接质量，还必须结合超时率、重试次数和最终成功率评估。
4. **EAIECG 不适合统一使用 3 秒监督阈值。** 其连接过程本身更接近 3 秒，3 秒监督条件下累计出现 60 次超时；将阈值调整为 4 秒后，超时下降至 11 次。对连接链路较长的设备，应根据设备类型配置差异化超时，而不是强制使用统一阈值。
5. **Android 终端差异显著。** Pixel 7 Pro 和红米 Pad 上的四设备连接整体较好；华为 HLK-AL00（Android 10）上的超时明显增加，尤其集中在 Y906。由此可见，Android 系统版本、厂商蓝牙栈和终端性能会直接影响 READY 时间及重连频率。
6. **GATT 错误不是超时的唯一原因。** 多组测试中存在大量超时，但捕获到的 GATT 错误较少。这说明部分失败可能发生在回调延迟、服务发现、特征操作、设备应答或状态未正确推进等环节，后续不能只依赖 GATT status 判断连接异常。

### 3. 对 3 秒 READY 目标的判断

综合当前样本，3 秒 READY 目标可按以下方式理解：

- 对 E263、MIWD、Y906 等表现较稳定的设备，**3 秒可作为默认连接监督时长**。
- 对 Y917，应继续优化设备侧响应和 SDK 状态推进，并重点关注连续超时及个别设备差异。
- 对 EAIECG 等链路耗时较长的设备，建议采用 **4 秒或按设备类型配置的监督时长**。
- 当首次连接超过监督时长时，调度器应快速释放本次任务并重试，避免单个设备长期占用连接槽位。
- 业务层应区分“单次 3 秒超时”和“最终连接失败”：前者表示本轮连接未达到 SLO，后者应在达到最大重试次数或总时间预算后再确认。

因此，本次验证支持的结论是：**重构后的 SDK 能够对连接顺序、并发数量、超时和重试进行有效控制，多数场景可以在 3 秒内 READY；但无法仅依靠 Android 应用层保证所有设备始终在 3 秒内完成连接。**

### 4. 后续优化建议

1. 可动态调整 监督时长、最大重试次数、重试间隔和最大并发数. 
2. 将连接过程扫描发现、GATT 建连、服务发现、Notification 订阅、设备握手和业务 READY 等阶段，记录 完整 ring 次数; 并上报; 依托业务测给予 用户提示; 并附加操作指南;
<!--3. 对 Y917、EAIECG 以及华为 Android 10 场景扩大样本量，并开展长时间循环、前后台切换、蓝牙开关切换、弱信号和多设备重连测试。-->
<!--5. 补充设备固件版本、手机系统版本、信号强度和失败阶段等测试信息，确认异常来自 Android 蓝牙栈、SDK 调度还是设备端响应。-->
<!--6. 持续验证后台停止新连接和重连、前台恢复调度、已连接设备 IO 保持等新增机制，避免生命周期切换引入重复连接或任务丢失。-->

### 5. 验证边界

本次测试设备数量、手机型号、系统版本和执行轮次仍然有限，“其他 App 对比”也只有单一设备样本，因此相关数据仅用于判断当前优化方向，不足以形成行业级性能对比。后续应在统一环境、统一计时口径和更大样本量下持续回归，再确定各设备型号的正式 SLO 与上线阈值。
