//
//  BloodConnection.h
//


#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

@protocol BleConnectionDelegate;
@protocol ECGDataDelegate;

@interface BleConnection : NSObject

@property (weak, nonatomic) id<BleConnectionDelegate> delegate;
@property (weak, nonatomic) id<ECGDataDelegate> ecgDataDelegate;

@property (assign, nonatomic, readonly) BOOL isConnectedHM503Device;
@property (assign, nonatomic, readonly) BOOL isReceivingDataHM503Device;

@property (nonatomic, copy) NSString *connectedSn;//⚠️连接成功后，请赋值（SDK内部存储数据需要标识）

/** 发送命令超时时间(秒)，默认3s，可按需调整*/
@property (nonatomic,assign)float sendOrderTimeoutSec;


/// 初始化单例
+ (instancetype)sharedConnection;

///获取版本号
+ (NSString *)SDKVersion;

/** 需要发现的服务及对应的监听特征, 内容如下
 @[
 @{
    @"service":@"01ff0100-ba5e-f4ee-5ca1-eb1e5e4b1ce1",
    @"characteristics":@[@"01ff0101-ba5e-f4ee-5ca1-eb1e5e4b1ce1"]
 },
 @{
    @"service":@"180F",
    @"characteristics":@[@"2A19"]
 },
 ];
 */
+ (NSArray<NSDictionary*> *)getECGServiceCharacteristicInfos;

/**
 输入系统蓝牙扫描的信息，返回解析后的信息
 @{
 @"localName":@"T1xxxx",
 @"battery":@100, //0-100,-1为当前的电量值无效
 @"RSSI":@(-50)
 }
 */
+ (NSDictionary *)scanPeripheralInfoWithPeripheralName:(NSString *)peripheralName advertisementData:(NSDictionary *)advertisementData  RSSI:(NSNumber *)RSSI;

/// 已连接蓝牙设备的序列号（单设备操作，勿同时连接多个设备）
//- (void)connectedSn:(NSString *)sn;//请直接设置connectedSn属性
/// 当前设备断开连接调用
- (void)disconnected;

///接收蓝牙数据
- (void)inputBleValueForCharacteristicValue:(NSData *)characteristicValue;

/** 采集命令
 一般开发可根据需求直接灵活调用，
 [self HM503B1ModeWithCommand:0 countNum:30];  == [self HM503B1FastModeWithSecond:30];
 [self HM503B1ModeWithCommand:5 countNum:0]; == [self HM503B1DynamicModeWithIsOneDay:YES];
 [self HM503B1ModeWithCommand:2 countNum:0]; == [self HM503B1DynamicModeWithIsOneDay:NO;
 
 countNum(流水)
 command(状态字段)：
 0：快速模式
 1：监护模式
 2：睡眠监测
 3：运动监测
 4：历史数据上传，可指定流水数开始传输，countNum:0时，历史数据从头接收。
 5：动态模式(24小时)
 6：72 小时模式
 7：7天动态
 99(0x63)：停止当前模式(流水号为0是停止，流水号为1是清理动态存储的数据)
 100(0x64)：查询总包数 0xffffffff 获取包数
 TA长程模式用睡眠模式进行（上传时为9）
 */
- (void)HM503B1ModeWithCommand:(NSInteger)command countNum:(NSInteger)countNum;

/// 开始静态心电测量（快速模式）
/// @param second 测量秒数，通常30s,60s,180s（SDK内部会加3秒，用于测量前准备）
- (void)HM503B1FastModeWithSecond:(NSInteger)second;

/// 开始动态心电测量
/// @param isOneDay YES：进行24小时测量任务，时间到时，设备自动停止测量； NO：不限测量时长，需主动发命令停止，或设备电量耗尽自动关机停止测量
- (void)HM503B1DynamicModeWithIsOneDay:(BOOL)isOneDay;

/// 停止当前的模式
- (void)HM503B1ModeStop;

