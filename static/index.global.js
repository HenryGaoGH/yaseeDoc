"use strict";
var openYasee = (() => {
  var i = Object.defineProperty;
  var f = Object.getOwnPropertyDescriptor;
  var I = Object.getOwnPropertyNames;
  var y = Object.prototype.hasOwnProperty;
  var _ = (t, e) => {
      for (var n in e) i(t, n, { get: e[n], enumerable: !0 });
    },
    L = (t, e, n, r) => {
      if ((e && typeof e == "object") || typeof e == "function")
        for (let a of I(e))
          !y.call(t, a) &&
            a !== n &&
            i(t, a, {
              get: () => e[a],
              enumerable: !(r = f(e, a)) || r.enumerable,
            });
      return t;
    };
  var S = (t) => L(i({}, "__esModule", { value: !0 }), t);
  var K = {};
  _(K, { default: () => C });
  var s = class {
      constructor() {
        this.callbacks = new Map();
        this.callbackId = 0;
        window.__YASEE_SDK_CALLBACK__ = this.handleCallback.bind(this);
      }
      createCallbackId() {
        return (this.callbackId++, `cb_${Date.now()}_${this.callbackId}`);
      }
      invoke(e, n, r) {
        return new Promise((a, v) => {
          let d = this.createCallbackId();
          this.callbacks.set(d, { resolve: a, reject: v });
          let w = { callbackId: d, module: e, method: n, params: r };
          this.postMessage(w);
        });
      }
      postMessage(e) {
        var n, r, a;
        if (
          (r = (n = window.webkit) == null ? void 0 : n.messageHandlers) !=
            null &&
          r.YaseeSDK
        ) {
          window.webkit.messageHandlers.YaseeSDK.postMessage(e);
          return;
        }
        if ((a = window.YaseeSDK) != null && a.postMessage) {
          window.YaseeSDK.postMessage(JSON.stringify(e));
          return;
        }
        (console.warn("[YaseeSDK] mock bridge mode"),
          setTimeout(() => {
            window.__YASEE_SDK_CALLBACK__({
              callbackId: e.callbackId,
              code: 0,
              message: "ok",
              data: { mock: !0, module: e.module, method: e.method },
            });
          }, 300));
      }
      handleCallback(e) {
        let { callbackId: n, code: r } = e,
          a = this.callbacks.get(n);
        a && (r === 0 ? a.resolve(e) : a.reject(e), this.callbacks.delete(n));
      }
    },
    o = new s();
  var m = {
    getInfo() {
      return o.invoke("app", "getInfo");
    },
  };
  var g = {
    toast(t) {
      return o.invoke("ui", "toast", t);
    },
    showLoading(t) {
      return o.invoke("ui", "showLoading", t);
    },
    hideLoading() {
      return o.invoke("ui", "hideLoading");
    },
  };
  var p = {
    setTitle(t) {
      return o.invoke("navigation", "setTitle", { title: t });
    },
    back() {
      return o.invoke("navigation", "back");
    },
  };
  var u = {
    getAuthCode() {
      return o.invoke("user", "getAuthCode");
    },
  };
  var l = {
    chooseImage(t) {
      return o.invoke("media", "chooseImage", t);
    },
  };
  var k = {
    open(t) {
      return o.invoke("share", "open", t);
    },
  };
  var b = {
    qrcode() {
      return o.invoke("scan", "qrcode");
    },
  };
  var c = class {
      constructor() {
        this.version = "1.0.0";
        this.app = m;
        this.ui = g;
        this.navigation = p;
        this.user = u;
        this.media = l;
        this.share = k;
        this.scan = b;
      }
      ready(e) {
        if (document.readyState === "complete") {
          e();
          return;
        }
        window.addEventListener("YaseeSDKReady", () => {
          e();
        });
      }
      support(e) {
        return [
          "app.getInfo",
          "ui.toast",
          "ui.showLoading",
          "ui.hideLoading",
          "navigation.setTitle",
          "navigation.back",
          "user.getAuthCode",
          "media.chooseImage",
          "share.open",
          "scan.qrcode",
        ].includes(e);
      }
    },
    h = new c();
  window.openYasee = h;
  var C = h;
  return S(K);
})();
