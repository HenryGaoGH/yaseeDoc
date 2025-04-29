//
//  ICBluetoothSystem.h
//  ICDeviceManager
//
//  Created by symons on 2023/3/8.
//  Copyright © 2023 Symons. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ICDeviceManager/ICModels_Inc.h>

NS_ASSUME_NONNULL_BEGIN

/**
 特征模型
 */
@interface ICOPBleCharacteristic :NSObject
/**
 特征号
 */
@property (nonatomic, strong) NSString *characteristicUuid;

/**
 特征属性, 直接赋值系统Characteristic的properties就可以了
 */
@property (nonatomic, assign) NSUInteger property;

@end



typedef NS_ENUM(NSUInteger, ICOPBleWriteDataType) {
    /**
     * 写入数据有回调
     **/
    ICOPBleWriteDataTypeWriteWithResponse,

    /**
     * 写入数据无回调
     **/
    ICOPBleWriteDataTypeWriteWithoutResponse,
};


/**
 蓝牙事件回调
 */
@protocol ICBluetoothDelegate <NSObject>

/**
 蓝牙状态回调
 */
- (void)onBleState:(ICBleState)state;

/**
 扫描到的设备回调
 */
- (void)onScanResult:(NSString *)deviceId advertisementData:(NSDictionary<NSString *,id> *)advertisementData rssi:(NSInteger)rssi;

/**
 连接状态回调
 */
- (void)onConnectionStateChange:(NSString *)deviceId connectState:(ICDeviceConnectState)connectState;

/**
 设备服务列表回调
 */
- (void)onServicesDiscovered:(NSString *)deviceId serviceUuids:(NSArray<NSString *> *)serviceUuids;

/**
 设备特征列表回调
 */
- (void)onCharacteristicsDiscovered:(NSString *)deviceId  serviceUuid:(NSString *)serviceUuid characteristics:(NSArray<ICOPBleCharacteristic *> *)characteristics;

/**
 设备数据上传回调
 */
- (void)onCharacteristicUploadData:(NSString *)deviceId  serviceUuid:(NSString *)serviceUuid characteristicUuid:(NSString *)characteristicUuid data:(NSData *)data;

/**
 设备写入结果回调，仅ICOPBleWriteDataTypeWriteWithResponse才有此回调，与Android不一样
 */
- (void)onCharacteristicWrite:(NSString *)deviceId  serviceUuid:(NSString *)serviceUuid characteristicUuid:(NSString *)characteristicUuid success:(BOOL)success;

/**
 信号值回调
 */
- (void)onUploadRssi:(NSString *)deviceId  rssi:(NSInteger)rssi;

/**
 MTU回调,在特征列表回调后，android是根据调用状态回调
 */
- (void)onMtuChanged:(NSString *)deviceId  mtu:(NSInteger)mtu success:(BOOL)success;

/**
 特征使能回调
 */
- (void)onUpdateNotificationState:(NSString *)deviceId serviceUuid:(NSString *)serviceUuid characteristicUuid:(NSString *)characteristicUuid enable:(BOOL)enable success:(BOOL)success;


@end


/**
 蓝牙系统
 */
@interface ICBluetoothSystem : NSObject

/**
 蓝牙回调接口
 */
@property (nonatomic, strong) id<ICBluetoothDelegate> bleDelegate;


/**
 初始化
 */
- (void)initBluetooth:(id<ICBluetoothDelegate>)bleDelegate;

/**
 重置蓝牙管理器，不会释放
 */
- (void)resetBLE;

/**
 反初始化
 */
- (void)deInit;

/**
 停止蓝牙广播
 */
- (void)stopAdvertising;

/**
 开启蓝牙广播
 */
- (void)startAdvertising:(NSArray<NSData *> *)broadcastDatas;

/**
 开启扫描
 */
- (void)startScan:(NSArray<NSString *> *)uuids;

/**
 停止扫描
 */
- (void)stopScan;

/**
 连接设备
 */
- (void)connnect:(NSString *)deviceId;

/**
 断开设备
 */
- (void)disConnnect:(NSString *)deviceId;

/**
 发现服务
 */
- (void)discoverServices:(NSString *)deviceId;

/**
 发现特征
 */
- (void)discoverCharacteristics:(NSString *)deviceId serviceUuid:(NSString *)serviceUuid;

/**
 读取数据
 */
- (void)readData:(NSString *)deviceId serviceUuid:(NSString *)serviceUuid characteristicUuid:(NSString *)characteristicUuid;

/**
 写入数据
 */
- (void)writeData:(NSString *)deviceId serviceUuid:(NSString *)serviceUuid  characteristicUuid:(NSString *)characteristicUuid data:(NSData *)data writeDataType:(ICOPBleWriteDataType)writeDataType;

/**
 使能特征
 */
- (void)setNotify:(NSString *)deviceId serviceUuid:(NSString *)serviceUuid  characteristicUuid:(NSString *)characteristicUuid enable:(BOOL)enable;

/**
 读取信号值
 */
- (void)readRSSI:(NSString *)deviceId;

/**
 请求MTU
 */
- (void)requestMtu:(NSString *)deviceId;

@end

NS_ASSUME_NONNULL_END
