---
sidebar_position: 1
---


import Tag from '@site/src/components/Tag';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



# 协议方式对接(推荐)
--- 

如果还不了解, 生态合作伙伴模块的逻辑流程请阅读 [Yasee SDK 生态合作伙伴模块(协议模块) 理念剖析](yasee_third_process.md),先了解设计理念有助于更好的集成.



## 概要说明
接下来, 将分平台来带领生态合作伙伴们 如何定制自己的 `算法库` 并暴露方法给Yasee.
首先查看 Yasee 对生态合作伙伴的统一协议内容:
因此,按照目前协议约定内容,生态合作伙伴的 `算法库` 中需要包含以下能力:
1. [通过 AdvertisementData 返回 结构化数据 (MAC、自定义数据)](#1-通过-advertisementdata-返回-结构化数据-mac自定义数据)
2. [提供 服务、特征 等 基础数据](#2-数据-校验和-签名-逻辑-非必需)
3. [`外设` 上载到手机的数据 解析&并返回的能力](#3-外设-上载到手机的数据-解析并返回的能力)
4. [有清晰的 `流程控制` 步骤](#4-测量步骤控制)
5. [发送数据的能力](#5-发送数据的能力)

## 示例展示和说明

:::warning
以下内容都是 贵方(生态合作伙伴) 需要实现的内容!

:::

### 1. 通过 AdvertisementData 返回 结构化数据 (MAC、自定义数据)

对于不可变的数据(服务&特征、App发送的静态指令)可以直接提供的方式进行给予,或者 封装在自己的 `算法库` 中, 暴露出获取方法, 按照TMD生态合作伙伴模块示例(伪代码):

**Yasee方 主动调用 生态合作伙伴的 `算法库` 获取数据**, `算法库`中实现的方法中 建议硬编码方式提供; 例如:
<Tabs>
    <TabItem value="swift" label="iOS">
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
    </TabItem>
    <TabItem value="java" label="Android">
    ```java 
    /**
     * 配置信息
     * */
    private List<BleService> _sevices = Arrays.asList(
       new BleService(
         UUID.fromString("XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"),
         Arrays.asList(
           new BleService.BleCharacteristic(
             "用于App发送命令",
             UUID.fromString("XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"),
             Arrays.asList(BleService.BleCharacteristicPt.write_nores),
             true
           )
         )
       ),
        new BleService(
            UUID.fromString("XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"),
            Arrays.asList(
                new BleService.BleCharacteristic(
                    "读取&订阅通知",
                    UUID.fromString("XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"),
                    Arrays.asList(BleService.BleCharacteristicPt.read,BleService.BleCharacteristicPt.notify)
                )
            )
        )
    );
    ```
    </TabItem>
</Tabs>

### 2. 数据 校验和 签名 逻辑 (非必需)
<Tabs>
    <TabItem value="swift" label="iOS">
    ``` swift
    // 对 发送到 外设的指令或者数据 进行验证
    func sign(_ raw: [Int]) throws -> Data {
        // 生态合作伙伴的 签名逻辑
    }
    func check(_ raw: Data) throws -> Bool { 
        // 生态合作伙伴的 校验逻辑
    }
    ```
    </TabItem>
    <TabItem value="java" label="Android">
    ```java
    // 对 发送到 外设的指令或者数据 进行验证
    public class CheckSignXXX extends CheckSign {
        // 省略.....

        @Override
        public byte[] sign(byte[] raws) {
            return _sign(raws);
        }

        @Override
        public boolean check(byte[] raws) {
            return _check(raws);
        }
    }
    ```
    </TabItem>
</Tabs>

### 3. 外设 上载到手机的数据 解析&并返回的能力
数据解析 和 获取 (因与外设的交互数据为敏感数据,所以对解析过程 Yasee 不做干预,只做转发); 对于生态合作伙伴需提供可传递设备上载数据的方法;

Yasee方主动调用 `算法库` 方法; 传递设备过来的信息

<Tabs>
    <TabItem value="swift" label="iOS">
    ``` swift
    // 发送 广播数据 到 算法库; 算法库返回 结构化信息
    // 目前仅仅是获取了 MAC 信息, 不排除后期会扩展更多内容的可能性
    func mac(_ avdData: AdvertisementData?) -> String? {
        // 生态合作伙伴 获取MAC 的逻辑
    }
        
    /// 发送 设备数据 到 算法库
    func uploadData(raw: Data) throws -> [String : String] {
        // 生态合作伙伴 处理 转发的原始数据逻辑 
    }
    ```
    </TabItem>
    <TabItem value="java" label="Android">
    ```java
    /**
    * 解析指令
    * <p>分析出是什么指令 数据是什么</p>
    */
    public void uploadData(byte[] bytes);
    ```
    </TabItem>
</Tabs>

### 4. 测量步骤控制
生态合作伙伴 需要提供 测量过程中需要和用户交互的步骤; 并提供控制步骤的方法 或者 具体要发送给`外设`的指令数据

Yasee 主动获取 测量控制步骤信息; 或者直接提供控制方法并说明含义.

<Tabs>
    <TabItem value="swift" label="iOS">
    ``` swift 
    // 获取所有发送指令信息 (包含具体发送给外设的数据)
    var cmds: [Cmd] {
        return [
            Cmd(unsign: [Uint8], step: .start, desc: "开始测量"),
            ...
        ]
    }

    或者: 

    算法库提供 控制步骤的方法; 并说明方法的意义:

    start() - 开始测量
    stop()  - 停止测量

    ```
    </TabItem>
    <TabItem value="java" label="Android">
    ```java
    /**
     * 支持的指令信息
     * */
    public List<Cmd> sportCmds = Arrays.asList(
            new Cmd(
                    UUID.fromString("XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"), CmdType.start, "开始测量",new byte[0]
            ),
            ...
    );

    或者: 
    算法库提供 控制步骤的方法; 并说明方法的意义:

    void start() - 开始测量
    void stop()  - 停止测量

    ```
    </TabItem>
</Tabs>


### 5. 发送数据的能力

这里是 生态伙伴 需要 通过 Yasee 来发送数据; 

具体的实施有以下建议:
1. <Tag text="针对Android" color="red" /> 建议 生态合作伙伴创建 Interface 来发送数据; Yasee 方会实现Interface 来发送数据.

2. <Tag text="针对iOS" color="red" /> 建议 生态合作伙伴创建 Delegate 或者 block 来发送数据; Yasee 方会实现 Delegate 或者 block 来发送数据.

<Tabs>
    <TabItem value="swift" label="iOS">
    ``` swift 
    // MARK: ====================== delegate 方式 ======================
    // 生态合作方
    protocol IOInterface {
        func send(data: Data)
    }

    // Yasee 方
    extension Yasee: IOInterface {
        
        func send(data: Data) {
            // 发送数据
        }

    }


    // MARK: ====================== block 方式 ======================
    // 生态合作方 (初始化时传递 block)
    typealias IOBlock = (data: Data) -> Void
    ```
    </TabItem>
    <TabItem value="java" label="Android">
    ```java
    // 生态合作方 
    interface IOInterface {
        void send(byte[] data);
    }

    // Yasee 方
    class Yasee implements IOInterface {
        public void send(byte[] data) {
            // 发送数据
        }
    }
    ```
    </TabItem>
</Tabs>