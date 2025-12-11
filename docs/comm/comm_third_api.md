


# 线上分析接口



:::danger

当前为免费测试环境的接口说明; 生产环境使用 请商务联系取得.
:::



## 拥有线上分析能力的检测项
- [x] 脉诊
- [x] ECG(动态心电)
---

## 接口相关说明

### 环境配置
| API环境 | 地址 |
|:----:|:----:|
| 测试环境 | https://test.yasee.com.cn |
| 生产环境 |  **商务联系取得**  |



## 分析接口(文档)


### 脉诊

脉诊分为两个步骤: 
1. 分析接口, 将脉诊数据上报; 供服务端分析
2. 获取分析结果, 获取分析完成的报告

#### 上报分析

API路由:  
`bio/pca/getReport`

参数:
```json
/// Key:Value - String:String 所有键值均为 String 类型
{
  // ===== Yasee 提供
  "pcKey":                "联系Yasee取得",
  "appid":                "联系Yasee取得",
  "security":             "联系Yasee取得",
  "niu":                  "通过 SDK 获取到的原始数据",
  // ====== 自有业务系统传递👇
  "name":                 "调用方 用户名字",
  "serialno":             "设备 编号",
  "deviceId":             "设备 MAC",
  "branch":               "调用方标识(可自行定义)",
  "sampleRate":           155,
  "app_isSmoking":        "是否抽烟",
  "app_isDrinking":       "是否喝酒",
  "app_healthQuestion":   "健康问题", //json str
  "app_otherHealthQuestion":  "其他问题", // json str
  "app_height":           "身高",
  "app_weight":           "体重",
}
```


#### 获取分析

API路由:  
` admin/yaseedealer/getPulse?appid=*******&pulseId=********* `

参数:
```json
// 路由参数为准
{
  "appid":                "联系Yasee取得",
  "pulseId":              "上报接口返回得到",
}
```


### 心电


![线上分析接口](/img/thrid_api.png "线上分析接口")
