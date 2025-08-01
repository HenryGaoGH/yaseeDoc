---
sidebar_position: 1
keywords: [Welcome, Yasee, Ecosystem Partner, SDK, Integrate, BLE, Interactive, Hook, Agreement]
---

import Tag from '@site/src/components/Tag';


# Performance report
--- 

All the following tests are based on:

- Environment distinction (severe, normal)
- Number of test devices: 4 units
- Number of tests per device: 20 times
- Number of reconnections per environment: 10 times
- For average calculation: exclude all maximum and minimum seconds


## Comparison of search numbers

<Tag text="App - Blue" color='deepskyblue' />
<Tag text="SDK(iOS) - Green" color='green' />
<Tag text="SDK(Android) - Grey" color='gray' />
**The number of devices found in each search (with 10 samples, and a unified search duration of 5 seconds),iPhone12、P40)**

### Conclusion
First, the conclusion
- Improve
    **There is a relatively significant improvement for the App👆**
- Stability
    **The improvement in stability is not obvious; the system remains generally stable, with no significant fluctuations observed**

### data and charts
![search number](/img/ios_search_num.png "search number")


## SDK VS. App connection speed

### Conclusion
First, the conclusion
- Improve
    **It has been significantly improved compared with the App**
- Stability
    **The SDK is relatively more stable; whether in normal or complex environments, connection fluctuations are minor. In normal environments, the average connection time stabilizes at around 2.1 seconds, while in complex environments, it stabilizes at approximately 2.6 seconds on average.**

### In normal environments
**Four devices underwent 20 cold starts, with the connection completion time recorded**
<Tag text="SDK - Blue" color='deepskyblue' />
<Tag text="App - Green" color='green' />
![connection speed](/img/ios_speed_sdk_app.png "connection speed")

### complex environment
:::warning
The so - called complex environment refers to a situation where in a manufacturing shop, a large number of devices are transmitting signals.
:::
**Four devices undergo 20 cold starts each; the connection completion time is recorded**

<Tag text="SDK - Blue" color='deepskyblue' />
<Tag text="App - Green" color='green' />
![connection speed](/img/ios_speed_sdk_app_kn.png "connection speed")


## Device's average speed

### Device's average speed - Normal
**Four devices undergo 20 cold starts each; record the connection completion time; and calculate the average speed of the devices**
![connection speed](/img/ios_avg.png "connection speed")


### Device's average speed - Complex
**Four devices undergo 20 cold starts each; record the connection completion time; and calculate the average speed of the devices**
![connection speed](/img/ios_avg_kn.png "connection speed")



## Body fat scale VS. TMD
<Tag text="App - Blue" color='deepskyblue' />
<Tag text="SDK - Orange" color='orange' />
<Tag text="SDK - Green" color='green' />

### Conclusion
First, conclusion:
- Stability
    **Whether in the App or the SDK, the body fat scale device performs more stably, with no significant fluctuations.;**
- Speed
    **In terms of speed, there is a significant difference; the body fat scale device is faster**
### data and charts
![Body fat scale VS. TMD](/img/ios_wl_vs_tmd.png "Body fat scale VS. TMD")


### Raw data download
- [Raw data](/files/raw_data.zip)
- [testing proportion](/excel/ios_test.xlsx)