---
sidebar_position: 2
---

import Tag from '@site/src/components/Tag';
import ImgText from '@site/src/components/ImgText/ImgText';


# 物料送寄规范
---  

## 说明
:::danger
!!! 重要说明

在生态合作设备的使用过程中,需要将**合作设备**送寄到Yasee,以便于Yasee对设备进行检测,因此需要对设备进行送寄规范说明。
:::


## 规范内容

生态方(贵方) 在邮寄合作设备时,需要提供如下信息(必要):

![产品名称表](/img/ship_spec.png)

- **生态合作规范名称(主要为蓝牙名称)**

    双方无特殊沟通外; 生态合作规范名称为: E(贵方型号名称)-([MAC|IMEI|SN]后四位); 例如:

    - **蓝牙设备**

        贵方设备之前的型号为: ATSF-0127; 贵方MAC地址为: 00:11:22:33:44:55; 
    
        则生态合作规范名称为: <Tag text="EATSF-4455" color="green" />

    - **4G、Wi-Fi设备**

        贵方设备之前的型号为: ATSF-0127(也作为Wi-Fi名称); 贵方IMEI地址为: 123456789012345; 
    
        则生态合作规范名称为: <Tag text="EATSF-2345" color="green" />

    - **其余可作为唯一性标识**

        贵方设备之前的型号为: ATSF-0127; 贵方可作为唯一性标识的信息为: 123456789012345; 
    
        则生态合作规范名称为: <Tag text="EATSF-2345" color="green" />

- **产品二维码(双方约定的二维码; 非单方已有二维码)**

    二维码内容为固定格式,格式为(只需变更dt、mac信息): 

    https://wechat.yasee.com.cn/wxLogin/#/csc?dt=上诉产品名称&mac=唯一性标识信息

    上诉产品名称为: 参考[生态合作规范名称](#规范内容)

    唯一性标识信息为: **MAC、IMEI、SN、其他可作为唯一性标识的信息**



- **UDI码 (出入库必要信息)**

:::danger
UDI码 需要每一个产品不同; 并需要在邮寄中附带!
:::
    

## 产品随附文件示例

![产品随附文件示例](/img/ship_spec_wuliao.png)