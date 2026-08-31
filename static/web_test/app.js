const yasee = window.openYasee?.default || window.openYasee;
const apiList = [
  "app.getInfo", "app.openUrlWithBrowser", "app.pay",
  "ui.toast", "ui.showLoading", "ui.hideLoading", "ui.change",
  "navigation.setTitle", "navigation.setBottomTabs", "navigation.back", "navigation.toPage",
  "user.getAuth", "user.update", "user.logout",
  "media.imgChoose", "media.imgDownload", "share.wxWeb", "scan.qrCode",
];

const sections = [
  ["基础能力", [
    button("ready", "testReady()"),
    button("support 全量检查", "testSupport()"),
    button("模拟 navigation 事件", "testNativeEvent()"),
  ]],
  ["App", [
    testCase("app.getInfo", button("调用", "invoke('app.getInfo', () => yasee.app.getInfo())")),
    testCase("app.openUrlWithBrowser", field("URL", "browser-url", "https://example.com") + button("调用", "testOpenUrl()")),
    testCase("app.pay", selectField("支付类型", "pay-type", [[0, "支付宝"], [1, "微信"]]) + field("订单号", "order-id", "demo-order-001") + button("调用", "testPay()")),
  ]],
  ["UI", [
    testCase("ui.toast", field("消息", "toast-message", "Hello Yasee SDK") + button("调用", "testToast()")),
    testCase("ui.showLoading / ui.hideLoading", field("消息", "loading-message", "加载中") + button("显示", "testShowLoading()") + button("隐藏", "invoke('ui.hideLoading', () => yasee.ui.hideLoading())")),
    testCase("ui.change", field("背景色", "bg-color", "#ffffff") + button("调用", "testUiChange()")),
  ]],
  ["Navigation", [
    testCase("navigation.setTitle", field("标题", "page-title", "Yasee Demo") + button("调用", "testSetTitle()")),
    testCase("navigation.setBottomTabs", checkbox("tabs-hidden", "隐藏 Tabs", true) + button("调用", "testBottomTabs()")),
    testCase("navigation.back", button("调用", "testBack()")),
    testCase("navigation.toPage", field("路由", "route", "home") + button("调用", "testToPage()")),
  ]],
  ["User", [
    button("user.getAuth", "invoke('user.getAuth', () => yasee.user.getAuth())"),
    button("user.update", "testUserUpdate()"),
    button("user.logout", "invoke('user.logout', () => yasee.user.logout())"),
  ]],
  ["Media", [
    testCase("media.imgChoose", field("数量", "image-count", "1", "number") + checkbox("image-back-url", "返回远端地址", true) + button("调用", "testImgChoose()")),
    testCase("media.imgDownload", field("图片 URL", "image-url", "https://example.com/image.png") + button("调用", "testImgDownload()")),
  ]],
  ["Share / Scan", [
    testCase("share.wxWeb", field("标题", "share-title", "Yasee SDK") + field("URL", "share-url", "https://example.com") + button("调用", "testShare()")),
    testCase("scan.qrCode", button("调用", "invoke('scan.qrCode', () => yasee.scan.qrCode())")),
  ]],
];

function button(text, handler) {
  return `<button type="button" onclick="${handler}">${text}</button>`;
}

function field(label, id, value, type = "text") {
  return `<label>${label}<input id="${id}" type="${type}" value="${value}"></label>`;
}

function checkbox(id, label, checked) {
  return `<label><input id="${id}" type="checkbox" ${checked ? "checked" : ""}> ${label}</label>`;
}

function selectField(label, id, options) {
  const html = options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("");
  return `<label>${label}<select id="${id}">${html}</select></label>`;
}

function testCase(name, content) {
  return `<div class="case"><strong>${name}</strong>${content}</div>`;
}

function render() {
  const sectionHtml = sections.map(([title, items]) => {
    const className = items.some((item) => item.includes('class="case"')) ? "grid" : "actions";
    return `<section><h2>${title}</h2><div class="${className}">${items.join("")}</div></section>`;
  }).join("");

  document.querySelector("#app").innerHTML = `
    <header>
      <h1>Yasee JS SDK 全量测试</h1>
      <div class="status">
        <span>SDK 版本：<strong>${yasee.version}</strong></span>
        ${checkbox("mock-mode", "浏览器 Mock 模式", !hasNativeBridge())}
        ${button("应用配置", "applyConfig()")}
        ${button("运行全部测试", "runAllTests()")}
        ${button("清空日志", "clearLogs()")}
      </div>
      <p>普通浏览器请开启 Mock；App WebView 中请关闭，以调用真实 Native Bridge。</p>
    </header>
    ${sectionHtml}
    <section id="log-panel" class="log-panel">
      <div class="log-header">
        <h2>调用日志</h2>
        <div class="log-actions">
          ${button("清空", "clearLogs()")}
          ${button("放大", "toggleLogSize()")}
          ${button("最小化", "toggleLogMinimize()")}
        </div>
      </div>
      <div id="logs">等待测试…</div>
    </section>
  `;
}

function hasNativeBridge() {
  return Boolean(window.webkit?.messageHandlers?.YaseeSDK || window.YaseeSDK?.postMessage);
}

function value(id) { return document.querySelector(`#${id}`).value; }
function checked(id) { return document.querySelector(`#${id}`).checked; }

function applyConfig() {
  const mock = checked("mock-mode");
  yasee.config({ mock, timeout: 10000 });
  log("CONFIG", { mock, timeout: 10000 }, "success");
}