/// 清理设备中的动态数据，T1设备清理大概需要1分钟，TA/TB/TC/TD大概3分钟。数据清理时，实时数据流水号为0。
/// 发起动态测量时，如若设备中有动态数据，会自动清理后，开始测量，不用执行此方法。此方法的应用场景是接收完数据，确认无误后，再执行此方法，下次开始测量时，不会有清理过程。清理过程发起测量，清理完后，实时数据中的流水号开始增加。
- (void)HM503B1ModeClear;

/** 获取存储在心电设备的历史数据，T1, TA设备可用（可存储数据）。HM503B1ModeWithCommand中，用模式2/5/6/7测量，会存储数据。
 isContinue：是否继续接收数据（即续传）。NO：从头接收数据，YES：从上次继续接收。如果切换设备使用，请从头接收，赋值NO。
 */
- (void)HM503B1GetDynamicECGDataWithIsContinue:(BOOL)isContinue;
/** 0x64 重启命令 */
- (void)HM503B1Reset;
/** 开始升级 */
- (void)HM503B1UpgradeStartWithUpgradeData:(NSData *)upgradeData;
/** 停止升级 */
- (void)stopUpgrade;
/** 获取设备信息命令 版本号（ 定标 ）*/
- (void)HM503B1GetVersion;

/**获取静态心电数据（快速模式：设备端不存数据），上传服务端文件后缀 ecg
 takeTime:测量开始时间，1970距开始测量的秒数
 isFastMode:是否快速模式，具体见命令下发方法说明 HM503B1ModeWithCommand
 返回值在如下代理获取
 - (void)ECGDataStaticResultWithECGData:(NSData *)ecgData heartRate:(int)heartRate partWave:(NSString *)partWave
 */
- (void)handleStaticECGDataWithTimeIntervalSince1970:(NSTimeInterval)takeTime isFastMode:(BOOL)isFastMode;
/**清理手机上的静态心电数据，使用完数据请清理。单次任务未完成前，请勿切换设备*/
- (void)clearStaticECGData;
/**获取动态心电数据（睡眠模式：设备端存数据），上传服务端文件后缀 z */
- (void)handleDynamicECGData;
/**清理手机上的动态心电数据，使用完数据请清理。若切换设备时，请清理数据*/
- (void)clearDynamicECGData;


/// 控制是否输出日志，默认关闭
/// - Parameter isOpen: YES：开启  NO：关闭
- (void)HM503B1LogIsOpen:(BOOL)isOpen;
// 文件默认存储路径 /Documents/HLWECGSDKLog/baseLog.log ，未设置路径时，日志会存入baseLog.log中。可按自身需要，定期清理。
/**开始日志写入 fileName为文件名，无需带后缀，下同*/
- (void)HM503B1LogStartWithFileName:(NSString *)fileName;
/**根据文件名获取日志NSData utf-8编码 注意对空值的判断 */
- (NSData *)HM503B1LogGetWithFileName:(NSString *)fileName;
/**删除指定文件*/
- (void)HM503B1LogDeleteWithFileName:(NSString *)fileName;
/** 删除所有文件 isDeleteBaseLog:是否也删除baseLog，yes:删除并重建*/
- (void)HM503B1LogDeleteAllWithIsDeleteBaseLog:(BOOL)isDeleteBaseLog;
/**查询文件大小(字节数) 文件不存在也返回0 */
- (double)HM503B1LogFileSizeWithFileName:(NSString *)fileName;
/**获取当前所存的文件名列表*/
- (NSArray *)HM503B1LogFileList;

@end


@protocol BleConnectionDelegate <NSObject>

@optional

/**
 实时连接状态
 battery：电量
 isLeadOff：导联是否脱落
 RR：呼吸率(仅在睡眠监测下有效)
 moving：体动标志: (仅在睡眠监测下有效) 0 没动，>0代表体重幅度
 sleepPosture：睡姿：角度或标志值
 temperature：温度值，0 <= temperature <= 65535有效，temperature / 100.f为实际值（摄氏度）
 step：当前步数，运动模式可用
 ecgData：数据指针
 dataLength：数据长度（一般为125，即每秒有250个点的数据）
 countNum：当前流水号，从0开始，已采集时长秒数=countNum/2+1
 heartRate：心率
 isComing：是否正在测量中
 */
