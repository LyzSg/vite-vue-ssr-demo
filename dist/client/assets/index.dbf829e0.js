const p$1 = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p$1();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name2 in value) {
      if (value[name2]) {
        res += name2 + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend$1 = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction$1 = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise$1 = (val) => {
  return isObject$1(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn2) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn2(str));
  };
};
const camelizeRE$1 = /-(\w)/g;
const camelize$1 = cacheStringFunction((str) => {
  return str.replace(camelizeRE$1, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn2) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn2();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function recordEffectScope(effect3, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect3);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect3) => {
  const { deps } = effect3;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect3);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn2, scheduler = null, scope) {
    this.fn = fn2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect3) {
  const { deps } = effect3;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray$1(dep) ? dep : [...dep];
  for (const effect3 of effects) {
    if (effect3.computed) {
      triggerEffect(effect3);
    }
  }
  for (const effect3 of effects) {
    if (!effect3.computed) {
      triggerEffect(effect3);
    }
  }
}
function triggerEffect(effect3, debuggerEventExtraInfo) {
  if (effect3 !== activeEffect || effect3.allowRecurse) {
    if (effect3.scheduler) {
      effect3.scheduler();
    } else {
      effect3.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
const get$1 = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get: get$1,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend$1({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function callWithErrorHandling(fn2, instance2, type, args) {
  let res;
  try {
    res = args ? fn2(...args) : fn2();
  } catch (err) {
    handleError(err, instance2, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn2, instance2, type, args) {
  if (isFunction$1(fn2)) {
    const res = callWithErrorHandling(fn2, instance2, type, args);
    if (res && isPromise$1(res)) {
      res.catch((err) => {
        handleError(err, instance2, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn2.length; i++) {
    values.push(callWithAsyncErrorHandling(fn2[i], instance2, type, args));
  }
  return values;
}
function handleError(err, instance2, type, throwInDev = true) {
  const contextVNode = instance2 ? instance2.vnode : null;
  if (instance2) {
    let cur = instance2.parent;
    const exposedInstance = instance2.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance2.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn2) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn2 ? p2.then(this ? fn2.bind(this) : fn2) : p2;
}
function findInsertionIndex(id) {
  let start2 = flushIndex + 1;
  let end2 = queue$1.length;
  while (start2 < end2) {
    const middle = start2 + end2 >>> 1;
    const middleJobId = getId$1(queue$1[middle]);
    middleJobId < id ? start2 = middle + 1 : end2 = middle;
  }
  return start2;
}
function queueJob(job) {
  if ((!queue$1.length || !queue$1.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index2) {
  if (!isArray$1(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index2 + 1 : index2)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen2, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen2, parentJob);
  }
}
function flushPostFlushCbs(seen2) {
  flushPreFlushCbs();
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId$1(a) - getId$1(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId$1 = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen2) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen2);
  queue$1.sort((a, b) => getId$1(a) - getId$1(b));
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen2);
    }
  }
}
function emit$1(instance2, event, ...rawArgs) {
  if (instance2.isUnmounted)
    return;
  const props = instance2.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => a.trim());
    }
    if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize$1(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance2, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance2.emitted) {
      instance2.emitted = {};
    } else if (instance2.emitted[handlerName]) {
      return;
    }
    instance2.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance2, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend$1(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, null);
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend$1(normalized, raw);
  }
  cache.set(comp, normalized);
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance2) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance2;
  currentScopeId = instance2 && instance2.type.__scopeId || null;
  return prev;
}
function withCtx(fn2, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn2;
  if (fn2._n) {
    return fn2;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn2(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance2) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx, inheritAttrs } = instance2;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance2);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit
      } : { attrs, slots, emit }) : render2(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance2, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
function filterSingleRoot(children) {
  let singleRoot;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isVNode(child)) {
      if (child.type !== Comment || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
const SuspenseImpl = {
  name: "Suspense",
  __isSuspense: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
    if (n1 == null) {
      mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals);
    } else {
      patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, rendererInternals);
    }
  },
  hydrate: hydrateSuspense,
  create: createSuspenseBoundary,
  normalize: normalizeSuspenseChildren
};
const Suspense = SuspenseImpl;
function triggerEvent(vnode, name2) {
  const eventListener = vnode.props && vnode.props[name2];
  if (isFunction$1(eventListener)) {
    eventListener();
  }
}
function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
  const { p: patch, o: { createElement } } = rendererInternals;
  const hiddenContainer = createElement("div");
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals);
  patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds);
  if (suspense.deps > 0) {
    triggerEvent(vnode, "onPending");
    triggerEvent(vnode, "onFallback");
    patch(null, vnode.ssFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds);
    setActiveBranch(suspense, vnode.ssFallback);
  } else {
    suspense.resolve();
  }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
  const suspense = n2.suspense = n1.suspense;
  suspense.vnode = n2;
  n2.el = n1.el;
  const newBranch = n2.ssContent;
  const newFallback = n2.ssFallback;
  const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
  if (pendingBranch) {
    suspense.pendingBranch = newBranch;
    if (isSameVNodeType(newBranch, pendingBranch)) {
      patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else if (isInFallback) {
        patch(activeBranch, newFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds, optimized);
        setActiveBranch(suspense, newFallback);
      }
    } else {
      suspense.pendingId++;
      if (isHydrating) {
        suspense.isHydrating = false;
        suspense.activeBranch = pendingBranch;
      } else {
        unmount(pendingBranch, parentComponent, suspense);
      }
      suspense.deps = 0;
      suspense.effects.length = 0;
      suspense.hiddenContainer = createElement("div");
      if (isInFallback) {
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          patch(activeBranch, newFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds, optimized);
          setActiveBranch(suspense, newFallback);
        }
      } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        suspense.resolve(true);
      } else {
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        if (suspense.deps <= 0) {
          suspense.resolve();
        }
      }
    }
  } else {
    if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
      patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      setActiveBranch(suspense, newBranch);
    } else {
      triggerEvent(n2, "onPending");
      suspense.pendingBranch = newBranch;
      suspense.pendingId++;
      patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else {
        const { timeout, pendingId } = suspense;
        if (timeout > 0) {
          setTimeout(() => {
            if (suspense.pendingId === pendingId) {
              suspense.fallback(newFallback);
            }
          }, timeout);
        } else if (timeout === 0) {
          suspense.fallback(newFallback);
        }
      }
    }
  }
}
function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
  const { p: patch, m: move, um: unmount, n: next, o: { parentNode, remove: remove2 } } = rendererInternals;
  const timeout = toNumber(vnode.props && vnode.props.timeout);
  const suspense = {
    vnode,
    parent,
    parentComponent,
    isSVG,
    container,
    hiddenContainer,
    anchor,
    deps: 0,
    pendingId: 0,
    timeout: typeof timeout === "number" ? timeout : -1,
    activeBranch: null,
    pendingBranch: null,
    isInFallback: true,
    isHydrating,
    isUnmounted: false,
    effects: [],
    resolve(resume = false) {
      const { vnode: vnode2, activeBranch, pendingBranch, pendingId, effects, parentComponent: parentComponent2, container: container2 } = suspense;
      if (suspense.isHydrating) {
        suspense.isHydrating = false;
      } else if (!resume) {
        const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = () => {
            if (pendingId === suspense.pendingId) {
              move(pendingBranch, container2, anchor2, 0);
            }
          };
        }
        let { anchor: anchor2 } = suspense;
        if (activeBranch) {
          anchor2 = next(activeBranch);
          unmount(activeBranch, parentComponent2, suspense, true);
        }
        if (!delayEnter) {
          move(pendingBranch, container2, anchor2, 0);
        }
      }
      setActiveBranch(suspense, pendingBranch);
      suspense.pendingBranch = null;
      suspense.isInFallback = false;
      let parent2 = suspense.parent;
      let hasUnresolvedAncestor = false;
      while (parent2) {
        if (parent2.pendingBranch) {
          parent2.effects.push(...effects);
          hasUnresolvedAncestor = true;
          break;
        }
        parent2 = parent2.parent;
      }
      if (!hasUnresolvedAncestor) {
        queuePostFlushCb(effects);
      }
      suspense.effects = [];
      triggerEvent(vnode2, "onResolve");
    },
    fallback(fallbackVNode) {
      if (!suspense.pendingBranch) {
        return;
      }
      const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, isSVG: isSVG2 } = suspense;
      triggerEvent(vnode2, "onFallback");
      const anchor2 = next(activeBranch);
      const mountFallback = () => {
        if (!suspense.isInFallback) {
          return;
        }
        patch(null, fallbackVNode, container2, anchor2, parentComponent2, null, isSVG2, slotScopeIds, optimized);
        setActiveBranch(suspense, fallbackVNode);
      };
      const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
      if (delayEnter) {
        activeBranch.transition.afterLeave = mountFallback;
      }
      suspense.isInFallback = true;
      unmount(activeBranch, parentComponent2, null, true);
      if (!delayEnter) {
        mountFallback();
      }
    },
    move(container2, anchor2, type) {
      suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
      suspense.container = container2;
    },
    next() {
      return suspense.activeBranch && next(suspense.activeBranch);
    },
    registerDep(instance2, setupRenderEffect) {
      const isInPendingSuspense = !!suspense.pendingBranch;
      if (isInPendingSuspense) {
        suspense.deps++;
      }
      const hydratedEl = instance2.vnode.el;
      instance2.asyncDep.catch((err) => {
        handleError(err, instance2, 0);
      }).then((asyncSetupResult) => {
        if (instance2.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance2.suspenseId) {
          return;
        }
        instance2.asyncResolved = true;
        const { vnode: vnode2 } = instance2;
        handleSetupResult(instance2, asyncSetupResult, false);
        if (hydratedEl) {
          vnode2.el = hydratedEl;
        }
        const placeholder = !hydratedEl && instance2.subTree.el;
        setupRenderEffect(instance2, vnode2, parentNode(hydratedEl || instance2.subTree.el), hydratedEl ? null : next(instance2.subTree), suspense, isSVG, optimized);
        if (placeholder) {
          remove2(placeholder);
        }
        updateHOCHostEl(instance2, vnode2.el);
        if (isInPendingSuspense && --suspense.deps === 0) {
          suspense.resolve();
        }
      });
    },
    unmount(parentSuspense, doRemove) {
      suspense.isUnmounted = true;
      if (suspense.activeBranch) {
        unmount(suspense.activeBranch, parentComponent, parentSuspense, doRemove);
      }
      if (suspense.pendingBranch) {
        unmount(suspense.pendingBranch, parentComponent, parentSuspense, doRemove);
      }
    }
  };
  return suspense;
}
function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement("div"), null, isSVG, slotScopeIds, optimized, rendererInternals, true);
  const result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);
  if (suspense.deps === 0) {
    suspense.resolve();
  }
  return result;
}
function normalizeSuspenseChildren(vnode) {
  const { shapeFlag, children } = vnode;
  const isSlotChildren = shapeFlag & 32;
  vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
  vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
}
function normalizeSuspenseSlot(s) {
  let block;
  if (isFunction$1(s)) {
    const trackBlock = isBlockTreeEnabled && s._c;
    if (trackBlock) {
      s._d = false;
      openBlock();
    }
    s = s();
    if (trackBlock) {
      s._d = true;
      block = currentBlock;
      closeBlock();
    }
  }
  if (isArray$1(s)) {
    const singleChild = filterSingleRoot(s);
    s = singleChild;
  }
  s = normalizeVNode(s);
  if (block && !s.dynamicChildren) {
    s.dynamicChildren = block.filter((c) => c !== s);
  }
  return s;
}
function queueEffectWithSuspense(fn2, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn2)) {
      suspense.effects.push(...fn2);
    } else {
      suspense.effects.push(fn2);
    }
  } else {
    queuePostFlushCb(fn2);
  }
}
function setActiveBranch(suspense, branch) {
  suspense.activeBranch = branch;
  const { vnode, parentComponent } = suspense;
  const el = vnode.el = branch.el;
  if (parentComponent && parentComponent.subTree === vnode) {
    parentComponent.vnode.el = el;
    updateHOCHostEl(parentComponent, el);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance2 = currentInstance || currentRenderingInstance;
  if (instance2) {
    const provides = instance2.parent == null ? instance2.vnode.appContext && instance2.vnode.appContext.provides : instance2.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance2.proxy) : defaultValue;
    } else
      ;
  }
}
function watchEffect(effect3, options) {
  return doWatch(effect3, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance2 = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction$1(s)) {
        return callWithErrorHandling(s, instance2, 2);
      } else
        ;
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance2, 2);
    } else {
      getter = () => {
        if (instance2 && instance2.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance2, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn2) => {
    cleanup = effect3.onStop = () => {
      callWithErrorHandling(fn2, instance2, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance2, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect3.active) {
      return;
    }
    if (cb) {
      const newValue = effect3.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance2, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect3.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance2 && instance2.suspense);
  } else {
    scheduler = () => queuePreFlushCb(job);
  }
  const effect3 = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect3.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect3.run.bind(effect3), instance2 && instance2.suspense);
  } else {
    effect3.run();
  }
  return () => {
    effect3.stop();
    if (instance2 && instance2.scope) {
      remove(instance2.scope.effects, effect3);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen2) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen2 = seen2 || /* @__PURE__ */ new Set();
  if (seen2.has(value)) {
    return value;
  }
  seen2.add(value);
  if (isRef(value)) {
    traverse(value.value, seen2);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen2);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen2);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen2);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance2 = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance2);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance2.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance2);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance2.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance2) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance2, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray$1(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance2);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction$1(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current2 = target;
    while (current2) {
      if (current2.isDeactivated) {
        return;
      }
      current2 = current2.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current2 = target.parent;
    while (current2 && current2.parent) {
      if (isKeepAlive(current2.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current2);
      }
      current2 = current2.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance2 = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction$1(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance: instance2,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance2, name2) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name2];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance2, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name2, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name2, true, maybeSelfReference) || name2;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name2) {
  return resolveAsset(DIRECTIVES, name2);
}
function resolveAsset(type, name2, warnMissing = true, maybeSelfReference = false) {
  const instance2 = currentRenderingInstance || currentInstance;
  if (instance2) {
    const Component = instance2.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component, false);
      if (selfName && (selfName === name2 || selfName === camelize$1(name2) || selfName === capitalize(camelize$1(name2)))) {
        return Component;
      }
    }
    const res = resolve(instance2[type] || Component[type], name2) || resolve(instance2.appContext[type], name2);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name2) {
  return registry && (registry[name2] || registry[camelize$1(name2)] || registry[capitalize(camelize$1(name2))]);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend$1(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
  $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance2 }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance2;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance2.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance2, "get", key);
      }
      return publicGetter(instance2);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance2 }, key, value) {
    const { data, setupState, ctx } = instance2;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance2.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance2) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance2) {
  const options = resolveMergedOptions(instance2);
  const publicThis = instance2.proxy;
  const ctx = instance2.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance2, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance2.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance2.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance2, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance2.exposed || (instance2.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance2.exposed) {
      instance2.exposed = {};
    }
  }
  if (render && instance2.render === NOOP) {
    instance2.render = render;
  }
  if (inheritAttrs != null) {
    instance2.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance2.components = components;
  if (directives)
    instance2.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance2, type) {
  callWithAsyncErrorHandling(isArray$1(hook) ? hook.map((h2) => h2.bind(instance2.proxy)) : hook.bind(instance2.proxy), instance2, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance2) {
  const base = instance2.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance2.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions$1(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  cache.set(base, resolved);
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions$1(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend$1(isFunction$1(to) ? to.call(this, this) : to, isFunction$1(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend$1(extend$1(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend$1(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance2, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance2.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance2, rawProps, props, attrs);
  for (const key in instance2.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance2.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance2.type.props) {
      instance2.props = attrs;
    } else {
      instance2.props = props;
    }
  }
  instance2.attrs = attrs;
}
function updateProps(instance2, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance2;
  const rawCurrentProps = toRaw(props);
  const [options] = instance2.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance2.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance2.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize$1(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance2, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance2, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance2, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance2, "set", "$attrs");
  }
}
function setFullProps(instance2, rawProps, props, attrs) {
  const [options, needCastKeys] = instance2.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize$1(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance2.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance2, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance2, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance2;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance2);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend$1(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize$1(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize$1(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache.set(comp, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance2) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction$1(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance2, children) => {
  const normalized = normalizeSlotValue(children);
  instance2.slots.default = () => normalized;
};
const initSlots = (instance2, children) => {
  if (instance2.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance2.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance2.slots = {});
    }
  } else {
    instance2.slots = {};
    if (children) {
      normalizeVNodeSlots(instance2, children);
    }
  }
  def(instance2.slots, InternalObjectKey, 1);
};
const updateSlots = (instance2, children, optimized) => {
  const { vnode, slots } = instance2;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend$1(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance2, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version: version$1,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction$1(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name2, component) {
        if (!component) {
          return context.components[name2];
        }
        context.components[name2] = component;
        return app2;
      },
      directive(name2, directive) {
        if (!directive) {
          return context.directives[name2];
        }
        context.directives[name2] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      }
    };
    return app2;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$1(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
let hasMismatch = false;
const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== "foreignObject";
const isComment = (node) => node.nodeType === 8;
function createHydrationFunctions(rendererInternals) {
  const { mt: mountComponent2, p: patch, o: { patchProp: patchProp2, createText, nextSibling, parentNode, remove: remove2, insert, createComment } } = rendererInternals;
  const hydrate = (vnode, container) => {
    if (!container.hasChildNodes()) {
      patch(null, vnode, container);
      flushPostFlushCbs();
      container._vnode = vnode;
      return;
    }
    hasMismatch = false;
    hydrateNode(container.firstChild, vnode, null, null, null);
    flushPostFlushCbs();
    container._vnode = vnode;
    if (hasMismatch && true) {
      console.error(`Hydration completed but contains mismatches.`);
    }
  };
  const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
    const isFragmentStart = isComment(node) && node.data === "[";
    const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);
    const { type, ref: ref2, shapeFlag, patchFlag } = vnode;
    const domType = node.nodeType;
    vnode.el = node;
    if (patchFlag === -2) {
      optimized = false;
      vnode.dynamicChildren = null;
    }
    let nextNode = null;
    switch (type) {
      case Text:
        if (domType !== 3) {
          if (vnode.children === "") {
            insert(vnode.el = createText(""), parentNode(node), node);
            nextNode = node;
          } else {
            nextNode = onMismatch();
          }
        } else {
          if (node.data !== vnode.children) {
            hasMismatch = true;
            node.data = vnode.children;
          }
          nextNode = nextSibling(node);
        }
        break;
      case Comment:
        if (domType !== 8 || isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = nextSibling(node);
        }
        break;
      case Static:
        if (domType !== 1 && domType !== 3) {
          nextNode = onMismatch();
        } else {
          nextNode = node;
          const needToAdoptContent = !vnode.children.length;
          for (let i = 0; i < vnode.staticCount; i++) {
            if (needToAdoptContent)
              vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
            if (i === vnode.staticCount - 1) {
              vnode.anchor = nextNode;
            }
            nextNode = nextSibling(nextNode);
          }
          return nextNode;
        }
        break;
      case Fragment:
        if (!isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
        }
        break;
      default:
        if (shapeFlag & 1) {
          if (domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
          }
        } else if (shapeFlag & 6) {
          vnode.slotScopeIds = slotScopeIds;
          const container = parentNode(node);
          mountComponent2(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized);
          nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node);
          if (nextNode && isComment(nextNode) && nextNode.data === "teleport end") {
            nextNode = nextSibling(nextNode);
          }
          if (isAsyncWrapper(vnode)) {
            let subTree;
            if (isFragmentStart) {
              subTree = createVNode(Fragment);
              subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
            } else {
              subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
            }
            subTree.el = node;
            vnode.component.subTree = subTree;
          }
        } else if (shapeFlag & 64) {
          if (domType !== 8) {
            nextNode = onMismatch();
          } else {
            nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
          }
        } else if (shapeFlag & 128) {
          nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
        } else
          ;
    }
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode);
    }
    return nextNode;
  };
  const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!vnode.dynamicChildren;
    const { type, props, patchFlag, shapeFlag, dirs } = vnode;
    const forcePatchValue = type === "input" && dirs || type === "option";
    if (forcePatchValue || patchFlag !== -1) {
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        if (forcePatchValue || !optimized || patchFlag & (16 | 32)) {
          for (const key in props) {
            if (forcePatchValue && key.endsWith("value") || isOn(key) && !isReservedProp(key)) {
              patchProp2(el, key, null, props[key], false, void 0, parentComponent);
            }
          }
        } else if (props.onClick) {
          patchProp2(el, "onClick", null, props.onClick, false, void 0, parentComponent);
        }
      }
      let vnodeHooks;
      if (vnodeHooks = props && props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHooks, parentComponent, vnode);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
        queueEffectWithSuspense(() => {
          vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
      if (shapeFlag & 16 && !(props && (props.innerHTML || props.textContent))) {
        let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);
        while (next) {
          hasMismatch = true;
          const cur = next;
          next = next.nextSibling;
          remove2(cur);
        }
      } else if (shapeFlag & 8) {
        if (el.textContent !== vnode.children) {
          hasMismatch = true;
          el.textContent = vnode.children;
        }
      }
    }
    return el.nextSibling;
  };
  const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!parentVNode.dynamicChildren;
    const children = parentVNode.children;
    const l = children.length;
    for (let i = 0; i < l; i++) {
      const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
      if (node) {
        node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
      } else if (vnode.type === Text && !vnode.children) {
        continue;
      } else {
        hasMismatch = true;
        patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
      }
    }
    return node;
  };
  const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    const { slotScopeIds: fragmentSlotScopeIds } = vnode;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    const container = parentNode(node);
    const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);
    if (next && isComment(next) && next.data === "]") {
      return nextSibling(vnode.anchor = next);
    } else {
      hasMismatch = true;
      insert(vnode.anchor = createComment(`]`), container, next);
      return next;
    }
  };
  const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
    hasMismatch = true;
    vnode.el = null;
    if (isFragment) {
      const end2 = locateClosingAsyncAnchor(node);
      while (true) {
        const next2 = nextSibling(node);
        if (next2 && next2 !== end2) {
          remove2(next2);
        } else {
          break;
        }
      }
    }
    const next = nextSibling(node);
    const container = parentNode(node);
    remove2(node);
    patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
    return next;
  };
  const locateClosingAsyncAnchor = (node) => {
    let match = 0;
    while (node) {
      node = nextSibling(node);
      if (node && isComment(node)) {
        if (node.data === "[")
          match++;
        if (node.data === "]") {
          if (match === 0) {
            return nextSibling(node);
          } else {
            match--;
          }
        }
      }
    }
    return node;
  };
  return [hydrate, hydrateNode];
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function createHydrationRenderer(options) {
  return baseCreateRenderer(options, createHydrationFunctions);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent2(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent2 = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance2 = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance2.ctx.renderer = internals;
    }
    {
      setupComponent(instance2);
    }
    if (instance2.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance2, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance2.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance2, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance2 = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance2.asyncDep && !instance2.asyncResolved) {
        updateComponentPreRender(instance2, n2, optimized);
        return;
      } else {
        instance2.next = n2;
        invalidateJob(instance2.update);
        instance2.update();
      }
    } else {
      n2.el = n1.el;
      instance2.vnode = n2;
    }
  };
  const setupRenderEffect = (instance2, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance2.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance2;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance2, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance2, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance2.subTree = renderComponentRoot(instance2);
            hydrateNode(el, instance2.subTree, instance2, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(() => !instance2.isUnmounted && hydrateSubTree());
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance2.subTree = renderComponentRoot(instance2);
          patch(null, subTree, container, anchor, instance2, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance2.a && queuePostRenderEffect(instance2.a, parentSuspense);
        }
        instance2.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance2;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance2, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance2, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance2, true);
        const nextTree = renderComponentRoot(instance2);
        const prevTree = instance2.subTree;
        instance2.subTree = nextTree;
        patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance2, parentSuspense, isSVG);
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance2, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect3 = instance2.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(update), instance2.scope);
    const update = instance2.update = () => effect3.run();
    update.id = instance2.uid;
    toggleRecurse(instance2, true);
    update();
  };
  const updateComponentPreRender = (instance2, nextVNode, optimized) => {
    nextVNode.component = instance2;
    const prevProps = instance2.vnode.props;
    instance2.vnode = nextVNode;
    instance2.next = null;
    updateProps(instance2, nextVNode.props, prevProps, optimized);
    updateSlots(instance2, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance2.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end2) => {
    let next;
    while (cur !== end2) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end2);
  };
  const unmountComponent = (instance2, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance2;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance2, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance2.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance2.asyncDep && !instance2.asyncResolved && instance2.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent2,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect: effect3, update }, allowed) {
  effect3.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(n2, container, mainAnchor, internals, 1);
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0);
          }
        } else if (wasDisabled) {
          moveTeleport(n2, target, targetAnchor, internals, 1);
        }
      }
    }
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, parentAnchor, 2);
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
  const target = vnode.target = resolveTarget(vnode.props, querySelector);
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
      }
    }
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction$1(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend$1({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction$1(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend$1({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray$1(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(Fragment, null, child.slice());
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$1(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance2, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance2, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid$1$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance2 = {
    uid: uid$1$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance2.ctx = { _: instance2 };
  }
  instance2.root = parent ? parent.root : instance2;
  instance2.emit = emit$1.bind(null, instance2);
  if (vnode.ce) {
    vnode.ce(instance2);
  }
  return instance2;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance2) => {
  currentInstance = instance2;
  instance2.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance2) {
  return instance2.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance2, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance2.vnode;
  const isStateful = isStatefulComponent(instance2);
  initProps(instance2, props, isStateful, isSSR);
  initSlots(instance2, children);
  const setupResult = isStateful ? setupStatefulComponent(instance2, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance2, isSSR) {
  const Component = instance2.type;
  instance2.accessCache = /* @__PURE__ */ Object.create(null);
  instance2.proxy = markRaw(new Proxy(instance2.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance2.setupContext = setup.length > 1 ? createSetupContext(instance2) : null;
    setCurrentInstance(instance2);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance2, 0, [instance2.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise$1(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance2, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance2, 0);
        });
      } else {
        instance2.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance2, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance2, isSSR);
  }
}
function handleSetupResult(instance2, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    if (instance2.type.__ssrInlineRender) {
      instance2.ssrRender = setupResult;
    } else {
      instance2.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance2.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance2, isSSR);
}
let compile;
function finishComponentSetup(instance2, isSSR, skipOptions) {
  const Component = instance2.type;
  if (!instance2.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance2.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend$1(extend$1({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance2.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance2);
    pauseTracking();
    applyOptions(instance2);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance2) {
  return new Proxy(instance2.attrs, {
    get(target, key) {
      track(instance2, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance2) {
  const expose = (exposed) => {
    instance2.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance2));
      },
      slots: instance2.slots,
      emit: instance2.emit,
      expose
    };
  }
}
function getExposeProxy(instance2) {
  if (instance2.exposed) {
    return instance2.exposeProxy || (instance2.exposeProxy = new Proxy(proxyRefs(markRaw(instance2.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance2);
        }
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version$1 = "3.2.37";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start2, end2) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start2 && (start2 === end2 || start2.nextSibling)) {
      while (true) {
        parent.insertBefore(start2.cloneNode(true), anchor);
        if (start2 === end2 || !(start2 = start2.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name2, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name2, v));
  } else {
    if (val == null)
      val = "";
    if (name2.startsWith("--")) {
      style.setProperty(name2, val);
    } else {
      const prefixed = autoPrefix(style, name2);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name2 = camelize$1(rawName);
  if (name2 !== "filter" && name2 in style) {
    return prefixCache[rawName] = name2;
  }
  name2 = capitalize(name2);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name2;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance2) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
const [_getNow, skipTimestampCheck] = /* @__PURE__ */ (() => {
  let _getNow2 = Date.now;
  let skipTimestampCheck2 = false;
  if (typeof window !== "undefined") {
    if (Date.now() > document.createEvent("Event").timeStamp) {
      _getNow2 = performance.now.bind(performance);
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck2 = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  return [_getNow2, skipTimestampCheck2];
})();
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance2 = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name2, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance2);
      addEventListener(el, name2, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name2, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name2) {
  let options;
  if (optionsModifierRE.test(name2)) {
    options = {};
    let m;
    while (m = name2.match(optionsModifierRE)) {
      name2 = name2.slice(0, name2.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name2.slice(2)), options];
}
function createInvoker(initialValue, instance2) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance2, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn2) => (e2) => !e2._stopped && fn2 && fn2(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend$1({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name: name2 = "v", type, duration, enterFromClass = `${name2}-enter-from`, enterActiveClass = `${name2}-enter-active`, enterToClass = `${name2}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name2}-leave-from`, leaveActiveClass = `${name2}-leave-active`, leaveToClass = `${name2}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend$1(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end2 = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end2();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end2();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn2, modifiers) => {
  return (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn2(event);
    }
  };
};
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el._vod = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el._vod : "none";
}
const rendererOptions = /* @__PURE__ */ extend$1({ patchProp }, nodeOps);
let renderer;
let enabledHydration = false;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
function ensureHydrationRenderer() {
  renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
  enabledHydration = true;
  return renderer;
}
const createApp$1 = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction$1(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
const createSSRApp = (...args) => {
  const app2 = ensureHydrationRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (container) {
      return mount(container, true, container instanceof SVGElement);
    }
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const App_vue_vue_type_style_index_0_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {};
const _hoisted_1 = /* @__PURE__ */ createTextVNode("Home");
const _hoisted_2 = /* @__PURE__ */ createTextVNode("| ");
const _hoisted_3 = /* @__PURE__ */ createTextVNode("About");
function _sfc_render(_ctx, _cache) {
  const _component_router_link = resolveComponent("router-link");
  const _component_router_view = resolveComponent("router-view");
  return openBlock(), createElementBlock("div", null, [
    createVNode(_component_router_link, { to: "/" }, {
      default: withCtx(() => [
        _hoisted_1
      ]),
      _: 1
    }),
    _hoisted_2,
    createVNode(_component_router_link, { to: "/about" }, {
      default: withCtx(() => [
        _hoisted_3
      ]),
      _: 1
    }),
    createVNode(_component_router_view, null, {
      default: withCtx(({ Component }) => [
        (openBlock(), createBlock(Suspense, null, {
          default: withCtx(() => [
            createBaseVNode("div", null, [
              (openBlock(), createBlock(resolveDynamicComponent(Component)))
            ])
          ]),
          _: 2
        }, 1024))
      ]),
      _: 1
    })
  ]);
}
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/test/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
/*!
  * vue-router v4.1.2
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn2, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn2) : fn2(value);
  }
  return newParams;
}
const noop$1 = () => {
};
const isArray = Array.isArray;
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset2) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset2.behavior,
    left: elRect.left - docRect.left - (offset2.left || 0),
    top: elRect.top - docRect.top - (offset2.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta) {
  const position = history.state ? history.state.position - delta : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index2 = listeners.indexOf(callback);
      if (index2 > -1)
        listeners.splice(index2, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener);
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current2, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current: current2,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      position: history2.length - 1,
      replaced: true,
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign({}, historyState.value, history2.state, {
      forward: to,
      scroll: computeScrollPosition()
    });
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route2) {
  return typeof route2 === "string" || route2 && typeof route2 === "object";
}
function isRouteName(name2) {
  return typeof name2 === "string" || typeof name2 === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [90];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2 && segments.length > 1) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path;
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name2) {
    return matcherMap.get(name2);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
      insertMatcher(matcher);
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop$1;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index2 = matchers.indexOf(matcherRef);
      if (index2 > -1) {
        matchers.splice(index2, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
      i++;
    matchers.splice(i, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name2;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name2 = matcher.record.name;
      params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
      path = matcher.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name2 = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name2 = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name: name2,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route2) => addRoute(route2));
  return { addRoute, resolve: resolve2, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name2 in record.components)
      propsObject[name2] = typeof props === "boolean" ? props : props[name2];
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function isRecordChildOf(record, parent) {
  return parent.children.some((child) => child === record || isRecordChildOf(record, child));
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers = [];
  function add2(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset2() {
    handlers = [];
  }
  return {
    add: add2,
    list: () => handlers,
    reset: reset2
  };
}
function guardToPromiseFn(guard, to, from, record, name2) {
  const enterCallbackArray = record && (record.enterCallbacks[name2] = record.enterCallbacks[name2] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false)
        reject(createRouterError(4, {
          from,
          to
        }));
      else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && record.enterCallbacks[name2] === enterCallbackArray && typeof valid === "function")
          enterCallbackArray.push(valid);
        resolve2();
      }
    };
    const guardReturn = guard.call(record && record.instances[name2], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name2 in record.components) {
      let rawComponent = record.components[name2];
      if (guardType !== "beforeRouteEnter" && !record.instances[name2])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name2));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name2}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name2] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name2)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router2 = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route2 = computed(() => router2.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    const { matched } = route2.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index2 > -1)
      return index2;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route2.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route2.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router2[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop$1);
    }
    return Promise.resolve();
  }
  return {
    route: route2,
    href: computed(() => route2.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance2, to, name2], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name2] = instance2;
        if (from && from !== to && instance2 && instance2 === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance2 && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name2] || []).forEach((callback) => callback(instance2));
      }
    }, { flush: "post" });
    return () => {
      const route2 = routeToDisplay.value;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[props.name];
      const currentName = props.name;
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route: route2 });
      }
      const routePropsOption = matchedRoute.props[props.name];
      const routeProps2 = routePropsOption ? routePropsOption === true ? route2.params : typeof routePropsOption === "function" ? routePropsOption(route2) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps2, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return normalizeSlot(slots.default, { Component: component, route: route2 }) || component;
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter$1(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = applyToParams.bind(null, decode);
  function addRoute(parentOrRoute, route2) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route2;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name2) {
    const recordMatcher = matcher.getRecordMatcher(name2);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name2) {
    return !!matcher.getRecordMatcher(name2);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      hash,
      query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        params: "path" in newTargetLocation ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
        state: data,
        force,
        replace: replace2
      }), redirectedFrom || targetLocation);
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(from, from, true, false);
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(failure2, 2)) {
          return pushWithRedirect(assign(locationAsObject(failure2.to), {
            state: data,
            force,
            replace: replace2
          }), redirectedFrom || toLocation);
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of to.matched) {
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    for (const guard of afterGuards.list())
      guard(to, from, failure);
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop$1);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(error, 4 | 8)) {
          return error;
        }
        if (isNavigationFailure(error, 2)) {
          pushWithRedirect(error.to, toLocation).then((failure) => {
            if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop$1);
          return Promise.reject();
        }
        if (info.delta)
          routerHistory.go(-info.delta, false);
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(toLocation, from, false);
        if (failure) {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop$1);
    });
  }
  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve3, reject) => {
      readyHandlers.add([resolve3, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve3, reject]) => err ? reject(err) : resolve3());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,
    install(app2) {
      const router3 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router3;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key]);
      }
      app2.provide(routerKey, router3);
      app2.provide(routeLocationKey, reactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  return router2;
}
function runGuardQueue(guards) {
  return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
const pages = Object.assign({ "./pages/About.vue": () => __vitePreload(() => import("./About.4fbbf0b9.js"), true ? ["assets/About.4fbbf0b9.js","assets/About.97ae0ac2.css"] : void 0), "./pages/External.vue": () => __vitePreload(() => import("./External.3219ea5d.js"), true ? [] : void 0), "./pages/Home.vue": () => __vitePreload(() => import("./Home.11dbf6f9.js"), true ? ["assets/Home.11dbf6f9.js","assets/Home.098a0457.css"] : void 0), "./pages/Store.vue": () => __vitePreload(() => import("./Store.c97baf17.js"), true ? ["assets/Store.c97baf17.js","assets/Store.3d7e340f.css"] : void 0) });
const routes = Object.keys(pages).map((path) => {
  const name2 = path.match(/\.\/pages(.*)\.vue$/)[1].toLowerCase();
  return {
    path: name2 === "/home" ? "/" : name2,
    component: pages[path]
  };
});
function createRouter() {
  return createRouter$1({
    history: createWebHistory("/test/"),
    routes
  });
}
function noop() {
}
const extend = Object.assign;
const inBrowser$1 = typeof window !== "undefined";
function get(object, path) {
  const keys = path.split(".");
  let result = object;
  keys.forEach((key) => {
    var _a;
    result = (_a = result[key]) != null ? _a : "";
  });
  return result;
}
function pick(obj, keys, ignoreUndefined) {
  return keys.reduce((ret, key) => {
    if (!ignoreUndefined || obj[key] !== void 0) {
      ret[key] = obj[key];
    }
    return ret;
  }, {});
}
const toArray = (item) => Array.isArray(item) ? item : [item];
const unknownProp = null;
const numericProp = [Number, String];
const truthProp = {
  type: Boolean,
  default: true
};
const makeRequiredProp = (type) => ({
  type,
  required: true
});
const makeArrayProp = () => ({
  type: Array,
  default: () => []
});
const makeNumberProp = (defaultVal) => ({
  type: Number,
  default: defaultVal
});
const makeNumericProp = (defaultVal) => ({
  type: numericProp,
  default: defaultVal
});
const makeStringProp = (defaultVal) => ({
  type: String,
  default: defaultVal
});
var inBrowser = typeof window !== "undefined";
function raf(fn2) {
  return inBrowser ? requestAnimationFrame(fn2) : -1;
}
function cancelRaf(id) {
  if (inBrowser) {
    cancelAnimationFrame(id);
  }
}
function doubleRaf(fn2) {
  raf(() => raf(fn2));
}
var isWindow = (val) => val === window;
var makeDOMRect = (width2, height2) => ({
  top: 0,
  left: 0,
  right: width2,
  bottom: height2,
  width: width2,
  height: height2
});
var useRect = (elementOrRef) => {
  const element = unref(elementOrRef);
  if (isWindow(element)) {
    const width2 = element.innerWidth;
    const height2 = element.innerHeight;
    return makeDOMRect(width2, height2);
  }
  if (element == null ? void 0 : element.getBoundingClientRect) {
    return element.getBoundingClientRect();
  }
  return makeDOMRect(0, 0);
};
function useToggle(defaultValue = false) {
  const state = ref(defaultValue);
  const toggle = (value = !state.value) => {
    state.value = value;
  };
  return [state, toggle];
}
function useParent(key) {
  const parent = inject(key, null);
  if (parent) {
    const instance2 = getCurrentInstance();
    const { link, unlink, internalChildren } = parent;
    link(instance2);
    onUnmounted(() => unlink(instance2));
    const index2 = computed(() => internalChildren.indexOf(instance2));
    return {
      parent,
      index: index2
    };
  }
  return {
    parent: null,
    index: ref(-1)
  };
}
function flattenVNodes(children) {
  const result = [];
  const traverse2 = (children2) => {
    if (Array.isArray(children2)) {
      children2.forEach((child) => {
        var _a;
        if (isVNode(child)) {
          result.push(child);
          if ((_a = child.component) == null ? void 0 : _a.subTree) {
            result.push(child.component.subTree);
            traverse2(child.component.subTree.children);
          }
          if (child.children) {
            traverse2(child.children);
          }
        }
      });
    }
  };
  traverse2(children);
  return result;
}
function sortChildren(parent, publicChildren, internalChildren) {
  const vnodes = flattenVNodes(parent.subTree.children);
  internalChildren.sort((a, b) => vnodes.indexOf(a.vnode) - vnodes.indexOf(b.vnode));
  const orderedPublicChildren = internalChildren.map((item) => item.proxy);
  publicChildren.sort((a, b) => {
    const indexA = orderedPublicChildren.indexOf(a);
    const indexB = orderedPublicChildren.indexOf(b);
    return indexA - indexB;
  });
}
function useChildren(key) {
  const publicChildren = reactive([]);
  const internalChildren = reactive([]);
  const parent = getCurrentInstance();
  const linkChildren = (value) => {
    const link = (child) => {
      if (child.proxy) {
        internalChildren.push(child);
        publicChildren.push(child.proxy);
        sortChildren(parent, publicChildren, internalChildren);
      }
    };
    const unlink = (child) => {
      const index2 = internalChildren.indexOf(child);
      publicChildren.splice(index2, 1);
      internalChildren.splice(index2, 1);
    };
    provide(key, Object.assign({
      link,
      unlink,
      children: publicChildren,
      internalChildren
    }, value));
  };
  return {
    children: publicChildren,
    linkChildren
  };
}
var SECOND = 1e3;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
function parseTime(time) {
  const days = Math.floor(time / DAY);
  const hours = Math.floor(time % DAY / HOUR);
  const minutes = Math.floor(time % HOUR / MINUTE);
  const seconds = Math.floor(time % MINUTE / SECOND);
  const milliseconds = Math.floor(time % SECOND);
  return {
    total: time,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
}
function isSameSecond(time1, time2) {
  return Math.floor(time1 / 1e3) === Math.floor(time2 / 1e3);
}
function useCountDown(options) {
  let rafId;
  let endTime;
  let counting;
  let deactivated;
  const remain = ref(options.time);
  const current2 = computed(() => parseTime(remain.value));
  const pause = () => {
    counting = false;
    cancelRaf(rafId);
  };
  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0);
  const setRemain = (value) => {
    var _a, _b;
    remain.value = value;
    (_a = options.onChange) == null ? void 0 : _a.call(options, current2.value);
    if (value === 0) {
      pause();
      (_b = options.onFinish) == null ? void 0 : _b.call(options);
    }
  };
  const microTick = () => {
    rafId = raf(() => {
      if (counting) {
        setRemain(getCurrentRemain());
        if (remain.value > 0) {
          microTick();
        }
      }
    });
  };
  const macroTick = () => {
    rafId = raf(() => {
      if (counting) {
        const remainRemain = getCurrentRemain();
        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain);
        }
        if (remain.value > 0) {
          macroTick();
        }
      }
    });
  };
  const tick = () => {
    if (!inBrowser) {
      return;
    }
    if (options.millisecond) {
      microTick();
    } else {
      macroTick();
    }
  };
  const start2 = () => {
    if (!counting) {
      endTime = Date.now() + remain.value;
      counting = true;
      tick();
    }
  };
  const reset2 = (totalTime = options.time) => {
    pause();
    remain.value = totalTime;
  };
  onBeforeUnmount(pause);
  onActivated(() => {
    if (deactivated) {
      counting = true;
      deactivated = false;
      tick();
    }
  });
  onDeactivated(() => {
    if (counting) {
      pause();
      deactivated = true;
    }
  });
  return {
    start: start2,
    pause,
    reset: reset2,
    current: current2
  };
}
function onMountedOrActivated(hook) {
  let mounted;
  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });
  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}
function useEventListener(type, listener, options = {}) {
  if (!inBrowser) {
    return;
  }
  const { target = window, passive: passive2 = false, capture = false } = options;
  let attached;
  const add2 = (target2) => {
    const element = unref(target2);
    if (element && !attached) {
      element.addEventListener(type, listener, { capture, passive: passive2 });
      attached = true;
    }
  };
  const remove2 = (target2) => {
    const element = unref(target2);
    if (element && attached) {
      element.removeEventListener(type, listener, capture);
      attached = false;
    }
  };
  onUnmounted(() => remove2(target));
  onDeactivated(() => remove2(target));
  onMountedOrActivated(() => add2(target));
  if (isRef(target)) {
    watch(target, (val, oldVal) => {
      remove2(oldVal);
      add2(val);
    });
  }
}
function useClickAway(target, listener, options = {}) {
  if (!inBrowser) {
    return;
  }
  const { eventName = "click" } = options;
  const onClick = (event) => {
    const element = unref(target);
    if (element && !element.contains(event.target)) {
      listener(event);
    }
  };
  useEventListener(eventName, onClick, { target: document });
}
var width;
var height;
function useWindowSize() {
  if (!width) {
    width = ref(0);
    height = ref(0);
    if (inBrowser) {
      const update = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
      };
      update();
      window.addEventListener("resize", update, { passive: true });
      window.addEventListener("orientationchange", update, { passive: true });
    }
  }
  return { width, height };
}
var overflowScrollReg = /scroll|auto/i;
var defaultRoot = inBrowser ? window : void 0;
function isElement$1(node) {
  const ELEMENT_NODE_TYPE = 1;
  return node.tagName !== "HTML" && node.tagName !== "BODY" && node.nodeType === ELEMENT_NODE_TYPE;
}
function getScrollParent$1(el, root = defaultRoot) {
  let node = el;
  while (node && node !== root && isElement$1(node)) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode;
  }
  return root;
}
function useScrollParent(el, root = defaultRoot) {
  const scrollParent = ref();
  onMounted(() => {
    if (el.value) {
      scrollParent.value = getScrollParent$1(el.value, root);
    }
  });
  return scrollParent;
}
var visibility;
function usePageVisibility() {
  if (!visibility) {
    visibility = ref("visible");
    if (inBrowser) {
      const update = () => {
        visibility.value = document.hidden ? "hidden" : "visible";
      };
      update();
      window.addEventListener("visibilitychange", update);
    }
  }
  return visibility;
}
var CUSTOM_FIELD_INJECTION_KEY = Symbol("van-field");
function useCustomFieldValue(customValue) {
  const field = inject(CUSTOM_FIELD_INJECTION_KEY, null);
  if (field && !field.customValue.value) {
    field.customValue.value = customValue;
    watch(customValue, () => {
      field.resetValidation();
      field.validateWithTrigger("onChange");
    });
  }
}
const isDef = (val) => val !== void 0 && val !== null;
const isFunction = (val) => typeof val === "function";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => isObject(val) && isFunction(val.then) && isFunction(val.catch);
const isDate = (val) => Object.prototype.toString.call(val) === "[object Date]" && !Number.isNaN(val.getTime());
function isMobile(value) {
  value = value.replace(/[^-|\d]/g, "");
  return /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value);
}
const isNumeric = (val) => typeof val === "number" || /^\d+(\.\d+)?$/.test(val);
const isIOS$1 = () => inBrowser$1 ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) : false;
function getScrollTop(el) {
  const top2 = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
  return Math.max(top2, 0);
}
function setScrollTop(el, value) {
  if ("scrollTop" in el) {
    el.scrollTop = value;
  } else {
    el.scrollTo(el.scrollX, value);
  }
}
function getRootScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function setRootScrollTop(value) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}
function getElementTop(el, scroller) {
  if (el === window) {
    return 0;
  }
  const scrollTop = scroller ? getScrollTop(scroller) : getRootScrollTop();
  return useRect(el).top + scrollTop;
}
const isIOS = isIOS$1();
function resetScroll() {
  if (isIOS) {
    setRootScrollTop(getRootScrollTop());
  }
}
const stopPropagation = (event) => event.stopPropagation();
function preventDefault(event, isStopPropagation) {
  if (typeof event.cancelable !== "boolean" || event.cancelable) {
    event.preventDefault();
  }
  if (isStopPropagation) {
    stopPropagation(event);
  }
}
function isHidden(elementRef) {
  const el = unref(elementRef);
  if (!el) {
    return false;
  }
  const style = window.getComputedStyle(el);
  const hidden = style.display === "none";
  const parentHidden = el.offsetParent === null && style.position !== "fixed";
  return hidden || parentHidden;
}
const { width: windowWidth, height: windowHeight } = useWindowSize();
function addUnit(value) {
  if (isDef(value)) {
    return isNumeric(value) ? `${value}px` : String(value);
  }
  return void 0;
}
function getSizeStyle(originSize) {
  if (isDef(originSize)) {
    if (Array.isArray(originSize)) {
      return {
        width: addUnit(originSize[0]),
        height: addUnit(originSize[1])
      };
    }
    const size2 = addUnit(originSize);
    return {
      width: size2,
      height: size2
    };
  }
}
function getZIndexStyle(zIndex) {
  const style = {};
  if (zIndex !== void 0) {
    style.zIndex = +zIndex;
  }
  return style;
}
let rootFontSize;
function getRootFontSize() {
  if (!rootFontSize) {
    const doc2 = document.documentElement;
    const fontSize = doc2.style.fontSize || window.getComputedStyle(doc2).fontSize;
    rootFontSize = parseFloat(fontSize);
  }
  return rootFontSize;
}
function convertRem(value) {
  value = value.replace(/rem/g, "");
  return +value * getRootFontSize();
}
function convertVw(value) {
  value = value.replace(/vw/g, "");
  return +value * windowWidth.value / 100;
}
function convertVh(value) {
  value = value.replace(/vh/g, "");
  return +value * windowHeight.value / 100;
}
function unitToPx(value) {
  if (typeof value === "number") {
    return value;
  }
  if (inBrowser$1) {
    if (value.includes("rem")) {
      return convertRem(value);
    }
    if (value.includes("vw")) {
      return convertVw(value);
    }
    if (value.includes("vh")) {
      return convertVh(value);
    }
  }
  return parseFloat(value);
}
const camelizeRE = /-(\w)/g;
const camelize = (str) => str.replace(camelizeRE, (_, c) => c.toUpperCase());
const kebabCase = (str) => str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
function padZero(num, targetLength = 2) {
  let str = num + "";
  while (str.length < targetLength) {
    str = "0" + str;
  }
  return str;
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function trimExtraChar(value, char, regExp) {
  const index2 = value.indexOf(char);
  if (index2 === -1) {
    return value;
  }
  if (char === "-" && index2 !== 0) {
    return value.slice(0, index2);
  }
  return value.slice(0, index2 + 1) + value.slice(index2).replace(regExp, "");
}
function formatNumber(value, allowDot = true, allowMinus = true) {
  if (allowDot) {
    value = trimExtraChar(value, ".", /\./g);
  } else {
    value = value.split(".")[0];
  }
  if (allowMinus) {
    value = trimExtraChar(value, "-", /-/g);
  } else {
    value = value.replace(/-/, "");
  }
  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
  return value.replace(regExp, "");
}
function addNumber(num1, num2) {
  const cardinal = 10 ** 10;
  return Math.round((num1 + num2) * cardinal) / cardinal;
}
const { hasOwnProperty } = Object.prototype;
function assignKey(to, from, key) {
  const val = from[key];
  if (!isDef(val)) {
    return;
  }
  if (!hasOwnProperty.call(to, key) || !isObject(val)) {
    to[key] = val;
  } else {
    to[key] = deepAssign(Object(to[key]), val);
  }
}
function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });
  return to;
}
var stdin_default$1A = {
  name: "\u59D3\u540D",
  tel: "\u7535\u8BDD",
  save: "\u4FDD\u5B58",
  confirm: "\u786E\u8BA4",
  cancel: "\u53D6\u6D88",
  delete: "\u5220\u9664",
  loading: "\u52A0\u8F7D\u4E2D...",
  noCoupon: "\u6682\u65E0\u4F18\u60E0\u5238",
  nameEmpty: "\u8BF7\u586B\u5199\u59D3\u540D",
  addContact: "\u6DFB\u52A0\u8054\u7CFB\u4EBA",
  telInvalid: "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u7535\u8BDD",
  vanCalendar: {
    end: "\u7ED3\u675F",
    start: "\u5F00\u59CB",
    title: "\u65E5\u671F\u9009\u62E9",
    weekdays: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"],
    monthTitle: (year, month) => `${year}\u5E74${month}\u6708`,
    rangePrompt: (maxRange) => `\u6700\u591A\u9009\u62E9 ${maxRange} \u5929`
  },
  vanCascader: {
    select: "\u8BF7\u9009\u62E9"
  },
  vanPagination: {
    prev: "\u4E0A\u4E00\u9875",
    next: "\u4E0B\u4E00\u9875"
  },
  vanPullRefresh: {
    pulling: "\u4E0B\u62C9\u5373\u53EF\u5237\u65B0...",
    loosing: "\u91CA\u653E\u5373\u53EF\u5237\u65B0..."
  },
  vanSubmitBar: {
    label: "\u5408\u8BA1:"
  },
  vanCoupon: {
    unlimited: "\u65E0\u95E8\u69DB",
    discount: (discount) => `${discount}\u6298`,
    condition: (condition) => `\u6EE1${condition}\u5143\u53EF\u7528`
  },
  vanCouponCell: {
    title: "\u4F18\u60E0\u5238",
    count: (count) => `${count}\u5F20\u53EF\u7528`
  },
  vanCouponList: {
    exchange: "\u5151\u6362",
    close: "\u4E0D\u4F7F\u7528",
    enable: "\u53EF\u7528",
    disabled: "\u4E0D\u53EF\u7528",
    placeholder: "\u8F93\u5165\u4F18\u60E0\u7801"
  },
  vanAddressEdit: {
    area: "\u5730\u533A",
    postal: "\u90AE\u653F\u7F16\u7801",
    areaEmpty: "\u8BF7\u9009\u62E9\u5730\u533A",
    addressEmpty: "\u8BF7\u586B\u5199\u8BE6\u7EC6\u5730\u5740",
    postalEmpty: "\u90AE\u653F\u7F16\u7801\u4E0D\u6B63\u786E",
    addressDetail: "\u8BE6\u7EC6\u5730\u5740",
    defaultAddress: "\u8BBE\u4E3A\u9ED8\u8BA4\u6536\u8D27\u5730\u5740"
  },
  vanAddressList: {
    add: "\u65B0\u589E\u5730\u5740"
  }
};
const lang = ref("zh-CN");
const messages = reactive({
  "zh-CN": stdin_default$1A
});
const Locale = {
  messages() {
    return messages[lang.value];
  },
  use(newLang, newMessages) {
    lang.value = newLang;
    this.add({ [newLang]: newMessages });
  },
  add(newMessages = {}) {
    deepAssign(messages, newMessages);
  }
};
var stdin_default$1z = Locale;
function createTranslate(name2) {
  const prefix = camelize(name2) + ".";
  return (path, ...args) => {
    const messages2 = stdin_default$1z.messages();
    const message = get(messages2, prefix + path) || get(messages2, path);
    return isFunction(message) ? message(...args) : message;
  };
}
function genBem(name2, mods) {
  if (!mods) {
    return "";
  }
  if (typeof mods === "string") {
    return ` ${name2}--${mods}`;
  }
  if (Array.isArray(mods)) {
    return mods.reduce((ret, item) => ret + genBem(name2, item), "");
  }
  return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? genBem(name2, key) : ""), "");
}
function createBEM(name2) {
  return (el, mods) => {
    if (el && typeof el !== "string") {
      mods = el;
      el = "";
    }
    el = el ? `${name2}__${el}` : name2;
    return `${el}${genBem(el, mods)}`;
  };
}
function createNamespace(name2) {
  const prefixedName = `van-${name2}`;
  return [
    prefixedName,
    createBEM(prefixedName),
    createTranslate(prefixedName)
  ];
}
const BORDER = "van-hairline";
const BORDER_TOP = `${BORDER}--top`;
const BORDER_LEFT = `${BORDER}--left`;
const BORDER_BOTTOM = `${BORDER}--bottom`;
const BORDER_SURROUND = `${BORDER}--surround`;
const BORDER_TOP_BOTTOM = `${BORDER}--top-bottom`;
const BORDER_UNSET_TOP_BOTTOM = `${BORDER}-unset--top-bottom`;
const HAPTICS_FEEDBACK = "van-haptics-feedback";
const FORM_KEY = Symbol("van-form");
function callInterceptor(interceptor, {
  args = [],
  done,
  canceled
}) {
  if (interceptor) {
    const returnVal = interceptor.apply(null, args);
    if (isPromise(returnVal)) {
      returnVal.then((value) => {
        if (value) {
          done();
        } else if (canceled) {
          canceled();
        }
      }).catch(noop);
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
function withInstall(options) {
  options.install = (app2) => {
    const { name: name2 } = options;
    app2.component(name2, options);
    app2.component(camelize(`-${name2}`), options);
  };
  return options;
}
const useHeight = (element) => {
  const height2 = ref();
  const setHeight = () => {
    height2.value = useRect(element).height;
  };
  onMounted(() => {
    nextTick(setHeight);
    setTimeout(setHeight, 100);
  });
  return height2;
};
function usePlaceholder(contentRef, bem2) {
  const height2 = useHeight(contentRef);
  return (renderContent) => createVNode("div", {
    "class": bem2("placeholder"),
    "style": {
      height: height2.value ? `${height2.value}px` : void 0
    }
  }, [renderContent()]);
}
const [name$1u, bem$1q] = createNamespace("action-bar");
const ACTION_BAR_KEY = Symbol(name$1u);
const actionBarProps = {
  placeholder: Boolean,
  safeAreaInsetBottom: truthProp
};
var stdin_default$1y = defineComponent({
  name: name$1u,
  props: actionBarProps,
  setup(props, {
    slots
  }) {
    const root = ref();
    const renderPlaceholder = usePlaceholder(root, bem$1q);
    const {
      linkChildren
    } = useChildren(ACTION_BAR_KEY);
    linkChildren();
    const renderActionBar = () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "class": [bem$1q(), {
          "van-safe-area-bottom": props.safeAreaInsetBottom
        }]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
    return () => {
      if (props.placeholder) {
        return renderPlaceholder(renderActionBar);
      }
      return renderActionBar();
    };
  }
});
const ActionBar = withInstall(stdin_default$1y);
function useExpose(apis) {
  const instance2 = getCurrentInstance();
  if (instance2) {
    extend(instance2.proxy, apis);
  }
}
const routeProps = {
  to: [String, Object],
  url: String,
  replace: Boolean
};
function route({
  to,
  url,
  replace,
  $router: router2
}) {
  if (to && router2) {
    router2[replace ? "replace" : "push"](to);
  } else if (url) {
    replace ? location.replace(url) : location.href = url;
  }
}
function useRoute() {
  const vm = getCurrentInstance().proxy;
  return () => route(vm);
}
const [name$1t, bem$1p] = createNamespace("badge");
const badgeProps = {
  dot: Boolean,
  max: numericProp,
  tag: makeStringProp("div"),
  color: String,
  offset: Array,
  content: numericProp,
  showZero: truthProp,
  position: makeStringProp("top-right")
};
var stdin_default$1x = defineComponent({
  name: name$1t,
  props: badgeProps,
  setup(props, {
    slots
  }) {
    const hasContent = () => {
      if (slots.content) {
        return true;
      }
      const {
        content,
        showZero
      } = props;
      return isDef(content) && content !== "" && (showZero || content !== 0);
    };
    const renderContent = () => {
      const {
        dot,
        max,
        content
      } = props;
      if (!dot && hasContent()) {
        if (slots.content) {
          return slots.content();
        }
        if (isDef(max) && isNumeric(content) && +content > max) {
          return `${max}+`;
        }
        return content;
      }
    };
    const style = computed(() => {
      const style2 = {
        background: props.color
      };
      if (props.offset) {
        const [x, y] = props.offset;
        if (slots.default) {
          style2.top = addUnit(y);
          if (typeof x === "number") {
            style2.right = addUnit(-x);
          } else {
            style2.right = x.startsWith("-") ? x.replace("-", "") : `-${x}`;
          }
        } else {
          style2.marginTop = addUnit(y);
          style2.marginLeft = addUnit(x);
        }
      }
      return style2;
    });
    const renderBadge = () => {
      if (hasContent() || props.dot) {
        return createVNode("div", {
          "class": bem$1p([props.position, {
            dot: props.dot,
            fixed: !!slots.default
          }]),
          "style": style.value
        }, [renderContent()]);
      }
    };
    return () => {
      if (slots.default) {
        const {
          tag
        } = props;
        return createVNode(tag, {
          "class": bem$1p("wrapper")
        }, {
          default: () => [slots.default(), renderBadge()]
        });
      }
      return renderBadge();
    };
  }
});
const Badge = withInstall(stdin_default$1x);
const [name$1s, bem$1o] = createNamespace("config-provider");
const CONFIG_PROVIDER_KEY = Symbol(name$1s);
const configProviderProps = {
  tag: makeStringProp("div"),
  themeVars: Object,
  iconPrefix: String
};
function mapThemeVarsToCSSVars(themeVars) {
  const cssVars = {};
  Object.keys(themeVars).forEach((key) => {
    cssVars[`--van-${kebabCase(key)}`] = themeVars[key];
  });
  return cssVars;
}
var stdin_default$1w = defineComponent({
  name: name$1s,
  props: configProviderProps,
  setup(props, {
    slots
  }) {
    const style = computed(() => {
      if (props.themeVars) {
        return mapThemeVarsToCSSVars(props.themeVars);
      }
    });
    provide(CONFIG_PROVIDER_KEY, props);
    return () => createVNode(props.tag, {
      "class": bem$1o(),
      "style": style.value
    }, {
      default: () => {
        var _a;
        return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
      }
    });
  }
});
const [name$1r, bem$1n] = createNamespace("icon");
const isImage = (name2) => name2 == null ? void 0 : name2.includes("/");
const iconProps = {
  dot: Boolean,
  tag: makeStringProp("i"),
  name: String,
  size: numericProp,
  badge: numericProp,
  color: String,
  badgeProps: Object,
  classPrefix: String
};
var stdin_default$1v = defineComponent({
  name: name$1r,
  props: iconProps,
  setup(props, {
    slots
  }) {
    const config = inject(CONFIG_PROVIDER_KEY, null);
    const classPrefix = computed(() => props.classPrefix || (config == null ? void 0 : config.iconPrefix) || bem$1n());
    return () => {
      const {
        tag,
        dot,
        name: name2,
        size: size2,
        badge,
        color
      } = props;
      const isImageIcon = isImage(name2);
      return createVNode(Badge, mergeProps({
        "dot": dot,
        "tag": tag,
        "class": [classPrefix.value, isImageIcon ? "" : `${classPrefix.value}-${name2}`],
        "style": {
          color,
          fontSize: addUnit(size2)
        },
        "content": badge
      }, props.badgeProps), {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots), isImageIcon && createVNode("img", {
            "class": bem$1n("image"),
            "src": name2
          }, null)];
        }
      });
    };
  }
});
const Icon = withInstall(stdin_default$1v);
const [name$1q, bem$1m] = createNamespace("loading");
const SpinIcon = Array(12).fill(null).map((_, index2) => createVNode("i", {
  "class": bem$1m("line", String(index2 + 1))
}, null));
const CircularIcon = createVNode("svg", {
  "class": bem$1m("circular"),
  "viewBox": "25 25 50 50"
}, [createVNode("circle", {
  "cx": "50",
  "cy": "50",
  "r": "20",
  "fill": "none"
}, null)]);
const loadingProps = {
  size: numericProp,
  type: makeStringProp("circular"),
  color: String,
  vertical: Boolean,
  textSize: numericProp,
  textColor: String
};
var stdin_default$1u = defineComponent({
  name: name$1q,
  props: loadingProps,
  setup(props, {
    slots
  }) {
    const spinnerStyle = computed(() => extend({
      color: props.color
    }, getSizeStyle(props.size)));
    const renderText = () => {
      var _a;
      if (slots.default) {
        return createVNode("span", {
          "class": bem$1m("text"),
          "style": {
            fontSize: addUnit(props.textSize),
            color: (_a = props.textColor) != null ? _a : props.color
          }
        }, [slots.default()]);
      }
    };
    return () => {
      const {
        type,
        vertical
      } = props;
      return createVNode("div", {
        "class": bem$1m([type, {
          vertical
        }]),
        "aria-live": "polite",
        "aria-busy": true
      }, [createVNode("span", {
        "class": bem$1m("spinner", type),
        "style": spinnerStyle.value
      }, [type === "spinner" ? SpinIcon : CircularIcon]), renderText()]);
    };
  }
});
const Loading = withInstall(stdin_default$1u);
const [name$1p, bem$1l] = createNamespace("button");
const buttonProps = extend({}, routeProps, {
  tag: makeStringProp("button"),
  text: String,
  icon: String,
  type: makeStringProp("default"),
  size: makeStringProp("normal"),
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  nativeType: makeStringProp("button"),
  loadingSize: numericProp,
  loadingText: String,
  loadingType: String,
  iconPosition: makeStringProp("left")
});
var stdin_default$1t = defineComponent({
  name: name$1p,
  props: buttonProps,
  emits: ["click"],
  setup(props, {
    emit,
    slots
  }) {
    const route2 = useRoute();
    const renderLoadingIcon = () => {
      if (slots.loading) {
        return slots.loading();
      }
      return createVNode(Loading, {
        "size": props.loadingSize,
        "type": props.loadingType,
        "class": bem$1l("loading")
      }, null);
    };
    const renderIcon = () => {
      if (props.loading) {
        return renderLoadingIcon();
      }
      if (slots.icon) {
        return createVNode("div", {
          "class": bem$1l("icon")
        }, [slots.icon()]);
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "class": bem$1l("icon"),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    const renderText = () => {
      let text;
      if (props.loading) {
        text = props.loadingText;
      } else {
        text = slots.default ? slots.default() : props.text;
      }
      if (text) {
        return createVNode("span", {
          "class": bem$1l("text")
        }, [text]);
      }
    };
    const getStyle = () => {
      const {
        color,
        plain
      } = props;
      if (color) {
        const style = {
          color: plain ? color : "white"
        };
        if (!plain) {
          style.background = color;
        }
        if (color.includes("gradient")) {
          style.border = 0;
        } else {
          style.borderColor = color;
        }
        return style;
      }
    };
    const onClick = (event) => {
      if (props.loading) {
        preventDefault(event);
      } else if (!props.disabled) {
        emit("click", event);
        route2();
      }
    };
    return () => {
      const {
        tag,
        type,
        size: size2,
        block,
        round: round2,
        plain,
        square,
        loading,
        disabled,
        hairline,
        nativeType,
        iconPosition
      } = props;
      const classes = [bem$1l([type, size2, {
        plain,
        block,
        round: round2,
        square,
        loading,
        disabled,
        hairline
      }]), {
        [BORDER_SURROUND]: hairline
      }];
      return createVNode(tag, {
        "type": nativeType,
        "class": classes,
        "style": getStyle(),
        "disabled": disabled,
        "onClick": onClick
      }, {
        default: () => [createVNode("div", {
          "class": bem$1l("content")
        }, [iconPosition === "left" && renderIcon(), renderText(), iconPosition === "right" && renderIcon()])]
      });
    };
  }
});
const Button = withInstall(stdin_default$1t);
const [name$1o, bem$1k] = createNamespace("action-bar-button");
const actionBarButtonProps = extend({}, routeProps, {
  type: String,
  text: String,
  icon: String,
  color: String,
  loading: Boolean,
  disabled: Boolean
});
var stdin_default$1s = defineComponent({
  name: name$1o,
  props: actionBarButtonProps,
  setup(props, {
    slots
  }) {
    const route2 = useRoute();
    const {
      parent,
      index: index2
    } = useParent(ACTION_BAR_KEY);
    const isFirst = computed(() => {
      if (parent) {
        const prev = parent.children[index2.value - 1];
        return !(prev && "isButton" in prev);
      }
    });
    const isLast = computed(() => {
      if (parent) {
        const next = parent.children[index2.value + 1];
        return !(next && "isButton" in next);
      }
    });
    useExpose({
      isButton: true
    });
    return () => {
      const {
        type,
        icon,
        text,
        color,
        loading,
        disabled
      } = props;
      return createVNode(Button, {
        "class": bem$1k([type, {
          last: isLast.value,
          first: isFirst.value
        }]),
        "size": "large",
        "type": type,
        "icon": icon,
        "color": color,
        "loading": loading,
        "disabled": disabled,
        "onClick": route2
      }, {
        default: () => [slots.default ? slots.default() : text]
      });
    };
  }
});
const ActionBarButton = withInstall(stdin_default$1s);
const [name$1n, bem$1j] = createNamespace("action-bar-icon");
const actionBarIconProps = extend({}, routeProps, {
  dot: Boolean,
  text: String,
  icon: String,
  color: String,
  badge: numericProp,
  iconClass: unknownProp,
  badgeProps: Object,
  iconPrefix: String
});
var stdin_default$1r = defineComponent({
  name: name$1n,
  props: actionBarIconProps,
  setup(props, {
    slots
  }) {
    const route2 = useRoute();
    useParent(ACTION_BAR_KEY);
    const renderIcon = () => {
      const {
        dot,
        badge,
        icon,
        color,
        iconClass,
        badgeProps: badgeProps2,
        iconPrefix
      } = props;
      if (slots.icon) {
        return createVNode(Badge, mergeProps({
          "dot": dot,
          "class": bem$1j("icon"),
          "content": badge
        }, badgeProps2), {
          default: slots.icon
        });
      }
      return createVNode(Icon, {
        "tag": "div",
        "dot": dot,
        "name": icon,
        "badge": badge,
        "color": color,
        "class": [bem$1j("icon"), iconClass],
        "badgeProps": badgeProps2,
        "classPrefix": iconPrefix
      }, null);
    };
    return () => createVNode("div", {
      "role": "button",
      "class": bem$1j(),
      "tabindex": 0,
      "onClick": route2
    }, [renderIcon(), slots.default ? slots.default() : props.text]);
  }
});
const ActionBarIcon = withInstall(stdin_default$1r);
const popupSharedProps = {
  show: Boolean,
  zIndex: numericProp,
  overlay: truthProp,
  duration: numericProp,
  teleport: [String, Object],
  lockScroll: truthProp,
  lazyRender: truthProp,
  beforeClose: Function,
  overlayStyle: Object,
  overlayClass: unknownProp,
  transitionAppear: Boolean,
  closeOnClickOverlay: truthProp
};
const popupSharedPropKeys = Object.keys(popupSharedProps);
function getDirection(x, y) {
  if (x > y) {
    return "horizontal";
  }
  if (y > x) {
    return "vertical";
  }
  return "";
}
function useTouch() {
  const startX = ref(0);
  const startY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const direction = ref("");
  const isVertical = () => direction.value === "vertical";
  const isHorizontal = () => direction.value === "horizontal";
  const reset2 = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = "";
  };
  const start2 = (event) => {
    reset2();
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
  };
  const move = (event) => {
    const touch = event.touches[0];
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value;
    deltaY.value = touch.clientY - startY.value;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);
    const LOCK_DIRECTION_DISTANCE = 10;
    if (!direction.value || offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE) {
      direction.value = getDirection(offsetX.value, offsetY.value);
    }
  };
  return {
    move,
    start: start2,
    reset: reset2,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal
  };
}
let totalLockCount = 0;
const BODY_LOCK_CLASS = "van-overflow-hidden";
function useLockScroll(rootRef, shouldLock) {
  const touch = useTouch();
  const onTouchMove = (event) => {
    touch.move(event);
    const direction = touch.deltaY.value > 0 ? "10" : "01";
    const el = getScrollParent$1(event.target, rootRef.value);
    const { scrollHeight, offsetHeight, scrollTop } = el;
    let status = "11";
    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? "00" : "01";
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = "10";
    }
    if (status !== "11" && touch.isVertical() && !(parseInt(status, 2) & parseInt(direction, 2))) {
      preventDefault(event, true);
    }
  };
  const lock = () => {
    document.addEventListener("touchstart", touch.start);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    if (!totalLockCount) {
      document.body.classList.add(BODY_LOCK_CLASS);
    }
    totalLockCount++;
  };
  const unlock = () => {
    if (totalLockCount) {
      document.removeEventListener("touchstart", touch.start);
      document.removeEventListener("touchmove", onTouchMove);
      totalLockCount--;
      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  };
  const init = () => shouldLock() && lock();
  const destroy = () => shouldLock() && unlock();
  onMountedOrActivated(init);
  onDeactivated(destroy);
  onBeforeUnmount(destroy);
  watch(shouldLock, (value) => {
    value ? lock() : unlock();
  });
}
function useLazyRender(show) {
  const inited = ref(false);
  watch(show, (value) => {
    if (value) {
      inited.value = value;
    }
  }, { immediate: true });
  return (render) => () => inited.value ? render() : null;
}
const POPUP_TOGGLE_KEY = Symbol();
function onPopupReopen(callback) {
  const popupToggleStatus = inject(POPUP_TOGGLE_KEY, null);
  if (popupToggleStatus) {
    watch(popupToggleStatus, (show) => {
      if (show) {
        callback();
      }
    });
  }
}
const [name$1m, bem$1i] = createNamespace("overlay");
const overlayProps = {
  show: Boolean,
  zIndex: numericProp,
  duration: numericProp,
  className: unknownProp,
  lockScroll: truthProp,
  lazyRender: truthProp,
  customStyle: Object
};
var stdin_default$1q = defineComponent({
  name: name$1m,
  props: overlayProps,
  setup(props, {
    slots
  }) {
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const preventTouchMove = (event) => {
      preventDefault(event, true);
    };
    const renderOverlay = lazyRender(() => {
      var _a;
      const style = extend(getZIndexStyle(props.zIndex), props.customStyle);
      if (isDef(props.duration)) {
        style.animationDuration = `${props.duration}s`;
      }
      return withDirectives(createVNode("div", {
        "style": style,
        "class": [bem$1i(), props.className],
        "onTouchmove": props.lockScroll ? preventTouchMove : noop
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), [[vShow, props.show]]);
    });
    return () => createVNode(Transition, {
      "name": "van-fade",
      "appear": true
    }, {
      default: renderOverlay
    });
  }
});
const Overlay = withInstall(stdin_default$1q);
const popupProps$2 = extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp("center"),
  closeIcon: makeStringProp("cross"),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp("top-right"),
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean
});
const [name$1l, bem$1h] = createNamespace("popup");
let globalZIndex = 2e3;
var stdin_default$1p = defineComponent({
  name: name$1l,
  inheritAttrs: false,
  props: popupProps$2,
  emits: ["open", "close", "opened", "closed", "keydown", "update:show", "click-overlay", "click-close-icon"],
  setup(props, {
    emit,
    attrs,
    slots
  }) {
    let opened;
    let shouldReopen;
    const zIndex = ref();
    const popupRef = ref();
    const lazyRender = useLazyRender(() => props.show || !props.lazyRender);
    const style = computed(() => {
      const style2 = {
        zIndex: zIndex.value
      };
      if (isDef(props.duration)) {
        const key = props.position === "center" ? "animationDuration" : "transitionDuration";
        style2[key] = `${props.duration}s`;
      }
      return style2;
    });
    const open = () => {
      if (!opened) {
        if (props.zIndex !== void 0) {
          globalZIndex = +props.zIndex;
        }
        opened = true;
        zIndex.value = ++globalZIndex;
        emit("open");
      }
    };
    const close = () => {
      if (opened) {
        callInterceptor(props.beforeClose, {
          done() {
            opened = false;
            emit("close");
            emit("update:show", false);
          }
        });
      }
    };
    const onClickOverlay = (event) => {
      emit("click-overlay", event);
      if (props.closeOnClickOverlay) {
        close();
      }
    };
    const renderOverlay = () => {
      if (props.overlay) {
        return createVNode(Overlay, {
          "show": props.show,
          "class": props.overlayClass,
          "zIndex": zIndex.value,
          "duration": props.duration,
          "customStyle": props.overlayStyle,
          "onClick": onClickOverlay
        }, {
          default: slots["overlay-content"]
        });
      }
    };
    const onClickCloseIcon = (event) => {
      emit("click-close-icon", event);
      close();
    };
    const renderCloseIcon = () => {
      if (props.closeable) {
        return createVNode(Icon, {
          "role": "button",
          "tabindex": 0,
          "name": props.closeIcon,
          "class": [bem$1h("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
          "classPrefix": props.iconPrefix,
          "onClick": onClickCloseIcon
        }, null);
      }
    };
    const onOpened = () => emit("opened");
    const onClosed = () => emit("closed");
    const onKeydown = (event) => emit("keydown", event);
    const renderPopup = lazyRender(() => {
      var _a;
      const {
        round: round2,
        position,
        safeAreaInsetTop,
        safeAreaInsetBottom
      } = props;
      return withDirectives(createVNode("div", mergeProps({
        "ref": popupRef,
        "style": style.value,
        "class": [bem$1h({
          round: round2,
          [position]: position
        }), {
          "van-safe-area-top": safeAreaInsetTop,
          "van-safe-area-bottom": safeAreaInsetBottom
        }],
        "onKeydown": onKeydown
      }, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots), renderCloseIcon()]), [[vShow, props.show]]);
    });
    const renderTransition = () => {
      const {
        position,
        transition,
        transitionAppear
      } = props;
      const name2 = position === "center" ? "van-fade" : `van-popup-slide-${position}`;
      return createVNode(Transition, {
        "name": transition || name2,
        "appear": transitionAppear,
        "onAfterEnter": onOpened,
        "onAfterLeave": onClosed
      }, {
        default: renderPopup
      });
    };
    watch(() => props.show, (show) => {
      if (show && !opened) {
        open();
        if (attrs.tabindex === 0) {
          nextTick(() => {
            var _a;
            (_a = popupRef.value) == null ? void 0 : _a.focus();
          });
        }
      }
      if (!show && opened) {
        opened = false;
        emit("close");
      }
    });
    useExpose({
      popupRef
    });
    useLockScroll(popupRef, () => props.show && props.lockScroll);
    useEventListener("popstate", () => {
      if (props.closeOnPopstate) {
        close();
        shouldReopen = false;
      }
    });
    onMounted(() => {
      if (props.show) {
        open();
      }
    });
    onActivated(() => {
      if (shouldReopen) {
        emit("update:show", true);
        shouldReopen = false;
      }
    });
    onDeactivated(() => {
      if (props.show && props.teleport) {
        close();
        shouldReopen = true;
      }
    });
    provide(POPUP_TOGGLE_KEY, () => props.show);
    return () => {
      if (props.teleport) {
        return createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: () => [renderOverlay(), renderTransition()]
        });
      }
      return createVNode(Fragment, null, [renderOverlay(), renderTransition()]);
    };
  }
});
const Popup = withInstall(stdin_default$1p);
const [name$1k, bem$1g] = createNamespace("action-sheet");
const actionSheetProps = extend({}, popupSharedProps, {
  title: String,
  round: truthProp,
  actions: makeArrayProp(),
  closeIcon: makeStringProp("cross"),
  closeable: truthProp,
  cancelText: String,
  description: String,
  closeOnPopstate: truthProp,
  closeOnClickAction: Boolean,
  safeAreaInsetBottom: truthProp
});
const popupInheritKeys$2 = [...popupSharedPropKeys, "round", "closeOnPopstate", "safeAreaInsetBottom"];
var stdin_default$1o = defineComponent({
  name: name$1k,
  props: actionSheetProps,
  emits: ["select", "cancel", "update:show"],
  setup(props, {
    slots,
    emit
  }) {
    const updateShow = (show) => emit("update:show", show);
    const onCancel = () => {
      updateShow(false);
      emit("cancel");
    };
    const renderHeader = () => {
      if (props.title) {
        return createVNode("div", {
          "class": bem$1g("header")
        }, [props.title, props.closeable && createVNode(Icon, {
          "name": props.closeIcon,
          "class": [bem$1g("close"), HAPTICS_FEEDBACK],
          "onClick": onCancel
        }, null)]);
      }
    };
    const renderCancel = () => {
      if (slots.cancel || props.cancelText) {
        return [createVNode("div", {
          "class": bem$1g("gap")
        }, null), createVNode("button", {
          "type": "button",
          "class": bem$1g("cancel"),
          "onClick": onCancel
        }, [slots.cancel ? slots.cancel() : props.cancelText])];
      }
    };
    const renderActionContent = (action, index2) => {
      if (action.loading) {
        return createVNode(Loading, {
          "class": bem$1g("loading-icon")
        }, null);
      }
      if (slots.action) {
        return slots.action({
          action,
          index: index2
        });
      }
      return [createVNode("span", {
        "class": bem$1g("name")
      }, [action.name]), action.subname && createVNode("div", {
        "class": bem$1g("subname")
      }, [action.subname])];
    };
    const renderAction = (action, index2) => {
      const {
        color,
        loading,
        callback,
        disabled,
        className
      } = action;
      const onClick = () => {
        if (disabled || loading) {
          return;
        }
        if (callback) {
          callback(action);
        }
        if (props.closeOnClickAction) {
          updateShow(false);
        }
        nextTick(() => emit("select", action, index2));
      };
      return createVNode("button", {
        "type": "button",
        "style": {
          color
        },
        "class": [bem$1g("item", {
          loading,
          disabled
        }), className],
        "onClick": onClick
      }, [renderActionContent(action, index2)]);
    };
    const renderDescription = () => {
      if (props.description || slots.description) {
        const content = slots.description ? slots.description() : props.description;
        return createVNode("div", {
          "class": bem$1g("description")
        }, [content]);
      }
    };
    return () => createVNode(Popup, mergeProps({
      "class": bem$1g(),
      "position": "bottom",
      "onUpdate:show": updateShow
    }, pick(props, popupInheritKeys$2)), {
      default: () => {
        var _a;
        return [renderHeader(), renderDescription(), createVNode("div", {
          "class": bem$1g("content")
        }, [props.actions.map(renderAction), (_a = slots.default) == null ? void 0 : _a.call(slots)]), renderCancel()];
      }
    });
  }
});
const ActionSheet = withInstall(stdin_default$1o);
function deepClone(obj) {
  if (!isDef(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  if (isObject(obj)) {
    const to = {};
    Object.keys(obj).forEach((key) => {
      to[key] = deepClone(obj[key]);
    });
    return to;
  }
  return obj;
}
const DEFAULT_DURATION = 200;
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;
const [name$1j, bem$1f] = createNamespace("picker-column");
function getElementTranslateY(element) {
  const {
    transform
  } = window.getComputedStyle(element);
  const translateY = transform.slice(7, transform.length - 1).split(", ")[5];
  return Number(translateY);
}
const PICKER_KEY = Symbol(name$1j);
const isOptionDisabled = (option) => isObject(option) && option.disabled;
var stdin_default$1n = defineComponent({
  name: name$1j,
  props: {
    textKey: makeRequiredProp(String),
    readonly: Boolean,
    allowHtml: Boolean,
    className: unknownProp,
    itemHeight: makeRequiredProp(Number),
    defaultIndex: makeNumberProp(0),
    swipeDuration: makeRequiredProp(numericProp),
    initialOptions: makeArrayProp(),
    visibleItemCount: makeRequiredProp(numericProp)
  },
  emits: ["change"],
  setup(props, {
    emit,
    slots
  }) {
    let moving;
    let startOffset;
    let touchStartTime;
    let momentumOffset;
    let transitionEndTrigger;
    const wrapper = ref();
    const state = reactive({
      index: props.defaultIndex,
      offset: 0,
      duration: 0,
      options: deepClone(props.initialOptions)
    });
    const touch = useTouch();
    const count = () => state.options.length;
    const baseOffset = () => props.itemHeight * (+props.visibleItemCount - 1) / 2;
    const adjustIndex = (index2) => {
      index2 = clamp(index2, 0, count());
      for (let i = index2; i < count(); i++) {
        if (!isOptionDisabled(state.options[i]))
          return i;
      }
      for (let i = index2 - 1; i >= 0; i--) {
        if (!isOptionDisabled(state.options[i]))
          return i;
      }
    };
    const setIndex = (index2, emitChange) => {
      index2 = adjustIndex(index2) || 0;
      const offset2 = -index2 * props.itemHeight;
      const trigger2 = () => {
        if (index2 !== state.index) {
          state.index = index2;
          if (emitChange) {
            emit("change", index2);
          }
        }
      };
      if (moving && offset2 !== state.offset) {
        transitionEndTrigger = trigger2;
      } else {
        trigger2();
      }
      state.offset = offset2;
    };
    const setOptions = (options) => {
      if (JSON.stringify(options) !== JSON.stringify(state.options)) {
        state.options = deepClone(options);
        setIndex(props.defaultIndex);
      }
    };
    const onClickItem = (index2) => {
      if (moving || props.readonly) {
        return;
      }
      transitionEndTrigger = null;
      state.duration = DEFAULT_DURATION;
      setIndex(index2, true);
    };
    const getOptionText = (option) => {
      if (isObject(option) && props.textKey in option) {
        return option[props.textKey];
      }
      return option;
    };
    const getIndexByOffset = (offset2) => clamp(Math.round(-offset2 / props.itemHeight), 0, count() - 1);
    const momentum = (distance, duration) => {
      const speed = Math.abs(distance / duration);
      distance = state.offset + speed / 3e-3 * (distance < 0 ? -1 : 1);
      const index2 = getIndexByOffset(distance);
      state.duration = +props.swipeDuration;
      setIndex(index2, true);
    };
    const stopMomentum = () => {
      moving = false;
      state.duration = 0;
      if (transitionEndTrigger) {
        transitionEndTrigger();
        transitionEndTrigger = null;
      }
    };
    const onTouchStart = (event) => {
      if (props.readonly) {
        return;
      }
      touch.start(event);
      if (moving) {
        const translateY = getElementTranslateY(wrapper.value);
        state.offset = Math.min(0, translateY - baseOffset());
        startOffset = state.offset;
      } else {
        startOffset = state.offset;
      }
      state.duration = 0;
      touchStartTime = Date.now();
      momentumOffset = startOffset;
      transitionEndTrigger = null;
    };
    const onTouchMove = (event) => {
      if (props.readonly) {
        return;
      }
      touch.move(event);
      if (touch.isVertical()) {
        moving = true;
        preventDefault(event, true);
      }
      state.offset = clamp(startOffset + touch.deltaY.value, -(count() * props.itemHeight), props.itemHeight);
      const now = Date.now();
      if (now - touchStartTime > MOMENTUM_LIMIT_TIME) {
        touchStartTime = now;
        momentumOffset = state.offset;
      }
    };
    const onTouchEnd = () => {
      if (props.readonly) {
        return;
      }
      const distance = state.offset - momentumOffset;
      const duration = Date.now() - touchStartTime;
      const allowMomentum = duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;
      if (allowMomentum) {
        momentum(distance, duration);
        return;
      }
      const index2 = getIndexByOffset(state.offset);
      state.duration = DEFAULT_DURATION;
      setIndex(index2, true);
      setTimeout(() => {
        moving = false;
      }, 0);
    };
    const renderOptions = () => {
      const optionStyle = {
        height: `${props.itemHeight}px`
      };
      return state.options.map((option, index2) => {
        const text = getOptionText(option);
        const disabled = isOptionDisabled(option);
        const data = {
          role: "button",
          style: optionStyle,
          tabindex: disabled ? -1 : 0,
          class: bem$1f("item", {
            disabled,
            selected: index2 === state.index
          }),
          onClick: () => onClickItem(index2)
        };
        const childData = {
          class: "van-ellipsis",
          [props.allowHtml ? "innerHTML" : "textContent"]: text
        };
        return createVNode("li", data, [slots.option ? slots.option(option) : createVNode("div", childData, null)]);
      });
    };
    const setValue = (value) => {
      const {
        options
      } = state;
      for (let i = 0; i < options.length; i++) {
        if (getOptionText(options[i]) === value) {
          return setIndex(i);
        }
      }
    };
    const getValue = () => state.options[state.index];
    const hasOptions = () => state.options.length;
    setIndex(state.index);
    useParent(PICKER_KEY);
    useExpose({
      state,
      setIndex,
      getValue,
      setValue,
      setOptions,
      hasOptions,
      stopMomentum
    });
    watch(() => props.initialOptions, setOptions);
    watch(() => props.defaultIndex, (value) => setIndex(value));
    return () => createVNode("div", {
      "class": [bem$1f(), props.className],
      "onTouchstart": onTouchStart,
      "onTouchmove": onTouchMove,
      "onTouchend": onTouchEnd,
      "onTouchcancel": onTouchEnd
    }, [createVNode("ul", {
      "ref": wrapper,
      "style": {
        transform: `translate3d(0, ${state.offset + baseOffset()}px, 0)`,
        transitionDuration: `${state.duration}ms`,
        transitionProperty: state.duration ? "all" : "none"
      },
      "class": bem$1f("wrapper"),
      "onTransitionend": stopMomentum
    }, [renderOptions()])]);
  }
});
const [name$1i, bem$1e, t$j] = createNamespace("picker");
const pickerSharedProps = {
  title: String,
  loading: Boolean,
  readonly: Boolean,
  allowHtml: Boolean,
  itemHeight: makeNumericProp(44),
  showToolbar: truthProp,
  swipeDuration: makeNumericProp(1e3),
  visibleItemCount: makeNumericProp(6),
  cancelButtonText: String,
  confirmButtonText: String
};
const pickerProps = extend({}, pickerSharedProps, {
  columns: makeArrayProp(),
  valueKey: String,
  defaultIndex: makeNumericProp(0),
  toolbarPosition: makeStringProp("top"),
  columnsFieldNames: Object
});
var stdin_default$1m = defineComponent({
  name: name$1i,
  props: pickerProps,
  emits: ["confirm", "cancel", "change"],
  setup(props, {
    emit,
    slots
  }) {
    const hasOptions = ref(false);
    const formattedColumns = ref([]);
    const columnsFieldNames = computed(() => {
      const {
        columnsFieldNames: columnsFieldNames2
      } = props;
      return {
        text: (columnsFieldNames2 == null ? void 0 : columnsFieldNames2.text) || props.valueKey || "text",
        values: (columnsFieldNames2 == null ? void 0 : columnsFieldNames2.values) || "values",
        children: (columnsFieldNames2 == null ? void 0 : columnsFieldNames2.children) || "children"
      };
    });
    const {
      children,
      linkChildren
    } = useChildren(PICKER_KEY);
    linkChildren();
    const itemHeight = computed(() => unitToPx(props.itemHeight));
    const dataType = computed(() => {
      const firstColumn = props.columns[0];
      if (typeof firstColumn === "object") {
        if (columnsFieldNames.value.children in firstColumn) {
          return "cascade";
        }
        if (columnsFieldNames.value.values in firstColumn) {
          return "object";
        }
      }
      return "plain";
    });
    const formatCascade = () => {
      var _a;
      const formatted = [];
      let cursor = {
        [columnsFieldNames.value.children]: props.columns
      };
      while (cursor && cursor[columnsFieldNames.value.children]) {
        const children2 = cursor[columnsFieldNames.value.children];
        let defaultIndex = (_a = cursor.defaultIndex) != null ? _a : +props.defaultIndex;
        while (children2[defaultIndex] && children2[defaultIndex].disabled) {
          if (defaultIndex < children2.length - 1) {
            defaultIndex++;
          } else {
            defaultIndex = 0;
            break;
          }
        }
        formatted.push({
          [columnsFieldNames.value.values]: cursor[columnsFieldNames.value.children],
          className: cursor.className,
          defaultIndex
        });
        cursor = children2[defaultIndex];
      }
      formattedColumns.value = formatted;
    };
    const format2 = () => {
      const {
        columns
      } = props;
      if (dataType.value === "plain") {
        formattedColumns.value = [{
          [columnsFieldNames.value.values]: columns
        }];
      } else if (dataType.value === "cascade") {
        formatCascade();
      } else {
        formattedColumns.value = columns;
      }
      hasOptions.value = formattedColumns.value.some((item) => item[columnsFieldNames.value.values] && item[columnsFieldNames.value.values].length !== 0) || children.some((item) => item.hasOptions);
    };
    const getIndexes = () => children.map((child) => child.state.index);
    const setColumnValues = (index2, options) => {
      const column = children[index2];
      if (column) {
        column.setOptions(options);
        hasOptions.value = true;
      }
    };
    const onCascadeChange = (columnIndex) => {
      let cursor = {
        [columnsFieldNames.value.children]: props.columns
      };
      const indexes = getIndexes();
      for (let i = 0; i <= columnIndex; i++) {
        cursor = cursor[columnsFieldNames.value.children][indexes[i]];
      }
      while (cursor && cursor[columnsFieldNames.value.children]) {
        columnIndex++;
        setColumnValues(columnIndex, cursor[columnsFieldNames.value.children]);
        cursor = cursor[columnsFieldNames.value.children][cursor.defaultIndex || 0];
      }
    };
    const getChild = (index2) => children[index2];
    const getColumnValue = (index2) => {
      const column = getChild(index2);
      if (column) {
        return column.getValue();
      }
    };
    const setColumnValue = (index2, value) => {
      const column = getChild(index2);
      if (column) {
        column.setValue(value);
        if (dataType.value === "cascade") {
          onCascadeChange(index2);
        }
      }
    };
    const getColumnIndex = (index2) => {
      const column = getChild(index2);
      if (column) {
        return column.state.index;
      }
    };
    const setColumnIndex = (columnIndex, optionIndex) => {
      const column = getChild(columnIndex);
      if (column) {
        column.setIndex(optionIndex);
        if (dataType.value === "cascade") {
          onCascadeChange(columnIndex);
        }
      }
    };
    const getColumnValues = (index2) => {
      const column = getChild(index2);
      if (column) {
        return column.state.options;
      }
    };
    const getValues = () => children.map((child) => child.getValue());
    const setValues = (values) => {
      values.forEach((value, index2) => {
        setColumnValue(index2, value);
      });
    };
    const setIndexes = (indexes) => {
      indexes.forEach((optionIndex, columnIndex) => {
        setColumnIndex(columnIndex, optionIndex);
      });
    };
    const emitAction = (event) => {
      if (dataType.value === "plain") {
        emit(event, getColumnValue(0), getColumnIndex(0));
      } else {
        emit(event, getValues(), getIndexes());
      }
    };
    const onChange = (columnIndex) => {
      if (dataType.value === "cascade") {
        onCascadeChange(columnIndex);
      }
      if (dataType.value === "plain") {
        emit("change", getColumnValue(0), getColumnIndex(0));
      } else {
        emit("change", getValues(), columnIndex);
      }
    };
    const confirm = () => {
      children.forEach((child) => child.stopMomentum());
      emitAction("confirm");
    };
    const cancel = () => emitAction("cancel");
    const renderTitle = () => {
      if (slots.title) {
        return slots.title();
      }
      if (props.title) {
        return createVNode("div", {
          "class": [bem$1e("title"), "van-ellipsis"]
        }, [props.title]);
      }
    };
    const renderCancel = () => {
      const text = props.cancelButtonText || t$j("cancel");
      return createVNode("button", {
        "type": "button",
        "class": [bem$1e("cancel"), HAPTICS_FEEDBACK],
        "onClick": cancel
      }, [slots.cancel ? slots.cancel() : text]);
    };
    const renderConfirm = () => {
      const text = props.confirmButtonText || t$j("confirm");
      return createVNode("button", {
        "type": "button",
        "class": [bem$1e("confirm"), HAPTICS_FEEDBACK],
        "onClick": confirm
      }, [slots.confirm ? slots.confirm() : text]);
    };
    const renderToolbar = () => {
      if (props.showToolbar) {
        const slot = slots.toolbar || slots.default;
        return createVNode("div", {
          "class": bem$1e("toolbar")
        }, [slot ? slot() : [renderCancel(), renderTitle(), renderConfirm()]]);
      }
    };
    const renderColumnItems = () => formattedColumns.value.map((item, columnIndex) => {
      var _a;
      return createVNode(stdin_default$1n, {
        "textKey": columnsFieldNames.value.text,
        "readonly": props.readonly,
        "allowHtml": props.allowHtml,
        "className": item.className,
        "itemHeight": itemHeight.value,
        "defaultIndex": (_a = item.defaultIndex) != null ? _a : +props.defaultIndex,
        "swipeDuration": props.swipeDuration,
        "initialOptions": item[columnsFieldNames.value.values],
        "visibleItemCount": props.visibleItemCount,
        "onChange": () => onChange(columnIndex)
      }, {
        option: slots.option
      });
    });
    const renderMask = (wrapHeight) => {
      if (hasOptions.value) {
        const frameStyle = {
          height: `${itemHeight.value}px`
        };
        const maskStyle = {
          backgroundSize: `100% ${(wrapHeight - itemHeight.value) / 2}px`
        };
        return [createVNode("div", {
          "class": bem$1e("mask"),
          "style": maskStyle
        }, null), createVNode("div", {
          "class": [BORDER_UNSET_TOP_BOTTOM, bem$1e("frame")],
          "style": frameStyle
        }, null)];
      }
    };
    const renderColumns = () => {
      const wrapHeight = itemHeight.value * +props.visibleItemCount;
      const columnsStyle = {
        height: `${wrapHeight}px`
      };
      return createVNode("div", {
        "class": bem$1e("columns"),
        "style": columnsStyle,
        "onTouchmove": preventDefault
      }, [renderColumnItems(), renderMask(wrapHeight)]);
    };
    watch(() => props.columns, format2, {
      immediate: true
    });
    useExpose({
      confirm,
      getValues,
      setValues,
      getIndexes,
      setIndexes,
      getColumnIndex,
      setColumnIndex,
      getColumnValue,
      setColumnValue,
      getColumnValues,
      setColumnValues
    });
    return () => {
      var _a, _b;
      return createVNode("div", {
        "class": bem$1e()
      }, [props.toolbarPosition === "top" ? renderToolbar() : null, props.loading ? createVNode(Loading, {
        "class": bem$1e("loading")
      }, null) : null, (_a = slots["columns-top"]) == null ? void 0 : _a.call(slots), renderColumns(), (_b = slots["columns-bottom"]) == null ? void 0 : _b.call(slots), props.toolbarPosition === "bottom" ? renderToolbar() : null]);
    };
  }
});
const Picker = withInstall(stdin_default$1m);
const [name$1h, bem$1d] = createNamespace("area");
const EMPTY_CODE = "000000";
const INHERIT_SLOTS = ["title", "cancel", "confirm", "toolbar", "columns-top", "columns-bottom"];
const INHERIT_PROPS = ["title", "loading", "readonly", "itemHeight", "swipeDuration", "visibleItemCount", "cancelButtonText", "confirmButtonText"];
const isOverseaCode = (code) => code[0] === "9";
const areaProps = extend({}, pickerSharedProps, {
  value: String,
  columnsNum: makeNumericProp(3),
  columnsPlaceholder: makeArrayProp(),
  areaList: {
    type: Object,
    default: () => ({})
  },
  isOverseaCode: {
    type: Function,
    default: isOverseaCode
  }
});
var stdin_default$1l = defineComponent({
  name: name$1h,
  props: areaProps,
  emits: ["change", "confirm", "cancel"],
  setup(props, {
    emit,
    slots
  }) {
    const pickerRef = ref();
    const state = reactive({
      code: props.value,
      columns: [{
        values: []
      }, {
        values: []
      }, {
        values: []
      }]
    });
    const areaList = computed(() => {
      const {
        areaList: areaList2
      } = props;
      return {
        province: areaList2.province_list || {},
        city: areaList2.city_list || {},
        county: areaList2.county_list || {}
      };
    });
    const placeholderMap = computed(() => {
      const {
        columnsPlaceholder
      } = props;
      return {
        province: columnsPlaceholder[0] || "",
        city: columnsPlaceholder[1] || "",
        county: columnsPlaceholder[2] || ""
      };
    });
    const getDefaultCode = () => {
      if (props.columnsPlaceholder.length) {
        return EMPTY_CODE;
      }
      const {
        county,
        city
      } = areaList.value;
      const countyCodes = Object.keys(county);
      if (countyCodes[0]) {
        return countyCodes[0];
      }
      const cityCodes = Object.keys(city);
      if (cityCodes[0]) {
        return cityCodes[0];
      }
      return "";
    };
    const getColumnValues = (type, code) => {
      let column = [];
      if (type !== "province" && !code) {
        return column;
      }
      const list = areaList.value[type];
      column = Object.keys(list).map((listCode) => ({
        code: listCode,
        name: list[listCode]
      }));
      if (code) {
        if (type === "city" && props.isOverseaCode(code)) {
          code = "9";
        }
        column = column.filter((item) => item.code.indexOf(code) === 0);
      }
      if (placeholderMap.value[type] && column.length) {
        let codeFill = "";
        if (type === "city") {
          codeFill = EMPTY_CODE.slice(2, 4);
        } else if (type === "county") {
          codeFill = EMPTY_CODE.slice(4, 6);
        }
        column.unshift({
          code: code + codeFill,
          name: placeholderMap.value[type]
        });
      }
      return column;
    };
    const getIndex = (type, code) => {
      let compareNum = code.length;
      if (type === "province") {
        compareNum = props.isOverseaCode(code) ? 1 : 2;
      }
      if (type === "city") {
        compareNum = 4;
      }
      code = code.slice(0, compareNum);
      const list = getColumnValues(type, compareNum > 2 ? code.slice(0, compareNum - 2) : "");
      for (let i = 0; i < list.length; i++) {
        if (list[i].code.slice(0, compareNum) === code) {
          return i;
        }
      }
      return 0;
    };
    const setValues = () => {
      const picker = pickerRef.value;
      if (!picker) {
        return;
      }
      let code = state.code || getDefaultCode();
      const province = getColumnValues("province");
      const city = getColumnValues("city", code.slice(0, 2));
      picker.setColumnValues(0, province);
      picker.setColumnValues(1, city);
      if (city.length && code.slice(2, 4) === "00" && !props.isOverseaCode(code)) {
        [{
          code
        }] = city;
      }
      picker.setColumnValues(2, getColumnValues("county", code.slice(0, 4)));
      picker.setIndexes([getIndex("province", code), getIndex("city", code), getIndex("county", code)]);
    };
    const parseValues = (values) => values.map((value, index2) => {
      if (value) {
        value = deepClone(value);
        if (!value.code || value.name === props.columnsPlaceholder[index2]) {
          value.code = "";
          value.name = "";
        }
      }
      return value;
    });
    const getValues = () => {
      if (pickerRef.value) {
        const values = pickerRef.value.getValues().filter(Boolean);
        return parseValues(values);
      }
      return [];
    };
    const getArea = () => {
      const values = getValues();
      const area = {
        code: "",
        country: "",
        province: "",
        city: "",
        county: ""
      };
      if (!values.length) {
        return area;
      }
      const names = values.map((item) => item.name);
      const validValues = values.filter((value) => value.code);
      area.code = validValues.length ? validValues[validValues.length - 1].code : "";
      if (props.isOverseaCode(area.code)) {
        area.country = names[1] || "";
        area.province = names[2] || "";
      } else {
        area.province = names[0] || "";
        area.city = names[1] || "";
        area.county = names[2] || "";
      }
      return area;
    };
    const reset2 = (newCode = "") => {
      state.code = newCode;
      setValues();
    };
    const onChange = (values, index2) => {
      state.code = values[index2].code;
      setValues();
      if (pickerRef.value) {
        const parsedValues = parseValues(pickerRef.value.getValues());
        emit("change", parsedValues, index2);
      }
    };
    const onConfirm = (values, index2) => {
      setValues();
      emit("confirm", parseValues(values), index2);
    };
    const onCancel = (...args) => emit("cancel", ...args);
    onMounted(setValues);
    watch(() => props.value, (value) => {
      state.code = value;
      setValues();
    });
    watch(() => props.areaList, setValues, {
      deep: true
    });
    watch(() => props.columnsNum, () => {
      nextTick(setValues);
    });
    useExpose({
      reset: reset2,
      getArea,
      getValues
    });
    return () => {
      const columns = state.columns.slice(0, +props.columnsNum);
      return createVNode(Picker, mergeProps({
        "ref": pickerRef,
        "class": bem$1d(),
        "columns": columns,
        "columnsFieldNames": {
          text: "name"
        },
        "onChange": onChange,
        "onCancel": onCancel,
        "onConfirm": onConfirm
      }, pick(props, INHERIT_PROPS)), pick(slots, INHERIT_SLOTS));
    };
  }
});
const Area = withInstall(stdin_default$1l);
const [name$1g, bem$1c] = createNamespace("cell");
const cellSharedProps = {
  icon: String,
  size: String,
  title: numericProp,
  value: numericProp,
  label: numericProp,
  center: Boolean,
  isLink: Boolean,
  border: truthProp,
  required: Boolean,
  iconPrefix: String,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleStyle: null,
  arrowDirection: String,
  clickable: {
    type: Boolean,
    default: null
  }
};
const cellProps = extend({}, cellSharedProps, routeProps);
var stdin_default$1k = defineComponent({
  name: name$1g,
  props: cellProps,
  setup(props, {
    slots
  }) {
    const route2 = useRoute();
    const renderLabel = () => {
      const showLabel = slots.label || isDef(props.label);
      if (showLabel) {
        return createVNode("div", {
          "class": [bem$1c("label"), props.labelClass]
        }, [slots.label ? slots.label() : props.label]);
      }
    };
    const renderTitle = () => {
      if (slots.title || isDef(props.title)) {
        return createVNode("div", {
          "class": [bem$1c("title"), props.titleClass],
          "style": props.titleStyle
        }, [slots.title ? slots.title() : createVNode("span", null, [props.title]), renderLabel()]);
      }
    };
    const renderValue = () => {
      const slot = slots.value || slots.default;
      const hasValue = slot || isDef(props.value);
      if (hasValue) {
        const hasTitle = slots.title || isDef(props.title);
        return createVNode("div", {
          "class": [bem$1c("value", {
            alone: !hasTitle
          }), props.valueClass]
        }, [slot ? slot() : createVNode("span", null, [props.value])]);
      }
    };
    const renderLeftIcon = () => {
      if (slots.icon) {
        return slots.icon();
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "class": bem$1c("left-icon"),
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    const renderRightIcon = () => {
      if (slots["right-icon"]) {
        return slots["right-icon"]();
      }
      if (props.isLink) {
        const name2 = props.arrowDirection ? `arrow-${props.arrowDirection}` : "arrow";
        return createVNode(Icon, {
          "name": name2,
          "class": bem$1c("right-icon")
        }, null);
      }
    };
    return () => {
      var _a, _b;
      const {
        size: size2,
        center,
        border,
        isLink,
        required
      } = props;
      const clickable = (_a = props.clickable) != null ? _a : isLink;
      const classes = {
        center,
        required,
        clickable,
        borderless: !border
      };
      if (size2) {
        classes[size2] = !!size2;
      }
      return createVNode("div", {
        "class": bem$1c(classes),
        "role": clickable ? "button" : void 0,
        "tabindex": clickable ? 0 : void 0,
        "onClick": route2
      }, [renderLeftIcon(), renderTitle(), renderValue(), renderRightIcon(), (_b = slots.extra) == null ? void 0 : _b.call(slots)]);
    };
  }
});
const Cell = withInstall(stdin_default$1k);
const [name$1f, bem$1b] = createNamespace("form");
const formProps = {
  colon: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  showError: Boolean,
  labelWidth: numericProp,
  labelAlign: String,
  inputAlign: String,
  scrollToError: Boolean,
  validateFirst: Boolean,
  submitOnEnter: truthProp,
  showErrorMessage: truthProp,
  errorMessageAlign: String,
  validateTrigger: {
    type: [String, Array],
    default: "onBlur"
  }
};
var stdin_default$1j = defineComponent({
  name: name$1f,
  props: formProps,
  emits: ["submit", "failed"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      children,
      linkChildren
    } = useChildren(FORM_KEY);
    const getFieldsByNames = (names) => {
      if (names) {
        return children.filter((field) => names.includes(field.name));
      }
      return children;
    };
    const validateSeq = (names) => new Promise((resolve2, reject) => {
      const errors = [];
      const fields = getFieldsByNames(names);
      fields.reduce((promise, field) => promise.then(() => {
        if (!errors.length) {
          return field.validate().then((error) => {
            if (error) {
              errors.push(error);
            }
          });
        }
      }), Promise.resolve()).then(() => {
        if (errors.length) {
          reject(errors);
        } else {
          resolve2();
        }
      });
    });
    const validateAll = (names) => new Promise((resolve2, reject) => {
      const fields = getFieldsByNames(names);
      Promise.all(fields.map((item) => item.validate())).then((errors) => {
        errors = errors.filter(Boolean);
        if (errors.length) {
          reject(errors);
        } else {
          resolve2();
        }
      });
    });
    const validateField = (name2) => {
      const matched = children.find((item) => item.name === name2);
      if (matched) {
        return new Promise((resolve2, reject) => {
          matched.validate().then((error) => {
            if (error) {
              reject(error);
            } else {
              resolve2();
            }
          });
        });
      }
      return Promise.reject();
    };
    const validate = (name2) => {
      if (typeof name2 === "string") {
        return validateField(name2);
      }
      return props.validateFirst ? validateSeq(name2) : validateAll(name2);
    };
    const resetValidation = (name2) => {
      if (typeof name2 === "string") {
        name2 = [name2];
      }
      const fields = getFieldsByNames(name2);
      fields.forEach((item) => {
        item.resetValidation();
      });
    };
    const getValidationStatus = () => children.reduce((form, field) => {
      form[field.name] = field.getValidationStatus();
      return form;
    }, {});
    const scrollToField = (name2, options) => {
      children.some((item) => {
        if (item.name === name2) {
          item.$el.scrollIntoView(options);
          return true;
        }
        return false;
      });
    };
    const getValues = () => children.reduce((form, field) => {
      form[field.name] = field.formValue.value;
      return form;
    }, {});
    const submit = () => {
      const values = getValues();
      validate().then(() => emit("submit", values)).catch((errors) => {
        emit("failed", {
          values,
          errors
        });
        if (props.scrollToError && errors[0].name) {
          scrollToField(errors[0].name);
        }
      });
    };
    const onSubmit = (event) => {
      preventDefault(event);
      submit();
    };
    linkChildren({
      props
    });
    useExpose({
      submit,
      validate,
      getValues,
      scrollToField,
      resetValidation,
      getValidationStatus
    });
    return () => {
      var _a;
      return createVNode("form", {
        "class": bem$1b(),
        "onSubmit": onSubmit
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Form = withInstall(stdin_default$1j);
function isEmptyValue(value) {
  if (Array.isArray(value)) {
    return !value.length;
  }
  if (value === 0) {
    return false;
  }
  return !value;
}
function runSyncRule(value, rule) {
  if (rule.required && isEmptyValue(value)) {
    return false;
  }
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return false;
  }
  return true;
}
function runRuleValidator(value, rule) {
  return new Promise((resolve2) => {
    const returnVal = rule.validator(value, rule);
    if (isPromise(returnVal)) {
      returnVal.then(resolve2);
      return;
    }
    resolve2(returnVal);
  });
}
function getRuleMessage(value, rule) {
  const { message } = rule;
  if (isFunction(message)) {
    return message(value, rule);
  }
  return message || "";
}
function startComposing({ target }) {
  target.composing = true;
}
function endComposing({ target }) {
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
function resizeTextarea(input, autosize) {
  const scrollTop = getRootScrollTop();
  input.style.height = "auto";
  let height2 = input.scrollHeight;
  if (isObject(autosize)) {
    const { maxHeight, minHeight } = autosize;
    if (maxHeight !== void 0) {
      height2 = Math.min(height2, maxHeight);
    }
    if (minHeight !== void 0) {
      height2 = Math.max(height2, minHeight);
    }
  }
  if (height2) {
    input.style.height = `${height2}px`;
    setRootScrollTop(scrollTop);
  }
}
function mapInputType(type) {
  if (type === "number") {
    return {
      type: "text",
      inputmode: "decimal"
    };
  }
  if (type === "digit") {
    return {
      type: "tel",
      inputmode: "numeric"
    };
  }
  return { type };
}
function getStringLength(str) {
  return [...str].length;
}
function cutString(str, maxlength) {
  return [...str].slice(0, maxlength).join("");
}
let current = 0;
function useId$1() {
  const vm = getCurrentInstance();
  const { name: name2 = "unknown" } = (vm == null ? void 0 : vm.type) || {};
  return `${name2}-${++current}`;
}
const [name$1e, bem$1a] = createNamespace("field");
const fieldSharedProps = {
  id: String,
  name: String,
  leftIcon: String,
  rightIcon: String,
  autofocus: Boolean,
  clearable: Boolean,
  maxlength: numericProp,
  formatter: Function,
  clearIcon: makeStringProp("clear"),
  modelValue: makeNumericProp(""),
  inputAlign: String,
  placeholder: String,
  autocomplete: String,
  errorMessage: String,
  enterkeyhint: String,
  clearTrigger: makeStringProp("focus"),
  formatTrigger: makeStringProp("onChange"),
  error: {
    type: Boolean,
    default: null
  },
  disabled: {
    type: Boolean,
    default: null
  },
  readonly: {
    type: Boolean,
    default: null
  }
};
const fieldProps = extend({}, cellSharedProps, fieldSharedProps, {
  rows: numericProp,
  type: makeStringProp("text"),
  rules: Array,
  autosize: [Boolean, Object],
  labelWidth: numericProp,
  labelClass: unknownProp,
  labelAlign: String,
  showWordLimit: Boolean,
  errorMessageAlign: String,
  colon: {
    type: Boolean,
    default: null
  }
});
var stdin_default$1i = defineComponent({
  name: name$1e,
  props: fieldProps,
  emits: ["blur", "focus", "clear", "keypress", "click-input", "end-validate", "start-validate", "click-left-icon", "click-right-icon", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const id = useId$1();
    const state = reactive({
      status: "unvalidated",
      focused: false,
      validateMessage: ""
    });
    const inputRef = ref();
    const customValue = ref();
    const {
      parent: form
    } = useParent(FORM_KEY);
    const getModelValue = () => {
      var _a;
      return String((_a = props.modelValue) != null ? _a : "");
    };
    const getProp = (key) => {
      if (isDef(props[key])) {
        return props[key];
      }
      if (form && isDef(form.props[key])) {
        return form.props[key];
      }
    };
    const showClear = computed(() => {
      const readonly2 = getProp("readonly");
      if (props.clearable && !readonly2) {
        const hasValue = getModelValue() !== "";
        const trigger2 = props.clearTrigger === "always" || props.clearTrigger === "focus" && state.focused;
        return hasValue && trigger2;
      }
      return false;
    });
    const formValue = computed(() => {
      if (customValue.value && slots.input) {
        return customValue.value();
      }
      return props.modelValue;
    });
    const runRules = (rules) => rules.reduce((promise, rule) => promise.then(() => {
      if (state.status === "failed") {
        return;
      }
      let {
        value
      } = formValue;
      if (rule.formatter) {
        value = rule.formatter(value, rule);
      }
      if (!runSyncRule(value, rule)) {
        state.status = "failed";
        state.validateMessage = getRuleMessage(value, rule);
        return;
      }
      if (rule.validator) {
        return runRuleValidator(value, rule).then((result) => {
          if (result && typeof result === "string") {
            state.status = "failed";
            state.validateMessage = result;
          } else if (result === false) {
            state.status = "failed";
            state.validateMessage = getRuleMessage(value, rule);
          }
        });
      }
    }), Promise.resolve());
    const resetValidation = () => {
      state.status = "unvalidated";
      state.validateMessage = "";
    };
    const endValidate = () => emit("end-validate", {
      status: state.status
    });
    const validate = (rules = props.rules) => new Promise((resolve2) => {
      resetValidation();
      if (rules) {
        emit("start-validate");
        runRules(rules).then(() => {
          if (state.status === "failed") {
            resolve2({
              name: props.name,
              message: state.validateMessage
            });
            endValidate();
          } else {
            state.status = "passed";
            resolve2();
            endValidate();
          }
        });
      } else {
        resolve2();
      }
    });
    const validateWithTrigger = (trigger2) => {
      if (form && props.rules) {
        const {
          validateTrigger
        } = form.props;
        const defaultTrigger = toArray(validateTrigger).includes(trigger2);
        const rules = props.rules.filter((rule) => {
          if (rule.trigger) {
            return toArray(rule.trigger).includes(trigger2);
          }
          return defaultTrigger;
        });
        if (rules.length) {
          validate(rules);
        }
      }
    };
    const limitValueLength = (value) => {
      const {
        maxlength
      } = props;
      if (isDef(maxlength) && getStringLength(value) > maxlength) {
        const modelValue = getModelValue();
        if (modelValue && getStringLength(modelValue) === +maxlength) {
          return modelValue;
        }
        return cutString(value, +maxlength);
      }
      return value;
    };
    const updateValue = (value, trigger2 = "onChange") => {
      value = limitValueLength(value);
      if (props.type === "number" || props.type === "digit") {
        const isNumber = props.type === "number";
        value = formatNumber(value, isNumber, isNumber);
      }
      if (props.formatter && trigger2 === props.formatTrigger) {
        value = props.formatter(value);
      }
      if (inputRef.value && inputRef.value.value !== value) {
        inputRef.value.value = value;
      }
      if (value !== props.modelValue) {
        emit("update:modelValue", value);
      }
    };
    const onInput = (event) => {
      if (!event.target.composing) {
        updateValue(event.target.value);
      }
    };
    const blur = () => {
      var _a;
      return (_a = inputRef.value) == null ? void 0 : _a.blur();
    };
    const focus = () => {
      var _a;
      return (_a = inputRef.value) == null ? void 0 : _a.focus();
    };
    const adjustTextareaSize = () => {
      const input = inputRef.value;
      if (props.type === "textarea" && props.autosize && input) {
        resizeTextarea(input, props.autosize);
      }
    };
    const onFocus = (event) => {
      state.focused = true;
      emit("focus", event);
      nextTick(adjustTextareaSize);
      if (getProp("readonly")) {
        blur();
      }
    };
    const onBlur = (event) => {
      if (getProp("readonly")) {
        return;
      }
      state.focused = false;
      updateValue(getModelValue(), "onBlur");
      emit("blur", event);
      validateWithTrigger("onBlur");
      nextTick(adjustTextareaSize);
      resetScroll();
    };
    const onClickInput = (event) => emit("click-input", event);
    const onClickLeftIcon = (event) => emit("click-left-icon", event);
    const onClickRightIcon = (event) => emit("click-right-icon", event);
    const onClear = (event) => {
      preventDefault(event);
      emit("update:modelValue", "");
      emit("clear", event);
    };
    const showError = computed(() => {
      if (typeof props.error === "boolean") {
        return props.error;
      }
      if (form && form.props.showError && state.status === "failed") {
        return true;
      }
    });
    const labelStyle = computed(() => {
      const labelWidth = getProp("labelWidth");
      if (labelWidth) {
        return {
          width: addUnit(labelWidth)
        };
      }
    });
    const onKeypress = (event) => {
      const ENTER_CODE = 13;
      if (event.keyCode === ENTER_CODE) {
        const submitOnEnter = form && form.props.submitOnEnter;
        if (!submitOnEnter && props.type !== "textarea") {
          preventDefault(event);
        }
        if (props.type === "search") {
          blur();
        }
      }
      emit("keypress", event);
    };
    const getInputId = () => props.id || `${id}-input`;
    const getValidationStatus = () => state.status;
    const renderInput = () => {
      const controlClass = bem$1a("control", [getProp("inputAlign"), {
        error: showError.value,
        custom: !!slots.input,
        "min-height": props.type === "textarea" && !props.autosize
      }]);
      if (slots.input) {
        return createVNode("div", {
          "class": controlClass,
          "onClick": onClickInput
        }, [slots.input()]);
      }
      const inputAttrs = {
        id: getInputId(),
        ref: inputRef,
        name: props.name,
        rows: props.rows !== void 0 ? +props.rows : void 0,
        class: controlClass,
        disabled: getProp("disabled"),
        readonly: getProp("readonly"),
        autofocus: props.autofocus,
        placeholder: props.placeholder,
        autocomplete: props.autocomplete,
        enterkeyhint: props.enterkeyhint,
        "aria-labelledby": props.label ? `${id}-label` : void 0,
        onBlur,
        onFocus,
        onInput,
        onClick: onClickInput,
        onChange: endComposing,
        onKeypress,
        onCompositionend: endComposing,
        onCompositionstart: startComposing
      };
      if (props.type === "textarea") {
        return createVNode("textarea", inputAttrs, null);
      }
      return createVNode("input", mergeProps(mapInputType(props.type), inputAttrs), null);
    };
    const renderLeftIcon = () => {
      const leftIconSlot = slots["left-icon"];
      if (props.leftIcon || leftIconSlot) {
        return createVNode("div", {
          "class": bem$1a("left-icon"),
          "onClick": onClickLeftIcon
        }, [leftIconSlot ? leftIconSlot() : createVNode(Icon, {
          "name": props.leftIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };
    const renderRightIcon = () => {
      const rightIconSlot = slots["right-icon"];
      if (props.rightIcon || rightIconSlot) {
        return createVNode("div", {
          "class": bem$1a("right-icon"),
          "onClick": onClickRightIcon
        }, [rightIconSlot ? rightIconSlot() : createVNode(Icon, {
          "name": props.rightIcon,
          "classPrefix": props.iconPrefix
        }, null)]);
      }
    };
    const renderWordLimit = () => {
      if (props.showWordLimit && props.maxlength) {
        const count = getStringLength(getModelValue());
        return createVNode("div", {
          "class": bem$1a("word-limit")
        }, [createVNode("span", {
          "class": bem$1a("word-num")
        }, [count]), createTextVNode("/"), props.maxlength]);
      }
    };
    const renderMessage = () => {
      if (form && form.props.showErrorMessage === false) {
        return;
      }
      const message = props.errorMessage || state.validateMessage;
      if (message) {
        const slot = slots["error-message"];
        const errorMessageAlign = getProp("errorMessageAlign");
        return createVNode("div", {
          "class": bem$1a("error-message", errorMessageAlign)
        }, [slot ? slot({
          message
        }) : message]);
      }
    };
    const renderLabel = () => {
      const colon = getProp("colon") ? ":" : "";
      if (slots.label) {
        return [slots.label(), colon];
      }
      if (props.label) {
        return createVNode("label", {
          "id": `${id}-label`,
          "for": getInputId()
        }, [props.label + colon]);
      }
    };
    const renderFieldBody = () => [createVNode("div", {
      "class": bem$1a("body")
    }, [renderInput(), showClear.value && createVNode(Icon, {
      "name": props.clearIcon,
      "class": bem$1a("clear"),
      "onTouchstart": onClear
    }, null), renderRightIcon(), slots.button && createVNode("div", {
      "class": bem$1a("button")
    }, [slots.button()])]), renderWordLimit(), renderMessage()];
    useExpose({
      blur,
      focus,
      validate,
      formValue,
      resetValidation,
      getValidationStatus
    });
    provide(CUSTOM_FIELD_INJECTION_KEY, {
      customValue,
      resetValidation,
      validateWithTrigger
    });
    watch(() => props.modelValue, () => {
      updateValue(getModelValue());
      resetValidation();
      validateWithTrigger("onChange");
      nextTick(adjustTextareaSize);
    });
    onMounted(() => {
      updateValue(getModelValue(), props.formatTrigger);
      nextTick(adjustTextareaSize);
    });
    return () => {
      const disabled = getProp("disabled");
      const labelAlign = getProp("labelAlign");
      const Label = renderLabel();
      const LeftIcon = renderLeftIcon();
      return createVNode(Cell, {
        "size": props.size,
        "icon": props.leftIcon,
        "class": bem$1a({
          error: showError.value,
          disabled,
          [`label-${labelAlign}`]: labelAlign
        }),
        "center": props.center,
        "border": props.border,
        "isLink": props.isLink,
        "clickable": props.clickable,
        "titleStyle": labelStyle.value,
        "valueClass": bem$1a("value"),
        "titleClass": [bem$1a("label", [labelAlign, {
          required: props.required
        }]), props.labelClass],
        "arrowDirection": props.arrowDirection
      }, {
        icon: LeftIcon ? () => LeftIcon : null,
        title: Label ? () => Label : null,
        value: renderFieldBody,
        extra: slots.extra
      });
    };
  }
});
const Field = withInstall(stdin_default$1i);
function usePopupState() {
  const state = reactive({
    show: false
  });
  const toggle = (show) => {
    state.show = show;
  };
  const open = (props) => {
    extend(state, props, { transitionAppear: true });
    toggle(true);
  };
  const close = () => toggle(false);
  useExpose({ open, close, toggle });
  return {
    open,
    close,
    state,
    toggle
  };
}
function mountComponent(RootComponent) {
  const app2 = createApp$1(RootComponent);
  const root = document.createElement("div");
  document.body.appendChild(root);
  return {
    instance: app2.mount(root),
    unmount() {
      app2.unmount();
      document.body.removeChild(root);
    }
  };
}
let lockCount = 0;
function lockClick(lock) {
  if (lock) {
    if (!lockCount) {
      document.body.classList.add("van-toast--unclickable");
    }
    lockCount++;
  } else if (lockCount) {
    lockCount--;
    if (!lockCount) {
      document.body.classList.remove("van-toast--unclickable");
    }
  }
}
const [name$1d, bem$19] = createNamespace("toast");
const popupInheritProps = ["show", "overlay", "teleport", "transition", "overlayClass", "overlayStyle", "closeOnClickOverlay"];
const toastProps = {
  icon: String,
  show: Boolean,
  type: makeStringProp("text"),
  overlay: Boolean,
  message: numericProp,
  iconSize: numericProp,
  duration: makeNumberProp(2e3),
  position: makeStringProp("middle"),
  teleport: [String, Object],
  className: unknownProp,
  iconPrefix: String,
  transition: makeStringProp("van-fade"),
  loadingType: String,
  forbidClick: Boolean,
  overlayClass: unknownProp,
  overlayStyle: Object,
  closeOnClick: Boolean,
  closeOnClickOverlay: Boolean
};
var stdin_default$1h = defineComponent({
  name: name$1d,
  props: toastProps,
  emits: ["update:show"],
  setup(props, {
    emit
  }) {
    let timer2;
    let clickable = false;
    const toggleClickable = () => {
      const newValue = props.show && props.forbidClick;
      if (clickable !== newValue) {
        clickable = newValue;
        lockClick(clickable);
      }
    };
    const updateShow = (show) => emit("update:show", show);
    const onClick = () => {
      if (props.closeOnClick) {
        updateShow(false);
      }
    };
    const clearTimer = () => clearTimeout(timer2);
    const renderIcon = () => {
      const {
        icon,
        type,
        iconSize,
        iconPrefix,
        loadingType
      } = props;
      const hasIcon = icon || type === "success" || type === "fail";
      if (hasIcon) {
        return createVNode(Icon, {
          "name": icon || type,
          "size": iconSize,
          "class": bem$19("icon"),
          "classPrefix": iconPrefix
        }, null);
      }
      if (type === "loading") {
        return createVNode(Loading, {
          "class": bem$19("loading"),
          "size": iconSize,
          "type": loadingType
        }, null);
      }
    };
    const renderMessage = () => {
      const {
        type,
        message
      } = props;
      if (isDef(message) && message !== "") {
        return type === "html" ? createVNode("div", {
          "key": 0,
          "class": bem$19("text"),
          "innerHTML": String(message)
        }, null) : createVNode("div", {
          "class": bem$19("text")
        }, [message]);
      }
    };
    watch(() => [props.show, props.forbidClick], toggleClickable);
    watch(() => [props.show, props.type, props.message, props.duration], () => {
      clearTimer();
      if (props.show && props.duration > 0) {
        timer2 = setTimeout(() => {
          updateShow(false);
        }, props.duration);
      }
    });
    onMounted(toggleClickable);
    onUnmounted(toggleClickable);
    return () => createVNode(Popup, mergeProps({
      "class": [bem$19([props.position, {
        [props.type]: !props.icon
      }]), props.className],
      "lockScroll": false,
      "onClick": onClick,
      "onClosed": clearTimer,
      "onUpdate:show": updateShow
    }, pick(props, popupInheritProps)), {
      default: () => [renderIcon(), renderMessage()]
    });
  }
});
const defaultOptions = {
  icon: "",
  type: "text",
  message: "",
  className: "",
  overlay: false,
  onClose: void 0,
  onOpened: void 0,
  duration: 2e3,
  teleport: "body",
  iconSize: void 0,
  iconPrefix: void 0,
  position: "middle",
  transition: "van-fade",
  forbidClick: false,
  loadingType: void 0,
  overlayClass: "",
  overlayStyle: void 0,
  closeOnClick: false,
  closeOnClickOverlay: false
};
let queue = [];
let allowMultiple = false;
let currentOptions = extend({}, defaultOptions);
const defaultOptionsMap = /* @__PURE__ */ new Map();
function parseOptions$1(message) {
  if (isObject(message)) {
    return message;
  }
  return {
    message
  };
}
function createInstance() {
  const {
    instance: instance2,
    unmount
  } = mountComponent({
    setup() {
      const message = ref("");
      const {
        open,
        state,
        close,
        toggle
      } = usePopupState();
      const onClosed = () => {
        if (allowMultiple) {
          queue = queue.filter((item) => item !== instance2);
          unmount();
        }
      };
      const render = () => {
        const attrs = {
          onClosed,
          "onUpdate:show": toggle
        };
        return createVNode(stdin_default$1h, mergeProps(state, attrs), null);
      };
      watch(message, (val) => {
        state.message = val;
      });
      getCurrentInstance().render = render;
      return {
        open,
        clear: close,
        message
      };
    }
  });
  return instance2;
}
function getInstance() {
  if (!queue.length || allowMultiple) {
    const instance2 = createInstance();
    queue.push(instance2);
  }
  return queue[queue.length - 1];
}
function Toast(options = {}) {
  if (!inBrowser$1) {
    return {};
  }
  const toast = getInstance();
  const parsedOptions = parseOptions$1(options);
  toast.open(extend({}, currentOptions, defaultOptionsMap.get(parsedOptions.type || currentOptions.type), parsedOptions));
  return toast;
}
const createMethod = (type) => (options) => Toast(extend({
  type
}, parseOptions$1(options)));
Toast.loading = createMethod("loading");
Toast.success = createMethod("success");
Toast.fail = createMethod("fail");
Toast.clear = (all) => {
  var _a;
  if (queue.length) {
    if (all) {
      queue.forEach((toast) => {
        toast.clear();
      });
      queue = [];
    } else if (!allowMultiple) {
      queue[0].clear();
    } else {
      (_a = queue.shift()) == null ? void 0 : _a.clear();
    }
  }
};
function setDefaultOptions(type, options) {
  if (typeof type === "string") {
    defaultOptionsMap.set(type, options);
  } else {
    extend(currentOptions, type);
  }
}
Toast.setDefaultOptions = setDefaultOptions;
Toast.resetDefaultOptions = (type) => {
  if (typeof type === "string") {
    defaultOptionsMap.delete(type);
  } else {
    currentOptions = extend({}, defaultOptions);
    defaultOptionsMap.clear();
  }
};
Toast.allowMultiple = (value = true) => {
  allowMultiple = value;
};
Toast.install = (app2) => {
  app2.use(withInstall(stdin_default$1h));
  app2.config.globalProperties.$toast = Toast;
};
const [name$1c, bem$18] = createNamespace("switch");
const switchProps = {
  size: numericProp,
  loading: Boolean,
  disabled: Boolean,
  modelValue: unknownProp,
  activeColor: String,
  inactiveColor: String,
  activeValue: {
    type: unknownProp,
    default: true
  },
  inactiveValue: {
    type: unknownProp,
    default: false
  }
};
var stdin_default$1g = defineComponent({
  name: name$1c,
  props: switchProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const isChecked = () => props.modelValue === props.activeValue;
    const onClick = () => {
      if (!props.disabled && !props.loading) {
        const newValue = isChecked() ? props.inactiveValue : props.activeValue;
        emit("update:modelValue", newValue);
        emit("change", newValue);
      }
    };
    const renderLoading = () => {
      if (props.loading) {
        const color = isChecked() ? props.activeColor : props.inactiveColor;
        return createVNode(Loading, {
          "class": bem$18("loading"),
          "color": color
        }, null);
      }
      if (slots.node) {
        return slots.node();
      }
    };
    useCustomFieldValue(() => props.modelValue);
    return () => {
      var _a;
      const {
        size: size2,
        loading,
        disabled,
        activeColor,
        inactiveColor
      } = props;
      const checked = isChecked();
      const style = {
        fontSize: addUnit(size2),
        backgroundColor: checked ? activeColor : inactiveColor
      };
      return createVNode("div", {
        "role": "switch",
        "class": bem$18({
          on: checked,
          loading,
          disabled
        }),
        "style": style,
        "tabindex": disabled ? void 0 : 0,
        "aria-checked": checked,
        "onClick": onClick
      }, [createVNode("div", {
        "class": bem$18("node")
      }, [renderLoading()]), (_a = slots.background) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Switch = withInstall(stdin_default$1g);
const [name$1b, bem$17] = createNamespace("address-edit-detail");
const t$i = createNamespace("address-edit")[2];
var stdin_default$1f = defineComponent({
  name: name$1b,
  props: {
    show: Boolean,
    rows: numericProp,
    value: String,
    rules: Array,
    focused: Boolean,
    maxlength: numericProp,
    searchResult: Array,
    showSearchResult: Boolean
  },
  emits: ["blur", "focus", "input", "select-search"],
  setup(props, {
    emit
  }) {
    const field = ref();
    const showSearchResult = () => props.focused && props.searchResult && props.showSearchResult;
    const onSelect = (express) => {
      emit("select-search", express);
      emit("input", `${express.address || ""} ${express.name || ""}`.trim());
    };
    const renderSearchTitle = (express) => {
      if (express.name) {
        const text = express.name.replace(props.value, `<span class=${bem$17("keyword")}>${props.value}</span>`);
        return createVNode("div", {
          "innerHTML": text
        }, null);
      }
    };
    const renderSearchResult = () => {
      if (!showSearchResult()) {
        return;
      }
      const {
        searchResult
      } = props;
      return searchResult.map((express) => createVNode(Cell, {
        "clickable": true,
        "key": express.name + express.address,
        "icon": "location-o",
        "label": express.address,
        "class": bem$17("search-item"),
        "border": false,
        "onClick": () => onSelect(express)
      }, {
        title: () => renderSearchTitle(express)
      }));
    };
    const onBlur = (event) => emit("blur", event);
    const onFocus = (event) => emit("focus", event);
    const onInput = (value) => emit("input", value);
    return () => {
      if (props.show) {
        return createVNode(Fragment, null, [createVNode(Field, {
          "autosize": true,
          "clearable": true,
          "ref": field,
          "class": bem$17(),
          "rows": props.rows,
          "type": "textarea",
          "rules": props.rules,
          "label": t$i("addressDetail"),
          "border": !showSearchResult(),
          "maxlength": props.maxlength,
          "modelValue": props.value,
          "placeholder": t$i("addressDetail"),
          "onBlur": onBlur,
          "onFocus": onFocus,
          "onUpdate:modelValue": onInput
        }, null), renderSearchResult()]);
      }
    };
  }
});
const [name$1a, bem$16, t$h] = createNamespace("address-edit");
const DEFAULT_DATA = {
  name: "",
  tel: "",
  city: "",
  county: "",
  country: "",
  province: "",
  areaCode: "",
  isDefault: false,
  postalCode: "",
  addressDetail: ""
};
const isPostal = (value) => /^\d{6}$/.test(value);
const addressEditProps = {
  areaList: Object,
  isSaving: Boolean,
  isDeleting: Boolean,
  validator: Function,
  showArea: truthProp,
  showDetail: truthProp,
  showDelete: Boolean,
  showPostal: Boolean,
  disableArea: Boolean,
  searchResult: Array,
  telMaxlength: numericProp,
  showSetDefault: Boolean,
  saveButtonText: String,
  areaPlaceholder: String,
  deleteButtonText: String,
  showSearchResult: Boolean,
  detailRows: makeNumericProp(1),
  detailMaxlength: makeNumericProp(200),
  areaColumnsPlaceholder: makeArrayProp(),
  addressInfo: {
    type: Object,
    default: () => extend({}, DEFAULT_DATA)
  },
  telValidator: {
    type: Function,
    default: isMobile
  },
  postalValidator: {
    type: Function,
    default: isPostal
  }
};
var stdin_default$1e = defineComponent({
  name: name$1a,
  props: addressEditProps,
  emits: ["save", "focus", "delete", "click-area", "change-area", "change-detail", "select-search", "change-default"],
  setup(props, {
    emit,
    slots
  }) {
    const areaRef = ref();
    const data = reactive({});
    const showAreaPopup = ref(false);
    const detailFocused = ref(false);
    const areaListLoaded = computed(() => isObject(props.areaList) && Object.keys(props.areaList).length);
    const areaText = computed(() => {
      const {
        country,
        province,
        city,
        county,
        areaCode
      } = data;
      if (areaCode) {
        const arr = [country, province, city, county];
        if (province && province === city) {
          arr.splice(1, 1);
        }
        return arr.filter(Boolean).join("/");
      }
      return "";
    });
    const hideBottomFields = computed(() => {
      var _a;
      return ((_a = props.searchResult) == null ? void 0 : _a.length) && detailFocused.value;
    });
    const assignAreaValues = () => {
      if (areaRef.value) {
        const detail = areaRef.value.getArea();
        detail.areaCode = detail.code;
        delete detail.code;
        extend(data, detail);
      }
    };
    const onFocus = (key) => {
      detailFocused.value = key === "addressDetail";
      emit("focus", key);
    };
    const rules = computed(() => {
      const {
        validator,
        telValidator,
        postalValidator
      } = props;
      const makeRule = (name2, emptyMessage) => ({
        validator: (value) => {
          if (validator) {
            const message = validator(name2, value);
            if (message) {
              return message;
            }
          }
          if (!value) {
            return emptyMessage;
          }
          return true;
        }
      });
      return {
        name: [makeRule("name", t$h("nameEmpty"))],
        tel: [makeRule("tel", t$h("telInvalid")), {
          validator: telValidator,
          message: t$h("telInvalid")
        }],
        areaCode: [makeRule("areaCode", t$h("areaEmpty"))],
        addressDetail: [makeRule("addressDetail", t$h("addressEmpty"))],
        postalCode: [makeRule("addressDetail", t$h("postalEmpty")), {
          validator: postalValidator,
          message: t$h("postalEmpty")
        }]
      };
    });
    const onSave = () => emit("save", data);
    const onChangeDetail = (val) => {
      data.addressDetail = val;
      emit("change-detail", val);
    };
    const onAreaConfirm = (values) => {
      values = values.filter(Boolean);
      if (values.some((value) => !value.code)) {
        Toast(t$h("areaEmpty"));
      } else {
        showAreaPopup.value = false;
        assignAreaValues();
        emit("change-area", values);
      }
    };
    const onDelete = () => emit("delete", data);
    const getArea = () => {
      var _a;
      return ((_a = areaRef.value) == null ? void 0 : _a.getValues()) || [];
    };
    const setAreaCode = (code) => {
      data.areaCode = code || "";
      if (code) {
        nextTick(assignAreaValues);
      }
    };
    const onDetailBlur = () => {
      setTimeout(() => {
        detailFocused.value = false;
      });
    };
    const setAddressDetail = (value) => {
      data.addressDetail = value;
    };
    const renderSetDefaultCell = () => {
      if (props.showSetDefault) {
        const slots2 = {
          "right-icon": () => createVNode(Switch, {
            "modelValue": data.isDefault,
            "onUpdate:modelValue": ($event) => data.isDefault = $event,
            "size": "24",
            "onChange": (event) => emit("change-default", event)
          }, null)
        };
        return withDirectives(createVNode(Cell, {
          "center": true,
          "title": t$h("defaultAddress"),
          "class": bem$16("default")
        }, slots2), [[vShow, !hideBottomFields.value]]);
      }
    };
    useExpose({
      getArea,
      setAreaCode,
      setAddressDetail
    });
    watch(() => props.areaList, () => setAreaCode(data.areaCode));
    watch(() => props.addressInfo, (value) => {
      extend(data, DEFAULT_DATA, value);
      setAreaCode(value.areaCode);
    }, {
      deep: true,
      immediate: true
    });
    return () => {
      const {
        disableArea
      } = props;
      return createVNode(Form, {
        "class": bem$16(),
        "onSubmit": onSave
      }, {
        default: () => {
          var _a;
          return [createVNode("div", {
            "class": bem$16("fields")
          }, [createVNode(Field, {
            "modelValue": data.name,
            "onUpdate:modelValue": ($event) => data.name = $event,
            "clearable": true,
            "label": t$h("name"),
            "rules": rules.value.name,
            "placeholder": t$h("name"),
            "onFocus": () => onFocus("name")
          }, null), createVNode(Field, {
            "modelValue": data.tel,
            "onUpdate:modelValue": ($event) => data.tel = $event,
            "clearable": true,
            "type": "tel",
            "label": t$h("tel"),
            "rules": rules.value.tel,
            "maxlength": props.telMaxlength,
            "placeholder": t$h("tel"),
            "onFocus": () => onFocus("tel")
          }, null), withDirectives(createVNode(Field, {
            "readonly": true,
            "label": t$h("area"),
            "is-link": !disableArea,
            "modelValue": areaText.value,
            "rules": rules.value.areaCode,
            "placeholder": props.areaPlaceholder || t$h("area"),
            "onFocus": () => onFocus("areaCode"),
            "onClick": () => {
              emit("click-area");
              showAreaPopup.value = !disableArea;
            }
          }, null), [[vShow, props.showArea]]), createVNode(stdin_default$1f, {
            "show": props.showDetail,
            "rows": props.detailRows,
            "rules": rules.value.addressDetail,
            "value": data.addressDetail,
            "focused": detailFocused.value,
            "maxlength": props.detailMaxlength,
            "searchResult": props.searchResult,
            "showSearchResult": props.showSearchResult,
            "onBlur": onDetailBlur,
            "onFocus": () => onFocus("addressDetail"),
            "onInput": onChangeDetail,
            "onSelect-search": (event) => emit("select-search", event)
          }, null), props.showPostal && withDirectives(createVNode(Field, {
            "modelValue": data.postalCode,
            "onUpdate:modelValue": ($event) => data.postalCode = $event,
            "type": "tel",
            "rules": rules.value.postalCode,
            "label": t$h("postal"),
            "maxlength": "6",
            "placeholder": t$h("postal"),
            "onFocus": () => onFocus("postalCode")
          }, null), [[vShow, !hideBottomFields.value]]), (_a = slots.default) == null ? void 0 : _a.call(slots)]), renderSetDefaultCell(), withDirectives(createVNode("div", {
            "class": bem$16("buttons")
          }, [createVNode(Button, {
            "block": true,
            "round": true,
            "type": "danger",
            "text": props.saveButtonText || t$h("save"),
            "class": bem$16("button"),
            "loading": props.isSaving,
            "nativeType": "submit"
          }, null), props.showDelete && createVNode(Button, {
            "block": true,
            "round": true,
            "class": bem$16("button"),
            "loading": props.isDeleting,
            "text": props.deleteButtonText || t$h("delete"),
            "onClick": onDelete
          }, null)]), [[vShow, !hideBottomFields.value]]), createVNode(Popup, {
            "show": showAreaPopup.value,
            "onUpdate:show": ($event) => showAreaPopup.value = $event,
            "round": true,
            "teleport": "body",
            "position": "bottom",
            "lazyRender": false
          }, {
            default: () => [createVNode(Area, {
              "ref": areaRef,
              "value": data.areaCode,
              "loading": !areaListLoaded.value,
              "areaList": props.areaList,
              "columnsPlaceholder": props.areaColumnsPlaceholder,
              "onConfirm": onAreaConfirm,
              "onCancel": () => {
                showAreaPopup.value = false;
              }
            }, null)]
          })];
        }
      });
    };
  }
});
const AddressEdit = withInstall(stdin_default$1e);
const [name$19, bem$15] = createNamespace("radio-group");
const radioGroupProps = {
  disabled: Boolean,
  iconSize: numericProp,
  direction: String,
  modelValue: unknownProp,
  checkedColor: String
};
const RADIO_KEY = Symbol(name$19);
var stdin_default$1d = defineComponent({
  name: name$19,
  props: radioGroupProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      linkChildren
    } = useChildren(RADIO_KEY);
    const updateValue = (value) => emit("update:modelValue", value);
    watch(() => props.modelValue, (value) => emit("change", value));
    linkChildren({
      props,
      updateValue
    });
    useCustomFieldValue(() => props.modelValue);
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$15([props.direction]),
        "role": "radiogroup"
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const RadioGroup = withInstall(stdin_default$1d);
const [name$18, bem$14] = createNamespace("tag");
const tagProps = {
  size: String,
  mark: Boolean,
  show: truthProp,
  type: makeStringProp("default"),
  color: String,
  plain: Boolean,
  round: Boolean,
  textColor: String,
  closeable: Boolean
};
var stdin_default$1c = defineComponent({
  name: name$18,
  props: tagProps,
  emits: ["close"],
  setup(props, {
    slots,
    emit
  }) {
    const onClose = (event) => {
      event.stopPropagation();
      emit("close", event);
    };
    const getStyle = () => {
      if (props.plain) {
        return {
          color: props.textColor || props.color,
          borderColor: props.color
        };
      }
      return {
        color: props.textColor,
        background: props.color
      };
    };
    const renderTag = () => {
      var _a;
      const {
        type,
        mark,
        plain,
        round: round2,
        size: size2,
        closeable
      } = props;
      const classes = {
        mark,
        plain,
        round: round2
      };
      if (size2) {
        classes[size2] = size2;
      }
      const CloseIcon = closeable && createVNode(Icon, {
        "name": "cross",
        "class": [bem$14("close"), HAPTICS_FEEDBACK],
        "onClick": onClose
      }, null);
      return createVNode("span", {
        "style": getStyle(),
        "class": bem$14([classes, type])
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots), CloseIcon]);
    };
    return () => createVNode(Transition, {
      "name": props.closeable ? "van-fade" : void 0
    }, {
      default: () => [props.show ? renderTag() : null]
    });
  }
});
const Tag = withInstall(stdin_default$1c);
const checkerProps = {
  name: unknownProp,
  shape: makeStringProp("round"),
  disabled: Boolean,
  iconSize: numericProp,
  modelValue: unknownProp,
  checkedColor: String,
  labelPosition: String,
  labelDisabled: Boolean
};
var stdin_default$1b = defineComponent({
  props: extend({}, checkerProps, {
    bem: makeRequiredProp(Function),
    role: String,
    parent: Object,
    checked: Boolean,
    bindGroup: truthProp
  }),
  emits: ["click", "toggle"],
  setup(props, {
    emit,
    slots
  }) {
    const iconRef = ref();
    const getParentProp = (name2) => {
      if (props.parent && props.bindGroup) {
        return props.parent.props[name2];
      }
    };
    const disabled = computed(() => getParentProp("disabled") || props.disabled);
    const direction = computed(() => getParentProp("direction"));
    const iconStyle = computed(() => {
      const checkedColor = props.checkedColor || getParentProp("checkedColor");
      if (checkedColor && props.checked && !disabled.value) {
        return {
          borderColor: checkedColor,
          backgroundColor: checkedColor
        };
      }
    });
    const onClick = (event) => {
      const {
        target
      } = event;
      const icon = iconRef.value;
      const iconClicked = icon === target || (icon == null ? void 0 : icon.contains(target));
      if (!disabled.value && (iconClicked || !props.labelDisabled)) {
        emit("toggle");
      }
      emit("click", event);
    };
    const renderIcon = () => {
      const {
        bem: bem2,
        shape,
        checked
      } = props;
      const iconSize = props.iconSize || getParentProp("iconSize");
      return createVNode("div", {
        "ref": iconRef,
        "class": bem2("icon", [shape, {
          disabled: disabled.value,
          checked
        }]),
        "style": {
          fontSize: addUnit(iconSize)
        }
      }, [slots.icon ? slots.icon({
        checked,
        disabled: disabled.value
      }) : createVNode(Icon, {
        "name": "success",
        "style": iconStyle.value
      }, null)]);
    };
    const renderLabel = () => {
      if (slots.default) {
        return createVNode("span", {
          "class": props.bem("label", [props.labelPosition, {
            disabled: disabled.value
          }])
        }, [slots.default()]);
      }
    };
    return () => {
      const nodes = props.labelPosition === "left" ? [renderLabel(), renderIcon()] : [renderIcon(), renderLabel()];
      return createVNode("div", {
        "role": props.role,
        "class": props.bem([{
          disabled: disabled.value,
          "label-disabled": props.labelDisabled
        }, direction.value]),
        "tabindex": disabled.value ? void 0 : 0,
        "aria-checked": props.checked,
        "onClick": onClick
      }, [nodes]);
    };
  }
});
const [name$17, bem$13] = createNamespace("radio");
var stdin_default$1a = defineComponent({
  name: name$17,
  props: checkerProps,
  emits: ["update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      parent
    } = useParent(RADIO_KEY);
    const checked = () => {
      const value = parent ? parent.props.modelValue : props.modelValue;
      return value === props.name;
    };
    const toggle = () => {
      if (parent) {
        parent.updateValue(props.name);
      } else {
        emit("update:modelValue", props.name);
      }
    };
    return () => createVNode(stdin_default$1b, mergeProps({
      "bem": bem$13,
      "role": "radio",
      "parent": parent,
      "checked": checked(),
      "onToggle": toggle
    }, props), pick(slots, ["default", "icon"]));
  }
});
const Radio = withInstall(stdin_default$1a);
const [name$16, bem$12] = createNamespace("address-item");
var stdin_default$19 = defineComponent({
  name: name$16,
  props: {
    address: makeRequiredProp(Object),
    disabled: Boolean,
    switchable: Boolean,
    defaultTagText: String
  },
  emits: ["edit", "click", "select"],
  setup(props, {
    slots,
    emit
  }) {
    const onClick = () => {
      if (props.switchable) {
        emit("select");
      }
      emit("click");
    };
    const renderRightIcon = () => createVNode(Icon, {
      "name": "edit",
      "class": bem$12("edit"),
      "onClick": (event) => {
        event.stopPropagation();
        emit("edit");
        emit("click");
      }
    }, null);
    const renderTag = () => {
      if (slots.tag) {
        return slots.tag(props.address);
      }
      if (props.address.isDefault && props.defaultTagText) {
        return createVNode(Tag, {
          "type": "danger",
          "round": true,
          "class": bem$12("tag")
        }, {
          default: () => [props.defaultTagText]
        });
      }
    };
    const renderContent = () => {
      const {
        address,
        disabled,
        switchable
      } = props;
      const Info = [createVNode("div", {
        "class": bem$12("name")
      }, [`${address.name} ${address.tel}`, renderTag()]), createVNode("div", {
        "class": bem$12("address")
      }, [address.address])];
      if (switchable && !disabled) {
        return createVNode(Radio, {
          "name": address.id,
          "iconSize": 18
        }, {
          default: () => [Info]
        });
      }
      return Info;
    };
    return () => {
      var _a;
      const {
        disabled
      } = props;
      return createVNode("div", {
        "class": bem$12({
          disabled
        }),
        "onClick": onClick
      }, [createVNode(Cell, {
        "border": false,
        "valueClass": bem$12("value")
      }, {
        value: renderContent,
        "right-icon": renderRightIcon
      }), (_a = slots.bottom) == null ? void 0 : _a.call(slots, extend({}, props.address, {
        disabled
      }))]);
    };
  }
});
const [name$15, bem$11, t$g] = createNamespace("address-list");
const addressListProps = {
  list: makeArrayProp(),
  modelValue: numericProp,
  switchable: truthProp,
  disabledText: String,
  disabledList: makeArrayProp(),
  addButtonText: String,
  defaultTagText: String
};
var stdin_default$18 = defineComponent({
  name: name$15,
  props: addressListProps,
  emits: ["add", "edit", "select", "click-item", "edit-disabled", "select-disabled", "update:modelValue"],
  setup(props, {
    slots,
    emit
  }) {
    const renderItem = (item, index2, disabled) => {
      const onEdit = () => emit(disabled ? "edit-disabled" : "edit", item, index2);
      const onClick = () => emit("click-item", item, index2);
      const onSelect = () => {
        emit(disabled ? "select-disabled" : "select", item, index2);
        if (!disabled) {
          emit("update:modelValue", item.id);
        }
      };
      return createVNode(stdin_default$19, {
        "key": item.id,
        "address": item,
        "disabled": disabled,
        "switchable": props.switchable,
        "defaultTagText": props.defaultTagText,
        "onEdit": onEdit,
        "onClick": onClick,
        "onSelect": onSelect
      }, {
        bottom: slots["item-bottom"],
        tag: slots.tag
      });
    };
    const renderList = (list, disabled) => {
      if (list) {
        return list.map((item, index2) => renderItem(item, index2, disabled));
      }
    };
    const renderBottom = () => createVNode("div", {
      "class": [bem$11("bottom"), "van-safe-area-bottom"]
    }, [createVNode(Button, {
      "round": true,
      "block": true,
      "type": "danger",
      "text": props.addButtonText || t$g("add"),
      "class": bem$11("add"),
      "onClick": () => emit("add")
    }, null)]);
    return () => {
      var _a, _b;
      const List2 = renderList(props.list);
      const DisabledList = renderList(props.disabledList, true);
      const DisabledText = props.disabledText && createVNode("div", {
        "class": bem$11("disabled-text")
      }, [props.disabledText]);
      return createVNode("div", {
        "class": bem$11()
      }, [(_a = slots.top) == null ? void 0 : _a.call(slots), createVNode(RadioGroup, {
        "modelValue": props.modelValue
      }, {
        default: () => [List2]
      }), DisabledText, DisabledList, (_b = slots.default) == null ? void 0 : _b.call(slots), renderBottom()]);
    };
  }
});
const AddressList = withInstall(stdin_default$18);
const [name$14, bem$10, t$f] = createNamespace("calendar");
const formatMonthTitle = (date) => t$f("monthTitle", date.getFullYear(), date.getMonth() + 1);
function compareMonth(date1, date2) {
  const year1 = date1.getFullYear();
  const year2 = date2.getFullYear();
  if (year1 === year2) {
    const month1 = date1.getMonth();
    const month2 = date2.getMonth();
    return month1 === month2 ? 0 : month1 > month2 ? 1 : -1;
  }
  return year1 > year2 ? 1 : -1;
}
function compareDay(day1, day2) {
  const compareMonthResult = compareMonth(day1, day2);
  if (compareMonthResult === 0) {
    const date1 = day1.getDate();
    const date2 = day2.getDate();
    return date1 === date2 ? 0 : date1 > date2 ? 1 : -1;
  }
  return compareMonthResult;
}
const cloneDate = (date) => new Date(date);
const cloneDates = (dates) => Array.isArray(dates) ? dates.map(cloneDate) : cloneDate(dates);
function getDayByOffset(date, offset2) {
  const cloned = cloneDate(date);
  cloned.setDate(cloned.getDate() + offset2);
  return cloned;
}
const getPrevDay = (date) => getDayByOffset(date, -1);
const getNextDay = (date) => getDayByOffset(date, 1);
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};
function calcDateNum(date) {
  const day1 = date[0].getTime();
  const day2 = date[1].getTime();
  return (day2 - day1) / (1e3 * 60 * 60 * 24) + 1;
}
function useRefs() {
  const refs = ref([]);
  const cache = [];
  onBeforeUpdate(() => {
    refs.value = [];
  });
  const setRefs = (index2) => {
    if (!cache[index2]) {
      cache[index2] = (el) => {
        refs.value[index2] = el;
      };
    }
    return cache[index2];
  };
  return [refs, setRefs];
}
const sharedProps = extend({}, pickerSharedProps, {
  filter: Function,
  columnsOrder: Array,
  formatter: {
    type: Function,
    default: (type, value) => value
  }
});
const pickerInheritKeys = Object.keys(pickerSharedProps);
function times(n, iteratee) {
  if (n < 0) {
    return [];
  }
  const result = Array(n);
  let index2 = -1;
  while (++index2 < n) {
    result[index2] = iteratee(index2);
  }
  return result;
}
function getTrueValue(value) {
  if (!value) {
    return 0;
  }
  while (Number.isNaN(parseInt(value, 10))) {
    if (value.length > 1) {
      value = value.slice(1);
    } else {
      return 0;
    }
  }
  return parseInt(value, 10);
}
const getMonthEndDay = (year, month) => 32 - new Date(year, month - 1, 32).getDate();
const proxyPickerMethods = (picker, callback) => {
  const methods = [
    "setValues",
    "setIndexes",
    "setColumnIndex",
    "setColumnValue"
  ];
  return new Proxy(picker, {
    get: (target, prop) => {
      if (methods.includes(prop)) {
        return (...args) => {
          target[prop](...args);
          callback();
        };
      }
      return target[prop];
    }
  });
};
const [name$13] = createNamespace("calendar-day");
var stdin_default$17 = defineComponent({
  name: name$13,
  props: {
    item: makeRequiredProp(Object),
    color: String,
    index: Number,
    offset: makeNumberProp(0),
    rowHeight: String
  },
  emits: ["click"],
  setup(props, {
    emit,
    slots
  }) {
    const style = computed(() => {
      var _a;
      const {
        item,
        index: index2,
        color,
        offset: offset2,
        rowHeight
      } = props;
      const style2 = {
        height: rowHeight
      };
      if (item.type === "placeholder") {
        style2.width = "100%";
        return style2;
      }
      if (index2 === 0) {
        style2.marginLeft = `${100 * offset2 / 7}%`;
      }
      if (color) {
        switch (item.type) {
          case "end":
          case "start":
          case "start-end":
          case "multiple-middle":
          case "multiple-selected":
            style2.background = color;
            break;
          case "middle":
            style2.color = color;
            break;
        }
      }
      if (offset2 + (((_a = item.date) == null ? void 0 : _a.getDate()) || 1) > 28) {
        style2.marginBottom = 0;
      }
      return style2;
    });
    const onClick = () => {
      if (props.item.type !== "disabled") {
        emit("click", props.item);
      }
    };
    const renderTopInfo = () => {
      const {
        topInfo
      } = props.item;
      if (topInfo || slots["top-info"]) {
        return createVNode("div", {
          "class": bem$10("top-info")
        }, [slots["top-info"] ? slots["top-info"](props.item) : topInfo]);
      }
    };
    const renderBottomInfo = () => {
      const {
        bottomInfo
      } = props.item;
      if (bottomInfo || slots["bottom-info"]) {
        return createVNode("div", {
          "class": bem$10("bottom-info")
        }, [slots["bottom-info"] ? slots["bottom-info"](props.item) : bottomInfo]);
      }
    };
    const renderContent = () => {
      const {
        item,
        color,
        rowHeight
      } = props;
      const {
        type,
        text
      } = item;
      const Nodes = [renderTopInfo(), text, renderBottomInfo()];
      if (type === "selected") {
        return createVNode("div", {
          "class": bem$10("selected-day"),
          "style": {
            width: rowHeight,
            height: rowHeight,
            background: color
          }
        }, [Nodes]);
      }
      return Nodes;
    };
    return () => {
      const {
        type,
        className
      } = props.item;
      if (type === "placeholder") {
        return createVNode("div", {
          "class": bem$10("day"),
          "style": style.value
        }, null);
      }
      return createVNode("div", {
        "role": "gridcell",
        "style": style.value,
        "class": [bem$10("day", type), className],
        "tabindex": type === "disabled" ? void 0 : -1,
        "onClick": onClick
      }, [renderContent()]);
    };
  }
});
const [name$12] = createNamespace("calendar-month");
const calendarMonthProps = {
  date: makeRequiredProp(Date),
  type: String,
  color: String,
  minDate: makeRequiredProp(Date),
  maxDate: makeRequiredProp(Date),
  showMark: Boolean,
  rowHeight: numericProp,
  formatter: Function,
  lazyRender: Boolean,
  currentDate: [Date, Array],
  allowSameDay: Boolean,
  showSubtitle: Boolean,
  showMonthTitle: Boolean,
  firstDayOfWeek: Number
};
var stdin_default$16 = defineComponent({
  name: name$12,
  props: calendarMonthProps,
  emits: ["click", "update-height"],
  setup(props, {
    emit,
    slots
  }) {
    const [visible, setVisible] = useToggle();
    const daysRef = ref();
    const monthRef = ref();
    const height2 = useHeight(monthRef);
    const title = computed(() => formatMonthTitle(props.date));
    const rowHeight = computed(() => addUnit(props.rowHeight));
    const offset2 = computed(() => {
      const realDay = props.date.getDay();
      if (props.firstDayOfWeek) {
        return (realDay + 7 - props.firstDayOfWeek) % 7;
      }
      return realDay;
    });
    const totalDay = computed(() => getMonthEndDay(props.date.getFullYear(), props.date.getMonth() + 1));
    const shouldRender = computed(() => visible.value || !props.lazyRender);
    const getTitle = () => title.value;
    const getMultipleDayType = (day) => {
      const isSelected = (date) => props.currentDate.some((item) => compareDay(item, date) === 0);
      if (isSelected(day)) {
        const prevDay = getPrevDay(day);
        const nextDay = getNextDay(day);
        const prevSelected = isSelected(prevDay);
        const nextSelected = isSelected(nextDay);
        if (prevSelected && nextSelected) {
          return "multiple-middle";
        }
        if (prevSelected) {
          return "end";
        }
        if (nextSelected) {
          return "start";
        }
        return "multiple-selected";
      }
      return "";
    };
    const getRangeDayType = (day) => {
      const [startDay, endDay] = props.currentDate;
      if (!startDay) {
        return "";
      }
      const compareToStart = compareDay(day, startDay);
      if (!endDay) {
        return compareToStart === 0 ? "start" : "";
      }
      const compareToEnd = compareDay(day, endDay);
      if (props.allowSameDay && compareToStart === 0 && compareToEnd === 0) {
        return "start-end";
      }
      if (compareToStart === 0) {
        return "start";
      }
      if (compareToEnd === 0) {
        return "end";
      }
      if (compareToStart > 0 && compareToEnd < 0) {
        return "middle";
      }
      return "";
    };
    const getDayType = (day) => {
      const {
        type,
        minDate,
        maxDate,
        currentDate
      } = props;
      if (compareDay(day, minDate) < 0 || compareDay(day, maxDate) > 0) {
        return "disabled";
      }
      if (currentDate === null) {
        return "";
      }
      if (Array.isArray(currentDate)) {
        if (type === "multiple") {
          return getMultipleDayType(day);
        }
        if (type === "range") {
          return getRangeDayType(day);
        }
      } else if (type === "single") {
        return compareDay(day, currentDate) === 0 ? "selected" : "";
      }
      return "";
    };
    const getBottomInfo = (dayType) => {
      if (props.type === "range") {
        if (dayType === "start" || dayType === "end") {
          return t$f(dayType);
        }
        if (dayType === "start-end") {
          return `${t$f("start")}/${t$f("end")}`;
        }
      }
    };
    const renderTitle = () => {
      if (props.showMonthTitle) {
        return createVNode("div", {
          "class": bem$10("month-title")
        }, [title.value]);
      }
    };
    const renderMark = () => {
      if (props.showMark && shouldRender.value) {
        return createVNode("div", {
          "class": bem$10("month-mark")
        }, [props.date.getMonth() + 1]);
      }
    };
    const placeholders = computed(() => {
      const count = Math.ceil((totalDay.value + offset2.value) / 7);
      return Array(count).fill({
        type: "placeholder"
      });
    });
    const days = computed(() => {
      const days2 = [];
      const year = props.date.getFullYear();
      const month = props.date.getMonth();
      for (let day = 1; day <= totalDay.value; day++) {
        const date = new Date(year, month, day);
        const type = getDayType(date);
        let config = {
          date,
          type,
          text: day,
          bottomInfo: getBottomInfo(type)
        };
        if (props.formatter) {
          config = props.formatter(config);
        }
        days2.push(config);
      }
      return days2;
    });
    const disabledDays = computed(() => days.value.filter((day) => day.type === "disabled"));
    const scrollToDate = (body, targetDate) => {
      if (daysRef.value) {
        const daysRect = useRect(daysRef.value);
        const totalRows = placeholders.value.length;
        const currentRow = Math.ceil((targetDate.getDate() + offset2.value) / 7);
        const rowOffset = (currentRow - 1) * daysRect.height / totalRows;
        setScrollTop(body, daysRect.top + rowOffset + body.scrollTop - useRect(body).top);
      }
    };
    const renderDay = (item, index2) => createVNode(stdin_default$17, {
      "item": item,
      "index": index2,
      "color": props.color,
      "offset": offset2.value,
      "rowHeight": rowHeight.value,
      "onClick": (item2) => emit("click", item2)
    }, pick(slots, ["top-info", "bottom-info"]));
    const renderDays = () => createVNode("div", {
      "ref": daysRef,
      "role": "grid",
      "class": bem$10("days")
    }, [renderMark(), (shouldRender.value ? days : placeholders).value.map(renderDay)]);
    useExpose({
      getTitle,
      getHeight: () => height2.value,
      setVisible,
      scrollToDate,
      disabledDays
    });
    return () => createVNode("div", {
      "class": bem$10("month"),
      "ref": monthRef
    }, [renderTitle(), renderDays()]);
  }
});
const [name$11] = createNamespace("calendar-header");
var stdin_default$15 = defineComponent({
  name: name$11,
  props: {
    title: String,
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
    firstDayOfWeek: Number
  },
  emits: ["click-subtitle"],
  setup(props, {
    slots,
    emit
  }) {
    const renderTitle = () => {
      if (props.showTitle) {
        const text = props.title || t$f("title");
        const title = slots.title ? slots.title() : text;
        return createVNode("div", {
          "class": bem$10("header-title")
        }, [title]);
      }
    };
    const onClickSubtitle = (event) => emit("click-subtitle", event);
    const renderSubtitle = () => {
      if (props.showSubtitle) {
        const title = slots.subtitle ? slots.subtitle() : props.subtitle;
        return createVNode("div", {
          "class": bem$10("header-subtitle"),
          "onClick": onClickSubtitle
        }, [title]);
      }
    };
    const renderWeekDays = () => {
      const {
        firstDayOfWeek
      } = props;
      const weekdays = t$f("weekdays");
      const renderWeekDays2 = [...weekdays.slice(firstDayOfWeek, 7), ...weekdays.slice(0, firstDayOfWeek)];
      return createVNode("div", {
        "class": bem$10("weekdays")
      }, [renderWeekDays2.map((text) => createVNode("span", {
        "class": bem$10("weekday")
      }, [text]))]);
    };
    return () => createVNode("div", {
      "class": bem$10("header")
    }, [renderTitle(), renderSubtitle(), renderWeekDays()]);
  }
});
const calendarProps = {
  show: Boolean,
  type: makeStringProp("single"),
  title: String,
  color: String,
  round: truthProp,
  readonly: Boolean,
  poppable: truthProp,
  maxRange: makeNumericProp(null),
  position: makeStringProp("bottom"),
  teleport: [String, Object],
  showMark: truthProp,
  showTitle: truthProp,
  formatter: Function,
  rowHeight: numericProp,
  confirmText: String,
  rangePrompt: String,
  lazyRender: truthProp,
  showConfirm: truthProp,
  defaultDate: [Date, Array],
  allowSameDay: Boolean,
  showSubtitle: truthProp,
  closeOnPopstate: truthProp,
  showRangePrompt: truthProp,
  confirmDisabledText: String,
  closeOnClickOverlay: truthProp,
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: truthProp,
  minDate: {
    type: Date,
    validator: isDate,
    default: getToday
  },
  maxDate: {
    type: Date,
    validator: isDate,
    default: () => {
      const now = getToday();
      return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    }
  },
  firstDayOfWeek: {
    type: numericProp,
    default: 0,
    validator: (val) => val >= 0 && val <= 6
  }
};
var stdin_default$14 = defineComponent({
  name: name$14,
  props: calendarProps,
  emits: ["select", "confirm", "unselect", "month-show", "over-range", "update:show", "click-subtitle"],
  setup(props, {
    emit,
    slots
  }) {
    const limitDateRange = (date, minDate = props.minDate, maxDate = props.maxDate) => {
      if (compareDay(date, minDate) === -1) {
        return minDate;
      }
      if (compareDay(date, maxDate) === 1) {
        return maxDate;
      }
      return date;
    };
    const getInitialDate = (defaultDate = props.defaultDate) => {
      const {
        type,
        minDate,
        maxDate
      } = props;
      if (defaultDate === null) {
        return defaultDate;
      }
      const now = getToday();
      if (type === "range") {
        if (!Array.isArray(defaultDate)) {
          defaultDate = [];
        }
        const start2 = limitDateRange(defaultDate[0] || now, minDate, getPrevDay(maxDate));
        const end2 = limitDateRange(defaultDate[1] || now, getNextDay(minDate));
        return [start2, end2];
      }
      if (type === "multiple") {
        if (Array.isArray(defaultDate)) {
          return defaultDate.map((date) => limitDateRange(date));
        }
        return [limitDateRange(now)];
      }
      if (!defaultDate || Array.isArray(defaultDate)) {
        defaultDate = now;
      }
      return limitDateRange(defaultDate);
    };
    let bodyHeight;
    const bodyRef = ref();
    const subtitle = ref("");
    const currentDate = ref(getInitialDate());
    const [monthRefs, setMonthRefs] = useRefs();
    const dayOffset = computed(() => props.firstDayOfWeek ? +props.firstDayOfWeek % 7 : 0);
    const months = computed(() => {
      const months2 = [];
      const cursor = new Date(props.minDate);
      if (props.lazyRender && !props.show && props.poppable) {
        return months2;
      }
      cursor.setDate(1);
      do {
        months2.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      } while (compareMonth(cursor, props.maxDate) !== 1);
      return months2;
    });
    const buttonDisabled = computed(() => {
      if (currentDate.value) {
        if (props.type === "range") {
          return !currentDate.value[0] || !currentDate.value[1];
        }
        if (props.type === "multiple") {
          return !currentDate.value.length;
        }
      }
      return !currentDate.value;
    });
    const onScroll = () => {
      const top2 = getScrollTop(bodyRef.value);
      const bottom2 = top2 + bodyHeight;
      const heights = months.value.map((item, index2) => monthRefs.value[index2].getHeight());
      const heightSum = heights.reduce((a, b) => a + b, 0);
      if (bottom2 > heightSum && top2 > 0) {
        return;
      }
      let height2 = 0;
      let currentMonth;
      const visibleRange = [-1, -1];
      for (let i = 0; i < months.value.length; i++) {
        const month = monthRefs.value[i];
        const visible = height2 <= bottom2 && height2 + heights[i] >= top2;
        if (visible) {
          visibleRange[1] = i;
          if (!currentMonth) {
            currentMonth = month;
            visibleRange[0] = i;
          }
          if (!monthRefs.value[i].showed) {
            monthRefs.value[i].showed = true;
            emit("month-show", {
              date: month.date,
              title: month.getTitle()
            });
          }
        }
        height2 += heights[i];
      }
      months.value.forEach((month, index2) => {
        const visible = index2 >= visibleRange[0] - 1 && index2 <= visibleRange[1] + 1;
        monthRefs.value[index2].setVisible(visible);
      });
      if (currentMonth) {
        subtitle.value = currentMonth.getTitle();
      }
    };
    const scrollToDate = (targetDate) => {
      raf(() => {
        months.value.some((month, index2) => {
          if (compareMonth(month, targetDate) === 0) {
            if (bodyRef.value) {
              monthRefs.value[index2].scrollToDate(bodyRef.value, targetDate);
            }
            return true;
          }
          return false;
        });
        onScroll();
      });
    };
    const scrollToCurrentDate = () => {
      if (props.poppable && !props.show) {
        return;
      }
      if (currentDate.value) {
        const targetDate = props.type === "single" ? currentDate.value : currentDate.value[0];
        scrollToDate(targetDate);
      } else {
        raf(onScroll);
      }
    };
    const init = () => {
      if (props.poppable && !props.show) {
        return;
      }
      raf(() => {
        bodyHeight = Math.floor(useRect(bodyRef).height);
      });
      scrollToCurrentDate();
    };
    const reset2 = (date = getInitialDate()) => {
      currentDate.value = date;
      scrollToCurrentDate();
    };
    const checkRange = (date) => {
      const {
        maxRange,
        rangePrompt,
        showRangePrompt
      } = props;
      if (maxRange && calcDateNum(date) > maxRange) {
        if (showRangePrompt) {
          Toast(rangePrompt || t$f("rangePrompt", maxRange));
        }
        emit("over-range");
        return false;
      }
      return true;
    };
    const onConfirm = () => {
      var _a;
      return emit("confirm", (_a = currentDate.value) != null ? _a : cloneDates(currentDate.value));
    };
    const select = (date, complete) => {
      const setCurrentDate = (date2) => {
        currentDate.value = date2;
        emit("select", cloneDates(date2));
      };
      if (complete && props.type === "range") {
        const valid = checkRange(date);
        if (!valid) {
          setCurrentDate([date[0], getDayByOffset(date[0], +props.maxRange - 1)]);
          return;
        }
      }
      setCurrentDate(date);
      if (complete && !props.showConfirm) {
        onConfirm();
      }
    };
    const getDisabledDate = (disabledDays2, startDay, date) => {
      var _a;
      return (_a = disabledDays2.find((day) => compareDay(startDay, day.date) === -1 && compareDay(day.date, date) === -1)) == null ? void 0 : _a.date;
    };
    const disabledDays = computed(() => monthRefs.value.reduce((arr, ref2) => {
      var _a, _b;
      arr.push(...(_b = (_a = ref2.disabledDays) == null ? void 0 : _a.value) != null ? _b : []);
      return arr;
    }, []));
    const onClickDay = (item) => {
      if (props.readonly || !item.date) {
        return;
      }
      const {
        date
      } = item;
      const {
        type
      } = props;
      if (type === "range") {
        if (!currentDate.value) {
          select([date]);
          return;
        }
        const [startDay, endDay] = currentDate.value;
        if (startDay && !endDay) {
          const compareToStart = compareDay(date, startDay);
          if (compareToStart === 1) {
            const disabledDay = getDisabledDate(disabledDays.value, startDay, date);
            if (disabledDay) {
              const endDay2 = getPrevDay(disabledDay);
              if (compareDay(startDay, endDay2) === -1) {
                select([startDay, endDay2]);
              } else {
                select([date]);
              }
            } else {
              select([startDay, date], true);
            }
          } else if (compareToStart === -1) {
            select([date]);
          } else if (props.allowSameDay) {
            select([date, date], true);
          }
        } else {
          select([date]);
        }
      } else if (type === "multiple") {
        if (!currentDate.value) {
          select([date]);
          return;
        }
        const dates = currentDate.value;
        const selectedIndex = dates.findIndex((dateItem) => compareDay(dateItem, date) === 0);
        if (selectedIndex !== -1) {
          const [unselectedDate] = dates.splice(selectedIndex, 1);
          emit("unselect", cloneDate(unselectedDate));
        } else if (props.maxRange && dates.length >= props.maxRange) {
          Toast(props.rangePrompt || t$f("rangePrompt", props.maxRange));
        } else {
          select([...dates, date]);
        }
      } else {
        select(date, true);
      }
    };
    const updateShow = (value) => emit("update:show", value);
    const renderMonth = (date, index2) => {
      const showMonthTitle = index2 !== 0 || !props.showSubtitle;
      return createVNode(stdin_default$16, mergeProps({
        "ref": setMonthRefs(index2),
        "date": date,
        "currentDate": currentDate.value,
        "showMonthTitle": showMonthTitle,
        "firstDayOfWeek": dayOffset.value
      }, pick(props, ["type", "color", "minDate", "maxDate", "showMark", "formatter", "rowHeight", "lazyRender", "showSubtitle", "allowSameDay"]), {
        "onClick": onClickDay
      }), pick(slots, ["top-info", "bottom-info"]));
    };
    const renderFooterButton = () => {
      if (slots.footer) {
        return slots.footer();
      }
      if (props.showConfirm) {
        const slot = slots["confirm-text"];
        const disabled = buttonDisabled.value;
        const text = disabled ? props.confirmDisabledText : props.confirmText;
        return createVNode(Button, {
          "round": true,
          "block": true,
          "type": "danger",
          "color": props.color,
          "class": bem$10("confirm"),
          "disabled": disabled,
          "nativeType": "button",
          "onClick": onConfirm
        }, {
          default: () => [slot ? slot({
            disabled
          }) : text || t$f("confirm")]
        });
      }
    };
    const renderFooter = () => createVNode("div", {
      "class": [bem$10("footer"), {
        "van-safe-area-bottom": props.safeAreaInsetBottom
      }]
    }, [renderFooterButton()]);
    const renderCalendar = () => createVNode("div", {
      "class": bem$10()
    }, [createVNode(stdin_default$15, {
      "title": props.title,
      "subtitle": subtitle.value,
      "showTitle": props.showTitle,
      "showSubtitle": props.showSubtitle,
      "firstDayOfWeek": dayOffset.value,
      "onClick-subtitle": (event) => emit("click-subtitle", event)
    }, pick(slots, ["title", "subtitle"])), createVNode("div", {
      "ref": bodyRef,
      "class": bem$10("body"),
      "onScroll": onScroll
    }, [months.value.map(renderMonth)]), renderFooter()]);
    watch(() => props.show, init);
    watch(() => [props.type, props.minDate, props.maxDate], () => reset2(getInitialDate(currentDate.value)));
    watch(() => props.defaultDate, (value = null) => {
      currentDate.value = value;
      scrollToCurrentDate();
    });
    useExpose({
      reset: reset2,
      scrollToDate
    });
    onMountedOrActivated(init);
    return () => {
      if (props.poppable) {
        return createVNode(Popup, {
          "show": props.show,
          "class": bem$10("popup"),
          "round": props.round,
          "position": props.position,
          "closeable": props.showTitle || props.showSubtitle,
          "teleport": props.teleport,
          "closeOnPopstate": props.closeOnPopstate,
          "safeAreaInsetTop": props.safeAreaInsetTop,
          "closeOnClickOverlay": props.closeOnClickOverlay,
          "onUpdate:show": updateShow
        }, {
          default: renderCalendar
        });
      }
      return renderCalendar();
    };
  }
});
const Calendar = withInstall(stdin_default$14);
const [name$10, bem$$] = createNamespace("image");
const imageProps = {
  src: String,
  alt: String,
  fit: String,
  position: String,
  round: Boolean,
  width: numericProp,
  height: numericProp,
  radius: numericProp,
  lazyLoad: Boolean,
  iconSize: numericProp,
  showError: truthProp,
  errorIcon: makeStringProp("photo-fail"),
  iconPrefix: String,
  showLoading: truthProp,
  loadingIcon: makeStringProp("photo")
};
var stdin_default$13 = defineComponent({
  name: name$10,
  props: imageProps,
  emits: ["load", "error"],
  setup(props, {
    emit,
    slots
  }) {
    const error = ref(false);
    const loading = ref(true);
    const imageRef = ref();
    const {
      $Lazyload
    } = getCurrentInstance().proxy;
    const style = computed(() => {
      const style2 = {
        width: addUnit(props.width),
        height: addUnit(props.height)
      };
      if (isDef(props.radius)) {
        style2.overflow = "hidden";
        style2.borderRadius = addUnit(props.radius);
      }
      return style2;
    });
    watch(() => props.src, () => {
      error.value = false;
      loading.value = true;
    });
    const onLoad = (event) => {
      loading.value = false;
      emit("load", event);
    };
    const onError = (event) => {
      error.value = true;
      loading.value = false;
      emit("error", event);
    };
    const renderIcon = (name2, className, slot) => {
      if (slot) {
        return slot();
      }
      return createVNode(Icon, {
        "name": name2,
        "size": props.iconSize,
        "class": className,
        "classPrefix": props.iconPrefix
      }, null);
    };
    const renderPlaceholder = () => {
      if (loading.value && props.showLoading) {
        return createVNode("div", {
          "class": bem$$("loading")
        }, [renderIcon(props.loadingIcon, bem$$("loading-icon"), slots.loading)]);
      }
      if (error.value && props.showError) {
        return createVNode("div", {
          "class": bem$$("error")
        }, [renderIcon(props.errorIcon, bem$$("error-icon"), slots.error)]);
      }
    };
    const renderImage = () => {
      if (error.value || !props.src) {
        return;
      }
      const attrs = {
        alt: props.alt,
        class: bem$$("img"),
        style: {
          objectFit: props.fit,
          objectPosition: props.position
        }
      };
      if (props.lazyLoad) {
        return withDirectives(createVNode("img", mergeProps({
          "ref": imageRef
        }, attrs), null), [[resolveDirective("lazy"), props.src]]);
      }
      return createVNode("img", mergeProps({
        "src": props.src,
        "onLoad": onLoad,
        "onError": onError
      }, attrs), null);
    };
    const onLazyLoaded = ({
      el
    }) => {
      const check = () => {
        if (el === imageRef.value && loading.value) {
          onLoad();
        }
      };
      if (imageRef.value) {
        check();
      } else {
        nextTick(check);
      }
    };
    const onLazyLoadError = ({
      el
    }) => {
      if (el === imageRef.value && !error.value) {
        onError();
      }
    };
    if ($Lazyload && inBrowser$1) {
      $Lazyload.$on("loaded", onLazyLoaded);
      $Lazyload.$on("error", onLazyLoadError);
      onBeforeUnmount(() => {
        $Lazyload.$off("loaded", onLazyLoaded);
        $Lazyload.$off("error", onLazyLoadError);
      });
    }
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$$({
          round: props.round
        }),
        "style": style.value
      }, [renderImage(), renderPlaceholder(), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Image = withInstall(stdin_default$13);
const [name$$, bem$_] = createNamespace("card");
const cardProps = {
  tag: String,
  num: numericProp,
  desc: String,
  thumb: String,
  title: String,
  price: numericProp,
  centered: Boolean,
  lazyLoad: Boolean,
  currency: makeStringProp("\xA5"),
  thumbLink: String,
  originPrice: numericProp
};
var stdin_default$12 = defineComponent({
  name: name$$,
  props: cardProps,
  emits: ["click-thumb"],
  setup(props, {
    slots,
    emit
  }) {
    const renderTitle = () => {
      if (slots.title) {
        return slots.title();
      }
      if (props.title) {
        return createVNode("div", {
          "class": [bem$_("title"), "van-multi-ellipsis--l2"]
        }, [props.title]);
      }
    };
    const renderThumbTag = () => {
      if (slots.tag || props.tag) {
        return createVNode("div", {
          "class": bem$_("tag")
        }, [slots.tag ? slots.tag() : createVNode(Tag, {
          "mark": true,
          "type": "danger"
        }, {
          default: () => [props.tag]
        })]);
      }
    };
    const renderThumbImage = () => {
      if (slots.thumb) {
        return slots.thumb();
      }
      return createVNode(Image, {
        "src": props.thumb,
        "fit": "cover",
        "width": "100%",
        "height": "100%",
        "lazyLoad": props.lazyLoad
      }, null);
    };
    const renderThumb = () => {
      if (slots.thumb || props.thumb) {
        return createVNode("a", {
          "href": props.thumbLink,
          "class": bem$_("thumb"),
          "onClick": (event) => emit("click-thumb", event)
        }, [renderThumbImage(), renderThumbTag()]);
      }
    };
    const renderDesc = () => {
      if (slots.desc) {
        return slots.desc();
      }
      if (props.desc) {
        return createVNode("div", {
          "class": [bem$_("desc"), "van-ellipsis"]
        }, [props.desc]);
      }
    };
    const renderPriceText = () => {
      const priceArr = props.price.toString().split(".");
      return createVNode("div", null, [createVNode("span", {
        "class": bem$_("price-currency")
      }, [props.currency]), createVNode("span", {
        "class": bem$_("price-integer")
      }, [priceArr[0]]), createTextVNode("."), createVNode("span", {
        "class": bem$_("price-decimal")
      }, [priceArr[1]])]);
    };
    return () => {
      var _a, _b, _c;
      const showNum = slots.num || isDef(props.num);
      const showPrice = slots.price || isDef(props.price);
      const showOriginPrice = slots["origin-price"] || isDef(props.originPrice);
      const showBottom = showNum || showPrice || showOriginPrice || slots.bottom;
      const Price = showPrice && createVNode("div", {
        "class": bem$_("price")
      }, [slots.price ? slots.price() : renderPriceText()]);
      const OriginPrice = showOriginPrice && createVNode("div", {
        "class": bem$_("origin-price")
      }, [slots["origin-price"] ? slots["origin-price"]() : `${props.currency} ${props.originPrice}`]);
      const Num = showNum && createVNode("div", {
        "class": bem$_("num")
      }, [slots.num ? slots.num() : `x${props.num}`]);
      const Footer = slots.footer && createVNode("div", {
        "class": bem$_("footer")
      }, [slots.footer()]);
      const Bottom = showBottom && createVNode("div", {
        "class": bem$_("bottom")
      }, [(_a = slots["price-top"]) == null ? void 0 : _a.call(slots), Price, OriginPrice, Num, (_b = slots.bottom) == null ? void 0 : _b.call(slots)]);
      return createVNode("div", {
        "class": bem$_()
      }, [createVNode("div", {
        "class": bem$_("header")
      }, [renderThumb(), createVNode("div", {
        "class": bem$_("content", {
          centered: props.centered
        })
      }, [createVNode("div", null, [renderTitle(), renderDesc(), (_c = slots.tags) == null ? void 0 : _c.call(slots)]), Bottom])]), Footer]);
    };
  }
});
const Card = withInstall(stdin_default$12);
function scrollLeftTo(scroller, to, duration) {
  let count = 0;
  const from = scroller.scrollLeft;
  const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
  function animate() {
    scroller.scrollLeft += (to - from) / frames;
    if (++count < frames) {
      raf(animate);
    }
  }
  animate();
}
function scrollTopTo(scroller, to, duration, callback) {
  let current2 = getScrollTop(scroller);
  const isDown = current2 < to;
  const frames = duration === 0 ? 1 : Math.round(duration * 1e3 / 16);
  const step = (to - current2) / frames;
  function animate() {
    current2 += step;
    if (isDown && current2 > to || !isDown && current2 < to) {
      current2 = to;
    }
    setScrollTop(scroller, current2);
    if (isDown && current2 < to || !isDown && current2 > to) {
      raf(animate);
    } else if (callback) {
      raf(callback);
    }
  }
  animate();
}
function useVisibilityChange(target, onChange) {
  if (!inBrowser$1 || !window.IntersectionObserver) {
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    onChange(entries[0].intersectionRatio > 0);
  }, { root: document.body });
  const observe = () => {
    if (target.value) {
      observer.observe(target.value);
    }
  };
  const unobserve = () => {
    if (target.value) {
      observer.unobserve(target.value);
    }
  };
  onDeactivated(unobserve);
  onBeforeUnmount(unobserve);
  onMountedOrActivated(observe);
}
const [name$_, bem$Z] = createNamespace("sticky");
const stickyProps = {
  zIndex: numericProp,
  position: makeStringProp("top"),
  container: Object,
  offsetTop: makeNumericProp(0),
  offsetBottom: makeNumericProp(0)
};
var stdin_default$11 = defineComponent({
  name: name$_,
  props: stickyProps,
  emits: ["scroll", "change"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const scrollParent = useScrollParent(root);
    const state = reactive({
      fixed: false,
      width: 0,
      height: 0,
      transform: 0
    });
    const offset2 = computed(() => unitToPx(props.position === "top" ? props.offsetTop : props.offsetBottom));
    const rootStyle = computed(() => {
      const {
        fixed,
        height: height2,
        width: width2
      } = state;
      if (fixed) {
        return {
          width: `${width2}px`,
          height: `${height2}px`
        };
      }
    });
    const stickyStyle = computed(() => {
      if (!state.fixed) {
        return;
      }
      const style = extend(getZIndexStyle(props.zIndex), {
        width: `${state.width}px`,
        height: `${state.height}px`,
        [props.position]: `${offset2.value}px`
      });
      if (state.transform) {
        style.transform = `translate3d(0, ${state.transform}px, 0)`;
      }
      return style;
    });
    const emitScroll = (scrollTop) => emit("scroll", {
      scrollTop,
      isFixed: state.fixed
    });
    const onScroll = () => {
      if (!root.value || isHidden(root)) {
        return;
      }
      const {
        container,
        position
      } = props;
      const rootRect = useRect(root);
      const scrollTop = getScrollTop(window);
      state.width = rootRect.width;
      state.height = rootRect.height;
      if (position === "top") {
        if (container) {
          const containerRect = useRect(container);
          const difference = containerRect.bottom - offset2.value - state.height;
          state.fixed = offset2.value > rootRect.top && containerRect.bottom > 0;
          state.transform = difference < 0 ? difference : 0;
        } else {
          state.fixed = offset2.value > rootRect.top;
        }
      } else {
        const {
          clientHeight
        } = document.documentElement;
        if (container) {
          const containerRect = useRect(container);
          const difference = clientHeight - containerRect.top - offset2.value - state.height;
          state.fixed = clientHeight - offset2.value < rootRect.bottom && clientHeight > containerRect.top;
          state.transform = difference < 0 ? -difference : 0;
        } else {
          state.fixed = clientHeight - offset2.value < rootRect.bottom;
        }
      }
      emitScroll(scrollTop);
    };
    watch(() => state.fixed, (value) => emit("change", value));
    useEventListener("scroll", onScroll, {
      target: scrollParent
    });
    useVisibilityChange(root, onScroll);
    return () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "style": rootStyle.value
      }, [createVNode("div", {
        "class": bem$Z({
          fixed: state.fixed
        }),
        "style": stickyStyle.value
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
    };
  }
});
const Sticky = withInstall(stdin_default$11);
const [name$Z, bem$Y] = createNamespace("tab");
var stdin_default$10 = defineComponent({
  name: name$Z,
  props: {
    id: String,
    dot: Boolean,
    type: String,
    color: String,
    title: String,
    badge: numericProp,
    shrink: Boolean,
    isActive: Boolean,
    disabled: Boolean,
    controls: String,
    scrollable: Boolean,
    activeColor: String,
    inactiveColor: String,
    showZeroBadge: truthProp
  },
  setup(props, {
    slots
  }) {
    const style = computed(() => {
      const style2 = {};
      const {
        type,
        color,
        disabled,
        isActive,
        activeColor,
        inactiveColor
      } = props;
      const isCard = type === "card";
      if (color && isCard) {
        style2.borderColor = color;
        if (!disabled) {
          if (isActive) {
            style2.backgroundColor = color;
          } else {
            style2.color = color;
          }
        }
      }
      const titleColor = isActive ? activeColor : inactiveColor;
      if (titleColor) {
        style2.color = titleColor;
      }
      return style2;
    });
    const renderText = () => {
      const Text2 = createVNode("span", {
        "class": bem$Y("text", {
          ellipsis: !props.scrollable
        })
      }, [slots.title ? slots.title() : props.title]);
      if (props.dot || isDef(props.badge) && props.badge !== "") {
        return createVNode(Badge, {
          "dot": props.dot,
          "content": props.badge,
          "showZero": props.showZeroBadge
        }, {
          default: () => [Text2]
        });
      }
      return Text2;
    };
    return () => createVNode("div", {
      "id": props.id,
      "role": "tab",
      "class": [bem$Y([props.type, {
        grow: props.scrollable && !props.shrink,
        shrink: props.shrink,
        active: props.isActive,
        disabled: props.disabled
      }])],
      "style": style.value,
      "tabindex": props.disabled ? void 0 : props.isActive ? 0 : -1,
      "aria-selected": props.isActive,
      "aria-disabled": props.disabled || void 0,
      "aria-controls": props.controls
    }, [renderText()]);
  }
});
const [name$Y, bem$X] = createNamespace("swipe");
const swipeProps = {
  loop: truthProp,
  width: numericProp,
  height: numericProp,
  vertical: Boolean,
  autoplay: makeNumericProp(0),
  duration: makeNumericProp(500),
  touchable: truthProp,
  lazyRender: Boolean,
  initialSwipe: makeNumericProp(0),
  indicatorColor: String,
  showIndicators: truthProp,
  stopPropagation: truthProp
};
const SWIPE_KEY = Symbol(name$Y);
var stdin_default$$ = defineComponent({
  name: name$Y,
  props: swipeProps,
  emits: ["change"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const state = reactive({
      rect: null,
      width: 0,
      height: 0,
      offset: 0,
      active: 0,
      swiping: false
    });
    const touch = useTouch();
    const {
      children,
      linkChildren
    } = useChildren(SWIPE_KEY);
    const count = computed(() => children.length);
    const size2 = computed(() => state[props.vertical ? "height" : "width"]);
    const delta = computed(() => props.vertical ? touch.deltaY.value : touch.deltaX.value);
    const minOffset = computed(() => {
      if (state.rect) {
        const base = props.vertical ? state.rect.height : state.rect.width;
        return base - size2.value * count.value;
      }
      return 0;
    });
    const maxCount = computed(() => Math.ceil(Math.abs(minOffset.value) / size2.value));
    const trackSize = computed(() => count.value * size2.value);
    const activeIndicator = computed(() => (state.active + count.value) % count.value);
    const isCorrectDirection = computed(() => {
      const expect = props.vertical ? "vertical" : "horizontal";
      return touch.direction.value === expect;
    });
    const trackStyle = computed(() => {
      const style = {
        transitionDuration: `${state.swiping ? 0 : props.duration}ms`,
        transform: `translate${props.vertical ? "Y" : "X"}(${state.offset}px)`
      };
      if (size2.value) {
        const mainAxis = props.vertical ? "height" : "width";
        const crossAxis = props.vertical ? "width" : "height";
        style[mainAxis] = `${trackSize.value}px`;
        style[crossAxis] = props[crossAxis] ? `${props[crossAxis]}px` : "";
      }
      return style;
    });
    const getTargetActive = (pace) => {
      const {
        active
      } = state;
      if (pace) {
        if (props.loop) {
          return clamp(active + pace, -1, count.value);
        }
        return clamp(active + pace, 0, maxCount.value);
      }
      return active;
    };
    const getTargetOffset = (targetActive, offset2 = 0) => {
      let currentPosition = targetActive * size2.value;
      if (!props.loop) {
        currentPosition = Math.min(currentPosition, -minOffset.value);
      }
      let targetOffset = offset2 - currentPosition;
      if (!props.loop) {
        targetOffset = clamp(targetOffset, minOffset.value, 0);
      }
      return targetOffset;
    };
    const move = ({
      pace = 0,
      offset: offset2 = 0,
      emitChange
    }) => {
      if (count.value <= 1) {
        return;
      }
      const {
        active
      } = state;
      const targetActive = getTargetActive(pace);
      const targetOffset = getTargetOffset(targetActive, offset2);
      if (props.loop) {
        if (children[0] && targetOffset !== minOffset.value) {
          const outRightBound = targetOffset < minOffset.value;
          children[0].setOffset(outRightBound ? trackSize.value : 0);
        }
        if (children[count.value - 1] && targetOffset !== 0) {
          const outLeftBound = targetOffset > 0;
          children[count.value - 1].setOffset(outLeftBound ? -trackSize.value : 0);
        }
      }
      state.active = targetActive;
      state.offset = targetOffset;
      if (emitChange && targetActive !== active) {
        emit("change", activeIndicator.value);
      }
    };
    const correctPosition = () => {
      state.swiping = true;
      if (state.active <= -1) {
        move({
          pace: count.value
        });
      } else if (state.active >= count.value) {
        move({
          pace: -count.value
        });
      }
    };
    const prev = () => {
      correctPosition();
      touch.reset();
      doubleRaf(() => {
        state.swiping = false;
        move({
          pace: -1,
          emitChange: true
        });
      });
    };
    const next = () => {
      correctPosition();
      touch.reset();
      doubleRaf(() => {
        state.swiping = false;
        move({
          pace: 1,
          emitChange: true
        });
      });
    };
    let autoplayTimer;
    const stopAutoplay = () => clearTimeout(autoplayTimer);
    const autoplay = () => {
      stopAutoplay();
      if (props.autoplay > 0 && count.value > 1) {
        autoplayTimer = setTimeout(() => {
          next();
          autoplay();
        }, +props.autoplay);
      }
    };
    const initialize = (active = +props.initialSwipe) => {
      if (!root.value) {
        return;
      }
      const cb = () => {
        var _a, _b;
        if (!isHidden(root)) {
          const rect = {
            width: root.value.offsetWidth,
            height: root.value.offsetHeight
          };
          state.rect = rect;
          state.width = +((_a = props.width) != null ? _a : rect.width);
          state.height = +((_b = props.height) != null ? _b : rect.height);
        }
        if (count.value) {
          active = Math.min(count.value - 1, active);
        }
        state.active = active;
        state.swiping = true;
        state.offset = getTargetOffset(active);
        children.forEach((swipe) => {
          swipe.setOffset(0);
        });
        autoplay();
      };
      if (isHidden(root)) {
        nextTick().then(cb);
      } else {
        cb();
      }
    };
    const resize = () => initialize(state.active);
    let touchStartTime;
    const onTouchStart = (event) => {
      if (!props.touchable)
        return;
      touch.start(event);
      touchStartTime = Date.now();
      stopAutoplay();
      correctPosition();
    };
    const onTouchMove = (event) => {
      if (props.touchable && state.swiping) {
        touch.move(event);
        if (isCorrectDirection.value) {
          preventDefault(event, props.stopPropagation);
          move({
            offset: delta.value
          });
        }
      }
    };
    const onTouchEnd = () => {
      if (!props.touchable || !state.swiping) {
        return;
      }
      const duration = Date.now() - touchStartTime;
      const speed = delta.value / duration;
      const shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(delta.value) > size2.value / 2;
      if (shouldSwipe && isCorrectDirection.value) {
        const offset2 = props.vertical ? touch.offsetY.value : touch.offsetX.value;
        let pace = 0;
        if (props.loop) {
          pace = offset2 > 0 ? delta.value > 0 ? -1 : 1 : 0;
        } else {
          pace = -Math[delta.value > 0 ? "ceil" : "floor"](delta.value / size2.value);
        }
        move({
          pace,
          emitChange: true
        });
      } else if (delta.value) {
        move({
          pace: 0
        });
      }
      state.swiping = false;
      autoplay();
    };
    const swipeTo = (index2, options = {}) => {
      correctPosition();
      touch.reset();
      doubleRaf(() => {
        let targetIndex;
        if (props.loop && index2 === count.value) {
          targetIndex = state.active === 0 ? 0 : index2;
        } else {
          targetIndex = index2 % count.value;
        }
        if (options.immediate) {
          doubleRaf(() => {
            state.swiping = false;
          });
        } else {
          state.swiping = false;
        }
        move({
          pace: targetIndex - state.active,
          emitChange: true
        });
      });
    };
    const renderDot = (_, index2) => {
      const active = index2 === activeIndicator.value;
      const style = active ? {
        backgroundColor: props.indicatorColor
      } : void 0;
      return createVNode("i", {
        "style": style,
        "class": bem$X("indicator", {
          active
        })
      }, null);
    };
    const renderIndicator = () => {
      if (slots.indicator) {
        return slots.indicator({
          active: activeIndicator.value,
          total: count.value
        });
      }
      if (props.showIndicators && count.value > 1) {
        return createVNode("div", {
          "class": bem$X("indicators", {
            vertical: props.vertical
          })
        }, [Array(count.value).fill("").map(renderDot)]);
      }
    };
    useExpose({
      prev,
      next,
      state,
      resize,
      swipeTo
    });
    linkChildren({
      size: size2,
      props,
      count,
      activeIndicator
    });
    watch(() => props.initialSwipe, (value) => initialize(+value));
    watch(count, () => initialize(state.active));
    watch(() => props.autoplay, autoplay);
    watch([windowWidth, windowHeight], resize);
    watch(usePageVisibility(), (visible) => {
      if (visible === "visible") {
        autoplay();
      } else {
        stopAutoplay();
      }
    });
    onMounted(initialize);
    onActivated(() => initialize(state.active));
    onPopupReopen(() => initialize(state.active));
    onDeactivated(stopAutoplay);
    onBeforeUnmount(stopAutoplay);
    return () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "class": bem$X()
      }, [createVNode("div", {
        "style": trackStyle.value,
        "class": bem$X("track", {
          vertical: props.vertical
        }),
        "onTouchstart": onTouchStart,
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), renderIndicator()]);
    };
  }
});
const Swipe = withInstall(stdin_default$$);
const [name$X, bem$W] = createNamespace("tabs");
var stdin_default$_ = defineComponent({
  name: name$X,
  props: {
    count: makeRequiredProp(Number),
    inited: Boolean,
    animated: Boolean,
    duration: makeRequiredProp(numericProp),
    swipeable: Boolean,
    lazyRender: Boolean,
    currentIndex: makeRequiredProp(Number)
  },
  emits: ["change"],
  setup(props, {
    emit,
    slots
  }) {
    const swipeRef = ref();
    const onChange = (index2) => emit("change", index2);
    const renderChildren = () => {
      var _a;
      const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
      if (props.animated || props.swipeable) {
        return createVNode(Swipe, {
          "ref": swipeRef,
          "loop": false,
          "class": bem$W("track"),
          "duration": +props.duration * 1e3,
          "touchable": props.swipeable,
          "lazyRender": props.lazyRender,
          "showIndicators": false,
          "onChange": onChange
        }, {
          default: () => [Content]
        });
      }
      return Content;
    };
    const swipeToCurrentTab = (index2) => {
      const swipe = swipeRef.value;
      if (swipe && swipe.state.active !== index2) {
        swipe.swipeTo(index2, {
          immediate: !props.inited
        });
      }
    };
    watch(() => props.currentIndex, swipeToCurrentTab);
    onMounted(() => {
      swipeToCurrentTab(props.currentIndex);
    });
    return () => createVNode("div", {
      "class": bem$W("content", {
        animated: props.animated || props.swipeable
      })
    }, [renderChildren()]);
  }
});
const [name$W, bem$V] = createNamespace("tabs");
const tabsProps = {
  type: makeStringProp("line"),
  color: String,
  border: Boolean,
  sticky: Boolean,
  shrink: Boolean,
  active: makeNumericProp(0),
  duration: makeNumericProp(0.3),
  animated: Boolean,
  ellipsis: truthProp,
  swipeable: Boolean,
  scrollspy: Boolean,
  offsetTop: makeNumericProp(0),
  background: String,
  lazyRender: truthProp,
  lineWidth: numericProp,
  lineHeight: numericProp,
  beforeChange: Function,
  swipeThreshold: makeNumericProp(5),
  titleActiveColor: String,
  titleInactiveColor: String
};
const TABS_KEY = Symbol(name$W);
var stdin_default$Z = defineComponent({
  name: name$W,
  props: tabsProps,
  emits: ["click", "change", "scroll", "disabled", "rendered", "click-tab", "update:active"],
  setup(props, {
    emit,
    slots
  }) {
    let tabHeight;
    let lockScroll;
    let stickyFixed;
    const root = ref();
    const navRef = ref();
    const wrapRef = ref();
    const id = useId$1();
    const scroller = useScrollParent(root);
    const [titleRefs, setTitleRefs] = useRefs();
    const {
      children,
      linkChildren
    } = useChildren(TABS_KEY);
    const state = reactive({
      inited: false,
      position: "",
      lineStyle: {},
      currentIndex: -1
    });
    const scrollable = computed(() => children.length > props.swipeThreshold || !props.ellipsis || props.shrink);
    const navStyle = computed(() => ({
      borderColor: props.color,
      background: props.background
    }));
    const getTabName = (tab, index2) => {
      var _a2;
      return (_a2 = tab.name) != null ? _a2 : index2;
    };
    const currentName = computed(() => {
      const activeTab = children[state.currentIndex];
      if (activeTab) {
        return getTabName(activeTab, state.currentIndex);
      }
    });
    const offsetTopPx = computed(() => unitToPx(props.offsetTop));
    const scrollOffset = computed(() => {
      if (props.sticky) {
        return offsetTopPx.value + tabHeight;
      }
      return 0;
    });
    const scrollIntoView = (immediate) => {
      const nav = navRef.value;
      const titles = titleRefs.value;
      if (!scrollable.value || !nav || !titles || !titles[state.currentIndex]) {
        return;
      }
      const title = titles[state.currentIndex].$el;
      const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;
      scrollLeftTo(nav, to, immediate ? 0 : +props.duration);
    };
    const setLine = () => {
      const shouldAnimate = state.inited;
      nextTick(() => {
        const titles = titleRefs.value;
        if (!titles || !titles[state.currentIndex] || props.type !== "line" || isHidden(root.value)) {
          return;
        }
        const title = titles[state.currentIndex].$el;
        const {
          lineWidth,
          lineHeight
        } = props;
        const left2 = title.offsetLeft + title.offsetWidth / 2;
        const lineStyle = {
          width: addUnit(lineWidth),
          backgroundColor: props.color,
          transform: `translateX(${left2}px) translateX(-50%)`
        };
        if (shouldAnimate) {
          lineStyle.transitionDuration = `${props.duration}s`;
        }
        if (isDef(lineHeight)) {
          const height2 = addUnit(lineHeight);
          lineStyle.height = height2;
          lineStyle.borderRadius = height2;
        }
        state.lineStyle = lineStyle;
      });
    };
    const findAvailableTab = (index2) => {
      const diff = index2 < state.currentIndex ? -1 : 1;
      while (index2 >= 0 && index2 < children.length) {
        if (!children[index2].disabled) {
          return index2;
        }
        index2 += diff;
      }
    };
    const setCurrentIndex = (currentIndex) => {
      const newIndex = findAvailableTab(currentIndex);
      if (!isDef(newIndex)) {
        return;
      }
      const newTab = children[newIndex];
      const newName = getTabName(newTab, newIndex);
      const shouldEmitChange = state.currentIndex !== null;
      state.currentIndex = newIndex;
      if (newName !== props.active) {
        emit("update:active", newName);
        if (shouldEmitChange) {
          emit("change", newName, newTab.title);
        }
      }
    };
    const setCurrentIndexByName = (name2) => {
      const matched = children.find((tab, index22) => getTabName(tab, index22) === name2);
      const index2 = matched ? children.indexOf(matched) : 0;
      setCurrentIndex(index2);
    };
    const scrollToCurrentContent = (immediate = false) => {
      if (props.scrollspy) {
        const target = children[state.currentIndex].$el;
        if (target && scroller.value) {
          const to = getElementTop(target, scroller.value) - scrollOffset.value;
          lockScroll = true;
          scrollTopTo(scroller.value, to, immediate ? 0 : +props.duration, () => {
            lockScroll = false;
          });
        }
      }
    };
    const onClickTab = (item, index2, event) => {
      const {
        title,
        disabled
      } = children[index2];
      const name2 = getTabName(children[index2], index2);
      if (disabled) {
        emit("disabled", name2, title);
      } else {
        callInterceptor(props.beforeChange, {
          args: [name2],
          done: () => {
            setCurrentIndex(index2);
            scrollToCurrentContent();
          }
        });
        emit("click", name2, title);
        route(item);
      }
      emit("click-tab", {
        name: name2,
        title,
        event,
        disabled
      });
    };
    const onStickyScroll = (params) => {
      stickyFixed = params.isFixed;
      emit("scroll", params);
    };
    const scrollTo = (name2) => {
      nextTick(() => {
        setCurrentIndexByName(name2);
        scrollToCurrentContent(true);
      });
    };
    const getCurrentIndexOnScroll = () => {
      for (let index2 = 0; index2 < children.length; index2++) {
        const {
          top: top2
        } = useRect(children[index2].$el);
        if (top2 > scrollOffset.value) {
          return index2 === 0 ? 0 : index2 - 1;
        }
      }
      return children.length - 1;
    };
    const onScroll = () => {
      if (props.scrollspy && !lockScroll) {
        const index2 = getCurrentIndexOnScroll();
        setCurrentIndex(index2);
      }
    };
    const renderNav = () => children.map((item, index2) => createVNode(stdin_default$10, mergeProps({
      "key": item.id,
      "id": `${id}-${index2}`,
      "ref": setTitleRefs(index2),
      "type": props.type,
      "color": props.color,
      "style": item.titleStyle,
      "class": item.titleClass,
      "shrink": props.shrink,
      "isActive": index2 === state.currentIndex,
      "controls": item.id,
      "scrollable": scrollable.value,
      "activeColor": props.titleActiveColor,
      "inactiveColor": props.titleInactiveColor,
      "onClick": (event) => onClickTab(item, index2, event)
    }, pick(item, ["dot", "badge", "title", "disabled", "showZeroBadge"])), {
      title: item.$slots.title
    }));
    const renderLine = () => {
      if (props.type === "line" && children.length) {
        return createVNode("div", {
          "class": bem$V("line"),
          "style": state.lineStyle
        }, null);
      }
    };
    const renderHeader = () => {
      var _a2, _b2;
      const {
        type,
        border
      } = props;
      return createVNode("div", {
        "ref": wrapRef,
        "class": [bem$V("wrap"), {
          [BORDER_TOP_BOTTOM]: type === "line" && border
        }]
      }, [createVNode("div", {
        "ref": navRef,
        "role": "tablist",
        "class": bem$V("nav", [type, {
          shrink: props.shrink,
          complete: scrollable.value
        }]),
        "style": navStyle.value,
        "aria-orientation": "horizontal"
      }, [(_a2 = slots["nav-left"]) == null ? void 0 : _a2.call(slots), renderNav(), renderLine(), (_b2 = slots["nav-right"]) == null ? void 0 : _b2.call(slots)])]);
    };
    watch([() => props.color, windowWidth], setLine);
    watch(() => props.active, (value) => {
      if (value !== currentName.value) {
        setCurrentIndexByName(value);
      }
    });
    watch(() => children.length, () => {
      if (state.inited) {
        setCurrentIndexByName(props.active);
        setLine();
        nextTick(() => {
          scrollIntoView(true);
        });
      }
    });
    watch(() => state.currentIndex, () => {
      scrollIntoView();
      setLine();
      if (stickyFixed && !props.scrollspy) {
        setRootScrollTop(Math.ceil(getElementTop(root.value) - offsetTopPx.value));
      }
    });
    const init = () => {
      setCurrentIndexByName(props.active);
      nextTick(() => {
        state.inited = true;
        if (wrapRef.value) {
          tabHeight = useRect(wrapRef.value).height;
        }
        scrollIntoView(true);
      });
    };
    const onRendered = (name2, title) => emit("rendered", name2, title);
    useExpose({
      resize: setLine,
      scrollTo
    });
    onActivated(setLine);
    onPopupReopen(setLine);
    onMountedOrActivated(init);
    useEventListener("scroll", onScroll, {
      target: scroller
    });
    linkChildren({
      id,
      props,
      setLine,
      onRendered,
      currentName,
      scrollIntoView
    });
    return () => {
      var _a2;
      return createVNode("div", {
        "ref": root,
        "class": bem$V([props.type])
      }, [props.sticky ? createVNode(Sticky, {
        "container": root.value,
        "offsetTop": offsetTopPx.value,
        "onScroll": onStickyScroll
      }, {
        default: () => {
          var _a3;
          return [renderHeader(), (_a3 = slots["nav-bottom"]) == null ? void 0 : _a3.call(slots)];
        }
      }) : [renderHeader(), (_a2 = slots["nav-bottom"]) == null ? void 0 : _a2.call(slots)], createVNode(stdin_default$_, {
        "count": children.length,
        "inited": state.inited,
        "animated": props.animated,
        "duration": props.duration,
        "swipeable": props.swipeable,
        "lazyRender": props.lazyRender,
        "currentIndex": state.currentIndex,
        "onChange": setCurrentIndex
      }, {
        default: () => {
          var _a3;
          return [(_a3 = slots.default) == null ? void 0 : _a3.call(slots)];
        }
      })]);
    };
  }
});
const TAB_STATUS_KEY = Symbol();
const useTabStatus = () => inject(TAB_STATUS_KEY, null);
const [name$V, bem$U] = createNamespace("swipe-item");
var stdin_default$Y = defineComponent({
  name: name$V,
  setup(props, {
    slots
  }) {
    let rendered;
    const state = reactive({
      offset: 0,
      inited: false,
      mounted: false
    });
    const {
      parent,
      index: index2
    } = useParent(SWIPE_KEY);
    if (!parent) {
      return;
    }
    const style = computed(() => {
      const style2 = {};
      const {
        vertical
      } = parent.props;
      if (parent.size.value) {
        style2[vertical ? "height" : "width"] = `${parent.size.value}px`;
      }
      if (state.offset) {
        style2.transform = `translate${vertical ? "Y" : "X"}(${state.offset}px)`;
      }
      return style2;
    });
    const shouldRender = computed(() => {
      const {
        loop,
        lazyRender
      } = parent.props;
      if (!lazyRender || rendered) {
        return true;
      }
      if (!state.mounted) {
        return false;
      }
      const active = parent.activeIndicator.value;
      const maxActive = parent.count.value - 1;
      const prevActive = active === 0 && loop ? maxActive : active - 1;
      const nextActive = active === maxActive && loop ? 0 : active + 1;
      rendered = index2.value === active || index2.value === prevActive || index2.value === nextActive;
      return rendered;
    });
    const setOffset = (offset2) => {
      state.offset = offset2;
    };
    onMounted(() => {
      nextTick(() => {
        state.mounted = true;
      });
    });
    useExpose({
      setOffset
    });
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$U(),
        "style": style.value
      }, [shouldRender.value ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null]);
    };
  }
});
const SwipeItem = withInstall(stdin_default$Y);
const [name$U, bem$T] = createNamespace("tab");
const tabProps = extend({}, routeProps, {
  dot: Boolean,
  name: numericProp,
  badge: numericProp,
  title: String,
  disabled: Boolean,
  titleClass: unknownProp,
  titleStyle: [String, Object],
  showZeroBadge: truthProp
});
var stdin_default$X = defineComponent({
  name: name$U,
  props: tabProps,
  setup(props, {
    slots
  }) {
    const id = useId$1();
    const inited = ref(false);
    const {
      parent,
      index: index2
    } = useParent(TABS_KEY);
    if (!parent) {
      return;
    }
    const getName = () => {
      var _a;
      return (_a = props.name) != null ? _a : index2.value;
    };
    const init = () => {
      inited.value = true;
      if (parent.props.lazyRender) {
        nextTick(() => {
          parent.onRendered(getName(), props.title);
        });
      }
    };
    const active = computed(() => {
      const isActive = getName() === parent.currentName.value;
      if (isActive && !inited.value) {
        init();
      }
      return isActive;
    });
    watch(() => props.title, () => {
      parent.setLine();
      parent.scrollIntoView();
    });
    provide(TAB_STATUS_KEY, active);
    return () => {
      var _a;
      const label = `${parent.id}-${index2.value}`;
      const {
        animated,
        swipeable,
        scrollspy,
        lazyRender
      } = parent.props;
      if (!slots.default && !animated) {
        return;
      }
      const show = scrollspy || active.value;
      if (animated || swipeable) {
        return createVNode(SwipeItem, {
          "id": id,
          "role": "tabpanel",
          "class": bem$T("panel-wrapper", {
            inactive: !active.value
          }),
          "tabindex": active.value ? 0 : -1,
          "aria-hidden": !active.value,
          "aria-labelledby": label
        }, {
          default: () => {
            var _a2;
            return [createVNode("div", {
              "class": bem$T("panel")
            }, [(_a2 = slots.default) == null ? void 0 : _a2.call(slots)])];
          }
        });
      }
      const shouldRender = inited.value || scrollspy || !lazyRender;
      const Content = shouldRender ? (_a = slots.default) == null ? void 0 : _a.call(slots) : null;
      useExpose({
        id
      });
      return withDirectives(createVNode("div", {
        "id": id,
        "role": "tabpanel",
        "class": bem$T("panel"),
        "tabindex": show ? 0 : -1,
        "aria-labelledby": label
      }, [Content]), [[vShow, show]]);
    };
  }
});
const Tab = withInstall(stdin_default$X);
const Tabs = withInstall(stdin_default$Z);
const [name$T, bem$S, t$e] = createNamespace("cascader");
const cascaderProps = {
  title: String,
  options: makeArrayProp(),
  closeable: truthProp,
  swipeable: truthProp,
  closeIcon: makeStringProp("cross"),
  showHeader: truthProp,
  modelValue: numericProp,
  fieldNames: Object,
  placeholder: String,
  activeColor: String
};
var stdin_default$W = defineComponent({
  name: name$T,
  props: cascaderProps,
  emits: ["close", "change", "finish", "click-tab", "update:modelValue"],
  setup(props, {
    slots,
    emit
  }) {
    const tabs = ref([]);
    const activeTab = ref(0);
    const {
      text: textKey,
      value: valueKey,
      children: childrenKey
    } = extend({
      text: "text",
      value: "value",
      children: "children"
    }, props.fieldNames);
    const getSelectedOptionsByValue = (options, value) => {
      for (const option of options) {
        if (option[valueKey] === value) {
          return [option];
        }
        if (option[childrenKey]) {
          const selectedOptions = getSelectedOptionsByValue(option[childrenKey], value);
          if (selectedOptions) {
            return [option, ...selectedOptions];
          }
        }
      }
    };
    const updateTabs = () => {
      const {
        options,
        modelValue
      } = props;
      if (modelValue !== void 0) {
        const selectedOptions = getSelectedOptionsByValue(options, modelValue);
        if (selectedOptions) {
          let optionsCursor = options;
          tabs.value = selectedOptions.map((option) => {
            const tab = {
              options: optionsCursor,
              selected: option
            };
            const next = optionsCursor.find((item) => item[valueKey] === option[valueKey]);
            if (next) {
              optionsCursor = next[childrenKey];
            }
            return tab;
          });
          if (optionsCursor) {
            tabs.value.push({
              options: optionsCursor,
              selected: null
            });
          }
          nextTick(() => {
            activeTab.value = tabs.value.length - 1;
          });
          return;
        }
      }
      tabs.value = [{
        options,
        selected: null
      }];
    };
    const onSelect = (option, tabIndex) => {
      if (option.disabled) {
        return;
      }
      tabs.value[tabIndex].selected = option;
      if (tabs.value.length > tabIndex + 1) {
        tabs.value = tabs.value.slice(0, tabIndex + 1);
      }
      if (option[childrenKey]) {
        const nextTab = {
          options: option[childrenKey],
          selected: null
        };
        if (tabs.value[tabIndex + 1]) {
          tabs.value[tabIndex + 1] = nextTab;
        } else {
          tabs.value.push(nextTab);
        }
        nextTick(() => {
          activeTab.value++;
        });
      }
      const selectedOptions = tabs.value.map((tab) => tab.selected).filter(Boolean);
      emit("update:modelValue", option[valueKey]);
      const params = {
        value: option[valueKey],
        tabIndex,
        selectedOptions
      };
      emit("change", params);
      if (!option[childrenKey]) {
        emit("finish", params);
      }
    };
    const onClose = () => emit("close");
    const onClickTab = ({
      name: name2,
      title
    }) => emit("click-tab", name2, title);
    const renderHeader = () => props.showHeader ? createVNode("div", {
      "class": bem$S("header")
    }, [createVNode("h2", {
      "class": bem$S("title")
    }, [slots.title ? slots.title() : props.title]), props.closeable ? createVNode(Icon, {
      "name": props.closeIcon,
      "class": [bem$S("close-icon"), HAPTICS_FEEDBACK],
      "onClick": onClose
    }, null) : null]) : null;
    const renderOption = (option, selectedOption, tabIndex) => {
      const {
        disabled
      } = option;
      const selected = !!(selectedOption && option[valueKey] === selectedOption[valueKey]);
      const color = option.color || (selected ? props.activeColor : void 0);
      const Text2 = slots.option ? slots.option({
        option,
        selected
      }) : createVNode("span", null, [option[textKey]]);
      return createVNode("li", {
        "role": "menuitemradio",
        "class": [bem$S("option", {
          selected,
          disabled
        }), option.className],
        "style": {
          color
        },
        "tabindex": disabled ? void 0 : selected ? 0 : -1,
        "aria-checked": selected,
        "aria-disabled": disabled || void 0,
        "onClick": () => onSelect(option, tabIndex)
      }, [Text2, selected ? createVNode(Icon, {
        "name": "success",
        "class": bem$S("selected-icon")
      }, null) : null]);
    };
    const renderOptions = (options, selectedOption, tabIndex) => createVNode("ul", {
      "role": "menu",
      "class": bem$S("options")
    }, [options.map((option) => renderOption(option, selectedOption, tabIndex))]);
    const renderTab = (tab, tabIndex) => {
      const {
        options,
        selected
      } = tab;
      const placeholder = props.placeholder || t$e("select");
      const title = selected ? selected[textKey] : placeholder;
      return createVNode(Tab, {
        "title": title,
        "titleClass": bem$S("tab", {
          unselected: !selected
        })
      }, {
        default: () => {
          var _a, _b;
          return [(_a = slots["options-top"]) == null ? void 0 : _a.call(slots, {
            tabIndex
          }), renderOptions(options, selected, tabIndex), (_b = slots["options-bottom"]) == null ? void 0 : _b.call(slots, {
            tabIndex
          })];
        }
      });
    };
    const renderTabs = () => createVNode(Tabs, {
      "active": activeTab.value,
      "onUpdate:active": ($event) => activeTab.value = $event,
      "shrink": true,
      "animated": true,
      "class": bem$S("tabs"),
      "color": props.activeColor,
      "swipeable": props.swipeable,
      "onClick-tab": onClickTab
    }, {
      default: () => [tabs.value.map(renderTab)]
    });
    updateTabs();
    watch(() => props.options, updateTabs, {
      deep: true
    });
    watch(() => props.modelValue, (value) => {
      if (value !== void 0) {
        const values = tabs.value.map((tab) => {
          var _a;
          return (_a = tab.selected) == null ? void 0 : _a[valueKey];
        });
        if (values.includes(value)) {
          return;
        }
      }
      updateTabs();
    });
    return () => createVNode("div", {
      "class": bem$S()
    }, [renderHeader(), renderTabs()]);
  }
});
const Cascader = withInstall(stdin_default$W);
const [name$S, bem$R] = createNamespace("cell-group");
const cellGroupProps = {
  title: String,
  inset: Boolean,
  border: truthProp
};
var stdin_default$V = defineComponent({
  name: name$S,
  inheritAttrs: false,
  props: cellGroupProps,
  setup(props, {
    slots,
    attrs
  }) {
    const renderGroup = () => {
      var _a;
      return createVNode("div", mergeProps({
        "class": [bem$R({
          inset: props.inset
        }), {
          [BORDER_TOP_BOTTOM]: props.border && !props.inset
        }]
      }, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
    const renderTitle = () => createVNode("div", {
      "class": bem$R("title", {
        inset: props.inset
      })
    }, [slots.title ? slots.title() : props.title]);
    return () => {
      if (props.title || slots.title) {
        return createVNode(Fragment, null, [renderTitle(), renderGroup()]);
      }
      return renderGroup();
    };
  }
});
const CellGroup = withInstall(stdin_default$V);
const [name$R, bem$Q] = createNamespace("checkbox-group");
const checkboxGroupProps = {
  max: numericProp,
  disabled: Boolean,
  iconSize: numericProp,
  direction: String,
  modelValue: makeArrayProp(),
  checkedColor: String
};
const CHECKBOX_GROUP_KEY = Symbol(name$R);
var stdin_default$U = defineComponent({
  name: name$R,
  props: checkboxGroupProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      children,
      linkChildren
    } = useChildren(CHECKBOX_GROUP_KEY);
    const updateValue = (value) => emit("update:modelValue", value);
    const toggleAll = (options = {}) => {
      if (typeof options === "boolean") {
        options = {
          checked: options
        };
      }
      const {
        checked,
        skipDisabled
      } = options;
      const checkedChildren = children.filter((item) => {
        if (!item.props.bindGroup) {
          return false;
        }
        if (item.props.disabled && skipDisabled) {
          return item.checked.value;
        }
        return checked != null ? checked : !item.checked.value;
      });
      const names = checkedChildren.map((item) => item.name);
      updateValue(names);
    };
    watch(() => props.modelValue, (value) => emit("change", value));
    useExpose({
      toggleAll
    });
    useCustomFieldValue(() => props.modelValue);
    linkChildren({
      props,
      updateValue
    });
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$Q([props.direction])
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const [name$Q, bem$P] = createNamespace("checkbox");
const checkboxProps = extend({}, checkerProps, {
  bindGroup: truthProp
});
var stdin_default$T = defineComponent({
  name: name$Q,
  props: checkboxProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      parent
    } = useParent(CHECKBOX_GROUP_KEY);
    const setParentValue = (checked2) => {
      const {
        name: name2
      } = props;
      const {
        max,
        modelValue
      } = parent.props;
      const value = modelValue.slice();
      if (checked2) {
        const overlimit = max && value.length >= max;
        if (!overlimit && !value.includes(name2)) {
          value.push(name2);
          if (props.bindGroup) {
            parent.updateValue(value);
          }
        }
      } else {
        const index2 = value.indexOf(name2);
        if (index2 !== -1) {
          value.splice(index2, 1);
          if (props.bindGroup) {
            parent.updateValue(value);
          }
        }
      }
    };
    const checked = computed(() => {
      if (parent && props.bindGroup) {
        return parent.props.modelValue.indexOf(props.name) !== -1;
      }
      return !!props.modelValue;
    });
    const toggle = (newValue = !checked.value) => {
      if (parent && props.bindGroup) {
        setParentValue(newValue);
      } else {
        emit("update:modelValue", newValue);
      }
    };
    watch(() => props.modelValue, (value) => emit("change", value));
    useExpose({
      toggle,
      props,
      checked
    });
    useCustomFieldValue(() => props.modelValue);
    return () => createVNode(stdin_default$1b, mergeProps({
      "bem": bem$P,
      "role": "checkbox",
      "parent": parent,
      "checked": checked.value,
      "onToggle": toggle
    }, props), pick(slots, ["default", "icon"]));
  }
});
const Checkbox = withInstall(stdin_default$T);
const CheckboxGroup = withInstall(stdin_default$U);
const [name$P, bem$O] = createNamespace("circle");
let uid = 0;
const format$1 = (rate) => Math.min(Math.max(+rate, 0), 100);
function getPath(clockwise, viewBoxSize) {
  const sweepFlag = clockwise ? 1 : 0;
  return `M ${viewBoxSize / 2} ${viewBoxSize / 2} m 0, -500 a 500, 500 0 1, ${sweepFlag} 0, 1000 a 500, 500 0 1, ${sweepFlag} 0, -1000`;
}
const circleProps = {
  text: String,
  size: numericProp,
  fill: makeStringProp("none"),
  rate: makeNumericProp(100),
  speed: makeNumericProp(0),
  color: [String, Object],
  clockwise: truthProp,
  layerColor: String,
  currentRate: makeNumberProp(0),
  strokeWidth: makeNumericProp(40),
  strokeLinecap: String,
  startPosition: makeStringProp("top")
};
var stdin_default$S = defineComponent({
  name: name$P,
  props: circleProps,
  emits: ["update:currentRate"],
  setup(props, {
    emit,
    slots
  }) {
    const id = `van-circle-${uid++}`;
    const viewBoxSize = computed(() => +props.strokeWidth + 1e3);
    const path = computed(() => getPath(props.clockwise, viewBoxSize.value));
    const svgStyle = computed(() => {
      const ROTATE_ANGLE_MAP = {
        top: 0,
        right: 90,
        bottom: 180,
        left: 270
      };
      const angleValue = ROTATE_ANGLE_MAP[props.startPosition];
      if (angleValue) {
        return {
          transform: `rotate(${angleValue}deg)`
        };
      }
    });
    watch(() => props.rate, (rate) => {
      let rafId;
      const startTime = Date.now();
      const startRate = props.currentRate;
      const endRate = format$1(rate);
      const duration = Math.abs((startRate - endRate) * 1e3 / +props.speed);
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const rate2 = progress * (endRate - startRate) + startRate;
        emit("update:currentRate", format$1(parseFloat(rate2.toFixed(1))));
        if (endRate > startRate ? rate2 < endRate : rate2 > endRate) {
          rafId = raf(animate);
        }
      };
      if (props.speed) {
        if (rafId) {
          cancelRaf(rafId);
        }
        rafId = raf(animate);
      } else {
        emit("update:currentRate", endRate);
      }
    }, {
      immediate: true
    });
    const renderHover = () => {
      const PERIMETER = 3140;
      const {
        strokeWidth,
        currentRate,
        strokeLinecap
      } = props;
      const offset2 = PERIMETER * currentRate / 100;
      const color = isObject(props.color) ? `url(#${id})` : props.color;
      const style = {
        stroke: color,
        strokeWidth: `${+strokeWidth + 1}px`,
        strokeLinecap,
        strokeDasharray: `${offset2}px ${PERIMETER}px`
      };
      return createVNode("path", {
        "d": path.value,
        "style": style,
        "class": bem$O("hover"),
        "stroke": color
      }, null);
    };
    const renderLayer = () => {
      const style = {
        fill: props.fill,
        stroke: props.layerColor,
        strokeWidth: `${props.strokeWidth}px`
      };
      return createVNode("path", {
        "class": bem$O("layer"),
        "style": style,
        "d": path.value
      }, null);
    };
    const renderGradient = () => {
      const {
        color
      } = props;
      if (!isObject(color)) {
        return;
      }
      const Stops = Object.keys(color).sort((a, b) => parseFloat(a) - parseFloat(b)).map((key, index2) => createVNode("stop", {
        "key": index2,
        "offset": key,
        "stop-color": color[key]
      }, null));
      return createVNode("defs", null, [createVNode("linearGradient", {
        "id": id,
        "x1": "100%",
        "y1": "0%",
        "x2": "0%",
        "y2": "0%"
      }, [Stops])]);
    };
    const renderText = () => {
      if (slots.default) {
        return slots.default();
      }
      if (props.text) {
        return createVNode("div", {
          "class": bem$O("text")
        }, [props.text]);
      }
    };
    return () => createVNode("div", {
      "class": bem$O(),
      "style": getSizeStyle(props.size)
    }, [createVNode("svg", {
      "viewBox": `0 0 ${viewBoxSize.value} ${viewBoxSize.value}`,
      "style": svgStyle.value
    }, [renderGradient(), renderLayer(), renderHover()]), renderText()]);
  }
});
const Circle = withInstall(stdin_default$S);
const [name$O, bem$N] = createNamespace("row");
const ROW_KEY = Symbol(name$O);
const rowProps = {
  tag: makeStringProp("div"),
  wrap: truthProp,
  align: String,
  gutter: makeNumericProp(0),
  justify: String
};
var stdin_default$R = defineComponent({
  name: name$O,
  props: rowProps,
  setup(props, {
    slots
  }) {
    const {
      children,
      linkChildren
    } = useChildren(ROW_KEY);
    const groups = computed(() => {
      const groups2 = [[]];
      let totalSpan = 0;
      children.forEach((child, index2) => {
        totalSpan += Number(child.span);
        if (totalSpan > 24) {
          groups2.push([index2]);
          totalSpan -= 24;
        } else {
          groups2[groups2.length - 1].push(index2);
        }
      });
      return groups2;
    });
    const spaces = computed(() => {
      const gutter = Number(props.gutter);
      const spaces2 = [];
      if (!gutter) {
        return spaces2;
      }
      groups.value.forEach((group) => {
        const averagePadding = gutter * (group.length - 1) / group.length;
        group.forEach((item, index2) => {
          if (index2 === 0) {
            spaces2.push({
              right: averagePadding
            });
          } else {
            const left2 = gutter - spaces2[item - 1].right;
            const right2 = averagePadding - left2;
            spaces2.push({
              left: left2,
              right: right2
            });
          }
        });
      });
      return spaces2;
    });
    linkChildren({
      spaces
    });
    return () => {
      const {
        tag,
        wrap,
        align,
        justify
      } = props;
      return createVNode(tag, {
        "class": bem$N({
          [`align-${align}`]: align,
          [`justify-${justify}`]: justify,
          nowrap: !wrap
        })
      }, {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      });
    };
  }
});
const [name$N, bem$M] = createNamespace("col");
const colProps = {
  tag: makeStringProp("div"),
  span: makeNumericProp(0),
  offset: numericProp
};
var stdin_default$Q = defineComponent({
  name: name$N,
  props: colProps,
  setup(props, {
    slots
  }) {
    const {
      parent,
      index: index2
    } = useParent(ROW_KEY);
    const style = computed(() => {
      if (!parent) {
        return;
      }
      const {
        spaces
      } = parent;
      if (spaces && spaces.value && spaces.value[index2.value]) {
        const {
          left: left2,
          right: right2
        } = spaces.value[index2.value];
        return {
          paddingLeft: left2 ? `${left2}px` : null,
          paddingRight: right2 ? `${right2}px` : null
        };
      }
    });
    return () => {
      const {
        tag,
        span,
        offset: offset2
      } = props;
      return createVNode(tag, {
        "style": style.value,
        "class": bem$M({
          [span]: span,
          [`offset-${offset2}`]: offset2
        })
      }, {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      });
    };
  }
});
const Col = withInstall(stdin_default$Q);
const [name$M, bem$L] = createNamespace("collapse");
const COLLAPSE_KEY = Symbol(name$M);
const collapseProps = {
  border: truthProp,
  accordion: Boolean,
  modelValue: {
    type: [String, Number, Array],
    default: ""
  }
};
var stdin_default$P = defineComponent({
  name: name$M,
  props: collapseProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      linkChildren
    } = useChildren(COLLAPSE_KEY);
    const updateName = (name2) => {
      emit("change", name2);
      emit("update:modelValue", name2);
    };
    const toggle = (name2, expanded) => {
      const {
        accordion,
        modelValue
      } = props;
      if (accordion) {
        updateName(name2 === modelValue ? "" : name2);
      } else if (expanded) {
        updateName(modelValue.concat(name2));
      } else {
        updateName(modelValue.filter((activeName) => activeName !== name2));
      }
    };
    const isExpanded = (name2) => {
      const {
        accordion,
        modelValue
      } = props;
      return accordion ? modelValue === name2 : modelValue.includes(name2);
    };
    linkChildren({
      toggle,
      isExpanded
    });
    return () => {
      var _a;
      return createVNode("div", {
        "class": [bem$L(), {
          [BORDER_TOP_BOTTOM]: props.border
        }]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Collapse = withInstall(stdin_default$P);
const [name$L, bem$K] = createNamespace("collapse-item");
const CELL_SLOTS = ["icon", "title", "value", "label", "right-icon"];
const collapseItemProps = extend({}, cellSharedProps, {
  name: numericProp,
  isLink: truthProp,
  disabled: Boolean,
  readonly: Boolean,
  lazyRender: truthProp
});
var stdin_default$O = defineComponent({
  name: name$L,
  props: collapseItemProps,
  setup(props, {
    slots
  }) {
    const wrapperRef = ref();
    const contentRef = ref();
    const {
      parent,
      index: index2
    } = useParent(COLLAPSE_KEY);
    if (!parent) {
      return;
    }
    const name2 = computed(() => {
      var _a;
      return (_a = props.name) != null ? _a : index2.value;
    });
    const expanded = computed(() => parent.isExpanded(name2.value));
    const show = ref(expanded.value);
    const lazyRender = useLazyRender(() => show.value || !props.lazyRender);
    const onTransitionEnd = () => {
      if (!expanded.value) {
        show.value = false;
      } else if (wrapperRef.value) {
        wrapperRef.value.style.height = "";
      }
    };
    watch(expanded, (value, oldValue) => {
      if (oldValue === null) {
        return;
      }
      if (value) {
        show.value = true;
      }
      const tick = value ? nextTick : raf;
      tick(() => {
        if (!contentRef.value || !wrapperRef.value) {
          return;
        }
        const {
          offsetHeight
        } = contentRef.value;
        if (offsetHeight) {
          const contentHeight = `${offsetHeight}px`;
          wrapperRef.value.style.height = value ? "0" : contentHeight;
          doubleRaf(() => {
            if (wrapperRef.value) {
              wrapperRef.value.style.height = value ? contentHeight : "0";
            }
          });
        } else {
          onTransitionEnd();
        }
      });
    });
    const toggle = (newValue = !expanded.value) => {
      parent.toggle(name2.value, newValue);
    };
    const onClickTitle = () => {
      if (!props.disabled && !props.readonly) {
        toggle();
      }
    };
    const renderTitle = () => {
      const {
        border,
        disabled,
        readonly: readonly2
      } = props;
      const attrs = pick(props, Object.keys(cellSharedProps));
      if (readonly2) {
        attrs.isLink = false;
      }
      if (disabled || readonly2) {
        attrs.clickable = false;
      }
      return createVNode(Cell, mergeProps({
        "role": "button",
        "class": bem$K("title", {
          disabled,
          expanded: expanded.value,
          borderless: !border
        }),
        "aria-expanded": String(expanded.value),
        "onClick": onClickTitle
      }, attrs), pick(slots, CELL_SLOTS));
    };
    const renderContent = lazyRender(() => {
      var _a;
      return withDirectives(createVNode("div", {
        "ref": wrapperRef,
        "class": bem$K("wrapper"),
        "onTransitionend": onTransitionEnd
      }, [createVNode("div", {
        "ref": contentRef,
        "class": bem$K("content")
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]), [[vShow, show.value]]);
    });
    useExpose({
      toggle
    });
    return () => createVNode("div", {
      "class": [bem$K({
        border: index2.value && props.border
      })]
    }, [renderTitle(), renderContent()]);
  }
});
const CollapseItem = withInstall(stdin_default$O);
const ConfigProvider = withInstall(stdin_default$1w);
const [name$K, bem$J, t$d] = createNamespace("contact-card");
const contactCardProps = {
  tel: String,
  name: String,
  type: makeStringProp("add"),
  addText: String,
  editable: truthProp
};
var stdin_default$N = defineComponent({
  name: name$K,
  props: contactCardProps,
  emits: ["click"],
  setup(props, {
    emit
  }) {
    const onClick = (event) => {
      if (props.editable) {
        emit("click", event);
      }
    };
    const renderContent = () => {
      if (props.type === "add") {
        return props.addText || t$d("addContact");
      }
      return [createVNode("div", null, [`${t$d("name")}\uFF1A${props.name}`]), createVNode("div", null, [`${t$d("tel")}\uFF1A${props.tel}`])];
    };
    return () => createVNode(Cell, {
      "center": true,
      "icon": props.type === "edit" ? "contact" : "add-square",
      "class": bem$J([props.type]),
      "border": false,
      "isLink": props.editable,
      "valueClass": bem$J("value"),
      "onClick": onClick
    }, {
      value: renderContent
    });
  }
});
const ContactCard = withInstall(stdin_default$N);
const [name$J, bem$I, t$c] = createNamespace("contact-edit");
const DEFAULT_CONTACT = {
  tel: "",
  name: ""
};
const contactEditProps = {
  isEdit: Boolean,
  isSaving: Boolean,
  isDeleting: Boolean,
  showSetDefault: Boolean,
  setDefaultLabel: String,
  contactInfo: {
    type: Object,
    default: () => extend({}, DEFAULT_CONTACT)
  },
  telValidator: {
    type: Function,
    default: isMobile
  }
};
var stdin_default$M = defineComponent({
  name: name$J,
  props: contactEditProps,
  emits: ["save", "delete", "change-default"],
  setup(props, {
    emit
  }) {
    const contact = reactive(extend({}, DEFAULT_CONTACT, props.contactInfo));
    const onSave = () => {
      if (!props.isSaving) {
        emit("save", contact);
      }
    };
    const onDelete = () => emit("delete", contact);
    const renderButtons = () => createVNode("div", {
      "class": bem$I("buttons")
    }, [createVNode(Button, {
      "block": true,
      "round": true,
      "type": "danger",
      "text": t$c("save"),
      "class": bem$I("button"),
      "loading": props.isSaving,
      "nativeType": "submit"
    }, null), props.isEdit && createVNode(Button, {
      "block": true,
      "round": true,
      "text": t$c("delete"),
      "class": bem$I("button"),
      "loading": props.isDeleting,
      "onClick": onDelete
    }, null)]);
    const renderSwitch = () => createVNode(Switch, {
      "modelValue": contact.isDefault,
      "onUpdate:modelValue": ($event) => contact.isDefault = $event,
      "size": 24,
      "onChange": (checked) => emit("change-default", checked)
    }, null);
    const renderSetDefault = () => {
      if (props.showSetDefault) {
        return createVNode(Cell, {
          "title": props.setDefaultLabel,
          "class": bem$I("switch-cell"),
          "border": false
        }, {
          "right-icon": renderSwitch
        });
      }
    };
    watch(() => props.contactInfo, (value) => extend(contact, DEFAULT_CONTACT, value));
    return () => createVNode(Form, {
      "class": bem$I(),
      "onSubmit": onSave
    }, {
      default: () => [createVNode("div", {
        "class": bem$I("fields")
      }, [createVNode(Field, {
        "modelValue": contact.name,
        "onUpdate:modelValue": ($event) => contact.name = $event,
        "clearable": true,
        "label": t$c("name"),
        "rules": [{
          required: true,
          message: t$c("nameEmpty")
        }],
        "maxlength": "30",
        "placeholder": t$c("name")
      }, null), createVNode(Field, {
        "modelValue": contact.tel,
        "onUpdate:modelValue": ($event) => contact.tel = $event,
        "clearable": true,
        "type": "tel",
        "label": t$c("tel"),
        "rules": [{
          validator: props.telValidator,
          message: t$c("telInvalid")
        }],
        "placeholder": t$c("tel")
      }, null)]), renderSetDefault(), renderButtons()]
    });
  }
});
const ContactEdit = withInstall(stdin_default$M);
const [name$I, bem$H, t$b] = createNamespace("contact-list");
const contactListProps = {
  list: Array,
  addText: String,
  modelValue: unknownProp,
  defaultTagText: String
};
var stdin_default$L = defineComponent({
  name: name$I,
  props: contactListProps,
  emits: ["add", "edit", "select", "update:modelValue"],
  setup(props, {
    emit
  }) {
    const renderItem = (item, index2) => {
      const onClick = () => {
        emit("update:modelValue", item.id);
        emit("select", item, index2);
      };
      const renderRightIcon = () => createVNode(Radio, {
        "class": bem$H("radio"),
        "name": item.id,
        "iconSize": 16
      }, null);
      const renderEditIcon = () => createVNode(Icon, {
        "name": "edit",
        "class": bem$H("edit"),
        "onClick": (event) => {
          event.stopPropagation();
          emit("edit", item, index2);
        }
      }, null);
      const renderContent = () => {
        const nodes = [`${item.name}\uFF0C${item.tel}`];
        if (item.isDefault && props.defaultTagText) {
          nodes.push(createVNode(Tag, {
            "type": "danger",
            "round": true,
            "class": bem$H("item-tag")
          }, {
            default: () => [props.defaultTagText]
          }));
        }
        return nodes;
      };
      return createVNode(Cell, {
        "key": item.id,
        "isLink": true,
        "center": true,
        "class": bem$H("item"),
        "valueClass": bem$H("item-value"),
        "onClick": onClick
      }, {
        icon: renderEditIcon,
        value: renderContent,
        "right-icon": renderRightIcon
      });
    };
    return () => createVNode("div", {
      "class": bem$H()
    }, [createVNode(RadioGroup, {
      "modelValue": props.modelValue,
      "class": bem$H("group")
    }, {
      default: () => [props.list && props.list.map(renderItem)]
    }), createVNode("div", {
      "class": [bem$H("bottom"), "van-safe-area-bottom"]
    }, [createVNode(Button, {
      "round": true,
      "block": true,
      "type": "danger",
      "class": bem$H("add"),
      "text": props.addText || t$b("addContact"),
      "onClick": () => emit("add")
    }, null)])]);
  }
});
const ContactList = withInstall(stdin_default$L);
function parseFormat(format2, currentTime) {
  const { days } = currentTime;
  let { hours, minutes, seconds, milliseconds } = currentTime;
  if (format2.includes("DD")) {
    format2 = format2.replace("DD", padZero(days));
  } else {
    hours += days * 24;
  }
  if (format2.includes("HH")) {
    format2 = format2.replace("HH", padZero(hours));
  } else {
    minutes += hours * 60;
  }
  if (format2.includes("mm")) {
    format2 = format2.replace("mm", padZero(minutes));
  } else {
    seconds += minutes * 60;
  }
  if (format2.includes("ss")) {
    format2 = format2.replace("ss", padZero(seconds));
  } else {
    milliseconds += seconds * 1e3;
  }
  if (format2.includes("S")) {
    const ms = padZero(milliseconds, 3);
    if (format2.includes("SSS")) {
      format2 = format2.replace("SSS", ms);
    } else if (format2.includes("SS")) {
      format2 = format2.replace("SS", ms.slice(0, 2));
    } else {
      format2 = format2.replace("S", ms.charAt(0));
    }
  }
  return format2;
}
const [name$H, bem$G] = createNamespace("count-down");
const countDownProps = {
  time: makeNumericProp(0),
  format: makeStringProp("HH:mm:ss"),
  autoStart: truthProp,
  millisecond: Boolean
};
var stdin_default$K = defineComponent({
  name: name$H,
  props: countDownProps,
  emits: ["change", "finish"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      start: start2,
      pause,
      reset: reset2,
      current: current2
    } = useCountDown({
      time: +props.time,
      millisecond: props.millisecond,
      onChange: (current22) => emit("change", current22),
      onFinish: () => emit("finish")
    });
    const timeText = computed(() => parseFormat(props.format, current2.value));
    const resetTime = () => {
      reset2(+props.time);
      if (props.autoStart) {
        start2();
      }
    };
    watch(() => props.time, resetTime, {
      immediate: true
    });
    useExpose({
      start: start2,
      pause,
      reset: resetTime
    });
    return () => createVNode("div", {
      "role": "timer",
      "class": bem$G()
    }, [slots.default ? slots.default(current2.value) : timeText.value]);
  }
});
const CountDown = withInstall(stdin_default$K);
function getDate(timeStamp) {
  const date = new Date(timeStamp * 1e3);
  return `${date.getFullYear()}.${padZero(date.getMonth() + 1)}.${padZero(date.getDate())}`;
}
const formatDiscount = (discount) => (discount / 10).toFixed(discount % 10 === 0 ? 0 : 1);
const formatAmount = (amount) => (amount / 100).toFixed(amount % 100 === 0 ? 0 : amount % 10 === 0 ? 1 : 2);
const [name$G, bem$F, t$a] = createNamespace("coupon");
var stdin_default$J = defineComponent({
  name: name$G,
  props: {
    chosen: Boolean,
    coupon: makeRequiredProp(Object),
    disabled: Boolean,
    currency: makeStringProp("\xA5")
  },
  setup(props) {
    const validPeriod = computed(() => {
      const {
        startAt,
        endAt
      } = props.coupon;
      return `${getDate(startAt)} - ${getDate(endAt)}`;
    });
    const faceAmount = computed(() => {
      const {
        coupon,
        currency
      } = props;
      if (coupon.valueDesc) {
        return [coupon.valueDesc, createVNode("span", null, [coupon.unitDesc || ""])];
      }
      if (coupon.denominations) {
        const denominations = formatAmount(coupon.denominations);
        return [createVNode("span", null, [currency]), ` ${denominations}`];
      }
      if (coupon.discount) {
        return t$a("discount", formatDiscount(coupon.discount));
      }
      return "";
    });
    const conditionMessage = computed(() => {
      const condition = formatAmount(props.coupon.originCondition || 0);
      return condition === "0" ? t$a("unlimited") : t$a("condition", condition);
    });
    return () => {
      const {
        chosen,
        coupon,
        disabled
      } = props;
      const description = disabled && coupon.reason || coupon.description;
      return createVNode("div", {
        "class": bem$F({
          disabled
        })
      }, [createVNode("div", {
        "class": bem$F("content")
      }, [createVNode("div", {
        "class": bem$F("head")
      }, [createVNode("h2", {
        "class": bem$F("amount")
      }, [faceAmount.value]), createVNode("p", {
        "class": bem$F("condition")
      }, [coupon.condition || conditionMessage.value])]), createVNode("div", {
        "class": bem$F("body")
      }, [createVNode("p", {
        "class": bem$F("name")
      }, [coupon.name]), createVNode("p", {
        "class": bem$F("valid")
      }, [validPeriod.value]), !disabled && createVNode(Checkbox, {
        "class": bem$F("corner"),
        "modelValue": chosen
      }, null)])]), description && createVNode("p", {
        "class": bem$F("description")
      }, [description])]);
    };
  }
});
const Coupon = withInstall(stdin_default$J);
const [name$F, bem$E, t$9] = createNamespace("coupon-cell");
const couponCellProps = {
  title: String,
  border: truthProp,
  editable: truthProp,
  coupons: makeArrayProp(),
  currency: makeStringProp("\xA5"),
  chosenCoupon: makeNumericProp(-1)
};
function formatValue({
  coupons,
  chosenCoupon,
  currency
}) {
  const coupon = coupons[+chosenCoupon];
  if (coupon) {
    let value = 0;
    if (isDef(coupon.value)) {
      ({
        value
      } = coupon);
    } else if (isDef(coupon.denominations)) {
      value = coupon.denominations;
    }
    return `-${currency} ${(value / 100).toFixed(2)}`;
  }
  return coupons.length === 0 ? t$9("noCoupon") : t$9("count", coupons.length);
}
var stdin_default$I = defineComponent({
  name: name$F,
  props: couponCellProps,
  setup(props) {
    return () => {
      const selected = props.coupons[+props.chosenCoupon];
      return createVNode(Cell, {
        "class": bem$E(),
        "value": formatValue(props),
        "title": props.title || t$9("title"),
        "border": props.border,
        "isLink": props.editable,
        "valueClass": bem$E("value", {
          selected
        })
      }, null);
    };
  }
});
const CouponCell = withInstall(stdin_default$I);
const getId = (num) => `van-empty-${num}`;
const useId = (num) => `url(#${getId(num)})`;
const renderStop = (color, offset2, opacity) => createVNode("stop", {
  "stop-color": color,
  "offset": `${offset2}%`,
  "stop-opacity": opacity
}, null);
const renderStops = (fromColor, toColor) => [renderStop(fromColor, 0), renderStop(toColor, 100)];
const renderShadow = (id) => [createVNode("defs", null, [createVNode("radialGradient", {
  "id": getId(id),
  "cx": "50%",
  "cy": "54%",
  "fx": "50%",
  "fy": "54%",
  "r": "297%",
  "gradientTransform": "matrix(-.16 0 0 -.33 .58 .72)"
}, [renderStop("#EBEDF0", 0), renderStop("#F2F3F5", 100, 0.3)])]), createVNode("ellipse", {
  "fill": useId(id),
  "opacity": ".8",
  "cx": "80",
  "cy": "140",
  "rx": "46",
  "ry": "8"
}, null)];
const renderBuilding = () => [createVNode("defs", null, [createVNode("linearGradient", {
  "id": getId("a"),
  "x1": "64%",
  "y1": "100%",
  "x2": "64%"
}, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)])]), createVNode("g", {
  "opacity": ".8"
}, [createVNode("path", {
  "d": "M36 131V53H16v20H2v58h34z",
  "fill": useId("a")
}, null), createVNode("path", {
  "d": "M123 15h22v14h9v77h-31V15z",
  "fill": useId("a")
}, null)])];
const renderCloud = () => [createVNode("defs", null, [createVNode("linearGradient", {
  "id": getId("b"),
  "x1": "64%",
  "y1": "97%",
  "x2": "64%",
  "y2": "0%"
}, [renderStop("#F2F3F5", 0, 0.3), renderStop("#F2F3F5", 100)])]), createVNode("g", {
  "opacity": ".8"
}, [createVNode("path", {
  "d": "M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z",
  "fill": useId("b")
}, null), createVNode("path", {
  "d": "M19 23c2 0 3 1 4 3 2 0 4 2 4 4a4 4 0 0 1-4 3v1h-7v-1l-1 1c-2 0-3-2-3-4 0-1 1-3 3-3 0-2 2-4 4-4Z",
  "fill": useId("b")
}, null)])];
const renderNetwork = () => createVNode("svg", {
  "viewBox": "0 0 160 160"
}, [createVNode("defs", null, [createVNode("linearGradient", {
  "id": getId(1),
  "x1": "64%",
  "y1": "100%",
  "x2": "64%"
}, [renderStop("#FFF", 0, 0.5), renderStop("#F2F3F5", 100)]), createVNode("linearGradient", {
  "id": getId(2),
  "x1": "50%",
  "x2": "50%",
  "y2": "84%"
}, [renderStop("#EBEDF0", 0), renderStop("#DCDEE0", 100, 0)]), createVNode("linearGradient", {
  "id": getId(3),
  "x1": "100%",
  "x2": "100%",
  "y2": "100%"
}, [renderStops("#EAEDF0", "#DCDEE0")]), createVNode("radialGradient", {
  "id": getId(4),
  "cx": "50%",
  "cy": "0%",
  "fx": "50%",
  "fy": "0%",
  "r": "100%",
  "gradientTransform": "matrix(0 1 -.54 0 .5 -.5)"
}, [renderStop("#EBEDF0", 0), renderStop("#FFF", 100, 0)])]), createVNode("g", {
  "fill": "none"
}, [renderBuilding(), createVNode("path", {
  "fill": useId(4),
  "d": "M0 139h160v21H0z"
}, null), createVNode("path", {
  "d": "M80 54a7 7 0 0 1 3 13v27l-2 2h-2a2 2 0 0 1-2-2V67a7 7 0 0 1 3-13z",
  "fill": useId(2)
}, null), createVNode("g", {
  "opacity": ".6",
  "stroke-linecap": "round",
  "stroke-width": "7"
}, [createVNode("path", {
  "d": "M64 47a19 19 0 0 0-5 13c0 5 2 10 5 13",
  "stroke": useId(3)
}, null), createVNode("path", {
  "d": "M53 36a34 34 0 0 0 0 48",
  "stroke": useId(3)
}, null), createVNode("path", {
  "d": "M95 73a19 19 0 0 0 6-13c0-5-2-9-6-13",
  "stroke": useId(3)
}, null), createVNode("path", {
  "d": "M106 84a34 34 0 0 0 0-48",
  "stroke": useId(3)
}, null)]), createVNode("g", {
  "transform": "translate(31 105)"
}, [createVNode("rect", {
  "fill": "#EBEDF0",
  "width": "98",
  "height": "34",
  "rx": "2"
}, null), createVNode("rect", {
  "fill": "#FFF",
  "x": "9",
  "y": "8",
  "width": "80",
  "height": "18",
  "rx": "1.1"
}, null), createVNode("rect", {
  "fill": "#EBEDF0",
  "x": "15",
  "y": "12",
  "width": "18",
  "height": "6",
  "rx": "1.1"
}, null)])])]);
const renderMaterial = () => createVNode("svg", {
  "viewBox": "0 0 160 160"
}, [createVNode("defs", null, [createVNode("linearGradient", {
  "x1": "50%",
  "x2": "50%",
  "y2": "100%",
  "id": getId(5)
}, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
  "x1": "95%",
  "y1": "48%",
  "x2": "5.5%",
  "y2": "51%",
  "id": getId(6)
}, [renderStops("#EAEDF1", "#DCDEE0")]), createVNode("linearGradient", {
  "y1": "45%",
  "x2": "100%",
  "y2": "54%",
  "id": getId(7)
}, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), createVNode("g", {
  "transform": "translate(36 50)",
  "fill": "none"
}, [createVNode("g", {
  "transform": "translate(8)"
}, [createVNode("rect", {
  "fill": "#EBEDF0",
  "opacity": ".6",
  "x": "38",
  "y": "13",
  "width": "36",
  "height": "53",
  "rx": "2"
}, null), createVNode("rect", {
  "fill": useId(5),
  "width": "64",
  "height": "66",
  "rx": "2"
}, null), createVNode("rect", {
  "fill": "#FFF",
  "x": "6",
  "y": "6",
  "width": "52",
  "height": "55",
  "rx": "1"
}, null), createVNode("g", {
  "transform": "translate(15 17)",
  "fill": useId(6)
}, [createVNode("rect", {
  "width": "34",
  "height": "6",
  "rx": "1"
}, null), createVNode("path", {
  "d": "M0 14h34v6H0z"
}, null), createVNode("rect", {
  "y": "28",
  "width": "34",
  "height": "6",
  "rx": "1"
}, null)])]), createVNode("rect", {
  "fill": useId(7),
  "y": "61",
  "width": "88",
  "height": "28",
  "rx": "1"
}, null), createVNode("rect", {
  "fill": "#F7F8FA",
  "x": "29",
  "y": "72",
  "width": "30",
  "height": "6",
  "rx": "1"
}, null)])]);
const renderError = () => createVNode("svg", {
  "viewBox": "0 0 160 160"
}, [createVNode("defs", null, [createVNode("linearGradient", {
  "x1": "50%",
  "x2": "50%",
  "y2": "100%",
  "id": getId(8)
}, [renderStops("#EAEDF1", "#DCDEE0")])]), renderBuilding(), renderCloud(), renderShadow("c"), createVNode("path", {
  "d": "m59 60 21 21 21-21h3l9 9v3L92 93l21 21v3l-9 9h-3l-21-21-21 21h-3l-9-9v-3l21-21-21-21v-3l9-9h3Z",
  "fill": useId(8)
}, null)]);
const renderSearch = () => createVNode("svg", {
  "viewBox": "0 0 160 160"
}, [createVNode("defs", null, [createVNode("linearGradient", {
  "x1": "50%",
  "y1": "100%",
  "x2": "50%",
  "id": getId(9)
}, [renderStops("#EEE", "#D8D8D8")]), createVNode("linearGradient", {
  "x1": "100%",
  "y1": "50%",
  "y2": "50%",
  "id": getId(10)
}, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
  "x1": "50%",
  "x2": "50%",
  "y2": "100%",
  "id": getId(11)
}, [renderStops("#F2F3F5", "#DCDEE0")]), createVNode("linearGradient", {
  "x1": "50%",
  "x2": "50%",
  "y2": "100%",
  "id": getId(12)
}, [renderStops("#FFF", "#F7F8FA")])]), renderBuilding(), renderCloud(), renderShadow("d"), createVNode("g", {
  "transform": "rotate(-45 113 -4)",
  "fill": "none"
}, [createVNode("rect", {
  "fill": useId(9),
  "x": "24",
  "y": "52.8",
  "width": "5.8",
  "height": "19",
  "rx": "1"
}, null), createVNode("rect", {
  "fill": useId(10),
  "x": "22.1",
  "y": "67.3",
  "width": "9.9",
  "height": "28",
  "rx": "1"
}, null), createVNode("circle", {
  "stroke": useId(11),
  "stroke-width": "8",
  "cx": "27",
  "cy": "27",
  "r": "27"
}, null), createVNode("circle", {
  "fill": useId(12),
  "cx": "27",
  "cy": "27",
  "r": "16"
}, null), createVNode("path", {
  "d": "M37 7c-8 0-15 5-16 12",
  "stroke": useId(11),
  "stroke-width": "3",
  "opacity": ".5",
  "stroke-linecap": "round",
  "transform": "rotate(45 29 13)"
}, null)])]);
const [name$E, bem$D] = createNamespace("empty");
const PRESET_IMAGES = {
  error: renderError,
  search: renderSearch,
  network: renderNetwork,
  default: renderMaterial
};
const emptyProps = {
  image: makeStringProp("default"),
  imageSize: [Number, String, Array],
  description: String
};
var stdin_default$H = defineComponent({
  name: name$E,
  props: emptyProps,
  setup(props, {
    slots
  }) {
    const renderImage = () => {
      var _a;
      if (slots.image) {
        return slots.image();
      }
      return ((_a = PRESET_IMAGES[props.image]) == null ? void 0 : _a.call(PRESET_IMAGES)) || createVNode("img", {
        "src": props.image
      }, null);
    };
    const renderDescription = () => {
      const description = slots.description ? slots.description() : props.description;
      if (description) {
        return createVNode("p", {
          "class": bem$D("description")
        }, [description]);
      }
    };
    const renderBottom = () => {
      if (slots.default) {
        return createVNode("div", {
          "class": bem$D("bottom")
        }, [slots.default()]);
      }
    };
    return () => createVNode("div", {
      "class": bem$D()
    }, [createVNode("div", {
      "class": bem$D("image"),
      "style": getSizeStyle(props.imageSize)
    }, [renderImage()]), renderDescription(), renderBottom()]);
  }
});
const Empty = withInstall(stdin_default$H);
const [name$D, bem$C, t$8] = createNamespace("coupon-list");
const couponListProps = {
  code: makeStringProp(""),
  coupons: makeArrayProp(),
  currency: makeStringProp("\xA5"),
  showCount: truthProp,
  emptyImage: String,
  chosenCoupon: makeNumberProp(-1),
  enabledTitle: String,
  disabledTitle: String,
  disabledCoupons: makeArrayProp(),
  showExchangeBar: truthProp,
  showCloseButton: truthProp,
  closeButtonText: String,
  inputPlaceholder: String,
  exchangeMinLength: makeNumberProp(1),
  exchangeButtonText: String,
  displayedCouponIndex: makeNumberProp(-1),
  exchangeButtonLoading: Boolean,
  exchangeButtonDisabled: Boolean
};
var stdin_default$G = defineComponent({
  name: name$D,
  props: couponListProps,
  emits: ["change", "exchange", "update:code"],
  setup(props, {
    emit,
    slots
  }) {
    const [couponRefs, setCouponRefs] = useRefs();
    const root = ref();
    const barRef = ref();
    const activeTab = ref(0);
    const listHeight = ref(0);
    const currentCode = ref(props.code);
    const buttonDisabled = computed(() => !props.exchangeButtonLoading && (props.exchangeButtonDisabled || !currentCode.value || currentCode.value.length < props.exchangeMinLength));
    const updateListHeight = () => {
      const TABS_HEIGHT = 44;
      const rootHeight = useRect(root).height;
      const headerHeight = useRect(barRef).height + TABS_HEIGHT;
      listHeight.value = (rootHeight > headerHeight ? rootHeight : windowHeight.value) - headerHeight;
    };
    const onExchange = () => {
      emit("exchange", currentCode.value);
      if (!props.code) {
        currentCode.value = "";
      }
    };
    const scrollToCoupon = (index2) => {
      nextTick(() => {
        var _a;
        return (_a = couponRefs.value[index2]) == null ? void 0 : _a.scrollIntoView();
      });
    };
    const renderEmpty = () => createVNode(Empty, {
      "image": props.emptyImage
    }, {
      default: () => [createVNode("p", {
        "class": bem$C("empty-tip")
      }, [t$8("noCoupon")])]
    });
    const renderExchangeBar = () => {
      if (props.showExchangeBar) {
        return createVNode("div", {
          "ref": barRef,
          "class": bem$C("exchange-bar")
        }, [createVNode(Field, {
          "modelValue": currentCode.value,
          "onUpdate:modelValue": ($event) => currentCode.value = $event,
          "clearable": true,
          "border": false,
          "class": bem$C("field"),
          "placeholder": props.inputPlaceholder || t$8("placeholder"),
          "maxlength": "20"
        }, null), createVNode(Button, {
          "plain": true,
          "type": "danger",
          "class": bem$C("exchange"),
          "text": props.exchangeButtonText || t$8("exchange"),
          "loading": props.exchangeButtonLoading,
          "disabled": buttonDisabled.value,
          "onClick": onExchange
        }, null)]);
      }
    };
    const renderCouponTab = () => {
      const {
        coupons
      } = props;
      const count = props.showCount ? ` (${coupons.length})` : "";
      const title = (props.enabledTitle || t$8("enable")) + count;
      return createVNode(Tab, {
        "title": title
      }, {
        default: () => {
          var _a;
          return [createVNode("div", {
            "class": bem$C("list", {
              "with-bottom": props.showCloseButton
            }),
            "style": {
              height: `${listHeight.value}px`
            }
          }, [coupons.map((coupon, index2) => createVNode(Coupon, {
            "key": coupon.id,
            "ref": setCouponRefs(index2),
            "coupon": coupon,
            "chosen": index2 === props.chosenCoupon,
            "currency": props.currency,
            "onClick": () => emit("change", index2)
          }, null)), !coupons.length && renderEmpty(), (_a = slots["list-footer"]) == null ? void 0 : _a.call(slots)])];
        }
      });
    };
    const renderDisabledTab = () => {
      const {
        disabledCoupons
      } = props;
      const count = props.showCount ? ` (${disabledCoupons.length})` : "";
      const title = (props.disabledTitle || t$8("disabled")) + count;
      return createVNode(Tab, {
        "title": title
      }, {
        default: () => {
          var _a;
          return [createVNode("div", {
            "class": bem$C("list", {
              "with-bottom": props.showCloseButton
            }),
            "style": {
              height: `${listHeight.value}px`
            }
          }, [disabledCoupons.map((coupon) => createVNode(Coupon, {
            "disabled": true,
            "key": coupon.id,
            "coupon": coupon,
            "currency": props.currency
          }, null)), !disabledCoupons.length && renderEmpty(), (_a = slots["disabled-list-footer"]) == null ? void 0 : _a.call(slots)])];
        }
      });
    };
    watch(() => props.code, (value) => {
      currentCode.value = value;
    });
    watch(windowHeight, updateListHeight);
    watch(currentCode, (value) => emit("update:code", value));
    watch(() => props.displayedCouponIndex, scrollToCoupon);
    onMounted(() => {
      updateListHeight();
      scrollToCoupon(props.displayedCouponIndex);
    });
    return () => createVNode("div", {
      "ref": root,
      "class": bem$C()
    }, [renderExchangeBar(), createVNode(Tabs, {
      "active": activeTab.value,
      "onUpdate:active": ($event) => activeTab.value = $event,
      "class": bem$C("tab")
    }, {
      default: () => [renderCouponTab(), renderDisabledTab()]
    }), createVNode("div", {
      "class": bem$C("bottom")
    }, [withDirectives(createVNode(Button, {
      "round": true,
      "block": true,
      "type": "danger",
      "class": bem$C("close"),
      "text": props.closeButtonText || t$8("close"),
      "onClick": () => emit("change", -1)
    }, null), [[vShow, props.showCloseButton]])])]);
  }
});
const CouponList = withInstall(stdin_default$G);
const [name$C] = createNamespace("time-picker");
var stdin_default$F = defineComponent({
  name: name$C,
  props: extend({}, sharedProps, {
    minHour: makeNumericProp(0),
    maxHour: makeNumericProp(23),
    minMinute: makeNumericProp(0),
    maxMinute: makeNumericProp(59),
    modelValue: String
  }),
  emits: ["confirm", "cancel", "change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const formatValue2 = (value) => {
      const {
        minHour,
        maxHour,
        maxMinute,
        minMinute
      } = props;
      if (!value) {
        value = `${padZero(minHour)}:${padZero(minMinute)}`;
      }
      let [hour, minute] = value.split(":");
      hour = padZero(clamp(+hour, +minHour, +maxHour));
      minute = padZero(clamp(+minute, +minMinute, +maxMinute));
      return `${hour}:${minute}`;
    };
    const picker = ref();
    const currentDate = ref(formatValue2(props.modelValue));
    const ranges = computed(() => [{
      type: "hour",
      range: [+props.minHour, +props.maxHour]
    }, {
      type: "minute",
      range: [+props.minMinute, +props.maxMinute]
    }]);
    const originColumns = computed(() => ranges.value.map(({
      type,
      range: rangeArr
    }) => {
      let values = times(rangeArr[1] - rangeArr[0] + 1, (index2) => padZero(rangeArr[0] + index2));
      if (props.filter) {
        values = props.filter(type, values);
      }
      return {
        type,
        values
      };
    }));
    const columns = computed(() => originColumns.value.map((column) => ({
      values: column.values.map((value) => props.formatter(column.type, value))
    })));
    const updateColumnValue = () => {
      const pair = currentDate.value.split(":");
      const values = [props.formatter("hour", pair[0]), props.formatter("minute", pair[1])];
      nextTick(() => {
        var _a;
        (_a = picker.value) == null ? void 0 : _a.setValues(values);
      });
    };
    const updateInnerValue = () => {
      const [hourIndex, minuteIndex] = picker.value.getIndexes();
      const [hourColumn, minuteColumn] = originColumns.value;
      const hour = hourColumn.values[hourIndex] || hourColumn.values[0];
      const minute = minuteColumn.values[minuteIndex] || minuteColumn.values[0];
      currentDate.value = formatValue2(`${hour}:${minute}`);
      updateColumnValue();
    };
    const onConfirm = () => emit("confirm", currentDate.value);
    const onCancel = () => emit("cancel");
    const onChange = () => {
      updateInnerValue();
      nextTick(() => {
        nextTick(() => emit("change", currentDate.value));
      });
    };
    onMounted(() => {
      updateColumnValue();
      nextTick(updateInnerValue);
    });
    watch(columns, updateColumnValue);
    watch(() => [props.filter, props.maxHour, props.minMinute, props.maxMinute], updateInnerValue);
    watch(() => props.minHour, () => {
      nextTick(updateInnerValue);
    });
    watch(currentDate, (value) => emit("update:modelValue", value));
    watch(() => props.modelValue, (value) => {
      value = formatValue2(value);
      if (value !== currentDate.value) {
        currentDate.value = value;
        updateColumnValue();
      }
    });
    useExpose({
      getPicker: () => picker.value && proxyPickerMethods(picker.value, updateInnerValue)
    });
    return () => createVNode(Picker, mergeProps({
      "ref": picker,
      "columns": columns.value,
      "onChange": onChange,
      "onCancel": onCancel,
      "onConfirm": onConfirm
    }, pick(props, pickerInheritKeys)), slots);
  }
});
const currentYear = new Date().getFullYear();
const [name$B] = createNamespace("date-picker");
var stdin_default$E = defineComponent({
  name: name$B,
  props: extend({}, sharedProps, {
    type: makeStringProp("datetime"),
    modelValue: Date,
    minDate: {
      type: Date,
      default: () => new Date(currentYear - 10, 0, 1),
      validator: isDate
    },
    maxDate: {
      type: Date,
      default: () => new Date(currentYear + 10, 11, 31),
      validator: isDate
    }
  }),
  emits: ["confirm", "cancel", "change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const formatValue2 = (value) => {
      if (isDate(value)) {
        const timestamp = clamp(value.getTime(), props.minDate.getTime(), props.maxDate.getTime());
        return new Date(timestamp);
      }
      return void 0;
    };
    const picker = ref();
    const currentDate = ref(formatValue2(props.modelValue));
    const getBoundary = (type, value) => {
      const boundary = props[`${type}Date`];
      const year = boundary.getFullYear();
      let month = 1;
      let date = 1;
      let hour = 0;
      let minute = 0;
      if (type === "max") {
        month = 12;
        date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
        hour = 23;
        minute = 59;
      }
      if (value.getFullYear() === year) {
        month = boundary.getMonth() + 1;
        if (value.getMonth() + 1 === month) {
          date = boundary.getDate();
          if (value.getDate() === date) {
            hour = boundary.getHours();
            if (value.getHours() === hour) {
              minute = boundary.getMinutes();
            }
          }
        }
      }
      return {
        [`${type}Year`]: year,
        [`${type}Month`]: month,
        [`${type}Date`]: date,
        [`${type}Hour`]: hour,
        [`${type}Minute`]: minute
      };
    };
    const ranges = computed(() => {
      const {
        maxYear,
        maxDate,
        maxMonth,
        maxHour,
        maxMinute
      } = getBoundary("max", currentDate.value || props.minDate);
      const {
        minYear,
        minDate,
        minMonth,
        minHour,
        minMinute
      } = getBoundary("min", currentDate.value || props.minDate);
      let result = [{
        type: "year",
        range: [minYear, maxYear]
      }, {
        type: "month",
        range: [minMonth, maxMonth]
      }, {
        type: "day",
        range: [minDate, maxDate]
      }, {
        type: "hour",
        range: [minHour, maxHour]
      }, {
        type: "minute",
        range: [minMinute, maxMinute]
      }];
      switch (props.type) {
        case "date":
          result = result.slice(0, 3);
          break;
        case "year-month":
          result = result.slice(0, 2);
          break;
        case "month-day":
          result = result.slice(1, 3);
          break;
        case "datehour":
          result = result.slice(0, 4);
          break;
      }
      if (props.columnsOrder) {
        const columnsOrder = props.columnsOrder.concat(result.map((column) => column.type));
        result.sort((a, b) => columnsOrder.indexOf(a.type) - columnsOrder.indexOf(b.type));
      }
      return result;
    });
    const originColumns = computed(() => ranges.value.map(({
      type,
      range: rangeArr
    }) => {
      let values = times(rangeArr[1] - rangeArr[0] + 1, (index2) => padZero(rangeArr[0] + index2));
      if (props.filter) {
        values = props.filter(type, values);
      }
      return {
        type,
        values
      };
    }));
    const columns = computed(() => originColumns.value.map((column) => ({
      values: column.values.map((value) => props.formatter(column.type, value))
    })));
    const updateColumnValue = () => {
      const value = currentDate.value || props.minDate;
      const {
        formatter
      } = props;
      const values = originColumns.value.map((column) => {
        switch (column.type) {
          case "year":
            return formatter("year", `${value.getFullYear()}`);
          case "month":
            return formatter("month", padZero(value.getMonth() + 1));
          case "day":
            return formatter("day", padZero(value.getDate()));
          case "hour":
            return formatter("hour", padZero(value.getHours()));
          case "minute":
            return formatter("minute", padZero(value.getMinutes()));
          default:
            return "";
        }
      });
      nextTick(() => {
        var _a;
        (_a = picker.value) == null ? void 0 : _a.setValues(values);
      });
    };
    const updateInnerValue = () => {
      const {
        type
      } = props;
      const indexes = picker.value.getIndexes();
      const getValue = (type2) => {
        let index2 = 0;
        originColumns.value.forEach((column, columnIndex) => {
          if (type2 === column.type) {
            index2 = columnIndex;
          }
        });
        const {
          values
        } = originColumns.value[index2];
        return getTrueValue(values[indexes[index2]]);
      };
      let year;
      let month;
      let day;
      if (type === "month-day") {
        year = (currentDate.value || props.minDate).getFullYear();
        month = getValue("month");
        day = getValue("day");
      } else {
        year = getValue("year");
        month = getValue("month");
        day = type === "year-month" ? 1 : getValue("day");
      }
      const maxDay = getMonthEndDay(year, month);
      day = day > maxDay ? maxDay : day;
      let hour = 0;
      let minute = 0;
      if (type === "datehour") {
        hour = getValue("hour");
      }
      if (type === "datetime") {
        hour = getValue("hour");
        minute = getValue("minute");
      }
      const value = new Date(year, month - 1, day, hour, minute);
      currentDate.value = formatValue2(value);
    };
    const onConfirm = () => {
      emit("update:modelValue", currentDate.value);
      emit("confirm", currentDate.value);
    };
    const onCancel = () => emit("cancel");
    const onChange = () => {
      updateInnerValue();
      nextTick(() => {
        updateInnerValue();
        nextTick(() => emit("change", currentDate.value));
      });
    };
    onMounted(() => {
      updateColumnValue();
      nextTick(updateInnerValue);
    });
    watch(columns, updateColumnValue);
    watch(currentDate, (value, oldValue) => emit("update:modelValue", oldValue ? value : null));
    watch(() => [props.filter, props.minDate, props.maxDate], () => {
      nextTick(updateInnerValue);
    });
    watch(() => props.modelValue, (value) => {
      var _a;
      value = formatValue2(value);
      if (value && value.valueOf() !== ((_a = currentDate.value) == null ? void 0 : _a.valueOf())) {
        currentDate.value = value;
      }
    });
    useExpose({
      getPicker: () => picker.value && proxyPickerMethods(picker.value, updateInnerValue)
    });
    return () => createVNode(Picker, mergeProps({
      "ref": picker,
      "columns": columns.value,
      "onChange": onChange,
      "onCancel": onCancel,
      "onConfirm": onConfirm
    }, pick(props, pickerInheritKeys)), slots);
  }
});
const [name$A, bem$B] = createNamespace("datetime-picker");
const timePickerPropKeys = Object.keys(stdin_default$F.props);
const datePickerPropKeys = Object.keys(stdin_default$E.props);
const datetimePickerProps = extend({}, stdin_default$F.props, stdin_default$E.props, {
  modelValue: [String, Date]
});
var stdin_default$D = defineComponent({
  name: name$A,
  props: datetimePickerProps,
  setup(props, {
    attrs,
    slots
  }) {
    const root = ref();
    useExpose({
      getPicker: () => {
        var _a;
        return (_a = root.value) == null ? void 0 : _a.getPicker();
      }
    });
    return () => {
      const isTimePicker = props.type === "time";
      const Component = isTimePicker ? stdin_default$F : stdin_default$E;
      const inheritProps = pick(props, isTimePicker ? timePickerPropKeys : datePickerPropKeys);
      return createVNode(Component, mergeProps({
        "ref": root,
        "class": bem$B()
      }, inheritProps, attrs), slots);
    };
  }
});
const DatetimePicker = withInstall(stdin_default$D);
const [name$z, bem$A, t$7] = createNamespace("dialog");
const dialogProps = extend({}, popupSharedProps, {
  title: String,
  theme: String,
  width: numericProp,
  message: [String, Function],
  callback: Function,
  allowHtml: Boolean,
  className: unknownProp,
  transition: makeStringProp("van-dialog-bounce"),
  messageAlign: String,
  closeOnPopstate: truthProp,
  showCancelButton: Boolean,
  cancelButtonText: String,
  cancelButtonColor: String,
  cancelButtonDisabled: Boolean,
  confirmButtonText: String,
  confirmButtonColor: String,
  confirmButtonDisabled: Boolean,
  showConfirmButton: truthProp,
  closeOnClickOverlay: Boolean
});
const popupInheritKeys$1 = [...popupSharedPropKeys, "transition", "closeOnPopstate"];
var stdin_default$C = defineComponent({
  name: name$z,
  props: dialogProps,
  emits: ["confirm", "cancel", "keydown", "update:show"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const loading = reactive({
      confirm: false,
      cancel: false
    });
    const updateShow = (value) => emit("update:show", value);
    const close = (action) => {
      var _a;
      updateShow(false);
      (_a = props.callback) == null ? void 0 : _a.call(props, action);
    };
    const getActionHandler = (action) => () => {
      if (!props.show) {
        return;
      }
      emit(action);
      if (props.beforeClose) {
        loading[action] = true;
        callInterceptor(props.beforeClose, {
          args: [action],
          done() {
            close(action);
            loading[action] = false;
          },
          canceled() {
            loading[action] = false;
          }
        });
      } else {
        close(action);
      }
    };
    const onCancel = getActionHandler("cancel");
    const onConfirm = getActionHandler("confirm");
    const onKeydown = withKeys((event) => {
      var _a, _b;
      if (event.target !== ((_b = (_a = root.value) == null ? void 0 : _a.popupRef) == null ? void 0 : _b.value)) {
        return;
      }
      const onEventType = {
        Enter: props.showConfirmButton ? onConfirm : noop,
        Escape: props.showCancelButton ? onCancel : noop
      };
      onEventType[event.key]();
      emit("keydown", event);
    }, ["enter", "esc"]);
    const renderTitle = () => {
      const title = slots.title ? slots.title() : props.title;
      if (title) {
        return createVNode("div", {
          "class": bem$A("header", {
            isolated: !props.message && !slots.default
          })
        }, [title]);
      }
    };
    const renderMessage = (hasTitle) => {
      const {
        message,
        allowHtml,
        messageAlign
      } = props;
      const classNames = bem$A("message", {
        "has-title": hasTitle,
        [messageAlign]: messageAlign
      });
      const content = isFunction(message) ? message() : message;
      if (allowHtml && typeof content === "string") {
        return createVNode("div", {
          "class": classNames,
          "innerHTML": content
        }, null);
      }
      return createVNode("div", {
        "class": classNames
      }, [content]);
    };
    const renderContent = () => {
      if (slots.default) {
        return createVNode("div", {
          "class": bem$A("content")
        }, [slots.default()]);
      }
      const {
        title,
        message,
        allowHtml
      } = props;
      if (message) {
        const hasTitle = !!(title || slots.title);
        return createVNode("div", {
          "key": allowHtml ? 1 : 0,
          "class": bem$A("content", {
            isolated: !hasTitle
          })
        }, [renderMessage(hasTitle)]);
      }
    };
    const renderButtons = () => createVNode("div", {
      "class": [BORDER_TOP, bem$A("footer")]
    }, [props.showCancelButton && createVNode(Button, {
      "size": "large",
      "text": props.cancelButtonText || t$7("cancel"),
      "class": bem$A("cancel"),
      "style": {
        color: props.cancelButtonColor
      },
      "loading": loading.cancel,
      "disabled": props.cancelButtonDisabled,
      "onClick": onCancel
    }, null), props.showConfirmButton && createVNode(Button, {
      "size": "large",
      "text": props.confirmButtonText || t$7("confirm"),
      "class": [bem$A("confirm"), {
        [BORDER_LEFT]: props.showCancelButton
      }],
      "style": {
        color: props.confirmButtonColor
      },
      "loading": loading.confirm,
      "disabled": props.confirmButtonDisabled,
      "onClick": onConfirm
    }, null)]);
    const renderRoundButtons = () => createVNode(ActionBar, {
      "class": bem$A("footer")
    }, {
      default: () => [props.showCancelButton && createVNode(ActionBarButton, {
        "type": "warning",
        "text": props.cancelButtonText || t$7("cancel"),
        "class": bem$A("cancel"),
        "color": props.cancelButtonColor,
        "loading": loading.cancel,
        "disabled": props.cancelButtonDisabled,
        "onClick": onCancel
      }, null), props.showConfirmButton && createVNode(ActionBarButton, {
        "type": "danger",
        "text": props.confirmButtonText || t$7("confirm"),
        "class": bem$A("confirm"),
        "color": props.confirmButtonColor,
        "loading": loading.confirm,
        "disabled": props.confirmButtonDisabled,
        "onClick": onConfirm
      }, null)]
    });
    const renderFooter = () => {
      if (slots.footer) {
        return slots.footer();
      }
      return props.theme === "round-button" ? renderRoundButtons() : renderButtons();
    };
    return () => {
      const {
        width: width2,
        title,
        theme,
        message,
        className
      } = props;
      return createVNode(Popup, mergeProps({
        "ref": root,
        "role": "dialog",
        "class": [bem$A([theme]), className],
        "style": {
          width: addUnit(width2)
        },
        "tabindex": 0,
        "aria-labelledby": title || message,
        "onKeydown": onKeydown,
        "onUpdate:show": updateShow
      }, pick(props, popupInheritKeys$1)), {
        default: () => [renderTitle(), renderContent(), renderFooter()]
      });
    };
  }
});
let instance$2;
function initInstance$2() {
  const Wrapper = {
    setup() {
      const {
        state,
        toggle
      } = usePopupState();
      return () => createVNode(stdin_default$C, mergeProps(state, {
        "onUpdate:show": toggle
      }), null);
    }
  };
  ({
    instance: instance$2
  } = mountComponent(Wrapper));
}
function Dialog(options) {
  if (!inBrowser$1) {
    return Promise.resolve();
  }
  return new Promise((resolve2, reject) => {
    if (!instance$2) {
      initInstance$2();
    }
    instance$2.open(extend({}, Dialog.currentOptions, options, {
      callback: (action) => {
        (action === "confirm" ? resolve2 : reject)(action);
      }
    }));
  });
}
Dialog.defaultOptions = {
  title: "",
  width: "",
  theme: null,
  message: "",
  overlay: true,
  callback: null,
  teleport: "body",
  className: "",
  allowHtml: false,
  lockScroll: true,
  transition: void 0,
  beforeClose: null,
  overlayClass: "",
  overlayStyle: void 0,
  messageAlign: "",
  cancelButtonText: "",
  cancelButtonColor: null,
  cancelButtonDisabled: false,
  confirmButtonText: "",
  confirmButtonColor: null,
  confirmButtonDisabled: false,
  showConfirmButton: true,
  showCancelButton: false,
  closeOnPopstate: true,
  closeOnClickOverlay: false
};
Dialog.currentOptions = extend({}, Dialog.defaultOptions);
Dialog.alert = Dialog;
Dialog.confirm = (options) => Dialog(extend({
  showCancelButton: true
}, options));
Dialog.close = () => {
  if (instance$2) {
    instance$2.toggle(false);
  }
};
Dialog.setDefaultOptions = (options) => {
  extend(Dialog.currentOptions, options);
};
Dialog.resetDefaultOptions = () => {
  Dialog.currentOptions = extend({}, Dialog.defaultOptions);
};
Dialog.Component = withInstall(stdin_default$C);
Dialog.install = (app2) => {
  app2.use(Dialog.Component);
  app2.config.globalProperties.$dialog = Dialog;
};
const [name$y, bem$z] = createNamespace("divider");
const dividerProps = {
  dashed: Boolean,
  hairline: truthProp,
  contentPosition: makeStringProp("center")
};
var stdin_default$B = defineComponent({
  name: name$y,
  props: dividerProps,
  setup(props, {
    slots
  }) {
    return () => {
      var _a;
      return createVNode("div", {
        "role": "separator",
        "class": bem$z({
          dashed: props.dashed,
          hairline: props.hairline,
          [`content-${props.contentPosition}`]: !!slots.default
        })
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Divider = withInstall(stdin_default$B);
const [name$x, bem$y] = createNamespace("dropdown-menu");
const dropdownMenuProps = {
  overlay: truthProp,
  zIndex: numericProp,
  duration: makeNumericProp(0.2),
  direction: makeStringProp("down"),
  activeColor: String,
  closeOnClickOutside: truthProp,
  closeOnClickOverlay: truthProp
};
const DROPDOWN_KEY = Symbol(name$x);
var stdin_default$A = defineComponent({
  name: name$x,
  props: dropdownMenuProps,
  setup(props, {
    slots
  }) {
    const id = useId$1();
    const root = ref();
    const barRef = ref();
    const offset2 = ref(0);
    const {
      children,
      linkChildren
    } = useChildren(DROPDOWN_KEY);
    const scrollParent = useScrollParent(root);
    const opened = computed(() => children.some((item) => item.state.showWrapper));
    const barStyle = computed(() => {
      if (opened.value && isDef(props.zIndex)) {
        return {
          zIndex: +props.zIndex + 1
        };
      }
    });
    const onClickAway = () => {
      if (props.closeOnClickOutside) {
        children.forEach((item) => {
          item.toggle(false);
        });
      }
    };
    const updateOffset = () => {
      if (barRef.value) {
        const rect = useRect(barRef);
        if (props.direction === "down") {
          offset2.value = rect.bottom;
        } else {
          offset2.value = windowHeight.value - rect.top;
        }
      }
    };
    const onScroll = () => {
      if (opened.value) {
        updateOffset();
      }
    };
    const toggleItem = (active) => {
      children.forEach((item, index2) => {
        if (index2 === active) {
          updateOffset();
          item.toggle();
        } else if (item.state.showPopup) {
          item.toggle(false, {
            immediate: true
          });
        }
      });
    };
    const renderTitle = (item, index2) => {
      const {
        showPopup
      } = item.state;
      const {
        disabled,
        titleClass
      } = item;
      return createVNode("div", {
        "id": `${id}-${index2}`,
        "role": "button",
        "tabindex": disabled ? void 0 : 0,
        "class": [bem$y("item", {
          disabled
        }), {
          [HAPTICS_FEEDBACK]: !disabled
        }],
        "onClick": () => {
          if (!disabled) {
            toggleItem(index2);
          }
        }
      }, [createVNode("span", {
        "class": [bem$y("title", {
          down: showPopup === (props.direction === "down"),
          active: showPopup
        }), titleClass],
        "style": {
          color: showPopup ? props.activeColor : ""
        }
      }, [createVNode("div", {
        "class": "van-ellipsis"
      }, [item.renderTitle()])])]);
    };
    linkChildren({
      id,
      props,
      offset: offset2
    });
    useClickAway(root, onClickAway);
    useEventListener("scroll", onScroll, {
      target: scrollParent
    });
    return () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "class": bem$y()
      }, [createVNode("div", {
        "ref": barRef,
        "style": barStyle.value,
        "class": bem$y("bar", {
          opened: opened.value
        })
      }, [children.map(renderTitle)]), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const [name$w, bem$x] = createNamespace("dropdown-item");
const dropdownItemProps = {
  title: String,
  options: makeArrayProp(),
  disabled: Boolean,
  teleport: [String, Object],
  lazyRender: truthProp,
  modelValue: unknownProp,
  titleClass: unknownProp
};
var stdin_default$z = defineComponent({
  name: name$w,
  props: dropdownItemProps,
  emits: ["open", "opened", "close", "closed", "change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const state = reactive({
      showPopup: false,
      transition: true,
      showWrapper: false
    });
    const {
      parent,
      index: index2
    } = useParent(DROPDOWN_KEY);
    if (!parent) {
      return;
    }
    const getEmitter = (name2) => () => emit(name2);
    const onOpen = getEmitter("open");
    const onClose = getEmitter("close");
    const onOpened = getEmitter("opened");
    const onClosed = () => {
      state.showWrapper = false;
      emit("closed");
    };
    const onClickWrapper = (event) => {
      if (props.teleport) {
        event.stopPropagation();
      }
    };
    const toggle = (show = !state.showPopup, options = {}) => {
      if (show === state.showPopup) {
        return;
      }
      state.showPopup = show;
      state.transition = !options.immediate;
      if (show) {
        state.showWrapper = true;
      }
    };
    const renderTitle = () => {
      if (slots.title) {
        return slots.title();
      }
      if (props.title) {
        return props.title;
      }
      const match = props.options.find((option) => option.value === props.modelValue);
      return match ? match.text : "";
    };
    const renderOption = (option) => {
      const {
        activeColor
      } = parent.props;
      const active = option.value === props.modelValue;
      const onClick = () => {
        state.showPopup = false;
        if (option.value !== props.modelValue) {
          emit("update:modelValue", option.value);
          emit("change", option.value);
        }
      };
      const renderIcon = () => {
        if (active) {
          return createVNode(Icon, {
            "class": bem$x("icon"),
            "color": activeColor,
            "name": "success"
          }, null);
        }
      };
      return createVNode(Cell, {
        "role": "menuitem",
        "key": option.value,
        "icon": option.icon,
        "title": option.text,
        "class": bem$x("option", {
          active
        }),
        "style": {
          color: active ? activeColor : ""
        },
        "tabindex": active ? 0 : -1,
        "clickable": true,
        "onClick": onClick
      }, {
        value: renderIcon
      });
    };
    const renderContent = () => {
      const {
        offset: offset2
      } = parent;
      const {
        zIndex,
        overlay,
        duration,
        direction,
        closeOnClickOverlay
      } = parent.props;
      const style = getZIndexStyle(zIndex);
      if (direction === "down") {
        style.top = `${offset2.value}px`;
      } else {
        style.bottom = `${offset2.value}px`;
      }
      return withDirectives(createVNode("div", {
        "style": style,
        "class": bem$x([direction]),
        "onClick": onClickWrapper
      }, [createVNode(Popup, {
        "show": state.showPopup,
        "onUpdate:show": ($event) => state.showPopup = $event,
        "role": "menu",
        "class": bem$x("content"),
        "overlay": overlay,
        "position": direction === "down" ? "top" : "bottom",
        "duration": state.transition ? duration : 0,
        "lazyRender": props.lazyRender,
        "overlayStyle": {
          position: "absolute"
        },
        "aria-labelledby": `${parent.id}-${index2.value}`,
        "closeOnClickOverlay": closeOnClickOverlay,
        "onOpen": onOpen,
        "onClose": onClose,
        "onOpened": onOpened,
        "onClosed": onClosed
      }, {
        default: () => {
          var _a;
          return [props.options.map(renderOption), (_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      })]), [[vShow, state.showWrapper]]);
    };
    useExpose({
      state,
      toggle,
      renderTitle
    });
    return () => {
      if (props.teleport) {
        return createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: () => [renderContent()]
        });
      }
      return renderContent();
    };
  }
});
const DropdownItem = withInstall(stdin_default$z);
const DropdownMenu = withInstall(stdin_default$A);
const [name$v, bem$w] = createNamespace("grid");
const gridProps = {
  square: Boolean,
  center: truthProp,
  border: truthProp,
  gutter: numericProp,
  reverse: Boolean,
  iconSize: numericProp,
  direction: String,
  clickable: Boolean,
  columnNum: makeNumericProp(4)
};
const GRID_KEY = Symbol(name$v);
var stdin_default$y = defineComponent({
  name: name$v,
  props: gridProps,
  setup(props, {
    slots
  }) {
    const {
      linkChildren
    } = useChildren(GRID_KEY);
    linkChildren({
      props
    });
    return () => {
      var _a;
      return createVNode("div", {
        "style": {
          paddingLeft: addUnit(props.gutter)
        },
        "class": [bem$w(), {
          [BORDER_TOP]: props.border && !props.gutter
        }]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Grid = withInstall(stdin_default$y);
const [name$u, bem$v] = createNamespace("grid-item");
const gridItemProps = extend({}, routeProps, {
  dot: Boolean,
  text: String,
  icon: String,
  badge: numericProp,
  iconColor: String,
  iconPrefix: String,
  badgeProps: Object
});
var stdin_default$x = defineComponent({
  name: name$u,
  props: gridItemProps,
  setup(props, {
    slots
  }) {
    const {
      parent,
      index: index2
    } = useParent(GRID_KEY);
    const route2 = useRoute();
    if (!parent) {
      return;
    }
    const rootStyle = computed(() => {
      const {
        square,
        gutter,
        columnNum
      } = parent.props;
      const percent = `${100 / +columnNum}%`;
      const style = {
        flexBasis: percent
      };
      if (square) {
        style.paddingTop = percent;
      } else if (gutter) {
        const gutterValue = addUnit(gutter);
        style.paddingRight = gutterValue;
        if (index2.value >= columnNum) {
          style.marginTop = gutterValue;
        }
      }
      return style;
    });
    const contentStyle = computed(() => {
      const {
        square,
        gutter
      } = parent.props;
      if (square && gutter) {
        const gutterValue = addUnit(gutter);
        return {
          right: gutterValue,
          bottom: gutterValue,
          height: "auto"
        };
      }
    });
    const renderIcon = () => {
      if (slots.icon) {
        return createVNode(Badge, mergeProps({
          "dot": props.dot,
          "content": props.badge
        }, props.badgeProps), {
          default: slots.icon
        });
      }
      if (props.icon) {
        return createVNode(Icon, {
          "dot": props.dot,
          "name": props.icon,
          "size": parent.props.iconSize,
          "badge": props.badge,
          "class": bem$v("icon"),
          "color": props.iconColor,
          "badgeProps": props.badgeProps,
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    const renderText = () => {
      if (slots.text) {
        return slots.text();
      }
      if (props.text) {
        return createVNode("span", {
          "class": bem$v("text")
        }, [props.text]);
      }
    };
    const renderContent = () => {
      if (slots.default) {
        return slots.default();
      }
      return [renderIcon(), renderText()];
    };
    return () => {
      const {
        center,
        border,
        square,
        gutter,
        reverse,
        direction,
        clickable
      } = parent.props;
      const classes = [bem$v("content", [direction, {
        center,
        square,
        reverse,
        clickable,
        surround: border && gutter
      }]), {
        [BORDER]: border
      }];
      return createVNode("div", {
        "class": [bem$v({
          square
        })],
        "style": rootStyle.value
      }, [createVNode("div", {
        "role": clickable ? "button" : void 0,
        "class": classes,
        "style": contentStyle.value,
        "tabindex": clickable ? 0 : void 0,
        "onClick": route2
      }, [renderContent()])]);
    };
  }
});
const GridItem = withInstall(stdin_default$x);
const getDistance = (touches) => Math.sqrt((touches[0].clientX - touches[1].clientX) ** 2 + (touches[0].clientY - touches[1].clientY) ** 2);
const bem$u = createNamespace("image-preview")[1];
var stdin_default$w = defineComponent({
  props: {
    src: String,
    show: Boolean,
    active: Number,
    minZoom: makeRequiredProp(numericProp),
    maxZoom: makeRequiredProp(numericProp),
    rootWidth: makeRequiredProp(Number),
    rootHeight: makeRequiredProp(Number)
  },
  emits: ["scale", "close"],
  setup(props, {
    emit
  }) {
    const state = reactive({
      scale: 1,
      moveX: 0,
      moveY: 0,
      moving: false,
      zooming: false,
      imageRatio: 0,
      displayWidth: 0,
      displayHeight: 0
    });
    const touch = useTouch();
    const vertical = computed(() => {
      const {
        rootWidth,
        rootHeight
      } = props;
      const rootRatio = rootHeight / rootWidth;
      return state.imageRatio > rootRatio;
    });
    const imageStyle = computed(() => {
      const {
        scale,
        moveX,
        moveY,
        moving,
        zooming
      } = state;
      const style = {
        transitionDuration: zooming || moving ? "0s" : ".3s"
      };
      if (scale !== 1) {
        const offsetX = moveX / scale;
        const offsetY = moveY / scale;
        style.transform = `scale(${scale}, ${scale}) translate(${offsetX}px, ${offsetY}px)`;
      }
      return style;
    });
    const maxMoveX = computed(() => {
      if (state.imageRatio) {
        const {
          rootWidth,
          rootHeight
        } = props;
        const displayWidth = vertical.value ? rootHeight / state.imageRatio : rootWidth;
        return Math.max(0, (state.scale * displayWidth - rootWidth) / 2);
      }
      return 0;
    });
    const maxMoveY = computed(() => {
      if (state.imageRatio) {
        const {
          rootWidth,
          rootHeight
        } = props;
        const displayHeight = vertical.value ? rootHeight : rootWidth * state.imageRatio;
        return Math.max(0, (state.scale * displayHeight - rootHeight) / 2);
      }
      return 0;
    });
    const setScale = (scale) => {
      scale = clamp(scale, +props.minZoom, +props.maxZoom + 1);
      if (scale !== state.scale) {
        state.scale = scale;
        emit("scale", {
          scale,
          index: props.active
        });
      }
    };
    const resetScale = () => {
      setScale(1);
      state.moveX = 0;
      state.moveY = 0;
    };
    const toggleScale = () => {
      const scale = state.scale > 1 ? 1 : 2;
      setScale(scale);
      state.moveX = 0;
      state.moveY = 0;
    };
    let fingerNum;
    let startMoveX;
    let startMoveY;
    let startScale;
    let startDistance;
    let doubleTapTimer;
    let touchStartTime;
    const onTouchStart = (event) => {
      const {
        touches
      } = event;
      const {
        offsetX
      } = touch;
      touch.start(event);
      fingerNum = touches.length;
      startMoveX = state.moveX;
      startMoveY = state.moveY;
      touchStartTime = Date.now();
      state.moving = fingerNum === 1 && state.scale !== 1;
      state.zooming = fingerNum === 2 && !offsetX.value;
      if (state.zooming) {
        startScale = state.scale;
        startDistance = getDistance(event.touches);
      }
    };
    const onTouchMove = (event) => {
      const {
        touches
      } = event;
      touch.move(event);
      if (state.moving || state.zooming) {
        preventDefault(event, true);
      }
      if (state.moving) {
        const {
          deltaX,
          deltaY
        } = touch;
        const moveX = deltaX.value + startMoveX;
        const moveY = deltaY.value + startMoveY;
        state.moveX = clamp(moveX, -maxMoveX.value, maxMoveX.value);
        state.moveY = clamp(moveY, -maxMoveY.value, maxMoveY.value);
      }
      if (state.zooming && touches.length === 2) {
        const distance = getDistance(touches);
        const scale = startScale * distance / startDistance;
        setScale(scale);
      }
    };
    const checkTap = () => {
      if (fingerNum > 1) {
        return;
      }
      const {
        offsetX,
        offsetY
      } = touch;
      const deltaTime = Date.now() - touchStartTime;
      const TAP_TIME = 250;
      const TAP_OFFSET = 5;
      if (offsetX.value < TAP_OFFSET && offsetY.value < TAP_OFFSET && deltaTime < TAP_TIME) {
        if (doubleTapTimer) {
          clearTimeout(doubleTapTimer);
          doubleTapTimer = null;
          toggleScale();
        } else {
          doubleTapTimer = setTimeout(() => {
            emit("close");
            doubleTapTimer = null;
          }, TAP_TIME);
        }
      }
    };
    const onTouchEnd = (event) => {
      let stopPropagation2 = false;
      if (state.moving || state.zooming) {
        stopPropagation2 = true;
        if (state.moving && startMoveX === state.moveX && startMoveY === state.moveY) {
          stopPropagation2 = false;
        }
        if (!event.touches.length) {
          if (state.zooming) {
            state.moveX = clamp(state.moveX, -maxMoveX.value, maxMoveX.value);
            state.moveY = clamp(state.moveY, -maxMoveY.value, maxMoveY.value);
            state.zooming = false;
          }
          state.moving = false;
          startMoveX = 0;
          startMoveY = 0;
          startScale = 1;
          if (state.scale < 1) {
            resetScale();
          }
          if (state.scale > props.maxZoom) {
            state.scale = +props.maxZoom;
          }
        }
      }
      preventDefault(event, stopPropagation2);
      checkTap();
      touch.reset();
    };
    const onLoad = (event) => {
      const {
        naturalWidth,
        naturalHeight
      } = event.target;
      state.imageRatio = naturalHeight / naturalWidth;
    };
    watch(() => props.active, resetScale);
    watch(() => props.show, (value) => {
      if (!value) {
        resetScale();
      }
    });
    return () => {
      const imageSlots = {
        loading: () => createVNode(Loading, {
          "type": "spinner"
        }, null)
      };
      return createVNode(SwipeItem, {
        "class": bem$u("swipe-item"),
        "onTouchstart": onTouchStart,
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, {
        default: () => [createVNode(Image, {
          "src": props.src,
          "fit": "contain",
          "class": bem$u("image", {
            vertical: vertical.value
          }),
          "style": imageStyle.value,
          "onLoad": onLoad
        }, imageSlots)]
      });
    };
  }
});
const [name$t, bem$t] = createNamespace("image-preview");
const popupProps$1 = ["show", "transition", "overlayStyle", "closeOnPopstate"];
const imagePreviewProps = {
  show: Boolean,
  loop: truthProp,
  images: makeArrayProp(),
  minZoom: makeNumericProp(1 / 3),
  maxZoom: makeNumericProp(3),
  overlay: truthProp,
  closeable: Boolean,
  showIndex: truthProp,
  className: unknownProp,
  closeIcon: makeStringProp("clear"),
  transition: String,
  beforeClose: Function,
  overlayClass: unknownProp,
  overlayStyle: Object,
  swipeDuration: makeNumericProp(300),
  startPosition: makeNumericProp(0),
  showIndicators: Boolean,
  closeOnPopstate: truthProp,
  closeIconPosition: makeStringProp("top-right")
};
var stdin_default$v = defineComponent({
  name: name$t,
  props: imagePreviewProps,
  emits: ["scale", "close", "closed", "change", "update:show"],
  setup(props, {
    emit,
    slots
  }) {
    const swipeRef = ref();
    const state = reactive({
      active: 0,
      rootWidth: 0,
      rootHeight: 0
    });
    const resize = () => {
      if (swipeRef.value) {
        const rect = useRect(swipeRef.value.$el);
        state.rootWidth = rect.width;
        state.rootHeight = rect.height;
        swipeRef.value.resize();
      }
    };
    const emitScale = (args) => emit("scale", args);
    const updateShow = (show) => emit("update:show", show);
    const emitClose = () => {
      callInterceptor(props.beforeClose, {
        args: [state.active],
        done: () => updateShow(false)
      });
    };
    const setActive = (active) => {
      if (active !== state.active) {
        state.active = active;
        emit("change", active);
      }
    };
    const renderIndex = () => {
      if (props.showIndex) {
        return createVNode("div", {
          "class": bem$t("index")
        }, [slots.index ? slots.index({
          index: state.active
        }) : `${state.active + 1} / ${props.images.length}`]);
      }
    };
    const renderCover = () => {
      if (slots.cover) {
        return createVNode("div", {
          "class": bem$t("cover")
        }, [slots.cover()]);
      }
    };
    const renderImages = () => createVNode(Swipe, {
      "ref": swipeRef,
      "lazyRender": true,
      "loop": props.loop,
      "class": bem$t("swipe"),
      "duration": props.swipeDuration,
      "initialSwipe": props.startPosition,
      "showIndicators": props.showIndicators,
      "indicatorColor": "white",
      "onChange": setActive
    }, {
      default: () => [props.images.map((image) => createVNode(stdin_default$w, {
        "src": image,
        "show": props.show,
        "active": state.active,
        "maxZoom": props.maxZoom,
        "minZoom": props.minZoom,
        "rootWidth": state.rootWidth,
        "rootHeight": state.rootHeight,
        "onScale": emitScale,
        "onClose": emitClose
      }, null))]
    });
    const renderClose = () => {
      if (props.closeable) {
        return createVNode(Icon, {
          "role": "button",
          "name": props.closeIcon,
          "class": [bem$t("close-icon", props.closeIconPosition), HAPTICS_FEEDBACK],
          "onClick": emitClose
        }, null);
      }
    };
    const onClosed = () => emit("closed");
    const swipeTo = (index2, options) => {
      var _a;
      return (_a = swipeRef.value) == null ? void 0 : _a.swipeTo(index2, options);
    };
    useExpose({
      swipeTo
    });
    onMounted(resize);
    watch([windowWidth, windowHeight], resize);
    watch(() => props.startPosition, (value) => setActive(+value));
    watch(() => props.show, (value) => {
      const {
        images,
        startPosition
      } = props;
      if (value) {
        setActive(+startPosition);
        nextTick(() => {
          resize();
          swipeTo(+startPosition, {
            immediate: true
          });
        });
      } else {
        emit("close", {
          index: state.active,
          url: images[state.active]
        });
      }
    });
    return () => createVNode(Popup, mergeProps({
      "class": [bem$t(), props.className],
      "overlayClass": [bem$t("overlay"), props.overlayClass],
      "onClosed": onClosed,
      "onUpdate:show": updateShow
    }, pick(props, popupProps$1)), {
      default: () => [renderClose(), renderImages(), renderIndex(), renderCover()]
    });
  }
});
let instance$1;
const defaultConfig = {
  loop: true,
  images: [],
  maxZoom: 3,
  minZoom: 1 / 3,
  onScale: void 0,
  onClose: void 0,
  onChange: void 0,
  teleport: "body",
  className: "",
  showIndex: true,
  closeable: false,
  closeIcon: "clear",
  transition: void 0,
  beforeClose: void 0,
  overlayStyle: void 0,
  overlayClass: void 0,
  startPosition: 0,
  swipeDuration: 300,
  showIndicators: false,
  closeOnPopstate: true,
  closeIconPosition: "top-right"
};
function initInstance$1() {
  ({
    instance: instance$1
  } = mountComponent({
    setup() {
      const {
        state,
        toggle
      } = usePopupState();
      const onClosed = () => {
        state.images = [];
      };
      return () => createVNode(stdin_default$v, mergeProps(state, {
        "onClosed": onClosed,
        "onUpdate:show": toggle
      }), null);
    }
  }));
}
const ImagePreview = (options, startPosition = 0) => {
  if (!inBrowser$1) {
    return;
  }
  if (!instance$1) {
    initInstance$1();
  }
  options = Array.isArray(options) ? {
    images: options,
    startPosition
  } : options;
  instance$1.open(extend({}, defaultConfig, options));
  return instance$1;
};
ImagePreview.Component = withInstall(stdin_default$v);
ImagePreview.install = (app2) => {
  app2.use(ImagePreview.Component);
};
function genAlphabet() {
  const charCodeOfA = "A".charCodeAt(0);
  const indexList = Array(26).fill("").map((_, i) => String.fromCharCode(charCodeOfA + i));
  return indexList;
}
const [name$s, bem$s] = createNamespace("index-bar");
const indexBarProps = {
  sticky: truthProp,
  zIndex: numericProp,
  teleport: [String, Object],
  highlightColor: String,
  stickyOffsetTop: makeNumberProp(0),
  indexList: {
    type: Array,
    default: genAlphabet
  }
};
const INDEX_BAR_KEY = Symbol(name$s);
var stdin_default$u = defineComponent({
  name: name$s,
  props: indexBarProps,
  emits: ["select", "change"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const activeAnchor = ref("");
    const touch = useTouch();
    const scrollParent = useScrollParent(root);
    const {
      children,
      linkChildren
    } = useChildren(INDEX_BAR_KEY);
    let selectActiveIndex;
    linkChildren({
      props
    });
    const sidebarStyle = computed(() => {
      if (isDef(props.zIndex)) {
        return {
          zIndex: +props.zIndex + 1
        };
      }
    });
    const highlightStyle = computed(() => {
      if (props.highlightColor) {
        return {
          color: props.highlightColor
        };
      }
    });
    const getActiveAnchor = (scrollTop, rects) => {
      for (let i = children.length - 1; i >= 0; i--) {
        const prevHeight = i > 0 ? rects[i - 1].height : 0;
        const reachTop = props.sticky ? prevHeight + props.stickyOffsetTop : 0;
        if (scrollTop + reachTop >= rects[i].top) {
          return i;
        }
      }
      return -1;
    };
    const getMatchAnchor = (index2) => children.find((item) => String(item.index) === index2);
    const onScroll = () => {
      if (isHidden(root)) {
        return;
      }
      const {
        sticky,
        indexList
      } = props;
      const scrollTop = getScrollTop(scrollParent.value);
      const scrollParentRect = useRect(scrollParent);
      const rects = children.map((item) => item.getRect(scrollParent.value, scrollParentRect));
      let active = -1;
      if (selectActiveIndex) {
        const match = getMatchAnchor(selectActiveIndex);
        if (match) {
          const rect = match.getRect(scrollParent.value, scrollParentRect);
          active = getActiveAnchor(rect.top, rects);
        }
      } else {
        active = getActiveAnchor(scrollTop, rects);
      }
      activeAnchor.value = indexList[active];
      if (sticky) {
        children.forEach((item, index2) => {
          const {
            state,
            $el
          } = item;
          if (index2 === active || index2 === active - 1) {
            const rect = $el.getBoundingClientRect();
            state.left = rect.left;
            state.width = rect.width;
          } else {
            state.left = null;
            state.width = null;
          }
          if (index2 === active) {
            state.active = true;
            state.top = Math.max(props.stickyOffsetTop, rects[index2].top - scrollTop) + scrollParentRect.top;
          } else if (index2 === active - 1 && selectActiveIndex === "") {
            const activeItemTop = rects[active].top - scrollTop;
            state.active = activeItemTop > 0;
            state.top = activeItemTop + scrollParentRect.top - rects[index2].height;
          } else {
            state.active = false;
          }
        });
      }
      selectActiveIndex = "";
    };
    const init = () => {
      nextTick(onScroll);
    };
    useEventListener("scroll", onScroll, {
      target: scrollParent
    });
    onMounted(init);
    watch(() => props.indexList, init);
    watch(activeAnchor, (value) => {
      if (value) {
        emit("change", value);
      }
    });
    const renderIndexes = () => props.indexList.map((index2) => {
      const active = index2 === activeAnchor.value;
      return createVNode("span", {
        "class": bem$s("index", {
          active
        }),
        "style": active ? highlightStyle.value : void 0,
        "data-index": index2
      }, [index2]);
    });
    const scrollTo = (index2) => {
      selectActiveIndex = String(index2);
      const match = getMatchAnchor(selectActiveIndex);
      if (match) {
        const scrollTop = getScrollTop(scrollParent.value);
        const scrollParentRect = useRect(scrollParent);
        const {
          offsetHeight
        } = document.documentElement;
        if (scrollTop === offsetHeight - scrollParentRect.height) {
          onScroll();
          return;
        }
        match.$el.scrollIntoView();
        if (props.sticky && props.stickyOffsetTop) {
          setRootScrollTop(getRootScrollTop() - props.stickyOffsetTop);
        }
        emit("select", match.index);
      }
    };
    const scrollToElement = (element) => {
      const {
        index: index2
      } = element.dataset;
      if (index2) {
        scrollTo(index2);
      }
    };
    const onClickSidebar = (event) => {
      scrollToElement(event.target);
    };
    let touchActiveIndex;
    const onTouchMove = (event) => {
      touch.move(event);
      if (touch.isVertical()) {
        preventDefault(event);
        const {
          clientX,
          clientY
        } = event.touches[0];
        const target = document.elementFromPoint(clientX, clientY);
        if (target) {
          const {
            index: index2
          } = target.dataset;
          if (index2 && touchActiveIndex !== index2) {
            touchActiveIndex = index2;
            scrollToElement(target);
          }
        }
      }
    };
    const renderSidebar = () => createVNode("div", {
      "class": bem$s("sidebar"),
      "style": sidebarStyle.value,
      "onClick": onClickSidebar,
      "onTouchstart": touch.start,
      "onTouchmove": onTouchMove
    }, [renderIndexes()]);
    useExpose({
      scrollTo
    });
    return () => {
      var _a;
      return createVNode("div", {
        "ref": root,
        "class": bem$s()
      }, [props.teleport ? createVNode(Teleport, {
        "to": props.teleport
      }, {
        default: () => [renderSidebar()]
      }) : renderSidebar(), (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const [name$r, bem$r] = createNamespace("index-anchor");
const indexAnchorProps = {
  index: numericProp
};
var stdin_default$t = defineComponent({
  name: name$r,
  props: indexAnchorProps,
  setup(props, {
    slots
  }) {
    const state = reactive({
      top: 0,
      left: null,
      rect: {
        top: 0,
        height: 0
      },
      width: null,
      active: false
    });
    const root = ref();
    const {
      parent
    } = useParent(INDEX_BAR_KEY);
    if (!parent) {
      return;
    }
    const isSticky = () => state.active && parent.props.sticky;
    const anchorStyle = computed(() => {
      const {
        zIndex,
        highlightColor
      } = parent.props;
      if (isSticky()) {
        return extend(getZIndexStyle(zIndex), {
          left: state.left ? `${state.left}px` : void 0,
          width: state.width ? `${state.width}px` : void 0,
          transform: state.top ? `translate3d(0, ${state.top}px, 0)` : void 0,
          color: highlightColor
        });
      }
    });
    const getRect = (scrollParent, scrollParentRect) => {
      const rootRect = useRect(root);
      state.rect.height = rootRect.height;
      if (scrollParent === window || scrollParent === document.body) {
        state.rect.top = rootRect.top + getRootScrollTop();
      } else {
        state.rect.top = rootRect.top + getScrollTop(scrollParent) - scrollParentRect.top;
      }
      return state.rect;
    };
    useExpose({
      state,
      getRect
    });
    return () => {
      const sticky = isSticky();
      return createVNode("div", {
        "ref": root,
        "style": {
          height: sticky ? `${state.rect.height}px` : void 0
        }
      }, [createVNode("div", {
        "style": anchorStyle.value,
        "class": [bem$r({
          sticky
        }), {
          [BORDER_BOTTOM]: sticky
        }]
      }, [slots.default ? slots.default() : props.index])]);
    };
  }
});
const IndexAnchor = withInstall(stdin_default$t);
const IndexBar = withInstall(stdin_default$u);
const [name$q, bem$q, t$6] = createNamespace("list");
const listProps = {
  error: Boolean,
  offset: makeNumericProp(300),
  loading: Boolean,
  finished: Boolean,
  errorText: String,
  direction: makeStringProp("down"),
  loadingText: String,
  finishedText: String,
  immediateCheck: truthProp
};
var stdin_default$s = defineComponent({
  name: name$q,
  props: listProps,
  emits: ["load", "update:error", "update:loading"],
  setup(props, {
    emit,
    slots
  }) {
    const loading = ref(false);
    const root = ref();
    const placeholder = ref();
    const tabStatus = useTabStatus();
    const scrollParent = useScrollParent(root);
    const check = () => {
      nextTick(() => {
        if (loading.value || props.finished || props.error || (tabStatus == null ? void 0 : tabStatus.value) === false) {
          return;
        }
        const {
          offset: offset2,
          direction
        } = props;
        const scrollParentRect = useRect(scrollParent);
        if (!scrollParentRect.height || isHidden(root)) {
          return;
        }
        let isReachEdge = false;
        const placeholderRect = useRect(placeholder);
        if (direction === "up") {
          isReachEdge = scrollParentRect.top - placeholderRect.top <= offset2;
        } else {
          isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset2;
        }
        if (isReachEdge) {
          loading.value = true;
          emit("update:loading", true);
          emit("load");
        }
      });
    };
    const renderFinishedText = () => {
      if (props.finished) {
        const text = slots.finished ? slots.finished() : props.finishedText;
        if (text) {
          return createVNode("div", {
            "class": bem$q("finished-text")
          }, [text]);
        }
      }
    };
    const clickErrorText = () => {
      emit("update:error", false);
      check();
    };
    const renderErrorText = () => {
      if (props.error) {
        const text = slots.error ? slots.error() : props.errorText;
        if (text) {
          return createVNode("div", {
            "role": "button",
            "class": bem$q("error-text"),
            "tabindex": 0,
            "onClick": clickErrorText
          }, [text]);
        }
      }
    };
    const renderLoading = () => {
      if (loading.value && !props.finished) {
        return createVNode("div", {
          "class": bem$q("loading")
        }, [slots.loading ? slots.loading() : createVNode(Loading, {
          "class": bem$q("loading-icon")
        }, {
          default: () => [props.loadingText || t$6("loading")]
        })]);
      }
    };
    watch(() => [props.loading, props.finished, props.error], check);
    if (tabStatus) {
      watch(tabStatus, (tabActive) => {
        if (tabActive) {
          check();
        }
      });
    }
    onUpdated(() => {
      loading.value = props.loading;
    });
    onMounted(() => {
      if (props.immediateCheck) {
        check();
      }
    });
    useExpose({
      check
    });
    useEventListener("scroll", check, {
      target: scrollParent
    });
    return () => {
      var _a;
      const Content = (_a = slots.default) == null ? void 0 : _a.call(slots);
      const Placeholder = createVNode("div", {
        "ref": placeholder,
        "class": bem$q("placeholder")
      }, null);
      return createVNode("div", {
        "ref": root,
        "role": "feed",
        "class": bem$q(),
        "aria-busy": loading.value
      }, [props.direction === "down" ? Content : Placeholder, renderLoading(), renderFinishedText(), renderErrorText(), props.direction === "up" ? Content : Placeholder]);
    };
  }
});
const List = withInstall(stdin_default$s);
const [name$p, bem$p] = createNamespace("nav-bar");
const navBarProps = {
  title: String,
  fixed: Boolean,
  zIndex: numericProp,
  border: truthProp,
  leftText: String,
  rightText: String,
  leftArrow: Boolean,
  placeholder: Boolean,
  safeAreaInsetTop: Boolean
};
var stdin_default$r = defineComponent({
  name: name$p,
  props: navBarProps,
  emits: ["click-left", "click-right"],
  setup(props, {
    emit,
    slots
  }) {
    const navBarRef = ref();
    const renderPlaceholder = usePlaceholder(navBarRef, bem$p);
    const onClickLeft = (event) => emit("click-left", event);
    const onClickRight = (event) => emit("click-right", event);
    const renderLeft = () => {
      if (slots.left) {
        return slots.left();
      }
      return [props.leftArrow && createVNode(Icon, {
        "class": bem$p("arrow"),
        "name": "arrow-left"
      }, null), props.leftText && createVNode("span", {
        "class": bem$p("text")
      }, [props.leftText])];
    };
    const renderRight = () => {
      if (slots.right) {
        return slots.right();
      }
      return createVNode("span", {
        "class": bem$p("text")
      }, [props.rightText]);
    };
    const renderNavBar = () => {
      const {
        title,
        fixed,
        border,
        zIndex
      } = props;
      const style = getZIndexStyle(zIndex);
      const hasLeft = props.leftArrow || props.leftText || slots.left;
      const hasRight = props.rightText || slots.right;
      return createVNode("div", {
        "ref": navBarRef,
        "style": style,
        "class": [bem$p({
          fixed
        }), {
          [BORDER_BOTTOM]: border,
          "van-safe-area-top": props.safeAreaInsetTop
        }]
      }, [createVNode("div", {
        "class": bem$p("content")
      }, [hasLeft && createVNode("div", {
        "class": [bem$p("left"), HAPTICS_FEEDBACK],
        "onClick": onClickLeft
      }, [renderLeft()]), createVNode("div", {
        "class": [bem$p("title"), "van-ellipsis"]
      }, [slots.title ? slots.title() : title]), hasRight && createVNode("div", {
        "class": [bem$p("right"), HAPTICS_FEEDBACK],
        "onClick": onClickRight
      }, [renderRight()])])]);
    };
    return () => {
      if (props.fixed && props.placeholder) {
        return renderPlaceholder(renderNavBar);
      }
      return renderNavBar();
    };
  }
});
const NavBar = withInstall(stdin_default$r);
const [name$o, bem$o] = createNamespace("notice-bar");
const noticeBarProps = {
  text: String,
  mode: String,
  color: String,
  delay: makeNumericProp(1),
  speed: makeNumericProp(60),
  leftIcon: String,
  wrapable: Boolean,
  background: String,
  scrollable: {
    type: Boolean,
    default: null
  }
};
var stdin_default$q = defineComponent({
  name: name$o,
  props: noticeBarProps,
  emits: ["close", "replay"],
  setup(props, {
    emit,
    slots
  }) {
    let wrapWidth = 0;
    let contentWidth = 0;
    let startTimer;
    const wrapRef = ref();
    const contentRef = ref();
    const state = reactive({
      show: true,
      offset: 0,
      duration: 0
    });
    const renderLeftIcon = () => {
      if (slots["left-icon"]) {
        return slots["left-icon"]();
      }
      if (props.leftIcon) {
        return createVNode(Icon, {
          "class": bem$o("left-icon"),
          "name": props.leftIcon
        }, null);
      }
    };
    const getRightIconName = () => {
      if (props.mode === "closeable") {
        return "cross";
      }
      if (props.mode === "link") {
        return "arrow";
      }
    };
    const onClickRightIcon = (event) => {
      if (props.mode === "closeable") {
        state.show = false;
        emit("close", event);
      }
    };
    const renderRightIcon = () => {
      if (slots["right-icon"]) {
        return slots["right-icon"]();
      }
      const name2 = getRightIconName();
      if (name2) {
        return createVNode(Icon, {
          "name": name2,
          "class": bem$o("right-icon"),
          "onClick": onClickRightIcon
        }, null);
      }
    };
    const onTransitionEnd = () => {
      state.offset = wrapWidth;
      state.duration = 0;
      raf(() => {
        doubleRaf(() => {
          state.offset = -contentWidth;
          state.duration = (contentWidth + wrapWidth) / +props.speed;
          emit("replay");
        });
      });
    };
    const renderMarquee = () => {
      const ellipsis = props.scrollable === false && !props.wrapable;
      const style = {
        transform: state.offset ? `translateX(${state.offset}px)` : "",
        transitionDuration: `${state.duration}s`
      };
      return createVNode("div", {
        "ref": wrapRef,
        "role": "marquee",
        "class": bem$o("wrap")
      }, [createVNode("div", {
        "ref": contentRef,
        "style": style,
        "class": [bem$o("content"), {
          "van-ellipsis": ellipsis
        }],
        "onTransitionend": onTransitionEnd
      }, [slots.default ? slots.default() : props.text])]);
    };
    const reset2 = () => {
      const {
        delay,
        speed,
        scrollable
      } = props;
      const ms = isDef(delay) ? +delay * 1e3 : 0;
      wrapWidth = 0;
      contentWidth = 0;
      state.offset = 0;
      state.duration = 0;
      clearTimeout(startTimer);
      startTimer = setTimeout(() => {
        if (!wrapRef.value || !contentRef.value || scrollable === false) {
          return;
        }
        const wrapRefWidth = useRect(wrapRef).width;
        const contentRefWidth = useRect(contentRef).width;
        if (scrollable || contentRefWidth > wrapRefWidth) {
          doubleRaf(() => {
            wrapWidth = wrapRefWidth;
            contentWidth = contentRefWidth;
            state.offset = -contentWidth;
            state.duration = contentWidth / +speed;
          });
        }
      }, ms);
    };
    onPopupReopen(reset2);
    onMountedOrActivated(reset2);
    useEventListener("pageshow", reset2);
    useExpose({
      reset: reset2
    });
    watch(() => [props.text, props.scrollable], reset2);
    return () => {
      const {
        color,
        wrapable,
        background
      } = props;
      return withDirectives(createVNode("div", {
        "role": "alert",
        "class": bem$o({
          wrapable
        }),
        "style": {
          color,
          background
        }
      }, [renderLeftIcon(), renderMarquee(), renderRightIcon()]), [[vShow, state.show]]);
    };
  }
});
const NoticeBar = withInstall(stdin_default$q);
const [name$n, bem$n] = createNamespace("notify");
const notifyProps = extend({}, popupSharedProps, {
  type: makeStringProp("danger"),
  color: String,
  message: numericProp,
  position: makeStringProp("top"),
  className: unknownProp,
  background: String,
  lockScroll: Boolean
});
var stdin_default$p = defineComponent({
  name: name$n,
  props: notifyProps,
  emits: ["update:show"],
  setup(props, {
    emit,
    slots
  }) {
    const updateShow = (show) => emit("update:show", show);
    return () => createVNode(Popup, {
      "show": props.show,
      "class": [bem$n([props.type]), props.className],
      "style": {
        color: props.color,
        background: props.background
      },
      "overlay": false,
      "position": props.position,
      "duration": 0.2,
      "lockScroll": props.lockScroll,
      "onUpdate:show": updateShow
    }, {
      default: () => [slots.default ? slots.default() : props.message]
    });
  }
});
let timer;
let instance;
const parseOptions = (message) => isObject(message) ? message : {
  message
};
function initInstance() {
  ({
    instance
  } = mountComponent({
    setup() {
      const {
        state,
        toggle
      } = usePopupState();
      return () => createVNode(stdin_default$p, mergeProps(state, {
        "onUpdate:show": toggle
      }), null);
    }
  }));
}
function Notify(options) {
  if (!inBrowser$1) {
    return;
  }
  if (!instance) {
    initInstance();
  }
  options = extend({}, Notify.currentOptions, parseOptions(options));
  instance.open(options);
  clearTimeout(timer);
  if (options.duration > 0) {
    timer = window.setTimeout(Notify.clear, options.duration);
  }
  return instance;
}
const getDefaultOptions = () => ({
  type: "danger",
  color: void 0,
  message: "",
  onClose: void 0,
  onClick: void 0,
  onOpened: void 0,
  duration: 3e3,
  position: void 0,
  className: "",
  lockScroll: false,
  background: void 0
});
Notify.clear = () => {
  if (instance) {
    instance.toggle(false);
  }
};
Notify.currentOptions = getDefaultOptions();
Notify.setDefaultOptions = (options) => {
  extend(Notify.currentOptions, options);
};
Notify.resetDefaultOptions = () => {
  Notify.currentOptions = getDefaultOptions();
};
Notify.Component = withInstall(stdin_default$p);
Notify.install = (app2) => {
  app2.use(Notify.Component);
  app2.config.globalProperties.$notify = Notify;
};
const [name$m, bem$m] = createNamespace("key");
const CollapseIcon = createVNode("svg", {
  "class": bem$m("collapse-icon"),
  "viewBox": "0 0 30 24"
}, [createVNode("path", {
  "d": "M26 13h-2v2h2v-2zm-8-3h2V8h-2v2zm2-4h2V4h-2v2zm2 4h4V4h-2v4h-2v2zm-7 14 3-3h-6l3 3zM6 13H4v2h2v-2zm16 0H8v2h14v-2zm-12-3h2V8h-2v2zM28 0l1 1 1 1v15l-1 2H1l-1-2V2l1-1 1-1zm0 2H2v15h26V2zM6 4v2H4V4zm10 2h2V4h-2v2zM8 9v1H4V8zm8 0v1h-2V8zm-6-5v2H8V4zm4 0v2h-2V4z",
  "fill": "currentColor"
}, null)]);
const DeleteIcon = createVNode("svg", {
  "class": bem$m("delete-icon"),
  "viewBox": "0 0 32 22"
}, [createVNode("path", {
  "d": "M28 0a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H10.4a2 2 0 0 1-1.4-.6L1 13.1c-.6-.5-.9-1.3-.9-2 0-1 .3-1.7.9-2.2L9 .6a2 2 0 0 1 1.4-.6zm0 2H10.4l-8.2 8.3a1 1 0 0 0-.3.7c0 .3.1.5.3.7l8.2 8.4H28a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2zm-5 4a1 1 0 0 1 .7.3 1 1 0 0 1 0 1.4L20.4 11l3.3 3.3c.2.2.3.5.3.7 0 .3-.1.5-.3.7a1 1 0 0 1-.7.3 1 1 0 0 1-.7-.3L19 12.4l-3.4 3.3a1 1 0 0 1-.6.3 1 1 0 0 1-.7-.3 1 1 0 0 1-.3-.7c0-.2.1-.5.3-.7l3.3-3.3-3.3-3.3A1 1 0 0 1 14 7c0-.3.1-.5.3-.7A1 1 0 0 1 15 6a1 1 0 0 1 .6.3L19 9.6l3.3-3.3A1 1 0 0 1 23 6z",
  "fill": "currentColor"
}, null)]);
var stdin_default$o = defineComponent({
  name: name$m,
  props: {
    type: String,
    text: numericProp,
    color: String,
    wider: Boolean,
    large: Boolean,
    loading: Boolean
  },
  emits: ["press"],
  setup(props, {
    emit,
    slots
  }) {
    const active = ref(false);
    const touch = useTouch();
    const onTouchStart = (event) => {
      touch.start(event);
      active.value = true;
    };
    const onTouchMove = (event) => {
      touch.move(event);
      if (touch.direction.value) {
        active.value = false;
      }
    };
    const onTouchEnd = (event) => {
      if (active.value) {
        if (!slots.default) {
          preventDefault(event);
        }
        active.value = false;
        emit("press", props.text, props.type);
      }
    };
    const renderContent = () => {
      if (props.loading) {
        return createVNode(Loading, {
          "class": bem$m("loading-icon")
        }, null);
      }
      const text = slots.default ? slots.default() : props.text;
      switch (props.type) {
        case "delete":
          return text || DeleteIcon;
        case "extra":
          return text || CollapseIcon;
        default:
          return text;
      }
    };
    return () => createVNode("div", {
      "class": bem$m("wrapper", {
        wider: props.wider
      }),
      "onTouchstart": onTouchStart,
      "onTouchmove": onTouchMove,
      "onTouchend": onTouchEnd,
      "onTouchcancel": onTouchEnd
    }, [createVNode("div", {
      "role": "button",
      "tabindex": 0,
      "class": bem$m([props.color, {
        large: props.large,
        active: active.value,
        delete: props.type === "delete"
      }])
    }, [renderContent()])]);
  }
});
const [name$l, bem$l] = createNamespace("number-keyboard");
const numberKeyboardProps = {
  show: Boolean,
  title: String,
  theme: makeStringProp("default"),
  zIndex: numericProp,
  teleport: [String, Object],
  maxlength: makeNumericProp(Infinity),
  modelValue: makeStringProp(""),
  transition: truthProp,
  blurOnClose: truthProp,
  showDeleteKey: truthProp,
  randomKeyOrder: Boolean,
  closeButtonText: String,
  deleteButtonText: String,
  closeButtonLoading: Boolean,
  hideOnClickOutside: truthProp,
  safeAreaInsetBottom: truthProp,
  extraKey: {
    type: [String, Array],
    default: ""
  }
};
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
var stdin_default$n = defineComponent({
  name: name$l,
  props: numberKeyboardProps,
  emits: ["show", "hide", "blur", "input", "close", "delete", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const genBasicKeys = () => {
      const keys2 = Array(9).fill("").map((_, i) => ({
        text: i + 1
      }));
      if (props.randomKeyOrder) {
        shuffle(keys2);
      }
      return keys2;
    };
    const genDefaultKeys = () => [...genBasicKeys(), {
      text: props.extraKey,
      type: "extra"
    }, {
      text: 0
    }, {
      text: props.showDeleteKey ? props.deleteButtonText : "",
      type: props.showDeleteKey ? "delete" : ""
    }];
    const genCustomKeys = () => {
      const keys2 = genBasicKeys();
      const {
        extraKey
      } = props;
      const extraKeys = Array.isArray(extraKey) ? extraKey : [extraKey];
      if (extraKeys.length === 1) {
        keys2.push({
          text: 0,
          wider: true
        }, {
          text: extraKeys[0],
          type: "extra"
        });
      } else if (extraKeys.length === 2) {
        keys2.push({
          text: extraKeys[0],
          type: "extra"
        }, {
          text: 0
        }, {
          text: extraKeys[1],
          type: "extra"
        });
      }
      return keys2;
    };
    const keys = computed(() => props.theme === "custom" ? genCustomKeys() : genDefaultKeys());
    const onBlur = () => {
      if (props.show) {
        emit("blur");
      }
    };
    const onClose = () => {
      emit("close");
      if (props.blurOnClose) {
        onBlur();
      }
    };
    const onAnimationEnd = () => emit(props.show ? "show" : "hide");
    const onPress = (text, type) => {
      if (text === "") {
        if (type === "extra") {
          onBlur();
        }
        return;
      }
      const value = props.modelValue;
      if (type === "delete") {
        emit("delete");
        emit("update:modelValue", value.slice(0, value.length - 1));
      } else if (type === "close") {
        onClose();
      } else if (value.length < props.maxlength) {
        emit("input", text);
        emit("update:modelValue", value + text);
      }
    };
    const renderTitle = () => {
      const {
        title,
        theme,
        closeButtonText
      } = props;
      const leftSlot = slots["title-left"];
      const showClose = closeButtonText && theme === "default";
      const showTitle = title || showClose || leftSlot;
      if (!showTitle) {
        return;
      }
      return createVNode("div", {
        "class": bem$l("header")
      }, [leftSlot && createVNode("span", {
        "class": bem$l("title-left")
      }, [leftSlot()]), title && createVNode("h2", {
        "class": bem$l("title")
      }, [title]), showClose && createVNode("button", {
        "type": "button",
        "class": [bem$l("close"), HAPTICS_FEEDBACK],
        "onClick": onClose
      }, [closeButtonText])]);
    };
    const renderKeys = () => keys.value.map((key) => {
      const keySlots = {};
      if (key.type === "delete") {
        keySlots.default = slots.delete;
      }
      if (key.type === "extra") {
        keySlots.default = slots["extra-key"];
      }
      return createVNode(stdin_default$o, {
        "key": key.text,
        "text": key.text,
        "type": key.type,
        "wider": key.wider,
        "color": key.color,
        "onPress": onPress
      }, keySlots);
    });
    const renderSidebar = () => {
      if (props.theme === "custom") {
        return createVNode("div", {
          "class": bem$l("sidebar")
        }, [props.showDeleteKey && createVNode(stdin_default$o, {
          "large": true,
          "text": props.deleteButtonText,
          "type": "delete",
          "onPress": onPress
        }, {
          delete: slots.delete
        }), createVNode(stdin_default$o, {
          "large": true,
          "text": props.closeButtonText,
          "type": "close",
          "color": "blue",
          "loading": props.closeButtonLoading,
          "onPress": onPress
        }, null)]);
      }
    };
    watch(() => props.show, (value) => {
      if (!props.transition) {
        emit(value ? "show" : "hide");
      }
    });
    if (props.hideOnClickOutside) {
      useClickAway(root, onBlur, {
        eventName: "touchstart"
      });
    }
    return () => {
      const Title = renderTitle();
      const Content = createVNode(Transition, {
        "name": props.transition ? "van-slide-up" : ""
      }, {
        default: () => [withDirectives(createVNode("div", {
          "ref": root,
          "style": getZIndexStyle(props.zIndex),
          "class": bem$l({
            unfit: !props.safeAreaInsetBottom,
            "with-title": !!Title
          }),
          "onTouchstart": stopPropagation,
          "onAnimationend": onAnimationEnd,
          "onWebkitAnimationEnd": onAnimationEnd
        }, [Title, createVNode("div", {
          "class": bem$l("body")
        }, [createVNode("div", {
          "class": bem$l("keys")
        }, [renderKeys()]), renderSidebar()])]), [[vShow, props.show]])]
      });
      if (props.teleport) {
        return createVNode(Teleport, {
          "to": props.teleport
        }, {
          default: () => [Content]
        });
      }
      return Content;
    };
  }
});
const NumberKeyboard = withInstall(stdin_default$n);
const [name$k, bem$k, t$5] = createNamespace("pagination");
const makePage = (number, text, active) => ({
  number,
  text,
  active
});
const paginationProps = {
  mode: makeStringProp("multi"),
  prevText: String,
  nextText: String,
  pageCount: makeNumericProp(0),
  modelValue: makeNumberProp(0),
  totalItems: makeNumericProp(0),
  showPageSize: makeNumericProp(5),
  itemsPerPage: makeNumericProp(10),
  forceEllipses: Boolean
};
var stdin_default$m = defineComponent({
  name: name$k,
  props: paginationProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const count = computed(() => {
      const {
        pageCount,
        totalItems,
        itemsPerPage
      } = props;
      const count2 = +pageCount || Math.ceil(+totalItems / +itemsPerPage);
      return Math.max(1, count2);
    });
    const pages2 = computed(() => {
      const items = [];
      const pageCount = count.value;
      const showPageSize = +props.showPageSize;
      const {
        modelValue,
        forceEllipses
      } = props;
      let startPage = 1;
      let endPage = pageCount;
      const isMaxSized = showPageSize < pageCount;
      if (isMaxSized) {
        startPage = Math.max(modelValue - Math.floor(showPageSize / 2), 1);
        endPage = startPage + showPageSize - 1;
        if (endPage > pageCount) {
          endPage = pageCount;
          startPage = endPage - showPageSize + 1;
        }
      }
      for (let number = startPage; number <= endPage; number++) {
        const page = makePage(number, number, number === modelValue);
        items.push(page);
      }
      if (isMaxSized && showPageSize > 0 && forceEllipses) {
        if (startPage > 1) {
          const prevPages = makePage(startPage - 1, "...");
          items.unshift(prevPages);
        }
        if (endPage < pageCount) {
          const nextPages = makePage(endPage + 1, "...");
          items.push(nextPages);
        }
      }
      return items;
    });
    const updateModelValue = (value, emitChange) => {
      value = clamp(value, 1, count.value);
      if (props.modelValue !== value) {
        emit("update:modelValue", value);
        if (emitChange) {
          emit("change", value);
        }
      }
    };
    watchEffect(() => updateModelValue(props.modelValue));
    const renderDesc = () => createVNode("li", {
      "class": bem$k("page-desc")
    }, [slots.pageDesc ? slots.pageDesc() : `${props.modelValue}/${count.value}`]);
    const renderPrevButton = () => {
      const {
        mode,
        modelValue
      } = props;
      const slot = slots["prev-text"];
      const disabled = modelValue === 1;
      return createVNode("li", {
        "class": [bem$k("item", {
          disabled,
          border: mode === "simple",
          prev: true
        }), BORDER_SURROUND]
      }, [createVNode("button", {
        "type": "button",
        "disabled": disabled,
        "onClick": () => updateModelValue(modelValue - 1, true)
      }, [slot ? slot() : props.prevText || t$5("prev")])]);
    };
    const renderNextButton = () => {
      const {
        mode,
        modelValue
      } = props;
      const slot = slots["next-text"];
      const disabled = modelValue === count.value;
      return createVNode("li", {
        "class": [bem$k("item", {
          disabled,
          border: mode === "simple",
          next: true
        }), BORDER_SURROUND]
      }, [createVNode("button", {
        "type": "button",
        "disabled": disabled,
        "onClick": () => updateModelValue(modelValue + 1, true)
      }, [slot ? slot() : props.nextText || t$5("next")])]);
    };
    const renderPages = () => pages2.value.map((page) => createVNode("li", {
      "class": [bem$k("item", {
        active: page.active,
        page: true
      }), BORDER_SURROUND]
    }, [createVNode("button", {
      "type": "button",
      "aria-current": page.active || void 0,
      "onClick": () => updateModelValue(page.number, true)
    }, [slots.page ? slots.page(page) : page.text])]));
    return () => createVNode("nav", {
      "role": "navigation",
      "class": bem$k()
    }, [createVNode("ul", {
      "class": bem$k("items")
    }, [renderPrevButton(), props.mode === "simple" ? renderDesc() : renderPages(), renderNextButton()])]);
  }
});
const Pagination = withInstall(stdin_default$m);
const [name$j, bem$j] = createNamespace("password-input");
const passwordInputProps = {
  info: String,
  mask: truthProp,
  value: makeStringProp(""),
  gutter: numericProp,
  length: makeNumericProp(6),
  focused: Boolean,
  errorInfo: String
};
var stdin_default$l = defineComponent({
  name: name$j,
  props: passwordInputProps,
  emits: ["focus"],
  setup(props, {
    emit
  }) {
    const onTouchStart = (event) => {
      event.stopPropagation();
      emit("focus", event);
    };
    const renderPoints = () => {
      const Points = [];
      const {
        mask,
        value,
        length,
        gutter,
        focused
      } = props;
      for (let i = 0; i < length; i++) {
        const char = value[i];
        const showBorder = i !== 0 && !gutter;
        const showCursor = focused && i === value.length;
        let style;
        if (i !== 0 && gutter) {
          style = {
            marginLeft: addUnit(gutter)
          };
        }
        Points.push(createVNode("li", {
          "class": [{
            [BORDER_LEFT]: showBorder
          }, bem$j("item", {
            focus: showCursor
          })],
          "style": style
        }, [mask ? createVNode("i", {
          "style": {
            visibility: char ? "visible" : "hidden"
          }
        }, null) : char, showCursor && createVNode("div", {
          "class": bem$j("cursor")
        }, null)]));
      }
      return Points;
    };
    return () => {
      const info = props.errorInfo || props.info;
      return createVNode("div", {
        "class": bem$j()
      }, [createVNode("ul", {
        "class": [bem$j("security"), {
          [BORDER_SURROUND]: !props.gutter
        }],
        "onTouchstart": onTouchStart
      }, [renderPoints()]), info && createVNode("div", {
        "class": bem$j(props.errorInfo ? "error-info" : "info")
      }, [info])]);
    };
  }
});
const PasswordInput = withInstall(stdin_default$l);
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }
  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY
  };
}
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width2 = element.offsetWidth;
  var height2 = element.offsetHeight;
  if (Math.abs(clientRect.width - width2) <= 1) {
    width2 = clientRect.width;
  }
  if (Math.abs(clientRect.height - height2) <= 1) {
    height2 = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width2,
    height: height2
  };
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve2) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve2(fn2());
        });
      });
    }
    return pending;
  };
}
function format(str) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return [].concat(args).reduce(function(p2, c) {
    return p2.replace(/%s/, c);
  }, str);
}
var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
var VALID_PROPERTIES = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
function validateModifiers(modifiers) {
  modifiers.forEach(function(modifier) {
    [].concat(Object.keys(modifier), VALID_PROPERTIES).filter(function(value, index2, self2) {
      return self2.indexOf(value) === index2;
    }).forEach(function(key) {
      switch (key) {
        case "name":
          if (typeof modifier.name !== "string") {
            console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', '"' + String(modifier.name) + '"'));
          }
          break;
        case "enabled":
          if (typeof modifier.enabled !== "boolean") {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', '"' + String(modifier.enabled) + '"'));
          }
          break;
        case "phase":
          if (modifierPhases.indexOf(modifier.phase) < 0) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(", "), '"' + String(modifier.phase) + '"'));
          }
          break;
        case "fn":
          if (typeof modifier.fn !== "function") {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', '"' + String(modifier.fn) + '"'));
          }
          break;
        case "effect":
          if (modifier.effect != null && typeof modifier.effect !== "function") {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', '"' + String(modifier.fn) + '"'));
          }
          break;
        case "requires":
          if (modifier.requires != null && !Array.isArray(modifier.requires)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', '"' + String(modifier.requires) + '"'));
          }
          break;
        case "requiresIfExists":
          if (!Array.isArray(modifier.requiresIfExists)) {
            console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', '"' + String(modifier.requiresIfExists) + '"'));
          }
          break;
        case "options":
        case "data":
          break;
        default:
          console.error('PopperJS: an invalid property has been provided to the "' + modifier.name + '" modifier, valid properties are ' + VALID_PROPERTIES.map(function(s) {
            return '"' + s + '"';
          }).join(", ") + '; but "' + key + '" was provided.');
      }
      modifier.requires && modifier.requires.forEach(function(requirement) {
        if (modifiers.find(function(mod) {
          return mod.name === requirement;
        }) == null) {
          console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
        }
      });
    });
  });
}
function uniqueBy(arr, fn2) {
  var identifiers = /* @__PURE__ */ new Set();
  return arr.filter(function(item) {
    var identifier = fn2(item);
    if (!identifiers.has(identifier)) {
      identifiers.add(identifier);
      return true;
    }
  });
}
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current2) {
    var existing = merged2[current2.name];
    merged2[current2.name] = existing ? Object.assign({}, existing, current2, {
      options: Object.assign({}, existing.options, current2.options),
      data: Object.assign({}, existing.data, current2.data)
    }) : current2;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
function getVariation(placement) {
  return placement.split("-")[1];
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function computeOffsets(_ref) {
  var reference = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.";
var INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.";
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions2;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
      modifiersData: {},
      elements: {
        reference,
        popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance2 = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions2, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
          popper: listScrollParents(popper)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        {
          var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function(_ref) {
            var name2 = _ref.name;
            return name2;
          });
          validateModifiers(modifiers);
          if (getBasePlacement(state.options.placement) === auto) {
            var flipModifier = state.orderedModifiers.find(function(_ref2) {
              var name2 = _ref2.name;
              return name2 === "flip";
            });
            if (!flipModifier) {
              console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
            }
          }
          var _getComputedStyle = getComputedStyle(popper), marginTop = _getComputedStyle.marginTop, marginRight = _getComputedStyle.marginRight, marginBottom = _getComputedStyle.marginBottom, marginLeft = _getComputedStyle.marginLeft;
          if ([marginTop, marginRight, marginBottom, marginLeft].some(function(margin) {
            return parseFloat(margin);
          })) {
            console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
          }
        }
        runModifierEffects();
        return instance2.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference2 = _state$elements.reference, popper2 = _state$elements.popper;
        if (!areValidElements(reference2, popper2)) {
          {
            console.error(INVALID_ELEMENT_ERROR);
          }
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference2, getOffsetParent(popper2), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper2)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        var __debug_loops__ = 0;
        for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
          {
            __debug_loops__ += 1;
            if (__debug_loops__ > 100) {
              console.error(INFINITE_LOOP_ERROR);
              break;
            }
          }
          if (state.reset === true) {
            state.reset = false;
            index2 = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name2 = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name: name2,
              instance: instance2
            }) || state;
          }
        }
      },
      update: debounce(function() {
        return new Promise(function(resolve2) {
          instance2.forceUpdate();
          resolve2(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference, popper)) {
      {
        console.error(INVALID_ELEMENT_ERROR);
      }
      return instance2;
    }
    instance2.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name2 = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect3 = _ref3.effect;
        if (typeof effect3 === "function") {
          var cleanupFn = effect3({
            state,
            name: name2,
            instance: instance2,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance2;
  };
}
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance2 = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance2.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance2.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance2.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance2.update, passive);
    }
  };
}
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
function popperOffsets(_ref) {
  var state = _ref.state, name2 = _ref.name;
  state.modifiersData[name2] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper)) {
      offsetParent = getDocumentElement(popper);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  {
    var transitionProperty = getComputedStyle(state.elements.popper).transitionProperty || "";
    if (adaptive && ["transform", "top", "right", "bottom", "left"].some(function(property) {
      return transitionProperty.indexOf(property) >= 0;
    })) {
      console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', "\n\n", 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", "\n\n", "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
    }
  }
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name2) {
    var style = state.styles[name2] || {};
    var attributes = state.attributes[name2] || {};
    var element = state.elements[name2];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name22) {
      var value = attributes[name22];
      if (value === false) {
        element.removeAttribute(name22);
      } else {
        element.setAttribute(name22, value === true ? "" : value);
      }
    });
  });
}
function effect2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name2) {
      var element = state.elements[name2];
      var attributes = state.attributes[name2] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name2) ? state.styles[name2] : initialStyles[name2]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect2,
  requires: ["computeStyles"]
};
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name2 = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name2] = data;
}
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
const [name$i, bem$i] = createNamespace("popover");
const popupProps = ["show", "overlay", "duration", "teleport", "overlayStyle", "overlayClass", "closeOnClickOverlay"];
const popoverProps = {
  show: Boolean,
  theme: makeStringProp("light"),
  overlay: Boolean,
  actions: makeArrayProp(),
  trigger: makeStringProp("click"),
  duration: numericProp,
  showArrow: truthProp,
  placement: makeStringProp("bottom"),
  iconPrefix: String,
  overlayClass: unknownProp,
  overlayStyle: Object,
  closeOnClickAction: truthProp,
  closeOnClickOverlay: truthProp,
  closeOnClickOutside: truthProp,
  offset: {
    type: Array,
    default: () => [0, 8]
  },
  teleport: {
    type: [String, Object],
    default: "body"
  }
};
var stdin_default$k = defineComponent({
  name: name$i,
  props: popoverProps,
  emits: ["select", "touchstart", "update:show"],
  setup(props, {
    emit,
    slots,
    attrs
  }) {
    let popper;
    const wrapperRef = ref();
    const popoverRef = ref();
    const createPopperInstance = () => {
      if (wrapperRef.value && popoverRef.value) {
        return createPopper(wrapperRef.value, popoverRef.value.popupRef.value, {
          placement: props.placement,
          modifiers: [{
            name: "computeStyles",
            options: {
              adaptive: false,
              gpuAcceleration: false
            }
          }, extend({}, offset_default, {
            options: {
              offset: props.offset
            }
          })]
        });
      }
      return null;
    };
    const updateLocation = () => {
      nextTick(() => {
        if (!props.show) {
          return;
        }
        if (!popper) {
          popper = createPopperInstance();
        } else {
          popper.setOptions({
            placement: props.placement
          });
        }
      });
    };
    const updateShow = (value) => emit("update:show", value);
    const onClickWrapper = () => {
      if (props.trigger === "click") {
        updateShow(!props.show);
      }
    };
    const onTouchstart = (event) => {
      event.stopPropagation();
      emit("touchstart", event);
    };
    const onClickAction = (action, index2) => {
      if (action.disabled) {
        return;
      }
      emit("select", action, index2);
      if (props.closeOnClickAction) {
        updateShow(false);
      }
    };
    const onClickAway = () => {
      if (props.closeOnClickOutside && (!props.overlay || props.closeOnClickOverlay)) {
        updateShow(false);
      }
    };
    const renderActionContent = (action, index2) => {
      if (slots.action) {
        return slots.action({
          action,
          index: index2
        });
      }
      return [action.icon && createVNode(Icon, {
        "name": action.icon,
        "classPrefix": props.iconPrefix,
        "class": bem$i("action-icon")
      }, null), createVNode("div", {
        "class": [bem$i("action-text"), BORDER_BOTTOM]
      }, [action.text])];
    };
    const renderAction = (action, index2) => {
      const {
        icon,
        color,
        disabled,
        className
      } = action;
      return createVNode("div", {
        "role": "menuitem",
        "class": [bem$i("action", {
          disabled,
          "with-icon": icon
        }), className],
        "style": {
          color
        },
        "tabindex": disabled ? void 0 : 0,
        "aria-disabled": disabled || void 0,
        "onClick": () => onClickAction(action, index2)
      }, [renderActionContent(action, index2)]);
    };
    onMounted(updateLocation);
    onBeforeUnmount(() => {
      if (popper) {
        popper.destroy();
        popper = null;
      }
    });
    watch(() => [props.show, props.placement], updateLocation);
    useClickAway(wrapperRef, onClickAway, {
      eventName: "touchstart"
    });
    return () => {
      var _a;
      return createVNode(Fragment, null, [createVNode("span", {
        "ref": wrapperRef,
        "class": bem$i("wrapper"),
        "onClick": onClickWrapper
      }, [(_a = slots.reference) == null ? void 0 : _a.call(slots)]), createVNode(Popup, mergeProps({
        "ref": popoverRef,
        "class": bem$i([props.theme]),
        "position": "",
        "transition": "van-popover-zoom",
        "lockScroll": false,
        "onTouchstart": onTouchstart,
        "onUpdate:show": updateShow
      }, attrs, pick(props, popupProps)), {
        default: () => [props.showArrow && createVNode("div", {
          "class": bem$i("arrow")
        }, null), createVNode("div", {
          "role": "menu",
          "class": bem$i("content")
        }, [slots.default ? slots.default() : props.actions.map(renderAction)])]
      })]);
    };
  }
});
const Popover = withInstall(stdin_default$k);
const [name$h, bem$h] = createNamespace("progress");
const progressProps = {
  color: String,
  inactive: Boolean,
  pivotText: String,
  textColor: String,
  showPivot: truthProp,
  pivotColor: String,
  trackColor: String,
  strokeWidth: numericProp,
  percentage: {
    type: numericProp,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  }
};
var stdin_default$j = defineComponent({
  name: name$h,
  props: progressProps,
  setup(props) {
    const background = computed(() => props.inactive ? void 0 : props.color);
    const renderPivot = () => {
      const {
        textColor,
        pivotText,
        pivotColor,
        percentage
      } = props;
      const text = pivotText != null ? pivotText : `${percentage}%`;
      if (props.showPivot && text) {
        const style = {
          color: textColor,
          left: `${+percentage}%`,
          transform: `translate(-${+percentage}%,-50%)`,
          background: pivotColor || background.value
        };
        return createVNode("span", {
          "style": style,
          "class": bem$h("pivot", {
            inactive: props.inactive
          })
        }, [text]);
      }
    };
    return () => {
      const {
        trackColor,
        percentage,
        strokeWidth
      } = props;
      const rootStyle = {
        background: trackColor,
        height: addUnit(strokeWidth)
      };
      const portionStyle = {
        width: `${percentage}%`,
        background: background.value
      };
      return createVNode("div", {
        "class": bem$h(),
        "style": rootStyle
      }, [createVNode("span", {
        "class": bem$h("portion", {
          inactive: props.inactive
        }),
        "style": portionStyle
      }, null), renderPivot()]);
    };
  }
});
const Progress = withInstall(stdin_default$j);
const [name$g, bem$g, t$4] = createNamespace("pull-refresh");
const DEFAULT_HEAD_HEIGHT = 50;
const TEXT_STATUS = ["pulling", "loosing", "success"];
const pullRefreshProps = {
  disabled: Boolean,
  modelValue: Boolean,
  headHeight: makeNumericProp(DEFAULT_HEAD_HEIGHT),
  successText: String,
  pullingText: String,
  loosingText: String,
  loadingText: String,
  pullDistance: numericProp,
  successDuration: makeNumericProp(500),
  animationDuration: makeNumericProp(300)
};
var stdin_default$i = defineComponent({
  name: name$g,
  props: pullRefreshProps,
  emits: ["change", "refresh", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    let reachTop;
    const root = ref();
    const scrollParent = useScrollParent(root);
    const state = reactive({
      status: "normal",
      distance: 0,
      duration: 0
    });
    const touch = useTouch();
    const getHeadStyle = () => {
      if (props.headHeight !== DEFAULT_HEAD_HEIGHT) {
        return {
          height: `${props.headHeight}px`
        };
      }
    };
    const isTouchable = () => state.status !== "loading" && state.status !== "success" && !props.disabled;
    const ease = (distance) => {
      const pullDistance = +(props.pullDistance || props.headHeight);
      if (distance > pullDistance) {
        if (distance < pullDistance * 2) {
          distance = pullDistance + (distance - pullDistance) / 2;
        } else {
          distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4;
        }
      }
      return Math.round(distance);
    };
    const setStatus = (distance, isLoading) => {
      const pullDistance = +(props.pullDistance || props.headHeight);
      state.distance = distance;
      if (isLoading) {
        state.status = "loading";
      } else if (distance === 0) {
        state.status = "normal";
      } else if (distance < pullDistance) {
        state.status = "pulling";
      } else {
        state.status = "loosing";
      }
      emit("change", {
        status: state.status,
        distance
      });
    };
    const getStatusText = () => {
      const {
        status
      } = state;
      if (status === "normal") {
        return "";
      }
      return props[`${status}Text`] || t$4(status);
    };
    const renderStatus = () => {
      const {
        status,
        distance
      } = state;
      if (slots[status]) {
        return slots[status]({
          distance
        });
      }
      const nodes = [];
      if (TEXT_STATUS.includes(status)) {
        nodes.push(createVNode("div", {
          "class": bem$g("text")
        }, [getStatusText()]));
      }
      if (status === "loading") {
        nodes.push(createVNode(Loading, {
          "class": bem$g("loading")
        }, {
          default: getStatusText
        }));
      }
      return nodes;
    };
    const showSuccessTip = () => {
      state.status = "success";
      setTimeout(() => {
        setStatus(0);
      }, +props.successDuration);
    };
    const checkPosition = (event) => {
      reachTop = getScrollTop(scrollParent.value) === 0;
      if (reachTop) {
        state.duration = 0;
        touch.start(event);
      }
    };
    const onTouchStart = (event) => {
      if (isTouchable()) {
        checkPosition(event);
      }
    };
    const onTouchMove = (event) => {
      if (isTouchable()) {
        if (!reachTop) {
          checkPosition(event);
        }
        const {
          deltaY
        } = touch;
        touch.move(event);
        if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
          preventDefault(event);
          setStatus(ease(deltaY.value));
        }
      }
    };
    const onTouchEnd = () => {
      if (reachTop && touch.deltaY.value && isTouchable()) {
        state.duration = +props.animationDuration;
        if (state.status === "loosing") {
          setStatus(+props.headHeight, true);
          emit("update:modelValue", true);
          nextTick(() => emit("refresh"));
        } else {
          setStatus(0);
        }
      }
    };
    watch(() => props.modelValue, (value) => {
      state.duration = +props.animationDuration;
      if (value) {
        setStatus(+props.headHeight, true);
      } else if (slots.success || props.successText) {
        showSuccessTip();
      } else {
        setStatus(0, false);
      }
    });
    return () => {
      var _a;
      const trackStyle = {
        transitionDuration: `${state.duration}ms`,
        transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : ""
      };
      return createVNode("div", {
        "ref": root,
        "class": bem$g()
      }, [createVNode("div", {
        "class": bem$g("track"),
        "style": trackStyle,
        "onTouchstart": onTouchStart,
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [createVNode("div", {
        "class": bem$g("head"),
        "style": getHeadStyle()
      }, [renderStatus()]), (_a = slots.default) == null ? void 0 : _a.call(slots)])]);
    };
  }
});
const PullRefresh = withInstall(stdin_default$i);
const [name$f, bem$f] = createNamespace("rate");
function getRateStatus(value, index2, allowHalf, readonly2) {
  if (value >= index2) {
    return {
      status: "full",
      value: 1
    };
  }
  if (value + 0.5 >= index2 && allowHalf && !readonly2) {
    return {
      status: "half",
      value: 0.5
    };
  }
  if (value + 1 >= index2 && allowHalf && readonly2) {
    const cardinal = 10 ** 10;
    return {
      status: "half",
      value: Math.round((value - index2 + 1) * cardinal) / cardinal
    };
  }
  return {
    status: "void",
    value: 0
  };
}
const rateProps = {
  size: numericProp,
  icon: makeStringProp("star"),
  color: String,
  count: makeNumericProp(5),
  gutter: numericProp,
  readonly: Boolean,
  disabled: Boolean,
  voidIcon: makeStringProp("star-o"),
  allowHalf: Boolean,
  voidColor: String,
  touchable: truthProp,
  iconPrefix: String,
  modelValue: makeNumberProp(0),
  disabledColor: String
};
var stdin_default$h = defineComponent({
  name: name$f,
  props: rateProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit
  }) {
    const touch = useTouch();
    const [itemRefs, setItemRefs] = useRefs();
    const groupRef = ref();
    const untouchable = () => props.readonly || props.disabled || !props.touchable;
    const list = computed(() => Array(+props.count).fill("").map((_, i) => getRateStatus(props.modelValue, i + 1, props.allowHalf, props.readonly)));
    let ranges;
    let groupRefRect;
    let minRectTop = Number.MAX_SAFE_INTEGER;
    let maxRectTop = Number.MIN_SAFE_INTEGER;
    const updateRanges = () => {
      groupRefRect = useRect(groupRef);
      const rects = itemRefs.value.map(useRect);
      ranges = [];
      rects.forEach((rect, index2) => {
        minRectTop = Math.min(rect.top, minRectTop);
        maxRectTop = Math.max(rect.top, maxRectTop);
        if (props.allowHalf) {
          ranges.push({
            score: index2 + 0.5,
            left: rect.left,
            top: rect.top,
            height: rect.height
          }, {
            score: index2 + 1,
            left: rect.left + rect.width / 2,
            top: rect.top,
            height: rect.height
          });
        } else {
          ranges.push({
            score: index2 + 1,
            left: rect.left,
            top: rect.top,
            height: rect.height
          });
        }
      });
    };
    const getScoreByPosition = (x, y) => {
      for (let i = ranges.length - 1; i > 0; i--) {
        if (y >= groupRefRect.top && y <= groupRefRect.bottom) {
          if (x > ranges[i].left && y >= ranges[i].top && y <= ranges[i].top + ranges[i].height) {
            return ranges[i].score;
          }
        } else {
          const curTop = y < groupRefRect.top ? minRectTop : maxRectTop;
          if (x > ranges[i].left && ranges[i].top === curTop) {
            return ranges[i].score;
          }
        }
      }
      return props.allowHalf ? 0.5 : 1;
    };
    const select = (index2) => {
      if (!props.disabled && !props.readonly && index2 !== props.modelValue) {
        emit("update:modelValue", index2);
        emit("change", index2);
      }
    };
    const onTouchStart = (event) => {
      if (untouchable()) {
        return;
      }
      touch.start(event);
      updateRanges();
    };
    const onTouchMove = (event) => {
      if (untouchable()) {
        return;
      }
      touch.move(event);
      if (touch.isHorizontal()) {
        const {
          clientX,
          clientY
        } = event.touches[0];
        preventDefault(event);
        select(getScoreByPosition(clientX, clientY));
      }
    };
    const renderStar = (item, index2) => {
      const {
        icon,
        size: size2,
        color,
        count,
        gutter,
        voidIcon,
        disabled,
        voidColor,
        allowHalf,
        iconPrefix,
        disabledColor
      } = props;
      const score = index2 + 1;
      const isFull = item.status === "full";
      const isVoid = item.status === "void";
      const renderHalf = allowHalf && item.value > 0 && item.value < 1;
      let style;
      if (gutter && score !== +count) {
        style = {
          paddingRight: addUnit(gutter)
        };
      }
      const onClickItem = (event) => {
        updateRanges();
        select(allowHalf ? getScoreByPosition(event.clientX, event.clientY) : score);
      };
      return createVNode("div", {
        "key": index2,
        "ref": setItemRefs(index2),
        "role": "radio",
        "style": style,
        "class": bem$f("item"),
        "tabindex": disabled ? void 0 : 0,
        "aria-setsize": count,
        "aria-posinset": score,
        "aria-checked": !isVoid,
        "onClick": onClickItem
      }, [createVNode(Icon, {
        "size": size2,
        "name": isFull ? icon : voidIcon,
        "class": bem$f("icon", {
          disabled,
          full: isFull
        }),
        "color": disabled ? disabledColor : isFull ? color : voidColor,
        "classPrefix": iconPrefix
      }, null), renderHalf && createVNode(Icon, {
        "size": size2,
        "style": {
          width: item.value + "em"
        },
        "name": isVoid ? voidIcon : icon,
        "class": bem$f("icon", ["half", {
          disabled,
          full: !isVoid
        }]),
        "color": disabled ? disabledColor : isVoid ? voidColor : color,
        "classPrefix": iconPrefix
      }, null)]);
    };
    useCustomFieldValue(() => props.modelValue);
    return () => createVNode("div", {
      "ref": groupRef,
      "role": "radiogroup",
      "class": bem$f({
        readonly: props.readonly,
        disabled: props.disabled
      }),
      "tabindex": props.disabled ? void 0 : 0,
      "aria-disabled": props.disabled,
      "aria-readonly": props.readonly,
      "onTouchstart": onTouchStart,
      "onTouchmove": onTouchMove
    }, [list.value.map(renderStar)]);
  }
});
const Rate = withInstall(stdin_default$h);
const Row = withInstall(stdin_default$R);
const [name$e, bem$e, t$3] = createNamespace("search");
const searchProps = extend({}, fieldSharedProps, {
  label: String,
  shape: makeStringProp("square"),
  leftIcon: makeStringProp("search"),
  clearable: truthProp,
  actionText: String,
  background: String,
  showAction: Boolean
});
var stdin_default$g = defineComponent({
  name: name$e,
  props: searchProps,
  emits: ["blur", "focus", "clear", "search", "cancel", "click-input", "click-left-icon", "click-right-icon", "update:modelValue"],
  setup(props, {
    emit,
    slots,
    attrs
  }) {
    const id = useId$1();
    const filedRef = ref();
    const onCancel = () => {
      if (!slots.action) {
        emit("update:modelValue", "");
        emit("cancel");
      }
    };
    const onKeypress = (event) => {
      const ENTER_CODE = 13;
      if (event.keyCode === ENTER_CODE) {
        preventDefault(event);
        emit("search", props.modelValue);
      }
    };
    const getInputId = () => props.id || `${id}-input`;
    const renderLabel = () => {
      if (slots.label || props.label) {
        return createVNode("label", {
          "class": bem$e("label"),
          "for": getInputId()
        }, [slots.label ? slots.label() : props.label]);
      }
    };
    const renderAction = () => {
      if (props.showAction) {
        const text = props.actionText || t$3("cancel");
        return createVNode("div", {
          "class": bem$e("action"),
          "role": "button",
          "tabindex": 0,
          "onClick": onCancel
        }, [slots.action ? slots.action() : text]);
      }
    };
    const blur = () => {
      var _a;
      return (_a = filedRef.value) == null ? void 0 : _a.blur();
    };
    const focus = () => {
      var _a;
      return (_a = filedRef.value) == null ? void 0 : _a.focus();
    };
    const onBlur = (event) => emit("blur", event);
    const onFocus = (event) => emit("focus", event);
    const onClear = (event) => emit("clear", event);
    const onClickInput = (event) => emit("click-input", event);
    const onClickLeftIcon = (event) => emit("click-left-icon", event);
    const onClickRightIcon = (event) => emit("click-right-icon", event);
    const fieldPropNames = Object.keys(fieldSharedProps);
    const renderField = () => {
      const fieldAttrs = extend({}, attrs, pick(props, fieldPropNames), {
        id: getInputId()
      });
      const onInput = (value) => emit("update:modelValue", value);
      return createVNode(Field, mergeProps({
        "ref": filedRef,
        "type": "search",
        "class": bem$e("field"),
        "border": false,
        "onBlur": onBlur,
        "onFocus": onFocus,
        "onClear": onClear,
        "onKeypress": onKeypress,
        "onClick-input": onClickInput,
        "onClick-left-icon": onClickLeftIcon,
        "onClick-right-icon": onClickRightIcon,
        "onUpdate:modelValue": onInput
      }, fieldAttrs), pick(slots, ["left-icon", "right-icon"]));
    };
    useExpose({
      focus,
      blur
    });
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$e({
          "show-action": props.showAction
        }),
        "style": {
          background: props.background
        }
      }, [(_a = slots.left) == null ? void 0 : _a.call(slots), createVNode("div", {
        "class": bem$e("content", props.shape)
      }, [renderLabel(), renderField()]), renderAction()]);
    };
  }
});
const Search = withInstall(stdin_default$g);
const popupInheritKeys = [...popupSharedPropKeys, "round", "closeOnPopstate", "safeAreaInsetBottom"];
const iconMap = {
  qq: "qq",
  link: "link-o",
  weibo: "weibo",
  qrcode: "qr",
  poster: "photo-o",
  wechat: "wechat",
  "weapp-qrcode": "miniprogram-o",
  "wechat-moments": "wechat-moments"
};
const [name$d, bem$d, t$2] = createNamespace("share-sheet");
const shareSheetProps = extend({}, popupSharedProps, {
  title: String,
  round: truthProp,
  options: makeArrayProp(),
  cancelText: String,
  description: String,
  closeOnPopstate: truthProp,
  safeAreaInsetBottom: truthProp
});
var stdin_default$f = defineComponent({
  name: name$d,
  props: shareSheetProps,
  emits: ["cancel", "select", "update:show"],
  setup(props, {
    emit,
    slots
  }) {
    const updateShow = (value) => emit("update:show", value);
    const onCancel = () => {
      updateShow(false);
      emit("cancel");
    };
    const onSelect = (option, index2) => emit("select", option, index2);
    const renderHeader = () => {
      const title = slots.title ? slots.title() : props.title;
      const description = slots.description ? slots.description() : props.description;
      if (title || description) {
        return createVNode("div", {
          "class": bem$d("header")
        }, [title && createVNode("h2", {
          "class": bem$d("title")
        }, [title]), description && createVNode("span", {
          "class": bem$d("description")
        }, [description])]);
      }
    };
    const renderIcon = (icon) => {
      if (iconMap[icon]) {
        return createVNode("div", {
          "class": bem$d("icon", [icon])
        }, [createVNode(Icon, {
          "name": iconMap[icon] || icon
        }, null)]);
      }
      return createVNode("img", {
        "src": icon,
        "class": bem$d("image-icon")
      }, null);
    };
    const renderOption = (option, index2) => {
      const {
        name: name2,
        icon,
        className,
        description
      } = option;
      return createVNode("div", {
        "role": "button",
        "tabindex": 0,
        "class": [bem$d("option"), className, HAPTICS_FEEDBACK],
        "onClick": () => onSelect(option, index2)
      }, [renderIcon(icon), name2 && createVNode("span", {
        "class": bem$d("name")
      }, [name2]), description && createVNode("span", {
        "class": bem$d("option-description")
      }, [description])]);
    };
    const renderOptions = (options, border) => createVNode("div", {
      "class": bem$d("options", {
        border
      })
    }, [options.map(renderOption)]);
    const renderRows = () => {
      const {
        options
      } = props;
      if (Array.isArray(options[0])) {
        return options.map((item, index2) => renderOptions(item, index2 !== 0));
      }
      return renderOptions(options);
    };
    const renderCancelButton = () => {
      var _a;
      const cancelText = (_a = props.cancelText) != null ? _a : t$2("cancel");
      if (slots.cancel || cancelText) {
        return createVNode("button", {
          "type": "button",
          "class": bem$d("cancel"),
          "onClick": onCancel
        }, [slots.cancel ? slots.cancel() : cancelText]);
      }
    };
    return () => createVNode(Popup, mergeProps({
      "class": bem$d(),
      "position": "bottom",
      "onUpdate:show": updateShow
    }, pick(props, popupInheritKeys)), {
      default: () => [renderHeader(), renderRows(), renderCancelButton()]
    });
  }
});
const ShareSheet = withInstall(stdin_default$f);
const [name$c, bem$c] = createNamespace("sidebar");
const SIDEBAR_KEY = Symbol(name$c);
const sidebarProps = {
  modelValue: makeNumericProp(0)
};
var stdin_default$e = defineComponent({
  name: name$c,
  props: sidebarProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      linkChildren
    } = useChildren(SIDEBAR_KEY);
    const getActive = () => +props.modelValue;
    const setActive = (value) => {
      if (value !== getActive()) {
        emit("update:modelValue", value);
        emit("change", value);
      }
    };
    linkChildren({
      getActive,
      setActive
    });
    return () => {
      var _a;
      return createVNode("div", {
        "role": "tablist",
        "class": bem$c()
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
const Sidebar = withInstall(stdin_default$e);
const [name$b, bem$b] = createNamespace("sidebar-item");
const sidebarItemProps = extend({}, routeProps, {
  dot: Boolean,
  title: String,
  badge: numericProp,
  disabled: Boolean,
  badgeProps: Object
});
var stdin_default$d = defineComponent({
  name: name$b,
  props: sidebarItemProps,
  emits: ["click"],
  setup(props, {
    emit,
    slots
  }) {
    const route2 = useRoute();
    const {
      parent,
      index: index2
    } = useParent(SIDEBAR_KEY);
    if (!parent) {
      return;
    }
    const onClick = () => {
      if (props.disabled) {
        return;
      }
      emit("click", index2.value);
      parent.setActive(index2.value);
      route2();
    };
    return () => {
      const {
        dot,
        badge,
        title,
        disabled
      } = props;
      const selected = index2.value === parent.getActive();
      return createVNode("div", {
        "role": "tab",
        "class": bem$b({
          select: selected,
          disabled
        }),
        "tabindex": disabled ? void 0 : 0,
        "aria-selected": selected,
        "onClick": onClick
      }, [createVNode(Badge, mergeProps({
        "dot": dot,
        "class": bem$b("text"),
        "content": badge
      }, props.badgeProps), {
        default: () => [slots.title ? slots.title() : title]
      })]);
    };
  }
});
const SidebarItem = withInstall(stdin_default$d);
const [name$a, bem$a] = createNamespace("skeleton");
const DEFAULT_ROW_WIDTH = "100%";
const DEFAULT_LAST_ROW_WIDTH = "60%";
const skeletonProps = {
  row: makeNumericProp(0),
  title: Boolean,
  round: Boolean,
  avatar: Boolean,
  loading: truthProp,
  animate: truthProp,
  avatarSize: numericProp,
  titleWidth: numericProp,
  avatarShape: makeStringProp("round"),
  rowWidth: {
    type: [Number, String, Array],
    default: DEFAULT_ROW_WIDTH
  }
};
var stdin_default$c = defineComponent({
  name: name$a,
  inheritAttrs: false,
  props: skeletonProps,
  setup(props, {
    slots,
    attrs
  }) {
    const renderAvatar = () => {
      if (props.avatar) {
        return createVNode("div", {
          "class": bem$a("avatar", props.avatarShape),
          "style": getSizeStyle(props.avatarSize)
        }, null);
      }
    };
    const renderTitle = () => {
      if (props.title) {
        return createVNode("h3", {
          "class": bem$a("title"),
          "style": {
            width: addUnit(props.titleWidth)
          }
        }, null);
      }
    };
    const getRowWidth = (index2) => {
      const {
        rowWidth
      } = props;
      if (rowWidth === DEFAULT_ROW_WIDTH && index2 === +props.row - 1) {
        return DEFAULT_LAST_ROW_WIDTH;
      }
      if (Array.isArray(rowWidth)) {
        return rowWidth[index2];
      }
      return rowWidth;
    };
    const renderRows = () => Array(+props.row).fill("").map((_, i) => createVNode("div", {
      "class": bem$a("row"),
      "style": {
        width: addUnit(getRowWidth(i))
      }
    }, null));
    return () => {
      var _a;
      if (!props.loading) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      return createVNode("div", mergeProps({
        "class": bem$a({
          animate: props.animate,
          round: props.round
        })
      }, attrs), [renderAvatar(), createVNode("div", {
        "class": bem$a("content")
      }, [renderTitle(), renderRows()])]);
    };
  }
});
const Skeleton = withInstall(stdin_default$c);
const [name$9, bem$9] = createNamespace("slider");
const sliderProps = {
  min: makeNumericProp(0),
  max: makeNumericProp(100),
  step: makeNumericProp(1),
  range: Boolean,
  reverse: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  vertical: Boolean,
  barHeight: numericProp,
  buttonSize: numericProp,
  activeColor: String,
  inactiveColor: String,
  modelValue: {
    type: [Number, Array],
    default: 0
  }
};
var stdin_default$b = defineComponent({
  name: name$9,
  props: sliderProps,
  emits: ["change", "drag-end", "drag-start", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    let buttonIndex;
    let current2;
    let startValue;
    const root = ref();
    const dragStatus = ref();
    const touch = useTouch();
    const scope = computed(() => Number(props.max) - Number(props.min));
    const wrapperStyle = computed(() => {
      const crossAxis = props.vertical ? "width" : "height";
      return {
        background: props.inactiveColor,
        [crossAxis]: addUnit(props.barHeight)
      };
    });
    const isRange = (val) => props.range && Array.isArray(val);
    const calcMainAxis = () => {
      const {
        modelValue,
        min
      } = props;
      if (isRange(modelValue)) {
        return `${(modelValue[1] - modelValue[0]) * 100 / scope.value}%`;
      }
      return `${(modelValue - Number(min)) * 100 / scope.value}%`;
    };
    const calcOffset = () => {
      const {
        modelValue,
        min
      } = props;
      if (isRange(modelValue)) {
        return `${(modelValue[0] - Number(min)) * 100 / scope.value}%`;
      }
      return "0%";
    };
    const barStyle = computed(() => {
      const mainAxis = props.vertical ? "height" : "width";
      const style = {
        [mainAxis]: calcMainAxis(),
        background: props.activeColor
      };
      if (dragStatus.value) {
        style.transition = "none";
      }
      const getPositionKey = () => {
        if (props.vertical) {
          return props.reverse ? "bottom" : "top";
        }
        return props.reverse ? "right" : "left";
      };
      style[getPositionKey()] = calcOffset();
      return style;
    });
    const format2 = (value) => {
      const min = +props.min;
      const max = +props.max;
      const step = +props.step;
      value = clamp(value, min, max);
      const diff = Math.round((value - min) / step) * step;
      return addNumber(min, diff);
    };
    const isSameValue = (newValue, oldValue) => JSON.stringify(newValue) === JSON.stringify(oldValue);
    const handleRangeValue = (value) => {
      var _a, _b;
      const left2 = (_a = value[0]) != null ? _a : Number(props.min);
      const right2 = (_b = value[1]) != null ? _b : Number(props.max);
      return left2 > right2 ? [right2, left2] : [left2, right2];
    };
    const updateValue = (value, end2) => {
      if (isRange(value)) {
        value = handleRangeValue(value).map(format2);
      } else {
        value = format2(value);
      }
      if (!isSameValue(value, props.modelValue)) {
        emit("update:modelValue", value);
      }
      if (end2 && !isSameValue(value, startValue)) {
        emit("change", value);
      }
    };
    const onClick = (event) => {
      event.stopPropagation();
      if (props.disabled || props.readonly) {
        return;
      }
      const {
        min,
        reverse,
        vertical,
        modelValue
      } = props;
      const rect = useRect(root);
      const getDelta = () => {
        if (vertical) {
          if (reverse) {
            return rect.bottom - event.clientY;
          }
          return event.clientY - rect.top;
        }
        if (reverse) {
          return rect.right - event.clientX;
        }
        return event.clientX - rect.left;
      };
      const total = vertical ? rect.height : rect.width;
      const value = Number(min) + getDelta() / total * scope.value;
      if (isRange(modelValue)) {
        const [left2, right2] = modelValue;
        const middle = (left2 + right2) / 2;
        if (value <= middle) {
          updateValue([value, right2], true);
        } else {
          updateValue([left2, value], true);
        }
      } else {
        updateValue(value, true);
      }
    };
    const onTouchStart = (event) => {
      if (props.disabled || props.readonly) {
        return;
      }
      touch.start(event);
      current2 = props.modelValue;
      if (isRange(current2)) {
        startValue = current2.map(format2);
      } else {
        startValue = format2(current2);
      }
      dragStatus.value = "start";
    };
    const onTouchMove = (event) => {
      if (props.disabled || props.readonly) {
        return;
      }
      if (dragStatus.value === "start") {
        emit("drag-start", event);
      }
      preventDefault(event, true);
      touch.move(event);
      dragStatus.value = "dragging";
      const rect = useRect(root);
      const delta = props.vertical ? touch.deltaY.value : touch.deltaX.value;
      const total = props.vertical ? rect.height : rect.width;
      let diff = delta / total * scope.value;
      if (props.reverse) {
        diff = -diff;
      }
      if (isRange(startValue)) {
        const index2 = props.reverse ? 1 - buttonIndex : buttonIndex;
        current2[index2] = startValue[index2] + diff;
      } else {
        current2 = startValue + diff;
      }
      updateValue(current2);
    };
    const onTouchEnd = (event) => {
      if (props.disabled || props.readonly) {
        return;
      }
      if (dragStatus.value === "dragging") {
        updateValue(current2, true);
        emit("drag-end", event);
      }
      dragStatus.value = "";
    };
    const getButtonClassName = (index2) => {
      if (typeof index2 === "number") {
        const position = ["left", "right"];
        return bem$9(`button-wrapper`, position[index2]);
      }
      return bem$9("button-wrapper", props.reverse ? "left" : "right");
    };
    const renderButtonContent = (value, index2) => {
      if (typeof index2 === "number") {
        const slot = slots[index2 === 0 ? "left-button" : "right-button"];
        if (slot) {
          return slot({
            value
          });
        }
      }
      if (slots.button) {
        return slots.button({
          value
        });
      }
      return createVNode("div", {
        "class": bem$9("button"),
        "style": getSizeStyle(props.buttonSize)
      }, null);
    };
    const renderButton = (index2) => {
      const current22 = typeof index2 === "number" ? props.modelValue[index2] : props.modelValue;
      return createVNode("div", {
        "role": "slider",
        "class": getButtonClassName(index2),
        "tabindex": props.disabled ? void 0 : 0,
        "aria-valuemin": props.min,
        "aria-valuenow": current22,
        "aria-valuemax": props.max,
        "aria-disabled": props.disabled || void 0,
        "aria-readonly": props.readonly || void 0,
        "aria-orientation": props.vertical ? "vertical" : "horizontal",
        "onTouchstart": (event) => {
          if (typeof index2 === "number") {
            buttonIndex = index2;
          }
          onTouchStart(event);
        },
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd,
        "onClick": stopPropagation
      }, [renderButtonContent(current22, index2)]);
    };
    updateValue(props.modelValue);
    useCustomFieldValue(() => props.modelValue);
    return () => createVNode("div", {
      "ref": root,
      "style": wrapperStyle.value,
      "class": bem$9({
        vertical: props.vertical,
        disabled: props.disabled
      }),
      "onClick": onClick
    }, [createVNode("div", {
      "class": bem$9("bar"),
      "style": barStyle.value
    }, [props.range ? [renderButton(0), renderButton(1)] : renderButton()])]);
  }
});
const Slider = withInstall(stdin_default$b);
const [name$8, bem$8] = createNamespace("steps");
const stepsProps = {
  active: makeNumericProp(0),
  direction: makeStringProp("horizontal"),
  activeIcon: makeStringProp("checked"),
  iconPrefix: String,
  finishIcon: String,
  activeColor: String,
  inactiveIcon: String,
  inactiveColor: String
};
const STEPS_KEY = Symbol(name$8);
var stdin_default$a = defineComponent({
  name: name$8,
  props: stepsProps,
  emits: ["click-step"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      linkChildren
    } = useChildren(STEPS_KEY);
    const onClickStep = (index2) => emit("click-step", index2);
    linkChildren({
      props,
      onClickStep
    });
    return () => {
      var _a;
      return createVNode("div", {
        "class": bem$8([props.direction])
      }, [createVNode("div", {
        "class": bem$8("items")
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])]);
    };
  }
});
const [name$7, bem$7] = createNamespace("step");
var stdin_default$9 = defineComponent({
  name: name$7,
  setup(props, {
    slots
  }) {
    const {
      parent,
      index: index2
    } = useParent(STEPS_KEY);
    if (!parent) {
      return;
    }
    const parentProps = parent.props;
    const getStatus = () => {
      const active = +parentProps.active;
      if (index2.value < active) {
        return "finish";
      }
      return index2.value === active ? "process" : "waiting";
    };
    const isActive = () => getStatus() === "process";
    const lineStyle = computed(() => ({
      background: getStatus() === "finish" ? parentProps.activeColor : parentProps.inactiveColor
    }));
    const titleStyle = computed(() => {
      if (isActive()) {
        return {
          color: parentProps.activeColor
        };
      }
      if (getStatus() === "waiting") {
        return {
          color: parentProps.inactiveColor
        };
      }
    });
    const onClickStep = () => parent.onClickStep(index2.value);
    const renderCircle = () => {
      const {
        iconPrefix,
        finishIcon,
        activeIcon,
        activeColor,
        inactiveIcon
      } = parentProps;
      if (isActive()) {
        if (slots["active-icon"]) {
          return slots["active-icon"]();
        }
        return createVNode(Icon, {
          "class": bem$7("icon", "active"),
          "name": activeIcon,
          "color": activeColor,
          "classPrefix": iconPrefix
        }, null);
      }
      if (getStatus() === "finish" && (finishIcon || slots["finish-icon"])) {
        if (slots["finish-icon"]) {
          return slots["finish-icon"]();
        }
        return createVNode(Icon, {
          "class": bem$7("icon", "finish"),
          "name": finishIcon,
          "color": activeColor,
          "classPrefix": iconPrefix
        }, null);
      }
      if (slots["inactive-icon"]) {
        return slots["inactive-icon"]();
      }
      if (inactiveIcon) {
        return createVNode(Icon, {
          "class": bem$7("icon"),
          "name": inactiveIcon,
          "classPrefix": iconPrefix
        }, null);
      }
      return createVNode("i", {
        "class": bem$7("circle"),
        "style": lineStyle.value
      }, null);
    };
    return () => {
      var _a;
      const status = getStatus();
      return createVNode("div", {
        "class": [BORDER, bem$7([parentProps.direction, {
          [status]: status
        }])]
      }, [createVNode("div", {
        "class": bem$7("title", {
          active: isActive()
        }),
        "style": titleStyle.value,
        "onClick": onClickStep
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]), createVNode("div", {
        "class": bem$7("circle-container"),
        "onClick": onClickStep
      }, [renderCircle()]), createVNode("div", {
        "class": bem$7("line"),
        "style": lineStyle.value
      }, null)]);
    };
  }
});
const Step = withInstall(stdin_default$9);
const [name$6, bem$6] = createNamespace("stepper");
const LONG_PRESS_INTERVAL = 200;
const LONG_PRESS_START_TIME = 600;
const isEqual = (value1, value2) => String(value1) === String(value2);
const stepperProps = {
  min: makeNumericProp(1),
  max: makeNumericProp(Infinity),
  name: makeNumericProp(""),
  step: makeNumericProp(1),
  theme: String,
  integer: Boolean,
  disabled: Boolean,
  showPlus: truthProp,
  showMinus: truthProp,
  showInput: truthProp,
  longPress: truthProp,
  allowEmpty: Boolean,
  modelValue: numericProp,
  inputWidth: numericProp,
  buttonSize: numericProp,
  placeholder: String,
  disablePlus: Boolean,
  disableMinus: Boolean,
  disableInput: Boolean,
  beforeChange: Function,
  defaultValue: makeNumericProp(1),
  decimalLength: numericProp
};
var stdin_default$8 = defineComponent({
  name: name$6,
  props: stepperProps,
  emits: ["plus", "blur", "minus", "focus", "change", "overlimit", "update:modelValue"],
  setup(props, {
    emit
  }) {
    const format2 = (value) => {
      const {
        min,
        max,
        allowEmpty,
        decimalLength
      } = props;
      if (allowEmpty && value === "") {
        return value;
      }
      value = formatNumber(String(value), !props.integer);
      value = value === "" ? 0 : +value;
      value = Number.isNaN(value) ? +min : value;
      value = Math.max(Math.min(+max, value), +min);
      if (isDef(decimalLength)) {
        value = value.toFixed(+decimalLength);
      }
      return value;
    };
    const getInitialValue = () => {
      var _a;
      const defaultValue = (_a = props.modelValue) != null ? _a : props.defaultValue;
      const value = format2(defaultValue);
      if (!isEqual(value, props.modelValue)) {
        emit("update:modelValue", value);
      }
      return value;
    };
    let actionType;
    const inputRef = ref();
    const current2 = ref(getInitialValue());
    const minusDisabled = computed(() => props.disabled || props.disableMinus || current2.value <= +props.min);
    const plusDisabled = computed(() => props.disabled || props.disablePlus || current2.value >= +props.max);
    const inputStyle = computed(() => ({
      width: addUnit(props.inputWidth),
      height: addUnit(props.buttonSize)
    }));
    const buttonStyle = computed(() => getSizeStyle(props.buttonSize));
    const check = () => {
      const value = format2(current2.value);
      if (!isEqual(value, current2.value)) {
        current2.value = value;
      }
    };
    const setValue = (value) => {
      if (props.beforeChange) {
        callInterceptor(props.beforeChange, {
          args: [value],
          done() {
            current2.value = value;
          }
        });
      } else {
        current2.value = value;
      }
    };
    const onChange = () => {
      if (actionType === "plus" && plusDisabled.value || actionType === "minus" && minusDisabled.value) {
        emit("overlimit", actionType);
        return;
      }
      const diff = actionType === "minus" ? -props.step : +props.step;
      const value = format2(addNumber(+current2.value, diff));
      setValue(value);
      emit(actionType);
    };
    const onInput = (event) => {
      const input = event.target;
      const {
        value
      } = input;
      const {
        decimalLength
      } = props;
      let formatted = formatNumber(String(value), !props.integer);
      if (isDef(decimalLength) && formatted.includes(".")) {
        const pair = formatted.split(".");
        formatted = `${pair[0]}.${pair[1].slice(0, +decimalLength)}`;
      }
      if (props.beforeChange) {
        input.value = String(current2.value);
      } else if (!isEqual(value, formatted)) {
        input.value = formatted;
      }
      const isNumeric2 = formatted === String(+formatted);
      setValue(isNumeric2 ? +formatted : formatted);
    };
    const onFocus = (event) => {
      var _a;
      if (props.disableInput) {
        (_a = inputRef.value) == null ? void 0 : _a.blur();
      } else {
        emit("focus", event);
      }
    };
    const onBlur = (event) => {
      const input = event.target;
      const value = format2(input.value);
      input.value = String(value);
      current2.value = value;
      nextTick(() => {
        emit("blur", event);
        resetScroll();
      });
    };
    let isLongPress;
    let longPressTimer;
    const longPressStep = () => {
      longPressTimer = setTimeout(() => {
        onChange();
        longPressStep();
      }, LONG_PRESS_INTERVAL);
    };
    const onTouchStart = () => {
      if (props.longPress) {
        isLongPress = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
          isLongPress = true;
          onChange();
          longPressStep();
        }, LONG_PRESS_START_TIME);
      }
    };
    const onTouchEnd = (event) => {
      if (props.longPress) {
        clearTimeout(longPressTimer);
        if (isLongPress) {
          preventDefault(event);
        }
      }
    };
    const onMousedown = (event) => {
      if (props.disableInput) {
        preventDefault(event);
      }
    };
    const createListeners = (type) => ({
      onClick: (event) => {
        preventDefault(event);
        actionType = type;
        onChange();
      },
      onTouchstart: () => {
        actionType = type;
        onTouchStart();
      },
      onTouchend: onTouchEnd,
      onTouchcancel: onTouchEnd
    });
    watch(() => [props.max, props.min, props.integer, props.decimalLength], check);
    watch(() => props.modelValue, (value) => {
      if (!isEqual(value, current2.value)) {
        current2.value = format2(value);
      }
    });
    watch(current2, (value) => {
      emit("update:modelValue", value);
      emit("change", value, {
        name: props.name
      });
    });
    useCustomFieldValue(() => props.modelValue);
    return () => createVNode("div", {
      "role": "group",
      "class": bem$6([props.theme])
    }, [withDirectives(createVNode("button", mergeProps({
      "type": "button",
      "style": buttonStyle.value,
      "class": [bem$6("minus", {
        disabled: minusDisabled.value
      }), {
        [HAPTICS_FEEDBACK]: !minusDisabled.value
      }],
      "aria-disabled": minusDisabled.value || void 0
    }, createListeners("minus")), null), [[vShow, props.showMinus]]), withDirectives(createVNode("input", {
      "ref": inputRef,
      "type": props.integer ? "tel" : "text",
      "role": "spinbutton",
      "class": bem$6("input"),
      "value": current2.value,
      "style": inputStyle.value,
      "disabled": props.disabled,
      "readonly": props.disableInput,
      "inputmode": props.integer ? "numeric" : "decimal",
      "placeholder": props.placeholder,
      "aria-valuemax": props.max,
      "aria-valuemin": props.min,
      "aria-valuenow": current2.value,
      "onBlur": onBlur,
      "onInput": onInput,
      "onFocus": onFocus,
      "onMousedown": onMousedown
    }, null), [[vShow, props.showInput]]), withDirectives(createVNode("button", mergeProps({
      "type": "button",
      "style": buttonStyle.value,
      "class": [bem$6("plus", {
        disabled: plusDisabled.value
      }), {
        [HAPTICS_FEEDBACK]: !plusDisabled.value
      }],
      "aria-disabled": plusDisabled.value || void 0
    }, createListeners("plus")), null), [[vShow, props.showPlus]])]);
  }
});
const Stepper = withInstall(stdin_default$8);
const Steps = withInstall(stdin_default$a);
const [name$5, bem$5, t$1] = createNamespace("submit-bar");
const submitBarProps = {
  tip: String,
  label: String,
  price: Number,
  tipIcon: String,
  loading: Boolean,
  currency: makeStringProp("\xA5"),
  disabled: Boolean,
  textAlign: String,
  buttonText: String,
  buttonType: makeStringProp("danger"),
  buttonColor: String,
  suffixLabel: String,
  placeholder: Boolean,
  decimalLength: makeNumericProp(2),
  safeAreaInsetBottom: truthProp
};
var stdin_default$7 = defineComponent({
  name: name$5,
  props: submitBarProps,
  emits: ["submit"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const renderPlaceholder = usePlaceholder(root, bem$5);
    const renderText = () => {
      const {
        price,
        label,
        currency,
        textAlign,
        suffixLabel,
        decimalLength
      } = props;
      if (typeof price === "number") {
        const pricePair = (price / 100).toFixed(+decimalLength).split(".");
        const decimal = decimalLength ? `.${pricePair[1]}` : "";
        return createVNode("div", {
          "class": bem$5("text"),
          "style": {
            textAlign
          }
        }, [createVNode("span", null, [label || t$1("label")]), createVNode("span", {
          "class": bem$5("price")
        }, [currency, createVNode("span", {
          "class": bem$5("price-integer")
        }, [pricePair[0]]), decimal]), suffixLabel && createVNode("span", {
          "class": bem$5("suffix-label")
        }, [suffixLabel])]);
      }
    };
    const renderTip = () => {
      var _a;
      const {
        tip,
        tipIcon
      } = props;
      if (slots.tip || tip) {
        return createVNode("div", {
          "class": bem$5("tip")
        }, [tipIcon && createVNode(Icon, {
          "class": bem$5("tip-icon"),
          "name": tipIcon
        }, null), tip && createVNode("span", {
          "class": bem$5("tip-text")
        }, [tip]), (_a = slots.tip) == null ? void 0 : _a.call(slots)]);
      }
    };
    const onClickButton = () => emit("submit");
    const renderButton = () => {
      if (slots.button) {
        return slots.button();
      }
      return createVNode(Button, {
        "round": true,
        "type": props.buttonType,
        "text": props.buttonText,
        "class": bem$5("button", props.buttonType),
        "color": props.buttonColor,
        "loading": props.loading,
        "disabled": props.disabled,
        "onClick": onClickButton
      }, null);
    };
    const renderSubmitBar = () => {
      var _a, _b;
      return createVNode("div", {
        "ref": root,
        "class": [bem$5(), {
          "van-safe-area-bottom": props.safeAreaInsetBottom
        }]
      }, [(_a = slots.top) == null ? void 0 : _a.call(slots), renderTip(), createVNode("div", {
        "class": bem$5("bar")
      }, [(_b = slots.default) == null ? void 0 : _b.call(slots), renderText(), renderButton()])]);
    };
    return () => {
      if (props.placeholder) {
        return renderPlaceholder(renderSubmitBar);
      }
      return renderSubmitBar();
    };
  }
});
const SubmitBar = withInstall(stdin_default$7);
const [name$4, bem$4] = createNamespace("swipe-cell");
const swipeCellProps = {
  name: makeNumericProp(""),
  disabled: Boolean,
  leftWidth: numericProp,
  rightWidth: numericProp,
  beforeClose: Function,
  stopPropagation: Boolean
};
var stdin_default$6 = defineComponent({
  name: name$4,
  props: swipeCellProps,
  emits: ["open", "close", "click"],
  setup(props, {
    emit,
    slots
  }) {
    let opened;
    let lockClick2;
    let startOffset;
    const root = ref();
    const leftRef = ref();
    const rightRef = ref();
    const state = reactive({
      offset: 0,
      dragging: false
    });
    const touch = useTouch();
    const getWidthByRef = (ref2) => ref2.value ? useRect(ref2).width : 0;
    const leftWidth = computed(() => isDef(props.leftWidth) ? +props.leftWidth : getWidthByRef(leftRef));
    const rightWidth = computed(() => isDef(props.rightWidth) ? +props.rightWidth : getWidthByRef(rightRef));
    const open = (side) => {
      state.offset = side === "left" ? leftWidth.value : -rightWidth.value;
      if (!opened) {
        opened = true;
        emit("open", {
          name: props.name,
          position: side
        });
      }
    };
    const close = (position) => {
      state.offset = 0;
      if (opened) {
        opened = false;
        emit("close", {
          name: props.name,
          position
        });
      }
    };
    const toggle = (side) => {
      const offset2 = Math.abs(state.offset);
      const THRESHOLD = 0.15;
      const threshold = opened ? 1 - THRESHOLD : THRESHOLD;
      const width2 = side === "left" ? leftWidth.value : rightWidth.value;
      if (width2 && offset2 > width2 * threshold) {
        open(side);
      } else {
        close(side);
      }
    };
    const onTouchStart = (event) => {
      if (!props.disabled) {
        startOffset = state.offset;
        touch.start(event);
      }
    };
    const onTouchMove = (event) => {
      if (props.disabled) {
        return;
      }
      const {
        deltaX
      } = touch;
      touch.move(event);
      if (touch.isHorizontal()) {
        lockClick2 = true;
        state.dragging = true;
        const isEdge = !opened || deltaX.value * startOffset < 0;
        if (isEdge) {
          preventDefault(event, props.stopPropagation);
        }
        state.offset = clamp(deltaX.value + startOffset, -rightWidth.value, leftWidth.value);
      }
    };
    const onTouchEnd = () => {
      if (state.dragging) {
        state.dragging = false;
        toggle(state.offset > 0 ? "left" : "right");
        setTimeout(() => {
          lockClick2 = false;
        }, 0);
      }
    };
    const onClick = (position = "outside") => {
      emit("click", position);
      if (opened && !lockClick2) {
        callInterceptor(props.beforeClose, {
          args: [{
            name: props.name,
            position
          }],
          done: () => close(position)
        });
      }
    };
    const getClickHandler = (position, stop) => (event) => {
      if (stop) {
        event.stopPropagation();
      }
      onClick(position);
    };
    const renderSideContent = (side, ref2) => {
      const contentSlot = slots[side];
      if (contentSlot) {
        return createVNode("div", {
          "ref": ref2,
          "class": bem$4(side),
          "onClick": getClickHandler(side, true)
        }, [contentSlot()]);
      }
    };
    useExpose({
      open,
      close
    });
    useClickAway(root, () => onClick("outside"), {
      eventName: "touchstart"
    });
    return () => {
      var _a;
      const wrapperStyle = {
        transform: `translate3d(${state.offset}px, 0, 0)`,
        transitionDuration: state.dragging ? "0s" : ".6s"
      };
      return createVNode("div", {
        "ref": root,
        "class": bem$4(),
        "onClick": getClickHandler("cell", lockClick2),
        "onTouchstart": onTouchStart,
        "onTouchmove": onTouchMove,
        "onTouchend": onTouchEnd,
        "onTouchcancel": onTouchEnd
      }, [createVNode("div", {
        "class": bem$4("wrapper"),
        "style": wrapperStyle
      }, [renderSideContent("left", leftRef), (_a = slots.default) == null ? void 0 : _a.call(slots), renderSideContent("right", rightRef)])]);
    };
  }
});
const SwipeCell = withInstall(stdin_default$6);
const [name$3, bem$3] = createNamespace("tabbar");
const tabbarProps = {
  route: Boolean,
  fixed: truthProp,
  border: truthProp,
  zIndex: numericProp,
  placeholder: Boolean,
  activeColor: String,
  beforeChange: Function,
  inactiveColor: String,
  modelValue: makeNumericProp(0),
  safeAreaInsetBottom: {
    type: Boolean,
    default: null
  }
};
const TABBAR_KEY = Symbol(name$3);
var stdin_default$5 = defineComponent({
  name: name$3,
  props: tabbarProps,
  emits: ["change", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const root = ref();
    const {
      linkChildren
    } = useChildren(TABBAR_KEY);
    const renderPlaceholder = usePlaceholder(root, bem$3);
    const enableSafeArea = () => {
      var _a;
      return (_a = props.safeAreaInsetBottom) != null ? _a : props.fixed;
    };
    const renderTabbar = () => {
      var _a;
      const {
        fixed,
        zIndex,
        border
      } = props;
      return createVNode("div", {
        "ref": root,
        "role": "tablist",
        "style": getZIndexStyle(zIndex),
        "class": [bem$3({
          fixed
        }), {
          [BORDER_TOP_BOTTOM]: border,
          "van-safe-area-bottom": enableSafeArea()
        }]
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
    const setActive = (active, afterChange) => {
      callInterceptor(props.beforeChange, {
        args: [active],
        done() {
          emit("update:modelValue", active);
          emit("change", active);
          afterChange();
        }
      });
    };
    linkChildren({
      props,
      setActive
    });
    return () => {
      if (props.fixed && props.placeholder) {
        return renderPlaceholder(renderTabbar);
      }
      return renderTabbar();
    };
  }
});
const Tabbar = withInstall(stdin_default$5);
const [name$2, bem$2] = createNamespace("tabbar-item");
const tabbarItemProps = extend({}, routeProps, {
  dot: Boolean,
  icon: String,
  name: numericProp,
  badge: numericProp,
  badgeProps: Object,
  iconPrefix: String
});
var stdin_default$4 = defineComponent({
  name: name$2,
  props: tabbarItemProps,
  emits: ["click"],
  setup(props, {
    emit,
    slots
  }) {
    const route2 = useRoute();
    const vm = getCurrentInstance().proxy;
    const {
      parent,
      index: index2
    } = useParent(TABBAR_KEY);
    if (!parent) {
      return;
    }
    const active = computed(() => {
      var _a;
      const {
        route: route22,
        modelValue
      } = parent.props;
      if (route22 && "$route" in vm) {
        const {
          $route
        } = vm;
        const {
          to
        } = props;
        const config = isObject(to) ? to : {
          path: to
        };
        return !!$route.matched.find((val) => {
          const pathMatched = "path" in config && config.path === val.path;
          const nameMatched = "name" in config && config.name === val.name;
          return pathMatched || nameMatched;
        });
      }
      return ((_a = props.name) != null ? _a : index2.value) === modelValue;
    });
    const onClick = (event) => {
      var _a;
      if (!active.value) {
        parent.setActive((_a = props.name) != null ? _a : index2.value, route2);
      }
      emit("click", event);
    };
    const renderIcon = () => {
      if (slots.icon) {
        return slots.icon({
          active: active.value
        });
      }
      if (props.icon) {
        return createVNode(Icon, {
          "name": props.icon,
          "classPrefix": props.iconPrefix
        }, null);
      }
    };
    return () => {
      var _a;
      const {
        dot,
        badge
      } = props;
      const {
        activeColor,
        inactiveColor
      } = parent.props;
      const color = active.value ? activeColor : inactiveColor;
      return createVNode("div", {
        "role": "tab",
        "class": bem$2({
          active: active.value
        }),
        "style": {
          color
        },
        "tabindex": 0,
        "aria-selected": active.value,
        "onClick": onClick
      }, [createVNode(Badge, mergeProps({
        "dot": dot,
        "class": bem$2("icon"),
        "content": badge
      }, props.badgeProps), {
        default: renderIcon
      }), createVNode("div", {
        "class": bem$2("text")
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots, {
        active: active.value
      })])]);
    };
  }
});
const TabbarItem = withInstall(stdin_default$4);
const [name$1, bem$1] = createNamespace("tree-select");
const treeSelectProps = {
  max: makeNumericProp(Infinity),
  items: makeArrayProp(),
  height: makeNumericProp(300),
  selectedIcon: makeStringProp("success"),
  mainActiveIndex: makeNumericProp(0),
  activeId: {
    type: [Number, String, Array],
    default: 0
  }
};
var stdin_default$3 = defineComponent({
  name: name$1,
  props: treeSelectProps,
  emits: ["click-nav", "click-item", "update:activeId", "update:mainActiveIndex"],
  setup(props, {
    emit,
    slots
  }) {
    const isActiveItem = (id) => Array.isArray(props.activeId) ? props.activeId.includes(id) : props.activeId === id;
    const renderSubItem = (item) => {
      const onClick = () => {
        if (item.disabled) {
          return;
        }
        let activeId;
        if (Array.isArray(props.activeId)) {
          activeId = props.activeId.slice();
          const index2 = activeId.indexOf(item.id);
          if (index2 !== -1) {
            activeId.splice(index2, 1);
          } else if (activeId.length < props.max) {
            activeId.push(item.id);
          }
        } else {
          activeId = item.id;
        }
        emit("update:activeId", activeId);
        emit("click-item", item);
      };
      return createVNode("div", {
        "key": item.id,
        "class": ["van-ellipsis", bem$1("item", {
          active: isActiveItem(item.id),
          disabled: item.disabled
        })],
        "onClick": onClick
      }, [item.text, isActiveItem(item.id) && createVNode(Icon, {
        "name": props.selectedIcon,
        "class": bem$1("selected")
      }, null)]);
    };
    const onSidebarChange = (index2) => {
      emit("update:mainActiveIndex", index2);
    };
    const onClickSidebarItem = (index2) => emit("click-nav", index2);
    const renderSidebar = () => {
      const Items = props.items.map((item) => createVNode(SidebarItem, {
        "dot": item.dot,
        "title": item.text,
        "badge": item.badge,
        "class": [bem$1("nav-item"), item.className],
        "disabled": item.disabled,
        "onClick": onClickSidebarItem
      }, null));
      return createVNode(Sidebar, {
        "class": bem$1("nav"),
        "modelValue": props.mainActiveIndex,
        "onChange": onSidebarChange
      }, {
        default: () => [Items]
      });
    };
    const renderContent = () => {
      if (slots.content) {
        return slots.content();
      }
      const selected = props.items[+props.mainActiveIndex] || {};
      if (selected.children) {
        return selected.children.map(renderSubItem);
      }
    };
    return () => createVNode("div", {
      "class": bem$1(),
      "style": {
        height: addUnit(props.height)
      }
    }, [renderSidebar(), createVNode("div", {
      "class": bem$1("content")
    }, [renderContent()])]);
  }
});
const TreeSelect = withInstall(stdin_default$3);
const [name, bem, t] = createNamespace("uploader");
function readFileContent(file, resultType) {
  return new Promise((resolve2) => {
    if (resultType === "file") {
      resolve2();
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve2(event.target.result);
    };
    if (resultType === "dataUrl") {
      reader.readAsDataURL(file);
    } else if (resultType === "text") {
      reader.readAsText(file);
    }
  });
}
function isOversize(items, maxSize) {
  return toArray(items).some((item) => {
    if (item.file) {
      if (isFunction(maxSize)) {
        return maxSize(item.file);
      }
      return item.file.size > maxSize;
    }
    return false;
  });
}
function filterFiles(items, maxSize) {
  const valid = [];
  const invalid = [];
  items.forEach((item) => {
    if (isOversize(item, maxSize)) {
      invalid.push(item);
    } else {
      valid.push(item);
    }
  });
  return { valid, invalid };
}
const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
const isImageUrl = (url) => IMAGE_REGEXP.test(url);
function isImageFile(item) {
  if (item.isImage) {
    return true;
  }
  if (item.file && item.file.type) {
    return item.file.type.indexOf("image") === 0;
  }
  if (item.url) {
    return isImageUrl(item.url);
  }
  if (typeof item.content === "string") {
    return item.content.indexOf("data:image") === 0;
  }
  return false;
}
var stdin_default$2 = defineComponent({
  props: {
    name: numericProp,
    item: makeRequiredProp(Object),
    index: Number,
    imageFit: String,
    lazyLoad: Boolean,
    deletable: Boolean,
    previewSize: [Number, String, Array],
    beforeDelete: Function
  },
  emits: ["delete", "preview"],
  setup(props, {
    emit,
    slots
  }) {
    const renderMask = () => {
      const {
        status,
        message
      } = props.item;
      if (status === "uploading" || status === "failed") {
        const MaskIcon = status === "failed" ? createVNode(Icon, {
          "name": "close",
          "class": bem("mask-icon")
        }, null) : createVNode(Loading, {
          "class": bem("loading")
        }, null);
        const showMessage = isDef(message) && message !== "";
        return createVNode("div", {
          "class": bem("mask")
        }, [MaskIcon, showMessage && createVNode("div", {
          "class": bem("mask-message")
        }, [message])]);
      }
    };
    const onDelete = (event) => {
      const {
        name: name2,
        item,
        index: index2,
        beforeDelete
      } = props;
      event.stopPropagation();
      callInterceptor(beforeDelete, {
        args: [item, {
          name: name2,
          index: index2
        }],
        done: () => emit("delete")
      });
    };
    const onPreview = () => emit("preview");
    const renderDeleteIcon = () => {
      if (props.deletable && props.item.status !== "uploading") {
        const slot = slots["preview-delete"];
        return createVNode("div", {
          "role": "button",
          "class": bem("preview-delete", {
            shadow: !slot
          }),
          "tabindex": 0,
          "aria-label": t("delete"),
          "onClick": onDelete
        }, [slot ? slot() : createVNode(Icon, {
          "name": "cross",
          "class": bem("preview-delete-icon")
        }, null)]);
      }
    };
    const renderCover = () => {
      if (slots["preview-cover"]) {
        const {
          index: index2,
          item
        } = props;
        return createVNode("div", {
          "class": bem("preview-cover")
        }, [slots["preview-cover"](extend({
          index: index2
        }, item))]);
      }
    };
    const renderPreview = () => {
      const {
        item,
        lazyLoad,
        imageFit,
        previewSize
      } = props;
      if (isImageFile(item)) {
        return createVNode(Image, {
          "fit": imageFit,
          "src": item.content || item.url,
          "class": bem("preview-image"),
          "width": Array.isArray(previewSize) ? previewSize[0] : previewSize,
          "height": Array.isArray(previewSize) ? previewSize[1] : previewSize,
          "lazyLoad": lazyLoad,
          "onClick": onPreview
        }, {
          default: renderCover
        });
      }
      return createVNode("div", {
        "class": bem("file"),
        "style": getSizeStyle(props.previewSize)
      }, [createVNode(Icon, {
        "class": bem("file-icon"),
        "name": "description"
      }, null), createVNode("div", {
        "class": [bem("file-name"), "van-ellipsis"]
      }, [item.file ? item.file.name : item.url]), renderCover()]);
    };
    return () => createVNode("div", {
      "class": bem("preview")
    }, [renderPreview(), renderMask(), renderDeleteIcon()]);
  }
});
const uploaderProps = {
  name: makeNumericProp(""),
  accept: makeStringProp("image/*"),
  capture: String,
  multiple: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  lazyLoad: Boolean,
  maxCount: makeNumericProp(Infinity),
  imageFit: makeStringProp("cover"),
  resultType: makeStringProp("dataUrl"),
  uploadIcon: makeStringProp("photograph"),
  uploadText: String,
  deletable: truthProp,
  afterRead: Function,
  showUpload: truthProp,
  modelValue: makeArrayProp(),
  beforeRead: Function,
  beforeDelete: Function,
  previewSize: [Number, String, Array],
  previewImage: truthProp,
  previewOptions: Object,
  previewFullImage: truthProp,
  maxSize: {
    type: [Number, String, Function],
    default: Infinity
  }
};
var stdin_default$1 = defineComponent({
  name,
  props: uploaderProps,
  emits: ["delete", "oversize", "click-upload", "close-preview", "click-preview", "update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const inputRef = ref();
    const urls = [];
    const getDetail = (index2 = props.modelValue.length) => ({
      name: props.name,
      index: index2
    });
    const resetInput = () => {
      if (inputRef.value) {
        inputRef.value.value = "";
      }
    };
    const onAfterRead = (items) => {
      resetInput();
      if (isOversize(items, props.maxSize)) {
        if (Array.isArray(items)) {
          const result = filterFiles(items, props.maxSize);
          items = result.valid;
          emit("oversize", result.invalid, getDetail());
          if (!items.length) {
            return;
          }
        } else {
          emit("oversize", items, getDetail());
          return;
        }
      }
      items = reactive(items);
      emit("update:modelValue", [...props.modelValue, ...toArray(items)]);
      if (props.afterRead) {
        props.afterRead(items, getDetail());
      }
    };
    const readFile = (files) => {
      const {
        maxCount,
        modelValue,
        resultType
      } = props;
      if (Array.isArray(files)) {
        const remainCount = +maxCount - modelValue.length;
        if (files.length > remainCount) {
          files = files.slice(0, remainCount);
        }
        Promise.all(files.map((file) => readFileContent(file, resultType))).then((contents) => {
          const fileList = files.map((file, index2) => {
            const result = {
              file,
              status: "",
              message: ""
            };
            if (contents[index2]) {
              result.content = contents[index2];
            }
            return result;
          });
          onAfterRead(fileList);
        });
      } else {
        readFileContent(files, resultType).then((content) => {
          const result = {
            file: files,
            status: "",
            message: ""
          };
          if (content) {
            result.content = content;
          }
          onAfterRead(result);
        });
      }
    };
    const onChange = (event) => {
      const {
        files
      } = event.target;
      if (props.disabled || !files || !files.length) {
        return;
      }
      const file = files.length === 1 ? files[0] : [].slice.call(files);
      if (props.beforeRead) {
        const response = props.beforeRead(file, getDetail());
        if (!response) {
          resetInput();
          return;
        }
        if (isPromise(response)) {
          response.then((data) => {
            if (data) {
              readFile(data);
            } else {
              readFile(file);
            }
          }).catch(resetInput);
          return;
        }
      }
      readFile(file);
    };
    let imagePreview;
    const onClosePreview = () => emit("close-preview");
    const previewImage = (item) => {
      if (props.previewFullImage) {
        const imageFiles = props.modelValue.filter(isImageFile);
        const images = imageFiles.map((item2) => {
          if (item2.file && !item2.url) {
            item2.url = URL.createObjectURL(item2.file);
            urls.push(item2.url);
          }
          return item2.url;
        }).filter(Boolean);
        imagePreview = ImagePreview(extend({
          images,
          startPosition: imageFiles.indexOf(item),
          onClose: onClosePreview
        }, props.previewOptions));
      }
    };
    const closeImagePreview = () => {
      if (imagePreview) {
        imagePreview.close();
      }
    };
    const deleteFile = (item, index2) => {
      const fileList = props.modelValue.slice(0);
      fileList.splice(index2, 1);
      emit("update:modelValue", fileList);
      emit("delete", item, getDetail(index2));
    };
    const renderPreviewItem = (item, index2) => {
      const needPickData = ["imageFit", "deletable", "previewSize", "beforeDelete"];
      const previewData = extend(pick(props, needPickData), pick(item, needPickData, true));
      return createVNode(stdin_default$2, mergeProps({
        "item": item,
        "index": index2,
        "onClick": () => emit("click-preview", item, getDetail(index2)),
        "onDelete": () => deleteFile(item, index2),
        "onPreview": () => previewImage(item)
      }, pick(props, ["name", "lazyLoad"]), previewData), pick(slots, ["preview-cover", "preview-delete"]));
    };
    const renderPreviewList = () => {
      if (props.previewImage) {
        return props.modelValue.map(renderPreviewItem);
      }
    };
    const onClickUpload = (event) => emit("click-upload", event);
    const renderUpload = () => {
      if (props.modelValue.length >= props.maxCount || !props.showUpload) {
        return;
      }
      const Input = props.readonly ? null : createVNode("input", {
        "ref": inputRef,
        "type": "file",
        "class": bem("input"),
        "accept": props.accept,
        "capture": props.capture,
        "multiple": props.multiple,
        "disabled": props.disabled,
        "onChange": onChange
      }, null);
      if (slots.default) {
        return createVNode("div", {
          "class": bem("input-wrapper"),
          "onClick": onClickUpload
        }, [slots.default(), Input]);
      }
      return createVNode("div", {
        "class": bem("upload", {
          readonly: props.readonly
        }),
        "style": getSizeStyle(props.previewSize),
        "onClick": onClickUpload
      }, [createVNode(Icon, {
        "name": props.uploadIcon,
        "class": bem("upload-icon")
      }, null), props.uploadText && createVNode("span", {
        "class": bem("upload-text")
      }, [props.uploadText]), Input]);
    };
    const chooseFile = () => {
      if (inputRef.value && !props.disabled) {
        inputRef.value.click();
      }
    };
    onBeforeUnmount(() => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    });
    useExpose({
      chooseFile,
      closeImagePreview
    });
    useCustomFieldValue(() => props.modelValue);
    return () => createVNode("div", {
      "class": bem()
    }, [createVNode("div", {
      "class": bem("wrapper", {
        disabled: props.disabled
      })
    }, [renderPreviewList(), renderUpload()])]);
  }
});
const Uploader = withInstall(stdin_default$1);
const version = "3.5.2";
function install(app2) {
  const components = [
    ActionBar,
    ActionBarButton,
    ActionBarIcon,
    ActionSheet,
    AddressEdit,
    AddressList,
    Area,
    Badge,
    Button,
    Calendar,
    Card,
    Cascader,
    Cell,
    CellGroup,
    Checkbox,
    CheckboxGroup,
    Circle,
    Col,
    Collapse,
    CollapseItem,
    ConfigProvider,
    ContactCard,
    ContactEdit,
    ContactList,
    CountDown,
    Coupon,
    CouponCell,
    CouponList,
    DatetimePicker,
    Dialog,
    Divider,
    DropdownItem,
    DropdownMenu,
    Empty,
    Field,
    Form,
    Grid,
    GridItem,
    Icon,
    Image,
    ImagePreview,
    IndexAnchor,
    IndexBar,
    List,
    Loading,
    Locale,
    NavBar,
    NoticeBar,
    Notify,
    NumberKeyboard,
    Overlay,
    Pagination,
    PasswordInput,
    Picker,
    Popover,
    Popup,
    Progress,
    PullRefresh,
    Radio,
    RadioGroup,
    Rate,
    Row,
    Search,
    ShareSheet,
    Sidebar,
    SidebarItem,
    Skeleton,
    Slider,
    Step,
    Stepper,
    Steps,
    Sticky,
    SubmitBar,
    Swipe,
    SwipeCell,
    SwipeItem,
    Switch,
    Tab,
    Tabbar,
    TabbarItem,
    Tabs,
    Tag,
    Toast,
    TreeSelect,
    Uploader
  ];
  components.forEach((item) => {
    if (item.install) {
      app2.use(item);
    } else if (item.name) {
      app2.component(item.name, item);
    }
  });
}
var stdin_default = {
  install,
  version
};
const index = "";
function createApp() {
  const app2 = createSSRApp(App);
  const router2 = createRouter();
  app2.use(router2);
  app2.use(stdin_default);
  return { app: app2, router: router2 };
}
const { app, router } = createApp();
router.isReady().then(() => {
  app.mount("#app");
});
export {
  Fragment as F,
  _export_sfc as _,
  createElementBlock as a,
  createBaseVNode as b,
  createVNode as c,
  defineComponent as d,
  createTextVNode as e,
  createBlock as f,
  watch as g,
  reactive as h,
  normalizeClass as n,
  openBlock as o,
  resolveComponent as r,
  toDisplayString as t,
  withCtx as w
};
