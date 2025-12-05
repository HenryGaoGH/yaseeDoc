---
sidebar_position: 3
---

import ImgText from '@site/src/components/ImgText/ImgText';
import Tag from '@site/src/components/Tag';

# Yasee Debug Tool User Guide (Apk)
--- 

## Glossary

In the following content, frequently used terms are uniformly defined as:
- <Tag text="Host Device" color="red" /> Standalone devices
    1. D-series devices
    2. E-series devices (ecosystem products)
    3. M-series devices
- <Tag text="Peripheral Device" color="pink" /> Devices requiring host support
    1. T-series devices
- <Tag text="App" color="black" /> Official Yasee App (BaiHeYi)

## Overview of Features

### Bluetooth
    - [x] Scan & connect to Yasee-supported devices (self-developed/partner products)
    - [x] View supported test items & interactive commands for each product
    - [x] Monitor communication between App and host device
        - Raw communication data (hex)
        - Visualized data 
            - Process stage information
            - Detailed error messages
            - Test-specific details
            - etc.

### Serial Port
    - [x] View supported test items & interactive commands for each product
    - [x] Monitor communication between App and host device
        - Raw communication data (hex)
        - Visualized data 
            - Process stage information
            - Detailed error messages
            - Test-specific details
            - etc.

### WI-FI (Not currently supported)

## Preparations
:::warning
**! The debug tool lacks the robustness of the full App. Ensure the following are active before use: !**
:::

- **Enable Bluetooth permissions**
- **Turn on Bluetooth**
- **Enable location permissions (required on some devices)**
- **Enable file permissions (required on some devices)**

## Feature Demonstration

<Tag text="Bluetooth" color='deepskyblue' />
--- 

### Display Instructions
<ImgText width={230} src={"/img/android_demo_overview.png"} cotents={[
    "1. Communication mode toggle - Switch between communication modes",
    "2. Ble scan results - Displays Bluetooth search results; tap 'Bind & Connect' to pair",
    "3. Direct connect area - Connect devices via MAC address",
    "4. Filter button - Filter devices by manufacturer",
    "5. Search button - Scan all Yasee-supported devices",
]} />

### Connected Device Page & Test Items & Interactive Commands
<ImgText width={230} src={"/img/android_demo_link_device.gif"} cotents={[
    "1. Tap device to connect; enter device details page upon success",
    "2. Bottom section shows supported test items; tap to view interactive commands",
    "3. Tap test item to see its interactive command list",
    "4. Tap interactive command to view communication data",
    "5. Communication data helps troubleshoot issues and analyze processes",
]} right />

--- 

<Tag text="Serial Port" color='deepskyblue' /> 
--- 
<ImgText width={230} src={"/img/android_demo_serial_process.gif"} cotents={[
    "Currently only supports M10; test items include blood glucose, uric acid, ketone, etc.",
    "1. Tap serial port mode button - Enter serial port details page",
    "2. Bottom section shows supported test items; tap to view interactive commands",
    "3. Tap test item to see its interactive command list",
    "4. Tap interactive command to view communication data",
    "5. Communication data helps troubleshoot issues and analyze processes",
]} />

--- 

<Tag text="General Features" color='deepskyblue' />
--- 

### Viewing Communication Data
<ImgText right width={230} src={"/img/android_demo_check_flow.png"} cotents={[
    "1. Communication data helps troubleshoot issues and analyze processes",
    "2. Each complete command includes start and end flags",
    "3. Raw frame data (hex) - For hardware/embedded developers",
    "4. Visualized data - Simplified for testers/non-technical users",
    "5. Key meanings:</br> start - Test begins; </br> end - Test ends;</br> countDown - Waiting period (pressure, countdown, real-time);</br> result - Test results;</br> error - Error messages;</br> message - Notifications;</br> battery - Power status;</br> pwd - Password info;",
]} />

--- 

## Demo Project Download 
[Link to](download)