- (void)bleConnection:(BleConnection *)connection didSuccessBattery:(int)battery isLeadOff:(BOOL)isLeadOff RR:(int)RR moving:(int)moving sleepPosture:(int)sleepPosture temperature:(int)temperature step:(int)step ecgData:(int *)ecgData dataLength:(int)dataLength countNum:(int)countNum heartRate:(int)heartRate isComing:(BOOL)isComing;
//获取版本号
- (void)bleConnection:(BleConnection *)connection didGetVersion:(NSString *)version;
//升级完成情况 //state: 0：升级中 1：成功 2：失败
- (void)bleConnection:(BleConnection *)connection upgradeOfUploadingProgress:(float)uploadingProgress state:(int)state;

/**
 数据接收进度
 unECGCount：当前非心电包数
 ECGCount：当前心电包数
 UnECGAllCount：总非心电包数
 ECGAllCount：总心电包数
 progress：当前接收进度，接收完成即为1
 needSec：当前接收完所需秒数
 isFinished：是否完成
 */
- (void)bleConnection:(BleConnection *)connection didReceivedUnEcgCount:(NSUInteger)unEcgCount ecgCount:(NSUInteger)ecgCount unEcgAllCount:(NSUInteger)unEcgAllCount ecgAllCount:(NSUInteger)ecgAllCount progress:(float)progress needSec:(int)needSec isFinished:(BOOL)isFinished;

/** 传输历史数据过程中的电量，大概1分钟传一次 */
- (void)bleConnection:(BleConnection *)connection batteryOfTransporting:(int)battery;

/** 各命令下发，设备回应是否超时
 comType:命令类型（0x22实时数据不监听）
    0x21://采集命令 0x22://心电数据传输命令(实时数据) 0x23://获取设备信息命令:可获得1mV校准值，版本号 0x24://历史数据补发 0x26://传输历史数据
    0x27://升级包发送
    0x28://升级结束请求 ， state 1：成功 2：失败 0/其他：需补发 命令响应可能会超过3秒
    0x52://SN码
    0x65://历史传输时的电量信息(设备主动发)
    state:个别命令需要用到状态值(0x21对应的模式值：0：快速测量   1：监护模式 2：睡眠监测   3：运动监测   4：历史数据上传,可指定流水数开始传输  99(0x63)：停止当前模式；)
 isTimeout:命令响应是否超时
 */
- (void)bleConnection:(BleConnection *)connection sendOrderResultWithIsTimeout:(BOOL)isTimeout comType:(Byte)comType state:(Byte)state;

/// 执行命令时，生成向设备写入的蓝牙数据
/// - Parameters:
///   - data: 发给蓝牙的完整数据，⚠️--外部执行发送方法时，超过20字节的命令,要分开多次发送
/// 发数据特征：01ff0101-ba5e-f4ee-5ca1-eb1e5e4b1ce1 CBCharacteristicWriteWithoutResponse
- (void)bleConnection:(BleConnection *)connection sendOrderData:(NSData *)data;


@end

@protocol ECGDataDelegate <NSObject>

@optional

/// 静态心电数据返回值
/// @param ecgData 处理后的心电数据，可直接上传服务端，后缀名用 ecg
/// @param heartRate 心率
/// @param partWave 3秒片段心电
/// @param length 数据时长(秒数)。 返回-1时，代表本地无数据或数据过短（本地存储的数据包不足10s）
- (void)ECGDataStaticResultWithECGData:(NSData *)ecgData heartRate:(int)heartRate partWave:(NSString *)partWave length:(int)length;


/// 动态心电数据返回值
/// @param ecgData 处理后的心电数据，可直接上传服务端，后缀名用 z
/// @param fileUnEcgLen 非心电数据字节长度
/// @param length 数据时长(秒数)。 返回-1时，代表本地无数据或数据过短（本地存储的数据包不足120s）
- (void)ECGDataDynamicResultWithECGData:(NSData *)ecgData fileUnEcgLen:(int)fileUnEcgLen length:(int)length;

@end
