import { basename } from "node:path";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode, renderToString, ssrInterpolate } from "vue/server-renderer";
import { useSSRContext, resolveComponent, withCtx, createTextVNode, createVNode, resolveDynamicComponent, openBlock, createBlock, Suspense, createSSRApp, defineComponent, mergeProps } from "vue";
import { createRouter as createRouter$1, createMemoryHistory } from "vue-router";
import Vant from "vant";
import { createStore } from "vuex";
const __ssr_vue_processAssetPath = (url) => "/test/" + url;
const App_vue_vue_type_style_index_0_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$5 = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs) {
  const _component_router_link = resolveComponent("router-link");
  const _component_router_view = resolveComponent("router-view");
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Home`);
      } else {
        return [
          createTextVNode("Home")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`| `);
  _push(ssrRenderComponent(_component_router_link, { to: "/about" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`About`);
      } else {
        return [
          createTextVNode("About")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_router_view, null, {
    default: withCtx(({ Component }, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSuspense(_push2, {
          default: () => {
            _push2(`<div${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(Component), null, null), _parent2, _scopeId);
            _push2(`</div>`);
          },
          _: 2
        });
      } else {
        return [
          (openBlock(), createBlock(Suspense, null, {
            default: withCtx(() => [
              createVNode("div", null, [
                (openBlock(), createBlock(resolveDynamicComponent(Component)))
              ])
            ]),
            _: 2
          }, 1024))
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5]]);
const pages = Object.assign({ "./pages/About.vue": () => Promise.resolve().then(() => About$1), "./pages/External.vue": () => Promise.resolve().then(() => External$1), "./pages/Home.vue": () => Promise.resolve().then(() => Home$1), "./pages/Store.vue": () => Promise.resolve().then(() => Store$1) });
const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages(.*)\.vue$/)[1].toLowerCase();
  return {
    path: name === "/home" ? "/" : name,
    component: pages[path]
  };
});
function createRouter() {
  return createRouter$1({
    history: createMemoryHistory("/test/"),
    routes
  });
}
const index = "";
function createApp() {
  const app = createSSRApp(App);
  const router = createRouter();
  app.use(router);
  app.use(Vant);
  return { app, router };
}
async function render(url, manifest) {
  const { app, router } = createApp();
  router.push(url);
  await router.isReady();
  const ctx = {};
  const html = await renderToString(app, ctx);
  const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
  return [html, preloadLinks];
}
function renderPreloadLinks(modules, manifest) {
  let links = "";
  const seen = /* @__PURE__ */ new Set();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          const filename = basename(file);
          if (manifest[filename]) {
            for (const depFile of manifest[filename]) {
              links += renderPreloadLink(depFile);
              seen.add(depFile);
            }
          }
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}
function renderPreloadLink(file) {
  if (file.endsWith(".js")) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith(".css")) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith(".woff")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith(".woff2")) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith(".gif")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith(".png")) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    return "";
  }
}
const button$1 = "";
const Button = defineComponent({
  setup() {
    return () => {
      return createVNode("div", {
        class: "btn"
      }, "dynamicBtn");
    };
  }
});
const About_vue_vue_type_style_index_0_scoped_4b6753f8_lang = "";
const _sfc_main$4 = {
  async setup() {
    const url = import.meta.url;
    return {
      msg: "About",
      url
    };
  },
  components: {
    Button
  }
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  _push(`<!--[--><h1 data-v-4b6753f8>${ssrInterpolate($setup.msg)}</h1><p class="import-meta-url" data-v-4b6753f8>${ssrInterpolate($setup.url)}</p>`);
  _push(ssrRenderComponent(_component_Button, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`CommonButton`);
      } else {
        return [
          createTextVNode("CommonButton")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/About.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const About = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4], ["__scopeId", "data-v-4b6753f8"]]);
const About$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(_attrs)}>Example external component content</div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/example-external-component/ExampleExternalComponent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ExampleExternalComponent = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  components: {
    ExampleExternalComponent
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ExampleExternalComponent = resolveComponent("ExampleExternalComponent");
  _push(ssrRenderComponent(_component_ExampleExternalComponent, _attrs, null, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/External.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const External = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const External$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: External
}, Symbol.toStringTag, { value: "Module" }));
const button = "_button_txnst_2";
const style0 = {
  button
};
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_van_button = resolveComponent("van-button");
  _push(ssrRenderComponent(_component_van_button, mergeProps({
    type: "primary",
    class: _ctx.$style.button
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`button`);
      } else {
        return [
          createTextVNode("button")
        ];
      }
    }),
    _: 1
  }, _parent));
}
const cssModules = {
  "$style": style0
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Home.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__cssModules", cssModules]]);
const Home$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
const Store_vue_vue_type_style_index_0_scoped_91e93cb7_lang = "";
const _sfc_main = {
  async setup() {
    const store = createStore({
      state: {
        foo: "bar"
      }
    });
    return store.state;
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<h1${ssrRenderAttrs(_attrs)} data-v-91e93cb7>${ssrInterpolate(_ctx.foo)}</h1>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/Store.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Store = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-91e93cb7"]]);
const Store$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Store
}, Symbol.toStringTag, { value: "Module" }));
export {
  render
};
