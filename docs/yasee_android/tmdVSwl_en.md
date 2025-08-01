
# TMD VS. Body Fat Scale
---

## Test Description
The SDK has observed significantly faster connection speeds with body fat scales compared to TMD devices. This issue is currently under testing, covering the following scenarios:
    - **Speed**: Bluetooth module connection speed comparison (body fat scale vs. our device)
    - **State**: Immediately after power-on | After 30 minutes of operation
    - **Environment**: Interference (hardware operating frequency interference) vs. Normal conditions
    - **Device**: Same smartphone (Honor), identical central device (BLE)

## **⬇️ Performance Metrics ⬇️**

### Speed: Bluetooth Module Connection Speed Comparison (Body Fat Scale vs. Our Device)
Connection time comparison for 4 different machine models:
- **Case 1**: Connection time statistics for 4 devices in office environment  
![Case 1: Connection time in office environment](/img/tmdvswl_linke.png "Case 1: Office environment connection times")

- **Case 2**: Connection time comparison when phone uses same-frequency WiFi (2.4GHz)  
Bluetooth operates at 2.4GHz. When WiFi switches between 5GHz/2.4GHz, same-frequency interference affects Bluetooth connection time and stability.  
![Case 2: Same-frequency WiFi interference test](/img/tmdvswlfuza.png "Case 2: Same-frequency interference impact")

### State: Immediately After Power-on vs. After 30 Minutes Operation (TMD devices only)
Connection time comparison between freshly powered devices and devices running for 30 minutes.  
![State: Newly powered vs. post-30min operation](/img/tmdvswl_time.png "Power state impact on connection")

## Summary
Current tests show body fat scales have significantly faster connection speeds and higher stability than TMD devices when powered on. TMD devices exhibit longer connection times regardless of power-on state, though both maintain normal detection stability.  
- **Body Fat Scales**: Consistently connect within **2 seconds**, demonstrating stronger interference resistance  
- **TMD Devices**: Average connection time under **6 seconds**, with weaker interference resistance  

See test report details below. Download [Raw Measurement Data](/excel/tmd_vs_wl.xlsx) for complete datasets.
