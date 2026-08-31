---
sidebar_position: 0
keywords: [欢迎, Yasee, 生态合作伙伴, SDK, 集成, BLE, 交互, Hook, 协议]
---

:::danger
mock以及测试可跳转至: [SDK测试](http://localhost:3000/web_test/index.html)
:::

# Yasee JS SDK 接入说明

面向百合医 Hybrid App WebView 的 TypeScript JS SDK，用于第三方 H5 调用 Native 能力。

关于 SDK 的建设背景、平台价值和能力提升，参见 [`docs/sdk-value.md`](./wel_doc.md)。

## 安装与构建

```bash
npm install
npm run build
```

构建产物：

```text
dist/
├── index.global.js
├── index.global.js.map
├── index.js
├── index.js.map
└── index.d.ts
```

## H5 接入

### 浏览器脚本

```html
<script src="index.global.js"></script>
<script>
const yasee = window.openYasee?.default || window.openYasee;

yasee.config({ timeout: 10000 });

yasee.ready(async () => {
  const info = await yasee.app.getInfo();
  console.log(info);
});

const off = yasee.on("navigation", (data) => {
  console.log(data);
});
</script>
```

### ESM

```ts
import yasee from "yasee-js-sdk";
```

### 浏览器 Mock

普通浏览器没有 Native Bridge，需要显式开启 Mock：

```js
yasee.config({ mock: true });
yasee.ready(() => {
  yasee.ui.toast({ message: "SDK Ready" });
});
```

App WebView 中不要开启 Mock。Native Bridge 注入完成后应触发：

```js
window.dispatchEvent(new Event("YaseeSDKReady"));
```

## API

```ts
await yasee.app.getInfo();
await yasee.app.openUrlWithBrowser("https://example.com");
await yasee.app.pay(0, order); // 0 支付宝，1 微信

await yasee.ui.toast({ message: "success" });
await yasee.ui.showLoading({ message: "loading" });
await yasee.ui.hideLoading();
await yasee.ui.change({ bgColor: "#ffffff" });

await yasee.navigation.setTitle("标题");
await yasee.navigation.setBottomTabs(true);
await yasee.navigation.back({ type: "success", data: result });
await yasee.navigation.toPage({ router: "home", params: { id: 1 } });

await yasee.user.getAuth();
await yasee.user.update(user);
await yasee.user.logout();

await yasee.media.imgChoose({ count: 1, backUrl: true });
await yasee.media.imgDownload({ url: "https://example.com/image.png" });

await yasee.share.wxWeb({ title: "标题", url: "https://example.com" });
await yasee.scan.qrCode();
```


选择图片、扫码、分享和支付等用户交互 API 不设置超时。其他调用默认 10 秒超时，可通过 `yasee.config({ timeout })` 修改。

## Native 协议

Native 回调：

```js
window.__YASEE_SDK_CALLBACK__({
  callbackId,
  code: 0,
  message: "ok",
  data: {}
});
```

Native 主动事件：

```js
window.__YASEE_NATIVE_EVENT__({
  type: "navigation",
  data: {}
});
```

没有 Native Bridge 且未开启 Mock 时，调用会以 `code: -2` 拒绝；调用超时会以 `code: -1` 拒绝。