function log(name, data, className = "") {
  const logs = document.querySelector("#logs");
  if (logs.textContent === "等待测试…") logs.textContent = "";
  const line = document.createElement("div");
  line.className = className;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${name}\n${JSON.stringify(data, null, 2)}\n`;
  logs.prepend(line);
}

function clearLogs() { document.querySelector("#logs").textContent = "等待测试…"; }

function toggleLogSize() {
  const panel = document.querySelector("#log-panel");
  panel.classList.remove("minimized");
  panel.classList.toggle("expanded");
  const button = panel.querySelector('.log-actions button[onclick="toggleLogSize()"]');
  button.textContent = panel.classList.contains("expanded") ? "还原" : "放大";
}

function toggleLogMinimize() {
  const panel = document.querySelector("#log-panel");
  panel.classList.toggle("minimized");
  const button = panel.querySelector('.log-actions button[onclick="toggleLogMinimize()"]');
  button.textContent = panel.classList.contains("minimized") ? "展开" : "最小化";
}

async function invoke(name, action) {
  log(`${name} REQUEST`, {});
  try {
    const response = await action();
    log(`${name} SUCCESS`, response, "success");
    return response;
  } catch (error) {
    log(`${name} ERROR`, error, "error");
    throw error;
  }
}

function testReady() { yasee.ready(() => log("ready SUCCESS", { ready: true }, "success")); }
function testSupport() {
  const result = Object.fromEntries(apiList.map((api) => [api, yasee.support(api)]));
  const passed = Object.values(result).every(Boolean);
  log(`support ${passed ? "SUCCESS" : "ERROR"}`, result, passed ? "success" : "error");
}
function testNativeEvent() { window.__YASEE_NATIVE_EVENT__({ type: "navigation", data: { route: "/demo", source: "demo" } }); }
function testOpenUrl() { return invoke("app.openUrlWithBrowser", () => yasee.app.openUrlWithBrowser(value("browser-url"))); }
function testPay() { return invoke("app.pay", () => yasee.app.pay(Number(value("pay-type")), { orderId: value("order-id"), amount: 1 })); }
function testToast() { return invoke("ui.toast", () => yasee.ui.toast({ message: value("toast-message"), duration: 2000 })); }
function testShowLoading() { return invoke("ui.showLoading", () => yasee.ui.showLoading({ message: value("loading-message") })); }
function testUiChange() { return invoke("ui.change", () => yasee.ui.change({ bgColor: value("bg-color") })); }
function testSetTitle() { return invoke("navigation.setTitle", () => yasee.navigation.setTitle(value("page-title"))); }
function testBottomTabs() { return invoke("navigation.setBottomTabs", () => yasee.navigation.setBottomTabs(checked("tabs-hidden"))); }
function testBack() { return invoke("navigation.back", () => yasee.navigation.back({ type: "demo", data: { success: true } })); }
function testToPage() { return invoke("navigation.toPage", () => yasee.navigation.toPage({ router: value("route"), params: { source: "sdk-demo" } })); }
function testUserUpdate() { return invoke("user.update", () => yasee.user.update({ nickname: "SDK Demo User", source: "demo" })); }
function testImgChoose() { return invoke("media.imgChoose", () => yasee.media.imgChoose({ count: Number(value("image-count")), backUrl: checked("image-back-url") })); }
function testImgDownload() { return invoke("media.imgDownload", () => yasee.media.imgDownload({ url: value("image-url") })); }
function testShare() { return invoke("share.wxWeb", () => yasee.share.wxWeb({ title: value("share-title"), desc: "Yasee JS SDK Demo", url: value("share-url") })); }

async function runAllTests() {
  testReady();
  testSupport();
  const tests = [
    ["app.getInfo", () => yasee.app.getInfo()],
    ["app.openUrlWithBrowser", () => yasee.app.openUrlWithBrowser(value("browser-url"))],
    ["app.pay", () => yasee.app.pay(Number(value("pay-type")), { orderId: value("order-id"), amount: 1 })],
    ["ui.toast", () => yasee.ui.toast({ message: value("toast-message"), duration: 2000 })],
    ["ui.showLoading", () => yasee.ui.showLoading({ message: value("loading-message") })],
    ["ui.hideLoading", () => yasee.ui.hideLoading()],
    ["ui.change", () => yasee.ui.change({ bgColor: value("bg-color") })],
    ["navigation.setTitle", () => yasee.navigation.setTitle(value("page-title"))],
    ["navigation.setBottomTabs", () => yasee.navigation.setBottomTabs(checked("tabs-hidden"))],
    ["navigation.back", () => yasee.navigation.back({ type: "demo", data: { success: true } })],
    ["navigation.toPage", () => yasee.navigation.toPage({ router: value("route"), params: { source: "sdk-demo" } })],
    ["user.getAuth", () => yasee.user.getAuth()],
    ["user.update", () => yasee.user.update({ nickname: "SDK Demo User" })],
    ["user.logout", () => yasee.user.logout()],
    ["media.imgChoose", () => yasee.media.imgChoose({ count: Number(value("image-count")), backUrl: checked("image-back-url") })],
    ["media.imgDownload", () => yasee.media.imgDownload({ url: value("image-url") })],
    ["share.wxWeb", () => yasee.share.wxWeb({ title: value("share-title"), url: value("share-url") })],
    ["scan.qrCode", () => yasee.scan.qrCode()],
  ];

  const results = [];
  for (const [name, action] of tests) {
    try {
      await invoke(name, action);
      results.push({ name, passed: true });
    } catch (error) {
      results.push({ name, passed: false, error });
    }
  }
  const passed = results.filter((result) => result.passed).length;
  log("ALL TESTS COMPLETE", { total: results.length, passed, failed: results.length - passed }, passed === results.length ? "success" : "error");
}

render();
applyConfig();
yasee.on("navigation", (data) => log("EVENT navigation", data, "success"));
