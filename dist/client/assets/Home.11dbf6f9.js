import { _ as _export_sfc, r as resolveComponent, o as openBlock, f as createBlock, w as withCtx, n as normalizeClass, e as createTextVNode } from "./index.dbf829e0.js";
const button = "_button_txnst_2";
const style0 = {
  button
};
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createTextVNode("button");
function _sfc_render(_ctx, _cache) {
  const _component_van_button = resolveComponent("van-button");
  return openBlock(), createBlock(_component_van_button, {
    type: "primary",
    class: normalizeClass(_ctx.$style.button)
  }, {
    default: withCtx(() => [
      _hoisted_1
    ]),
    _: 1
  }, 8, ["class"]);
}
const cssModules = {
  "$style": style0
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__cssModules", cssModules]]);
export {
  Home as default
};
