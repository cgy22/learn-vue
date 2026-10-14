if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_LOAD = "onLoad";
  const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const onPullDownRefresh = /* @__PURE__ */ createLifeCycleHook(
    ON_PULL_DOWN_REFRESH,
    2
    /* HookFlags.PAGE */
  );
  const newsList = [
    {
      id: 1,
      title: "我国成功发射新一组低轨通信卫星",
      time: "2026-09-15 10:24",
      thumb: "https://dornhub.eu.org/.private/banner-main.jpg",
      source: "科技日报",
      // ---- 本案例新增的三个字段 ----
      author: "林之南",
      // 复制作者按钮用它
      phone: "13800001111",
      // 拨号按钮用它
      likes: 128,
      // 点赞数：下拉刷新会变
      // ---------------------------
      content: "北京时间 9 月 15 日上午……"
    }
    // ... 共 6 条
  ];
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$1 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const detail = vue.ref(null);
      const collected = vue.ref(false);
      onLoad((options) => {
        const id = options.id || 1;
        detail.value = newsList.find((item) => item.id === Number(id));
        if (detail.value) {
          collected.value = !!uni.getStorageSync("collected-" + detail.value.id);
        }
      });
      function copyAuthor() {
        uni.setClipboardData({
          data: detail.value.author,
          success: () => {
            uni.showToast({ title: "已复制作者名", icon: "success" });
          },
          fail: () => {
            uni.showToast({ title: "复制失败", icon: "none" });
          }
        });
      }
      function callAuthor() {
        uni.showModal({
          title: "联系作者",
          content: "将拨打 " + detail.value.phone + "，确定吗？",
          confirmColor: "#2683C6",
          success: (res) => {
            if (!res.confirm)
              return;
            uni.makePhoneCall({
              phoneNumber: detail.value.phone,
              fail: () => {
                uni.showToast({ title: "当前环境不支持拨号", icon: "none" });
              }
            });
          }
        });
      }
      function toggleCollect() {
        collected.value = !collected.value;
        const key = "collected-" + detail.value.id;
        if (collected.value) {
          uni.setStorageSync(key, true);
          uni.showToast({ title: "已收藏", icon: "success" });
        } else {
          uni.removeStorageSync(key);
          uni.showToast({ title: "已取消收藏", icon: "none" });
        }
      }
      onPullDownRefresh(() => {
        formatAppLog("log", "at pages/index/index.vue:29", "下拉刷新触发了！");
        setTimeout(() => {
          if (detail.value)
            detail.value.likes += Math.ceil(Math.random() * 5);
          uni.stopPullDownRefresh();
          uni.showToast({ title: "点赞数已更新", icon: "none", duration: 1200 });
        }, 600);
      });
      function goBack() {
        uni.navigateBack();
      }
      const __returned__ = { detail, collected, copyAuthor, callAuthor, toggleCollect, goBack, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get onPullDownRefresh() {
        return onPullDownRefresh;
      }, get newsList() {
        return newsList;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      $setup.detail ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "article"
      }, [
        vue.createElementVNode(
          "text",
          { class: "title" },
          vue.toDisplayString($setup.detail.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "meta" }, [
          vue.createElementVNode(
            "text",
            { class: "source" },
            vue.toDisplayString($setup.detail.source),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "time" },
            vue.toDisplayString($setup.detail.time),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("image", {
          class: "banner",
          src: $setup.detail.thumb,
          mode: "aspectFill"
        }, null, 8, ["src"]),
        vue.createElementVNode("view", { class: "stat" }, [
          vue.createElementVNode(
            "text",
            { class: "likes" },
            "👍 " + vue.toDisplayString($setup.detail.likes) + " 人觉得有用",
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "refresh-hint" }, "下拉可刷新")
        ]),
        vue.createElementVNode(
          "text",
          { class: "body" },
          vue.toDisplayString($setup.detail.content),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "author" }, [
          vue.createElementVNode(
            "text",
            { class: "author-name" },
            "作者：" + vue.toDisplayString($setup.detail.author),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "author-phone" },
            vue.toDisplayString($setup.detail.phone),
            1
            /* TEXT */
          )
        ])
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "empty"
      }, [
        vue.createElementVNode("text", null, "没有找到这条新闻")
      ])),
      vue.createElementVNode("view", { class: "bottom-space" }),
      $setup.detail ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "nav-back",
        onClick: $setup.goBack
      }, [
        vue.createElementVNode("text", { class: "nav-back-text" }, "← 返回列表")
      ])) : vue.createCommentVNode("v-if", true),
      $setup.detail ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "action-bar"
      }, [
        vue.createElementVNode("view", {
          class: "action",
          onClick: $setup.copyAuthor
        }, [
          vue.createElementVNode("text", { class: "action-icon" }, "📋"),
          vue.createElementVNode("text", { class: "action-text" }, "复制作者")
        ]),
        vue.createElementVNode("view", {
          class: "action",
          onClick: $setup.callAuthor
        }, [
          vue.createElementVNode("text", { class: "action-icon" }, "📞"),
          vue.createElementVNode("text", { class: "action-text" }, "联系作者")
        ]),
        vue.createElementVNode("view", {
          class: "action",
          onClick: $setup.toggleCollect
        }, [
          vue.createElementVNode(
            "text",
            { class: "action-icon" },
            vue.toDisplayString($setup.collected ? "⭐" : "☆"),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "action-text" },
            vue.toDisplayString($setup.collected ? "已收藏" : "收藏"),
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "F:/news-detail-page/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "F:/news-detail-page/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
