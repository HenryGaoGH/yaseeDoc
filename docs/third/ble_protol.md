---
sidebar_position: 1
---


import Tag from '@site/src/components/Tag';



# 协议方式对接(推荐)
--- 

如果还不了解, 生态合作伙伴模块的逻辑流程请阅读 [Yasee SDK 生态合作伙伴模块(协议模块) 理念剖析](yasee_third_process.md),先了解设计理念有助于更好的集成.



## 概要说明
接下来, 将分平台来带领生态合作伙伴们 如何定制自己的 `算法库` 并暴露方法给Yasee.
首先查看 Yasee 对生态合作伙伴的统一协议内容:
因此,按照目前协议约定内容,生态合作伙伴的 `算法库` 中需要包含以下能力:
1. 通过 AdvertisementData 获取 MAC地址的能力
2. `外设` 上传的数据解析能力
3. 对 上传、发送数据的签名、校验能力
4. 服务、特征的基础数据
5. 发送的数据内容

## 示例展示和说明
1. 对于不可变的数据(服务&特征、App发送的静态指令)可以直接提供的方式进行给予,或者 封装在自己的 `算法库` 中, 暴露出获取方法, 按照TMD生态合作伙伴模块示例:
```swift
// 对于 静态数据内容
// 服务 & 特征 按照 直接提供的方式由 Yasee 直接硬编码到模块中
var service: [BleService] {[
    BleService(uuid: UUID(uuidString: "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")!, chars: [
        BleChars("用于App发送命令","XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",.writeCmd),
        BleChars("用于App接收 Notify 数据","XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",.notifyCmd),
    ]),
    BleService(uuid: UUID(uuidString: "XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")!, chars: [
        BleChars("设备制造商的信息","XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",.read),
        BleChars("设备型号信息","XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",.read),
        BleChars("序列号信息","XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",.read),
    ]),
]}

```
2. 数据 校验和 签名 逻辑 (非必需)
``` swift
// 对 发送到 外设的指令或者数据 进行验证
func sign(_ raw: [Int]) throws -> Data {
    // 生态合作伙伴的 签名逻辑
}
func check(_ raw: Data) throws -> Bool { 
    // 生态合作伙伴的 校验逻辑
}
```

3. 数据解析 和 获取 (因与外设的交互数据为敏感数据,所以对解析过程 Yasee 不做干预,只做转发)
``` swift
// 目前仅仅是获取了 MAC 信息, 不排除后期会扩展更多内容的可能性
func mac(_ avdData: AdvertisementData?) -> String? {
    // 生态合作伙伴 获取MAC 的逻辑
}
    
/// 获取交互数据
func data(raw: Data) throws -> [String : String] {
    // 生态合作伙伴 处理 转发的原始数据逻辑 
}
```

4. 指令发送
``` swift 
获取所有发送指令信息
func cmds() {
    return [
        Cmd(unsign: [Uint8], step: .start, desc: "开始测量"),
        Cmd(unsign: [Uint8], step: .end, desc: "结束测量"),
    ]
}
```