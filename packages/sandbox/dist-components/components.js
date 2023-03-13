var K_ = Object.defineProperty;
var Z_ = (B, W, N) => W in B ? K_(B, W, { enumerable: !0, configurable: !0, writable: !0, value: N }) : B[W] = N;
var v0 = (B, W, N) => (Z_(B, typeof W != "symbol" ? W + "" : W, N), N);
var Zp = {}, J_ = {
  get exports() {
    return Zp;
  },
  set exports(B) {
    Zp = B;
  }
}, Wp = {}, Vm = {}, ek = {
  get exports() {
    return Vm;
  },
  set exports(B) {
    Vm = B;
  }
}, Et = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Z1;
function tk() {
  if (Z1)
    return Et;
  Z1 = 1;
  var B = Symbol.for("react.element"), W = Symbol.for("react.portal"), N = Symbol.for("react.fragment"), Nt = Symbol.for("react.strict_mode"), Yt = Symbol.for("react.profiler"), Je = Symbol.for("react.provider"), S = Symbol.for("react.context"), It = Symbol.for("react.forward_ref"), he = Symbol.for("react.suspense"), pe = Symbol.for("react.memo"), rt = Symbol.for("react.lazy"), re = Symbol.iterator;
  function me(T) {
    return T === null || typeof T != "object" ? null : (T = re && T[re] || T["@@iterator"], typeof T == "function" ? T : null);
  }
  var ie = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Ve = Object.assign, Ct = {};
  function st(T, $, le) {
    this.props = T, this.context = $, this.refs = Ct, this.updater = le || ie;
  }
  st.prototype.isReactComponent = {}, st.prototype.setState = function(T, $) {
    if (typeof T != "object" && typeof T != "function" && T != null)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, T, $, "setState");
  }, st.prototype.forceUpdate = function(T) {
    this.updater.enqueueForceUpdate(this, T, "forceUpdate");
  };
  function fn() {
  }
  fn.prototype = st.prototype;
  function at(T, $, le) {
    this.props = T, this.context = $, this.refs = Ct, this.updater = le || ie;
  }
  var Qe = at.prototype = new fn();
  Qe.constructor = at, Ve(Qe, st.prototype), Qe.isPureReactComponent = !0;
  var ct = Array.isArray, be = Object.prototype.hasOwnProperty, it = { current: null }, He = { key: !0, ref: !0, __self: !0, __source: !0 };
  function nn(T, $, le) {
    var $e, Fe = {}, ht = null, et = null;
    if ($ != null)
      for ($e in $.ref !== void 0 && (et = $.ref), $.key !== void 0 && (ht = "" + $.key), $)
        be.call($, $e) && !He.hasOwnProperty($e) && (Fe[$e] = $[$e]);
    var ft = arguments.length - 2;
    if (ft === 1)
      Fe.children = le;
    else if (1 < ft) {
      for (var tt = Array(ft), Ut = 0; Ut < ft; Ut++)
        tt[Ut] = arguments[Ut + 2];
      Fe.children = tt;
    }
    if (T && T.defaultProps)
      for ($e in ft = T.defaultProps, ft)
        Fe[$e] === void 0 && (Fe[$e] = ft[$e]);
    return { $$typeof: B, type: T, key: ht, ref: et, props: Fe, _owner: it.current };
  }
  function xn(T, $) {
    return { $$typeof: B, type: T.type, key: $, ref: T.ref, props: T.props, _owner: T._owner };
  }
  function Qt(T) {
    return typeof T == "object" && T !== null && T.$$typeof === B;
  }
  function _t(T) {
    var $ = { "=": "=0", ":": "=2" };
    return "$" + T.replace(/[=:]/g, function(le) {
      return $[le];
    });
  }
  var En = /\/+/g;
  function Ue(T, $) {
    return typeof T == "object" && T !== null && T.key != null ? _t("" + T.key) : $.toString(36);
  }
  function qe(T, $, le, $e, Fe) {
    var ht = typeof T;
    (ht === "undefined" || ht === "boolean") && (T = null);
    var et = !1;
    if (T === null)
      et = !0;
    else
      switch (ht) {
        case "string":
        case "number":
          et = !0;
          break;
        case "object":
          switch (T.$$typeof) {
            case B:
            case W:
              et = !0;
          }
      }
    if (et)
      return et = T, Fe = Fe(et), T = $e === "" ? "." + Ue(et, 0) : $e, ct(Fe) ? (le = "", T != null && (le = T.replace(En, "$&/") + "/"), qe(Fe, $, le, "", function(Ut) {
        return Ut;
      })) : Fe != null && (Qt(Fe) && (Fe = xn(Fe, le + (!Fe.key || et && et.key === Fe.key ? "" : ("" + Fe.key).replace(En, "$&/") + "/") + T)), $.push(Fe)), 1;
    if (et = 0, $e = $e === "" ? "." : $e + ":", ct(T))
      for (var ft = 0; ft < T.length; ft++) {
        ht = T[ft];
        var tt = $e + Ue(ht, ft);
        et += qe(ht, $, le, tt, Fe);
      }
    else if (tt = me(T), typeof tt == "function")
      for (T = tt.call(T), ft = 0; !(ht = T.next()).done; )
        ht = ht.value, tt = $e + Ue(ht, ft++), et += qe(ht, $, le, tt, Fe);
    else if (ht === "object")
      throw $ = String(T), Error("Objects are not valid as a React child (found: " + ($ === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : $) + "). If you meant to render a collection of children, use an array instead.");
    return et;
  }
  function zt(T, $, le) {
    if (T == null)
      return T;
    var $e = [], Fe = 0;
    return qe(T, $e, "", "", function(ht) {
      return $.call(le, ht, Fe++);
    }), $e;
  }
  function Rt(T) {
    if (T._status === -1) {
      var $ = T._result;
      $ = $(), $.then(function(le) {
        (T._status === 0 || T._status === -1) && (T._status = 1, T._result = le);
      }, function(le) {
        (T._status === 0 || T._status === -1) && (T._status = 2, T._result = le);
      }), T._status === -1 && (T._status = 0, T._result = $);
    }
    if (T._status === 1)
      return T._result.default;
    throw T._result;
  }
  var ye = { current: null }, Z = { transition: null }, we = { ReactCurrentDispatcher: ye, ReactCurrentBatchConfig: Z, ReactCurrentOwner: it };
  return Et.Children = { map: zt, forEach: function(T, $, le) {
    zt(T, function() {
      $.apply(this, arguments);
    }, le);
  }, count: function(T) {
    var $ = 0;
    return zt(T, function() {
      $++;
    }), $;
  }, toArray: function(T) {
    return zt(T, function($) {
      return $;
    }) || [];
  }, only: function(T) {
    if (!Qt(T))
      throw Error("React.Children.only expected to receive a single React element child.");
    return T;
  } }, Et.Component = st, Et.Fragment = N, Et.Profiler = Yt, Et.PureComponent = at, Et.StrictMode = Nt, Et.Suspense = he, Et.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = we, Et.cloneElement = function(T, $, le) {
    if (T == null)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + T + ".");
    var $e = Ve({}, T.props), Fe = T.key, ht = T.ref, et = T._owner;
    if ($ != null) {
      if ($.ref !== void 0 && (ht = $.ref, et = it.current), $.key !== void 0 && (Fe = "" + $.key), T.type && T.type.defaultProps)
        var ft = T.type.defaultProps;
      for (tt in $)
        be.call($, tt) && !He.hasOwnProperty(tt) && ($e[tt] = $[tt] === void 0 && ft !== void 0 ? ft[tt] : $[tt]);
    }
    var tt = arguments.length - 2;
    if (tt === 1)
      $e.children = le;
    else if (1 < tt) {
      ft = Array(tt);
      for (var Ut = 0; Ut < tt; Ut++)
        ft[Ut] = arguments[Ut + 2];
      $e.children = ft;
    }
    return { $$typeof: B, type: T.type, key: Fe, ref: ht, props: $e, _owner: et };
  }, Et.createContext = function(T) {
    return T = { $$typeof: S, _currentValue: T, _currentValue2: T, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, T.Provider = { $$typeof: Je, _context: T }, T.Consumer = T;
  }, Et.createElement = nn, Et.createFactory = function(T) {
    var $ = nn.bind(null, T);
    return $.type = T, $;
  }, Et.createRef = function() {
    return { current: null };
  }, Et.forwardRef = function(T) {
    return { $$typeof: It, render: T };
  }, Et.isValidElement = Qt, Et.lazy = function(T) {
    return { $$typeof: rt, _payload: { _status: -1, _result: T }, _init: Rt };
  }, Et.memo = function(T, $) {
    return { $$typeof: pe, type: T, compare: $ === void 0 ? null : $ };
  }, Et.startTransition = function(T) {
    var $ = Z.transition;
    Z.transition = {};
    try {
      T();
    } finally {
      Z.transition = $;
    }
  }, Et.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, Et.useCallback = function(T, $) {
    return ye.current.useCallback(T, $);
  }, Et.useContext = function(T) {
    return ye.current.useContext(T);
  }, Et.useDebugValue = function() {
  }, Et.useDeferredValue = function(T) {
    return ye.current.useDeferredValue(T);
  }, Et.useEffect = function(T, $) {
    return ye.current.useEffect(T, $);
  }, Et.useId = function() {
    return ye.current.useId();
  }, Et.useImperativeHandle = function(T, $, le) {
    return ye.current.useImperativeHandle(T, $, le);
  }, Et.useInsertionEffect = function(T, $) {
    return ye.current.useInsertionEffect(T, $);
  }, Et.useLayoutEffect = function(T, $) {
    return ye.current.useLayoutEffect(T, $);
  }, Et.useMemo = function(T, $) {
    return ye.current.useMemo(T, $);
  }, Et.useReducer = function(T, $, le) {
    return ye.current.useReducer(T, $, le);
  }, Et.useRef = function(T) {
    return ye.current.useRef(T);
  }, Et.useState = function(T) {
    return ye.current.useState(T);
  }, Et.useSyncExternalStore = function(T, $, le) {
    return ye.current.useSyncExternalStore(T, $, le);
  }, Et.useTransition = function() {
    return ye.current.useTransition();
  }, Et.version = "18.2.0", Et;
}
var Kp = {}, nk = {
  get exports() {
    return Kp;
  },
  set exports(B) {
    Kp = B;
  }
};
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var J1;
function rk() {
  return J1 || (J1 = 1, function(B, W) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var N = "18.2.0", Nt = Symbol.for("react.element"), Yt = Symbol.for("react.portal"), Je = Symbol.for("react.fragment"), S = Symbol.for("react.strict_mode"), It = Symbol.for("react.profiler"), he = Symbol.for("react.provider"), pe = Symbol.for("react.context"), rt = Symbol.for("react.forward_ref"), re = Symbol.for("react.suspense"), me = Symbol.for("react.suspense_list"), ie = Symbol.for("react.memo"), Ve = Symbol.for("react.lazy"), Ct = Symbol.for("react.offscreen"), st = Symbol.iterator, fn = "@@iterator";
      function at(h) {
        if (h === null || typeof h != "object")
          return null;
        var C = st && h[st] || h[fn];
        return typeof C == "function" ? C : null;
      }
      var Qe = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, ct = {
        transition: null
      }, be = {
        current: null,
        // Used to reproduce behavior of `batchedUpdates` in legacy mode.
        isBatchingLegacy: !1,
        didScheduleLegacyUpdate: !1
      }, it = {
        /**
         * @internal
         * @type {ReactComponent}
         */
        current: null
      }, He = {}, nn = null;
      function xn(h) {
        nn = h;
      }
      He.setExtraStackFrame = function(h) {
        nn = h;
      }, He.getCurrentStack = null, He.getStackAddendum = function() {
        var h = "";
        nn && (h += nn);
        var C = He.getCurrentStack;
        return C && (h += C() || ""), h;
      };
      var Qt = !1, _t = !1, En = !1, Ue = !1, qe = !1, zt = {
        ReactCurrentDispatcher: Qe,
        ReactCurrentBatchConfig: ct,
        ReactCurrentOwner: it
      };
      zt.ReactDebugCurrentFrame = He, zt.ReactCurrentActQueue = be;
      function Rt(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), F = 1; F < C; F++)
            z[F - 1] = arguments[F];
          Z("warn", h, z);
        }
      }
      function ye(h) {
        {
          for (var C = arguments.length, z = new Array(C > 1 ? C - 1 : 0), F = 1; F < C; F++)
            z[F - 1] = arguments[F];
          Z("error", h, z);
        }
      }
      function Z(h, C, z) {
        {
          var F = zt.ReactDebugCurrentFrame, X = F.getStackAddendum();
          X !== "" && (C += "%s", z = z.concat([X]));
          var Ne = z.map(function(ae) {
            return String(ae);
          });
          Ne.unshift("Warning: " + C), Function.prototype.apply.call(console[h], console, Ne);
        }
      }
      var we = {};
      function T(h, C) {
        {
          var z = h.constructor, F = z && (z.displayName || z.name) || "ReactClass", X = F + "." + C;
          if (we[X])
            return;
          ye("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", C, F), we[X] = !0;
        }
      }
      var $ = {
        /**
         * Checks whether or not this composite component is mounted.
         * @param {ReactClass} publicInstance The instance we want to test.
         * @return {boolean} True if mounted, false otherwise.
         * @protected
         * @final
         */
        isMounted: function(h) {
          return !1;
        },
        /**
         * Forces an update. This should only be invoked when it is known with
         * certainty that we are **not** in a DOM transaction.
         *
         * You may want to call this when you know that some deeper aspect of the
         * component's state has changed but `setState` was not called.
         *
         * This will not invoke `shouldComponentUpdate`, but it will invoke
         * `componentWillUpdate` and `componentDidUpdate`.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueForceUpdate: function(h, C, z) {
          T(h, "forceUpdate");
        },
        /**
         * Replaces all of the state. Always use this or `setState` to mutate state.
         * You should treat `this.state` as immutable.
         *
         * There is no guarantee that `this.state` will be immediately updated, so
         * accessing `this.state` after calling this method may return the old value.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} completeState Next state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} callerName name of the calling function in the public API.
         * @internal
         */
        enqueueReplaceState: function(h, C, z, F) {
          T(h, "replaceState");
        },
        /**
         * Sets a subset of the state. This only exists because _pendingState is
         * internal. This provides a merging strategy that is not available to deep
         * properties which is confusing. TODO: Expose pendingState or don't use it
         * during the merge.
         *
         * @param {ReactClass} publicInstance The instance that should rerender.
         * @param {object} partialState Next partial state to be merged with state.
         * @param {?function} callback Called after component is updated.
         * @param {?string} Name of the calling function in the public API.
         * @internal
         */
        enqueueSetState: function(h, C, z, F) {
          T(h, "setState");
        }
      }, le = Object.assign, $e = {};
      Object.freeze($e);
      function Fe(h, C, z) {
        this.props = h, this.context = C, this.refs = $e, this.updater = z || $;
      }
      Fe.prototype.isReactComponent = {}, Fe.prototype.setState = function(h, C) {
        if (typeof h != "object" && typeof h != "function" && h != null)
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, h, C, "setState");
      }, Fe.prototype.forceUpdate = function(h) {
        this.updater.enqueueForceUpdate(this, h, "forceUpdate");
      };
      {
        var ht = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        }, et = function(h, C) {
          Object.defineProperty(Fe.prototype, h, {
            get: function() {
              Rt("%s(...) is deprecated in plain JavaScript React classes. %s", C[0], C[1]);
            }
          });
        };
        for (var ft in ht)
          ht.hasOwnProperty(ft) && et(ft, ht[ft]);
      }
      function tt() {
      }
      tt.prototype = Fe.prototype;
      function Ut(h, C, z) {
        this.props = h, this.context = C, this.refs = $e, this.updater = z || $;
      }
      var Vr = Ut.prototype = new tt();
      Vr.constructor = Ut, le(Vr, Fe.prototype), Vr.isPureReactComponent = !0;
      function pr() {
        var h = {
          current: null
        };
        return Object.seal(h), h;
      }
      var Pr = Array.isArray;
      function dn(h) {
        return Pr(h);
      }
      function Yn(h) {
        {
          var C = typeof Symbol == "function" && Symbol.toStringTag, z = C && h[Symbol.toStringTag] || h.constructor.name || "Object";
          return z;
        }
      }
      function An(h) {
        try {
          return Fn(h), !1;
        } catch {
          return !0;
        }
      }
      function Fn(h) {
        return "" + h;
      }
      function bn(h) {
        if (An(h))
          return ye("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Yn(h)), Fn(h);
      }
      function Br(h, C, z) {
        var F = h.displayName;
        if (F)
          return F;
        var X = C.displayName || C.name || "";
        return X !== "" ? z + "(" + X + ")" : z;
      }
      function $r(h) {
        return h.displayName || "Context";
      }
      function In(h) {
        if (h == null)
          return null;
        if (typeof h.tag == "number" && ye("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof h == "function")
          return h.displayName || h.name || null;
        if (typeof h == "string")
          return h;
        switch (h) {
          case Je:
            return "Fragment";
          case Yt:
            return "Portal";
          case It:
            return "Profiler";
          case S:
            return "StrictMode";
          case re:
            return "Suspense";
          case me:
            return "SuspenseList";
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case pe:
              var C = h;
              return $r(C) + ".Consumer";
            case he:
              var z = h;
              return $r(z._context) + ".Provider";
            case rt:
              return Br(h, h.render, "ForwardRef");
            case ie:
              var F = h.displayName || null;
              return F !== null ? F : In(h.type) || "Memo";
            case Ve: {
              var X = h, Ne = X._payload, ae = X._init;
              try {
                return In(ae(Ne));
              } catch {
                return null;
              }
            }
          }
        return null;
      }
      var vr = Object.prototype.hasOwnProperty, Yr = {
        key: !0,
        ref: !0,
        __self: !0,
        __source: !0
      }, hr, sa, er;
      er = {};
      function Ir(h) {
        if (vr.call(h, "ref")) {
          var C = Object.getOwnPropertyDescriptor(h, "ref").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.ref !== void 0;
      }
      function pn(h) {
        if (vr.call(h, "key")) {
          var C = Object.getOwnPropertyDescriptor(h, "key").get;
          if (C && C.isReactWarning)
            return !1;
        }
        return h.key !== void 0;
      }
      function wr(h, C) {
        var z = function() {
          hr || (hr = !0, ye("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "key", {
          get: z,
          configurable: !0
        });
      }
      function ui(h, C) {
        var z = function() {
          sa || (sa = !0, ye("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", C));
        };
        z.isReactWarning = !0, Object.defineProperty(h, "ref", {
          get: z,
          configurable: !0
        });
      }
      function ca(h) {
        if (typeof h.ref == "string" && it.current && h.__self && it.current.stateNode !== h.__self) {
          var C = In(it.current.type);
          er[C] || (ye('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', C, h.ref), er[C] = !0);
        }
      }
      var J = function(h, C, z, F, X, Ne, ae) {
        var Le = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: Nt,
          // Built-in properties that belong on the element
          type: h,
          key: C,
          ref: z,
          props: ae,
          // Record the component responsible for creating this element.
          _owner: Ne
        };
        return Le._store = {}, Object.defineProperty(Le._store, "validated", {
          configurable: !1,
          enumerable: !1,
          writable: !0,
          value: !1
        }), Object.defineProperty(Le, "_self", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: F
        }), Object.defineProperty(Le, "_source", {
          configurable: !1,
          enumerable: !1,
          writable: !1,
          value: X
        }), Object.freeze && (Object.freeze(Le.props), Object.freeze(Le)), Le;
      };
      function xe(h, C, z) {
        var F, X = {}, Ne = null, ae = null, Le = null, ut = null;
        if (C != null) {
          Ir(C) && (ae = C.ref, ca(C)), pn(C) && (bn(C.key), Ne = "" + C.key), Le = C.__self === void 0 ? null : C.__self, ut = C.__source === void 0 ? null : C.__source;
          for (F in C)
            vr.call(C, F) && !Yr.hasOwnProperty(F) && (X[F] = C[F]);
        }
        var xt = arguments.length - 2;
        if (xt === 1)
          X.children = z;
        else if (xt > 1) {
          for (var qt = Array(xt), $t = 0; $t < xt; $t++)
            qt[$t] = arguments[$t + 2];
          Object.freeze && Object.freeze(qt), X.children = qt;
        }
        if (h && h.defaultProps) {
          var Xt = h.defaultProps;
          for (F in Xt)
            X[F] === void 0 && (X[F] = Xt[F]);
        }
        if (Ne || ae) {
          var tn = typeof h == "function" ? h.displayName || h.name || "Unknown" : h;
          Ne && wr(X, tn), ae && ui(X, tn);
        }
        return J(h, Ne, ae, Le, ut, it.current, X);
      }
      function nt(h, C) {
        var z = J(h.type, C, h.ref, h._self, h._source, h._owner, h.props);
        return z;
      }
      function Lt(h, C, z) {
        if (h == null)
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + h + ".");
        var F, X = le({}, h.props), Ne = h.key, ae = h.ref, Le = h._self, ut = h._source, xt = h._owner;
        if (C != null) {
          Ir(C) && (ae = C.ref, xt = it.current), pn(C) && (bn(C.key), Ne = "" + C.key);
          var qt;
          h.type && h.type.defaultProps && (qt = h.type.defaultProps);
          for (F in C)
            vr.call(C, F) && !Yr.hasOwnProperty(F) && (C[F] === void 0 && qt !== void 0 ? X[F] = qt[F] : X[F] = C[F]);
        }
        var $t = arguments.length - 2;
        if ($t === 1)
          X.children = z;
        else if ($t > 1) {
          for (var Xt = Array($t), tn = 0; tn < $t; tn++)
            Xt[tn] = arguments[tn + 2];
          X.children = Xt;
        }
        return J(h.type, Ne, ae, Le, ut, xt, X);
      }
      function At(h) {
        return typeof h == "object" && h !== null && h.$$typeof === Nt;
      }
      var _n = ".", vn = ":";
      function mr(h) {
        var C = /[=:]/g, z = {
          "=": "=0",
          ":": "=2"
        }, F = h.replace(C, function(X) {
          return z[X];
        });
        return "$" + F;
      }
      var Bt = !1, xr = /\/+/g;
      function Ft(h) {
        return h.replace(xr, "$&/");
      }
      function Ht(h, C) {
        return typeof h == "object" && h !== null && h.key != null ? (bn(h.key), mr("" + h.key)) : C.toString(36);
      }
      function Ga(h, C, z, F, X) {
        var Ne = typeof h;
        (Ne === "undefined" || Ne === "boolean") && (h = null);
        var ae = !1;
        if (h === null)
          ae = !0;
        else
          switch (Ne) {
            case "string":
            case "number":
              ae = !0;
              break;
            case "object":
              switch (h.$$typeof) {
                case Nt:
                case Yt:
                  ae = !0;
              }
          }
        if (ae) {
          var Le = h, ut = X(Le), xt = F === "" ? _n + Ht(Le, 0) : F;
          if (dn(ut)) {
            var qt = "";
            xt != null && (qt = Ft(xt) + "/"), Ga(ut, C, qt, "", function(Pf) {
              return Pf;
            });
          } else
            ut != null && (At(ut) && (ut.key && (!Le || Le.key !== ut.key) && bn(ut.key), ut = nt(
              ut,
              // Keep both the (mapped) and old keys if they differ, just as
              // traverseAllChildren used to do for objects as children
              z + // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
              (ut.key && (!Le || Le.key !== ut.key) ? (
                // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                // eslint-disable-next-line react-internal/safe-string-coercion
                Ft("" + ut.key) + "/"
              ) : "") + xt
            )), C.push(ut));
          return 1;
        }
        var $t, Xt, tn = 0, vt = F === "" ? _n : F + vn;
        if (dn(h))
          for (var Mi = 0; Mi < h.length; Mi++)
            $t = h[Mi], Xt = vt + Ht($t, Mi), tn += Ga($t, C, z, Xt, X);
        else {
          var Ku = at(h);
          if (typeof Ku == "function") {
            var Xo = h;
            Ku === Xo.entries && (Bt || Rt("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), Bt = !0);
            for (var Vf = Ku.call(Xo), Za, Ko = 0; !(Za = Vf.next()).done; )
              $t = Za.value, Xt = vt + Ht($t, Ko++), tn += Ga($t, C, z, Xt, X);
          } else if (Ne === "object") {
            var Zo = String(h);
            throw new Error("Objects are not valid as a React child (found: " + (Zo === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : Zo) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return tn;
      }
      function xa(h, C, z) {
        if (h == null)
          return h;
        var F = [], X = 0;
        return Ga(h, F, "", "", function(Ne) {
          return C.call(z, Ne, X++);
        }), F;
      }
      function il(h) {
        var C = 0;
        return xa(h, function() {
          C++;
        }), C;
      }
      function ql(h, C, z) {
        xa(h, function() {
          C.apply(this, arguments);
        }, z);
      }
      function ju(h) {
        return xa(h, function(C) {
          return C;
        }) || [];
      }
      function Di(h) {
        if (!At(h))
          throw new Error("React.Children.only expected to receive a single React element child.");
        return h;
      }
      function ll(h) {
        var C = {
          $$typeof: pe,
          // As a workaround to support multiple concurrent renderers, we categorize
          // some renderers as primary and others as secondary. We only expect
          // there to be two concurrent renderers at most: React Native (primary) and
          // Fabric (secondary); React DOM (primary) and React ART (secondary).
          // Secondary renderers store their context values on separate fields.
          _currentValue: h,
          _currentValue2: h,
          // Used to track how many concurrent renderers this context currently
          // supports within in a single renderer. Such as parallel server rendering.
          _threadCount: 0,
          // These are circular
          Provider: null,
          Consumer: null,
          // Add these to use same hidden class in VM as ServerContext
          _defaultValue: null,
          _globalName: null
        };
        C.Provider = {
          $$typeof: he,
          _context: C
        };
        var z = !1, F = !1, X = !1;
        {
          var Ne = {
            $$typeof: pe,
            _context: C
          };
          Object.defineProperties(Ne, {
            Provider: {
              get: function() {
                return F || (F = !0, ye("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?")), C.Provider;
              },
              set: function(ae) {
                C.Provider = ae;
              }
            },
            _currentValue: {
              get: function() {
                return C._currentValue;
              },
              set: function(ae) {
                C._currentValue = ae;
              }
            },
            _currentValue2: {
              get: function() {
                return C._currentValue2;
              },
              set: function(ae) {
                C._currentValue2 = ae;
              }
            },
            _threadCount: {
              get: function() {
                return C._threadCount;
              },
              set: function(ae) {
                C._threadCount = ae;
              }
            },
            Consumer: {
              get: function() {
                return z || (z = !0, ye("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?")), C.Consumer;
              }
            },
            displayName: {
              get: function() {
                return C.displayName;
              },
              set: function(ae) {
                X || (Rt("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", ae), X = !0);
              }
            }
          }), C.Consumer = Ne;
        }
        return C._currentRenderer = null, C._currentRenderer2 = null, C;
      }
      var fa = -1, oi = 0, da = 1, si = 2;
      function br(h) {
        if (h._status === fa) {
          var C = h._result, z = C();
          if (z.then(function(Ne) {
            if (h._status === oi || h._status === fa) {
              var ae = h;
              ae._status = da, ae._result = Ne;
            }
          }, function(Ne) {
            if (h._status === oi || h._status === fa) {
              var ae = h;
              ae._status = si, ae._result = Ne;
            }
          }), h._status === fa) {
            var F = h;
            F._status = oi, F._result = z;
          }
        }
        if (h._status === da) {
          var X = h._result;
          return X === void 0 && ye(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))

Did you accidentally put curly braces around the import?`, X), "default" in X || ye(`lazy: Expected the result of a dynamic import() call. Instead received: %s

Your code should look like: 
  const MyComponent = lazy(() => import('./MyComponent'))`, X), X.default;
        } else
          throw h._result;
      }
      function pa(h) {
        var C = {
          // We use these fields to store the result.
          _status: fa,
          _result: h
        }, z = {
          $$typeof: Ve,
          _payload: C,
          _init: br
        };
        {
          var F, X;
          Object.defineProperties(z, {
            defaultProps: {
              configurable: !0,
              get: function() {
                return F;
              },
              set: function(Ne) {
                ye("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), F = Ne, Object.defineProperty(z, "defaultProps", {
                  enumerable: !0
                });
              }
            },
            propTypes: {
              configurable: !0,
              get: function() {
                return X;
              },
              set: function(Ne) {
                ye("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it."), X = Ne, Object.defineProperty(z, "propTypes", {
                  enumerable: !0
                });
              }
            }
          });
        }
        return z;
      }
      function ci(h) {
        h != null && h.$$typeof === ie ? ye("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : typeof h != "function" ? ye("forwardRef requires a render function but was given %s.", h === null ? "null" : typeof h) : h.length !== 0 && h.length !== 2 && ye("forwardRef render functions accept exactly two parameters: props and ref. %s", h.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."), h != null && (h.defaultProps != null || h.propTypes != null) && ye("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
        var C = {
          $$typeof: rt,
          render: h
        };
        {
          var z;
          Object.defineProperty(C, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return z;
            },
            set: function(F) {
              z = F, !h.name && !h.displayName && (h.displayName = F);
            }
          });
        }
        return C;
      }
      var R;
      R = Symbol.for("react.module.reference");
      function Y(h) {
        return !!(typeof h == "string" || typeof h == "function" || h === Je || h === It || qe || h === S || h === re || h === me || Ue || h === Ct || Qt || _t || En || typeof h == "object" && h !== null && (h.$$typeof === Ve || h.$$typeof === ie || h.$$typeof === he || h.$$typeof === pe || h.$$typeof === rt || // This needs to include all possible module reference object
        // types supported by any Flight configuration anywhere since
        // we don't know which Flight build this will end up being used
        // with.
        h.$$typeof === R || h.getModuleId !== void 0));
      }
      function ee(h, C) {
        Y(h) || ye("memo: The first argument must be a component. Instead received: %s", h === null ? "null" : typeof h);
        var z = {
          $$typeof: ie,
          type: h,
          compare: C === void 0 ? null : C
        };
        {
          var F;
          Object.defineProperty(z, "displayName", {
            enumerable: !1,
            configurable: !0,
            get: function() {
              return F;
            },
            set: function(X) {
              F = X, !h.name && !h.displayName && (h.displayName = X);
            }
          });
        }
        return z;
      }
      function ce() {
        var h = Qe.current;
        return h === null && ye(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`), h;
      }
      function Ge(h) {
        var C = ce();
        if (h._context !== void 0) {
          var z = h._context;
          z.Consumer === h ? ye("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?") : z.Provider === h && ye("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
        }
        return C.useContext(h);
      }
      function mt(h) {
        var C = ce();
        return C.useState(h);
      }
      function Xe(h, C, z) {
        var F = ce();
        return F.useReducer(h, C, z);
      }
      function De(h) {
        var C = ce();
        return C.useRef(h);
      }
      function Ln(h, C) {
        var z = ce();
        return z.useEffect(h, C);
      }
      function Jt(h, C) {
        var z = ce();
        return z.useInsertionEffect(h, C);
      }
      function en(h, C) {
        var z = ce();
        return z.useLayoutEffect(h, C);
      }
      function tr(h, C) {
        var z = ce();
        return z.useCallback(h, C);
      }
      function fi(h, C) {
        var z = ce();
        return z.useMemo(h, C);
      }
      function Vu(h, C, z) {
        var F = ce();
        return F.useImperativeHandle(h, C, z);
      }
      function Tt(h, C) {
        {
          var z = ce();
          return z.useDebugValue(h, C);
        }
      }
      function Hf() {
        var h = ce();
        return h.useTransition();
      }
      function qa(h) {
        var C = ce();
        return C.useDeferredValue(h);
      }
      function lt() {
        var h = ce();
        return h.useId();
      }
      function di(h, C, z) {
        var F = ce();
        return F.useSyncExternalStore(h, C, z);
      }
      var ul = 0, Pu, ol, Qr, Qo, _r, Wo, Go;
      function Xs() {
      }
      Xs.__reactDisabledLog = !0;
      function Bu() {
        {
          if (ul === 0) {
            Pu = console.log, ol = console.info, Qr = console.warn, Qo = console.error, _r = console.group, Wo = console.groupCollapsed, Go = console.groupEnd;
            var h = {
              configurable: !0,
              enumerable: !0,
              value: Xs,
              writable: !0
            };
            Object.defineProperties(console, {
              info: h,
              log: h,
              warn: h,
              error: h,
              group: h,
              groupCollapsed: h,
              groupEnd: h
            });
          }
          ul++;
        }
      }
      function sl() {
        {
          if (ul--, ul === 0) {
            var h = {
              configurable: !0,
              enumerable: !0,
              writable: !0
            };
            Object.defineProperties(console, {
              log: le({}, h, {
                value: Pu
              }),
              info: le({}, h, {
                value: ol
              }),
              warn: le({}, h, {
                value: Qr
              }),
              error: le({}, h, {
                value: Qo
              }),
              group: le({}, h, {
                value: _r
              }),
              groupCollapsed: le({}, h, {
                value: Wo
              }),
              groupEnd: le({}, h, {
                value: Go
              })
            });
          }
          ul < 0 && ye("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
        }
      }
      var Xa = zt.ReactCurrentDispatcher, kr;
      function cl(h, C, z) {
        {
          if (kr === void 0)
            try {
              throw Error();
            } catch (X) {
              var F = X.stack.trim().match(/\n( *(at )?)/);
              kr = F && F[1] || "";
            }
          return `
` + kr + h;
        }
      }
      var fl = !1, dl;
      {
        var $u = typeof WeakMap == "function" ? WeakMap : Map;
        dl = new $u();
      }
      function Yu(h, C) {
        if (!h || fl)
          return "";
        {
          var z = dl.get(h);
          if (z !== void 0)
            return z;
        }
        var F;
        fl = !0;
        var X = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var Ne;
        Ne = Xa.current, Xa.current = null, Bu();
        try {
          if (C) {
            var ae = function() {
              throw Error();
            };
            if (Object.defineProperty(ae.prototype, "props", {
              set: function() {
                throw Error();
              }
            }), typeof Reflect == "object" && Reflect.construct) {
              try {
                Reflect.construct(ae, []);
              } catch (vt) {
                F = vt;
              }
              Reflect.construct(h, [], ae);
            } else {
              try {
                ae.call();
              } catch (vt) {
                F = vt;
              }
              h.call(ae.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (vt) {
              F = vt;
            }
            h();
          }
        } catch (vt) {
          if (vt && F && typeof vt.stack == "string") {
            for (var Le = vt.stack.split(`
`), ut = F.stack.split(`
`), xt = Le.length - 1, qt = ut.length - 1; xt >= 1 && qt >= 0 && Le[xt] !== ut[qt]; )
              qt--;
            for (; xt >= 1 && qt >= 0; xt--, qt--)
              if (Le[xt] !== ut[qt]) {
                if (xt !== 1 || qt !== 1)
                  do
                    if (xt--, qt--, qt < 0 || Le[xt] !== ut[qt]) {
                      var $t = `
` + Le[xt].replace(" at new ", " at ");
                      return h.displayName && $t.includes("<anonymous>") && ($t = $t.replace("<anonymous>", h.displayName)), typeof h == "function" && dl.set(h, $t), $t;
                    }
                  while (xt >= 1 && qt >= 0);
                break;
              }
          }
        } finally {
          fl = !1, Xa.current = Ne, sl(), Error.prepareStackTrace = X;
        }
        var Xt = h ? h.displayName || h.name : "", tn = Xt ? cl(Xt) : "";
        return typeof h == "function" && dl.set(h, tn), tn;
      }
      function Oi(h, C, z) {
        return Yu(h, !1);
      }
      function jf(h) {
        var C = h.prototype;
        return !!(C && C.isReactComponent);
      }
      function pi(h, C, z) {
        if (h == null)
          return "";
        if (typeof h == "function")
          return Yu(h, jf(h));
        if (typeof h == "string")
          return cl(h);
        switch (h) {
          case re:
            return cl("Suspense");
          case me:
            return cl("SuspenseList");
        }
        if (typeof h == "object")
          switch (h.$$typeof) {
            case rt:
              return Oi(h.render);
            case ie:
              return pi(h.type, C, z);
            case Ve: {
              var F = h, X = F._payload, Ne = F._init;
              try {
                return pi(Ne(X), C, z);
              } catch {
              }
            }
          }
        return "";
      }
      var kt = {}, Iu = zt.ReactDebugCurrentFrame;
      function Xl(h) {
        if (h) {
          var C = h._owner, z = pi(h.type, h._source, C ? C.type : null);
          Iu.setExtraStackFrame(z);
        } else
          Iu.setExtraStackFrame(null);
      }
      function Qu(h, C, z, F, X) {
        {
          var Ne = Function.call.bind(vr);
          for (var ae in h)
            if (Ne(h, ae)) {
              var Le = void 0;
              try {
                if (typeof h[ae] != "function") {
                  var ut = Error((F || "React class") + ": " + z + " type `" + ae + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof h[ae] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  throw ut.name = "Invariant Violation", ut;
                }
                Le = h[ae](C, ae, F, z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (xt) {
                Le = xt;
              }
              Le && !(Le instanceof Error) && (Xl(X), ye("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", F || "React class", z, ae, typeof Le), Xl(null)), Le instanceof Error && !(Le.message in kt) && (kt[Le.message] = !0, Xl(X), ye("Failed %s type: %s", z, Le.message), Xl(null));
            }
        }
      }
      function wt(h) {
        if (h) {
          var C = h._owner, z = pi(h.type, h._source, C ? C.type : null);
          xn(z);
        } else
          xn(null);
      }
      var Wu;
      Wu = !1;
      function Gu() {
        if (it.current) {
          var h = In(it.current.type);
          if (h)
            return `

Check the render method of \`` + h + "`.";
        }
        return "";
      }
      function Ye(h) {
        if (h !== void 0) {
          var C = h.fileName.replace(/^.*[\\\/]/, ""), z = h.lineNumber;
          return `

Check your code at ` + C + ":" + z + ".";
        }
        return "";
      }
      function Kl(h) {
        return h != null ? Ye(h.__source) : "";
      }
      var hn = {};
      function Wr(h) {
        var C = Gu();
        if (!C) {
          var z = typeof h == "string" ? h : h.displayName || h.name;
          z && (C = `

Check the top-level render call using <` + z + ">.");
        }
        return C;
      }
      function Dr(h, C) {
        if (!(!h._store || h._store.validated || h.key != null)) {
          h._store.validated = !0;
          var z = Wr(C);
          if (!hn[z]) {
            hn[z] = !0;
            var F = "";
            h && h._owner && h._owner !== it.current && (F = " It was passed a child from " + In(h._owner.type) + "."), wt(h), ye('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', z, F), wt(null);
          }
        }
      }
      function pl(h, C) {
        if (typeof h == "object") {
          if (dn(h))
            for (var z = 0; z < h.length; z++) {
              var F = h[z];
              At(F) && Dr(F, C);
            }
          else if (At(h))
            h._store && (h._store.validated = !0);
          else if (h) {
            var X = at(h);
            if (typeof X == "function" && X !== h.entries)
              for (var Ne = X.call(h), ae; !(ae = Ne.next()).done; )
                At(ae.value) && Dr(ae.value, C);
          }
        }
      }
      function Cn(h) {
        {
          var C = h.type;
          if (C == null || typeof C == "string")
            return;
          var z;
          if (typeof C == "function")
            z = C.propTypes;
          else if (typeof C == "object" && (C.$$typeof === rt || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          C.$$typeof === ie))
            z = C.propTypes;
          else
            return;
          if (z) {
            var F = In(C);
            Qu(z, h.props, "prop", F, h);
          } else if (C.PropTypes !== void 0 && !Wu) {
            Wu = !0;
            var X = In(C);
            ye("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", X || "Unknown");
          }
          typeof C.getDefaultProps == "function" && !C.getDefaultProps.isReactClassApproved && ye("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
        }
      }
      function jt(h) {
        {
          for (var C = Object.keys(h.props), z = 0; z < C.length; z++) {
            var F = C[z];
            if (F !== "children" && F !== "key") {
              wt(h), ye("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", F), wt(null);
              break;
            }
          }
          h.ref !== null && (wt(h), ye("Invalid attribute `ref` supplied to `React.Fragment`."), wt(null));
        }
      }
      function Ks(h, C, z) {
        var F = Y(h);
        if (!F) {
          var X = "";
          (h === void 0 || typeof h == "object" && h !== null && Object.keys(h).length === 0) && (X += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ne = Kl(C);
          Ne ? X += Ne : X += Gu();
          var ae;
          h === null ? ae = "null" : dn(h) ? ae = "array" : h !== void 0 && h.$$typeof === Nt ? (ae = "<" + (In(h.type) || "Unknown") + " />", X = " Did you accidentally export a JSX literal instead of a component?") : ae = typeof h, ye("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ae, X);
        }
        var Le = xe.apply(this, arguments);
        if (Le == null)
          return Le;
        if (F)
          for (var ut = 2; ut < arguments.length; ut++)
            pl(arguments[ut], h);
        return h === Je ? jt(Le) : Cn(Le), Le;
      }
      var Gr = !1;
      function Qn(h) {
        var C = Ks.bind(null, h);
        return C.type = h, Gr || (Gr = !0, Rt("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.")), Object.defineProperty(C, "type", {
          enumerable: !1,
          get: function() {
            return Rt("Factory.type is deprecated. Access the class directly before passing it to createFactory."), Object.defineProperty(this, "type", {
              value: h
            }), h;
          }
        }), C;
      }
      function vi(h, C, z) {
        for (var F = Lt.apply(this, arguments), X = 2; X < arguments.length; X++)
          pl(arguments[X], F.type);
        return Cn(F), F;
      }
      function Zs(h, C) {
        var z = ct.transition;
        ct.transition = {};
        var F = ct.transition;
        ct.transition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          h();
        } finally {
          if (ct.transition = z, z === null && F._updatedFibers) {
            var X = F._updatedFibers.size;
            X > 10 && Rt("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), F._updatedFibers.clear();
          }
        }
      }
      var Li = !1, vl = null;
      function Js(h) {
        if (vl === null)
          try {
            var C = ("require" + Math.random()).slice(0, 7), z = B && B[C];
            vl = z.call(B, "timers").setImmediate;
          } catch {
            vl = function(X) {
              Li === !1 && (Li = !0, typeof MessageChannel > "u" && ye("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
              var Ne = new MessageChannel();
              Ne.port1.onmessage = X, Ne.port2.postMessage(void 0);
            };
          }
        return vl(h);
      }
      var ba = 0, hl = !1;
      function ml(h) {
        {
          var C = ba;
          ba++, be.current === null && (be.current = []);
          var z = be.isBatchingLegacy, F;
          try {
            if (be.isBatchingLegacy = !0, F = h(), !z && be.didScheduleLegacyUpdate) {
              var X = be.current;
              X !== null && (be.didScheduleLegacyUpdate = !1, gl(X));
            }
          } catch (Xt) {
            throw _a(C), Xt;
          } finally {
            be.isBatchingLegacy = z;
          }
          if (F !== null && typeof F == "object" && typeof F.then == "function") {
            var Ne = F, ae = !1, Le = {
              then: function(Xt, tn) {
                ae = !0, Ne.then(function(vt) {
                  _a(C), ba === 0 ? qu(vt, Xt, tn) : Xt(vt);
                }, function(vt) {
                  _a(C), tn(vt);
                });
              }
            };
            return !hl && typeof Promise < "u" && Promise.resolve().then(function() {
            }).then(function() {
              ae || (hl = !0, ye("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
            }), Le;
          } else {
            var ut = F;
            if (_a(C), ba === 0) {
              var xt = be.current;
              xt !== null && (gl(xt), be.current = null);
              var qt = {
                then: function(Xt, tn) {
                  be.current === null ? (be.current = [], qu(ut, Xt, tn)) : Xt(ut);
                }
              };
              return qt;
            } else {
              var $t = {
                then: function(Xt, tn) {
                  Xt(ut);
                }
              };
              return $t;
            }
          }
        }
      }
      function _a(h) {
        h !== ba - 1 && ye("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "), ba = h;
      }
      function qu(h, C, z) {
        {
          var F = be.current;
          if (F !== null)
            try {
              gl(F), Js(function() {
                F.length === 0 ? (be.current = null, C(h)) : qu(h, C, z);
              });
            } catch (X) {
              z(X);
            }
          else
            C(h);
        }
      }
      var yl = !1;
      function gl(h) {
        if (!yl) {
          yl = !0;
          var C = 0;
          try {
            for (; C < h.length; C++) {
              var z = h[C];
              do
                z = z(!0);
              while (z !== null);
            }
            h.length = 0;
          } catch (F) {
            throw h = h.slice(C + 1), F;
          } finally {
            yl = !1;
          }
        }
      }
      var Zl = Ks, Xu = vi, qo = Qn, Ka = {
        map: xa,
        forEach: ql,
        count: il,
        toArray: ju,
        only: Di
      };
      W.Children = Ka, W.Component = Fe, W.Fragment = Je, W.Profiler = It, W.PureComponent = Ut, W.StrictMode = S, W.Suspense = re, W.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = zt, W.cloneElement = Xu, W.createContext = ll, W.createElement = Zl, W.createFactory = qo, W.createRef = pr, W.forwardRef = ci, W.isValidElement = At, W.lazy = pa, W.memo = ee, W.startTransition = Zs, W.unstable_act = ml, W.useCallback = tr, W.useContext = Ge, W.useDebugValue = Tt, W.useDeferredValue = qa, W.useEffect = Ln, W.useId = lt, W.useImperativeHandle = Vu, W.useInsertionEffect = Jt, W.useLayoutEffect = en, W.useMemo = fi, W.useReducer = Xe, W.useRef = De, W.useState = mt, W.useSyncExternalStore = di, W.useTransition = Hf, W.version = N, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(nk, Kp)), Kp;
}
var eR;
function Bm() {
  return eR || (eR = 1, function(B) {
    process.env.NODE_ENV === "production" ? B.exports = tk() : B.exports = rk();
  }(ek)), Vm;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var tR;
function ak() {
  if (tR)
    return Wp;
  tR = 1;
  var B = Bm(), W = Symbol.for("react.element"), N = Symbol.for("react.fragment"), Nt = Object.prototype.hasOwnProperty, Yt = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Je = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(It, he, pe) {
    var rt, re = {}, me = null, ie = null;
    pe !== void 0 && (me = "" + pe), he.key !== void 0 && (me = "" + he.key), he.ref !== void 0 && (ie = he.ref);
    for (rt in he)
      Nt.call(he, rt) && !Je.hasOwnProperty(rt) && (re[rt] = he[rt]);
    if (It && It.defaultProps)
      for (rt in he = It.defaultProps, he)
        re[rt] === void 0 && (re[rt] = he[rt]);
    return { $$typeof: W, type: It, key: me, ref: ie, props: re, _owner: Yt.current };
  }
  return Wp.Fragment = N, Wp.jsx = S, Wp.jsxs = S, Wp;
}
var Gp = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var nR;
function ik() {
  return nR || (nR = 1, process.env.NODE_ENV !== "production" && function() {
    var B = Bm(), W = Symbol.for("react.element"), N = Symbol.for("react.portal"), Nt = Symbol.for("react.fragment"), Yt = Symbol.for("react.strict_mode"), Je = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), It = Symbol.for("react.context"), he = Symbol.for("react.forward_ref"), pe = Symbol.for("react.suspense"), rt = Symbol.for("react.suspense_list"), re = Symbol.for("react.memo"), me = Symbol.for("react.lazy"), ie = Symbol.for("react.offscreen"), Ve = Symbol.iterator, Ct = "@@iterator";
    function st(R) {
      if (R === null || typeof R != "object")
        return null;
      var Y = Ve && R[Ve] || R[Ct];
      return typeof Y == "function" ? Y : null;
    }
    var fn = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function at(R) {
      {
        for (var Y = arguments.length, ee = new Array(Y > 1 ? Y - 1 : 0), ce = 1; ce < Y; ce++)
          ee[ce - 1] = arguments[ce];
        Qe("error", R, ee);
      }
    }
    function Qe(R, Y, ee) {
      {
        var ce = fn.ReactDebugCurrentFrame, Ge = ce.getStackAddendum();
        Ge !== "" && (Y += "%s", ee = ee.concat([Ge]));
        var mt = ee.map(function(Xe) {
          return String(Xe);
        });
        mt.unshift("Warning: " + Y), Function.prototype.apply.call(console[R], console, mt);
      }
    }
    var ct = !1, be = !1, it = !1, He = !1, nn = !1, xn;
    xn = Symbol.for("react.module.reference");
    function Qt(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === Nt || R === Je || nn || R === Yt || R === pe || R === rt || He || R === ie || ct || be || it || typeof R == "object" && R !== null && (R.$$typeof === me || R.$$typeof === re || R.$$typeof === S || R.$$typeof === It || R.$$typeof === he || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === xn || R.getModuleId !== void 0));
    }
    function _t(R, Y, ee) {
      var ce = R.displayName;
      if (ce)
        return ce;
      var Ge = Y.displayName || Y.name || "";
      return Ge !== "" ? ee + "(" + Ge + ")" : ee;
    }
    function En(R) {
      return R.displayName || "Context";
    }
    function Ue(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && at("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case Nt:
          return "Fragment";
        case N:
          return "Portal";
        case Je:
          return "Profiler";
        case Yt:
          return "StrictMode";
        case pe:
          return "Suspense";
        case rt:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case It:
            var Y = R;
            return En(Y) + ".Consumer";
          case S:
            var ee = R;
            return En(ee._context) + ".Provider";
          case he:
            return _t(R, R.render, "ForwardRef");
          case re:
            var ce = R.displayName || null;
            return ce !== null ? ce : Ue(R.type) || "Memo";
          case me: {
            var Ge = R, mt = Ge._payload, Xe = Ge._init;
            try {
              return Ue(Xe(mt));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var qe = Object.assign, zt = 0, Rt, ye, Z, we, T, $, le;
    function $e() {
    }
    $e.__reactDisabledLog = !0;
    function Fe() {
      {
        if (zt === 0) {
          Rt = console.log, ye = console.info, Z = console.warn, we = console.error, T = console.group, $ = console.groupCollapsed, le = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: $e,
            writable: !0
          };
          Object.defineProperties(console, {
            info: R,
            log: R,
            warn: R,
            error: R,
            group: R,
            groupCollapsed: R,
            groupEnd: R
          });
        }
        zt++;
      }
    }
    function ht() {
      {
        if (zt--, zt === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: qe({}, R, {
              value: Rt
            }),
            info: qe({}, R, {
              value: ye
            }),
            warn: qe({}, R, {
              value: Z
            }),
            error: qe({}, R, {
              value: we
            }),
            group: qe({}, R, {
              value: T
            }),
            groupCollapsed: qe({}, R, {
              value: $
            }),
            groupEnd: qe({}, R, {
              value: le
            })
          });
        }
        zt < 0 && at("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var et = fn.ReactCurrentDispatcher, ft;
    function tt(R, Y, ee) {
      {
        if (ft === void 0)
          try {
            throw Error();
          } catch (Ge) {
            var ce = Ge.stack.trim().match(/\n( *(at )?)/);
            ft = ce && ce[1] || "";
          }
        return `
` + ft + R;
      }
    }
    var Ut = !1, Vr;
    {
      var pr = typeof WeakMap == "function" ? WeakMap : Map;
      Vr = new pr();
    }
    function Pr(R, Y) {
      if (!R || Ut)
        return "";
      {
        var ee = Vr.get(R);
        if (ee !== void 0)
          return ee;
      }
      var ce;
      Ut = !0;
      var Ge = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var mt;
      mt = et.current, et.current = null, Fe();
      try {
        if (Y) {
          var Xe = function() {
            throw Error();
          };
          if (Object.defineProperty(Xe.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Xe, []);
            } catch (Tt) {
              ce = Tt;
            }
            Reflect.construct(R, [], Xe);
          } else {
            try {
              Xe.call();
            } catch (Tt) {
              ce = Tt;
            }
            R.call(Xe.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Tt) {
            ce = Tt;
          }
          R();
        }
      } catch (Tt) {
        if (Tt && ce && typeof Tt.stack == "string") {
          for (var De = Tt.stack.split(`
`), Ln = ce.stack.split(`
`), Jt = De.length - 1, en = Ln.length - 1; Jt >= 1 && en >= 0 && De[Jt] !== Ln[en]; )
            en--;
          for (; Jt >= 1 && en >= 0; Jt--, en--)
            if (De[Jt] !== Ln[en]) {
              if (Jt !== 1 || en !== 1)
                do
                  if (Jt--, en--, en < 0 || De[Jt] !== Ln[en]) {
                    var tr = `
` + De[Jt].replace(" at new ", " at ");
                    return R.displayName && tr.includes("<anonymous>") && (tr = tr.replace("<anonymous>", R.displayName)), typeof R == "function" && Vr.set(R, tr), tr;
                  }
                while (Jt >= 1 && en >= 0);
              break;
            }
        }
      } finally {
        Ut = !1, et.current = mt, ht(), Error.prepareStackTrace = Ge;
      }
      var fi = R ? R.displayName || R.name : "", Vu = fi ? tt(fi) : "";
      return typeof R == "function" && Vr.set(R, Vu), Vu;
    }
    function dn(R, Y, ee) {
      return Pr(R, !1);
    }
    function Yn(R) {
      var Y = R.prototype;
      return !!(Y && Y.isReactComponent);
    }
    function An(R, Y, ee) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return Pr(R, Yn(R));
      if (typeof R == "string")
        return tt(R);
      switch (R) {
        case pe:
          return tt("Suspense");
        case rt:
          return tt("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case he:
            return dn(R.render);
          case re:
            return An(R.type, Y, ee);
          case me: {
            var ce = R, Ge = ce._payload, mt = ce._init;
            try {
              return An(mt(Ge), Y, ee);
            } catch {
            }
          }
        }
      return "";
    }
    var Fn = Object.prototype.hasOwnProperty, bn = {}, Br = fn.ReactDebugCurrentFrame;
    function $r(R) {
      if (R) {
        var Y = R._owner, ee = An(R.type, R._source, Y ? Y.type : null);
        Br.setExtraStackFrame(ee);
      } else
        Br.setExtraStackFrame(null);
    }
    function In(R, Y, ee, ce, Ge) {
      {
        var mt = Function.call.bind(Fn);
        for (var Xe in R)
          if (mt(R, Xe)) {
            var De = void 0;
            try {
              if (typeof R[Xe] != "function") {
                var Ln = Error((ce || "React class") + ": " + ee + " type `" + Xe + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[Xe] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Ln.name = "Invariant Violation", Ln;
              }
              De = R[Xe](Y, Xe, ce, ee, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Jt) {
              De = Jt;
            }
            De && !(De instanceof Error) && ($r(Ge), at("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", ce || "React class", ee, Xe, typeof De), $r(null)), De instanceof Error && !(De.message in bn) && (bn[De.message] = !0, $r(Ge), at("Failed %s type: %s", ee, De.message), $r(null));
          }
      }
    }
    var vr = Array.isArray;
    function Yr(R) {
      return vr(R);
    }
    function hr(R) {
      {
        var Y = typeof Symbol == "function" && Symbol.toStringTag, ee = Y && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return ee;
      }
    }
    function sa(R) {
      try {
        return er(R), !1;
      } catch {
        return !0;
      }
    }
    function er(R) {
      return "" + R;
    }
    function Ir(R) {
      if (sa(R))
        return at("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", hr(R)), er(R);
    }
    var pn = fn.ReactCurrentOwner, wr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ui, ca, J;
    J = {};
    function xe(R) {
      if (Fn.call(R, "ref")) {
        var Y = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (Y && Y.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function nt(R) {
      if (Fn.call(R, "key")) {
        var Y = Object.getOwnPropertyDescriptor(R, "key").get;
        if (Y && Y.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function Lt(R, Y) {
      if (typeof R.ref == "string" && pn.current && Y && pn.current.stateNode !== Y) {
        var ee = Ue(pn.current.type);
        J[ee] || (at('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', Ue(pn.current.type), R.ref), J[ee] = !0);
      }
    }
    function At(R, Y) {
      {
        var ee = function() {
          ui || (ui = !0, at("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Y));
        };
        ee.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: ee,
          configurable: !0
        });
      }
    }
    function _n(R, Y) {
      {
        var ee = function() {
          ca || (ca = !0, at("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", Y));
        };
        ee.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: ee,
          configurable: !0
        });
      }
    }
    var vn = function(R, Y, ee, ce, Ge, mt, Xe) {
      var De = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: W,
        // Built-in properties that belong on the element
        type: R,
        key: Y,
        ref: ee,
        props: Xe,
        // Record the component responsible for creating this element.
        _owner: mt
      };
      return De._store = {}, Object.defineProperty(De._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(De, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: ce
      }), Object.defineProperty(De, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Ge
      }), Object.freeze && (Object.freeze(De.props), Object.freeze(De)), De;
    };
    function mr(R, Y, ee, ce, Ge) {
      {
        var mt, Xe = {}, De = null, Ln = null;
        ee !== void 0 && (Ir(ee), De = "" + ee), nt(Y) && (Ir(Y.key), De = "" + Y.key), xe(Y) && (Ln = Y.ref, Lt(Y, Ge));
        for (mt in Y)
          Fn.call(Y, mt) && !wr.hasOwnProperty(mt) && (Xe[mt] = Y[mt]);
        if (R && R.defaultProps) {
          var Jt = R.defaultProps;
          for (mt in Jt)
            Xe[mt] === void 0 && (Xe[mt] = Jt[mt]);
        }
        if (De || Ln) {
          var en = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          De && At(Xe, en), Ln && _n(Xe, en);
        }
        return vn(R, De, Ln, Ge, ce, pn.current, Xe);
      }
    }
    var Bt = fn.ReactCurrentOwner, xr = fn.ReactDebugCurrentFrame;
    function Ft(R) {
      if (R) {
        var Y = R._owner, ee = An(R.type, R._source, Y ? Y.type : null);
        xr.setExtraStackFrame(ee);
      } else
        xr.setExtraStackFrame(null);
    }
    var Ht;
    Ht = !1;
    function Ga(R) {
      return typeof R == "object" && R !== null && R.$$typeof === W;
    }
    function xa() {
      {
        if (Bt.current) {
          var R = Ue(Bt.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function il(R) {
      {
        if (R !== void 0) {
          var Y = R.fileName.replace(/^.*[\\\/]/, ""), ee = R.lineNumber;
          return `

Check your code at ` + Y + ":" + ee + ".";
        }
        return "";
      }
    }
    var ql = {};
    function ju(R) {
      {
        var Y = xa();
        if (!Y) {
          var ee = typeof R == "string" ? R : R.displayName || R.name;
          ee && (Y = `

Check the top-level render call using <` + ee + ">.");
        }
        return Y;
      }
    }
    function Di(R, Y) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var ee = ju(Y);
        if (ql[ee])
          return;
        ql[ee] = !0;
        var ce = "";
        R && R._owner && R._owner !== Bt.current && (ce = " It was passed a child from " + Ue(R._owner.type) + "."), Ft(R), at('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', ee, ce), Ft(null);
      }
    }
    function ll(R, Y) {
      {
        if (typeof R != "object")
          return;
        if (Yr(R))
          for (var ee = 0; ee < R.length; ee++) {
            var ce = R[ee];
            Ga(ce) && Di(ce, Y);
          }
        else if (Ga(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var Ge = st(R);
          if (typeof Ge == "function" && Ge !== R.entries)
            for (var mt = Ge.call(R), Xe; !(Xe = mt.next()).done; )
              Ga(Xe.value) && Di(Xe.value, Y);
        }
      }
    }
    function fa(R) {
      {
        var Y = R.type;
        if (Y == null || typeof Y == "string")
          return;
        var ee;
        if (typeof Y == "function")
          ee = Y.propTypes;
        else if (typeof Y == "object" && (Y.$$typeof === he || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        Y.$$typeof === re))
          ee = Y.propTypes;
        else
          return;
        if (ee) {
          var ce = Ue(Y);
          In(ee, R.props, "prop", ce, R);
        } else if (Y.PropTypes !== void 0 && !Ht) {
          Ht = !0;
          var Ge = Ue(Y);
          at("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Ge || "Unknown");
        }
        typeof Y.getDefaultProps == "function" && !Y.getDefaultProps.isReactClassApproved && at("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function oi(R) {
      {
        for (var Y = Object.keys(R.props), ee = 0; ee < Y.length; ee++) {
          var ce = Y[ee];
          if (ce !== "children" && ce !== "key") {
            Ft(R), at("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", ce), Ft(null);
            break;
          }
        }
        R.ref !== null && (Ft(R), at("Invalid attribute `ref` supplied to `React.Fragment`."), Ft(null));
      }
    }
    function da(R, Y, ee, ce, Ge, mt) {
      {
        var Xe = Qt(R);
        if (!Xe) {
          var De = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (De += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Ln = il(Ge);
          Ln ? De += Ln : De += xa();
          var Jt;
          R === null ? Jt = "null" : Yr(R) ? Jt = "array" : R !== void 0 && R.$$typeof === W ? (Jt = "<" + (Ue(R.type) || "Unknown") + " />", De = " Did you accidentally export a JSX literal instead of a component?") : Jt = typeof R, at("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Jt, De);
        }
        var en = mr(R, Y, ee, Ge, mt);
        if (en == null)
          return en;
        if (Xe) {
          var tr = Y.children;
          if (tr !== void 0)
            if (ce)
              if (Yr(tr)) {
                for (var fi = 0; fi < tr.length; fi++)
                  ll(tr[fi], R);
                Object.freeze && Object.freeze(tr);
              } else
                at("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              ll(tr, R);
        }
        return R === Nt ? oi(en) : fa(en), en;
      }
    }
    function si(R, Y, ee) {
      return da(R, Y, ee, !0);
    }
    function br(R, Y, ee) {
      return da(R, Y, ee, !1);
    }
    var pa = br, ci = si;
    Gp.Fragment = Nt, Gp.jsx = pa, Gp.jsxs = ci;
  }()), Gp;
}
(function(B) {
  process.env.NODE_ENV === "production" ? B.exports = ak() : B.exports = ik();
})(J_);
const rR = Zp.Fragment, Wa = Zp.jsx, Ff = Zp.jsxs;
var Xp = {}, y0 = {}, lk = {
  get exports() {
    return y0;
  },
  set exports(B) {
    y0 = B;
  }
}, Ia = {}, Pm = {}, uk = {
  get exports() {
    return Pm;
  },
  set exports(B) {
    Pm = B;
  }
}, h0 = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aR;
function ok() {
  return aR || (aR = 1, function(B) {
    function W(Z, we) {
      var T = Z.length;
      Z.push(we);
      e:
        for (; 0 < T; ) {
          var $ = T - 1 >>> 1, le = Z[$];
          if (0 < Yt(le, we))
            Z[$] = we, Z[T] = le, T = $;
          else
            break e;
        }
    }
    function N(Z) {
      return Z.length === 0 ? null : Z[0];
    }
    function Nt(Z) {
      if (Z.length === 0)
        return null;
      var we = Z[0], T = Z.pop();
      if (T !== we) {
        Z[0] = T;
        e:
          for (var $ = 0, le = Z.length, $e = le >>> 1; $ < $e; ) {
            var Fe = 2 * ($ + 1) - 1, ht = Z[Fe], et = Fe + 1, ft = Z[et];
            if (0 > Yt(ht, T))
              et < le && 0 > Yt(ft, ht) ? (Z[$] = ft, Z[et] = T, $ = et) : (Z[$] = ht, Z[Fe] = T, $ = Fe);
            else if (et < le && 0 > Yt(ft, T))
              Z[$] = ft, Z[et] = T, $ = et;
            else
              break e;
          }
      }
      return we;
    }
    function Yt(Z, we) {
      var T = Z.sortIndex - we.sortIndex;
      return T !== 0 ? T : Z.id - we.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Je = performance;
      B.unstable_now = function() {
        return Je.now();
      };
    } else {
      var S = Date, It = S.now();
      B.unstable_now = function() {
        return S.now() - It;
      };
    }
    var he = [], pe = [], rt = 1, re = null, me = 3, ie = !1, Ve = !1, Ct = !1, st = typeof setTimeout == "function" ? setTimeout : null, fn = typeof clearTimeout == "function" ? clearTimeout : null, at = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Qe(Z) {
      for (var we = N(pe); we !== null; ) {
        if (we.callback === null)
          Nt(pe);
        else if (we.startTime <= Z)
          Nt(pe), we.sortIndex = we.expirationTime, W(he, we);
        else
          break;
        we = N(pe);
      }
    }
    function ct(Z) {
      if (Ct = !1, Qe(Z), !Ve)
        if (N(he) !== null)
          Ve = !0, Rt(be);
        else {
          var we = N(pe);
          we !== null && ye(ct, we.startTime - Z);
        }
    }
    function be(Z, we) {
      Ve = !1, Ct && (Ct = !1, fn(nn), nn = -1), ie = !0;
      var T = me;
      try {
        for (Qe(we), re = N(he); re !== null && (!(re.expirationTime > we) || Z && !_t()); ) {
          var $ = re.callback;
          if (typeof $ == "function") {
            re.callback = null, me = re.priorityLevel;
            var le = $(re.expirationTime <= we);
            we = B.unstable_now(), typeof le == "function" ? re.callback = le : re === N(he) && Nt(he), Qe(we);
          } else
            Nt(he);
          re = N(he);
        }
        if (re !== null)
          var $e = !0;
        else {
          var Fe = N(pe);
          Fe !== null && ye(ct, Fe.startTime - we), $e = !1;
        }
        return $e;
      } finally {
        re = null, me = T, ie = !1;
      }
    }
    var it = !1, He = null, nn = -1, xn = 5, Qt = -1;
    function _t() {
      return !(B.unstable_now() - Qt < xn);
    }
    function En() {
      if (He !== null) {
        var Z = B.unstable_now();
        Qt = Z;
        var we = !0;
        try {
          we = He(!0, Z);
        } finally {
          we ? Ue() : (it = !1, He = null);
        }
      } else
        it = !1;
    }
    var Ue;
    if (typeof at == "function")
      Ue = function() {
        at(En);
      };
    else if (typeof MessageChannel < "u") {
      var qe = new MessageChannel(), zt = qe.port2;
      qe.port1.onmessage = En, Ue = function() {
        zt.postMessage(null);
      };
    } else
      Ue = function() {
        st(En, 0);
      };
    function Rt(Z) {
      He = Z, it || (it = !0, Ue());
    }
    function ye(Z, we) {
      nn = st(function() {
        Z(B.unstable_now());
      }, we);
    }
    B.unstable_IdlePriority = 5, B.unstable_ImmediatePriority = 1, B.unstable_LowPriority = 4, B.unstable_NormalPriority = 3, B.unstable_Profiling = null, B.unstable_UserBlockingPriority = 2, B.unstable_cancelCallback = function(Z) {
      Z.callback = null;
    }, B.unstable_continueExecution = function() {
      Ve || ie || (Ve = !0, Rt(be));
    }, B.unstable_forceFrameRate = function(Z) {
      0 > Z || 125 < Z ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : xn = 0 < Z ? Math.floor(1e3 / Z) : 5;
    }, B.unstable_getCurrentPriorityLevel = function() {
      return me;
    }, B.unstable_getFirstCallbackNode = function() {
      return N(he);
    }, B.unstable_next = function(Z) {
      switch (me) {
        case 1:
        case 2:
        case 3:
          var we = 3;
          break;
        default:
          we = me;
      }
      var T = me;
      me = we;
      try {
        return Z();
      } finally {
        me = T;
      }
    }, B.unstable_pauseExecution = function() {
    }, B.unstable_requestPaint = function() {
    }, B.unstable_runWithPriority = function(Z, we) {
      switch (Z) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Z = 3;
      }
      var T = me;
      me = Z;
      try {
        return we();
      } finally {
        me = T;
      }
    }, B.unstable_scheduleCallback = function(Z, we, T) {
      var $ = B.unstable_now();
      switch (typeof T == "object" && T !== null ? (T = T.delay, T = typeof T == "number" && 0 < T ? $ + T : $) : T = $, Z) {
        case 1:
          var le = -1;
          break;
        case 2:
          le = 250;
          break;
        case 5:
          le = 1073741823;
          break;
        case 4:
          le = 1e4;
          break;
        default:
          le = 5e3;
      }
      return le = T + le, Z = { id: rt++, callback: we, priorityLevel: Z, startTime: T, expirationTime: le, sortIndex: -1 }, T > $ ? (Z.sortIndex = T, W(pe, Z), N(he) === null && Z === N(pe) && (Ct ? (fn(nn), nn = -1) : Ct = !0, ye(ct, T - $))) : (Z.sortIndex = le, W(he, Z), Ve || ie || (Ve = !0, Rt(be))), Z;
    }, B.unstable_shouldYield = _t, B.unstable_wrapCallback = function(Z) {
      var we = me;
      return function() {
        var T = me;
        me = we;
        try {
          return Z.apply(this, arguments);
        } finally {
          me = T;
        }
      };
    };
  }(h0)), h0;
}
var m0 = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var iR;
function sk() {
  return iR || (iR = 1, function(B) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var W = !1, N = !1, Nt = 5;
      function Yt(J, xe) {
        var nt = J.length;
        J.push(xe), It(J, xe, nt);
      }
      function Je(J) {
        return J.length === 0 ? null : J[0];
      }
      function S(J) {
        if (J.length === 0)
          return null;
        var xe = J[0], nt = J.pop();
        return nt !== xe && (J[0] = nt, he(J, nt, 0)), xe;
      }
      function It(J, xe, nt) {
        for (var Lt = nt; Lt > 0; ) {
          var At = Lt - 1 >>> 1, _n = J[At];
          if (pe(_n, xe) > 0)
            J[At] = xe, J[Lt] = _n, Lt = At;
          else
            return;
        }
      }
      function he(J, xe, nt) {
        for (var Lt = nt, At = J.length, _n = At >>> 1; Lt < _n; ) {
          var vn = (Lt + 1) * 2 - 1, mr = J[vn], Bt = vn + 1, xr = J[Bt];
          if (pe(mr, xe) < 0)
            Bt < At && pe(xr, mr) < 0 ? (J[Lt] = xr, J[Bt] = xe, Lt = Bt) : (J[Lt] = mr, J[vn] = xe, Lt = vn);
          else if (Bt < At && pe(xr, xe) < 0)
            J[Lt] = xr, J[Bt] = xe, Lt = Bt;
          else
            return;
        }
      }
      function pe(J, xe) {
        var nt = J.sortIndex - xe.sortIndex;
        return nt !== 0 ? nt : J.id - xe.id;
      }
      var rt = 1, re = 2, me = 3, ie = 4, Ve = 5;
      function Ct(J, xe) {
      }
      var st = typeof performance == "object" && typeof performance.now == "function";
      if (st) {
        var fn = performance;
        B.unstable_now = function() {
          return fn.now();
        };
      } else {
        var at = Date, Qe = at.now();
        B.unstable_now = function() {
          return at.now() - Qe;
        };
      }
      var ct = 1073741823, be = -1, it = 250, He = 5e3, nn = 1e4, xn = ct, Qt = [], _t = [], En = 1, Ue = null, qe = me, zt = !1, Rt = !1, ye = !1, Z = typeof setTimeout == "function" ? setTimeout : null, we = typeof clearTimeout == "function" ? clearTimeout : null, T = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function $(J) {
        for (var xe = Je(_t); xe !== null; ) {
          if (xe.callback === null)
            S(_t);
          else if (xe.startTime <= J)
            S(_t), xe.sortIndex = xe.expirationTime, Yt(Qt, xe);
          else
            return;
          xe = Je(_t);
        }
      }
      function le(J) {
        if (ye = !1, $(J), !Rt)
          if (Je(Qt) !== null)
            Rt = !0, Ir($e);
          else {
            var xe = Je(_t);
            xe !== null && pn(le, xe.startTime - J);
          }
      }
      function $e(J, xe) {
        Rt = !1, ye && (ye = !1, wr()), zt = !0;
        var nt = qe;
        try {
          var Lt;
          if (!N)
            return Fe(J, xe);
        } finally {
          Ue = null, qe = nt, zt = !1;
        }
      }
      function Fe(J, xe) {
        var nt = xe;
        for ($(nt), Ue = Je(Qt); Ue !== null && !W && !(Ue.expirationTime > nt && (!J || $r())); ) {
          var Lt = Ue.callback;
          if (typeof Lt == "function") {
            Ue.callback = null, qe = Ue.priorityLevel;
            var At = Ue.expirationTime <= nt, _n = Lt(At);
            nt = B.unstable_now(), typeof _n == "function" ? Ue.callback = _n : Ue === Je(Qt) && S(Qt), $(nt);
          } else
            S(Qt);
          Ue = Je(Qt);
        }
        if (Ue !== null)
          return !0;
        var vn = Je(_t);
        return vn !== null && pn(le, vn.startTime - nt), !1;
      }
      function ht(J, xe) {
        switch (J) {
          case rt:
          case re:
          case me:
          case ie:
          case Ve:
            break;
          default:
            J = me;
        }
        var nt = qe;
        qe = J;
        try {
          return xe();
        } finally {
          qe = nt;
        }
      }
      function et(J) {
        var xe;
        switch (qe) {
          case rt:
          case re:
          case me:
            xe = me;
            break;
          default:
            xe = qe;
            break;
        }
        var nt = qe;
        qe = xe;
        try {
          return J();
        } finally {
          qe = nt;
        }
      }
      function ft(J) {
        var xe = qe;
        return function() {
          var nt = qe;
          qe = xe;
          try {
            return J.apply(this, arguments);
          } finally {
            qe = nt;
          }
        };
      }
      function tt(J, xe, nt) {
        var Lt = B.unstable_now(), At;
        if (typeof nt == "object" && nt !== null) {
          var _n = nt.delay;
          typeof _n == "number" && _n > 0 ? At = Lt + _n : At = Lt;
        } else
          At = Lt;
        var vn;
        switch (J) {
          case rt:
            vn = be;
            break;
          case re:
            vn = it;
            break;
          case Ve:
            vn = xn;
            break;
          case ie:
            vn = nn;
            break;
          case me:
          default:
            vn = He;
            break;
        }
        var mr = At + vn, Bt = {
          id: En++,
          callback: xe,
          priorityLevel: J,
          startTime: At,
          expirationTime: mr,
          sortIndex: -1
        };
        return At > Lt ? (Bt.sortIndex = At, Yt(_t, Bt), Je(Qt) === null && Bt === Je(_t) && (ye ? wr() : ye = !0, pn(le, At - Lt))) : (Bt.sortIndex = mr, Yt(Qt, Bt), !Rt && !zt && (Rt = !0, Ir($e))), Bt;
      }
      function Ut() {
      }
      function Vr() {
        !Rt && !zt && (Rt = !0, Ir($e));
      }
      function pr() {
        return Je(Qt);
      }
      function Pr(J) {
        J.callback = null;
      }
      function dn() {
        return qe;
      }
      var Yn = !1, An = null, Fn = -1, bn = Nt, Br = -1;
      function $r() {
        var J = B.unstable_now() - Br;
        return !(J < bn);
      }
      function In() {
      }
      function vr(J) {
        if (J < 0 || J > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        J > 0 ? bn = Math.floor(1e3 / J) : bn = Nt;
      }
      var Yr = function() {
        if (An !== null) {
          var J = B.unstable_now();
          Br = J;
          var xe = !0, nt = !0;
          try {
            nt = An(xe, J);
          } finally {
            nt ? hr() : (Yn = !1, An = null);
          }
        } else
          Yn = !1;
      }, hr;
      if (typeof T == "function")
        hr = function() {
          T(Yr);
        };
      else if (typeof MessageChannel < "u") {
        var sa = new MessageChannel(), er = sa.port2;
        sa.port1.onmessage = Yr, hr = function() {
          er.postMessage(null);
        };
      } else
        hr = function() {
          Z(Yr, 0);
        };
      function Ir(J) {
        An = J, Yn || (Yn = !0, hr());
      }
      function pn(J, xe) {
        Fn = Z(function() {
          J(B.unstable_now());
        }, xe);
      }
      function wr() {
        we(Fn), Fn = -1;
      }
      var ui = In, ca = null;
      B.unstable_IdlePriority = Ve, B.unstable_ImmediatePriority = rt, B.unstable_LowPriority = ie, B.unstable_NormalPriority = me, B.unstable_Profiling = ca, B.unstable_UserBlockingPriority = re, B.unstable_cancelCallback = Pr, B.unstable_continueExecution = Vr, B.unstable_forceFrameRate = vr, B.unstable_getCurrentPriorityLevel = dn, B.unstable_getFirstCallbackNode = pr, B.unstable_next = et, B.unstable_pauseExecution = Ut, B.unstable_requestPaint = ui, B.unstable_runWithPriority = ht, B.unstable_scheduleCallback = tt, B.unstable_shouldYield = $r, B.unstable_wrapCallback = ft, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(m0)), m0;
}
var lR;
function cR() {
  return lR || (lR = 1, function(B) {
    process.env.NODE_ENV === "production" ? B.exports = ok() : B.exports = sk();
  }(uk)), Pm;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var uR;
function ck() {
  if (uR)
    return Ia;
  uR = 1;
  var B = Bm(), W = cR();
  function N(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, l = 1; l < arguments.length; l++)
      r += "&args[]=" + encodeURIComponent(arguments[l]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var Nt = /* @__PURE__ */ new Set(), Yt = {};
  function Je(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (Yt[n] = r, n = 0; n < r.length; n++)
      Nt.add(r[n]);
  }
  var It = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), he = Object.prototype.hasOwnProperty, pe = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, rt = {}, re = {};
  function me(n) {
    return he.call(re, n) ? !0 : he.call(rt, n) ? !1 : pe.test(n) ? re[n] = !0 : (rt[n] = !0, !1);
  }
  function ie(n, r, l, o) {
    if (l !== null && l.type === 0)
      return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return o ? !1 : l !== null ? !l.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function Ve(n, r, l, o) {
    if (r === null || typeof r > "u" || ie(n, r, l, o))
      return !0;
    if (o)
      return !1;
    if (l !== null)
      switch (l.type) {
        case 3:
          return !r;
        case 4:
          return r === !1;
        case 5:
          return isNaN(r);
        case 6:
          return isNaN(r) || 1 > r;
      }
    return !1;
  }
  function Ct(n, r, l, o, c, d, m) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = o, this.attributeNamespace = c, this.mustUseProperty = l, this.propertyName = n, this.type = r, this.sanitizeURL = d, this.removeEmptyString = m;
  }
  var st = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    st[n] = new Ct(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    st[r] = new Ct(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    st[n] = new Ct(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    st[n] = new Ct(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    st[n] = new Ct(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    st[n] = new Ct(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    st[n] = new Ct(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    st[n] = new Ct(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    st[n] = new Ct(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var fn = /[\-:]([a-z])/g;
  function at(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      fn,
      at
    );
    st[r] = new Ct(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(fn, at);
    st[r] = new Ct(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(fn, at);
    st[r] = new Ct(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    st[n] = new Ct(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), st.xlinkHref = new Ct("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    st[n] = new Ct(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Qe(n, r, l, o) {
    var c = st.hasOwnProperty(r) ? st[r] : null;
    (c !== null ? c.type !== 0 : o || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (Ve(r, l, c, o) && (l = null), o || c === null ? me(r) && (l === null ? n.removeAttribute(r) : n.setAttribute(r, "" + l)) : c.mustUseProperty ? n[c.propertyName] = l === null ? c.type === 3 ? !1 : "" : l : (r = c.attributeName, o = c.attributeNamespace, l === null ? n.removeAttribute(r) : (c = c.type, l = c === 3 || c === 4 && l === !0 ? "" : "" + l, o ? n.setAttributeNS(o, r, l) : n.setAttribute(r, l))));
  }
  var ct = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, be = Symbol.for("react.element"), it = Symbol.for("react.portal"), He = Symbol.for("react.fragment"), nn = Symbol.for("react.strict_mode"), xn = Symbol.for("react.profiler"), Qt = Symbol.for("react.provider"), _t = Symbol.for("react.context"), En = Symbol.for("react.forward_ref"), Ue = Symbol.for("react.suspense"), qe = Symbol.for("react.suspense_list"), zt = Symbol.for("react.memo"), Rt = Symbol.for("react.lazy"), ye = Symbol.for("react.offscreen"), Z = Symbol.iterator;
  function we(n) {
    return n === null || typeof n != "object" ? null : (n = Z && n[Z] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var T = Object.assign, $;
  function le(n) {
    if ($ === void 0)
      try {
        throw Error();
      } catch (l) {
        var r = l.stack.trim().match(/\n( *(at )?)/);
        $ = r && r[1] || "";
      }
    return `
` + $ + n;
  }
  var $e = !1;
  function Fe(n, r) {
    if (!n || $e)
      return "";
    $e = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r)
        if (r = function() {
          throw Error();
        }, Object.defineProperty(r.prototype, "props", { set: function() {
          throw Error();
        } }), typeof Reflect == "object" && Reflect.construct) {
          try {
            Reflect.construct(r, []);
          } catch (A) {
            var o = A;
          }
          Reflect.construct(n, [], r);
        } else {
          try {
            r.call();
          } catch (A) {
            o = A;
          }
          n.call(r.prototype);
        }
      else {
        try {
          throw Error();
        } catch (A) {
          o = A;
        }
        n();
      }
    } catch (A) {
      if (A && o && typeof A.stack == "string") {
        for (var c = A.stack.split(`
`), d = o.stack.split(`
`), m = c.length - 1, E = d.length - 1; 1 <= m && 0 <= E && c[m] !== d[E]; )
          E--;
        for (; 1 <= m && 0 <= E; m--, E--)
          if (c[m] !== d[E]) {
            if (m !== 1 || E !== 1)
              do
                if (m--, E--, 0 > E || c[m] !== d[E]) {
                  var w = `
` + c[m].replace(" at new ", " at ");
                  return n.displayName && w.includes("<anonymous>") && (w = w.replace("<anonymous>", n.displayName)), w;
                }
              while (1 <= m && 0 <= E);
            break;
          }
      }
    } finally {
      $e = !1, Error.prepareStackTrace = l;
    }
    return (n = n ? n.displayName || n.name : "") ? le(n) : "";
  }
  function ht(n) {
    switch (n.tag) {
      case 5:
        return le(n.type);
      case 16:
        return le("Lazy");
      case 13:
        return le("Suspense");
      case 19:
        return le("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Fe(n.type, !1), n;
      case 11:
        return n = Fe(n.type.render, !1), n;
      case 1:
        return n = Fe(n.type, !0), n;
      default:
        return "";
    }
  }
  function et(n) {
    if (n == null)
      return null;
    if (typeof n == "function")
      return n.displayName || n.name || null;
    if (typeof n == "string")
      return n;
    switch (n) {
      case He:
        return "Fragment";
      case it:
        return "Portal";
      case xn:
        return "Profiler";
      case nn:
        return "StrictMode";
      case Ue:
        return "Suspense";
      case qe:
        return "SuspenseList";
    }
    if (typeof n == "object")
      switch (n.$$typeof) {
        case _t:
          return (n.displayName || "Context") + ".Consumer";
        case Qt:
          return (n._context.displayName || "Context") + ".Provider";
        case En:
          var r = n.render;
          return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
        case zt:
          return r = n.displayName || null, r !== null ? r : et(n.type) || "Memo";
        case Rt:
          r = n._payload, n = n._init;
          try {
            return et(n(r));
          } catch {
          }
      }
    return null;
  }
  function ft(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return et(r);
      case 8:
        return r === nn ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function")
          return r.displayName || r.name || null;
        if (typeof r == "string")
          return r;
    }
    return null;
  }
  function tt(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function Ut(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function Vr(n) {
    var r = Ut(n) ? "checked" : "value", l = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), o = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
      var c = l.get, d = l.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return c.call(this);
      }, set: function(m) {
        o = "" + m, d.call(this, m);
      } }), Object.defineProperty(n, r, { enumerable: l.enumerable }), { getValue: function() {
        return o;
      }, setValue: function(m) {
        o = "" + m;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function pr(n) {
    n._valueTracker || (n._valueTracker = Vr(n));
  }
  function Pr(n) {
    if (!n)
      return !1;
    var r = n._valueTracker;
    if (!r)
      return !0;
    var l = r.getValue(), o = "";
    return n && (o = Ut(n) ? n.checked ? "true" : "false" : n.value), n = o, n !== l ? (r.setValue(n), !0) : !1;
  }
  function dn(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u")
      return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function Yn(n, r) {
    var l = r.checked;
    return T({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: l ?? n._wrapperState.initialChecked });
  }
  function An(n, r) {
    var l = r.defaultValue == null ? "" : r.defaultValue, o = r.checked != null ? r.checked : r.defaultChecked;
    l = tt(r.value != null ? r.value : l), n._wrapperState = { initialChecked: o, initialValue: l, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Fn(n, r) {
    r = r.checked, r != null && Qe(n, "checked", r, !1);
  }
  function bn(n, r) {
    Fn(n, r);
    var l = tt(r.value), o = r.type;
    if (l != null)
      o === "number" ? (l === 0 && n.value === "" || n.value != l) && (n.value = "" + l) : n.value !== "" + l && (n.value = "" + l);
    else if (o === "submit" || o === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? $r(n, r.type, l) : r.hasOwnProperty("defaultValue") && $r(n, r.type, tt(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Br(n, r, l) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var o = r.type;
      if (!(o !== "submit" && o !== "reset" || r.value !== void 0 && r.value !== null))
        return;
      r = "" + n._wrapperState.initialValue, l || r === n.value || (n.value = r), n.defaultValue = r;
    }
    l = n.name, l !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, l !== "" && (n.name = l);
  }
  function $r(n, r, l) {
    (r !== "number" || dn(n.ownerDocument) !== n) && (l == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + l && (n.defaultValue = "" + l));
  }
  var In = Array.isArray;
  function vr(n, r, l, o) {
    if (n = n.options, r) {
      r = {};
      for (var c = 0; c < l.length; c++)
        r["$" + l[c]] = !0;
      for (l = 0; l < n.length; l++)
        c = r.hasOwnProperty("$" + n[l].value), n[l].selected !== c && (n[l].selected = c), c && o && (n[l].defaultSelected = !0);
    } else {
      for (l = "" + tt(l), r = null, c = 0; c < n.length; c++) {
        if (n[c].value === l) {
          n[c].selected = !0, o && (n[c].defaultSelected = !0);
          return;
        }
        r !== null || n[c].disabled || (r = n[c]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function Yr(n, r) {
    if (r.dangerouslySetInnerHTML != null)
      throw Error(N(91));
    return T({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function hr(n, r) {
    var l = r.value;
    if (l == null) {
      if (l = r.children, r = r.defaultValue, l != null) {
        if (r != null)
          throw Error(N(92));
        if (In(l)) {
          if (1 < l.length)
            throw Error(N(93));
          l = l[0];
        }
        r = l;
      }
      r == null && (r = ""), l = r;
    }
    n._wrapperState = { initialValue: tt(l) };
  }
  function sa(n, r) {
    var l = tt(r.value), o = tt(r.defaultValue);
    l != null && (l = "" + l, l !== n.value && (n.value = l), r.defaultValue == null && n.defaultValue !== l && (n.defaultValue = l)), o != null && (n.defaultValue = "" + o);
  }
  function er(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Ir(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function pn(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Ir(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var wr, ui = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, l, o, c) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, l, o, c);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n)
      n.innerHTML = r;
    else {
      for (wr = wr || document.createElement("div"), wr.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = wr.firstChild; n.firstChild; )
        n.removeChild(n.firstChild);
      for (; r.firstChild; )
        n.appendChild(r.firstChild);
    }
  });
  function ca(n, r) {
    if (r) {
      var l = n.firstChild;
      if (l && l === n.lastChild && l.nodeType === 3) {
        l.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var J = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, xe = ["Webkit", "ms", "Moz", "O"];
  Object.keys(J).forEach(function(n) {
    xe.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), J[r] = J[n];
    });
  });
  function nt(n, r, l) {
    return r == null || typeof r == "boolean" || r === "" ? "" : l || typeof r != "number" || r === 0 || J.hasOwnProperty(n) && J[n] ? ("" + r).trim() : r + "px";
  }
  function Lt(n, r) {
    n = n.style;
    for (var l in r)
      if (r.hasOwnProperty(l)) {
        var o = l.indexOf("--") === 0, c = nt(l, r[l], o);
        l === "float" && (l = "cssFloat"), o ? n.setProperty(l, c) : n[l] = c;
      }
  }
  var At = T({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function _n(n, r) {
    if (r) {
      if (At[n] && (r.children != null || r.dangerouslySetInnerHTML != null))
        throw Error(N(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null)
          throw Error(N(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML))
          throw Error(N(61));
      }
      if (r.style != null && typeof r.style != "object")
        throw Error(N(62));
    }
  }
  function vn(n, r) {
    if (n.indexOf("-") === -1)
      return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var mr = null;
  function Bt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var xr = null, Ft = null, Ht = null;
  function Ga(n) {
    if (n = ss(n)) {
      if (typeof xr != "function")
        throw Error(N(280));
      var r = n.stateNode;
      r && (r = ke(r), xr(n.stateNode, n.type, r));
    }
  }
  function xa(n) {
    Ft ? Ht ? Ht.push(n) : Ht = [n] : Ft = n;
  }
  function il() {
    if (Ft) {
      var n = Ft, r = Ht;
      if (Ht = Ft = null, Ga(n), r)
        for (n = 0; n < r.length; n++)
          Ga(r[n]);
    }
  }
  function ql(n, r) {
    return n(r);
  }
  function ju() {
  }
  var Di = !1;
  function ll(n, r, l) {
    if (Di)
      return n(r, l);
    Di = !0;
    try {
      return ql(n, r, l);
    } finally {
      Di = !1, (Ft !== null || Ht !== null) && (ju(), il());
    }
  }
  function fa(n, r) {
    var l = n.stateNode;
    if (l === null)
      return null;
    var o = ke(l);
    if (o === null)
      return null;
    l = o[r];
    e:
      switch (r) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (o = !o.disabled) || (n = n.type, o = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !o;
          break e;
        default:
          n = !1;
      }
    if (n)
      return null;
    if (l && typeof l != "function")
      throw Error(N(231, r, typeof l));
    return l;
  }
  var oi = !1;
  if (It)
    try {
      var da = {};
      Object.defineProperty(da, "passive", { get: function() {
        oi = !0;
      } }), window.addEventListener("test", da, da), window.removeEventListener("test", da, da);
    } catch {
      oi = !1;
    }
  function si(n, r, l, o, c, d, m, E, w) {
    var A = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(l, A);
    } catch (Q) {
      this.onError(Q);
    }
  }
  var br = !1, pa = null, ci = !1, R = null, Y = { onError: function(n) {
    br = !0, pa = n;
  } };
  function ee(n, r, l, o, c, d, m, E, w) {
    br = !1, pa = null, si.apply(Y, arguments);
  }
  function ce(n, r, l, o, c, d, m, E, w) {
    if (ee.apply(this, arguments), br) {
      if (br) {
        var A = pa;
        br = !1, pa = null;
      } else
        throw Error(N(198));
      ci || (ci = !0, R = A);
    }
  }
  function Ge(n) {
    var r = n, l = n;
    if (n.alternate)
      for (; r.return; )
        r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (l = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? l : null;
  }
  function mt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null)
        return r.dehydrated;
    }
    return null;
  }
  function Xe(n) {
    if (Ge(n) !== n)
      throw Error(N(188));
  }
  function De(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Ge(n), r === null)
        throw Error(N(188));
      return r !== n ? null : n;
    }
    for (var l = n, o = r; ; ) {
      var c = l.return;
      if (c === null)
        break;
      var d = c.alternate;
      if (d === null) {
        if (o = c.return, o !== null) {
          l = o;
          continue;
        }
        break;
      }
      if (c.child === d.child) {
        for (d = c.child; d; ) {
          if (d === l)
            return Xe(c), n;
          if (d === o)
            return Xe(c), r;
          d = d.sibling;
        }
        throw Error(N(188));
      }
      if (l.return !== o.return)
        l = c, o = d;
      else {
        for (var m = !1, E = c.child; E; ) {
          if (E === l) {
            m = !0, l = c, o = d;
            break;
          }
          if (E === o) {
            m = !0, o = c, l = d;
            break;
          }
          E = E.sibling;
        }
        if (!m) {
          for (E = d.child; E; ) {
            if (E === l) {
              m = !0, l = d, o = c;
              break;
            }
            if (E === o) {
              m = !0, o = d, l = c;
              break;
            }
            E = E.sibling;
          }
          if (!m)
            throw Error(N(189));
        }
      }
      if (l.alternate !== o)
        throw Error(N(190));
    }
    if (l.tag !== 3)
      throw Error(N(188));
    return l.stateNode.current === l ? n : r;
  }
  function Ln(n) {
    return n = De(n), n !== null ? Jt(n) : null;
  }
  function Jt(n) {
    if (n.tag === 5 || n.tag === 6)
      return n;
    for (n = n.child; n !== null; ) {
      var r = Jt(n);
      if (r !== null)
        return r;
      n = n.sibling;
    }
    return null;
  }
  var en = W.unstable_scheduleCallback, tr = W.unstable_cancelCallback, fi = W.unstable_shouldYield, Vu = W.unstable_requestPaint, Tt = W.unstable_now, Hf = W.unstable_getCurrentPriorityLevel, qa = W.unstable_ImmediatePriority, lt = W.unstable_UserBlockingPriority, di = W.unstable_NormalPriority, ul = W.unstable_LowPriority, Pu = W.unstable_IdlePriority, ol = null, Qr = null;
  function Qo(n) {
    if (Qr && typeof Qr.onCommitFiberRoot == "function")
      try {
        Qr.onCommitFiberRoot(ol, n, void 0, (n.current.flags & 128) === 128);
      } catch {
      }
  }
  var _r = Math.clz32 ? Math.clz32 : Xs, Wo = Math.log, Go = Math.LN2;
  function Xs(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (Wo(n) / Go | 0) | 0;
  }
  var Bu = 64, sl = 4194304;
  function Xa(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function kr(n, r) {
    var l = n.pendingLanes;
    if (l === 0)
      return 0;
    var o = 0, c = n.suspendedLanes, d = n.pingedLanes, m = l & 268435455;
    if (m !== 0) {
      var E = m & ~c;
      E !== 0 ? o = Xa(E) : (d &= m, d !== 0 && (o = Xa(d)));
    } else
      m = l & ~c, m !== 0 ? o = Xa(m) : d !== 0 && (o = Xa(d));
    if (o === 0)
      return 0;
    if (r !== 0 && r !== o && !(r & c) && (c = o & -o, d = r & -r, c >= d || c === 16 && (d & 4194240) !== 0))
      return r;
    if (o & 4 && (o |= l & 16), r = n.entangledLanes, r !== 0)
      for (n = n.entanglements, r &= o; 0 < r; )
        l = 31 - _r(r), c = 1 << l, o |= n[l], r &= ~c;
    return o;
  }
  function cl(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function fl(n, r) {
    for (var l = n.suspendedLanes, o = n.pingedLanes, c = n.expirationTimes, d = n.pendingLanes; 0 < d; ) {
      var m = 31 - _r(d), E = 1 << m, w = c[m];
      w === -1 ? (!(E & l) || E & o) && (c[m] = cl(E, r)) : w <= r && (n.expiredLanes |= E), d &= ~E;
    }
  }
  function dl(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function $u() {
    var n = Bu;
    return Bu <<= 1, !(Bu & 4194240) && (Bu = 64), n;
  }
  function Yu(n) {
    for (var r = [], l = 0; 31 > l; l++)
      r.push(n);
    return r;
  }
  function Oi(n, r, l) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - _r(r), n[r] = l;
  }
  function jf(n, r) {
    var l = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var o = n.eventTimes;
    for (n = n.expirationTimes; 0 < l; ) {
      var c = 31 - _r(l), d = 1 << c;
      r[c] = 0, o[c] = -1, n[c] = -1, l &= ~d;
    }
  }
  function pi(n, r) {
    var l = n.entangledLanes |= r;
    for (n = n.entanglements; l; ) {
      var o = 31 - _r(l), c = 1 << o;
      c & r | n[o] & r && (n[o] |= r), l &= ~c;
    }
  }
  var kt = 0;
  function Iu(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Xl, Qu, wt, Wu, Gu, Ye = !1, Kl = [], hn = null, Wr = null, Dr = null, pl = /* @__PURE__ */ new Map(), Cn = /* @__PURE__ */ new Map(), jt = [], Ks = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Gr(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        hn = null;
        break;
      case "dragenter":
      case "dragleave":
        Wr = null;
        break;
      case "mouseover":
      case "mouseout":
        Dr = null;
        break;
      case "pointerover":
      case "pointerout":
        pl.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Cn.delete(r.pointerId);
    }
  }
  function Qn(n, r, l, o, c, d) {
    return n === null || n.nativeEvent !== d ? (n = { blockedOn: r, domEventName: l, eventSystemFlags: o, nativeEvent: d, targetContainers: [c] }, r !== null && (r = ss(r), r !== null && Qu(r)), n) : (n.eventSystemFlags |= o, r = n.targetContainers, c !== null && r.indexOf(c) === -1 && r.push(c), n);
  }
  function vi(n, r, l, o, c) {
    switch (r) {
      case "focusin":
        return hn = Qn(hn, n, r, l, o, c), !0;
      case "dragenter":
        return Wr = Qn(Wr, n, r, l, o, c), !0;
      case "mouseover":
        return Dr = Qn(Dr, n, r, l, o, c), !0;
      case "pointerover":
        var d = c.pointerId;
        return pl.set(d, Qn(pl.get(d) || null, n, r, l, o, c)), !0;
      case "gotpointercapture":
        return d = c.pointerId, Cn.set(d, Qn(Cn.get(d) || null, n, r, l, o, c)), !0;
    }
    return !1;
  }
  function Zs(n) {
    var r = Da(n.target);
    if (r !== null) {
      var l = Ge(r);
      if (l !== null) {
        if (r = l.tag, r === 13) {
          if (r = mt(l), r !== null) {
            n.blockedOn = r, Gu(n.priority, function() {
              wt(l);
            });
            return;
          }
        } else if (r === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function Li(n) {
    if (n.blockedOn !== null)
      return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var l = Xu(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (l === null) {
        l = n.nativeEvent;
        var o = new l.constructor(l.type, l);
        mr = o, l.target.dispatchEvent(o), mr = null;
      } else
        return r = ss(l), r !== null && Qu(r), n.blockedOn = l, !1;
      r.shift();
    }
    return !0;
  }
  function vl(n, r, l) {
    Li(n) && l.delete(r);
  }
  function Js() {
    Ye = !1, hn !== null && Li(hn) && (hn = null), Wr !== null && Li(Wr) && (Wr = null), Dr !== null && Li(Dr) && (Dr = null), pl.forEach(vl), Cn.forEach(vl);
  }
  function ba(n, r) {
    n.blockedOn === r && (n.blockedOn = null, Ye || (Ye = !0, W.unstable_scheduleCallback(W.unstable_NormalPriority, Js)));
  }
  function hl(n) {
    function r(c) {
      return ba(c, n);
    }
    if (0 < Kl.length) {
      ba(Kl[0], n);
      for (var l = 1; l < Kl.length; l++) {
        var o = Kl[l];
        o.blockedOn === n && (o.blockedOn = null);
      }
    }
    for (hn !== null && ba(hn, n), Wr !== null && ba(Wr, n), Dr !== null && ba(Dr, n), pl.forEach(r), Cn.forEach(r), l = 0; l < jt.length; l++)
      o = jt[l], o.blockedOn === n && (o.blockedOn = null);
    for (; 0 < jt.length && (l = jt[0], l.blockedOn === null); )
      Zs(l), l.blockedOn === null && jt.shift();
  }
  var ml = ct.ReactCurrentBatchConfig, _a = !0;
  function qu(n, r, l, o) {
    var c = kt, d = ml.transition;
    ml.transition = null;
    try {
      kt = 1, gl(n, r, l, o);
    } finally {
      kt = c, ml.transition = d;
    }
  }
  function yl(n, r, l, o) {
    var c = kt, d = ml.transition;
    ml.transition = null;
    try {
      kt = 4, gl(n, r, l, o);
    } finally {
      kt = c, ml.transition = d;
    }
  }
  function gl(n, r, l, o) {
    if (_a) {
      var c = Xu(n, r, l, o);
      if (c === null)
        oc(n, r, o, Zl, l), Gr(n, o);
      else if (vi(c, n, r, l, o))
        o.stopPropagation();
      else if (Gr(n, o), r & 4 && -1 < Ks.indexOf(n)) {
        for (; c !== null; ) {
          var d = ss(c);
          if (d !== null && Xl(d), d = Xu(n, r, l, o), d === null && oc(n, r, o, Zl, l), d === c)
            break;
          c = d;
        }
        c !== null && o.stopPropagation();
      } else
        oc(n, r, o, null, l);
    }
  }
  var Zl = null;
  function Xu(n, r, l, o) {
    if (Zl = null, n = Bt(o), n = Da(n), n !== null)
      if (r = Ge(n), r === null)
        n = null;
      else if (l = r.tag, l === 13) {
        if (n = mt(r), n !== null)
          return n;
        n = null;
      } else if (l === 3) {
        if (r.stateNode.current.memoizedState.isDehydrated)
          return r.tag === 3 ? r.stateNode.containerInfo : null;
        n = null;
      } else
        r !== n && (n = null);
    return Zl = n, null;
  }
  function qo(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Hf()) {
          case qa:
            return 1;
          case lt:
            return 4;
          case di:
          case ul:
            return 16;
          case Pu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Ka = null, h = null, C = null;
  function z() {
    if (C)
      return C;
    var n, r = h, l = r.length, o, c = "value" in Ka ? Ka.value : Ka.textContent, d = c.length;
    for (n = 0; n < l && r[n] === c[n]; n++)
      ;
    var m = l - n;
    for (o = 1; o <= m && r[l - o] === c[d - o]; o++)
      ;
    return C = c.slice(n, 1 < o ? 1 - o : void 0);
  }
  function F(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function X() {
    return !0;
  }
  function Ne() {
    return !1;
  }
  function ae(n) {
    function r(l, o, c, d, m) {
      this._reactName = l, this._targetInst = c, this.type = o, this.nativeEvent = d, this.target = m, this.currentTarget = null;
      for (var E in n)
        n.hasOwnProperty(E) && (l = n[E], this[E] = l ? l(d) : d[E]);
      return this.isDefaultPrevented = (d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1) ? X : Ne, this.isPropagationStopped = Ne, this;
    }
    return T(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var l = this.nativeEvent;
      l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = X);
    }, stopPropagation: function() {
      var l = this.nativeEvent;
      l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = X);
    }, persist: function() {
    }, isPersistent: X }), r;
  }
  var Le = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, ut = ae(Le), xt = T({}, Le, { view: 0, detail: 0 }), qt = ae(xt), $t, Xt, tn, vt = T({}, xt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Yf, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== tn && (tn && n.type === "mousemove" ? ($t = n.screenX - tn.screenX, Xt = n.screenY - tn.screenY) : Xt = $t = 0, tn = n), $t);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Xt;
  } }), Mi = ae(vt), Ku = T({}, vt, { dataTransfer: 0 }), Xo = ae(Ku), Vf = T({}, xt, { relatedTarget: 0 }), Za = ae(Vf), Ko = T({}, Le, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Zo = ae(Ko), Pf = T({}, Le, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), $m = ae(Pf), Ym = T({}, Le, { data: 0 }), Bf = ae(Ym), $f = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Jp = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, ev = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function tv(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = ev[n]) ? !!r[n] : !1;
  }
  function Yf() {
    return tv;
  }
  var Ni = T({}, xt, { key: function(n) {
    if (n.key) {
      var r = $f[n.key] || n.key;
      if (r !== "Unidentified")
        return r;
    }
    return n.type === "keypress" ? (n = F(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? Jp[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Yf, charCode: function(n) {
    return n.type === "keypress" ? F(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? F(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), Im = ae(Ni), If = T({}, vt, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), ec = ae(If), Qf = T({}, xt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Yf }), Qm = ae(Qf), tc = T({}, Le, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), nv = ae(tc), qr = T({}, vt, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), zi = ae(qr), Mn = [9, 13, 27, 32], Ja = It && "CompositionEvent" in window, Jl = null;
  It && "documentMode" in document && (Jl = document.documentMode);
  var nc = It && "TextEvent" in window && !Jl, rv = It && (!Ja || Jl && 8 < Jl && 11 >= Jl), Zu = String.fromCharCode(32), av = !1;
  function iv(n, r) {
    switch (n) {
      case "keyup":
        return Mn.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function rc(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var Ju = !1;
  function Wm(n, r) {
    switch (n) {
      case "compositionend":
        return rc(r);
      case "keypress":
        return r.which !== 32 ? null : (av = !0, Zu);
      case "textInput":
        return n = r.data, n === Zu && av ? null : n;
      default:
        return null;
    }
  }
  function Gm(n, r) {
    if (Ju)
      return n === "compositionend" || !Ja && iv(n, r) ? (n = z(), C = h = Ka = null, Ju = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length)
            return r.char;
          if (r.which)
            return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return rv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var lv = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function uv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!lv[n.type] : r === "textarea";
  }
  function ov(n, r, l, o) {
    xa(o), r = ls(r, "onChange"), 0 < r.length && (l = new ut("onChange", "change", null, l, o), n.push({ event: l, listeners: r }));
  }
  var Jo = null, eo = null;
  function to(n) {
    uc(n, 0);
  }
  function no(n) {
    var r = ao(n);
    if (Pr(r))
      return n;
  }
  function sv(n, r) {
    if (n === "change")
      return r;
  }
  var Wf = !1;
  if (It) {
    var Gf;
    if (It) {
      var qf = "oninput" in document;
      if (!qf) {
        var cv = document.createElement("div");
        cv.setAttribute("oninput", "return;"), qf = typeof cv.oninput == "function";
      }
      Gf = qf;
    } else
      Gf = !1;
    Wf = Gf && (!document.documentMode || 9 < document.documentMode);
  }
  function fv() {
    Jo && (Jo.detachEvent("onpropertychange", dv), eo = Jo = null);
  }
  function dv(n) {
    if (n.propertyName === "value" && no(eo)) {
      var r = [];
      ov(r, eo, n, Bt(n)), ll(to, r);
    }
  }
  function qm(n, r, l) {
    n === "focusin" ? (fv(), Jo = r, eo = l, Jo.attachEvent("onpropertychange", dv)) : n === "focusout" && fv();
  }
  function Xm(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown")
      return no(eo);
  }
  function Km(n, r) {
    if (n === "click")
      return no(r);
  }
  function pv(n, r) {
    if (n === "input" || n === "change")
      return no(r);
  }
  function Zm(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var ka = typeof Object.is == "function" ? Object.is : Zm;
  function es(n, r) {
    if (ka(n, r))
      return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null)
      return !1;
    var l = Object.keys(n), o = Object.keys(r);
    if (l.length !== o.length)
      return !1;
    for (o = 0; o < l.length; o++) {
      var c = l[o];
      if (!he.call(r, c) || !ka(n[c], r[c]))
        return !1;
    }
    return !0;
  }
  function vv(n) {
    for (; n && n.firstChild; )
      n = n.firstChild;
    return n;
  }
  function hv(n, r) {
    var l = vv(n);
    n = 0;
    for (var o; l; ) {
      if (l.nodeType === 3) {
        if (o = n + l.textContent.length, n <= r && o >= r)
          return { node: l, offset: r - n };
        n = o;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = vv(l);
    }
  }
  function mv(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? mv(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function ac() {
    for (var n = window, r = dn(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var l = typeof r.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l)
        n = r.contentWindow;
      else
        break;
      r = dn(n.document);
    }
    return r;
  }
  function Ui(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function ic(n) {
    var r = ac(), l = n.focusedElem, o = n.selectionRange;
    if (r !== l && l && l.ownerDocument && mv(l.ownerDocument.documentElement, l)) {
      if (o !== null && Ui(l)) {
        if (r = o.start, n = o.end, n === void 0 && (n = r), "selectionStart" in l)
          l.selectionStart = r, l.selectionEnd = Math.min(n, l.value.length);
        else if (n = (r = l.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var c = l.textContent.length, d = Math.min(o.start, c);
          o = o.end === void 0 ? d : Math.min(o.end, c), !n.extend && d > o && (c = o, o = d, d = c), c = hv(l, d);
          var m = hv(
            l,
            o
          );
          c && m && (n.rangeCount !== 1 || n.anchorNode !== c.node || n.anchorOffset !== c.offset || n.focusNode !== m.node || n.focusOffset !== m.offset) && (r = r.createRange(), r.setStart(c.node, c.offset), n.removeAllRanges(), d > o ? (n.addRange(r), n.extend(m.node, m.offset)) : (r.setEnd(m.node, m.offset), n.addRange(r)));
        }
      }
      for (r = [], n = l; n = n.parentNode; )
        n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof l.focus == "function" && l.focus(), l = 0; l < r.length; l++)
        n = r[l], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var yv = It && "documentMode" in document && 11 >= document.documentMode, ei = null, Xf = null, ts = null, Kf = !1;
  function gv(n, r, l) {
    var o = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Kf || ei == null || ei !== dn(o) || (o = ei, "selectionStart" in o && Ui(o) ? o = { start: o.selectionStart, end: o.selectionEnd } : (o = (o.ownerDocument && o.ownerDocument.defaultView || window).getSelection(), o = { anchorNode: o.anchorNode, anchorOffset: o.anchorOffset, focusNode: o.focusNode, focusOffset: o.focusOffset }), ts && es(ts, o) || (ts = o, o = ls(Xf, "onSelect"), 0 < o.length && (r = new ut("onSelect", "select", null, r, l), n.push({ event: r, listeners: o }), r.target = ei)));
  }
  function lc(n, r) {
    var l = {};
    return l[n.toLowerCase()] = r.toLowerCase(), l["Webkit" + n] = "webkit" + r, l["Moz" + n] = "moz" + r, l;
  }
  var eu = { animationend: lc("Animation", "AnimationEnd"), animationiteration: lc("Animation", "AnimationIteration"), animationstart: lc("Animation", "AnimationStart"), transitionend: lc("Transition", "TransitionEnd") }, Zf = {}, Jf = {};
  It && (Jf = document.createElement("div").style, "AnimationEvent" in window || (delete eu.animationend.animation, delete eu.animationiteration.animation, delete eu.animationstart.animation), "TransitionEvent" in window || delete eu.transitionend.transition);
  function Wn(n) {
    if (Zf[n])
      return Zf[n];
    if (!eu[n])
      return n;
    var r = eu[n], l;
    for (l in r)
      if (r.hasOwnProperty(l) && l in Jf)
        return Zf[n] = r[l];
    return n;
  }
  var ed = Wn("animationend"), Sv = Wn("animationiteration"), Ev = Wn("animationstart"), Cv = Wn("transitionend"), Rv = /* @__PURE__ */ new Map(), Tv = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Ai(n, r) {
    Rv.set(n, r), Je(r, [n]);
  }
  for (var ns = 0; ns < Tv.length; ns++) {
    var tu = Tv[ns], Jm = tu.toLowerCase(), rs = tu[0].toUpperCase() + tu.slice(1);
    Ai(Jm, "on" + rs);
  }
  Ai(ed, "onAnimationEnd"), Ai(Sv, "onAnimationIteration"), Ai(Ev, "onAnimationStart"), Ai("dblclick", "onDoubleClick"), Ai("focusin", "onFocus"), Ai("focusout", "onBlur"), Ai(Cv, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), Je("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Je("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Je("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Je("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Je("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Je("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var as = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), ey = new Set("cancel close invalid load scroll toggle".split(" ").concat(as));
  function wv(n, r, l) {
    var o = n.type || "unknown-event";
    n.currentTarget = l, ce(o, r, void 0, n), n.currentTarget = null;
  }
  function uc(n, r) {
    r = (r & 4) !== 0;
    for (var l = 0; l < n.length; l++) {
      var o = n[l], c = o.event;
      o = o.listeners;
      e: {
        var d = void 0;
        if (r)
          for (var m = o.length - 1; 0 <= m; m--) {
            var E = o[m], w = E.instance, A = E.currentTarget;
            if (E = E.listener, w !== d && c.isPropagationStopped())
              break e;
            wv(c, E, A), d = w;
          }
        else
          for (m = 0; m < o.length; m++) {
            if (E = o[m], w = E.instance, A = E.currentTarget, E = E.listener, w !== d && c.isPropagationStopped())
              break e;
            wv(c, E, A), d = w;
          }
      }
    }
    if (ci)
      throw n = R, ci = !1, R = null, n;
  }
  function Kt(n, r) {
    var l = r[ud];
    l === void 0 && (l = r[ud] = /* @__PURE__ */ new Set());
    var o = n + "__bubble";
    l.has(o) || (xv(r, n, 2, !1), l.add(o));
  }
  function Sl(n, r, l) {
    var o = 0;
    r && (o |= 4), xv(l, n, o, r);
  }
  var Fi = "_reactListening" + Math.random().toString(36).slice(2);
  function ro(n) {
    if (!n[Fi]) {
      n[Fi] = !0, Nt.forEach(function(l) {
        l !== "selectionchange" && (ey.has(l) || Sl(l, !1, n), Sl(l, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Fi] || (r[Fi] = !0, Sl("selectionchange", !1, r));
    }
  }
  function xv(n, r, l, o) {
    switch (qo(r)) {
      case 1:
        var c = qu;
        break;
      case 4:
        c = yl;
        break;
      default:
        c = gl;
    }
    l = c.bind(null, r, l, n), c = void 0, !oi || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (c = !0), o ? c !== void 0 ? n.addEventListener(r, l, { capture: !0, passive: c }) : n.addEventListener(r, l, !0) : c !== void 0 ? n.addEventListener(r, l, { passive: c }) : n.addEventListener(r, l, !1);
  }
  function oc(n, r, l, o, c) {
    var d = o;
    if (!(r & 1) && !(r & 2) && o !== null)
      e:
        for (; ; ) {
          if (o === null)
            return;
          var m = o.tag;
          if (m === 3 || m === 4) {
            var E = o.stateNode.containerInfo;
            if (E === c || E.nodeType === 8 && E.parentNode === c)
              break;
            if (m === 4)
              for (m = o.return; m !== null; ) {
                var w = m.tag;
                if ((w === 3 || w === 4) && (w = m.stateNode.containerInfo, w === c || w.nodeType === 8 && w.parentNode === c))
                  return;
                m = m.return;
              }
            for (; E !== null; ) {
              if (m = Da(E), m === null)
                return;
              if (w = m.tag, w === 5 || w === 6) {
                o = d = m;
                continue e;
              }
              E = E.parentNode;
            }
          }
          o = o.return;
        }
    ll(function() {
      var A = d, Q = Bt(l), G = [];
      e: {
        var I = Rv.get(n);
        if (I !== void 0) {
          var oe = ut, ge = n;
          switch (n) {
            case "keypress":
              if (F(l) === 0)
                break e;
            case "keydown":
            case "keyup":
              oe = Im;
              break;
            case "focusin":
              ge = "focus", oe = Za;
              break;
            case "focusout":
              ge = "blur", oe = Za;
              break;
            case "beforeblur":
            case "afterblur":
              oe = Za;
              break;
            case "click":
              if (l.button === 2)
                break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              oe = Mi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              oe = Xo;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              oe = Qm;
              break;
            case ed:
            case Sv:
            case Ev:
              oe = Zo;
              break;
            case Cv:
              oe = nv;
              break;
            case "scroll":
              oe = qt;
              break;
            case "wheel":
              oe = zi;
              break;
            case "copy":
            case "cut":
            case "paste":
              oe = $m;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              oe = ec;
          }
          var Ce = (r & 4) !== 0, Dn = !Ce && n === "scroll", k = Ce ? I !== null ? I + "Capture" : null : I;
          Ce = [];
          for (var b = A, L; b !== null; ) {
            L = b;
            var K = L.stateNode;
            if (L.tag === 5 && K !== null && (L = K, k !== null && (K = fa(b, k), K != null && Ce.push(is(b, K, L)))), Dn)
              break;
            b = b.return;
          }
          0 < Ce.length && (I = new oe(I, ge, null, l, Q), G.push({ event: I, listeners: Ce }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (I = n === "mouseover" || n === "pointerover", oe = n === "mouseout" || n === "pointerout", I && l !== mr && (ge = l.relatedTarget || l.fromElement) && (Da(ge) || ge[Hi]))
            break e;
          if ((oe || I) && (I = Q.window === Q ? Q : (I = Q.ownerDocument) ? I.defaultView || I.parentWindow : window, oe ? (ge = l.relatedTarget || l.toElement, oe = A, ge = ge ? Da(ge) : null, ge !== null && (Dn = Ge(ge), ge !== Dn || ge.tag !== 5 && ge.tag !== 6) && (ge = null)) : (oe = null, ge = A), oe !== ge)) {
            if (Ce = Mi, K = "onMouseLeave", k = "onMouseEnter", b = "mouse", (n === "pointerout" || n === "pointerover") && (Ce = ec, K = "onPointerLeave", k = "onPointerEnter", b = "pointer"), Dn = oe == null ? I : ao(oe), L = ge == null ? I : ao(ge), I = new Ce(K, b + "leave", oe, l, Q), I.target = Dn, I.relatedTarget = L, K = null, Da(Q) === A && (Ce = new Ce(k, b + "enter", ge, l, Q), Ce.target = L, Ce.relatedTarget = Dn, K = Ce), Dn = K, oe && ge)
              t: {
                for (Ce = oe, k = ge, b = 0, L = Ce; L; L = nu(L))
                  b++;
                for (L = 0, K = k; K; K = nu(K))
                  L++;
                for (; 0 < b - L; )
                  Ce = nu(Ce), b--;
                for (; 0 < L - b; )
                  k = nu(k), L--;
                for (; b--; ) {
                  if (Ce === k || k !== null && Ce === k.alternate)
                    break t;
                  Ce = nu(Ce), k = nu(k);
                }
                Ce = null;
              }
            else
              Ce = null;
            oe !== null && td(G, I, oe, Ce, !1), ge !== null && Dn !== null && td(G, Dn, ge, Ce, !0);
          }
        }
        e: {
          if (I = A ? ao(A) : window, oe = I.nodeName && I.nodeName.toLowerCase(), oe === "select" || oe === "input" && I.type === "file")
            var Re = sv;
          else if (uv(I))
            if (Wf)
              Re = pv;
            else {
              Re = Xm;
              var Se = qm;
            }
          else
            (oe = I.nodeName) && oe.toLowerCase() === "input" && (I.type === "checkbox" || I.type === "radio") && (Re = Km);
          if (Re && (Re = Re(n, A))) {
            ov(G, Re, l, Q);
            break e;
          }
          Se && Se(n, I, A), n === "focusout" && (Se = I._wrapperState) && Se.controlled && I.type === "number" && $r(I, "number", I.value);
        }
        switch (Se = A ? ao(A) : window, n) {
          case "focusin":
            (uv(Se) || Se.contentEditable === "true") && (ei = Se, Xf = A, ts = null);
            break;
          case "focusout":
            ts = Xf = ei = null;
            break;
          case "mousedown":
            Kf = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Kf = !1, gv(G, l, Q);
            break;
          case "selectionchange":
            if (yv)
              break;
          case "keydown":
          case "keyup":
            gv(G, l, Q);
        }
        var _e;
        if (Ja)
          e: {
            switch (n) {
              case "compositionstart":
                var Be = "onCompositionStart";
                break e;
              case "compositionend":
                Be = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Be = "onCompositionUpdate";
                break e;
            }
            Be = void 0;
          }
        else
          Ju ? iv(n, l) && (Be = "onCompositionEnd") : n === "keydown" && l.keyCode === 229 && (Be = "onCompositionStart");
        Be && (rv && l.locale !== "ko" && (Ju || Be !== "onCompositionStart" ? Be === "onCompositionEnd" && Ju && (_e = z()) : (Ka = Q, h = "value" in Ka ? Ka.value : Ka.textContent, Ju = !0)), Se = ls(A, Be), 0 < Se.length && (Be = new Bf(Be, n, null, l, Q), G.push({ event: Be, listeners: Se }), _e ? Be.data = _e : (_e = rc(l), _e !== null && (Be.data = _e)))), (_e = nc ? Wm(n, l) : Gm(n, l)) && (A = ls(A, "onBeforeInput"), 0 < A.length && (Q = new Bf("onBeforeInput", "beforeinput", null, l, Q), G.push({ event: Q, listeners: A }), Q.data = _e));
      }
      uc(G, r);
    });
  }
  function is(n, r, l) {
    return { instance: n, listener: r, currentTarget: l };
  }
  function ls(n, r) {
    for (var l = r + "Capture", o = []; n !== null; ) {
      var c = n, d = c.stateNode;
      c.tag === 5 && d !== null && (c = d, d = fa(n, l), d != null && o.unshift(is(n, d, c)), d = fa(n, r), d != null && o.push(is(n, d, c))), n = n.return;
    }
    return o;
  }
  function nu(n) {
    if (n === null)
      return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function td(n, r, l, o, c) {
    for (var d = r._reactName, m = []; l !== null && l !== o; ) {
      var E = l, w = E.alternate, A = E.stateNode;
      if (w !== null && w === o)
        break;
      E.tag === 5 && A !== null && (E = A, c ? (w = fa(l, d), w != null && m.unshift(is(l, w, E))) : c || (w = fa(l, d), w != null && m.push(is(l, w, E)))), l = l.return;
    }
    m.length !== 0 && n.push({ event: r, listeners: m });
  }
  var nd = /\r\n?/g, ty = /\u0000|\uFFFD/g;
  function rd(n) {
    return (typeof n == "string" ? n : "" + n).replace(nd, `
`).replace(ty, "");
  }
  function sc(n, r, l) {
    if (r = rd(r), rd(n) !== r && l)
      throw Error(N(425));
  }
  function cc() {
  }
  var ad = null, ru = null;
  function us(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var au = typeof setTimeout == "function" ? setTimeout : void 0, bv = typeof clearTimeout == "function" ? clearTimeout : void 0, id = typeof Promise == "function" ? Promise : void 0, ld = typeof queueMicrotask == "function" ? queueMicrotask : typeof id < "u" ? function(n) {
    return id.resolve(null).then(n).catch(ny);
  } : au;
  function ny(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function El(n, r) {
    var l = r, o = 0;
    do {
      var c = l.nextSibling;
      if (n.removeChild(l), c && c.nodeType === 8)
        if (l = c.data, l === "/$") {
          if (o === 0) {
            n.removeChild(c), hl(r);
            return;
          }
          o--;
        } else
          l !== "$" && l !== "$?" && l !== "$!" || o++;
      l = c;
    } while (l);
    hl(r);
  }
  function ti(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3)
        break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?")
          break;
        if (r === "/$")
          return null;
      }
    }
    return n;
  }
  function os(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var l = n.data;
        if (l === "$" || l === "$!" || l === "$?") {
          if (r === 0)
            return n;
          r--;
        } else
          l === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var Cl = Math.random().toString(36).slice(2), hi = "__reactFiber$" + Cl, iu = "__reactProps$" + Cl, Hi = "__reactContainer$" + Cl, ud = "__reactEvents$" + Cl, ry = "__reactListeners$" + Cl, od = "__reactHandles$" + Cl;
  function Da(n) {
    var r = n[hi];
    if (r)
      return r;
    for (var l = n.parentNode; l; ) {
      if (r = l[Hi] || l[hi]) {
        if (l = r.alternate, r.child !== null || l !== null && l.child !== null)
          for (n = os(n); n !== null; ) {
            if (l = n[hi])
              return l;
            n = os(n);
          }
        return r;
      }
      n = l, l = n.parentNode;
    }
    return null;
  }
  function ss(n) {
    return n = n[hi] || n[Hi], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ao(n) {
    if (n.tag === 5 || n.tag === 6)
      return n.stateNode;
    throw Error(N(33));
  }
  function ke(n) {
    return n[iu] || null;
  }
  var Rl = [], rn = -1;
  function Ke(n) {
    return { current: n };
  }
  function Mt(n) {
    0 > rn || (n.current = Rl[rn], Rl[rn] = null, rn--);
  }
  function Vt(n, r) {
    rn++, Rl[rn] = n.current, n.current = r;
  }
  var mi = {}, Pe = Ke(mi), Rn = Ke(!1), Xr = mi;
  function Oa(n, r) {
    var l = n.type.contextTypes;
    if (!l)
      return mi;
    var o = n.stateNode;
    if (o && o.__reactInternalMemoizedUnmaskedChildContext === r)
      return o.__reactInternalMemoizedMaskedChildContext;
    var c = {}, d;
    for (d in l)
      c[d] = r[d];
    return o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = c), c;
  }
  function sn(n) {
    return n = n.childContextTypes, n != null;
  }
  function La() {
    Mt(Rn), Mt(Pe);
  }
  function Tl(n, r, l) {
    if (Pe.current !== mi)
      throw Error(N(168));
    Vt(Pe, r), Vt(Rn, l);
  }
  function cs(n, r, l) {
    var o = n.stateNode;
    if (r = r.childContextTypes, typeof o.getChildContext != "function")
      return l;
    o = o.getChildContext();
    for (var c in o)
      if (!(c in r))
        throw Error(N(108, ft(n) || "Unknown", c));
    return T({}, l, o);
  }
  function fc(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || mi, Xr = Pe.current, Vt(Pe, n), Vt(Rn, Rn.current), !0;
  }
  function _v(n, r, l) {
    var o = n.stateNode;
    if (!o)
      throw Error(N(169));
    l ? (n = cs(n, r, Xr), o.__reactInternalMemoizedMergedChildContext = n, Mt(Rn), Mt(Pe), Vt(Pe, n)) : Mt(Rn), Vt(Rn, l);
  }
  var va = null, Gn = !1, fs = !1;
  function sd(n) {
    va === null ? va = [n] : va.push(n);
  }
  function cd(n) {
    Gn = !0, sd(n);
  }
  function Kr() {
    if (!fs && va !== null) {
      fs = !0;
      var n = 0, r = kt;
      try {
        var l = va;
        for (kt = 1; n < l.length; n++) {
          var o = l[n];
          do
            o = o(!0);
          while (o !== null);
        }
        va = null, Gn = !1;
      } catch (c) {
        throw va !== null && (va = va.slice(n + 1)), en(qa, Kr), c;
      } finally {
        kt = r, fs = !1;
      }
    }
    return null;
  }
  var wl = [], Zr = 0, lu = null, io = 0, Jr = [], yr = 0, Ma = null, nr = 1, ji = "";
  function ha(n, r) {
    wl[Zr++] = io, wl[Zr++] = lu, lu = n, io = r;
  }
  function fd(n, r, l) {
    Jr[yr++] = nr, Jr[yr++] = ji, Jr[yr++] = Ma, Ma = n;
    var o = nr;
    n = ji;
    var c = 32 - _r(o) - 1;
    o &= ~(1 << c), l += 1;
    var d = 32 - _r(r) + c;
    if (30 < d) {
      var m = c - c % 5;
      d = (o & (1 << m) - 1).toString(32), o >>= m, c -= m, nr = 1 << 32 - _r(r) + c | l << c | o, ji = d + n;
    } else
      nr = 1 << d | l << c | o, ji = n;
  }
  function dc(n) {
    n.return !== null && (ha(n, 1), fd(n, 1, 0));
  }
  function dd(n) {
    for (; n === lu; )
      lu = wl[--Zr], wl[Zr] = null, io = wl[--Zr], wl[Zr] = null;
    for (; n === Ma; )
      Ma = Jr[--yr], Jr[yr] = null, ji = Jr[--yr], Jr[yr] = null, nr = Jr[--yr], Jr[yr] = null;
  }
  var ma = null, ea = null, an = !1, Na = null;
  function pd(n, r) {
    var l = ja(5, null, null, 0);
    l.elementType = "DELETED", l.stateNode = r, l.return = n, r = n.deletions, r === null ? (n.deletions = [l], n.flags |= 16) : r.push(l);
  }
  function kv(n, r) {
    switch (n.tag) {
      case 5:
        var l = n.type;
        return r = r.nodeType !== 1 || l.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, ma = n, ea = ti(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, ma = n, ea = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (l = Ma !== null ? { id: nr, overflow: ji } : null, n.memoizedState = { dehydrated: r, treeContext: l, retryLane: 1073741824 }, l = ja(18, null, null, 0), l.stateNode = r, l.return = n, n.child = l, ma = n, ea = null, !0) : !1;
      default:
        return !1;
    }
  }
  function pc(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function vc(n) {
    if (an) {
      var r = ea;
      if (r) {
        var l = r;
        if (!kv(n, r)) {
          if (pc(n))
            throw Error(N(418));
          r = ti(l.nextSibling);
          var o = ma;
          r && kv(n, r) ? pd(o, l) : (n.flags = n.flags & -4097 | 2, an = !1, ma = n);
        }
      } else {
        if (pc(n))
          throw Error(N(418));
        n.flags = n.flags & -4097 | 2, an = !1, ma = n;
      }
    }
  }
  function Dv(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; )
      n = n.return;
    ma = n;
  }
  function hc(n) {
    if (n !== ma)
      return !1;
    if (!an)
      return Dv(n), an = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !us(n.type, n.memoizedProps)), r && (r = ea)) {
      if (pc(n))
        throw Ov(), Error(N(418));
      for (; r; )
        pd(n, r), r = ti(r.nextSibling);
    }
    if (Dv(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n)
        throw Error(N(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var l = n.data;
            if (l === "/$") {
              if (r === 0) {
                ea = ti(n.nextSibling);
                break e;
              }
              r--;
            } else
              l !== "$" && l !== "$!" && l !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        ea = null;
      }
    } else
      ea = ma ? ti(n.stateNode.nextSibling) : null;
    return !0;
  }
  function Ov() {
    for (var n = ea; n; )
      n = ti(n.nextSibling);
  }
  function mn() {
    ea = ma = null, an = !1;
  }
  function vd(n) {
    Na === null ? Na = [n] : Na.push(n);
  }
  var mc = ct.ReactCurrentBatchConfig;
  function ya(n, r) {
    if (n && n.defaultProps) {
      r = T({}, r), n = n.defaultProps;
      for (var l in n)
        r[l] === void 0 && (r[l] = n[l]);
      return r;
    }
    return r;
  }
  var yi = Ke(null), yc = null, xl = null, hd = null;
  function md() {
    hd = xl = yc = null;
  }
  function bl(n) {
    var r = yi.current;
    Mt(yi), n._currentValue = r;
  }
  function qn(n, r, l) {
    for (; n !== null; ) {
      var o = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, o !== null && (o.childLanes |= r)) : o !== null && (o.childLanes & r) !== r && (o.childLanes |= r), n === l)
        break;
      n = n.return;
    }
  }
  function te(n, r) {
    yc = n, hd = xl = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Nn = !0), n.firstContext = null);
  }
  function kn(n) {
    var r = n._currentValue;
    if (hd !== n)
      if (n = { context: n, memoizedValue: r, next: null }, xl === null) {
        if (yc === null)
          throw Error(N(308));
        xl = n, yc.dependencies = { lanes: 0, firstContext: n };
      } else
        xl = xl.next = n;
    return r;
  }
  var rr = null;
  function yd(n) {
    rr === null ? rr = [n] : rr.push(n);
  }
  function Lv(n, r, l, o) {
    var c = r.interleaved;
    return c === null ? (l.next = l, yd(r)) : (l.next = c.next, c.next = l), r.interleaved = l, Vi(n, o);
  }
  function Vi(n, r) {
    n.lanes |= r;
    var l = n.alternate;
    for (l !== null && (l.lanes |= r), l = n, n = n.return; n !== null; )
      n.childLanes |= r, l = n.alternate, l !== null && (l.childLanes |= r), l = n, n = n.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var _l = !1;
  function gd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Hn(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Pi(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function kl(n, r, l) {
    var o = n.updateQueue;
    if (o === null)
      return null;
    if (o = o.shared, dt & 2) {
      var c = o.pending;
      return c === null ? r.next = r : (r.next = c.next, c.next = r), o.pending = r, Vi(n, l);
    }
    return c = o.interleaved, c === null ? (r.next = r, yd(o)) : (r.next = c.next, c.next = r), o.interleaved = r, Vi(n, l);
  }
  function gc(n, r, l) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (l & 4194240) !== 0)) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, pi(n, l);
    }
  }
  function Sd(n, r) {
    var l = n.updateQueue, o = n.alternate;
    if (o !== null && (o = o.updateQueue, l === o)) {
      var c = null, d = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var m = { eventTime: l.eventTime, lane: l.lane, tag: l.tag, payload: l.payload, callback: l.callback, next: null };
          d === null ? c = d = m : d = d.next = m, l = l.next;
        } while (l !== null);
        d === null ? c = d = r : d = d.next = r;
      } else
        c = d = r;
      l = { baseState: o.baseState, firstBaseUpdate: c, lastBaseUpdate: d, shared: o.shared, effects: o.effects }, n.updateQueue = l;
      return;
    }
    n = l.lastBaseUpdate, n === null ? l.firstBaseUpdate = r : n.next = r, l.lastBaseUpdate = r;
  }
  function Dl(n, r, l, o) {
    var c = n.updateQueue;
    _l = !1;
    var d = c.firstBaseUpdate, m = c.lastBaseUpdate, E = c.shared.pending;
    if (E !== null) {
      c.shared.pending = null;
      var w = E, A = w.next;
      w.next = null, m === null ? d = A : m.next = A, m = w;
      var Q = n.alternate;
      Q !== null && (Q = Q.updateQueue, E = Q.lastBaseUpdate, E !== m && (E === null ? Q.firstBaseUpdate = A : E.next = A, Q.lastBaseUpdate = w));
    }
    if (d !== null) {
      var G = c.baseState;
      m = 0, Q = A = w = null, E = d;
      do {
        var I = E.lane, oe = E.eventTime;
        if ((o & I) === I) {
          Q !== null && (Q = Q.next = {
            eventTime: oe,
            lane: 0,
            tag: E.tag,
            payload: E.payload,
            callback: E.callback,
            next: null
          });
          e: {
            var ge = n, Ce = E;
            switch (I = r, oe = l, Ce.tag) {
              case 1:
                if (ge = Ce.payload, typeof ge == "function") {
                  G = ge.call(oe, G, I);
                  break e;
                }
                G = ge;
                break e;
              case 3:
                ge.flags = ge.flags & -65537 | 128;
              case 0:
                if (ge = Ce.payload, I = typeof ge == "function" ? ge.call(oe, G, I) : ge, I == null)
                  break e;
                G = T({}, G, I);
                break e;
              case 2:
                _l = !0;
            }
          }
          E.callback !== null && E.lane !== 0 && (n.flags |= 64, I = c.effects, I === null ? c.effects = [E] : I.push(E));
        } else
          oe = { eventTime: oe, lane: I, tag: E.tag, payload: E.payload, callback: E.callback, next: null }, Q === null ? (A = Q = oe, w = G) : Q = Q.next = oe, m |= I;
        if (E = E.next, E === null) {
          if (E = c.shared.pending, E === null)
            break;
          I = E, E = I.next, I.next = null, c.lastBaseUpdate = I, c.shared.pending = null;
        }
      } while (1);
      if (Q === null && (w = G), c.baseState = w, c.firstBaseUpdate = A, c.lastBaseUpdate = Q, r = c.shared.interleaved, r !== null) {
        c = r;
        do
          m |= c.lane, c = c.next;
        while (c !== r);
      } else
        d === null && (c.shared.lanes = 0);
      Ii |= m, n.lanes = m, n.memoizedState = G;
    }
  }
  function uu(n, r, l) {
    if (n = r.effects, r.effects = null, n !== null)
      for (r = 0; r < n.length; r++) {
        var o = n[r], c = o.callback;
        if (c !== null) {
          if (o.callback = null, o = l, typeof c != "function")
            throw Error(N(191, c));
          c.call(o);
        }
      }
  }
  var Mv = new B.Component().refs;
  function Ed(n, r, l, o) {
    r = n.memoizedState, l = l(o, r), l = l == null ? r : T({}, r, l), n.memoizedState = l, n.lanes === 0 && (n.updateQueue.baseState = l);
  }
  var Sc = { isMounted: function(n) {
    return (n = n._reactInternals) ? Ge(n) === n : !1;
  }, enqueueSetState: function(n, r, l) {
    n = n._reactInternals;
    var o = Cr(), c = zn(n), d = Pi(o, c);
    d.payload = r, l != null && (d.callback = l), r = kl(n, d, c), r !== null && (Rr(r, n, c, o), gc(r, n, c));
  }, enqueueReplaceState: function(n, r, l) {
    n = n._reactInternals;
    var o = Cr(), c = zn(n), d = Pi(o, c);
    d.tag = 1, d.payload = r, l != null && (d.callback = l), r = kl(n, d, c), r !== null && (Rr(r, n, c, o), gc(r, n, c));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var l = Cr(), o = zn(n), c = Pi(l, o);
    c.tag = 2, r != null && (c.callback = r), r = kl(n, c, o), r !== null && (Rr(r, n, o, l), gc(r, n, o));
  } };
  function Nv(n, r, l, o, c, d, m) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(o, d, m) : r.prototype && r.prototype.isPureReactComponent ? !es(l, o) || !es(c, d) : !0;
  }
  function zv(n, r, l) {
    var o = !1, c = mi, d = r.contextType;
    return typeof d == "object" && d !== null ? d = kn(d) : (c = sn(r) ? Xr : Pe.current, o = r.contextTypes, d = (o = o != null) ? Oa(n, c) : mi), r = new r(l, d), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Sc, n.stateNode = r, r._reactInternals = n, o && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = c, n.__reactInternalMemoizedMaskedChildContext = d), r;
  }
  function Uv(n, r, l, o) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(l, o), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(l, o), r.state !== n && Sc.enqueueReplaceState(r, r.state, null);
  }
  function Ec(n, r, l, o) {
    var c = n.stateNode;
    c.props = l, c.state = n.memoizedState, c.refs = Mv, gd(n);
    var d = r.contextType;
    typeof d == "object" && d !== null ? c.context = kn(d) : (d = sn(r) ? Xr : Pe.current, c.context = Oa(n, d)), c.state = n.memoizedState, d = r.getDerivedStateFromProps, typeof d == "function" && (Ed(n, r, d, l), c.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (r = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), r !== c.state && Sc.enqueueReplaceState(c, c.state, null), Dl(n, l, c, o), c.state = n.memoizedState), typeof c.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function lo(n, r, l) {
    if (n = l.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (l._owner) {
        if (l = l._owner, l) {
          if (l.tag !== 1)
            throw Error(N(309));
          var o = l.stateNode;
        }
        if (!o)
          throw Error(N(147, n));
        var c = o, d = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === d ? r.ref : (r = function(m) {
          var E = c.refs;
          E === Mv && (E = c.refs = {}), m === null ? delete E[d] : E[d] = m;
        }, r._stringRef = d, r);
      }
      if (typeof n != "string")
        throw Error(N(284));
      if (!l._owner)
        throw Error(N(290, n));
    }
    return n;
  }
  function Cc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(N(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function Av(n) {
    var r = n._init;
    return r(n._payload);
  }
  function Fv(n) {
    function r(k, b) {
      if (n) {
        var L = k.deletions;
        L === null ? (k.deletions = [b], k.flags |= 16) : L.push(b);
      }
    }
    function l(k, b) {
      if (!n)
        return null;
      for (; b !== null; )
        r(k, b), b = b.sibling;
      return null;
    }
    function o(k, b) {
      for (k = /* @__PURE__ */ new Map(); b !== null; )
        b.key !== null ? k.set(b.key, b) : k.set(b.index, b), b = b.sibling;
      return k;
    }
    function c(k, b) {
      return k = Fl(k, b), k.index = 0, k.sibling = null, k;
    }
    function d(k, b, L) {
      return k.index = L, n ? (L = k.alternate, L !== null ? (L = L.index, L < b ? (k.flags |= 2, b) : L) : (k.flags |= 2, b)) : (k.flags |= 1048576, b);
    }
    function m(k) {
      return n && k.alternate === null && (k.flags |= 2), k;
    }
    function E(k, b, L, K) {
      return b === null || b.tag !== 6 ? (b = Os(L, k.mode, K), b.return = k, b) : (b = c(b, L), b.return = k, b);
    }
    function w(k, b, L, K) {
      var Re = L.type;
      return Re === He ? Q(k, b, L.props.children, K, L.key) : b !== null && (b.elementType === Re || typeof Re == "object" && Re !== null && Re.$$typeof === Rt && Av(Re) === b.type) ? (K = c(b, L.props), K.ref = lo(k, b, L), K.return = k, K) : (K = Jc(L.type, L.key, L.props, null, k.mode, K), K.ref = lo(k, b, L), K.return = k, K);
    }
    function A(k, b, L, K) {
      return b === null || b.tag !== 4 || b.stateNode.containerInfo !== L.containerInfo || b.stateNode.implementation !== L.implementation ? (b = bu(L, k.mode, K), b.return = k, b) : (b = c(b, L.children || []), b.return = k, b);
    }
    function Q(k, b, L, K, Re) {
      return b === null || b.tag !== 7 ? (b = xu(L, k.mode, K, Re), b.return = k, b) : (b = c(b, L), b.return = k, b);
    }
    function G(k, b, L) {
      if (typeof b == "string" && b !== "" || typeof b == "number")
        return b = Os("" + b, k.mode, L), b.return = k, b;
      if (typeof b == "object" && b !== null) {
        switch (b.$$typeof) {
          case be:
            return L = Jc(b.type, b.key, b.props, null, k.mode, L), L.ref = lo(k, null, b), L.return = k, L;
          case it:
            return b = bu(b, k.mode, L), b.return = k, b;
          case Rt:
            var K = b._init;
            return G(k, K(b._payload), L);
        }
        if (In(b) || we(b))
          return b = xu(b, k.mode, L, null), b.return = k, b;
        Cc(k, b);
      }
      return null;
    }
    function I(k, b, L, K) {
      var Re = b !== null ? b.key : null;
      if (typeof L == "string" && L !== "" || typeof L == "number")
        return Re !== null ? null : E(k, b, "" + L, K);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case be:
            return L.key === Re ? w(k, b, L, K) : null;
          case it:
            return L.key === Re ? A(k, b, L, K) : null;
          case Rt:
            return Re = L._init, I(
              k,
              b,
              Re(L._payload),
              K
            );
        }
        if (In(L) || we(L))
          return Re !== null ? null : Q(k, b, L, K, null);
        Cc(k, L);
      }
      return null;
    }
    function oe(k, b, L, K, Re) {
      if (typeof K == "string" && K !== "" || typeof K == "number")
        return k = k.get(L) || null, E(b, k, "" + K, Re);
      if (typeof K == "object" && K !== null) {
        switch (K.$$typeof) {
          case be:
            return k = k.get(K.key === null ? L : K.key) || null, w(b, k, K, Re);
          case it:
            return k = k.get(K.key === null ? L : K.key) || null, A(b, k, K, Re);
          case Rt:
            var Se = K._init;
            return oe(k, b, L, Se(K._payload), Re);
        }
        if (In(K) || we(K))
          return k = k.get(L) || null, Q(b, k, K, Re, null);
        Cc(b, K);
      }
      return null;
    }
    function ge(k, b, L, K) {
      for (var Re = null, Se = null, _e = b, Be = b = 0, Zn = null; _e !== null && Be < L.length; Be++) {
        _e.index > Be ? (Zn = _e, _e = null) : Zn = _e.sibling;
        var bt = I(k, _e, L[Be], K);
        if (bt === null) {
          _e === null && (_e = Zn);
          break;
        }
        n && _e && bt.alternate === null && r(k, _e), b = d(bt, b, Be), Se === null ? Re = bt : Se.sibling = bt, Se = bt, _e = Zn;
      }
      if (Be === L.length)
        return l(k, _e), an && ha(k, Be), Re;
      if (_e === null) {
        for (; Be < L.length; Be++)
          _e = G(k, L[Be], K), _e !== null && (b = d(_e, b, Be), Se === null ? Re = _e : Se.sibling = _e, Se = _e);
        return an && ha(k, Be), Re;
      }
      for (_e = o(k, _e); Be < L.length; Be++)
        Zn = oe(_e, k, Be, L[Be], K), Zn !== null && (n && Zn.alternate !== null && _e.delete(Zn.key === null ? Be : Zn.key), b = d(Zn, b, Be), Se === null ? Re = Zn : Se.sibling = Zn, Se = Zn);
      return n && _e.forEach(function(Hl) {
        return r(k, Hl);
      }), an && ha(k, Be), Re;
    }
    function Ce(k, b, L, K) {
      var Re = we(L);
      if (typeof Re != "function")
        throw Error(N(150));
      if (L = Re.call(L), L == null)
        throw Error(N(151));
      for (var Se = Re = null, _e = b, Be = b = 0, Zn = null, bt = L.next(); _e !== null && !bt.done; Be++, bt = L.next()) {
        _e.index > Be ? (Zn = _e, _e = null) : Zn = _e.sibling;
        var Hl = I(k, _e, bt.value, K);
        if (Hl === null) {
          _e === null && (_e = Zn);
          break;
        }
        n && _e && Hl.alternate === null && r(k, _e), b = d(Hl, b, Be), Se === null ? Re = Hl : Se.sibling = Hl, Se = Hl, _e = Zn;
      }
      if (bt.done)
        return l(
          k,
          _e
        ), an && ha(k, Be), Re;
      if (_e === null) {
        for (; !bt.done; Be++, bt = L.next())
          bt = G(k, bt.value, K), bt !== null && (b = d(bt, b, Be), Se === null ? Re = bt : Se.sibling = bt, Se = bt);
        return an && ha(k, Be), Re;
      }
      for (_e = o(k, _e); !bt.done; Be++, bt = L.next())
        bt = oe(_e, k, Be, bt.value, K), bt !== null && (n && bt.alternate !== null && _e.delete(bt.key === null ? Be : bt.key), b = d(bt, b, Be), Se === null ? Re = bt : Se.sibling = bt, Se = bt);
      return n && _e.forEach(function(Ty) {
        return r(k, Ty);
      }), an && ha(k, Be), Re;
    }
    function Dn(k, b, L, K) {
      if (typeof L == "object" && L !== null && L.type === He && L.key === null && (L = L.props.children), typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case be:
            e: {
              for (var Re = L.key, Se = b; Se !== null; ) {
                if (Se.key === Re) {
                  if (Re = L.type, Re === He) {
                    if (Se.tag === 7) {
                      l(k, Se.sibling), b = c(Se, L.props.children), b.return = k, k = b;
                      break e;
                    }
                  } else if (Se.elementType === Re || typeof Re == "object" && Re !== null && Re.$$typeof === Rt && Av(Re) === Se.type) {
                    l(k, Se.sibling), b = c(Se, L.props), b.ref = lo(k, Se, L), b.return = k, k = b;
                    break e;
                  }
                  l(k, Se);
                  break;
                } else
                  r(k, Se);
                Se = Se.sibling;
              }
              L.type === He ? (b = xu(L.props.children, k.mode, K, L.key), b.return = k, k = b) : (K = Jc(L.type, L.key, L.props, null, k.mode, K), K.ref = lo(k, b, L), K.return = k, k = K);
            }
            return m(k);
          case it:
            e: {
              for (Se = L.key; b !== null; ) {
                if (b.key === Se)
                  if (b.tag === 4 && b.stateNode.containerInfo === L.containerInfo && b.stateNode.implementation === L.implementation) {
                    l(k, b.sibling), b = c(b, L.children || []), b.return = k, k = b;
                    break e;
                  } else {
                    l(k, b);
                    break;
                  }
                else
                  r(k, b);
                b = b.sibling;
              }
              b = bu(L, k.mode, K), b.return = k, k = b;
            }
            return m(k);
          case Rt:
            return Se = L._init, Dn(k, b, Se(L._payload), K);
        }
        if (In(L))
          return ge(k, b, L, K);
        if (we(L))
          return Ce(k, b, L, K);
        Cc(k, L);
      }
      return typeof L == "string" && L !== "" || typeof L == "number" ? (L = "" + L, b !== null && b.tag === 6 ? (l(k, b.sibling), b = c(b, L), b.return = k, k = b) : (l(k, b), b = Os(L, k.mode, K), b.return = k, k = b), m(k)) : l(k, b);
    }
    return Dn;
  }
  var uo = Fv(!0), Hv = Fv(!1), ds = {}, ni = Ke(ds), ps = Ke(ds), oo = Ke(ds);
  function ou(n) {
    if (n === ds)
      throw Error(N(174));
    return n;
  }
  function Cd(n, r) {
    switch (Vt(oo, r), Vt(ps, n), Vt(ni, ds), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : pn(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = pn(r, n);
    }
    Mt(ni), Vt(ni, r);
  }
  function Ol() {
    Mt(ni), Mt(ps), Mt(oo);
  }
  function Me(n) {
    ou(oo.current);
    var r = ou(ni.current), l = pn(r, n.type);
    r !== l && (Vt(ps, n), Vt(ni, l));
  }
  function ot(n) {
    ps.current === n && (Mt(ni), Mt(ps));
  }
  var ze = Ke(0);
  function yn(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var l = r.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || l.data === "$?" || l.data === "$!"))
          return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128)
          return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n)
        break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n)
          return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var za = [];
  function Rc() {
    for (var n = 0; n < za.length; n++)
      za[n]._workInProgressVersionPrimary = null;
    za.length = 0;
  }
  var Tc = ct.ReactCurrentDispatcher, Rd = ct.ReactCurrentBatchConfig, su = 0, ln = null, V = null, yt = null, Ae = !1, gi = !1, ga = 0, cu = 0;
  function un() {
    throw Error(N(321));
  }
  function fu(n, r) {
    if (r === null)
      return !1;
    for (var l = 0; l < r.length && l < n.length; l++)
      if (!ka(n[l], r[l]))
        return !1;
    return !0;
  }
  function Ll(n, r, l, o, c, d) {
    if (su = d, ln = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, Tc.current = n === null || n.memoizedState === null ? iy : ly, n = l(o, c), gi) {
      d = 0;
      do {
        if (gi = !1, ga = 0, 25 <= d)
          throw Error(N(301));
        d += 1, yt = V = null, r.updateQueue = null, Tc.current = wd, n = l(o, c);
      } while (gi);
    }
    if (Tc.current = jc, r = V !== null && V.next !== null, su = 0, yt = V = ln = null, Ae = !1, r)
      throw Error(N(300));
    return n;
  }
  function du() {
    var n = ga !== 0;
    return ga = 0, n;
  }
  function Ua() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return yt === null ? ln.memoizedState = yt = n : yt = yt.next = n, yt;
  }
  function ta() {
    if (V === null) {
      var n = ln.alternate;
      n = n !== null ? n.memoizedState : null;
    } else
      n = V.next;
    var r = yt === null ? ln.memoizedState : yt.next;
    if (r !== null)
      yt = r, V = n;
    else {
      if (n === null)
        throw Error(N(310));
      V = n, n = { memoizedState: V.memoizedState, baseState: V.baseState, baseQueue: V.baseQueue, queue: V.queue, next: null }, yt === null ? ln.memoizedState = yt = n : yt = yt.next = n;
    }
    return yt;
  }
  function pu(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function vs(n) {
    var r = ta(), l = r.queue;
    if (l === null)
      throw Error(N(311));
    l.lastRenderedReducer = n;
    var o = V, c = o.baseQueue, d = l.pending;
    if (d !== null) {
      if (c !== null) {
        var m = c.next;
        c.next = d.next, d.next = m;
      }
      o.baseQueue = c = d, l.pending = null;
    }
    if (c !== null) {
      d = c.next, o = o.baseState;
      var E = m = null, w = null, A = d;
      do {
        var Q = A.lane;
        if ((su & Q) === Q)
          w !== null && (w = w.next = { lane: 0, action: A.action, hasEagerState: A.hasEagerState, eagerState: A.eagerState, next: null }), o = A.hasEagerState ? A.eagerState : n(o, A.action);
        else {
          var G = {
            lane: Q,
            action: A.action,
            hasEagerState: A.hasEagerState,
            eagerState: A.eagerState,
            next: null
          };
          w === null ? (E = w = G, m = o) : w = w.next = G, ln.lanes |= Q, Ii |= Q;
        }
        A = A.next;
      } while (A !== null && A !== d);
      w === null ? m = o : w.next = E, ka(o, r.memoizedState) || (Nn = !0), r.memoizedState = o, r.baseState = m, r.baseQueue = w, l.lastRenderedState = o;
    }
    if (n = l.interleaved, n !== null) {
      c = n;
      do
        d = c.lane, ln.lanes |= d, Ii |= d, c = c.next;
      while (c !== n);
    } else
      c === null && (l.lanes = 0);
    return [r.memoizedState, l.dispatch];
  }
  function hs(n) {
    var r = ta(), l = r.queue;
    if (l === null)
      throw Error(N(311));
    l.lastRenderedReducer = n;
    var o = l.dispatch, c = l.pending, d = r.memoizedState;
    if (c !== null) {
      l.pending = null;
      var m = c = c.next;
      do
        d = n(d, m.action), m = m.next;
      while (m !== c);
      ka(d, r.memoizedState) || (Nn = !0), r.memoizedState = d, r.baseQueue === null && (r.baseState = d), l.lastRenderedState = d;
    }
    return [d, o];
  }
  function wc() {
  }
  function xc(n, r) {
    var l = ln, o = ta(), c = r(), d = !ka(o.memoizedState, c);
    if (d && (o.memoizedState = c, Nn = !0), o = o.queue, ms(kc.bind(null, l, o, n), [n]), o.getSnapshot !== r || d || yt !== null && yt.memoizedState.tag & 1) {
      if (l.flags |= 2048, vu(9, _c.bind(null, l, o, c, r), void 0, null), gn === null)
        throw Error(N(349));
      su & 30 || bc(l, r, c);
    }
    return c;
  }
  function bc(n, r, l) {
    n.flags |= 16384, n = { getSnapshot: r, value: l }, r = ln.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, ln.updateQueue = r, r.stores = [n]) : (l = r.stores, l === null ? r.stores = [n] : l.push(n));
  }
  function _c(n, r, l, o) {
    r.value = l, r.getSnapshot = o, Dc(r) && Oc(n);
  }
  function kc(n, r, l) {
    return l(function() {
      Dc(r) && Oc(n);
    });
  }
  function Dc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var l = r();
      return !ka(n, l);
    } catch {
      return !0;
    }
  }
  function Oc(n) {
    var r = Vi(n, 1);
    r !== null && Rr(r, n, 1, -1);
  }
  function Lc(n) {
    var r = Ua();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: pu, lastRenderedState: n }, r.queue = n, n = n.dispatch = Hc.bind(null, ln, n), [r.memoizedState, n];
  }
  function vu(n, r, l, o) {
    return n = { tag: n, create: r, destroy: l, deps: o, next: null }, r = ln.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, ln.updateQueue = r, r.lastEffect = n.next = n) : (l = r.lastEffect, l === null ? r.lastEffect = n.next = n : (o = l.next, l.next = n, n.next = o, r.lastEffect = n)), n;
  }
  function Mc() {
    return ta().memoizedState;
  }
  function hu(n, r, l, o) {
    var c = Ua();
    ln.flags |= n, c.memoizedState = vu(1 | r, l, void 0, o === void 0 ? null : o);
  }
  function Bi(n, r, l, o) {
    var c = ta();
    o = o === void 0 ? null : o;
    var d = void 0;
    if (V !== null) {
      var m = V.memoizedState;
      if (d = m.destroy, o !== null && fu(o, m.deps)) {
        c.memoizedState = vu(r, l, d, o);
        return;
      }
    }
    ln.flags |= n, c.memoizedState = vu(1 | r, l, d, o);
  }
  function Nc(n, r) {
    return hu(8390656, 8, n, r);
  }
  function ms(n, r) {
    return Bi(2048, 8, n, r);
  }
  function zc(n, r) {
    return Bi(4, 2, n, r);
  }
  function Uc(n, r) {
    return Bi(4, 4, n, r);
  }
  function Td(n, r) {
    if (typeof r == "function")
      return n = n(), r(n), function() {
        r(null);
      };
    if (r != null)
      return n = n(), r.current = n, function() {
        r.current = null;
      };
  }
  function so(n, r, l) {
    return l = l != null ? l.concat([n]) : null, Bi(4, 4, Td.bind(null, r, n), l);
  }
  function Ac() {
  }
  function co(n, r) {
    var l = ta();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && fu(r, o[1]) ? o[0] : (l.memoizedState = [n, r], n);
  }
  function Ml(n, r) {
    var l = ta();
    r = r === void 0 ? null : r;
    var o = l.memoizedState;
    return o !== null && r !== null && fu(r, o[1]) ? o[0] : (n = n(), l.memoizedState = [n, r], n);
  }
  function na(n, r, l) {
    return su & 21 ? (ka(l, r) || (l = $u(), ln.lanes |= l, Ii |= l, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Nn = !0), n.memoizedState = l);
  }
  function ay(n, r) {
    var l = kt;
    kt = l !== 0 && 4 > l ? l : 4, n(!0);
    var o = Rd.transition;
    Rd.transition = {};
    try {
      n(!1), r();
    } finally {
      kt = l, Rd.transition = o;
    }
  }
  function Zt() {
    return ta().memoizedState;
  }
  function Fc(n, r, l) {
    var o = zn(n);
    if (l = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null }, fo(n))
      ys(r, l);
    else if (l = Lv(n, r, l, o), l !== null) {
      var c = Cr();
      Rr(l, n, o, c), jv(l, r, o);
    }
  }
  function Hc(n, r, l) {
    var o = zn(n), c = { lane: o, action: l, hasEagerState: !1, eagerState: null, next: null };
    if (fo(n))
      ys(r, c);
    else {
      var d = n.alternate;
      if (n.lanes === 0 && (d === null || d.lanes === 0) && (d = r.lastRenderedReducer, d !== null))
        try {
          var m = r.lastRenderedState, E = d(m, l);
          if (c.hasEagerState = !0, c.eagerState = E, ka(E, m)) {
            var w = r.interleaved;
            w === null ? (c.next = c, yd(r)) : (c.next = w.next, w.next = c), r.interleaved = c;
            return;
          }
        } catch {
        } finally {
        }
      l = Lv(n, r, c, o), l !== null && (c = Cr(), Rr(l, n, o, c), jv(l, r, o));
    }
  }
  function fo(n) {
    var r = n.alternate;
    return n === ln || r !== null && r === ln;
  }
  function ys(n, r) {
    gi = Ae = !0;
    var l = n.pending;
    l === null ? r.next = r : (r.next = l.next, l.next = r), n.pending = r;
  }
  function jv(n, r, l) {
    if (l & 4194240) {
      var o = r.lanes;
      o &= n.pendingLanes, l |= o, r.lanes = l, pi(n, l);
    }
  }
  var jc = { readContext: kn, useCallback: un, useContext: un, useEffect: un, useImperativeHandle: un, useInsertionEffect: un, useLayoutEffect: un, useMemo: un, useReducer: un, useRef: un, useState: un, useDebugValue: un, useDeferredValue: un, useTransition: un, useMutableSource: un, useSyncExternalStore: un, useId: un, unstable_isNewReconciler: !1 }, iy = { readContext: kn, useCallback: function(n, r) {
    return Ua().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: kn, useEffect: Nc, useImperativeHandle: function(n, r, l) {
    return l = l != null ? l.concat([n]) : null, hu(
      4194308,
      4,
      Td.bind(null, r, n),
      l
    );
  }, useLayoutEffect: function(n, r) {
    return hu(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return hu(4, 2, n, r);
  }, useMemo: function(n, r) {
    var l = Ua();
    return r = r === void 0 ? null : r, n = n(), l.memoizedState = [n, r], n;
  }, useReducer: function(n, r, l) {
    var o = Ua();
    return r = l !== void 0 ? l(r) : r, o.memoizedState = o.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, o.queue = n, n = n.dispatch = Fc.bind(null, ln, n), [o.memoizedState, n];
  }, useRef: function(n) {
    var r = Ua();
    return n = { current: n }, r.memoizedState = n;
  }, useState: Lc, useDebugValue: Ac, useDeferredValue: function(n) {
    return Ua().memoizedState = n;
  }, useTransition: function() {
    var n = Lc(!1), r = n[0];
    return n = ay.bind(null, n[1]), Ua().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, l) {
    var o = ln, c = Ua();
    if (an) {
      if (l === void 0)
        throw Error(N(407));
      l = l();
    } else {
      if (l = r(), gn === null)
        throw Error(N(349));
      su & 30 || bc(o, r, l);
    }
    c.memoizedState = l;
    var d = { value: l, getSnapshot: r };
    return c.queue = d, Nc(kc.bind(
      null,
      o,
      d,
      n
    ), [n]), o.flags |= 2048, vu(9, _c.bind(null, o, d, l, r), void 0, null), l;
  }, useId: function() {
    var n = Ua(), r = gn.identifierPrefix;
    if (an) {
      var l = ji, o = nr;
      l = (o & ~(1 << 32 - _r(o) - 1)).toString(32) + l, r = ":" + r + "R" + l, l = ga++, 0 < l && (r += "H" + l.toString(32)), r += ":";
    } else
      l = cu++, r = ":" + r + "r" + l.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, ly = {
    readContext: kn,
    useCallback: co,
    useContext: kn,
    useEffect: ms,
    useImperativeHandle: so,
    useInsertionEffect: zc,
    useLayoutEffect: Uc,
    useMemo: Ml,
    useReducer: vs,
    useRef: Mc,
    useState: function() {
      return vs(pu);
    },
    useDebugValue: Ac,
    useDeferredValue: function(n) {
      var r = ta();
      return na(r, V.memoizedState, n);
    },
    useTransition: function() {
      var n = vs(pu)[0], r = ta().memoizedState;
      return [n, r];
    },
    useMutableSource: wc,
    useSyncExternalStore: xc,
    useId: Zt,
    unstable_isNewReconciler: !1
  }, wd = { readContext: kn, useCallback: co, useContext: kn, useEffect: ms, useImperativeHandle: so, useInsertionEffect: zc, useLayoutEffect: Uc, useMemo: Ml, useReducer: hs, useRef: Mc, useState: function() {
    return hs(pu);
  }, useDebugValue: Ac, useDeferredValue: function(n) {
    var r = ta();
    return V === null ? r.memoizedState = n : na(r, V.memoizedState, n);
  }, useTransition: function() {
    var n = hs(pu)[0], r = ta().memoizedState;
    return [n, r];
  }, useMutableSource: wc, useSyncExternalStore: xc, useId: Zt, unstable_isNewReconciler: !1 };
  function po(n, r) {
    try {
      var l = "", o = r;
      do
        l += ht(o), o = o.return;
      while (o);
      var c = l;
    } catch (d) {
      c = `
Error generating stack: ` + d.message + `
` + d.stack;
    }
    return { value: n, source: r, stack: c, digest: null };
  }
  function gs(n, r, l) {
    return { value: n, source: null, stack: l ?? null, digest: r ?? null };
  }
  function Vc(n, r) {
    try {
      console.error(r.value);
    } catch (l) {
      setTimeout(function() {
        throw l;
      });
    }
  }
  var uy = typeof WeakMap == "function" ? WeakMap : Map;
  function Vv(n, r, l) {
    l = Pi(-1, l), l.tag = 3, l.payload = { element: null };
    var o = r.value;
    return l.callback = function() {
      Wc || (Wc = !0, Eu = o), Vc(n, r);
    }, l;
  }
  function Ss(n, r, l) {
    l = Pi(-1, l), l.tag = 3;
    var o = n.type.getDerivedStateFromError;
    if (typeof o == "function") {
      var c = r.value;
      l.payload = function() {
        return o(c);
      }, l.callback = function() {
        Vc(n, r);
      };
    }
    var d = n.stateNode;
    return d !== null && typeof d.componentDidCatch == "function" && (l.callback = function() {
      Vc(n, r), typeof o != "function" && (Ci === null ? Ci = /* @__PURE__ */ new Set([this]) : Ci.add(this));
      var m = r.stack;
      this.componentDidCatch(r.value, { componentStack: m !== null ? m : "" });
    }), l;
  }
  function Pv(n, r, l) {
    var o = n.pingCache;
    if (o === null) {
      o = n.pingCache = new uy();
      var c = /* @__PURE__ */ new Set();
      o.set(r, c);
    } else
      c = o.get(r), c === void 0 && (c = /* @__PURE__ */ new Set(), o.set(r, c));
    c.has(l) || (c.add(l), n = vy.bind(null, n, r, l), r.then(n, n));
  }
  function xd(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r)
        return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function bd(n, r, l, o, c) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = c, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, l.flags |= 131072, l.flags &= -52805, l.tag === 1 && (l.alternate === null ? l.tag = 17 : (r = Pi(-1, 1), r.tag = 2, kl(l, r, 1))), l.lanes |= 1), n);
  }
  var oy = ct.ReactCurrentOwner, Nn = !1;
  function jn(n, r, l, o) {
    r.child = n === null ? Hv(r, null, l, o) : uo(r, n.child, l, o);
  }
  function Nl(n, r, l, o, c) {
    l = l.render;
    var d = r.ref;
    return te(r, c), o = Ll(n, r, l, o, d, c), l = du(), n !== null && !Nn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, ar(n, r, c)) : (an && l && dc(r), r.flags |= 1, jn(n, r, o, c), r.child);
  }
  function Pc(n, r, l, o, c) {
    if (n === null) {
      var d = l.type;
      return typeof d == "function" && !Id(d) && d.defaultProps === void 0 && l.compare === null && l.defaultProps === void 0 ? (r.tag = 15, r.type = d, ra(n, r, d, o, c)) : (n = Jc(l.type, null, o, r, r.mode, c), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (d = n.child, !(n.lanes & c)) {
      var m = d.memoizedProps;
      if (l = l.compare, l = l !== null ? l : es, l(m, o) && n.ref === r.ref)
        return ar(n, r, c);
    }
    return r.flags |= 1, n = Fl(d, o), n.ref = r.ref, n.return = r, r.child = n;
  }
  function ra(n, r, l, o, c) {
    if (n !== null) {
      var d = n.memoizedProps;
      if (es(d, o) && n.ref === r.ref)
        if (Nn = !1, r.pendingProps = o = d, (n.lanes & c) !== 0)
          n.flags & 131072 && (Nn = !0);
        else
          return r.lanes = n.lanes, ar(n, r, c);
    }
    return vo(n, r, l, o, c);
  }
  function mu(n, r, l) {
    var o = r.pendingProps, c = o.children, d = n !== null ? n.memoizedState : null;
    if (o.mode === "hidden")
      if (!(r.mode & 1))
        r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Vt(Eo, Sa), Sa |= l;
      else {
        if (!(l & 1073741824))
          return n = d !== null ? d.baseLanes | l : l, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Vt(Eo, Sa), Sa |= n, null;
        r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, o = d !== null ? d.baseLanes : l, Vt(Eo, Sa), Sa |= o;
      }
    else
      d !== null ? (o = d.baseLanes | l, r.memoizedState = null) : o = l, Vt(Eo, Sa), Sa |= o;
    return jn(n, r, c, l), r.child;
  }
  function Ze(n, r) {
    var l = r.ref;
    (n === null && l !== null || n !== null && n.ref !== l) && (r.flags |= 512, r.flags |= 2097152);
  }
  function vo(n, r, l, o, c) {
    var d = sn(l) ? Xr : Pe.current;
    return d = Oa(r, d), te(r, c), l = Ll(n, r, l, o, d, c), o = du(), n !== null && !Nn ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~c, ar(n, r, c)) : (an && o && dc(r), r.flags |= 1, jn(n, r, l, c), r.child);
  }
  function _d(n, r, l, o, c) {
    if (sn(l)) {
      var d = !0;
      fc(r);
    } else
      d = !1;
    if (te(r, c), r.stateNode === null)
      gr(n, r), zv(r, l, o), Ec(r, l, o, c), o = !0;
    else if (n === null) {
      var m = r.stateNode, E = r.memoizedProps;
      m.props = E;
      var w = m.context, A = l.contextType;
      typeof A == "object" && A !== null ? A = kn(A) : (A = sn(l) ? Xr : Pe.current, A = Oa(r, A));
      var Q = l.getDerivedStateFromProps, G = typeof Q == "function" || typeof m.getSnapshotBeforeUpdate == "function";
      G || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== o || w !== A) && Uv(r, m, o, A), _l = !1;
      var I = r.memoizedState;
      m.state = I, Dl(r, o, m, c), w = r.memoizedState, E !== o || I !== w || Rn.current || _l ? (typeof Q == "function" && (Ed(r, l, Q, o), w = r.memoizedState), (E = _l || Nv(r, l, E, o, I, w, A)) ? (G || typeof m.UNSAFE_componentWillMount != "function" && typeof m.componentWillMount != "function" || (typeof m.componentWillMount == "function" && m.componentWillMount(), typeof m.UNSAFE_componentWillMount == "function" && m.UNSAFE_componentWillMount()), typeof m.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = o, r.memoizedState = w), m.props = o, m.state = w, m.context = A, o = E) : (typeof m.componentDidMount == "function" && (r.flags |= 4194308), o = !1);
    } else {
      m = r.stateNode, Hn(n, r), E = r.memoizedProps, A = r.type === r.elementType ? E : ya(r.type, E), m.props = A, G = r.pendingProps, I = m.context, w = l.contextType, typeof w == "object" && w !== null ? w = kn(w) : (w = sn(l) ? Xr : Pe.current, w = Oa(r, w));
      var oe = l.getDerivedStateFromProps;
      (Q = typeof oe == "function" || typeof m.getSnapshotBeforeUpdate == "function") || typeof m.UNSAFE_componentWillReceiveProps != "function" && typeof m.componentWillReceiveProps != "function" || (E !== G || I !== w) && Uv(r, m, o, w), _l = !1, I = r.memoizedState, m.state = I, Dl(r, o, m, c);
      var ge = r.memoizedState;
      E !== G || I !== ge || Rn.current || _l ? (typeof oe == "function" && (Ed(r, l, oe, o), ge = r.memoizedState), (A = _l || Nv(r, l, A, o, I, ge, w) || !1) ? (Q || typeof m.UNSAFE_componentWillUpdate != "function" && typeof m.componentWillUpdate != "function" || (typeof m.componentWillUpdate == "function" && m.componentWillUpdate(o, ge, w), typeof m.UNSAFE_componentWillUpdate == "function" && m.UNSAFE_componentWillUpdate(o, ge, w)), typeof m.componentDidUpdate == "function" && (r.flags |= 4), typeof m.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && I === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && I === n.memoizedState || (r.flags |= 1024), r.memoizedProps = o, r.memoizedState = ge), m.props = o, m.state = ge, m.context = w, o = A) : (typeof m.componentDidUpdate != "function" || E === n.memoizedProps && I === n.memoizedState || (r.flags |= 4), typeof m.getSnapshotBeforeUpdate != "function" || E === n.memoizedProps && I === n.memoizedState || (r.flags |= 1024), o = !1);
    }
    return Bv(n, r, l, o, d, c);
  }
  function Bv(n, r, l, o, c, d) {
    Ze(n, r);
    var m = (r.flags & 128) !== 0;
    if (!o && !m)
      return c && _v(r, l, !1), ar(n, r, d);
    o = r.stateNode, oy.current = r;
    var E = m && typeof l.getDerivedStateFromError != "function" ? null : o.render();
    return r.flags |= 1, n !== null && m ? (r.child = uo(r, n.child, null, d), r.child = uo(r, null, E, d)) : jn(n, r, E, d), r.memoizedState = o.state, c && _v(r, l, !0), r.child;
  }
  function $v(n) {
    var r = n.stateNode;
    r.pendingContext ? Tl(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Tl(n, r.context, !1), Cd(n, r.containerInfo);
  }
  function Bc(n, r, l, o, c) {
    return mn(), vd(c), r.flags |= 256, jn(n, r, l, o), r.child;
  }
  var yu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function kd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function Dd(n, r, l) {
    var o = r.pendingProps, c = ze.current, d = !1, m = (r.flags & 128) !== 0, E;
    if ((E = m) || (E = n !== null && n.memoizedState === null ? !1 : (c & 2) !== 0), E ? (d = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (c |= 1), Vt(ze, c & 1), n === null)
      return vc(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (m = o.children, n = o.fallback, d ? (o = r.mode, d = r.child, m = { mode: "hidden", children: m }, !(o & 1) && d !== null ? (d.childLanes = 0, d.pendingProps = m) : d = Ds(m, o, 0, null), n = xu(n, o, l, null), d.return = r, n.return = r, d.sibling = n, r.child = d, r.child.memoizedState = kd(l), r.memoizedState = yu, n) : Od(r, m));
    if (c = n.memoizedState, c !== null && (E = c.dehydrated, E !== null))
      return sy(n, r, m, o, E, c, l);
    if (d) {
      d = o.fallback, m = r.mode, c = n.child, E = c.sibling;
      var w = { mode: "hidden", children: o.children };
      return !(m & 1) && r.child !== c ? (o = r.child, o.childLanes = 0, o.pendingProps = w, r.deletions = null) : (o = Fl(c, w), o.subtreeFlags = c.subtreeFlags & 14680064), E !== null ? d = Fl(E, d) : (d = xu(d, m, l, null), d.flags |= 2), d.return = r, o.return = r, o.sibling = d, r.child = o, o = d, d = r.child, m = n.child.memoizedState, m = m === null ? kd(l) : { baseLanes: m.baseLanes | l, cachePool: null, transitions: m.transitions }, d.memoizedState = m, d.childLanes = n.childLanes & ~l, r.memoizedState = yu, o;
    }
    return d = n.child, n = d.sibling, o = Fl(d, { mode: "visible", children: o.children }), !(r.mode & 1) && (o.lanes = l), o.return = r, o.sibling = null, n !== null && (l = r.deletions, l === null ? (r.deletions = [n], r.flags |= 16) : l.push(n)), r.child = o, r.memoizedState = null, o;
  }
  function Od(n, r) {
    return r = Ds({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function ho(n, r, l, o) {
    return o !== null && vd(o), uo(r, n.child, null, l), n = Od(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function sy(n, r, l, o, c, d, m) {
    if (l)
      return r.flags & 256 ? (r.flags &= -257, o = gs(Error(N(422))), ho(n, r, m, o)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (d = o.fallback, c = r.mode, o = Ds({ mode: "visible", children: o.children }, c, 0, null), d = xu(d, c, m, null), d.flags |= 2, o.return = r, d.return = r, o.sibling = d, r.child = o, r.mode & 1 && uo(r, n.child, null, m), r.child.memoizedState = kd(m), r.memoizedState = yu, d);
    if (!(r.mode & 1))
      return ho(n, r, m, null);
    if (c.data === "$!") {
      if (o = c.nextSibling && c.nextSibling.dataset, o)
        var E = o.dgst;
      return o = E, d = Error(N(419)), o = gs(d, o, void 0), ho(n, r, m, o);
    }
    if (E = (m & n.childLanes) !== 0, Nn || E) {
      if (o = gn, o !== null) {
        switch (m & -m) {
          case 4:
            c = 2;
            break;
          case 16:
            c = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            c = 32;
            break;
          case 536870912:
            c = 268435456;
            break;
          default:
            c = 0;
        }
        c = c & (o.suspendedLanes | m) ? 0 : c, c !== 0 && c !== d.retryLane && (d.retryLane = c, Vi(n, c), Rr(o, n, c, -1));
      }
      return Bd(), o = gs(Error(N(421))), ho(n, r, m, o);
    }
    return c.data === "$?" ? (r.flags |= 128, r.child = n.child, r = hy.bind(null, n), c._reactRetry = r, null) : (n = d.treeContext, ea = ti(c.nextSibling), ma = r, an = !0, Na = null, n !== null && (Jr[yr++] = nr, Jr[yr++] = ji, Jr[yr++] = Ma, nr = n.id, ji = n.overflow, Ma = r), r = Od(r, o.children), r.flags |= 4096, r);
  }
  function Ld(n, r, l) {
    n.lanes |= r;
    var o = n.alternate;
    o !== null && (o.lanes |= r), qn(n.return, r, l);
  }
  function $c(n, r, l, o, c) {
    var d = n.memoizedState;
    d === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: o, tail: l, tailMode: c } : (d.isBackwards = r, d.rendering = null, d.renderingStartTime = 0, d.last = o, d.tail = l, d.tailMode = c);
  }
  function Md(n, r, l) {
    var o = r.pendingProps, c = o.revealOrder, d = o.tail;
    if (jn(n, r, o.children, l), o = ze.current, o & 2)
      o = o & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128)
        e:
          for (n = r.child; n !== null; ) {
            if (n.tag === 13)
              n.memoizedState !== null && Ld(n, l, r);
            else if (n.tag === 19)
              Ld(n, l, r);
            else if (n.child !== null) {
              n.child.return = n, n = n.child;
              continue;
            }
            if (n === r)
              break e;
            for (; n.sibling === null; ) {
              if (n.return === null || n.return === r)
                break e;
              n = n.return;
            }
            n.sibling.return = n.return, n = n.sibling;
          }
      o &= 1;
    }
    if (Vt(ze, o), !(r.mode & 1))
      r.memoizedState = null;
    else
      switch (c) {
        case "forwards":
          for (l = r.child, c = null; l !== null; )
            n = l.alternate, n !== null && yn(n) === null && (c = l), l = l.sibling;
          l = c, l === null ? (c = r.child, r.child = null) : (c = l.sibling, l.sibling = null), $c(r, !1, c, l, d);
          break;
        case "backwards":
          for (l = null, c = r.child, r.child = null; c !== null; ) {
            if (n = c.alternate, n !== null && yn(n) === null) {
              r.child = c;
              break;
            }
            n = c.sibling, c.sibling = l, l = c, c = n;
          }
          $c(r, !0, l, null, d);
          break;
        case "together":
          $c(r, !1, null, null, void 0);
          break;
        default:
          r.memoizedState = null;
      }
    return r.child;
  }
  function gr(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function ar(n, r, l) {
    if (n !== null && (r.dependencies = n.dependencies), Ii |= r.lanes, !(l & r.childLanes))
      return null;
    if (n !== null && r.child !== n.child)
      throw Error(N(153));
    if (r.child !== null) {
      for (n = r.child, l = Fl(n, n.pendingProps), r.child = l, l.return = r; n.sibling !== null; )
        n = n.sibling, l = l.sibling = Fl(n, n.pendingProps), l.return = r;
      l.sibling = null;
    }
    return r.child;
  }
  function $i(n, r, l) {
    switch (r.tag) {
      case 3:
        $v(r), mn();
        break;
      case 5:
        Me(r);
        break;
      case 1:
        sn(r.type) && fc(r);
        break;
      case 4:
        Cd(r, r.stateNode.containerInfo);
        break;
      case 10:
        var o = r.type._context, c = r.memoizedProps.value;
        Vt(yi, o._currentValue), o._currentValue = c;
        break;
      case 13:
        if (o = r.memoizedState, o !== null)
          return o.dehydrated !== null ? (Vt(ze, ze.current & 1), r.flags |= 128, null) : l & r.child.childLanes ? Dd(n, r, l) : (Vt(ze, ze.current & 1), n = ar(n, r, l), n !== null ? n.sibling : null);
        Vt(ze, ze.current & 1);
        break;
      case 19:
        if (o = (l & r.childLanes) !== 0, n.flags & 128) {
          if (o)
            return Md(n, r, l);
          r.flags |= 128;
        }
        if (c = r.memoizedState, c !== null && (c.rendering = null, c.tail = null, c.lastEffect = null), Vt(ze, ze.current), o)
          break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, mu(n, r, l);
    }
    return ar(n, r, l);
  }
  var Es, gu, Aa, Vn;
  Es = function(n, r) {
    for (var l = r.child; l !== null; ) {
      if (l.tag === 5 || l.tag === 6)
        n.appendChild(l.stateNode);
      else if (l.tag !== 4 && l.child !== null) {
        l.child.return = l, l = l.child;
        continue;
      }
      if (l === r)
        break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === r)
          return;
        l = l.return;
      }
      l.sibling.return = l.return, l = l.sibling;
    }
  }, gu = function() {
  }, Aa = function(n, r, l, o) {
    var c = n.memoizedProps;
    if (c !== o) {
      n = r.stateNode, ou(ni.current);
      var d = null;
      switch (l) {
        case "input":
          c = Yn(n, c), o = Yn(n, o), d = [];
          break;
        case "select":
          c = T({}, c, { value: void 0 }), o = T({}, o, { value: void 0 }), d = [];
          break;
        case "textarea":
          c = Yr(n, c), o = Yr(n, o), d = [];
          break;
        default:
          typeof c.onClick != "function" && typeof o.onClick == "function" && (n.onclick = cc);
      }
      _n(l, o);
      var m;
      l = null;
      for (A in c)
        if (!o.hasOwnProperty(A) && c.hasOwnProperty(A) && c[A] != null)
          if (A === "style") {
            var E = c[A];
            for (m in E)
              E.hasOwnProperty(m) && (l || (l = {}), l[m] = "");
          } else
            A !== "dangerouslySetInnerHTML" && A !== "children" && A !== "suppressContentEditableWarning" && A !== "suppressHydrationWarning" && A !== "autoFocus" && (Yt.hasOwnProperty(A) ? d || (d = []) : (d = d || []).push(A, null));
      for (A in o) {
        var w = o[A];
        if (E = c != null ? c[A] : void 0, o.hasOwnProperty(A) && w !== E && (w != null || E != null))
          if (A === "style")
            if (E) {
              for (m in E)
                !E.hasOwnProperty(m) || w && w.hasOwnProperty(m) || (l || (l = {}), l[m] = "");
              for (m in w)
                w.hasOwnProperty(m) && E[m] !== w[m] && (l || (l = {}), l[m] = w[m]);
            } else
              l || (d || (d = []), d.push(
                A,
                l
              )), l = w;
          else
            A === "dangerouslySetInnerHTML" ? (w = w ? w.__html : void 0, E = E ? E.__html : void 0, w != null && E !== w && (d = d || []).push(A, w)) : A === "children" ? typeof w != "string" && typeof w != "number" || (d = d || []).push(A, "" + w) : A !== "suppressContentEditableWarning" && A !== "suppressHydrationWarning" && (Yt.hasOwnProperty(A) ? (w != null && A === "onScroll" && Kt("scroll", n), d || E === w || (d = [])) : (d = d || []).push(A, w));
      }
      l && (d = d || []).push("style", l);
      var A = d;
      (r.updateQueue = A) && (r.flags |= 4);
    }
  }, Vn = function(n, r, l, o) {
    l !== o && (r.flags |= 4);
  };
  function Cs(n, r) {
    if (!an)
      switch (n.tailMode) {
        case "hidden":
          r = n.tail;
          for (var l = null; r !== null; )
            r.alternate !== null && (l = r), r = r.sibling;
          l === null ? n.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = n.tail;
          for (var o = null; l !== null; )
            l.alternate !== null && (o = l), l = l.sibling;
          o === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : o.sibling = null;
      }
  }
  function Sr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, l = 0, o = 0;
    if (r)
      for (var c = n.child; c !== null; )
        l |= c.lanes | c.childLanes, o |= c.subtreeFlags & 14680064, o |= c.flags & 14680064, c.return = n, c = c.sibling;
    else
      for (c = n.child; c !== null; )
        l |= c.lanes | c.childLanes, o |= c.subtreeFlags, o |= c.flags, c.return = n, c = c.sibling;
    return n.subtreeFlags |= o, n.childLanes = l, r;
  }
  function cy(n, r, l) {
    var o = r.pendingProps;
    switch (dd(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Sr(r), null;
      case 1:
        return sn(r.type) && La(), Sr(r), null;
      case 3:
        return o = r.stateNode, Ol(), Mt(Rn), Mt(Pe), Rc(), o.pendingContext && (o.context = o.pendingContext, o.pendingContext = null), (n === null || n.child === null) && (hc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Na !== null && (ks(Na), Na = null))), gu(n, r), Sr(r), null;
      case 5:
        ot(r);
        var c = ou(oo.current);
        if (l = r.type, n !== null && r.stateNode != null)
          Aa(n, r, l, o, c), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!o) {
            if (r.stateNode === null)
              throw Error(N(166));
            return Sr(r), null;
          }
          if (n = ou(ni.current), hc(r)) {
            o = r.stateNode, l = r.type;
            var d = r.memoizedProps;
            switch (o[hi] = r, o[iu] = d, n = (r.mode & 1) !== 0, l) {
              case "dialog":
                Kt("cancel", o), Kt("close", o);
                break;
              case "iframe":
              case "object":
              case "embed":
                Kt("load", o);
                break;
              case "video":
              case "audio":
                for (c = 0; c < as.length; c++)
                  Kt(as[c], o);
                break;
              case "source":
                Kt("error", o);
                break;
              case "img":
              case "image":
              case "link":
                Kt(
                  "error",
                  o
                ), Kt("load", o);
                break;
              case "details":
                Kt("toggle", o);
                break;
              case "input":
                An(o, d), Kt("invalid", o);
                break;
              case "select":
                o._wrapperState = { wasMultiple: !!d.multiple }, Kt("invalid", o);
                break;
              case "textarea":
                hr(o, d), Kt("invalid", o);
            }
            _n(l, d), c = null;
            for (var m in d)
              if (d.hasOwnProperty(m)) {
                var E = d[m];
                m === "children" ? typeof E == "string" ? o.textContent !== E && (d.suppressHydrationWarning !== !0 && sc(o.textContent, E, n), c = ["children", E]) : typeof E == "number" && o.textContent !== "" + E && (d.suppressHydrationWarning !== !0 && sc(
                  o.textContent,
                  E,
                  n
                ), c = ["children", "" + E]) : Yt.hasOwnProperty(m) && E != null && m === "onScroll" && Kt("scroll", o);
              }
            switch (l) {
              case "input":
                pr(o), Br(o, d, !0);
                break;
              case "textarea":
                pr(o), er(o);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof d.onClick == "function" && (o.onclick = cc);
            }
            o = c, r.updateQueue = o, o !== null && (r.flags |= 4);
          } else {
            m = c.nodeType === 9 ? c : c.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Ir(l)), n === "http://www.w3.org/1999/xhtml" ? l === "script" ? (n = m.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof o.is == "string" ? n = m.createElement(l, { is: o.is }) : (n = m.createElement(l), l === "select" && (m = n, o.multiple ? m.multiple = !0 : o.size && (m.size = o.size))) : n = m.createElementNS(n, l), n[hi] = r, n[iu] = o, Es(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (m = vn(l, o), l) {
                case "dialog":
                  Kt("cancel", n), Kt("close", n), c = o;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Kt("load", n), c = o;
                  break;
                case "video":
                case "audio":
                  for (c = 0; c < as.length; c++)
                    Kt(as[c], n);
                  c = o;
                  break;
                case "source":
                  Kt("error", n), c = o;
                  break;
                case "img":
                case "image":
                case "link":
                  Kt(
                    "error",
                    n
                  ), Kt("load", n), c = o;
                  break;
                case "details":
                  Kt("toggle", n), c = o;
                  break;
                case "input":
                  An(n, o), c = Yn(n, o), Kt("invalid", n);
                  break;
                case "option":
                  c = o;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!o.multiple }, c = T({}, o, { value: void 0 }), Kt("invalid", n);
                  break;
                case "textarea":
                  hr(n, o), c = Yr(n, o), Kt("invalid", n);
                  break;
                default:
                  c = o;
              }
              _n(l, c), E = c;
              for (d in E)
                if (E.hasOwnProperty(d)) {
                  var w = E[d];
                  d === "style" ? Lt(n, w) : d === "dangerouslySetInnerHTML" ? (w = w ? w.__html : void 0, w != null && ui(n, w)) : d === "children" ? typeof w == "string" ? (l !== "textarea" || w !== "") && ca(n, w) : typeof w == "number" && ca(n, "" + w) : d !== "suppressContentEditableWarning" && d !== "suppressHydrationWarning" && d !== "autoFocus" && (Yt.hasOwnProperty(d) ? w != null && d === "onScroll" && Kt("scroll", n) : w != null && Qe(n, d, w, m));
                }
              switch (l) {
                case "input":
                  pr(n), Br(n, o, !1);
                  break;
                case "textarea":
                  pr(n), er(n);
                  break;
                case "option":
                  o.value != null && n.setAttribute("value", "" + tt(o.value));
                  break;
                case "select":
                  n.multiple = !!o.multiple, d = o.value, d != null ? vr(n, !!o.multiple, d, !1) : o.defaultValue != null && vr(
                    n,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof c.onClick == "function" && (n.onclick = cc);
              }
              switch (l) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  o = !!o.autoFocus;
                  break e;
                case "img":
                  o = !0;
                  break e;
                default:
                  o = !1;
              }
            }
            o && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return Sr(r), null;
      case 6:
        if (n && r.stateNode != null)
          Vn(n, r, n.memoizedProps, o);
        else {
          if (typeof o != "string" && r.stateNode === null)
            throw Error(N(166));
          if (l = ou(oo.current), ou(ni.current), hc(r)) {
            if (o = r.stateNode, l = r.memoizedProps, o[hi] = r, (d = o.nodeValue !== l) && (n = ma, n !== null))
              switch (n.tag) {
                case 3:
                  sc(o.nodeValue, l, (n.mode & 1) !== 0);
                  break;
                case 5:
                  n.memoizedProps.suppressHydrationWarning !== !0 && sc(o.nodeValue, l, (n.mode & 1) !== 0);
              }
            d && (r.flags |= 4);
          } else
            o = (l.nodeType === 9 ? l : l.ownerDocument).createTextNode(o), o[hi] = r, r.stateNode = o;
        }
        return Sr(r), null;
      case 13:
        if (Mt(ze), o = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (an && ea !== null && r.mode & 1 && !(r.flags & 128))
            Ov(), mn(), r.flags |= 98560, d = !1;
          else if (d = hc(r), o !== null && o.dehydrated !== null) {
            if (n === null) {
              if (!d)
                throw Error(N(318));
              if (d = r.memoizedState, d = d !== null ? d.dehydrated : null, !d)
                throw Error(N(317));
              d[hi] = r;
            } else
              mn(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            Sr(r), d = !1;
          } else
            Na !== null && (ks(Na), Na = null), d = !0;
          if (!d)
            return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = l, r) : (o = o !== null, o !== (n !== null && n.memoizedState !== null) && o && (r.child.flags |= 8192, r.mode & 1 && (n === null || ze.current & 1 ? Bn === 0 && (Bn = 3) : Bd())), r.updateQueue !== null && (r.flags |= 4), Sr(r), null);
      case 4:
        return Ol(), gu(n, r), n === null && ro(r.stateNode.containerInfo), Sr(r), null;
      case 10:
        return bl(r.type._context), Sr(r), null;
      case 17:
        return sn(r.type) && La(), Sr(r), null;
      case 19:
        if (Mt(ze), d = r.memoizedState, d === null)
          return Sr(r), null;
        if (o = (r.flags & 128) !== 0, m = d.rendering, m === null)
          if (o)
            Cs(d, !1);
          else {
            if (Bn !== 0 || n !== null && n.flags & 128)
              for (n = r.child; n !== null; ) {
                if (m = yn(n), m !== null) {
                  for (r.flags |= 128, Cs(d, !1), o = m.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), r.subtreeFlags = 0, o = l, l = r.child; l !== null; )
                    d = l, n = o, d.flags &= 14680066, m = d.alternate, m === null ? (d.childLanes = 0, d.lanes = n, d.child = null, d.subtreeFlags = 0, d.memoizedProps = null, d.memoizedState = null, d.updateQueue = null, d.dependencies = null, d.stateNode = null) : (d.childLanes = m.childLanes, d.lanes = m.lanes, d.child = m.child, d.subtreeFlags = 0, d.deletions = null, d.memoizedProps = m.memoizedProps, d.memoizedState = m.memoizedState, d.updateQueue = m.updateQueue, d.type = m.type, n = m.dependencies, d.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), l = l.sibling;
                  return Vt(ze, ze.current & 1 | 2), r.child;
                }
                n = n.sibling;
              }
            d.tail !== null && Tt() > Ro && (r.flags |= 128, o = !0, Cs(d, !1), r.lanes = 4194304);
          }
        else {
          if (!o)
            if (n = yn(m), n !== null) {
              if (r.flags |= 128, o = !0, l = n.updateQueue, l !== null && (r.updateQueue = l, r.flags |= 4), Cs(d, !0), d.tail === null && d.tailMode === "hidden" && !m.alternate && !an)
                return Sr(r), null;
            } else
              2 * Tt() - d.renderingStartTime > Ro && l !== 1073741824 && (r.flags |= 128, o = !0, Cs(d, !1), r.lanes = 4194304);
          d.isBackwards ? (m.sibling = r.child, r.child = m) : (l = d.last, l !== null ? l.sibling = m : r.child = m, d.last = m);
        }
        return d.tail !== null ? (r = d.tail, d.rendering = r, d.tail = r.sibling, d.renderingStartTime = Tt(), r.sibling = null, l = ze.current, Vt(ze, o ? l & 1 | 2 : l & 1), r) : (Sr(r), null);
      case 22:
      case 23:
        return Pd(), o = r.memoizedState !== null, n !== null && n.memoizedState !== null !== o && (r.flags |= 8192), o && r.mode & 1 ? Sa & 1073741824 && (Sr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Sr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(N(156, r.tag));
  }
  function Nd(n, r) {
    switch (dd(r), r.tag) {
      case 1:
        return sn(r.type) && La(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Ol(), Mt(Rn), Mt(Pe), Rc(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return ot(r), null;
      case 13:
        if (Mt(ze), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null)
            throw Error(N(340));
          mn();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return Mt(ze), null;
      case 4:
        return Ol(), null;
      case 10:
        return bl(r.type._context), null;
      case 22:
      case 23:
        return Pd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Rs = !1, Pn = !1, Yv = typeof WeakSet == "function" ? WeakSet : Set, ve = null;
  function mo(n, r) {
    var l = n.ref;
    if (l !== null)
      if (typeof l == "function")
        try {
          l(null);
        } catch (o) {
          wn(n, r, o);
        }
      else
        l.current = null;
  }
  function Ts(n, r, l) {
    try {
      l();
    } catch (o) {
      wn(n, r, o);
    }
  }
  var Iv = !1;
  function Qv(n, r) {
    if (ad = _a, n = ac(), Ui(n)) {
      if ("selectionStart" in n)
        var l = { start: n.selectionStart, end: n.selectionEnd };
      else
        e: {
          l = (l = n.ownerDocument) && l.defaultView || window;
          var o = l.getSelection && l.getSelection();
          if (o && o.rangeCount !== 0) {
            l = o.anchorNode;
            var c = o.anchorOffset, d = o.focusNode;
            o = o.focusOffset;
            try {
              l.nodeType, d.nodeType;
            } catch {
              l = null;
              break e;
            }
            var m = 0, E = -1, w = -1, A = 0, Q = 0, G = n, I = null;
            t:
              for (; ; ) {
                for (var oe; G !== l || c !== 0 && G.nodeType !== 3 || (E = m + c), G !== d || o !== 0 && G.nodeType !== 3 || (w = m + o), G.nodeType === 3 && (m += G.nodeValue.length), (oe = G.firstChild) !== null; )
                  I = G, G = oe;
                for (; ; ) {
                  if (G === n)
                    break t;
                  if (I === l && ++A === c && (E = m), I === d && ++Q === o && (w = m), (oe = G.nextSibling) !== null)
                    break;
                  G = I, I = G.parentNode;
                }
                G = oe;
              }
            l = E === -1 || w === -1 ? null : { start: E, end: w };
          } else
            l = null;
        }
      l = l || { start: 0, end: 0 };
    } else
      l = null;
    for (ru = { focusedElem: n, selectionRange: l }, _a = !1, ve = r; ve !== null; )
      if (r = ve, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null)
        n.return = r, ve = n;
      else
        for (; ve !== null; ) {
          r = ve;
          try {
            var ge = r.alternate;
            if (r.flags & 1024)
              switch (r.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (ge !== null) {
                    var Ce = ge.memoizedProps, Dn = ge.memoizedState, k = r.stateNode, b = k.getSnapshotBeforeUpdate(r.elementType === r.type ? Ce : ya(r.type, Ce), Dn);
                    k.__reactInternalSnapshotBeforeUpdate = b;
                  }
                  break;
                case 3:
                  var L = r.stateNode.containerInfo;
                  L.nodeType === 1 ? L.textContent = "" : L.nodeType === 9 && L.documentElement && L.removeChild(L.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(N(163));
              }
          } catch (K) {
            wn(r, r.return, K);
          }
          if (n = r.sibling, n !== null) {
            n.return = r.return, ve = n;
            break;
          }
          ve = r.return;
        }
    return ge = Iv, Iv = !1, ge;
  }
  function ws(n, r, l) {
    var o = r.updateQueue;
    if (o = o !== null ? o.lastEffect : null, o !== null) {
      var c = o = o.next;
      do {
        if ((c.tag & n) === n) {
          var d = c.destroy;
          c.destroy = void 0, d !== void 0 && Ts(r, l, d);
        }
        c = c.next;
      } while (c !== o);
    }
  }
  function xs(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & n) === n) {
          var o = l.create;
          l.destroy = o();
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function zd(n) {
    var r = n.ref;
    if (r !== null) {
      var l = n.stateNode;
      switch (n.tag) {
        case 5:
          n = l;
          break;
        default:
          n = l;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function Ud(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, Ud(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[hi], delete r[iu], delete r[ud], delete r[ry], delete r[od])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Wv(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Yc(n) {
    e:
      for (; ; ) {
        for (; n.sibling === null; ) {
          if (n.return === null || Wv(n.return))
            return null;
          n = n.return;
        }
        for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
          if (n.flags & 2 || n.child === null || n.tag === 4)
            continue e;
          n.child.return = n, n = n.child;
        }
        if (!(n.flags & 2))
          return n.stateNode;
      }
  }
  function yo(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6)
      n = n.stateNode, r ? l.nodeType === 8 ? l.parentNode.insertBefore(n, r) : l.insertBefore(n, r) : (l.nodeType === 8 ? (r = l.parentNode, r.insertBefore(n, l)) : (r = l, r.appendChild(n)), l = l._reactRootContainer, l != null || r.onclick !== null || (r.onclick = cc));
    else if (o !== 4 && (n = n.child, n !== null))
      for (yo(n, r, l), n = n.sibling; n !== null; )
        yo(n, r, l), n = n.sibling;
  }
  function Si(n, r, l) {
    var o = n.tag;
    if (o === 5 || o === 6)
      n = n.stateNode, r ? l.insertBefore(n, r) : l.appendChild(n);
    else if (o !== 4 && (n = n.child, n !== null))
      for (Si(n, r, l), n = n.sibling; n !== null; )
        Si(n, r, l), n = n.sibling;
  }
  var cn = null, Xn = !1;
  function Fa(n, r, l) {
    for (l = l.child; l !== null; )
      go(n, r, l), l = l.sibling;
  }
  function go(n, r, l) {
    if (Qr && typeof Qr.onCommitFiberUnmount == "function")
      try {
        Qr.onCommitFiberUnmount(ol, l);
      } catch {
      }
    switch (l.tag) {
      case 5:
        Pn || mo(l, r);
      case 6:
        var o = cn, c = Xn;
        cn = null, Fa(n, r, l), cn = o, Xn = c, cn !== null && (Xn ? (n = cn, l = l.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(l) : n.removeChild(l)) : cn.removeChild(l.stateNode));
        break;
      case 18:
        cn !== null && (Xn ? (n = cn, l = l.stateNode, n.nodeType === 8 ? El(n.parentNode, l) : n.nodeType === 1 && El(n, l), hl(n)) : El(cn, l.stateNode));
        break;
      case 4:
        o = cn, c = Xn, cn = l.stateNode.containerInfo, Xn = !0, Fa(n, r, l), cn = o, Xn = c;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Pn && (o = l.updateQueue, o !== null && (o = o.lastEffect, o !== null))) {
          c = o = o.next;
          do {
            var d = c, m = d.destroy;
            d = d.tag, m !== void 0 && (d & 2 || d & 4) && Ts(l, r, m), c = c.next;
          } while (c !== o);
        }
        Fa(n, r, l);
        break;
      case 1:
        if (!Pn && (mo(l, r), o = l.stateNode, typeof o.componentWillUnmount == "function"))
          try {
            o.props = l.memoizedProps, o.state = l.memoizedState, o.componentWillUnmount();
          } catch (E) {
            wn(l, r, E);
          }
        Fa(n, r, l);
        break;
      case 21:
        Fa(n, r, l);
        break;
      case 22:
        l.mode & 1 ? (Pn = (o = Pn) || l.memoizedState !== null, Fa(n, r, l), Pn = o) : Fa(n, r, l);
        break;
      default:
        Fa(n, r, l);
    }
  }
  function Yi(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var l = n.stateNode;
      l === null && (l = n.stateNode = new Yv()), r.forEach(function(o) {
        var c = my.bind(null, n, o);
        l.has(o) || (l.add(o), o.then(c, c));
      });
    }
  }
  function ri(n, r) {
    var l = r.deletions;
    if (l !== null)
      for (var o = 0; o < l.length; o++) {
        var c = l[o];
        try {
          var d = n, m = r, E = m;
          e:
            for (; E !== null; ) {
              switch (E.tag) {
                case 5:
                  cn = E.stateNode, Xn = !1;
                  break e;
                case 3:
                  cn = E.stateNode.containerInfo, Xn = !0;
                  break e;
                case 4:
                  cn = E.stateNode.containerInfo, Xn = !0;
                  break e;
              }
              E = E.return;
            }
          if (cn === null)
            throw Error(N(160));
          go(d, m, c), cn = null, Xn = !1;
          var w = c.alternate;
          w !== null && (w.return = null), c.return = null;
        } catch (A) {
          wn(c, r, A);
        }
      }
    if (r.subtreeFlags & 12854)
      for (r = r.child; r !== null; )
        Gv(r, n), r = r.sibling;
  }
  function Gv(n, r) {
    var l = n.alternate, o = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ri(r, n), Ei(n), o & 4) {
          try {
            ws(3, n, n.return), xs(3, n);
          } catch (Ce) {
            wn(n, n.return, Ce);
          }
          try {
            ws(5, n, n.return);
          } catch (Ce) {
            wn(n, n.return, Ce);
          }
        }
        break;
      case 1:
        ri(r, n), Ei(n), o & 512 && l !== null && mo(l, l.return);
        break;
      case 5:
        if (ri(r, n), Ei(n), o & 512 && l !== null && mo(l, l.return), n.flags & 32) {
          var c = n.stateNode;
          try {
            ca(c, "");
          } catch (Ce) {
            wn(n, n.return, Ce);
          }
        }
        if (o & 4 && (c = n.stateNode, c != null)) {
          var d = n.memoizedProps, m = l !== null ? l.memoizedProps : d, E = n.type, w = n.updateQueue;
          if (n.updateQueue = null, w !== null)
            try {
              E === "input" && d.type === "radio" && d.name != null && Fn(c, d), vn(E, m);
              var A = vn(E, d);
              for (m = 0; m < w.length; m += 2) {
                var Q = w[m], G = w[m + 1];
                Q === "style" ? Lt(c, G) : Q === "dangerouslySetInnerHTML" ? ui(c, G) : Q === "children" ? ca(c, G) : Qe(c, Q, G, A);
              }
              switch (E) {
                case "input":
                  bn(c, d);
                  break;
                case "textarea":
                  sa(c, d);
                  break;
                case "select":
                  var I = c._wrapperState.wasMultiple;
                  c._wrapperState.wasMultiple = !!d.multiple;
                  var oe = d.value;
                  oe != null ? vr(c, !!d.multiple, oe, !1) : I !== !!d.multiple && (d.defaultValue != null ? vr(
                    c,
                    !!d.multiple,
                    d.defaultValue,
                    !0
                  ) : vr(c, !!d.multiple, d.multiple ? [] : "", !1));
              }
              c[iu] = d;
            } catch (Ce) {
              wn(n, n.return, Ce);
            }
        }
        break;
      case 6:
        if (ri(r, n), Ei(n), o & 4) {
          if (n.stateNode === null)
            throw Error(N(162));
          c = n.stateNode, d = n.memoizedProps;
          try {
            c.nodeValue = d;
          } catch (Ce) {
            wn(n, n.return, Ce);
          }
        }
        break;
      case 3:
        if (ri(r, n), Ei(n), o & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            hl(r.containerInfo);
          } catch (Ce) {
            wn(n, n.return, Ce);
          }
        break;
      case 4:
        ri(r, n), Ei(n);
        break;
      case 13:
        ri(r, n), Ei(n), c = n.child, c.flags & 8192 && (d = c.memoizedState !== null, c.stateNode.isHidden = d, !d || c.alternate !== null && c.alternate.memoizedState !== null || (Hd = Tt())), o & 4 && Yi(n);
        break;
      case 22:
        if (Q = l !== null && l.memoizedState !== null, n.mode & 1 ? (Pn = (A = Pn) || Q, ri(r, n), Pn = A) : ri(r, n), Ei(n), o & 8192) {
          if (A = n.memoizedState !== null, (n.stateNode.isHidden = A) && !Q && n.mode & 1)
            for (ve = n, Q = n.child; Q !== null; ) {
              for (G = ve = Q; ve !== null; ) {
                switch (I = ve, oe = I.child, I.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    ws(4, I, I.return);
                    break;
                  case 1:
                    mo(I, I.return);
                    var ge = I.stateNode;
                    if (typeof ge.componentWillUnmount == "function") {
                      o = I, l = I.return;
                      try {
                        r = o, ge.props = r.memoizedProps, ge.state = r.memoizedState, ge.componentWillUnmount();
                      } catch (Ce) {
                        wn(o, l, Ce);
                      }
                    }
                    break;
                  case 5:
                    mo(I, I.return);
                    break;
                  case 22:
                    if (I.memoizedState !== null) {
                      Ad(G);
                      continue;
                    }
                }
                oe !== null ? (oe.return = I, ve = oe) : Ad(G);
              }
              Q = Q.sibling;
            }
          e:
            for (Q = null, G = n; ; ) {
              if (G.tag === 5) {
                if (Q === null) {
                  Q = G;
                  try {
                    c = G.stateNode, A ? (d = c.style, typeof d.setProperty == "function" ? d.setProperty("display", "none", "important") : d.display = "none") : (E = G.stateNode, w = G.memoizedProps.style, m = w != null && w.hasOwnProperty("display") ? w.display : null, E.style.display = nt("display", m));
                  } catch (Ce) {
                    wn(n, n.return, Ce);
                  }
                }
              } else if (G.tag === 6) {
                if (Q === null)
                  try {
                    G.stateNode.nodeValue = A ? "" : G.memoizedProps;
                  } catch (Ce) {
                    wn(n, n.return, Ce);
                  }
              } else if ((G.tag !== 22 && G.tag !== 23 || G.memoizedState === null || G === n) && G.child !== null) {
                G.child.return = G, G = G.child;
                continue;
              }
              if (G === n)
                break e;
              for (; G.sibling === null; ) {
                if (G.return === null || G.return === n)
                  break e;
                Q === G && (Q = null), G = G.return;
              }
              Q === G && (Q = null), G.sibling.return = G.return, G = G.sibling;
            }
        }
        break;
      case 19:
        ri(r, n), Ei(n), o & 4 && Yi(n);
        break;
      case 21:
        break;
      default:
        ri(
          r,
          n
        ), Ei(n);
    }
  }
  function Ei(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var l = n.return; l !== null; ) {
            if (Wv(l)) {
              var o = l;
              break e;
            }
            l = l.return;
          }
          throw Error(N(160));
        }
        switch (o.tag) {
          case 5:
            var c = o.stateNode;
            o.flags & 32 && (ca(c, ""), o.flags &= -33);
            var d = Yc(n);
            Si(n, d, c);
            break;
          case 3:
          case 4:
            var m = o.stateNode.containerInfo, E = Yc(n);
            yo(n, E, m);
            break;
          default:
            throw Error(N(161));
        }
      } catch (w) {
        wn(n, n.return, w);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function qv(n, r, l) {
    ve = n, So(n);
  }
  function So(n, r, l) {
    for (var o = (n.mode & 1) !== 0; ve !== null; ) {
      var c = ve, d = c.child;
      if (c.tag === 22 && o) {
        var m = c.memoizedState !== null || Rs;
        if (!m) {
          var E = c.alternate, w = E !== null && E.memoizedState !== null || Pn;
          E = Rs;
          var A = Pn;
          if (Rs = m, (Pn = w) && !A)
            for (ve = c; ve !== null; )
              m = ve, w = m.child, m.tag === 22 && m.memoizedState !== null ? Kv(c) : w !== null ? (w.return = m, ve = w) : Kv(c);
          for (; d !== null; )
            ve = d, So(d), d = d.sibling;
          ve = c, Rs = E, Pn = A;
        }
        Xv(n);
      } else
        c.subtreeFlags & 8772 && d !== null ? (d.return = c, ve = d) : Xv(n);
    }
  }
  function Xv(n) {
    for (; ve !== null; ) {
      var r = ve;
      if (r.flags & 8772) {
        var l = r.alternate;
        try {
          if (r.flags & 8772)
            switch (r.tag) {
              case 0:
              case 11:
              case 15:
                Pn || xs(5, r);
                break;
              case 1:
                var o = r.stateNode;
                if (r.flags & 4 && !Pn)
                  if (l === null)
                    o.componentDidMount();
                  else {
                    var c = r.elementType === r.type ? l.memoizedProps : ya(r.type, l.memoizedProps);
                    o.componentDidUpdate(c, l.memoizedState, o.__reactInternalSnapshotBeforeUpdate);
                  }
                var d = r.updateQueue;
                d !== null && uu(r, d, o);
                break;
              case 3:
                var m = r.updateQueue;
                if (m !== null) {
                  if (l = null, r.child !== null)
                    switch (r.child.tag) {
                      case 5:
                        l = r.child.stateNode;
                        break;
                      case 1:
                        l = r.child.stateNode;
                    }
                  uu(r, m, l);
                }
                break;
              case 5:
                var E = r.stateNode;
                if (l === null && r.flags & 4) {
                  l = E;
                  var w = r.memoizedProps;
                  switch (r.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      w.autoFocus && l.focus();
                      break;
                    case "img":
                      w.src && (l.src = w.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (r.memoizedState === null) {
                  var A = r.alternate;
                  if (A !== null) {
                    var Q = A.memoizedState;
                    if (Q !== null) {
                      var G = Q.dehydrated;
                      G !== null && hl(G);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(N(163));
            }
          Pn || r.flags & 512 && zd(r);
        } catch (I) {
          wn(r, r.return, I);
        }
      }
      if (r === n) {
        ve = null;
        break;
      }
      if (l = r.sibling, l !== null) {
        l.return = r.return, ve = l;
        break;
      }
      ve = r.return;
    }
  }
  function Ad(n) {
    for (; ve !== null; ) {
      var r = ve;
      if (r === n) {
        ve = null;
        break;
      }
      var l = r.sibling;
      if (l !== null) {
        l.return = r.return, ve = l;
        break;
      }
      ve = r.return;
    }
  }
  function Kv(n) {
    for (; ve !== null; ) {
      var r = ve;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var l = r.return;
            try {
              xs(4, r);
            } catch (w) {
              wn(r, l, w);
            }
            break;
          case 1:
            var o = r.stateNode;
            if (typeof o.componentDidMount == "function") {
              var c = r.return;
              try {
                o.componentDidMount();
              } catch (w) {
                wn(r, c, w);
              }
            }
            var d = r.return;
            try {
              zd(r);
            } catch (w) {
              wn(r, d, w);
            }
            break;
          case 5:
            var m = r.return;
            try {
              zd(r);
            } catch (w) {
              wn(r, m, w);
            }
        }
      } catch (w) {
        wn(r, r.return, w);
      }
      if (r === n) {
        ve = null;
        break;
      }
      var E = r.sibling;
      if (E !== null) {
        E.return = r.return, ve = E;
        break;
      }
      ve = r.return;
    }
  }
  var Ic = Math.ceil, bs = ct.ReactCurrentDispatcher, Fd = ct.ReactCurrentOwner, Er = ct.ReactCurrentBatchConfig, dt = 0, gn = null, Tn = null, Kn = 0, Sa = 0, Eo = Ke(0), Bn = 0, _s = null, Ii = 0, Qc = 0, Co = 0, Su = null, Or = null, Hd = 0, Ro = 1 / 0, Qi = null, Wc = !1, Eu = null, Ci = null, zl = !1, Ul = null, Gc = 0, To = 0, qc = null, Cu = -1, Ru = 0;
  function Cr() {
    return dt & 6 ? Tt() : Cu !== -1 ? Cu : Cu = Tt();
  }
  function zn(n) {
    return n.mode & 1 ? dt & 2 && Kn !== 0 ? Kn & -Kn : mc.transition !== null ? (Ru === 0 && (Ru = $u()), Ru) : (n = kt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : qo(n.type)), n) : 1;
  }
  function Rr(n, r, l, o) {
    if (50 < To)
      throw To = 0, qc = null, Error(N(185));
    Oi(n, l, o), (!(dt & 2) || n !== gn) && (n === gn && (!(dt & 2) && (Qc |= l), Bn === 4 && Ha(n, Kn)), Tr(n, o), l === 1 && dt === 0 && !(r.mode & 1) && (Ro = Tt() + 500, Gn && Kr()));
  }
  function Tr(n, r) {
    var l = n.callbackNode;
    fl(n, r);
    var o = kr(n, n === gn ? Kn : 0);
    if (o === 0)
      l !== null && tr(l), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = o & -o, n.callbackPriority !== r) {
      if (l != null && tr(l), r === 1)
        n.tag === 0 ? cd(Zv.bind(null, n)) : sd(Zv.bind(null, n)), ld(function() {
          !(dt & 6) && Kr();
        }), l = null;
      else {
        switch (Iu(o)) {
          case 1:
            l = qa;
            break;
          case 4:
            l = lt;
            break;
          case 16:
            l = di;
            break;
          case 536870912:
            l = Pu;
            break;
          default:
            l = di;
        }
        l = Yd(l, wo.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = l;
    }
  }
  function wo(n, r) {
    if (Cu = -1, Ru = 0, dt & 6)
      throw Error(N(327));
    var l = n.callbackNode;
    if (bo() && n.callbackNode !== l)
      return null;
    var o = kr(n, n === gn ? Kn : 0);
    if (o === 0)
      return null;
    if (o & 30 || o & n.expiredLanes || r)
      r = Kc(n, o);
    else {
      r = o;
      var c = dt;
      dt |= 2;
      var d = Xc();
      (gn !== n || Kn !== r) && (Qi = null, Ro = Tt() + 500, Tu(n, r));
      do
        try {
          dy();
          break;
        } catch (E) {
          Jv(n, E);
        }
      while (1);
      md(), bs.current = d, dt = c, Tn !== null ? r = 0 : (gn = null, Kn = 0, r = Bn);
    }
    if (r !== 0) {
      if (r === 2 && (c = dl(n), c !== 0 && (o = c, r = jd(n, c))), r === 1)
        throw l = _s, Tu(n, 0), Ha(n, o), Tr(n, Tt()), l;
      if (r === 6)
        Ha(n, o);
      else {
        if (c = n.current.alternate, !(o & 30) && !Vd(c) && (r = Kc(n, o), r === 2 && (d = dl(n), d !== 0 && (o = d, r = jd(n, d))), r === 1))
          throw l = _s, Tu(n, 0), Ha(n, o), Tr(n, Tt()), l;
        switch (n.finishedWork = c, n.finishedLanes = o, r) {
          case 0:
          case 1:
            throw Error(N(345));
          case 2:
            wu(n, Or, Qi);
            break;
          case 3:
            if (Ha(n, o), (o & 130023424) === o && (r = Hd + 500 - Tt(), 10 < r)) {
              if (kr(n, 0) !== 0)
                break;
              if (c = n.suspendedLanes, (c & o) !== o) {
                Cr(), n.pingedLanes |= n.suspendedLanes & c;
                break;
              }
              n.timeoutHandle = au(wu.bind(null, n, Or, Qi), r);
              break;
            }
            wu(n, Or, Qi);
            break;
          case 4:
            if (Ha(n, o), (o & 4194240) === o)
              break;
            for (r = n.eventTimes, c = -1; 0 < o; ) {
              var m = 31 - _r(o);
              d = 1 << m, m = r[m], m > c && (c = m), o &= ~d;
            }
            if (o = c, o = Tt() - o, o = (120 > o ? 120 : 480 > o ? 480 : 1080 > o ? 1080 : 1920 > o ? 1920 : 3e3 > o ? 3e3 : 4320 > o ? 4320 : 1960 * Ic(o / 1960)) - o, 10 < o) {
              n.timeoutHandle = au(wu.bind(null, n, Or, Qi), o);
              break;
            }
            wu(n, Or, Qi);
            break;
          case 5:
            wu(n, Or, Qi);
            break;
          default:
            throw Error(N(329));
        }
      }
    }
    return Tr(n, Tt()), n.callbackNode === l ? wo.bind(null, n) : null;
  }
  function jd(n, r) {
    var l = Su;
    return n.current.memoizedState.isDehydrated && (Tu(n, r).flags |= 256), n = Kc(n, r), n !== 2 && (r = Or, Or = l, r !== null && ks(r)), n;
  }
  function ks(n) {
    Or === null ? Or = n : Or.push.apply(Or, n);
  }
  function Vd(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var l = r.updateQueue;
        if (l !== null && (l = l.stores, l !== null))
          for (var o = 0; o < l.length; o++) {
            var c = l[o], d = c.getSnapshot;
            c = c.value;
            try {
              if (!ka(d(), c))
                return !1;
            } catch {
              return !1;
            }
          }
      }
      if (l = r.child, r.subtreeFlags & 16384 && l !== null)
        l.return = r, r = l;
      else {
        if (r === n)
          break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n)
            return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function Ha(n, r) {
    for (r &= ~Co, r &= ~Qc, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var l = 31 - _r(r), o = 1 << l;
      n[l] = -1, r &= ~o;
    }
  }
  function Zv(n) {
    if (dt & 6)
      throw Error(N(327));
    bo();
    var r = kr(n, 0);
    if (!(r & 1))
      return Tr(n, Tt()), null;
    var l = Kc(n, r);
    if (n.tag !== 0 && l === 2) {
      var o = dl(n);
      o !== 0 && (r = o, l = jd(n, o));
    }
    if (l === 1)
      throw l = _s, Tu(n, 0), Ha(n, r), Tr(n, Tt()), l;
    if (l === 6)
      throw Error(N(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, wu(n, Or, Qi), Tr(n, Tt()), null;
  }
  function xo(n, r) {
    var l = dt;
    dt |= 1;
    try {
      return n(r);
    } finally {
      dt = l, dt === 0 && (Ro = Tt() + 500, Gn && Kr());
    }
  }
  function Al(n) {
    Ul !== null && Ul.tag === 0 && !(dt & 6) && bo();
    var r = dt;
    dt |= 1;
    var l = Er.transition, o = kt;
    try {
      if (Er.transition = null, kt = 1, n)
        return n();
    } finally {
      kt = o, Er.transition = l, dt = r, !(dt & 6) && Kr();
    }
  }
  function Pd() {
    Sa = Eo.current, Mt(Eo);
  }
  function Tu(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var l = n.timeoutHandle;
    if (l !== -1 && (n.timeoutHandle = -1, bv(l)), Tn !== null)
      for (l = Tn.return; l !== null; ) {
        var o = l;
        switch (dd(o), o.tag) {
          case 1:
            o = o.type.childContextTypes, o != null && La();
            break;
          case 3:
            Ol(), Mt(Rn), Mt(Pe), Rc();
            break;
          case 5:
            ot(o);
            break;
          case 4:
            Ol();
            break;
          case 13:
            Mt(ze);
            break;
          case 19:
            Mt(ze);
            break;
          case 10:
            bl(o.type._context);
            break;
          case 22:
          case 23:
            Pd();
        }
        l = l.return;
      }
    if (gn = n, Tn = n = Fl(n.current, null), Kn = Sa = r, Bn = 0, _s = null, Co = Qc = Ii = 0, Or = Su = null, rr !== null) {
      for (r = 0; r < rr.length; r++)
        if (l = rr[r], o = l.interleaved, o !== null) {
          l.interleaved = null;
          var c = o.next, d = l.pending;
          if (d !== null) {
            var m = d.next;
            d.next = c, o.next = m;
          }
          l.pending = o;
        }
      rr = null;
    }
    return n;
  }
  function Jv(n, r) {
    do {
      var l = Tn;
      try {
        if (md(), Tc.current = jc, Ae) {
          for (var o = ln.memoizedState; o !== null; ) {
            var c = o.queue;
            c !== null && (c.pending = null), o = o.next;
          }
          Ae = !1;
        }
        if (su = 0, yt = V = ln = null, gi = !1, ga = 0, Fd.current = null, l === null || l.return === null) {
          Bn = 1, _s = r, Tn = null;
          break;
        }
        e: {
          var d = n, m = l.return, E = l, w = r;
          if (r = Kn, E.flags |= 32768, w !== null && typeof w == "object" && typeof w.then == "function") {
            var A = w, Q = E, G = Q.tag;
            if (!(Q.mode & 1) && (G === 0 || G === 11 || G === 15)) {
              var I = Q.alternate;
              I ? (Q.updateQueue = I.updateQueue, Q.memoizedState = I.memoizedState, Q.lanes = I.lanes) : (Q.updateQueue = null, Q.memoizedState = null);
            }
            var oe = xd(m);
            if (oe !== null) {
              oe.flags &= -257, bd(oe, m, E, d, r), oe.mode & 1 && Pv(d, A, r), r = oe, w = A;
              var ge = r.updateQueue;
              if (ge === null) {
                var Ce = /* @__PURE__ */ new Set();
                Ce.add(w), r.updateQueue = Ce;
              } else
                ge.add(w);
              break e;
            } else {
              if (!(r & 1)) {
                Pv(d, A, r), Bd();
                break e;
              }
              w = Error(N(426));
            }
          } else if (an && E.mode & 1) {
            var Dn = xd(m);
            if (Dn !== null) {
              !(Dn.flags & 65536) && (Dn.flags |= 256), bd(Dn, m, E, d, r), vd(po(w, E));
              break e;
            }
          }
          d = w = po(w, E), Bn !== 4 && (Bn = 2), Su === null ? Su = [d] : Su.push(d), d = m;
          do {
            switch (d.tag) {
              case 3:
                d.flags |= 65536, r &= -r, d.lanes |= r;
                var k = Vv(d, w, r);
                Sd(d, k);
                break e;
              case 1:
                E = w;
                var b = d.type, L = d.stateNode;
                if (!(d.flags & 128) && (typeof b.getDerivedStateFromError == "function" || L !== null && typeof L.componentDidCatch == "function" && (Ci === null || !Ci.has(L)))) {
                  d.flags |= 65536, r &= -r, d.lanes |= r;
                  var K = Ss(d, E, r);
                  Sd(d, K);
                  break e;
                }
            }
            d = d.return;
          } while (d !== null);
        }
        $d(l);
      } catch (Re) {
        r = Re, Tn === l && l !== null && (Tn = l = l.return);
        continue;
      }
      break;
    } while (1);
  }
  function Xc() {
    var n = bs.current;
    return bs.current = jc, n === null ? jc : n;
  }
  function Bd() {
    (Bn === 0 || Bn === 3 || Bn === 2) && (Bn = 4), gn === null || !(Ii & 268435455) && !(Qc & 268435455) || Ha(gn, Kn);
  }
  function Kc(n, r) {
    var l = dt;
    dt |= 2;
    var o = Xc();
    (gn !== n || Kn !== r) && (Qi = null, Tu(n, r));
    do
      try {
        fy();
        break;
      } catch (c) {
        Jv(n, c);
      }
    while (1);
    if (md(), dt = l, bs.current = o, Tn !== null)
      throw Error(N(261));
    return gn = null, Kn = 0, Bn;
  }
  function fy() {
    for (; Tn !== null; )
      eh(Tn);
  }
  function dy() {
    for (; Tn !== null && !fi(); )
      eh(Tn);
  }
  function eh(n) {
    var r = nh(n.alternate, n, Sa);
    n.memoizedProps = n.pendingProps, r === null ? $d(n) : Tn = r, Fd.current = null;
  }
  function $d(n) {
    var r = n;
    do {
      var l = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (l = Nd(l, r), l !== null) {
          l.flags &= 32767, Tn = l;
          return;
        }
        if (n !== null)
          n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Bn = 6, Tn = null;
          return;
        }
      } else if (l = cy(l, r, Sa), l !== null) {
        Tn = l;
        return;
      }
      if (r = r.sibling, r !== null) {
        Tn = r;
        return;
      }
      Tn = r = n;
    } while (r !== null);
    Bn === 0 && (Bn = 5);
  }
  function wu(n, r, l) {
    var o = kt, c = Er.transition;
    try {
      Er.transition = null, kt = 1, py(n, r, l, o);
    } finally {
      Er.transition = c, kt = o;
    }
    return null;
  }
  function py(n, r, l, o) {
    do
      bo();
    while (Ul !== null);
    if (dt & 6)
      throw Error(N(327));
    l = n.finishedWork;
    var c = n.finishedLanes;
    if (l === null)
      return null;
    if (n.finishedWork = null, n.finishedLanes = 0, l === n.current)
      throw Error(N(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var d = l.lanes | l.childLanes;
    if (jf(n, d), n === gn && (Tn = gn = null, Kn = 0), !(l.subtreeFlags & 2064) && !(l.flags & 2064) || zl || (zl = !0, Yd(di, function() {
      return bo(), null;
    })), d = (l.flags & 15990) !== 0, l.subtreeFlags & 15990 || d) {
      d = Er.transition, Er.transition = null;
      var m = kt;
      kt = 1;
      var E = dt;
      dt |= 4, Fd.current = null, Qv(n, l), Gv(l, n), ic(ru), _a = !!ad, ru = ad = null, n.current = l, qv(l), Vu(), dt = E, kt = m, Er.transition = d;
    } else
      n.current = l;
    if (zl && (zl = !1, Ul = n, Gc = c), d = n.pendingLanes, d === 0 && (Ci = null), Qo(l.stateNode), Tr(n, Tt()), r !== null)
      for (o = n.onRecoverableError, l = 0; l < r.length; l++)
        c = r[l], o(c.value, { componentStack: c.stack, digest: c.digest });
    if (Wc)
      throw Wc = !1, n = Eu, Eu = null, n;
    return Gc & 1 && n.tag !== 0 && bo(), d = n.pendingLanes, d & 1 ? n === qc ? To++ : (To = 0, qc = n) : To = 0, Kr(), null;
  }
  function bo() {
    if (Ul !== null) {
      var n = Iu(Gc), r = Er.transition, l = kt;
      try {
        if (Er.transition = null, kt = 16 > n ? 16 : n, Ul === null)
          var o = !1;
        else {
          if (n = Ul, Ul = null, Gc = 0, dt & 6)
            throw Error(N(331));
          var c = dt;
          for (dt |= 4, ve = n.current; ve !== null; ) {
            var d = ve, m = d.child;
            if (ve.flags & 16) {
              var E = d.deletions;
              if (E !== null) {
                for (var w = 0; w < E.length; w++) {
                  var A = E[w];
                  for (ve = A; ve !== null; ) {
                    var Q = ve;
                    switch (Q.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ws(8, Q, d);
                    }
                    var G = Q.child;
                    if (G !== null)
                      G.return = Q, ve = G;
                    else
                      for (; ve !== null; ) {
                        Q = ve;
                        var I = Q.sibling, oe = Q.return;
                        if (Ud(Q), Q === A) {
                          ve = null;
                          break;
                        }
                        if (I !== null) {
                          I.return = oe, ve = I;
                          break;
                        }
                        ve = oe;
                      }
                  }
                }
                var ge = d.alternate;
                if (ge !== null) {
                  var Ce = ge.child;
                  if (Ce !== null) {
                    ge.child = null;
                    do {
                      var Dn = Ce.sibling;
                      Ce.sibling = null, Ce = Dn;
                    } while (Ce !== null);
                  }
                }
                ve = d;
              }
            }
            if (d.subtreeFlags & 2064 && m !== null)
              m.return = d, ve = m;
            else
              e:
                for (; ve !== null; ) {
                  if (d = ve, d.flags & 2048)
                    switch (d.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ws(9, d, d.return);
                    }
                  var k = d.sibling;
                  if (k !== null) {
                    k.return = d.return, ve = k;
                    break e;
                  }
                  ve = d.return;
                }
          }
          var b = n.current;
          for (ve = b; ve !== null; ) {
            m = ve;
            var L = m.child;
            if (m.subtreeFlags & 2064 && L !== null)
              L.return = m, ve = L;
            else
              e:
                for (m = b; ve !== null; ) {
                  if (E = ve, E.flags & 2048)
                    try {
                      switch (E.tag) {
                        case 0:
                        case 11:
                        case 15:
                          xs(9, E);
                      }
                    } catch (Re) {
                      wn(E, E.return, Re);
                    }
                  if (E === m) {
                    ve = null;
                    break e;
                  }
                  var K = E.sibling;
                  if (K !== null) {
                    K.return = E.return, ve = K;
                    break e;
                  }
                  ve = E.return;
                }
          }
          if (dt = c, Kr(), Qr && typeof Qr.onPostCommitFiberRoot == "function")
            try {
              Qr.onPostCommitFiberRoot(ol, n);
            } catch {
            }
          o = !0;
        }
        return o;
      } finally {
        kt = l, Er.transition = r;
      }
    }
    return !1;
  }
  function th(n, r, l) {
    r = po(l, r), r = Vv(n, r, 1), n = kl(n, r, 1), r = Cr(), n !== null && (Oi(n, 1, r), Tr(n, r));
  }
  function wn(n, r, l) {
    if (n.tag === 3)
      th(n, n, l);
    else
      for (; r !== null; ) {
        if (r.tag === 3) {
          th(r, n, l);
          break;
        } else if (r.tag === 1) {
          var o = r.stateNode;
          if (typeof r.type.getDerivedStateFromError == "function" || typeof o.componentDidCatch == "function" && (Ci === null || !Ci.has(o))) {
            n = po(l, n), n = Ss(r, n, 1), r = kl(r, n, 1), n = Cr(), r !== null && (Oi(r, 1, n), Tr(r, n));
            break;
          }
        }
        r = r.return;
      }
  }
  function vy(n, r, l) {
    var o = n.pingCache;
    o !== null && o.delete(r), r = Cr(), n.pingedLanes |= n.suspendedLanes & l, gn === n && (Kn & l) === l && (Bn === 4 || Bn === 3 && (Kn & 130023424) === Kn && 500 > Tt() - Hd ? Tu(n, 0) : Co |= l), Tr(n, r);
  }
  function Zc(n, r) {
    r === 0 && (n.mode & 1 ? (r = sl, sl <<= 1, !(sl & 130023424) && (sl = 4194304)) : r = 1);
    var l = Cr();
    n = Vi(n, r), n !== null && (Oi(n, r, l), Tr(n, l));
  }
  function hy(n) {
    var r = n.memoizedState, l = 0;
    r !== null && (l = r.retryLane), Zc(n, l);
  }
  function my(n, r) {
    var l = 0;
    switch (n.tag) {
      case 13:
        var o = n.stateNode, c = n.memoizedState;
        c !== null && (l = c.retryLane);
        break;
      case 19:
        o = n.stateNode;
        break;
      default:
        throw Error(N(314));
    }
    o !== null && o.delete(r), Zc(n, l);
  }
  var nh;
  nh = function(n, r, l) {
    if (n !== null)
      if (n.memoizedProps !== r.pendingProps || Rn.current)
        Nn = !0;
      else {
        if (!(n.lanes & l) && !(r.flags & 128))
          return Nn = !1, $i(n, r, l);
        Nn = !!(n.flags & 131072);
      }
    else
      Nn = !1, an && r.flags & 1048576 && fd(r, io, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var o = r.type;
        gr(n, r), n = r.pendingProps;
        var c = Oa(r, Pe.current);
        te(r, l), c = Ll(null, r, o, n, c, l);
        var d = du();
        return r.flags |= 1, typeof c == "object" && c !== null && typeof c.render == "function" && c.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, sn(o) ? (d = !0, fc(r)) : d = !1, r.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, gd(r), c.updater = Sc, r.stateNode = c, c._reactInternals = r, Ec(r, o, n, l), r = Bv(null, r, o, !0, d, l)) : (r.tag = 0, an && d && dc(r), jn(null, r, c, l), r = r.child), r;
      case 16:
        o = r.elementType;
        e: {
          switch (gr(n, r), n = r.pendingProps, c = o._init, o = c(o._payload), r.type = o, c = r.tag = gy(o), n = ya(o, n), c) {
            case 0:
              r = vo(null, r, o, n, l);
              break e;
            case 1:
              r = _d(null, r, o, n, l);
              break e;
            case 11:
              r = Nl(null, r, o, n, l);
              break e;
            case 14:
              r = Pc(null, r, o, ya(o.type, n), l);
              break e;
          }
          throw Error(N(
            306,
            o,
            ""
          ));
        }
        return r;
      case 0:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ya(o, c), vo(n, r, o, c, l);
      case 1:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ya(o, c), _d(n, r, o, c, l);
      case 3:
        e: {
          if ($v(r), n === null)
            throw Error(N(387));
          o = r.pendingProps, d = r.memoizedState, c = d.element, Hn(n, r), Dl(r, o, null, l);
          var m = r.memoizedState;
          if (o = m.element, d.isDehydrated)
            if (d = { element: o, isDehydrated: !1, cache: m.cache, pendingSuspenseBoundaries: m.pendingSuspenseBoundaries, transitions: m.transitions }, r.updateQueue.baseState = d, r.memoizedState = d, r.flags & 256) {
              c = po(Error(N(423)), r), r = Bc(n, r, o, l, c);
              break e;
            } else if (o !== c) {
              c = po(Error(N(424)), r), r = Bc(n, r, o, l, c);
              break e;
            } else
              for (ea = ti(r.stateNode.containerInfo.firstChild), ma = r, an = !0, Na = null, l = Hv(r, null, o, l), r.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
          else {
            if (mn(), o === c) {
              r = ar(n, r, l);
              break e;
            }
            jn(n, r, o, l);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Me(r), n === null && vc(r), o = r.type, c = r.pendingProps, d = n !== null ? n.memoizedProps : null, m = c.children, us(o, c) ? m = null : d !== null && us(o, d) && (r.flags |= 32), Ze(n, r), jn(n, r, m, l), r.child;
      case 6:
        return n === null && vc(r), null;
      case 13:
        return Dd(n, r, l);
      case 4:
        return Cd(r, r.stateNode.containerInfo), o = r.pendingProps, n === null ? r.child = uo(r, null, o, l) : jn(n, r, o, l), r.child;
      case 11:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ya(o, c), Nl(n, r, o, c, l);
      case 7:
        return jn(n, r, r.pendingProps, l), r.child;
      case 8:
        return jn(n, r, r.pendingProps.children, l), r.child;
      case 12:
        return jn(n, r, r.pendingProps.children, l), r.child;
      case 10:
        e: {
          if (o = r.type._context, c = r.pendingProps, d = r.memoizedProps, m = c.value, Vt(yi, o._currentValue), o._currentValue = m, d !== null)
            if (ka(d.value, m)) {
              if (d.children === c.children && !Rn.current) {
                r = ar(n, r, l);
                break e;
              }
            } else
              for (d = r.child, d !== null && (d.return = r); d !== null; ) {
                var E = d.dependencies;
                if (E !== null) {
                  m = d.child;
                  for (var w = E.firstContext; w !== null; ) {
                    if (w.context === o) {
                      if (d.tag === 1) {
                        w = Pi(-1, l & -l), w.tag = 2;
                        var A = d.updateQueue;
                        if (A !== null) {
                          A = A.shared;
                          var Q = A.pending;
                          Q === null ? w.next = w : (w.next = Q.next, Q.next = w), A.pending = w;
                        }
                      }
                      d.lanes |= l, w = d.alternate, w !== null && (w.lanes |= l), qn(
                        d.return,
                        l,
                        r
                      ), E.lanes |= l;
                      break;
                    }
                    w = w.next;
                  }
                } else if (d.tag === 10)
                  m = d.type === r.type ? null : d.child;
                else if (d.tag === 18) {
                  if (m = d.return, m === null)
                    throw Error(N(341));
                  m.lanes |= l, E = m.alternate, E !== null && (E.lanes |= l), qn(m, l, r), m = d.sibling;
                } else
                  m = d.child;
                if (m !== null)
                  m.return = d;
                else
                  for (m = d; m !== null; ) {
                    if (m === r) {
                      m = null;
                      break;
                    }
                    if (d = m.sibling, d !== null) {
                      d.return = m.return, m = d;
                      break;
                    }
                    m = m.return;
                  }
                d = m;
              }
          jn(n, r, c.children, l), r = r.child;
        }
        return r;
      case 9:
        return c = r.type, o = r.pendingProps.children, te(r, l), c = kn(c), o = o(c), r.flags |= 1, jn(n, r, o, l), r.child;
      case 14:
        return o = r.type, c = ya(o, r.pendingProps), c = ya(o.type, c), Pc(n, r, o, c, l);
      case 15:
        return ra(n, r, r.type, r.pendingProps, l);
      case 17:
        return o = r.type, c = r.pendingProps, c = r.elementType === o ? c : ya(o, c), gr(n, r), r.tag = 1, sn(o) ? (n = !0, fc(r)) : n = !1, te(r, l), zv(r, o, c), Ec(r, o, c, l), Bv(null, r, o, !0, n, l);
      case 19:
        return Md(n, r, l);
      case 22:
        return mu(n, r, l);
    }
    throw Error(N(156, r.tag));
  };
  function Yd(n, r) {
    return en(n, r);
  }
  function yy(n, r, l, o) {
    this.tag = n, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = o, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ja(n, r, l, o) {
    return new yy(n, r, l, o);
  }
  function Id(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function gy(n) {
    if (typeof n == "function")
      return Id(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === En)
        return 11;
      if (n === zt)
        return 14;
    }
    return 2;
  }
  function Fl(n, r) {
    var l = n.alternate;
    return l === null ? (l = ja(n.tag, r, n.key, n.mode), l.elementType = n.elementType, l.type = n.type, l.stateNode = n.stateNode, l.alternate = n, n.alternate = l) : (l.pendingProps = r, l.type = n.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = n.flags & 14680064, l.childLanes = n.childLanes, l.lanes = n.lanes, l.child = n.child, l.memoizedProps = n.memoizedProps, l.memoizedState = n.memoizedState, l.updateQueue = n.updateQueue, r = n.dependencies, l.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, l.sibling = n.sibling, l.index = n.index, l.ref = n.ref, l;
  }
  function Jc(n, r, l, o, c, d) {
    var m = 2;
    if (o = n, typeof n == "function")
      Id(n) && (m = 1);
    else if (typeof n == "string")
      m = 5;
    else
      e:
        switch (n) {
          case He:
            return xu(l.children, c, d, r);
          case nn:
            m = 8, c |= 8;
            break;
          case xn:
            return n = ja(12, l, r, c | 2), n.elementType = xn, n.lanes = d, n;
          case Ue:
            return n = ja(13, l, r, c), n.elementType = Ue, n.lanes = d, n;
          case qe:
            return n = ja(19, l, r, c), n.elementType = qe, n.lanes = d, n;
          case ye:
            return Ds(l, c, d, r);
          default:
            if (typeof n == "object" && n !== null)
              switch (n.$$typeof) {
                case Qt:
                  m = 10;
                  break e;
                case _t:
                  m = 9;
                  break e;
                case En:
                  m = 11;
                  break e;
                case zt:
                  m = 14;
                  break e;
                case Rt:
                  m = 16, o = null;
                  break e;
              }
            throw Error(N(130, n == null ? n : typeof n, ""));
        }
    return r = ja(m, l, r, c), r.elementType = n, r.type = o, r.lanes = d, r;
  }
  function xu(n, r, l, o) {
    return n = ja(7, n, o, r), n.lanes = l, n;
  }
  function Ds(n, r, l, o) {
    return n = ja(22, n, o, r), n.elementType = ye, n.lanes = l, n.stateNode = { isHidden: !1 }, n;
  }
  function Os(n, r, l) {
    return n = ja(6, n, null, r), n.lanes = l, n;
  }
  function bu(n, r, l) {
    return r = ja(4, n.children !== null ? n.children : [], n.key, r), r.lanes = l, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function Sy(n, r, l, o, c) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Yu(0), this.expirationTimes = Yu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Yu(0), this.identifierPrefix = o, this.onRecoverableError = c, this.mutableSourceEagerHydrationData = null;
  }
  function ef(n, r, l, o, c, d, m, E, w) {
    return n = new Sy(n, r, l, E, w), r === 1 ? (r = 1, d === !0 && (r |= 8)) : r = 0, d = ja(3, null, null, r), n.current = d, d.stateNode = n, d.memoizedState = { element: o, isDehydrated: l, cache: null, transitions: null, pendingSuspenseBoundaries: null }, gd(d), n;
  }
  function rh(n, r, l) {
    var o = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: it, key: o == null ? null : "" + o, children: n, containerInfo: r, implementation: l };
  }
  function Qd(n) {
    if (!n)
      return mi;
    n = n._reactInternals;
    e: {
      if (Ge(n) !== n || n.tag !== 1)
        throw Error(N(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (sn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(N(171));
    }
    if (n.tag === 1) {
      var l = n.type;
      if (sn(l))
        return cs(n, l, r);
    }
    return r;
  }
  function ah(n, r, l, o, c, d, m, E, w) {
    return n = ef(l, o, !0, n, c, d, m, E, w), n.context = Qd(null), l = n.current, o = Cr(), c = zn(l), d = Pi(o, c), d.callback = r ?? null, kl(l, d, c), n.current.lanes = c, Oi(n, c, o), Tr(n, o), n;
  }
  function Ls(n, r, l, o) {
    var c = r.current, d = Cr(), m = zn(c);
    return l = Qd(l), r.context === null ? r.context = l : r.pendingContext = l, r = Pi(d, m), r.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (r.callback = o), n = kl(c, r, m), n !== null && (Rr(n, c, m, d), gc(n, c, m)), m;
  }
  function tf(n) {
    if (n = n.current, !n.child)
      return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function ih(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var l = n.retryLane;
      n.retryLane = l !== 0 && l < r ? l : r;
    }
  }
  function Wd(n, r) {
    ih(n, r), (n = n.alternate) && ih(n, r);
  }
  function lh() {
    return null;
  }
  var Gd = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function nf(n) {
    this._internalRoot = n;
  }
  Wi.prototype.render = nf.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null)
      throw Error(N(409));
    Ls(n, r, null, null);
  }, Wi.prototype.unmount = nf.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Al(function() {
        Ls(null, n, null, null);
      }), r[Hi] = null;
    }
  };
  function Wi(n) {
    this._internalRoot = n;
  }
  Wi.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Wu();
      n = { blockedOn: null, target: n, priority: r };
      for (var l = 0; l < jt.length && r !== 0 && r < jt[l].priority; l++)
        ;
      jt.splice(l, 0, n), l === 0 && Zs(n);
    }
  };
  function qd(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function rf(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function uh() {
  }
  function Ey(n, r, l, o, c) {
    if (c) {
      if (typeof o == "function") {
        var d = o;
        o = function() {
          var A = tf(m);
          d.call(A);
        };
      }
      var m = ah(r, o, n, 0, null, !1, !1, "", uh);
      return n._reactRootContainer = m, n[Hi] = m.current, ro(n.nodeType === 8 ? n.parentNode : n), Al(), m;
    }
    for (; c = n.lastChild; )
      n.removeChild(c);
    if (typeof o == "function") {
      var E = o;
      o = function() {
        var A = tf(w);
        E.call(A);
      };
    }
    var w = ef(n, 0, !1, null, null, !1, !1, "", uh);
    return n._reactRootContainer = w, n[Hi] = w.current, ro(n.nodeType === 8 ? n.parentNode : n), Al(function() {
      Ls(r, w, l, o);
    }), w;
  }
  function af(n, r, l, o, c) {
    var d = l._reactRootContainer;
    if (d) {
      var m = d;
      if (typeof c == "function") {
        var E = c;
        c = function() {
          var w = tf(m);
          E.call(w);
        };
      }
      Ls(r, m, n, c);
    } else
      m = Ey(l, r, n, c, o);
    return tf(m);
  }
  Xl = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var l = Xa(r.pendingLanes);
          l !== 0 && (pi(r, l | 1), Tr(r, Tt()), !(dt & 6) && (Ro = Tt() + 500, Kr()));
        }
        break;
      case 13:
        Al(function() {
          var o = Vi(n, 1);
          if (o !== null) {
            var c = Cr();
            Rr(o, n, 1, c);
          }
        }), Wd(n, 1);
    }
  }, Qu = function(n) {
    if (n.tag === 13) {
      var r = Vi(n, 134217728);
      if (r !== null) {
        var l = Cr();
        Rr(r, n, 134217728, l);
      }
      Wd(n, 134217728);
    }
  }, wt = function(n) {
    if (n.tag === 13) {
      var r = zn(n), l = Vi(n, r);
      if (l !== null) {
        var o = Cr();
        Rr(l, n, r, o);
      }
      Wd(n, r);
    }
  }, Wu = function() {
    return kt;
  }, Gu = function(n, r) {
    var l = kt;
    try {
      return kt = n, r();
    } finally {
      kt = l;
    }
  }, xr = function(n, r, l) {
    switch (r) {
      case "input":
        if (bn(n, l), r = l.name, l.type === "radio" && r != null) {
          for (l = n; l.parentNode; )
            l = l.parentNode;
          for (l = l.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < l.length; r++) {
            var o = l[r];
            if (o !== n && o.form === n.form) {
              var c = ke(o);
              if (!c)
                throw Error(N(90));
              Pr(o), bn(o, c);
            }
          }
        }
        break;
      case "textarea":
        sa(n, l);
        break;
      case "select":
        r = l.value, r != null && vr(n, !!l.multiple, r, !1);
    }
  }, ql = xo, ju = Al;
  var Cy = { usingClientEntryPoint: !1, Events: [ss, ao, ke, xa, il, xo] }, _o = { findFiberByHostInstance: Da, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, Ry = { bundleType: _o.bundleType, version: _o.version, rendererPackageName: _o.rendererPackageName, rendererConfig: _o.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ct.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = Ln(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: _o.findFiberByHostInstance || lh, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var lf = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!lf.isDisabled && lf.supportsFiber)
      try {
        ol = lf.inject(Ry), Qr = lf;
      } catch {
      }
  }
  return Ia.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Cy, Ia.createPortal = function(n, r) {
    var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!qd(r))
      throw Error(N(200));
    return rh(n, r, null, l);
  }, Ia.createRoot = function(n, r) {
    if (!qd(n))
      throw Error(N(299));
    var l = !1, o = "", c = Gd;
    return r != null && (r.unstable_strictMode === !0 && (l = !0), r.identifierPrefix !== void 0 && (o = r.identifierPrefix), r.onRecoverableError !== void 0 && (c = r.onRecoverableError)), r = ef(n, 1, !1, null, null, l, !1, o, c), n[Hi] = r.current, ro(n.nodeType === 8 ? n.parentNode : n), new nf(r);
  }, Ia.findDOMNode = function(n) {
    if (n == null)
      return null;
    if (n.nodeType === 1)
      return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(N(188)) : (n = Object.keys(n).join(","), Error(N(268, n)));
    return n = Ln(r), n = n === null ? null : n.stateNode, n;
  }, Ia.flushSync = function(n) {
    return Al(n);
  }, Ia.hydrate = function(n, r, l) {
    if (!rf(r))
      throw Error(N(200));
    return af(null, n, r, !0, l);
  }, Ia.hydrateRoot = function(n, r, l) {
    if (!qd(n))
      throw Error(N(405));
    var o = l != null && l.hydratedSources || null, c = !1, d = "", m = Gd;
    if (l != null && (l.unstable_strictMode === !0 && (c = !0), l.identifierPrefix !== void 0 && (d = l.identifierPrefix), l.onRecoverableError !== void 0 && (m = l.onRecoverableError)), r = ah(r, null, n, 1, l ?? null, c, !1, d, m), n[Hi] = r.current, ro(n), o)
      for (n = 0; n < o.length; n++)
        l = o[n], c = l._getVersion, c = c(l._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [l, c] : r.mutableSourceEagerHydrationData.push(
          l,
          c
        );
    return new Wi(r);
  }, Ia.render = function(n, r, l) {
    if (!rf(r))
      throw Error(N(200));
    return af(null, n, r, !1, l);
  }, Ia.unmountComponentAtNode = function(n) {
    if (!rf(n))
      throw Error(N(40));
    return n._reactRootContainer ? (Al(function() {
      af(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Hi] = null;
      });
    }), !0) : !1;
  }, Ia.unstable_batchedUpdates = xo, Ia.unstable_renderSubtreeIntoContainer = function(n, r, l, o) {
    if (!rf(l))
      throw Error(N(200));
    if (n == null || n._reactInternals === void 0)
      throw Error(N(38));
    return af(n, r, l, !1, o);
  }, Ia.version = "18.2.0-next-9e3b772b8-20220608", Ia;
}
var Qa = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var oR;
function fk() {
  return oR || (oR = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var B = Bm(), W = cR(), N = B.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Nt = !1;
    function Yt(e) {
      Nt = e;
    }
    function Je(e) {
      if (!Nt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        It("warn", e, a);
      }
    }
    function S(e) {
      if (!Nt) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
          a[i - 1] = arguments[i];
        It("error", e, a);
      }
    }
    function It(e, t, a) {
      {
        var i = N.ReactDebugCurrentFrame, u = i.getStackAddendum();
        u !== "" && (t += "%s", a = a.concat([u]));
        var s = a.map(function(f) {
          return String(f);
        });
        s.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, s);
      }
    }
    var he = 0, pe = 1, rt = 2, re = 3, me = 4, ie = 5, Ve = 6, Ct = 7, st = 8, fn = 9, at = 10, Qe = 11, ct = 12, be = 13, it = 14, He = 15, nn = 16, xn = 17, Qt = 18, _t = 19, En = 21, Ue = 22, qe = 23, zt = 24, Rt = 25, ye = !0, Z = !1, we = !1, T = !1, $ = !1, le = !0, $e = !1, Fe = !1, ht = !0, et = !0, ft = !0, tt = /* @__PURE__ */ new Set(), Ut = {}, Vr = {};
    function pr(e, t) {
      Pr(e, t), Pr(e + "Capture", t);
    }
    function Pr(e, t) {
      Ut[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), Ut[e] = t;
      {
        var a = e.toLowerCase();
        Vr[a] = e, e === "onDoubleClick" && (Vr.ondblclick = e);
      }
      for (var i = 0; i < t.length; i++)
        tt.add(t[i]);
    }
    var dn = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", Yn = Object.prototype.hasOwnProperty;
    function An(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Fn(e) {
      try {
        return bn(e), !1;
      } catch {
        return !0;
      }
    }
    function bn(e) {
      return "" + e;
    }
    function Br(e, t) {
      if (Fn(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, An(e)), bn(e);
    }
    function $r(e) {
      if (Fn(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", An(e)), bn(e);
    }
    function In(e, t) {
      if (Fn(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, An(e)), bn(e);
    }
    function vr(e, t) {
      if (Fn(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, An(e)), bn(e);
    }
    function Yr(e) {
      if (Fn(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", An(e)), bn(e);
    }
    function hr(e) {
      if (Fn(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", An(e)), bn(e);
    }
    var sa = 0, er = 1, Ir = 2, pn = 3, wr = 4, ui = 5, ca = 6, J = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", xe = J + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", nt = new RegExp("^[" + J + "][" + xe + "]*$"), Lt = {}, At = {};
    function _n(e) {
      return Yn.call(At, e) ? !0 : Yn.call(Lt, e) ? !1 : nt.test(e) ? (At[e] = !0, !0) : (Lt[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function vn(e, t, a) {
      return t !== null ? t.type === sa : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function mr(e, t, a, i) {
      if (a !== null && a.type === sa)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (i)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var u = e.toLowerCase().slice(0, 5);
          return u !== "data-" && u !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Bt(e, t, a, i) {
      if (t === null || typeof t > "u" || mr(e, t, a, i))
        return !0;
      if (i)
        return !1;
      if (a !== null)
        switch (a.type) {
          case pn:
            return !t;
          case wr:
            return t === !1;
          case ui:
            return isNaN(t);
          case ca:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function xr(e) {
      return Ht.hasOwnProperty(e) ? Ht[e] : null;
    }
    function Ft(e, t, a, i, u, s, f) {
      this.acceptsBooleans = t === Ir || t === pn || t === wr, this.attributeName = i, this.attributeNamespace = u, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = f;
    }
    var Ht = {}, Ga = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    Ga.forEach(function(e) {
      Ht[e] = new Ft(
        e,
        sa,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Ht[t] = new Ft(
        t,
        er,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        Ir,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        Ir,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        pn,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        pn,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        wr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        ca,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        ui,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var xa = /[\-\:]([a-z])/g, il = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(xa, il);
      Ht[t] = new Ft(
        t,
        er,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(xa, il);
      Ht[t] = new Ft(
        t,
        er,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(xa, il);
      Ht[t] = new Ft(
        t,
        er,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        er,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var ql = "xlinkHref";
    Ht[ql] = new Ft(
      "xlinkHref",
      er,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Ht[e] = new Ft(
        e,
        er,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var ju = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, Di = !1;
    function ll(e) {
      !Di && ju.test(e) && (Di = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function fa(e, t, a, i) {
      if (i.mustUseProperty) {
        var u = i.propertyName;
        return e[u];
      } else {
        Br(a, t), i.sanitizeURL && ll("" + a);
        var s = i.attributeName, f = null;
        if (i.type === wr) {
          if (e.hasAttribute(s)) {
            var p = e.getAttribute(s);
            return p === "" ? !0 : Bt(t, a, i, !1) ? p : p === "" + a ? a : p;
          }
        } else if (e.hasAttribute(s)) {
          if (Bt(t, a, i, !1))
            return e.getAttribute(s);
          if (i.type === pn)
            return a;
          f = e.getAttribute(s);
        }
        return Bt(t, a, i, !1) ? f === null ? a : f : f === "" + a ? a : f;
      }
    }
    function oi(e, t, a, i) {
      {
        if (!_n(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var u = e.getAttribute(t);
        return Br(a, t), u === "" + a ? a : u;
      }
    }
    function da(e, t, a, i) {
      var u = xr(t);
      if (!vn(t, u, i)) {
        if (Bt(t, a, u, i) && (a = null), i || u === null) {
          if (_n(t)) {
            var s = t;
            a === null ? e.removeAttribute(s) : (Br(a, t), e.setAttribute(s, "" + a));
          }
          return;
        }
        var f = u.mustUseProperty;
        if (f) {
          var p = u.propertyName;
          if (a === null) {
            var v = u.type;
            e[p] = v === pn ? !1 : "";
          } else
            e[p] = a;
          return;
        }
        var y = u.attributeName, g = u.attributeNamespace;
        if (a === null)
          e.removeAttribute(y);
        else {
          var _ = u.type, x;
          _ === pn || _ === wr && a === !0 ? x = "" : (Br(a, y), x = "" + a, u.sanitizeURL && ll(x.toString())), g ? e.setAttributeNS(g, y, x) : e.setAttribute(y, x);
        }
      }
    }
    var si = Symbol.for("react.element"), br = Symbol.for("react.portal"), pa = Symbol.for("react.fragment"), ci = Symbol.for("react.strict_mode"), R = Symbol.for("react.profiler"), Y = Symbol.for("react.provider"), ee = Symbol.for("react.context"), ce = Symbol.for("react.forward_ref"), Ge = Symbol.for("react.suspense"), mt = Symbol.for("react.suspense_list"), Xe = Symbol.for("react.memo"), De = Symbol.for("react.lazy"), Ln = Symbol.for("react.scope"), Jt = Symbol.for("react.debug_trace_mode"), en = Symbol.for("react.offscreen"), tr = Symbol.for("react.legacy_hidden"), fi = Symbol.for("react.cache"), Vu = Symbol.for("react.tracing_marker"), Tt = Symbol.iterator, Hf = "@@iterator";
    function qa(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Tt && e[Tt] || e[Hf];
      return typeof t == "function" ? t : null;
    }
    var lt = Object.assign, di = 0, ul, Pu, ol, Qr, Qo, _r, Wo;
    function Go() {
    }
    Go.__reactDisabledLog = !0;
    function Xs() {
      {
        if (di === 0) {
          ul = console.log, Pu = console.info, ol = console.warn, Qr = console.error, Qo = console.group, _r = console.groupCollapsed, Wo = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Go,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        di++;
      }
    }
    function Bu() {
      {
        if (di--, di === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: lt({}, e, {
              value: ul
            }),
            info: lt({}, e, {
              value: Pu
            }),
            warn: lt({}, e, {
              value: ol
            }),
            error: lt({}, e, {
              value: Qr
            }),
            group: lt({}, e, {
              value: Qo
            }),
            groupCollapsed: lt({}, e, {
              value: _r
            }),
            groupEnd: lt({}, e, {
              value: Wo
            })
          });
        }
        di < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var sl = N.ReactCurrentDispatcher, Xa;
    function kr(e, t, a) {
      {
        if (Xa === void 0)
          try {
            throw Error();
          } catch (u) {
            var i = u.stack.trim().match(/\n( *(at )?)/);
            Xa = i && i[1] || "";
          }
        return `
` + Xa + e;
      }
    }
    var cl = !1, fl;
    {
      var dl = typeof WeakMap == "function" ? WeakMap : Map;
      fl = new dl();
    }
    function $u(e, t) {
      if (!e || cl)
        return "";
      {
        var a = fl.get(e);
        if (a !== void 0)
          return a;
      }
      var i;
      cl = !0;
      var u = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var s;
      s = sl.current, sl.current = null, Xs();
      try {
        if (t) {
          var f = function() {
            throw Error();
          };
          if (Object.defineProperty(f.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(f, []);
            } catch (U) {
              i = U;
            }
            Reflect.construct(e, [], f);
          } else {
            try {
              f.call();
            } catch (U) {
              i = U;
            }
            e.call(f.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (U) {
            i = U;
          }
          e();
        }
      } catch (U) {
        if (U && i && typeof U.stack == "string") {
          for (var p = U.stack.split(`
`), v = i.stack.split(`
`), y = p.length - 1, g = v.length - 1; y >= 1 && g >= 0 && p[y] !== v[g]; )
            g--;
          for (; y >= 1 && g >= 0; y--, g--)
            if (p[y] !== v[g]) {
              if (y !== 1 || g !== 1)
                do
                  if (y--, g--, g < 0 || p[y] !== v[g]) {
                    var _ = `
` + p[y].replace(" at new ", " at ");
                    return e.displayName && _.includes("<anonymous>") && (_ = _.replace("<anonymous>", e.displayName)), typeof e == "function" && fl.set(e, _), _;
                  }
                while (y >= 1 && g >= 0);
              break;
            }
        }
      } finally {
        cl = !1, sl.current = s, Bu(), Error.prepareStackTrace = u;
      }
      var x = e ? e.displayName || e.name : "", M = x ? kr(x) : "";
      return typeof e == "function" && fl.set(e, M), M;
    }
    function Yu(e, t, a) {
      return $u(e, !0);
    }
    function Oi(e, t, a) {
      return $u(e, !1);
    }
    function jf(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function pi(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return $u(e, jf(e));
      if (typeof e == "string")
        return kr(e);
      switch (e) {
        case Ge:
          return kr("Suspense");
        case mt:
          return kr("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ce:
            return Oi(e.render);
          case Xe:
            return pi(e.type, t, a);
          case De: {
            var i = e, u = i._payload, s = i._init;
            try {
              return pi(s(u), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function kt(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case ie:
          return kr(e.type);
        case nn:
          return kr("Lazy");
        case be:
          return kr("Suspense");
        case _t:
          return kr("SuspenseList");
        case he:
        case rt:
        case He:
          return Oi(e.type);
        case Qe:
          return Oi(e.type.render);
        case pe:
          return Yu(e.type);
        default:
          return "";
      }
    }
    function Iu(e) {
      try {
        var t = "", a = e;
        do
          t += kt(a), a = a.return;
        while (a);
        return t;
      } catch (i) {
        return `
Error generating stack: ` + i.message + `
` + i.stack;
      }
    }
    function Xl(e, t, a) {
      var i = e.displayName;
      if (i)
        return i;
      var u = t.displayName || t.name || "";
      return u !== "" ? a + "(" + u + ")" : a;
    }
    function Qu(e) {
      return e.displayName || "Context";
    }
    function wt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case pa:
          return "Fragment";
        case br:
          return "Portal";
        case R:
          return "Profiler";
        case ci:
          return "StrictMode";
        case Ge:
          return "Suspense";
        case mt:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case ee:
            var t = e;
            return Qu(t) + ".Consumer";
          case Y:
            var a = e;
            return Qu(a._context) + ".Provider";
          case ce:
            return Xl(e, e.render, "ForwardRef");
          case Xe:
            var i = e.displayName || null;
            return i !== null ? i : wt(e.type) || "Memo";
          case De: {
            var u = e, s = u._payload, f = u._init;
            try {
              return wt(f(s));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Wu(e, t, a) {
      var i = t.displayName || t.name || "";
      return e.displayName || (i !== "" ? a + "(" + i + ")" : a);
    }
    function Gu(e) {
      return e.displayName || "Context";
    }
    function Ye(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case zt:
          return "Cache";
        case fn:
          var i = a;
          return Gu(i) + ".Consumer";
        case at:
          var u = a;
          return Gu(u._context) + ".Provider";
        case Qt:
          return "DehydratedFragment";
        case Qe:
          return Wu(a, a.render, "ForwardRef");
        case Ct:
          return "Fragment";
        case ie:
          return a;
        case me:
          return "Portal";
        case re:
          return "Root";
        case Ve:
          return "Text";
        case nn:
          return wt(a);
        case st:
          return a === ci ? "StrictMode" : "Mode";
        case Ue:
          return "Offscreen";
        case ct:
          return "Profiler";
        case En:
          return "Scope";
        case be:
          return "Suspense";
        case _t:
          return "SuspenseList";
        case Rt:
          return "TracingMarker";
        case pe:
        case he:
        case xn:
        case rt:
        case it:
        case He:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var Kl = N.ReactDebugCurrentFrame, hn = null, Wr = !1;
    function Dr() {
      {
        if (hn === null)
          return null;
        var e = hn._debugOwner;
        if (e !== null && typeof e < "u")
          return Ye(e);
      }
      return null;
    }
    function pl() {
      return hn === null ? "" : Iu(hn);
    }
    function Cn() {
      Kl.getCurrentStack = null, hn = null, Wr = !1;
    }
    function jt(e) {
      Kl.getCurrentStack = e === null ? null : pl, hn = e, Wr = !1;
    }
    function Ks() {
      return hn;
    }
    function Gr(e) {
      Wr = e;
    }
    function Qn(e) {
      return "" + e;
    }
    function vi(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return hr(e), e;
        default:
          return "";
      }
    }
    var Zs = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function Li(e, t) {
      Zs[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function vl(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Js(e) {
      return e._valueTracker;
    }
    function ba(e) {
      e._valueTracker = null;
    }
    function hl(e) {
      var t = "";
      return e && (vl(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ml(e) {
      var t = vl(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      hr(e[t]);
      var i = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var u = a.get, s = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return u.call(this);
          },
          set: function(p) {
            hr(p), i = "" + p, s.call(this, p);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var f = {
          getValue: function() {
            return i;
          },
          setValue: function(p) {
            hr(p), i = "" + p;
          },
          stopTracking: function() {
            ba(e), delete e[t];
          }
        };
        return f;
      }
    }
    function _a(e) {
      Js(e) || (e._valueTracker = ml(e));
    }
    function qu(e) {
      if (!e)
        return !1;
      var t = Js(e);
      if (!t)
        return !0;
      var a = t.getValue(), i = hl(e);
      return i !== a ? (t.setValue(i), !0) : !1;
    }
    function yl(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var gl = !1, Zl = !1, Xu = !1, qo = !1;
    function Ka(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function h(e, t) {
      var a = e, i = t.checked, u = lt({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: i ?? a._wrapperState.initialChecked
      });
      return u;
    }
    function C(e, t) {
      Li("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !Zl && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component", t.type), Zl = !0), t.value !== void 0 && t.defaultValue !== void 0 && !gl && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component", t.type), gl = !0);
      var a = e, i = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: vi(t.value != null ? t.value : i),
        controlled: Ka(t)
      };
    }
    function z(e, t) {
      var a = e, i = t.checked;
      i != null && da(a, "checked", i, !1);
    }
    function F(e, t) {
      var a = e;
      {
        var i = Ka(t);
        !a._wrapperState.controlled && i && !qo && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), qo = !0), a._wrapperState.controlled && !i && !Xu && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Xu = !0);
      }
      z(e, t);
      var u = vi(t.value), s = t.type;
      if (u != null)
        s === "number" ? (u === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != u) && (a.value = Qn(u)) : a.value !== Qn(u) && (a.value = Qn(u));
      else if (s === "submit" || s === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Le(a, t.type, u) : t.hasOwnProperty("defaultValue") && Le(a, t.type, vi(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function X(e, t, a) {
      var i = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var u = t.type, s = u === "submit" || u === "reset";
        if (s && (t.value === void 0 || t.value === null))
          return;
        var f = Qn(i._wrapperState.initialValue);
        a || f !== i.value && (i.value = f), i.defaultValue = f;
      }
      var p = i.name;
      p !== "" && (i.name = ""), i.defaultChecked = !i.defaultChecked, i.defaultChecked = !!i._wrapperState.initialChecked, p !== "" && (i.name = p);
    }
    function Ne(e, t) {
      var a = e;
      F(a, t), ae(a, t);
    }
    function ae(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var i = e; i.parentNode; )
          i = i.parentNode;
        Br(a, "name");
        for (var u = i.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), s = 0; s < u.length; s++) {
          var f = u[s];
          if (!(f === e || f.form !== e.form)) {
            var p = wh(f);
            if (!p)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            qu(f), F(f, p);
          }
        }
      }
    }
    function Le(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || yl(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Qn(e._wrapperState.initialValue) : e.defaultValue !== Qn(a) && (e.defaultValue = Qn(a)));
    }
    var ut = !1, xt = !1, qt = !1;
    function $t(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? B.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || xt || (xt = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (qt || (qt = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !ut && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), ut = !0);
    }
    function Xt(e, t) {
      t.value != null && e.setAttribute("value", Qn(vi(t.value)));
    }
    var tn = Array.isArray;
    function vt(e) {
      return tn(e);
    }
    var Mi;
    Mi = !1;
    function Ku() {
      var e = Dr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Xo = ["value", "defaultValue"];
    function Vf(e) {
      {
        Li("select", e);
        for (var t = 0; t < Xo.length; t++) {
          var a = Xo[t];
          if (e[a] != null) {
            var i = vt(e[a]);
            e.multiple && !i ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Ku()) : !e.multiple && i && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Ku());
          }
        }
      }
    }
    function Za(e, t, a, i) {
      var u = e.options;
      if (t) {
        for (var s = a, f = {}, p = 0; p < s.length; p++)
          f["$" + s[p]] = !0;
        for (var v = 0; v < u.length; v++) {
          var y = f.hasOwnProperty("$" + u[v].value);
          u[v].selected !== y && (u[v].selected = y), y && i && (u[v].defaultSelected = !0);
        }
      } else {
        for (var g = Qn(vi(a)), _ = null, x = 0; x < u.length; x++) {
          if (u[x].value === g) {
            u[x].selected = !0, i && (u[x].defaultSelected = !0);
            return;
          }
          _ === null && !u[x].disabled && (_ = u[x]);
        }
        _ !== null && (_.selected = !0);
      }
    }
    function Ko(e, t) {
      return lt({}, t, {
        value: void 0
      });
    }
    function Zo(e, t) {
      var a = e;
      Vf(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Mi && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Mi = !0);
    }
    function Pf(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var i = t.value;
      i != null ? Za(a, !!t.multiple, i, !1) : t.defaultValue != null && Za(a, !!t.multiple, t.defaultValue, !0);
    }
    function $m(e, t) {
      var a = e, i = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var u = t.value;
      u != null ? Za(a, !!t.multiple, u, !1) : i !== !!t.multiple && (t.defaultValue != null ? Za(a, !!t.multiple, t.defaultValue, !0) : Za(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Ym(e, t) {
      var a = e, i = t.value;
      i != null && Za(a, !!t.multiple, i, !1);
    }
    var Bf = !1;
    function $f(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var i = lt({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Qn(a._wrapperState.initialValue)
      });
      return i;
    }
    function Jp(e, t) {
      var a = e;
      Li("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !Bf && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Dr() || "A component"), Bf = !0);
      var i = t.value;
      if (i == null) {
        var u = t.children, s = t.defaultValue;
        if (u != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (s != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (vt(u)) {
              if (u.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              u = u[0];
            }
            s = u;
          }
        }
        s == null && (s = ""), i = s;
      }
      a._wrapperState = {
        initialValue: vi(i)
      };
    }
    function ev(e, t) {
      var a = e, i = vi(t.value), u = vi(t.defaultValue);
      if (i != null) {
        var s = Qn(i);
        s !== a.value && (a.value = s), t.defaultValue == null && a.defaultValue !== s && (a.defaultValue = s);
      }
      u != null && (a.defaultValue = Qn(u));
    }
    function tv(e, t) {
      var a = e, i = a.textContent;
      i === a._wrapperState.initialValue && i !== "" && i !== null && (a.value = i);
    }
    function Yf(e, t) {
      ev(e, t);
    }
    var Ni = "http://www.w3.org/1999/xhtml", Im = "http://www.w3.org/1998/Math/MathML", If = "http://www.w3.org/2000/svg";
    function ec(e) {
      switch (e) {
        case "svg":
          return If;
        case "math":
          return Im;
        default:
          return Ni;
      }
    }
    function Qf(e, t) {
      return e == null || e === Ni ? ec(t) : e === If && t === "foreignObject" ? Ni : e;
    }
    var Qm = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, i, u) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, i, u);
        });
      } : e;
    }, tc, nv = Qm(function(e, t) {
      if (e.namespaceURI === If && !("innerHTML" in e)) {
        tc = tc || document.createElement("div"), tc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = tc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), qr = 1, zi = 3, Mn = 8, Ja = 9, Jl = 11, nc = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === zi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, rv = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, Zu = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function av(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var iv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(Zu).forEach(function(e) {
      iv.forEach(function(t) {
        Zu[av(t, e)] = Zu[e];
      });
    });
    function rc(e, t, a) {
      var i = t == null || typeof t == "boolean" || t === "";
      return i ? "" : !a && typeof t == "number" && t !== 0 && !(Zu.hasOwnProperty(e) && Zu[e]) ? t + "px" : (vr(t, e), ("" + t).trim());
    }
    var Ju = /([A-Z])/g, Wm = /^ms-/;
    function Gm(e) {
      return e.replace(Ju, "-$1").toLowerCase().replace(Wm, "-ms-");
    }
    var lv = function() {
    };
    {
      var uv = /^(?:webkit|moz|o)[A-Z]/, ov = /^-ms-/, Jo = /-(.)/g, eo = /;\s*$/, to = {}, no = {}, sv = !1, Wf = !1, Gf = function(e) {
        return e.replace(Jo, function(t, a) {
          return a.toUpperCase();
        });
      }, qf = function(e) {
        to.hasOwnProperty(e) && to[e] || (to[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          Gf(e.replace(ov, "ms-"))
        ));
      }, cv = function(e) {
        to.hasOwnProperty(e) && to[e] || (to[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, fv = function(e, t) {
        no.hasOwnProperty(t) && no[t] || (no[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(eo, "")));
      }, dv = function(e, t) {
        sv || (sv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, qm = function(e, t) {
        Wf || (Wf = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      lv = function(e, t) {
        e.indexOf("-") > -1 ? qf(e) : uv.test(e) ? cv(e) : eo.test(t) && fv(e, t), typeof t == "number" && (isNaN(t) ? dv(e, t) : isFinite(t) || qm(e, t));
      };
    }
    var Xm = lv;
    function Km(e) {
      {
        var t = "", a = "";
        for (var i in e)
          if (e.hasOwnProperty(i)) {
            var u = e[i];
            if (u != null) {
              var s = i.indexOf("--") === 0;
              t += a + (s ? i : Gm(i)) + ":", t += rc(i, u, s), a = ";";
            }
          }
        return t || null;
      }
    }
    function pv(e, t) {
      var a = e.style;
      for (var i in t)
        if (t.hasOwnProperty(i)) {
          var u = i.indexOf("--") === 0;
          u || Xm(i, t[i]);
          var s = rc(i, t[i], u);
          i === "float" && (i = "cssFloat"), u ? a.setProperty(i, s) : a[i] = s;
        }
    }
    function Zm(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function ka(e) {
      var t = {};
      for (var a in e)
        for (var i = rv[a] || [a], u = 0; u < i.length; u++)
          t[i[u]] = a;
      return t;
    }
    function es(e, t) {
      {
        if (!t)
          return;
        var a = ka(e), i = ka(t), u = {};
        for (var s in a) {
          var f = a[s], p = i[s];
          if (p && f !== p) {
            var v = f + "," + p;
            if (u[v])
              continue;
            u[v] = !0, S("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", Zm(e[f]) ? "Removing" : "Updating", f, p);
          }
        }
      }
    }
    var vv = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, hv = lt({
      menuitem: !0
    }, vv), mv = "__html";
    function ac(e, t) {
      if (t) {
        if (hv[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(mv in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && S("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Ui(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var ic = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, yv = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, ei = {}, Xf = new RegExp("^(aria)-[" + xe + "]*$"), ts = new RegExp("^(aria)[A-Z][" + xe + "]*$");
    function Kf(e, t) {
      {
        if (Yn.call(ei, t) && ei[t])
          return !0;
        if (ts.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), i = yv.hasOwnProperty(a) ? a : null;
          if (i == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), ei[t] = !0, !0;
          if (t !== i)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, i), ei[t] = !0, !0;
        }
        if (Xf.test(t)) {
          var u = t.toLowerCase(), s = yv.hasOwnProperty(u) ? u : null;
          if (s == null)
            return ei[t] = !0, !1;
          if (t !== s)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, s), ei[t] = !0, !0;
        }
      }
      return !0;
    }
    function gv(e, t) {
      {
        var a = [];
        for (var i in t) {
          var u = Kf(e, i);
          u || a.push(i);
        }
        var s = a.map(function(f) {
          return "`" + f + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", s, e);
      }
    }
    function lc(e, t) {
      Ui(e, t) || gv(e, t);
    }
    var eu = !1;
    function Zf(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !eu && (eu = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var Jf = function() {
    };
    {
      var Wn = {}, ed = /^on./, Sv = /^on[^A-Z]/, Ev = new RegExp("^(aria)-[" + xe + "]*$"), Cv = new RegExp("^(aria)[A-Z][" + xe + "]*$");
      Jf = function(e, t, a, i) {
        if (Yn.call(Wn, t) && Wn[t])
          return !0;
        var u = t.toLowerCase();
        if (u === "onfocusin" || u === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), Wn[t] = !0, !0;
        if (i != null) {
          var s = i.registrationNameDependencies, f = i.possibleRegistrationNames;
          if (s.hasOwnProperty(t))
            return !0;
          var p = f.hasOwnProperty(u) ? f[u] : null;
          if (p != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, p), Wn[t] = !0, !0;
          if (ed.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), Wn[t] = !0, !0;
        } else if (ed.test(t))
          return Sv.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), Wn[t] = !0, !0;
        if (Ev.test(t) || Cv.test(t))
          return !0;
        if (u === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), Wn[t] = !0, !0;
        if (u === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), Wn[t] = !0, !0;
        if (u === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), Wn[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), Wn[t] = !0, !0;
        var v = xr(t), y = v !== null && v.type === sa;
        if (ic.hasOwnProperty(u)) {
          var g = ic[u];
          if (g !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, g), Wn[t] = !0, !0;
        } else if (!y && t !== u)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, u), Wn[t] = !0, !0;
        return typeof a == "boolean" && mr(t, a, v, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), Wn[t] = !0, !0) : y ? !0 : mr(t, a, v, !1) ? (Wn[t] = !0, !1) : ((a === "false" || a === "true") && v !== null && v.type === pn && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), Wn[t] = !0), !0);
      };
    }
    var Rv = function(e, t, a) {
      {
        var i = [];
        for (var u in t) {
          var s = Jf(e, u, t[u], a);
          s || i.push(u);
        }
        var f = i.map(function(p) {
          return "`" + p + "`";
        }).join(", ");
        i.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e) : i.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", f, e);
      }
    };
    function Tv(e, t, a) {
      Ui(e, t) || Rv(e, t, a);
    }
    var Ai = 1, ns = 1 << 1, tu = 1 << 2, Jm = Ai | ns | tu, rs = null;
    function as(e) {
      rs !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), rs = e;
    }
    function ey() {
      rs === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), rs = null;
    }
    function wv(e) {
      return e === rs;
    }
    function uc(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === zi ? t.parentNode : t;
    }
    var Kt = null, Sl = null, Fi = null;
    function ro(e) {
      var t = Oo(e);
      if (t) {
        if (typeof Kt != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var i = wh(a);
          Kt(t.stateNode, t.type, i);
        }
      }
    }
    function xv(e) {
      Kt = e;
    }
    function oc(e) {
      Sl ? Fi ? Fi.push(e) : Fi = [e] : Sl = e;
    }
    function is() {
      return Sl !== null || Fi !== null;
    }
    function ls() {
      if (Sl) {
        var e = Sl, t = Fi;
        if (Sl = null, Fi = null, ro(e), t)
          for (var a = 0; a < t.length; a++)
            ro(t[a]);
      }
    }
    var nu = function(e, t) {
      return e(t);
    }, td = function() {
    }, nd = !1;
    function ty() {
      var e = is();
      e && (td(), ls());
    }
    function rd(e, t, a) {
      if (nd)
        return e(t, a);
      nd = !0;
      try {
        return nu(e, t, a);
      } finally {
        nd = !1, ty();
      }
    }
    function sc(e, t, a) {
      nu = e, td = a;
    }
    function cc(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function ad(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && cc(t));
        default:
          return !1;
      }
    }
    function ru(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var i = wh(a);
      if (i === null)
        return null;
      var u = i[t];
      if (ad(t, e.type, i))
        return null;
      if (u && typeof u != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof u + "` type.");
      return u;
    }
    var us = !1;
    if (dn)
      try {
        var au = {};
        Object.defineProperty(au, "passive", {
          get: function() {
            us = !0;
          }
        }), window.addEventListener("test", au, au), window.removeEventListener("test", au, au);
      } catch {
        us = !1;
      }
    function bv(e, t, a, i, u, s, f, p, v) {
      var y = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, y);
      } catch (g) {
        this.onError(g);
      }
    }
    var id = bv;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var ld = document.createElement("react");
      id = function(t, a, i, u, s, f, p, v, y) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var g = document.createEvent("Event"), _ = !1, x = !0, M = window.event, U = Object.getOwnPropertyDescriptor(window, "event");
        function H() {
          ld.removeEventListener(j, Oe, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = M);
        }
        var fe = Array.prototype.slice.call(arguments, 3);
        function Oe() {
          _ = !0, H(), a.apply(i, fe), x = !1;
        }
        var Te, St = !1, pt = !1;
        function D(O) {
          if (Te = O.error, St = !0, Te === null && O.colno === 0 && O.lineno === 0 && (pt = !0), O.defaultPrevented && Te != null && typeof Te == "object")
            try {
              Te._suppressLogging = !0;
            } catch {
            }
        }
        var j = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", D), ld.addEventListener(j, Oe, !1), g.initEvent(j, !1, !1), ld.dispatchEvent(g), U && Object.defineProperty(window, "event", U), _ && x && (St ? pt && (Te = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Te = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Te)), window.removeEventListener("error", D), !_)
          return H(), bv.apply(this, arguments);
      };
    }
    var ny = id, El = !1, ti = null, os = !1, Cl = null, hi = {
      onError: function(e) {
        El = !0, ti = e;
      }
    };
    function iu(e, t, a, i, u, s, f, p, v) {
      El = !1, ti = null, ny.apply(hi, arguments);
    }
    function Hi(e, t, a, i, u, s, f, p, v) {
      if (iu.apply(this, arguments), El) {
        var y = od();
        os || (os = !0, Cl = y);
      }
    }
    function ud() {
      if (os) {
        var e = Cl;
        throw os = !1, Cl = null, e;
      }
    }
    function ry() {
      return El;
    }
    function od() {
      if (El) {
        var e = ti;
        return El = !1, ti = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Da(e) {
      return e._reactInternals;
    }
    function ss(e) {
      return e._reactInternals !== void 0;
    }
    function ao(e, t) {
      e._reactInternals = t;
    }
    var ke = (
      /*                      */
      0
    ), Rl = (
      /*                */
      1
    ), rn = (
      /*                    */
      2
    ), Ke = (
      /*                       */
      4
    ), Mt = (
      /*                */
      16
    ), Vt = (
      /*                 */
      32
    ), mi = (
      /*                     */
      64
    ), Pe = (
      /*                   */
      128
    ), Rn = (
      /*            */
      256
    ), Xr = (
      /*                          */
      512
    ), Oa = (
      /*                     */
      1024
    ), sn = (
      /*                      */
      2048
    ), La = (
      /*                    */
      4096
    ), Tl = (
      /*                   */
      8192
    ), cs = (
      /*             */
      16384
    ), fc = sn | Ke | mi | Xr | Oa | cs, _v = (
      /*               */
      32767
    ), va = (
      /*                   */
      32768
    ), Gn = (
      /*                */
      65536
    ), fs = (
      /* */
      131072
    ), sd = (
      /*                       */
      1048576
    ), cd = (
      /*                    */
      2097152
    ), Kr = (
      /*                 */
      4194304
    ), wl = (
      /*                */
      8388608
    ), Zr = (
      /*               */
      16777216
    ), lu = (
      /*              */
      33554432
    ), io = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Ke | Oa | 0
    ), Jr = rn | Ke | Mt | Vt | Xr | La | Tl, yr = Ke | mi | Xr | Tl, Ma = sn | Mt, nr = Kr | wl | cd, ji = N.ReactCurrentOwner;
    function ha(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var i = t;
        do
          t = i, (t.flags & (rn | La)) !== ke && (a = t.return), i = t.return;
        while (i);
      }
      return t.tag === re ? a : null;
    }
    function fd(e) {
      if (e.tag === be) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function dc(e) {
      return e.tag === re ? e.stateNode.containerInfo : null;
    }
    function dd(e) {
      return ha(e) === e;
    }
    function ma(e) {
      {
        var t = ji.current;
        if (t !== null && t.tag === pe) {
          var a = t, i = a.stateNode;
          i._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Ye(a) || "A component"), i._warnedAboutRefsInRender = !0;
        }
      }
      var u = Da(e);
      return u ? ha(u) === u : !1;
    }
    function ea(e) {
      if (ha(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function an(e) {
      var t = e.alternate;
      if (!t) {
        var a = ha(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var i = e, u = t; ; ) {
        var s = i.return;
        if (s === null)
          break;
        var f = s.alternate;
        if (f === null) {
          var p = s.return;
          if (p !== null) {
            i = u = p;
            continue;
          }
          break;
        }
        if (s.child === f.child) {
          for (var v = s.child; v; ) {
            if (v === i)
              return ea(s), e;
            if (v === u)
              return ea(s), t;
            v = v.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (i.return !== u.return)
          i = s, u = f;
        else {
          for (var y = !1, g = s.child; g; ) {
            if (g === i) {
              y = !0, i = s, u = f;
              break;
            }
            if (g === u) {
              y = !0, u = s, i = f;
              break;
            }
            g = g.sibling;
          }
          if (!y) {
            for (g = f.child; g; ) {
              if (g === i) {
                y = !0, i = f, u = s;
                break;
              }
              if (g === u) {
                y = !0, u = f, i = s;
                break;
              }
              g = g.sibling;
            }
            if (!y)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (i.alternate !== u)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (i.tag !== re)
        throw new Error("Unable to find node on an unmounted component.");
      return i.stateNode.current === i ? e : t;
    }
    function Na(e) {
      var t = an(e);
      return t !== null ? pd(t) : null;
    }
    function pd(e) {
      if (e.tag === ie || e.tag === Ve)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = pd(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function kv(e) {
      var t = an(e);
      return t !== null ? pc(t) : null;
    }
    function pc(e) {
      if (e.tag === ie || e.tag === Ve)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== me) {
          var a = pc(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var vc = W.unstable_scheduleCallback, Dv = W.unstable_cancelCallback, hc = W.unstable_shouldYield, Ov = W.unstable_requestPaint, mn = W.unstable_now, vd = W.unstable_getCurrentPriorityLevel, mc = W.unstable_ImmediatePriority, ya = W.unstable_UserBlockingPriority, yi = W.unstable_NormalPriority, yc = W.unstable_LowPriority, xl = W.unstable_IdlePriority, hd = W.unstable_yieldValue, md = W.unstable_setDisableYieldValue, bl = null, qn = null, te = null, kn = !1, rr = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function yd(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        ht && (e = lt({}, e, {
          getLaneLabelMap: kl,
          injectProfilingHooks: Pi
        })), bl = t.inject(e), qn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Lv(e, t) {
      if (qn && typeof qn.onScheduleFiberRoot == "function")
        try {
          qn.onScheduleFiberRoot(bl, e, t);
        } catch (a) {
          kn || (kn = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function Vi(e, t) {
      if (qn && typeof qn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & Pe) === Pe;
          if (et) {
            var i;
            switch (t) {
              case gr:
                i = mc;
                break;
              case ar:
                i = ya;
                break;
              case $i:
                i = yi;
                break;
              case Es:
                i = xl;
                break;
              default:
                i = yi;
                break;
            }
            qn.onCommitFiberRoot(bl, e, i, a);
          }
        } catch (u) {
          kn || (kn = !0, S("React instrumentation encountered an error: %s", u));
        }
    }
    function _l(e) {
      if (qn && typeof qn.onPostCommitFiberRoot == "function")
        try {
          qn.onPostCommitFiberRoot(bl, e);
        } catch (t) {
          kn || (kn = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function gd(e) {
      if (qn && typeof qn.onCommitFiberUnmount == "function")
        try {
          qn.onCommitFiberUnmount(bl, e);
        } catch (t) {
          kn || (kn = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Hn(e) {
      if (typeof hd == "function" && (md(e), Yt(e)), qn && typeof qn.setStrictMode == "function")
        try {
          qn.setStrictMode(bl, e);
        } catch (t) {
          kn || (kn = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Pi(e) {
      te = e;
    }
    function kl() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < ln; a++) {
          var i = ay(t);
          e.set(t, i), t *= 2;
        }
        return e;
      }
    }
    function gc(e) {
      te !== null && typeof te.markCommitStarted == "function" && te.markCommitStarted(e);
    }
    function Sd() {
      te !== null && typeof te.markCommitStopped == "function" && te.markCommitStopped();
    }
    function Dl(e) {
      te !== null && typeof te.markComponentRenderStarted == "function" && te.markComponentRenderStarted(e);
    }
    function uu() {
      te !== null && typeof te.markComponentRenderStopped == "function" && te.markComponentRenderStopped();
    }
    function Mv(e) {
      te !== null && typeof te.markComponentPassiveEffectMountStarted == "function" && te.markComponentPassiveEffectMountStarted(e);
    }
    function Ed() {
      te !== null && typeof te.markComponentPassiveEffectMountStopped == "function" && te.markComponentPassiveEffectMountStopped();
    }
    function Sc(e) {
      te !== null && typeof te.markComponentPassiveEffectUnmountStarted == "function" && te.markComponentPassiveEffectUnmountStarted(e);
    }
    function Nv() {
      te !== null && typeof te.markComponentPassiveEffectUnmountStopped == "function" && te.markComponentPassiveEffectUnmountStopped();
    }
    function zv(e) {
      te !== null && typeof te.markComponentLayoutEffectMountStarted == "function" && te.markComponentLayoutEffectMountStarted(e);
    }
    function Uv() {
      te !== null && typeof te.markComponentLayoutEffectMountStopped == "function" && te.markComponentLayoutEffectMountStopped();
    }
    function Ec(e) {
      te !== null && typeof te.markComponentLayoutEffectUnmountStarted == "function" && te.markComponentLayoutEffectUnmountStarted(e);
    }
    function lo() {
      te !== null && typeof te.markComponentLayoutEffectUnmountStopped == "function" && te.markComponentLayoutEffectUnmountStopped();
    }
    function Cc(e, t, a) {
      te !== null && typeof te.markComponentErrored == "function" && te.markComponentErrored(e, t, a);
    }
    function Av(e, t, a) {
      te !== null && typeof te.markComponentSuspended == "function" && te.markComponentSuspended(e, t, a);
    }
    function Fv(e) {
      te !== null && typeof te.markLayoutEffectsStarted == "function" && te.markLayoutEffectsStarted(e);
    }
    function uo() {
      te !== null && typeof te.markLayoutEffectsStopped == "function" && te.markLayoutEffectsStopped();
    }
    function Hv(e) {
      te !== null && typeof te.markPassiveEffectsStarted == "function" && te.markPassiveEffectsStarted(e);
    }
    function ds() {
      te !== null && typeof te.markPassiveEffectsStopped == "function" && te.markPassiveEffectsStopped();
    }
    function ni(e) {
      te !== null && typeof te.markRenderStarted == "function" && te.markRenderStarted(e);
    }
    function ps() {
      te !== null && typeof te.markRenderYielded == "function" && te.markRenderYielded();
    }
    function oo() {
      te !== null && typeof te.markRenderStopped == "function" && te.markRenderStopped();
    }
    function ou(e) {
      te !== null && typeof te.markRenderScheduled == "function" && te.markRenderScheduled(e);
    }
    function Cd(e, t) {
      te !== null && typeof te.markForceUpdateScheduled == "function" && te.markForceUpdateScheduled(e, t);
    }
    function Ol(e, t) {
      te !== null && typeof te.markStateUpdateScheduled == "function" && te.markStateUpdateScheduled(e, t);
    }
    var Me = (
      /*                         */
      0
    ), ot = (
      /*                 */
      1
    ), ze = (
      /*                    */
      2
    ), yn = (
      /*               */
      8
    ), za = (
      /*              */
      16
    ), Rc = Math.clz32 ? Math.clz32 : su, Tc = Math.log, Rd = Math.LN2;
    function su(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Tc(t) / Rd | 0) | 0;
    }
    var ln = 31, V = (
      /*                        */
      0
    ), yt = (
      /*                          */
      0
    ), Ae = (
      /*                        */
      1
    ), gi = (
      /*    */
      2
    ), ga = (
      /*             */
      4
    ), cu = (
      /*            */
      8
    ), un = (
      /*                     */
      16
    ), fu = (
      /*                */
      32
    ), Ll = (
      /*                       */
      4194240
    ), du = (
      /*                        */
      64
    ), Ua = (
      /*                        */
      128
    ), ta = (
      /*                        */
      256
    ), pu = (
      /*                        */
      512
    ), vs = (
      /*                        */
      1024
    ), hs = (
      /*                        */
      2048
    ), wc = (
      /*                        */
      4096
    ), xc = (
      /*                        */
      8192
    ), bc = (
      /*                        */
      16384
    ), _c = (
      /*                       */
      32768
    ), kc = (
      /*                       */
      65536
    ), Dc = (
      /*                       */
      131072
    ), Oc = (
      /*                       */
      262144
    ), Lc = (
      /*                       */
      524288
    ), vu = (
      /*                       */
      1048576
    ), Mc = (
      /*                       */
      2097152
    ), hu = (
      /*                            */
      130023424
    ), Bi = (
      /*                             */
      4194304
    ), Nc = (
      /*                             */
      8388608
    ), ms = (
      /*                             */
      16777216
    ), zc = (
      /*                             */
      33554432
    ), Uc = (
      /*                             */
      67108864
    ), Td = Bi, so = (
      /*          */
      134217728
    ), Ac = (
      /*                          */
      268435455
    ), co = (
      /*               */
      268435456
    ), Ml = (
      /*                        */
      536870912
    ), na = (
      /*                   */
      1073741824
    );
    function ay(e) {
      {
        if (e & Ae)
          return "Sync";
        if (e & gi)
          return "InputContinuousHydration";
        if (e & ga)
          return "InputContinuous";
        if (e & cu)
          return "DefaultHydration";
        if (e & un)
          return "Default";
        if (e & fu)
          return "TransitionHydration";
        if (e & Ll)
          return "Transition";
        if (e & hu)
          return "Retry";
        if (e & so)
          return "SelectiveHydration";
        if (e & co)
          return "IdleHydration";
        if (e & Ml)
          return "Idle";
        if (e & na)
          return "Offscreen";
      }
    }
    var Zt = -1, Fc = du, Hc = Bi;
    function fo(e) {
      switch (Nn(e)) {
        case Ae:
          return Ae;
        case gi:
          return gi;
        case ga:
          return ga;
        case cu:
          return cu;
        case un:
          return un;
        case fu:
          return fu;
        case du:
        case Ua:
        case ta:
        case pu:
        case vs:
        case hs:
        case wc:
        case xc:
        case bc:
        case _c:
        case kc:
        case Dc:
        case Oc:
        case Lc:
        case vu:
        case Mc:
          return e & Ll;
        case Bi:
        case Nc:
        case ms:
        case zc:
        case Uc:
          return e & hu;
        case so:
          return so;
        case co:
          return co;
        case Ml:
          return Ml;
        case na:
          return na;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function ys(e, t) {
      var a = e.pendingLanes;
      if (a === V)
        return V;
      var i = V, u = e.suspendedLanes, s = e.pingedLanes, f = a & Ac;
      if (f !== V) {
        var p = f & ~u;
        if (p !== V)
          i = fo(p);
        else {
          var v = f & s;
          v !== V && (i = fo(v));
        }
      } else {
        var y = a & ~u;
        y !== V ? i = fo(y) : s !== V && (i = fo(s));
      }
      if (i === V)
        return V;
      if (t !== V && t !== i && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & u) === V) {
        var g = Nn(i), _ = Nn(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          g >= _ || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          g === un && (_ & Ll) !== V
        )
          return t;
      }
      (i & ga) !== V && (i |= a & un);
      var x = e.entangledLanes;
      if (x !== V)
        for (var M = e.entanglements, U = i & x; U > 0; ) {
          var H = Nl(U), fe = 1 << H;
          i |= M[H], U &= ~fe;
        }
      return i;
    }
    function jv(e, t) {
      for (var a = e.eventTimes, i = Zt; t > 0; ) {
        var u = Nl(t), s = 1 << u, f = a[u];
        f > i && (i = f), t &= ~s;
      }
      return i;
    }
    function jc(e, t) {
      switch (e) {
        case Ae:
        case gi:
        case ga:
          return t + 250;
        case cu:
        case un:
        case fu:
        case du:
        case Ua:
        case ta:
        case pu:
        case vs:
        case hs:
        case wc:
        case xc:
        case bc:
        case _c:
        case kc:
        case Dc:
        case Oc:
        case Lc:
        case vu:
        case Mc:
          return t + 5e3;
        case Bi:
        case Nc:
        case ms:
        case zc:
        case Uc:
          return Zt;
        case so:
        case co:
        case Ml:
        case na:
          return Zt;
        default:
          return S("Should have found matching lanes. This is a bug in React."), Zt;
      }
    }
    function iy(e, t) {
      for (var a = e.pendingLanes, i = e.suspendedLanes, u = e.pingedLanes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Nl(f), v = 1 << p, y = s[p];
        y === Zt ? ((v & i) === V || (v & u) !== V) && (s[p] = jc(v, t)) : y <= t && (e.expiredLanes |= v), f &= ~v;
      }
    }
    function ly(e) {
      return fo(e.pendingLanes);
    }
    function wd(e) {
      var t = e.pendingLanes & ~na;
      return t !== V ? t : t & na ? na : V;
    }
    function po(e) {
      return (e & Ae) !== V;
    }
    function gs(e) {
      return (e & Ac) !== V;
    }
    function Vc(e) {
      return (e & hu) === e;
    }
    function uy(e) {
      var t = Ae | ga | un;
      return (e & t) === V;
    }
    function Vv(e) {
      return (e & Ll) === e;
    }
    function Ss(e, t) {
      var a = gi | ga | cu | un;
      return (t & a) !== V;
    }
    function Pv(e, t) {
      return (t & e.expiredLanes) !== V;
    }
    function xd(e) {
      return (e & Ll) !== V;
    }
    function bd() {
      var e = Fc;
      return Fc <<= 1, (Fc & Ll) === V && (Fc = du), e;
    }
    function oy() {
      var e = Hc;
      return Hc <<= 1, (Hc & hu) === V && (Hc = Bi), e;
    }
    function Nn(e) {
      return e & -e;
    }
    function jn(e) {
      return Nn(e);
    }
    function Nl(e) {
      return 31 - Rc(e);
    }
    function Pc(e) {
      return Nl(e);
    }
    function ra(e, t) {
      return (e & t) !== V;
    }
    function mu(e, t) {
      return (e & t) === t;
    }
    function Ze(e, t) {
      return e | t;
    }
    function vo(e, t) {
      return e & ~t;
    }
    function _d(e, t) {
      return e & t;
    }
    function Bv(e) {
      return e;
    }
    function $v(e, t) {
      return e !== yt && e < t ? e : t;
    }
    function Bc(e) {
      for (var t = [], a = 0; a < ln; a++)
        t.push(e);
      return t;
    }
    function yu(e, t, a) {
      e.pendingLanes |= t, t !== Ml && (e.suspendedLanes = V, e.pingedLanes = V);
      var i = e.eventTimes, u = Pc(t);
      i[u] = a;
    }
    function kd(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, i = t; i > 0; ) {
        var u = Nl(i), s = 1 << u;
        a[u] = Zt, i &= ~s;
      }
    }
    function Dd(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Od(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = V, e.pingedLanes = V, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var i = e.entanglements, u = e.eventTimes, s = e.expirationTimes, f = a; f > 0; ) {
        var p = Nl(f), v = 1 << p;
        i[p] = V, u[p] = Zt, s[p] = Zt, f &= ~v;
      }
    }
    function ho(e, t) {
      for (var a = e.entangledLanes |= t, i = e.entanglements, u = a; u; ) {
        var s = Nl(u), f = 1 << s;
        // Is this one of the newly entangled lanes?
        f & t | // Is this lane transitively entangled with the newly entangled lanes?
        i[s] & t && (i[s] |= t), u &= ~f;
      }
    }
    function sy(e, t) {
      var a = Nn(t), i;
      switch (a) {
        case ga:
          i = gi;
          break;
        case un:
          i = cu;
          break;
        case du:
        case Ua:
        case ta:
        case pu:
        case vs:
        case hs:
        case wc:
        case xc:
        case bc:
        case _c:
        case kc:
        case Dc:
        case Oc:
        case Lc:
        case vu:
        case Mc:
        case Bi:
        case Nc:
        case ms:
        case zc:
        case Uc:
          i = fu;
          break;
        case Ml:
          i = co;
          break;
        default:
          i = yt;
          break;
      }
      return (i & (e.suspendedLanes | t)) !== yt ? yt : i;
    }
    function Ld(e, t, a) {
      if (rr)
        for (var i = e.pendingUpdatersLaneMap; a > 0; ) {
          var u = Pc(a), s = 1 << u, f = i[u];
          f.add(t), a &= ~s;
        }
    }
    function $c(e, t) {
      if (rr)
        for (var a = e.pendingUpdatersLaneMap, i = e.memoizedUpdaters; t > 0; ) {
          var u = Pc(t), s = 1 << u, f = a[u];
          f.size > 0 && (f.forEach(function(p) {
            var v = p.alternate;
            (v === null || !i.has(v)) && i.add(p);
          }), f.clear()), t &= ~s;
        }
    }
    function Md(e, t) {
      return null;
    }
    var gr = Ae, ar = ga, $i = un, Es = Ml, gu = yt;
    function Aa() {
      return gu;
    }
    function Vn(e) {
      gu = e;
    }
    function Cs(e, t) {
      var a = gu;
      try {
        return gu = e, t();
      } finally {
        gu = a;
      }
    }
    function Sr(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function cy(e, t) {
      return e === 0 || e > t ? e : t;
    }
    function Nd(e, t) {
      return e !== 0 && e < t;
    }
    function Rs(e) {
      var t = Nn(e);
      return Nd(gr, t) ? Nd(ar, t) ? gs(t) ? $i : Es : ar : gr;
    }
    function Pn(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Yv;
    function ve(e) {
      Yv = e;
    }
    function mo(e) {
      Yv(e);
    }
    var Ts;
    function Iv(e) {
      Ts = e;
    }
    var Qv;
    function ws(e) {
      Qv = e;
    }
    var xs;
    function zd(e) {
      xs = e;
    }
    var Ud;
    function Wv(e) {
      Ud = e;
    }
    var Yc = !1, yo = [], Si = null, cn = null, Xn = null, Fa = /* @__PURE__ */ new Map(), go = /* @__PURE__ */ new Map(), Yi = [], ri = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function Gv(e) {
      return ri.indexOf(e) > -1;
    }
    function Ei(e, t, a, i, u) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: u,
        targetContainers: [i]
      };
    }
    function qv(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Si = null;
          break;
        case "dragenter":
        case "dragleave":
          cn = null;
          break;
        case "mouseover":
        case "mouseout":
          Xn = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Fa.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var i = t.pointerId;
          go.delete(i);
          break;
        }
      }
    }
    function So(e, t, a, i, u, s) {
      if (e === null || e.nativeEvent !== s) {
        var f = Ei(t, a, i, u, s);
        if (t !== null) {
          var p = Oo(t);
          p !== null && Ts(p);
        }
        return f;
      }
      e.eventSystemFlags |= i;
      var v = e.targetContainers;
      return u !== null && v.indexOf(u) === -1 && v.push(u), e;
    }
    function Xv(e, t, a, i, u) {
      switch (t) {
        case "focusin": {
          var s = u;
          return Si = So(Si, e, t, a, i, s), !0;
        }
        case "dragenter": {
          var f = u;
          return cn = So(cn, e, t, a, i, f), !0;
        }
        case "mouseover": {
          var p = u;
          return Xn = So(Xn, e, t, a, i, p), !0;
        }
        case "pointerover": {
          var v = u, y = v.pointerId;
          return Fa.set(y, So(Fa.get(y) || null, e, t, a, i, v)), !0;
        }
        case "gotpointercapture": {
          var g = u, _ = g.pointerId;
          return go.set(_, So(go.get(_) || null, e, t, a, i, g)), !0;
        }
      }
      return !1;
    }
    function Ad(e) {
      var t = zs(e.target);
      if (t !== null) {
        var a = ha(t);
        if (a !== null) {
          var i = a.tag;
          if (i === be) {
            var u = fd(a);
            if (u !== null) {
              e.blockedOn = u, Ud(e.priority, function() {
                Qv(a);
              });
              return;
            }
          } else if (i === re) {
            var s = a.stateNode;
            if (Pn(s)) {
              e.blockedOn = dc(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function Kv(e) {
      for (var t = xs(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, i = 0; i < Yi.length && Nd(t, Yi[i].priority); i++)
        ;
      Yi.splice(i, 0, a), i === 0 && Ad(a);
    }
    function Ic(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], i = Su(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (i === null) {
          var u = e.nativeEvent, s = new u.constructor(u.type, u);
          as(s), u.target.dispatchEvent(s), ey();
        } else {
          var f = Oo(i);
          return f !== null && Ts(f), e.blockedOn = i, !1;
        }
        t.shift();
      }
      return !0;
    }
    function bs(e, t, a) {
      Ic(e) && a.delete(t);
    }
    function Fd() {
      Yc = !1, Si !== null && Ic(Si) && (Si = null), cn !== null && Ic(cn) && (cn = null), Xn !== null && Ic(Xn) && (Xn = null), Fa.forEach(bs), go.forEach(bs);
    }
    function Er(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Yc || (Yc = !0, W.unstable_scheduleCallback(W.unstable_NormalPriority, Fd)));
    }
    function dt(e) {
      if (yo.length > 0) {
        Er(yo[0], e);
        for (var t = 1; t < yo.length; t++) {
          var a = yo[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      Si !== null && Er(Si, e), cn !== null && Er(cn, e), Xn !== null && Er(Xn, e);
      var i = function(p) {
        return Er(p, e);
      };
      Fa.forEach(i), go.forEach(i);
      for (var u = 0; u < Yi.length; u++) {
        var s = Yi[u];
        s.blockedOn === e && (s.blockedOn = null);
      }
      for (; Yi.length > 0; ) {
        var f = Yi[0];
        if (f.blockedOn !== null)
          break;
        Ad(f), f.blockedOn === null && Yi.shift();
      }
    }
    var gn = N.ReactCurrentBatchConfig, Tn = !0;
    function Kn(e) {
      Tn = !!e;
    }
    function Sa() {
      return Tn;
    }
    function Eo(e, t, a) {
      var i = Or(t), u;
      switch (i) {
        case gr:
          u = Bn;
          break;
        case ar:
          u = _s;
          break;
        case $i:
        default:
          u = Ii;
          break;
      }
      return u.bind(null, t, a, e);
    }
    function Bn(e, t, a, i) {
      var u = Aa(), s = gn.transition;
      gn.transition = null;
      try {
        Vn(gr), Ii(e, t, a, i);
      } finally {
        Vn(u), gn.transition = s;
      }
    }
    function _s(e, t, a, i) {
      var u = Aa(), s = gn.transition;
      gn.transition = null;
      try {
        Vn(ar), Ii(e, t, a, i);
      } finally {
        Vn(u), gn.transition = s;
      }
    }
    function Ii(e, t, a, i) {
      Tn && Qc(e, t, a, i);
    }
    function Qc(e, t, a, i) {
      var u = Su(e, t, a, i);
      if (u === null) {
        Oy(e, t, i, Co, a), qv(e, i);
        return;
      }
      if (Xv(u, e, t, a, i)) {
        i.stopPropagation();
        return;
      }
      if (qv(e, i), t & tu && Gv(e)) {
        for (; u !== null; ) {
          var s = Oo(u);
          s !== null && mo(s);
          var f = Su(e, t, a, i);
          if (f === null && Oy(e, t, i, Co, a), f === u)
            break;
          u = f;
        }
        u !== null && i.stopPropagation();
        return;
      }
      Oy(e, t, i, null, a);
    }
    var Co = null;
    function Su(e, t, a, i) {
      Co = null;
      var u = uc(i), s = zs(u);
      if (s !== null) {
        var f = ha(s);
        if (f === null)
          s = null;
        else {
          var p = f.tag;
          if (p === be) {
            var v = fd(f);
            if (v !== null)
              return v;
            s = null;
          } else if (p === re) {
            var y = f.stateNode;
            if (Pn(y))
              return dc(f);
            s = null;
          } else
            f !== s && (s = null);
        }
      }
      return Co = s, null;
    }
    function Or(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return gr;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return ar;
        case "message": {
          var t = vd();
          switch (t) {
            case mc:
              return gr;
            case ya:
              return ar;
            case yi:
            case yc:
              return $i;
            case xl:
              return Es;
            default:
              return $i;
          }
        }
        default:
          return $i;
      }
    }
    function Hd(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function Ro(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Qi(e, t, a, i) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: i
      }), a;
    }
    function Wc(e, t, a, i) {
      return e.addEventListener(t, a, {
        passive: i
      }), a;
    }
    var Eu = null, Ci = null, zl = null;
    function Ul(e) {
      return Eu = e, Ci = qc(), !0;
    }
    function Gc() {
      Eu = null, Ci = null, zl = null;
    }
    function To() {
      if (zl)
        return zl;
      var e, t = Ci, a = t.length, i, u = qc(), s = u.length;
      for (e = 0; e < a && t[e] === u[e]; e++)
        ;
      var f = a - e;
      for (i = 1; i <= f && t[a - i] === u[s - i]; i++)
        ;
      var p = i > 1 ? 1 - i : void 0;
      return zl = u.slice(e, p), zl;
    }
    function qc() {
      return "value" in Eu ? Eu.value : Eu.textContent;
    }
    function Cu(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function Ru() {
      return !0;
    }
    function Cr() {
      return !1;
    }
    function zn(e) {
      function t(a, i, u, s, f) {
        this._reactName = a, this._targetInst = u, this.type = i, this.nativeEvent = s, this.target = f, this.currentTarget = null;
        for (var p in e)
          if (e.hasOwnProperty(p)) {
            var v = e[p];
            v ? this[p] = v(s) : this[p] = s[p];
          }
        var y = s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1;
        return y ? this.isDefaultPrevented = Ru : this.isDefaultPrevented = Cr, this.isPropagationStopped = Cr, this;
      }
      return lt(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Ru);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Ru);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: Ru
      }), t;
    }
    var Rr = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Tr = zn(Rr), wo = lt({}, Rr, {
      view: 0,
      detail: 0
    }), jd = zn(wo), ks, Vd, Ha;
    function Zv(e) {
      e !== Ha && (Ha && e.type === "mousemove" ? (ks = e.screenX - Ha.screenX, Vd = e.screenY - Ha.screenY) : (ks = 0, Vd = 0), Ha = e);
    }
    var xo = lt({}, wo, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Zc,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : (Zv(e), ks);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : Vd;
      }
    }), Al = zn(xo), Pd = lt({}, xo, {
      dataTransfer: 0
    }), Tu = zn(Pd), Jv = lt({}, wo, {
      relatedTarget: 0
    }), Xc = zn(Jv), Bd = lt({}, Rr, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Kc = zn(Bd), fy = lt({}, Rr, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), dy = zn(fy), eh = lt({}, Rr, {
      data: 0
    }), $d = zn(eh), wu = $d, py = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, bo = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function th(e) {
      if (e.key) {
        var t = py[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = Cu(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? bo[e.keyCode] || "Unidentified" : "";
    }
    var wn = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function vy(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var i = wn[e];
      return i ? !!a[i] : !1;
    }
    function Zc(e) {
      return vy;
    }
    var hy = lt({}, wo, {
      key: th,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Zc,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? Cu(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? Cu(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), my = zn(hy), nh = lt({}, xo, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), Yd = zn(nh), yy = lt({}, wo, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Zc
    }), ja = zn(yy), Id = lt({}, Rr, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), gy = zn(Id), Fl = lt({}, xo, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Jc = zn(Fl), xu = [9, 13, 27, 32], Ds = 229, Os = dn && "CompositionEvent" in window, bu = null;
    dn && "documentMode" in document && (bu = document.documentMode);
    var Sy = dn && "TextEvent" in window && !bu, ef = dn && (!Os || bu && bu > 8 && bu <= 11), rh = 32, Qd = String.fromCharCode(rh);
    function ah() {
      pr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), pr("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), pr("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), pr("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var Ls = !1;
    function tf(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function ih(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function Wd(e, t) {
      return e === "keydown" && t.keyCode === Ds;
    }
    function lh(e, t) {
      switch (e) {
        case "keyup":
          return xu.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Ds;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Gd(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function nf(e) {
      return e.locale === "ko";
    }
    var Wi = !1;
    function qd(e, t, a, i, u) {
      var s, f;
      if (Os ? s = ih(t) : Wi ? lh(t, i) && (s = "onCompositionEnd") : Wd(t, i) && (s = "onCompositionStart"), !s)
        return null;
      ef && !nf(i) && (!Wi && s === "onCompositionStart" ? Wi = Ul(u) : s === "onCompositionEnd" && Wi && (f = To()));
      var p = fh(a, s);
      if (p.length > 0) {
        var v = new $d(s, t, null, i, u);
        if (e.push({
          event: v,
          listeners: p
        }), f)
          v.data = f;
        else {
          var y = Gd(i);
          y !== null && (v.data = y);
        }
      }
    }
    function rf(e, t) {
      switch (e) {
        case "compositionend":
          return Gd(t);
        case "keypress":
          var a = t.which;
          return a !== rh ? null : (Ls = !0, Qd);
        case "textInput":
          var i = t.data;
          return i === Qd && Ls ? null : i;
        default:
          return null;
      }
    }
    function uh(e, t) {
      if (Wi) {
        if (e === "compositionend" || !Os && lh(e, t)) {
          var a = To();
          return Gc(), Wi = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!tf(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return ef && !nf(t) ? null : t.data;
        default:
          return null;
      }
    }
    function Ey(e, t, a, i, u) {
      var s;
      if (Sy ? s = rf(t, i) : s = uh(t, i), !s)
        return null;
      var f = fh(a, "onBeforeInput");
      if (f.length > 0) {
        var p = new wu("onBeforeInput", "beforeinput", null, i, u);
        e.push({
          event: p,
          listeners: f
        }), p.data = s;
      }
    }
    function af(e, t, a, i, u, s, f) {
      qd(e, t, a, i, u), Ey(e, t, a, i, u);
    }
    var Cy = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function _o(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!Cy[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Ry(e) {
      if (!dn)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var i = document.createElement("div");
        i.setAttribute(t, "return;"), a = typeof i[t] == "function";
      }
      return a;
    }
    function lf() {
      pr("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function n(e, t, a, i) {
      oc(i);
      var u = fh(t, "onChange");
      if (u.length > 0) {
        var s = new Tr("onChange", "change", null, a, i);
        e.push({
          event: s,
          listeners: u
        });
      }
    }
    var r = null, l = null;
    function o(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function c(e) {
      var t = [];
      n(t, l, e, uc(e)), rd(d, t);
    }
    function d(e) {
      O0(e, 0);
    }
    function m(e) {
      var t = df(e);
      if (qu(t))
        return e;
    }
    function E(e, t) {
      if (e === "change")
        return t;
    }
    var w = !1;
    dn && (w = Ry("input") && (!document.documentMode || document.documentMode > 9));
    function A(e, t) {
      r = e, l = t, r.attachEvent("onpropertychange", G);
    }
    function Q() {
      r && (r.detachEvent("onpropertychange", G), r = null, l = null);
    }
    function G(e) {
      e.propertyName === "value" && m(l) && c(e);
    }
    function I(e, t, a) {
      e === "focusin" ? (Q(), A(t, a)) : e === "focusout" && Q();
    }
    function oe(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return m(l);
    }
    function ge(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Ce(e, t) {
      if (e === "click")
        return m(t);
    }
    function Dn(e, t) {
      if (e === "input" || e === "change")
        return m(t);
    }
    function k(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Le(e, "number", e.value);
    }
    function b(e, t, a, i, u, s, f) {
      var p = a ? df(a) : window, v, y;
      if (o(p) ? v = E : _o(p) ? w ? v = Dn : (v = oe, y = I) : ge(p) && (v = Ce), v) {
        var g = v(t, a);
        if (g) {
          n(e, g, i, u);
          return;
        }
      }
      y && y(t, p, a), t === "focusout" && k(p);
    }
    function L() {
      Pr("onMouseEnter", ["mouseout", "mouseover"]), Pr("onMouseLeave", ["mouseout", "mouseover"]), Pr("onPointerEnter", ["pointerout", "pointerover"]), Pr("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function K(e, t, a, i, u, s, f) {
      var p = t === "mouseover" || t === "pointerover", v = t === "mouseout" || t === "pointerout";
      if (p && !wv(i)) {
        var y = i.relatedTarget || i.fromElement;
        if (y && (zs(y) || sp(y)))
          return;
      }
      if (!(!v && !p)) {
        var g;
        if (u.window === u)
          g = u;
        else {
          var _ = u.ownerDocument;
          _ ? g = _.defaultView || _.parentWindow : g = window;
        }
        var x, M;
        if (v) {
          var U = i.relatedTarget || i.toElement;
          if (x = a, M = U ? zs(U) : null, M !== null) {
            var H = ha(M);
            (M !== H || M.tag !== ie && M.tag !== Ve) && (M = null);
          }
        } else
          x = null, M = a;
        if (x !== M) {
          var fe = Al, Oe = "onMouseLeave", Te = "onMouseEnter", St = "mouse";
          (t === "pointerout" || t === "pointerover") && (fe = Yd, Oe = "onPointerLeave", Te = "onPointerEnter", St = "pointer");
          var pt = x == null ? g : df(x), D = M == null ? g : df(M), j = new fe(Oe, St + "leave", x, i, u);
          j.target = pt, j.relatedTarget = D;
          var O = null, q = zs(u);
          if (q === a) {
            var de = new fe(Te, St + "enter", M, i, u);
            de.target = D, de.relatedTarget = pt, O = de;
          }
          OR(e, j, O, x, M);
        }
      }
    }
    function Re(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Se = typeof Object.is == "function" ? Object.is : Re;
    function _e(e, t) {
      if (Se(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), i = Object.keys(t);
      if (a.length !== i.length)
        return !1;
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        if (!Yn.call(t, s) || !Se(e[s], t[s]))
          return !1;
      }
      return !0;
    }
    function Be(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Zn(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function bt(e, t) {
      for (var a = Be(e), i = 0, u = 0; a; ) {
        if (a.nodeType === zi) {
          if (u = i + a.textContent.length, i <= t && u >= t)
            return {
              node: a,
              offset: t - i
            };
          i = u;
        }
        a = Be(Zn(a));
      }
    }
    function Hl(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, i = a.getSelection && a.getSelection();
      if (!i || i.rangeCount === 0)
        return null;
      var u = i.anchorNode, s = i.anchorOffset, f = i.focusNode, p = i.focusOffset;
      try {
        u.nodeType, f.nodeType;
      } catch {
        return null;
      }
      return Ty(e, u, s, f, p);
    }
    function Ty(e, t, a, i, u) {
      var s = 0, f = -1, p = -1, v = 0, y = 0, g = e, _ = null;
      e:
        for (; ; ) {
          for (var x = null; g === t && (a === 0 || g.nodeType === zi) && (f = s + a), g === i && (u === 0 || g.nodeType === zi) && (p = s + u), g.nodeType === zi && (s += g.nodeValue.length), (x = g.firstChild) !== null; )
            _ = g, g = x;
          for (; ; ) {
            if (g === e)
              break e;
            if (_ === t && ++v === a && (f = s), _ === i && ++y === u && (p = s), (x = g.nextSibling) !== null)
              break;
            g = _, _ = g.parentNode;
          }
          g = x;
        }
      return f === -1 || p === -1 ? null : {
        start: f,
        end: p
      };
    }
    function fR(e, t) {
      var a = e.ownerDocument || document, i = a && a.defaultView || window;
      if (i.getSelection) {
        var u = i.getSelection(), s = e.textContent.length, f = Math.min(t.start, s), p = t.end === void 0 ? f : Math.min(t.end, s);
        if (!u.extend && f > p) {
          var v = p;
          p = f, f = v;
        }
        var y = bt(e, f), g = bt(e, p);
        if (y && g) {
          if (u.rangeCount === 1 && u.anchorNode === y.node && u.anchorOffset === y.offset && u.focusNode === g.node && u.focusOffset === g.offset)
            return;
          var _ = a.createRange();
          _.setStart(y.node, y.offset), u.removeAllRanges(), f > p ? (u.addRange(_), u.extend(g.node, g.offset)) : (_.setEnd(g.node, g.offset), u.addRange(_));
        }
      }
    }
    function g0(e) {
      return e && e.nodeType === zi;
    }
    function S0(e, t) {
      return !e || !t ? !1 : e === t ? !0 : g0(e) ? !1 : g0(t) ? S0(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function dR(e) {
      return e && e.ownerDocument && S0(e.ownerDocument.documentElement, e);
    }
    function pR(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function E0() {
      for (var e = window, t = yl(); t instanceof e.HTMLIFrameElement; ) {
        if (pR(t))
          e = t.contentWindow;
        else
          return t;
        t = yl(e.document);
      }
      return t;
    }
    function wy(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function vR() {
      var e = E0();
      return {
        focusedElem: e,
        selectionRange: wy(e) ? mR(e) : null
      };
    }
    function hR(e) {
      var t = E0(), a = e.focusedElem, i = e.selectionRange;
      if (t !== a && dR(a)) {
        i !== null && wy(a) && yR(a, i);
        for (var u = [], s = a; s = s.parentNode; )
          s.nodeType === qr && u.push({
            element: s,
            left: s.scrollLeft,
            top: s.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var f = 0; f < u.length; f++) {
          var p = u[f];
          p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
        }
      }
    }
    function mR(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = Hl(e), t || {
        start: 0,
        end: 0
      };
    }
    function yR(e, t) {
      var a = t.start, i = t.end;
      i === void 0 && (i = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(i, e.value.length)) : fR(e, t);
    }
    var gR = dn && "documentMode" in document && document.documentMode <= 11;
    function SR() {
      pr("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var uf = null, xy = null, Xd = null, by = !1;
    function ER(e) {
      if ("selectionStart" in e && wy(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function CR(e) {
      return e.window === e ? e.document : e.nodeType === Ja ? e : e.ownerDocument;
    }
    function C0(e, t, a) {
      var i = CR(a);
      if (!(by || uf == null || uf !== yl(i))) {
        var u = ER(uf);
        if (!Xd || !_e(Xd, u)) {
          Xd = u;
          var s = fh(xy, "onSelect");
          if (s.length > 0) {
            var f = new Tr("onSelect", "select", null, t, a);
            e.push({
              event: f,
              listeners: s
            }), f.target = uf;
          }
        }
      }
    }
    function RR(e, t, a, i, u, s, f) {
      var p = a ? df(a) : window;
      switch (t) {
        case "focusin":
          (_o(p) || p.contentEditable === "true") && (uf = p, xy = a, Xd = null);
          break;
        case "focusout":
          uf = null, xy = null, Xd = null;
          break;
        case "mousedown":
          by = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          by = !1, C0(e, i, u);
          break;
        case "selectionchange":
          if (gR)
            break;
        case "keydown":
        case "keyup":
          C0(e, i, u);
      }
    }
    function oh(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var of = {
      animationend: oh("Animation", "AnimationEnd"),
      animationiteration: oh("Animation", "AnimationIteration"),
      animationstart: oh("Animation", "AnimationStart"),
      transitionend: oh("Transition", "TransitionEnd")
    }, _y = {}, R0 = {};
    dn && (R0 = document.createElement("div").style, "AnimationEvent" in window || (delete of.animationend.animation, delete of.animationiteration.animation, delete of.animationstart.animation), "TransitionEvent" in window || delete of.transitionend.transition);
    function sh(e) {
      if (_y[e])
        return _y[e];
      if (!of[e])
        return e;
      var t = of[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in R0)
          return _y[e] = t[a];
      return e;
    }
    var T0 = sh("animationend"), w0 = sh("animationiteration"), x0 = sh("animationstart"), b0 = sh("transitionend"), _0 = /* @__PURE__ */ new Map(), k0 = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function ko(e, t) {
      _0.set(e, t), pr(t, [e]);
    }
    function TR() {
      for (var e = 0; e < k0.length; e++) {
        var t = k0[e], a = t.toLowerCase(), i = t[0].toUpperCase() + t.slice(1);
        ko(a, "on" + i);
      }
      ko(T0, "onAnimationEnd"), ko(w0, "onAnimationIteration"), ko(x0, "onAnimationStart"), ko("dblclick", "onDoubleClick"), ko("focusin", "onFocus"), ko("focusout", "onBlur"), ko(b0, "onTransitionEnd");
    }
    function wR(e, t, a, i, u, s, f) {
      var p = _0.get(t);
      if (p !== void 0) {
        var v = Tr, y = t;
        switch (t) {
          case "keypress":
            if (Cu(i) === 0)
              return;
          case "keydown":
          case "keyup":
            v = my;
            break;
          case "focusin":
            y = "focus", v = Xc;
            break;
          case "focusout":
            y = "blur", v = Xc;
            break;
          case "beforeblur":
          case "afterblur":
            v = Xc;
            break;
          case "click":
            if (i.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            v = Al;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            v = Tu;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            v = ja;
            break;
          case T0:
          case w0:
          case x0:
            v = Kc;
            break;
          case b0:
            v = gy;
            break;
          case "scroll":
            v = jd;
            break;
          case "wheel":
            v = Jc;
            break;
          case "copy":
          case "cut":
          case "paste":
            v = dy;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            v = Yd;
            break;
        }
        var g = (s & tu) !== 0;
        {
          var _ = !g && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", x = kR(a, p, i.type, g, _);
          if (x.length > 0) {
            var M = new v(p, y, null, i, u);
            e.push({
              event: M,
              listeners: x
            });
          }
        }
      }
    }
    TR(), L(), lf(), SR(), ah();
    function xR(e, t, a, i, u, s, f) {
      wR(e, t, a, i, u, s);
      var p = (s & Jm) === 0;
      p && (K(e, t, a, i, u), b(e, t, a, i, u), RR(e, t, a, i, u), af(e, t, a, i, u));
    }
    var Kd = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], ky = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(Kd));
    function D0(e, t, a) {
      var i = e.type || "unknown-event";
      e.currentTarget = a, Hi(i, t, void 0, e), e.currentTarget = null;
    }
    function bR(e, t, a) {
      var i;
      if (a)
        for (var u = t.length - 1; u >= 0; u--) {
          var s = t[u], f = s.instance, p = s.currentTarget, v = s.listener;
          if (f !== i && e.isPropagationStopped())
            return;
          D0(e, v, p), i = f;
        }
      else
        for (var y = 0; y < t.length; y++) {
          var g = t[y], _ = g.instance, x = g.currentTarget, M = g.listener;
          if (_ !== i && e.isPropagationStopped())
            return;
          D0(e, M, x), i = _;
        }
    }
    function O0(e, t) {
      for (var a = (t & tu) !== 0, i = 0; i < e.length; i++) {
        var u = e[i], s = u.event, f = u.listeners;
        bR(s, f, a);
      }
      ud();
    }
    function _R(e, t, a, i, u) {
      var s = uc(a), f = [];
      xR(f, e, i, a, s, t), O0(f, t);
    }
    function Sn(e, t) {
      ky.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, i = rw(t), u = LR(e, a);
      i.has(u) || (L0(t, e, ns, a), i.add(u));
    }
    function Dy(e, t, a) {
      ky.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var i = 0;
      t && (i |= tu), L0(a, e, i, t);
    }
    var ch = "_reactListening" + Math.random().toString(36).slice(2);
    function Zd(e) {
      if (!e[ch]) {
        e[ch] = !0, tt.forEach(function(a) {
          a !== "selectionchange" && (ky.has(a) || Dy(a, !1, e), Dy(a, !0, e));
        });
        var t = e.nodeType === Ja ? e : e.ownerDocument;
        t !== null && (t[ch] || (t[ch] = !0, Dy("selectionchange", !1, t)));
      }
    }
    function L0(e, t, a, i, u) {
      var s = Eo(e, t, a), f = void 0;
      us && (t === "touchstart" || t === "touchmove" || t === "wheel") && (f = !0), e = e, i ? f !== void 0 ? Qi(e, t, s, f) : Ro(e, t, s) : f !== void 0 ? Wc(e, t, s, f) : Hd(e, t, s);
    }
    function M0(e, t) {
      return e === t || e.nodeType === Mn && e.parentNode === t;
    }
    function Oy(e, t, a, i, u) {
      var s = i;
      if (!(t & Ai) && !(t & ns)) {
        var f = u;
        if (i !== null) {
          var p = i;
          e:
            for (; ; ) {
              if (p === null)
                return;
              var v = p.tag;
              if (v === re || v === me) {
                var y = p.stateNode.containerInfo;
                if (M0(y, f))
                  break;
                if (v === me)
                  for (var g = p.return; g !== null; ) {
                    var _ = g.tag;
                    if (_ === re || _ === me) {
                      var x = g.stateNode.containerInfo;
                      if (M0(x, f))
                        return;
                    }
                    g = g.return;
                  }
                for (; y !== null; ) {
                  var M = zs(y);
                  if (M === null)
                    return;
                  var U = M.tag;
                  if (U === ie || U === Ve) {
                    p = s = M;
                    continue e;
                  }
                  y = y.parentNode;
                }
              }
              p = p.return;
            }
        }
      }
      rd(function() {
        return _R(e, t, a, s);
      });
    }
    function Jd(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function kR(e, t, a, i, u, s) {
      for (var f = t !== null ? t + "Capture" : null, p = i ? f : t, v = [], y = e, g = null; y !== null; ) {
        var _ = y, x = _.stateNode, M = _.tag;
        if (M === ie && x !== null && (g = x, p !== null)) {
          var U = ru(y, p);
          U != null && v.push(Jd(y, U, g));
        }
        if (u)
          break;
        y = y.return;
      }
      return v;
    }
    function fh(e, t) {
      for (var a = t + "Capture", i = [], u = e; u !== null; ) {
        var s = u, f = s.stateNode, p = s.tag;
        if (p === ie && f !== null) {
          var v = f, y = ru(u, a);
          y != null && i.unshift(Jd(u, y, v));
          var g = ru(u, t);
          g != null && i.push(Jd(u, g, v));
        }
        u = u.return;
      }
      return i;
    }
    function sf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== ie);
      return e || null;
    }
    function DR(e, t) {
      for (var a = e, i = t, u = 0, s = a; s; s = sf(s))
        u++;
      for (var f = 0, p = i; p; p = sf(p))
        f++;
      for (; u - f > 0; )
        a = sf(a), u--;
      for (; f - u > 0; )
        i = sf(i), f--;
      for (var v = u; v--; ) {
        if (a === i || i !== null && a === i.alternate)
          return a;
        a = sf(a), i = sf(i);
      }
      return null;
    }
    function N0(e, t, a, i, u) {
      for (var s = t._reactName, f = [], p = a; p !== null && p !== i; ) {
        var v = p, y = v.alternate, g = v.stateNode, _ = v.tag;
        if (y !== null && y === i)
          break;
        if (_ === ie && g !== null) {
          var x = g;
          if (u) {
            var M = ru(p, s);
            M != null && f.unshift(Jd(p, M, x));
          } else if (!u) {
            var U = ru(p, s);
            U != null && f.push(Jd(p, U, x));
          }
        }
        p = p.return;
      }
      f.length !== 0 && e.push({
        event: t,
        listeners: f
      });
    }
    function OR(e, t, a, i, u) {
      var s = i && u ? DR(i, u) : null;
      i !== null && N0(e, t, i, s, !1), u !== null && a !== null && N0(e, a, u, s, !0);
    }
    function LR(e, t) {
      return e + "__" + (t ? "capture" : "bubble");
    }
    var Va = !1, ep = "dangerouslySetInnerHTML", dh = "suppressContentEditableWarning", Do = "suppressHydrationWarning", z0 = "autoFocus", Ms = "children", Ns = "style", ph = "__html", Ly, vh, tp, U0, hh, A0, F0;
    Ly = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, vh = function(e, t) {
      lc(e, t), Zf(e, t), Tv(e, t, {
        registrationNameDependencies: Ut,
        possibleRegistrationNames: Vr
      });
    }, A0 = dn && !document.documentMode, tp = function(e, t, a) {
      if (!Va) {
        var i = mh(a), u = mh(t);
        u !== i && (Va = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(u), JSON.stringify(i)));
      }
    }, U0 = function(e) {
      if (!Va) {
        Va = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, hh = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, F0 = function(e, t) {
      var a = e.namespaceURI === Ni ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var MR = /\r\n?/g, NR = /\u0000|\uFFFD/g;
    function mh(e) {
      Yr(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(MR, `
`).replace(NR, "");
    }
    function yh(e, t, a, i) {
      var u = mh(t), s = mh(e);
      if (s !== u && (i && (Va || (Va = !0, S('Text content did not match. Server: "%s" Client: "%s"', s, u))), a && ye))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function H0(e) {
      return e.nodeType === Ja ? e : e.ownerDocument;
    }
    function zR() {
    }
    function gh(e) {
      e.onclick = zR;
    }
    function UR(e, t, a, i, u) {
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          var f = i[s];
          if (s === Ns)
            f && Object.freeze(f), pv(t, f);
          else if (s === ep) {
            var p = f ? f[ph] : void 0;
            p != null && nv(t, p);
          } else if (s === Ms)
            if (typeof f == "string") {
              var v = e !== "textarea" || f !== "";
              v && nc(t, f);
            } else
              typeof f == "number" && nc(t, "" + f);
          else
            s === dh || s === Do || s === z0 || (Ut.hasOwnProperty(s) ? f != null && (typeof f != "function" && hh(s, f), s === "onScroll" && Sn("scroll", t)) : f != null && da(t, s, f, u));
        }
    }
    function AR(e, t, a, i) {
      for (var u = 0; u < t.length; u += 2) {
        var s = t[u], f = t[u + 1];
        s === Ns ? pv(e, f) : s === ep ? nv(e, f) : s === Ms ? nc(e, f) : da(e, s, f, i);
      }
    }
    function FR(e, t, a, i) {
      var u, s = H0(a), f, p = i;
      if (p === Ni && (p = ec(e)), p === Ni) {
        if (u = Ui(e, t), !u && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var v = s.createElement("div");
          v.innerHTML = "<script><\/script>";
          var y = v.firstChild;
          f = v.removeChild(y);
        } else if (typeof t.is == "string")
          f = s.createElement(e, {
            is: t.is
          });
        else if (f = s.createElement(e), e === "select") {
          var g = f;
          t.multiple ? g.multiple = !0 : t.size && (g.size = t.size);
        }
      } else
        f = s.createElementNS(p, e);
      return p === Ni && !u && Object.prototype.toString.call(f) === "[object HTMLUnknownElement]" && !Yn.call(Ly, e) && (Ly[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), f;
    }
    function HR(e, t) {
      return H0(t).createTextNode(e);
    }
    function jR(e, t, a, i) {
      var u = Ui(t, a);
      vh(t, a);
      var s;
      switch (t) {
        case "dialog":
          Sn("cancel", e), Sn("close", e), s = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          Sn("load", e), s = a;
          break;
        case "video":
        case "audio":
          for (var f = 0; f < Kd.length; f++)
            Sn(Kd[f], e);
          s = a;
          break;
        case "source":
          Sn("error", e), s = a;
          break;
        case "img":
        case "image":
        case "link":
          Sn("error", e), Sn("load", e), s = a;
          break;
        case "details":
          Sn("toggle", e), s = a;
          break;
        case "input":
          C(e, a), s = h(e, a), Sn("invalid", e);
          break;
        case "option":
          $t(e, a), s = a;
          break;
        case "select":
          Zo(e, a), s = Ko(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Jp(e, a), s = $f(e, a), Sn("invalid", e);
          break;
        default:
          s = a;
      }
      switch (ac(t, s), UR(t, e, i, s, u), t) {
        case "input":
          _a(e), X(e, a, !1);
          break;
        case "textarea":
          _a(e), tv(e);
          break;
        case "option":
          Xt(e, a);
          break;
        case "select":
          Pf(e, a);
          break;
        default:
          typeof s.onClick == "function" && gh(e);
          break;
      }
    }
    function VR(e, t, a, i, u) {
      vh(t, i);
      var s = null, f, p;
      switch (t) {
        case "input":
          f = h(e, a), p = h(e, i), s = [];
          break;
        case "select":
          f = Ko(e, a), p = Ko(e, i), s = [];
          break;
        case "textarea":
          f = $f(e, a), p = $f(e, i), s = [];
          break;
        default:
          f = a, p = i, typeof f.onClick != "function" && typeof p.onClick == "function" && gh(e);
          break;
      }
      ac(t, p);
      var v, y, g = null;
      for (v in f)
        if (!(p.hasOwnProperty(v) || !f.hasOwnProperty(v) || f[v] == null))
          if (v === Ns) {
            var _ = f[v];
            for (y in _)
              _.hasOwnProperty(y) && (g || (g = {}), g[y] = "");
          } else
            v === ep || v === Ms || v === dh || v === Do || v === z0 || (Ut.hasOwnProperty(v) ? s || (s = []) : (s = s || []).push(v, null));
      for (v in p) {
        var x = p[v], M = f != null ? f[v] : void 0;
        if (!(!p.hasOwnProperty(v) || x === M || x == null && M == null))
          if (v === Ns)
            if (x && Object.freeze(x), M) {
              for (y in M)
                M.hasOwnProperty(y) && (!x || !x.hasOwnProperty(y)) && (g || (g = {}), g[y] = "");
              for (y in x)
                x.hasOwnProperty(y) && M[y] !== x[y] && (g || (g = {}), g[y] = x[y]);
            } else
              g || (s || (s = []), s.push(v, g)), g = x;
          else if (v === ep) {
            var U = x ? x[ph] : void 0, H = M ? M[ph] : void 0;
            U != null && H !== U && (s = s || []).push(v, U);
          } else
            v === Ms ? (typeof x == "string" || typeof x == "number") && (s = s || []).push(v, "" + x) : v === dh || v === Do || (Ut.hasOwnProperty(v) ? (x != null && (typeof x != "function" && hh(v, x), v === "onScroll" && Sn("scroll", e)), !s && M !== x && (s = [])) : (s = s || []).push(v, x));
      }
      return g && (es(g, p[Ns]), (s = s || []).push(Ns, g)), s;
    }
    function PR(e, t, a, i, u) {
      a === "input" && u.type === "radio" && u.name != null && z(e, u);
      var s = Ui(a, i), f = Ui(a, u);
      switch (AR(e, t, s, f), a) {
        case "input":
          F(e, u);
          break;
        case "textarea":
          ev(e, u);
          break;
        case "select":
          $m(e, u);
          break;
      }
    }
    function BR(e) {
      {
        var t = e.toLowerCase();
        return ic.hasOwnProperty(t) && ic[t] || null;
      }
    }
    function $R(e, t, a, i, u, s, f) {
      var p, v;
      switch (p = Ui(t, a), vh(t, a), t) {
        case "dialog":
          Sn("cancel", e), Sn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          Sn("load", e);
          break;
        case "video":
        case "audio":
          for (var y = 0; y < Kd.length; y++)
            Sn(Kd[y], e);
          break;
        case "source":
          Sn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          Sn("error", e), Sn("load", e);
          break;
        case "details":
          Sn("toggle", e);
          break;
        case "input":
          C(e, a), Sn("invalid", e);
          break;
        case "option":
          $t(e, a);
          break;
        case "select":
          Zo(e, a), Sn("invalid", e);
          break;
        case "textarea":
          Jp(e, a), Sn("invalid", e);
          break;
      }
      ac(t, a);
      {
        v = /* @__PURE__ */ new Set();
        for (var g = e.attributes, _ = 0; _ < g.length; _++) {
          var x = g[_].name.toLowerCase();
          switch (x) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              v.add(g[_].name);
          }
        }
      }
      var M = null;
      for (var U in a)
        if (a.hasOwnProperty(U)) {
          var H = a[U];
          if (U === Ms)
            typeof H == "string" ? e.textContent !== H && (a[Do] !== !0 && yh(e.textContent, H, s, f), M = [Ms, H]) : typeof H == "number" && e.textContent !== "" + H && (a[Do] !== !0 && yh(e.textContent, H, s, f), M = [Ms, "" + H]);
          else if (Ut.hasOwnProperty(U))
            H != null && (typeof H != "function" && hh(U, H), U === "onScroll" && Sn("scroll", e));
          else if (f && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof p == "boolean") {
            var fe = void 0, Oe = p && $e ? null : xr(U);
            if (a[Do] !== !0) {
              if (!(U === dh || U === Do || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              U === "value" || U === "checked" || U === "selected")) {
                if (U === ep) {
                  var Te = e.innerHTML, St = H ? H[ph] : void 0;
                  if (St != null) {
                    var pt = F0(e, St);
                    pt !== Te && tp(U, Te, pt);
                  }
                } else if (U === Ns) {
                  if (v.delete(U), A0) {
                    var D = Km(H);
                    fe = e.getAttribute("style"), D !== fe && tp(U, fe, D);
                  }
                } else if (p && !$e)
                  v.delete(U.toLowerCase()), fe = oi(e, U, H), H !== fe && tp(U, fe, H);
                else if (!vn(U, Oe, p) && !Bt(U, H, Oe, p)) {
                  var j = !1;
                  if (Oe !== null)
                    v.delete(Oe.attributeName), fe = fa(e, U, H, Oe);
                  else {
                    var O = i;
                    if (O === Ni && (O = ec(t)), O === Ni)
                      v.delete(U.toLowerCase());
                    else {
                      var q = BR(U);
                      q !== null && q !== U && (j = !0, v.delete(q)), v.delete(U);
                    }
                    fe = oi(e, U, H);
                  }
                  var de = $e;
                  !de && H !== fe && !j && tp(U, fe, H);
                }
              }
            }
          }
        }
      switch (f && // $FlowFixMe - Should be inferred as not undefined.
      v.size > 0 && a[Do] !== !0 && U0(v), t) {
        case "input":
          _a(e), X(e, a, !0);
          break;
        case "textarea":
          _a(e), tv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && gh(e);
          break;
      }
      return M;
    }
    function YR(e, t, a) {
      var i = e.nodeValue !== t;
      return i;
    }
    function My(e, t) {
      {
        if (Va)
          return;
        Va = !0, S("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Ny(e, t) {
      {
        if (Va)
          return;
        Va = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function zy(e, t, a) {
      {
        if (Va)
          return;
        Va = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Uy(e, t) {
      {
        if (t === "" || Va)
          return;
        Va = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function IR(e, t, a) {
      switch (t) {
        case "input":
          Ne(e, a);
          return;
        case "textarea":
          Yf(e, a);
          return;
        case "select":
          Ym(e, a);
          return;
      }
    }
    var np = function() {
    }, rp = function() {
    };
    {
      var QR = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], j0 = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], WR = j0.concat(["button"]), GR = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], V0 = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      rp = function(e, t) {
        var a = lt({}, e || V0), i = {
          tag: t
        };
        return j0.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), WR.indexOf(t) !== -1 && (a.pTagInButtonScope = null), QR.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = i, t === "form" && (a.formTag = i), t === "a" && (a.aTagInScope = i), t === "button" && (a.buttonTagInScope = i), t === "nobr" && (a.nobrTagInScope = i), t === "p" && (a.pTagInButtonScope = i), t === "li" && (a.listItemTagAutoclosing = i), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = i), a;
      };
      var qR = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return GR.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, XR = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, P0 = {};
      np = function(e, t, a) {
        a = a || V0;
        var i = a.current, u = i && i.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var s = qR(e, u) ? null : i, f = s ? null : XR(e, a), p = s || f;
        if (p) {
          var v = p.tag, y = !!s + "|" + e + "|" + v;
          if (!P0[y]) {
            P0[y] = !0;
            var g = e, _ = "";
            if (e === "#text" ? /\S/.test(t) ? g = "Text nodes" : (g = "Whitespace text nodes", _ = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : g = "<" + e + ">", s) {
              var x = "";
              v === "table" && e === "tr" && (x += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), S("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", g, v, _, x);
            } else
              S("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", g, v);
          }
        }
      };
    }
    var Sh = "suppressHydrationWarning", Eh = "$", Ch = "/$", ap = "$?", ip = "$!", KR = "style", Ay = null, Fy = null;
    function ZR(e) {
      var t, a, i = e.nodeType;
      switch (i) {
        case Ja:
        case Jl: {
          t = i === Ja ? "#document" : "#fragment";
          var u = e.documentElement;
          a = u ? u.namespaceURI : Qf(null, "");
          break;
        }
        default: {
          var s = i === Mn ? e.parentNode : e, f = s.namespaceURI || null;
          t = s.tagName, a = Qf(f, t);
          break;
        }
      }
      {
        var p = t.toLowerCase(), v = rp(null, p);
        return {
          namespace: a,
          ancestorInfo: v
        };
      }
    }
    function JR(e, t, a) {
      {
        var i = e, u = Qf(i.namespace, t), s = rp(i.ancestorInfo, t);
        return {
          namespace: u,
          ancestorInfo: s
        };
      }
    }
    function pk(e) {
      return e;
    }
    function eT(e) {
      Ay = Sa(), Fy = vR();
      var t = null;
      return Kn(!1), t;
    }
    function tT(e) {
      hR(Fy), Kn(Ay), Ay = null, Fy = null;
    }
    function nT(e, t, a, i, u) {
      var s;
      {
        var f = i;
        if (np(e, null, f.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var p = "" + t.children, v = rp(f.ancestorInfo, e);
          np(null, p, v);
        }
        s = f.namespace;
      }
      var y = FR(e, t, a, s);
      return op(u, y), Iy(y, t), y;
    }
    function rT(e, t) {
      e.appendChild(t);
    }
    function aT(e, t, a, i, u) {
      switch (jR(e, t, a, i), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function iT(e, t, a, i, u, s) {
      {
        var f = s;
        if (typeof i.children != typeof a.children && (typeof i.children == "string" || typeof i.children == "number")) {
          var p = "" + i.children, v = rp(f.ancestorInfo, t);
          np(null, p, v);
        }
      }
      return VR(e, t, a, i);
    }
    function Hy(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function lT(e, t, a, i) {
      {
        var u = a;
        np(null, e, u.ancestorInfo);
      }
      var s = HR(e, t);
      return op(i, s), s;
    }
    function uT() {
      var e = window.event;
      return e === void 0 ? $i : Or(e.type);
    }
    var jy = typeof setTimeout == "function" ? setTimeout : void 0, oT = typeof clearTimeout == "function" ? clearTimeout : void 0, Vy = -1, B0 = typeof Promise == "function" ? Promise : void 0, sT = typeof queueMicrotask == "function" ? queueMicrotask : typeof B0 < "u" ? function(e) {
      return B0.resolve(null).then(e).catch(cT);
    } : jy;
    function cT(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function fT(e, t, a, i) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function dT(e, t, a, i, u, s) {
      PR(e, t, a, i, u), Iy(e, u);
    }
    function $0(e) {
      nc(e, "");
    }
    function pT(e, t, a) {
      e.nodeValue = a;
    }
    function vT(e, t) {
      e.appendChild(t);
    }
    function hT(e, t) {
      var a;
      e.nodeType === Mn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var i = e._reactRootContainer;
      i == null && a.onclick === null && gh(a);
    }
    function mT(e, t, a) {
      e.insertBefore(t, a);
    }
    function yT(e, t, a) {
      e.nodeType === Mn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function gT(e, t) {
      e.removeChild(t);
    }
    function ST(e, t) {
      e.nodeType === Mn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Py(e, t) {
      var a = t, i = 0;
      do {
        var u = a.nextSibling;
        if (e.removeChild(a), u && u.nodeType === Mn) {
          var s = u.data;
          if (s === Ch)
            if (i === 0) {
              e.removeChild(u), dt(t);
              return;
            } else
              i--;
          else
            (s === Eh || s === ap || s === ip) && i++;
        }
        a = u;
      } while (a);
      dt(t);
    }
    function ET(e, t) {
      e.nodeType === Mn ? Py(e.parentNode, t) : e.nodeType === qr && Py(e, t), dt(e);
    }
    function CT(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function RT(e) {
      e.nodeValue = "";
    }
    function TT(e, t) {
      e = e;
      var a = t[KR], i = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = rc("display", i);
    }
    function wT(e, t) {
      e.nodeValue = t;
    }
    function xT(e) {
      e.nodeType === qr ? e.textContent = "" : e.nodeType === Ja && e.documentElement && e.removeChild(e.documentElement);
    }
    function bT(e, t, a) {
      return e.nodeType !== qr || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function _T(e, t) {
      return t === "" || e.nodeType !== zi ? null : e;
    }
    function kT(e) {
      return e.nodeType !== Mn ? null : e;
    }
    function Y0(e) {
      return e.data === ap;
    }
    function By(e) {
      return e.data === ip;
    }
    function DT(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, i, u;
      return t && (a = t.dgst, i = t.msg, u = t.stck), {
        message: i,
        digest: a,
        stack: u
      };
    }
    function OT(e, t) {
      e._reactRetry = t;
    }
    function Rh(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === qr || t === zi)
          break;
        if (t === Mn) {
          var a = e.data;
          if (a === Eh || a === ip || a === ap)
            break;
          if (a === Ch)
            return null;
        }
      }
      return e;
    }
    function lp(e) {
      return Rh(e.nextSibling);
    }
    function LT(e) {
      return Rh(e.firstChild);
    }
    function MT(e) {
      return Rh(e.firstChild);
    }
    function NT(e) {
      return Rh(e.nextSibling);
    }
    function zT(e, t, a, i, u, s, f) {
      op(s, e), Iy(e, a);
      var p;
      {
        var v = u;
        p = v.namespace;
      }
      var y = (s.mode & ot) !== Me;
      return $R(e, t, a, p, i, y, f);
    }
    function UT(e, t, a, i) {
      return op(a, e), a.mode & ot, YR(e, t);
    }
    function AT(e, t) {
      op(t, e);
    }
    function FT(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Ch) {
            if (a === 0)
              return lp(t);
            a--;
          } else
            (i === Eh || i === ip || i === ap) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function I0(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Mn) {
          var i = t.data;
          if (i === Eh || i === ip || i === ap) {
            if (a === 0)
              return t;
            a--;
          } else
            i === Ch && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function HT(e) {
      dt(e);
    }
    function jT(e) {
      dt(e);
    }
    function VT(e) {
      return e !== "head" && e !== "body";
    }
    function PT(e, t, a, i) {
      var u = !0;
      yh(t.nodeValue, a, i, u);
    }
    function BT(e, t, a, i, u, s) {
      if (t[Sh] !== !0) {
        var f = !0;
        yh(i.nodeValue, u, s, f);
      }
    }
    function $T(e, t) {
      t.nodeType === qr ? My(e, t) : t.nodeType === Mn || Ny(e, t);
    }
    function YT(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === qr ? My(a, t) : t.nodeType === Mn || Ny(a, t));
      }
    }
    function IT(e, t, a, i, u) {
      (u || t[Sh] !== !0) && (i.nodeType === qr ? My(a, i) : i.nodeType === Mn || Ny(a, i));
    }
    function QT(e, t, a) {
      zy(e, t);
    }
    function WT(e, t) {
      Uy(e, t);
    }
    function GT(e, t, a) {
      {
        var i = e.parentNode;
        i !== null && zy(i, t);
      }
    }
    function qT(e, t) {
      {
        var a = e.parentNode;
        a !== null && Uy(a, t);
      }
    }
    function XT(e, t, a, i, u, s) {
      (s || t[Sh] !== !0) && zy(a, i);
    }
    function KT(e, t, a, i, u) {
      (u || t[Sh] !== !0) && Uy(a, i);
    }
    function ZT(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function JT(e) {
      Zd(e);
    }
    var cf = Math.random().toString(36).slice(2), ff = "__reactFiber$" + cf, $y = "__reactProps$" + cf, up = "__reactContainer$" + cf, Yy = "__reactEvents$" + cf, ew = "__reactListeners$" + cf, tw = "__reactHandles$" + cf;
    function nw(e) {
      delete e[ff], delete e[$y], delete e[Yy], delete e[ew], delete e[tw];
    }
    function op(e, t) {
      t[ff] = e;
    }
    function Th(e, t) {
      t[up] = e;
    }
    function Q0(e) {
      e[up] = null;
    }
    function sp(e) {
      return !!e[up];
    }
    function zs(e) {
      var t = e[ff];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[up] || a[ff], t) {
          var i = t.alternate;
          if (t.child !== null || i !== null && i.child !== null)
            for (var u = I0(e); u !== null; ) {
              var s = u[ff];
              if (s)
                return s;
              u = I0(u);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Oo(e) {
      var t = e[ff] || e[up];
      return t && (t.tag === ie || t.tag === Ve || t.tag === be || t.tag === re) ? t : null;
    }
    function df(e) {
      if (e.tag === ie || e.tag === Ve)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function wh(e) {
      return e[$y] || null;
    }
    function Iy(e, t) {
      e[$y] = t;
    }
    function rw(e) {
      var t = e[Yy];
      return t === void 0 && (t = e[Yy] = /* @__PURE__ */ new Set()), t;
    }
    var W0 = {}, G0 = N.ReactDebugCurrentFrame;
    function xh(e) {
      if (e) {
        var t = e._owner, a = pi(e.type, e._source, t ? t.type : null);
        G0.setExtraStackFrame(a);
      } else
        G0.setExtraStackFrame(null);
    }
    function Gi(e, t, a, i, u) {
      {
        var s = Function.call.bind(Yn);
        for (var f in e)
          if (s(e, f)) {
            var p = void 0;
            try {
              if (typeof e[f] != "function") {
                var v = Error((i || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw v.name = "Invariant Violation", v;
              }
              p = e[f](t, f, i, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (y) {
              p = y;
            }
            p && !(p instanceof Error) && (xh(u), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", i || "React class", a, f, typeof p), xh(null)), p instanceof Error && !(p.message in W0) && (W0[p.message] = !0, xh(u), S("Failed %s type: %s", a, p.message), xh(null));
          }
      }
    }
    var Qy = [], bh;
    bh = [];
    var _u = -1;
    function Lo(e) {
      return {
        current: e
      };
    }
    function aa(e, t) {
      if (_u < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== bh[_u] && S("Unexpected Fiber popped."), e.current = Qy[_u], Qy[_u] = null, bh[_u] = null, _u--;
    }
    function ia(e, t, a) {
      _u++, Qy[_u] = e.current, bh[_u] = a, e.current = t;
    }
    var Wy;
    Wy = {};
    var ai = {};
    Object.freeze(ai);
    var ku = Lo(ai), jl = Lo(!1), Gy = ai;
    function pf(e, t, a) {
      return a && Vl(t) ? Gy : ku.current;
    }
    function q0(e, t, a) {
      {
        var i = e.stateNode;
        i.__reactInternalMemoizedUnmaskedChildContext = t, i.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function vf(e, t) {
      {
        var a = e.type, i = a.contextTypes;
        if (!i)
          return ai;
        var u = e.stateNode;
        if (u && u.__reactInternalMemoizedUnmaskedChildContext === t)
          return u.__reactInternalMemoizedMaskedChildContext;
        var s = {};
        for (var f in i)
          s[f] = t[f];
        {
          var p = Ye(e) || "Unknown";
          Gi(i, s, "context", p);
        }
        return u && q0(e, t, s), s;
      }
    }
    function _h() {
      return jl.current;
    }
    function Vl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function kh(e) {
      aa(jl, e), aa(ku, e);
    }
    function qy(e) {
      aa(jl, e), aa(ku, e);
    }
    function X0(e, t, a) {
      {
        if (ku.current !== ai)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        ia(ku, t, e), ia(jl, a, e);
      }
    }
    function K0(e, t, a) {
      {
        var i = e.stateNode, u = t.childContextTypes;
        if (typeof i.getChildContext != "function") {
          {
            var s = Ye(e) || "Unknown";
            Wy[s] || (Wy[s] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", s, s));
          }
          return a;
        }
        var f = i.getChildContext();
        for (var p in f)
          if (!(p in u))
            throw new Error((Ye(e) || "Unknown") + '.getChildContext(): key "' + p + '" is not defined in childContextTypes.');
        {
          var v = Ye(e) || "Unknown";
          Gi(u, f, "child context", v);
        }
        return lt({}, a, f);
      }
    }
    function Dh(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ai;
        return Gy = ku.current, ia(ku, a, e), ia(jl, jl.current, e), !0;
      }
    }
    function Z0(e, t, a) {
      {
        var i = e.stateNode;
        if (!i)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var u = K0(e, t, Gy);
          i.__reactInternalMemoizedMergedChildContext = u, aa(jl, e), aa(ku, e), ia(ku, u, e), ia(jl, a, e);
        } else
          aa(jl, e), ia(jl, a, e);
      }
    }
    function aw(e) {
      {
        if (!dd(e) || e.tag !== pe)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case re:
              return t.stateNode.context;
            case pe: {
              var a = t.type;
              if (Vl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Mo = 0, Oh = 1, Du = null, Xy = !1, Ky = !1;
    function J0(e) {
      Du === null ? Du = [e] : Du.push(e);
    }
    function iw(e) {
      Xy = !0, J0(e);
    }
    function eE() {
      Xy && No();
    }
    function No() {
      if (!Ky && Du !== null) {
        Ky = !0;
        var e = 0, t = Aa();
        try {
          var a = !0, i = Du;
          for (Vn(gr); e < i.length; e++) {
            var u = i[e];
            do
              u = u(a);
            while (u !== null);
          }
          Du = null, Xy = !1;
        } catch (s) {
          throw Du !== null && (Du = Du.slice(e + 1)), vc(mc, No), s;
        } finally {
          Vn(t), Ky = !1;
        }
      }
      return null;
    }
    var hf = [], mf = 0, Lh = null, Mh = 0, Ri = [], Ti = 0, Us = null, Ou = 1, Lu = "";
    function lw(e) {
      return Fs(), (e.flags & sd) !== ke;
    }
    function uw(e) {
      return Fs(), Mh;
    }
    function ow() {
      var e = Lu, t = Ou, a = t & ~sw(t);
      return a.toString(32) + e;
    }
    function As(e, t) {
      Fs(), hf[mf++] = Mh, hf[mf++] = Lh, Lh = e, Mh = t;
    }
    function tE(e, t, a) {
      Fs(), Ri[Ti++] = Ou, Ri[Ti++] = Lu, Ri[Ti++] = Us, Us = e;
      var i = Ou, u = Lu, s = Nh(i) - 1, f = i & ~(1 << s), p = a + 1, v = Nh(t) + s;
      if (v > 30) {
        var y = s - s % 5, g = (1 << y) - 1, _ = (f & g).toString(32), x = f >> y, M = s - y, U = Nh(t) + M, H = p << M, fe = H | x, Oe = _ + u;
        Ou = 1 << U | fe, Lu = Oe;
      } else {
        var Te = p << s, St = Te | f, pt = u;
        Ou = 1 << v | St, Lu = pt;
      }
    }
    function Zy(e) {
      Fs();
      var t = e.return;
      if (t !== null) {
        var a = 1, i = 0;
        As(e, a), tE(e, a, i);
      }
    }
    function Nh(e) {
      return 32 - Rc(e);
    }
    function sw(e) {
      return 1 << Nh(e) - 1;
    }
    function Jy(e) {
      for (; e === Lh; )
        Lh = hf[--mf], hf[mf] = null, Mh = hf[--mf], hf[mf] = null;
      for (; e === Us; )
        Us = Ri[--Ti], Ri[Ti] = null, Lu = Ri[--Ti], Ri[Ti] = null, Ou = Ri[--Ti], Ri[Ti] = null;
    }
    function cw() {
      return Fs(), Us !== null ? {
        id: Ou,
        overflow: Lu
      } : null;
    }
    function fw(e, t) {
      Fs(), Ri[Ti++] = Ou, Ri[Ti++] = Lu, Ri[Ti++] = Us, Ou = t.id, Lu = t.overflow, Us = e;
    }
    function Fs() {
      Mr() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Lr = null, wi = null, qi = !1, Hs = !1, zo = null;
    function dw() {
      qi && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function nE() {
      Hs = !0;
    }
    function pw() {
      return Hs;
    }
    function vw(e) {
      var t = e.stateNode.containerInfo;
      return wi = MT(t), Lr = e, qi = !0, zo = null, Hs = !1, !0;
    }
    function hw(e, t, a) {
      return wi = NT(t), Lr = e, qi = !0, zo = null, Hs = !1, a !== null && fw(e, a), !0;
    }
    function rE(e, t) {
      switch (e.tag) {
        case re: {
          $T(e.stateNode.containerInfo, t);
          break;
        }
        case ie: {
          var a = (e.mode & ot) !== Me;
          IT(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case be: {
          var i = e.memoizedState;
          i.dehydrated !== null && YT(i.dehydrated, t);
          break;
        }
      }
    }
    function aE(e, t) {
      rE(e, t);
      var a = g_();
      a.stateNode = t, a.return = e;
      var i = e.deletions;
      i === null ? (e.deletions = [a], e.flags |= Mt) : i.push(a);
    }
    function eg(e, t) {
      {
        if (Hs)
          return;
        switch (e.tag) {
          case re: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case ie:
                var i = t.type;
                t.pendingProps, QT(a, i);
                break;
              case Ve:
                var u = t.pendingProps;
                WT(a, u);
                break;
            }
            break;
          }
          case ie: {
            var s = e.type, f = e.memoizedProps, p = e.stateNode;
            switch (t.tag) {
              case ie: {
                var v = t.type, y = t.pendingProps, g = (e.mode & ot) !== Me;
                XT(
                  s,
                  f,
                  p,
                  v,
                  y,
                  // TODO: Delete this argument when we remove the legacy root API.
                  g
                );
                break;
              }
              case Ve: {
                var _ = t.pendingProps, x = (e.mode & ot) !== Me;
                KT(
                  s,
                  f,
                  p,
                  _,
                  // TODO: Delete this argument when we remove the legacy root API.
                  x
                );
                break;
              }
            }
            break;
          }
          case be: {
            var M = e.memoizedState, U = M.dehydrated;
            if (U !== null)
              switch (t.tag) {
                case ie:
                  var H = t.type;
                  t.pendingProps, GT(U, H);
                  break;
                case Ve:
                  var fe = t.pendingProps;
                  qT(U, fe);
                  break;
              }
            break;
          }
          default:
            return;
        }
      }
    }
    function iE(e, t) {
      t.flags = t.flags & ~La | rn, eg(e, t);
    }
    function lE(e, t) {
      switch (e.tag) {
        case ie: {
          var a = e.type;
          e.pendingProps;
          var i = bT(t, a);
          return i !== null ? (e.stateNode = i, Lr = e, wi = LT(i), !0) : !1;
        }
        case Ve: {
          var u = e.pendingProps, s = _T(t, u);
          return s !== null ? (e.stateNode = s, Lr = e, wi = null, !0) : !1;
        }
        case be: {
          var f = kT(t);
          if (f !== null) {
            var p = {
              dehydrated: f,
              treeContext: cw(),
              retryLane: na
            };
            e.memoizedState = p;
            var v = S_(f);
            return v.return = e, e.child = v, Lr = e, wi = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function tg(e) {
      return (e.mode & ot) !== Me && (e.flags & Pe) === ke;
    }
    function ng(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function rg(e) {
      if (qi) {
        var t = wi;
        if (!t) {
          tg(e) && (eg(Lr, e), ng()), iE(Lr, e), qi = !1, Lr = e;
          return;
        }
        var a = t;
        if (!lE(e, t)) {
          tg(e) && (eg(Lr, e), ng()), t = lp(a);
          var i = Lr;
          if (!t || !lE(e, t)) {
            iE(Lr, e), qi = !1, Lr = e;
            return;
          }
          aE(i, a);
        }
      }
    }
    function mw(e, t, a) {
      var i = e.stateNode, u = !Hs, s = zT(i, e.type, e.memoizedProps, t, a, e, u);
      return e.updateQueue = s, s !== null;
    }
    function yw(e) {
      var t = e.stateNode, a = e.memoizedProps, i = UT(t, a, e);
      if (i) {
        var u = Lr;
        if (u !== null)
          switch (u.tag) {
            case re: {
              var s = u.stateNode.containerInfo, f = (u.mode & ot) !== Me;
              PT(
                s,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                f
              );
              break;
            }
            case ie: {
              var p = u.type, v = u.memoizedProps, y = u.stateNode, g = (u.mode & ot) !== Me;
              BT(
                p,
                v,
                y,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                g
              );
              break;
            }
          }
      }
      return i;
    }
    function gw(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      AT(a, e);
    }
    function Sw(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return FT(a);
    }
    function uE(e) {
      for (var t = e.return; t !== null && t.tag !== ie && t.tag !== re && t.tag !== be; )
        t = t.return;
      Lr = t;
    }
    function zh(e) {
      if (e !== Lr)
        return !1;
      if (!qi)
        return uE(e), qi = !0, !1;
      if (e.tag !== re && (e.tag !== ie || VT(e.type) && !Hy(e.type, e.memoizedProps))) {
        var t = wi;
        if (t)
          if (tg(e))
            oE(e), ng();
          else
            for (; t; )
              aE(e, t), t = lp(t);
      }
      return uE(e), e.tag === be ? wi = Sw(e) : wi = Lr ? lp(e.stateNode) : null, !0;
    }
    function Ew() {
      return qi && wi !== null;
    }
    function oE(e) {
      for (var t = wi; t; )
        rE(e, t), t = lp(t);
    }
    function yf() {
      Lr = null, wi = null, qi = !1, Hs = !1;
    }
    function sE() {
      zo !== null && (r1(zo), zo = null);
    }
    function Mr() {
      return qi;
    }
    function ag(e) {
      zo === null ? zo = [e] : zo.push(e);
    }
    var Cw = N.ReactCurrentBatchConfig, Rw = null;
    function Tw() {
      return Cw.transition;
    }
    var Xi = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var ww = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & yn && (t = a), a = a.return;
        return t;
      }, js = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, cp = [], fp = [], dp = [], pp = [], vp = [], hp = [], Vs = /* @__PURE__ */ new Set();
      Xi.recordUnsafeLifecycleWarnings = function(e, t) {
        Vs.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && cp.push(e), e.mode & yn && typeof t.UNSAFE_componentWillMount == "function" && fp.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && dp.push(e), e.mode & yn && typeof t.UNSAFE_componentWillReceiveProps == "function" && pp.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && vp.push(e), e.mode & yn && typeof t.UNSAFE_componentWillUpdate == "function" && hp.push(e));
      }, Xi.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        cp.length > 0 && (cp.forEach(function(x) {
          e.add(Ye(x) || "Component"), Vs.add(x.type);
        }), cp = []);
        var t = /* @__PURE__ */ new Set();
        fp.length > 0 && (fp.forEach(function(x) {
          t.add(Ye(x) || "Component"), Vs.add(x.type);
        }), fp = []);
        var a = /* @__PURE__ */ new Set();
        dp.length > 0 && (dp.forEach(function(x) {
          a.add(Ye(x) || "Component"), Vs.add(x.type);
        }), dp = []);
        var i = /* @__PURE__ */ new Set();
        pp.length > 0 && (pp.forEach(function(x) {
          i.add(Ye(x) || "Component"), Vs.add(x.type);
        }), pp = []);
        var u = /* @__PURE__ */ new Set();
        vp.length > 0 && (vp.forEach(function(x) {
          u.add(Ye(x) || "Component"), Vs.add(x.type);
        }), vp = []);
        var s = /* @__PURE__ */ new Set();
        if (hp.length > 0 && (hp.forEach(function(x) {
          s.add(Ye(x) || "Component"), Vs.add(x.type);
        }), hp = []), t.size > 0) {
          var f = js(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, f);
        }
        if (i.size > 0) {
          var p = js(i);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, p);
        }
        if (s.size > 0) {
          var v = js(s);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, v);
        }
        if (e.size > 0) {
          var y = js(e);
          Je(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, y);
        }
        if (a.size > 0) {
          var g = js(a);
          Je(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, g);
        }
        if (u.size > 0) {
          var _ = js(u);
          Je(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, _);
        }
      };
      var Uh = /* @__PURE__ */ new Map(), cE = /* @__PURE__ */ new Set();
      Xi.recordLegacyContextWarning = function(e, t) {
        var a = ww(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!cE.has(e.type)) {
          var i = Uh.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (i === void 0 && (i = [], Uh.set(a, i)), i.push(e));
        }
      }, Xi.flushLegacyContextWarning = function() {
        Uh.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], i = /* @__PURE__ */ new Set();
            e.forEach(function(s) {
              i.add(Ye(s) || "Component"), cE.add(s.type);
            });
            var u = js(i);
            try {
              jt(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, u);
            } finally {
              Cn();
            }
          }
        });
      }, Xi.discardPendingWarnings = function() {
        cp = [], fp = [], dp = [], pp = [], vp = [], hp = [], Uh = /* @__PURE__ */ new Map();
      };
    }
    function Ki(e, t) {
      if (e && e.defaultProps) {
        var a = lt({}, t), i = e.defaultProps;
        for (var u in i)
          a[u] === void 0 && (a[u] = i[u]);
        return a;
      }
      return t;
    }
    var ig = Lo(null), lg;
    lg = {};
    var Ah = null, gf = null, ug = null, Fh = !1;
    function Hh() {
      Ah = null, gf = null, ug = null, Fh = !1;
    }
    function fE() {
      Fh = !0;
    }
    function dE() {
      Fh = !1;
    }
    function pE(e, t, a) {
      ia(ig, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== lg && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = lg;
    }
    function og(e, t) {
      var a = ig.current;
      aa(ig, t), e._currentValue = a;
    }
    function sg(e, t, a) {
      for (var i = e; i !== null; ) {
        var u = i.alternate;
        if (mu(i.childLanes, t) ? u !== null && !mu(u.childLanes, t) && (u.childLanes = Ze(u.childLanes, t)) : (i.childLanes = Ze(i.childLanes, t), u !== null && (u.childLanes = Ze(u.childLanes, t))), i === a)
          break;
        i = i.return;
      }
      i !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function xw(e, t, a) {
      bw(e, t, a);
    }
    function bw(e, t, a) {
      var i = e.child;
      for (i !== null && (i.return = e); i !== null; ) {
        var u = void 0, s = i.dependencies;
        if (s !== null) {
          u = i.child;
          for (var f = s.firstContext; f !== null; ) {
            if (f.context === t) {
              if (i.tag === pe) {
                var p = jn(a), v = Mu(Zt, p);
                v.tag = Vh;
                var y = i.updateQueue;
                if (y !== null) {
                  var g = y.shared, _ = g.pending;
                  _ === null ? v.next = v : (v.next = _.next, _.next = v), g.pending = v;
                }
              }
              i.lanes = Ze(i.lanes, a);
              var x = i.alternate;
              x !== null && (x.lanes = Ze(x.lanes, a)), sg(i.return, a, e), s.lanes = Ze(s.lanes, a);
              break;
            }
            f = f.next;
          }
        } else if (i.tag === at)
          u = i.type === e.type ? null : i.child;
        else if (i.tag === Qt) {
          var M = i.return;
          if (M === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          M.lanes = Ze(M.lanes, a);
          var U = M.alternate;
          U !== null && (U.lanes = Ze(U.lanes, a)), sg(M, a, e), u = i.sibling;
        } else
          u = i.child;
        if (u !== null)
          u.return = i;
        else
          for (u = i; u !== null; ) {
            if (u === e) {
              u = null;
              break;
            }
            var H = u.sibling;
            if (H !== null) {
              H.return = u.return, u = H;
              break;
            }
            u = u.return;
          }
        i = u;
      }
    }
    function Sf(e, t) {
      Ah = e, gf = null, ug = null;
      var a = e.dependencies;
      if (a !== null) {
        var i = a.firstContext;
        i !== null && (ra(a.lanes, t) && Dp(), a.firstContext = null);
      }
    }
    function Jn(e) {
      Fh && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (ug !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (gf === null) {
          if (Ah === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          gf = a, Ah.dependencies = {
            lanes: V,
            firstContext: a
          };
        } else
          gf = gf.next = a;
      }
      return t;
    }
    var Ps = null;
    function cg(e) {
      Ps === null ? Ps = [e] : Ps.push(e);
    }
    function _w() {
      if (Ps !== null) {
        for (var e = 0; e < Ps.length; e++) {
          var t = Ps[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var i = a.next, u = t.pending;
            if (u !== null) {
              var s = u.next;
              u.next = i, a.next = s;
            }
            t.pending = a;
          }
        }
        Ps = null;
      }
    }
    function vE(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, cg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, jh(e, i);
    }
    function kw(e, t, a, i) {
      var u = t.interleaved;
      u === null ? (a.next = a, cg(t)) : (a.next = u.next, u.next = a), t.interleaved = a;
    }
    function Dw(e, t, a, i) {
      var u = t.interleaved;
      return u === null ? (a.next = a, cg(t)) : (a.next = u.next, u.next = a), t.interleaved = a, jh(e, i);
    }
    function Pa(e, t) {
      return jh(e, t);
    }
    var Ow = jh;
    function jh(e, t) {
      e.lanes = Ze(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = Ze(a.lanes, t)), a === null && (e.flags & (rn | La)) !== ke && h1(e);
      for (var i = e, u = e.return; u !== null; )
        u.childLanes = Ze(u.childLanes, t), a = u.alternate, a !== null ? a.childLanes = Ze(a.childLanes, t) : (u.flags & (rn | La)) !== ke && h1(e), i = u, u = u.return;
      if (i.tag === re) {
        var s = i.stateNode;
        return s;
      } else
        return null;
    }
    var hE = 0, mE = 1, Vh = 2, fg = 3, Ph = !1, dg, Bh;
    dg = !1, Bh = null;
    function pg(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: V
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function yE(e, t) {
      var a = t.updateQueue, i = e.updateQueue;
      if (a === i) {
        var u = {
          baseState: i.baseState,
          firstBaseUpdate: i.firstBaseUpdate,
          lastBaseUpdate: i.lastBaseUpdate,
          shared: i.shared,
          effects: i.effects
        };
        t.updateQueue = u;
      }
    }
    function Mu(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: hE,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function Uo(e, t, a) {
      var i = e.updateQueue;
      if (i === null)
        return null;
      var u = i.shared;
      if (Bh === u && !dg && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), dg = !0), Ob()) {
        var s = u.pending;
        return s === null ? t.next = t : (t.next = s.next, s.next = t), u.pending = t, Ow(e, a);
      } else
        return Dw(e, u, t, a);
    }
    function $h(e, t, a) {
      var i = t.updateQueue;
      if (i !== null) {
        var u = i.shared;
        if (xd(a)) {
          var s = u.lanes;
          s = _d(s, e.pendingLanes);
          var f = Ze(s, a);
          u.lanes = f, ho(e, f);
        }
      }
    }
    function vg(e, t) {
      var a = e.updateQueue, i = e.alternate;
      if (i !== null) {
        var u = i.updateQueue;
        if (a === u) {
          var s = null, f = null, p = a.firstBaseUpdate;
          if (p !== null) {
            var v = p;
            do {
              var y = {
                eventTime: v.eventTime,
                lane: v.lane,
                tag: v.tag,
                payload: v.payload,
                callback: v.callback,
                next: null
              };
              f === null ? s = f = y : (f.next = y, f = y), v = v.next;
            } while (v !== null);
            f === null ? s = f = t : (f.next = t, f = t);
          } else
            s = f = t;
          a = {
            baseState: u.baseState,
            firstBaseUpdate: s,
            lastBaseUpdate: f,
            shared: u.shared,
            effects: u.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var g = a.lastBaseUpdate;
      g === null ? a.firstBaseUpdate = t : g.next = t, a.lastBaseUpdate = t;
    }
    function Lw(e, t, a, i, u, s) {
      switch (a.tag) {
        case mE: {
          var f = a.payload;
          if (typeof f == "function") {
            fE();
            var p = f.call(s, i, u);
            {
              if (e.mode & yn) {
                Hn(!0);
                try {
                  f.call(s, i, u);
                } finally {
                  Hn(!1);
                }
              }
              dE();
            }
            return p;
          }
          return f;
        }
        case fg:
          e.flags = e.flags & ~Gn | Pe;
        case hE: {
          var v = a.payload, y;
          if (typeof v == "function") {
            fE(), y = v.call(s, i, u);
            {
              if (e.mode & yn) {
                Hn(!0);
                try {
                  v.call(s, i, u);
                } finally {
                  Hn(!1);
                }
              }
              dE();
            }
          } else
            y = v;
          return y == null ? i : lt({}, i, y);
        }
        case Vh:
          return Ph = !0, i;
      }
      return i;
    }
    function Yh(e, t, a, i) {
      var u = e.updateQueue;
      Ph = !1, Bh = u.shared;
      var s = u.firstBaseUpdate, f = u.lastBaseUpdate, p = u.shared.pending;
      if (p !== null) {
        u.shared.pending = null;
        var v = p, y = v.next;
        v.next = null, f === null ? s = y : f.next = y, f = v;
        var g = e.alternate;
        if (g !== null) {
          var _ = g.updateQueue, x = _.lastBaseUpdate;
          x !== f && (x === null ? _.firstBaseUpdate = y : x.next = y, _.lastBaseUpdate = v);
        }
      }
      if (s !== null) {
        var M = u.baseState, U = V, H = null, fe = null, Oe = null, Te = s;
        do {
          var St = Te.lane, pt = Te.eventTime;
          if (mu(i, St)) {
            if (Oe !== null) {
              var j = {
                eventTime: pt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: yt,
                tag: Te.tag,
                payload: Te.payload,
                callback: Te.callback,
                next: null
              };
              Oe = Oe.next = j;
            }
            M = Lw(e, u, Te, M, t, a);
            var O = Te.callback;
            if (O !== null && // If the update was already committed, we should not queue its
            // callback again.
            Te.lane !== yt) {
              e.flags |= mi;
              var q = u.effects;
              q === null ? u.effects = [Te] : q.push(Te);
            }
          } else {
            var D = {
              eventTime: pt,
              lane: St,
              tag: Te.tag,
              payload: Te.payload,
              callback: Te.callback,
              next: null
            };
            Oe === null ? (fe = Oe = D, H = M) : Oe = Oe.next = D, U = Ze(U, St);
          }
          if (Te = Te.next, Te === null) {
            if (p = u.shared.pending, p === null)
              break;
            var de = p, ue = de.next;
            de.next = null, Te = ue, u.lastBaseUpdate = de, u.shared.pending = null;
          }
        } while (!0);
        Oe === null && (H = M), u.baseState = H, u.firstBaseUpdate = fe, u.lastBaseUpdate = Oe;
        var je = u.shared.interleaved;
        if (je !== null) {
          var We = je;
          do
            U = Ze(U, We.lane), We = We.next;
          while (We !== je);
        } else
          s === null && (u.shared.lanes = V);
        Pp(U), e.lanes = U, e.memoizedState = M;
      }
      Bh = null;
    }
    function Mw(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function gE() {
      Ph = !1;
    }
    function Ih() {
      return Ph;
    }
    function SE(e, t, a) {
      var i = t.effects;
      if (t.effects = null, i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u], f = s.callback;
          f !== null && (s.callback = null, Mw(f, a));
        }
    }
    var hg = {}, EE = new B.Component().refs, mg, yg, gg, Sg, Eg, CE, Qh, Cg, Rg, Tg;
    {
      mg = /* @__PURE__ */ new Set(), yg = /* @__PURE__ */ new Set(), gg = /* @__PURE__ */ new Set(), Sg = /* @__PURE__ */ new Set(), Cg = /* @__PURE__ */ new Set(), Eg = /* @__PURE__ */ new Set(), Rg = /* @__PURE__ */ new Set(), Tg = /* @__PURE__ */ new Set();
      var RE = /* @__PURE__ */ new Set();
      Qh = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          RE.has(a) || (RE.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, CE = function(e, t) {
        if (t === void 0) {
          var a = wt(e) || "Component";
          Eg.has(a) || (Eg.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(hg, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(hg);
    }
    function wg(e, t, a, i) {
      var u = e.memoizedState, s = a(i, u);
      {
        if (e.mode & yn) {
          Hn(!0);
          try {
            s = a(i, u);
          } finally {
            Hn(!1);
          }
        }
        CE(t, s);
      }
      var f = s == null ? u : lt({}, u, s);
      if (e.memoizedState = f, e.lanes === V) {
        var p = e.updateQueue;
        p.baseState = f;
      }
    }
    var xg = {
      isMounted: ma,
      enqueueSetState: function(e, t, a) {
        var i = Da(e), u = Ra(), s = $o(i), f = Mu(u, s);
        f.payload = t, a != null && (Qh(a, "setState"), f.callback = a);
        var p = Uo(i, f, s);
        p !== null && (dr(p, i, s, u), $h(p, i, s)), Ol(i, s);
      },
      enqueueReplaceState: function(e, t, a) {
        var i = Da(e), u = Ra(), s = $o(i), f = Mu(u, s);
        f.tag = mE, f.payload = t, a != null && (Qh(a, "replaceState"), f.callback = a);
        var p = Uo(i, f, s);
        p !== null && (dr(p, i, s, u), $h(p, i, s)), Ol(i, s);
      },
      enqueueForceUpdate: function(e, t) {
        var a = Da(e), i = Ra(), u = $o(a), s = Mu(i, u);
        s.tag = Vh, t != null && (Qh(t, "forceUpdate"), s.callback = t);
        var f = Uo(a, s, u);
        f !== null && (dr(f, a, u, i), $h(f, a, u)), Cd(a, u);
      }
    };
    function TE(e, t, a, i, u, s, f) {
      var p = e.stateNode;
      if (typeof p.shouldComponentUpdate == "function") {
        var v = p.shouldComponentUpdate(i, s, f);
        {
          if (e.mode & yn) {
            Hn(!0);
            try {
              v = p.shouldComponentUpdate(i, s, f);
            } finally {
              Hn(!1);
            }
          }
          v === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", wt(t) || "Component");
        }
        return v;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !_e(a, i) || !_e(u, s) : !0;
    }
    function Nw(e, t, a) {
      var i = e.stateNode;
      {
        var u = wt(t) || "Component", s = i.render;
        s || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", u) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", u)), i.getInitialState && !i.getInitialState.isReactClassApproved && !i.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", u), i.getDefaultProps && !i.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", u), i.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", u), i.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", u), i.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", u), t.contextType && t.contextTypes && !Rg.has(t) && (Rg.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", u)), typeof i.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", u), t.prototype && t.prototype.isPureReactComponent && typeof i.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", wt(t) || "A pure component"), typeof i.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", u), typeof i.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", u), typeof i.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", u), typeof i.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", u);
        var f = i.props !== a;
        i.props !== void 0 && f && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", u, u), i.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", u, u), typeof i.getSnapshotBeforeUpdate == "function" && typeof i.componentDidUpdate != "function" && !gg.has(t) && (gg.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", wt(t))), typeof i.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof i.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", u), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", u);
        var p = i.state;
        p && (typeof p != "object" || vt(p)) && S("%s.state: must be set to an object or null", u), typeof i.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", u);
      }
    }
    function wE(e, t) {
      t.updater = xg, e.stateNode = t, ao(t, e), t._reactInternalInstance = hg;
    }
    function xE(e, t, a) {
      var i = !1, u = ai, s = ai, f = t.contextType;
      if ("contextType" in t) {
        var p = (
          // Allow null for conditional declaration
          f === null || f !== void 0 && f.$$typeof === ee && f._context === void 0
        );
        if (!p && !Tg.has(t)) {
          Tg.add(t);
          var v = "";
          f === void 0 ? v = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? v = " However, it is set to a " + typeof f + "." : f.$$typeof === Y ? v = " Did you accidentally pass the Context.Provider instead?" : f._context !== void 0 ? v = " Did you accidentally pass the Context.Consumer instead?" : v = " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", wt(t) || "Component", v);
        }
      }
      if (typeof f == "object" && f !== null)
        s = Jn(f);
      else {
        u = pf(e, t, !0);
        var y = t.contextTypes;
        i = y != null, s = i ? vf(e, u) : ai;
      }
      var g = new t(a, s);
      if (e.mode & yn) {
        Hn(!0);
        try {
          g = new t(a, s);
        } finally {
          Hn(!1);
        }
      }
      var _ = e.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null;
      wE(e, g);
      {
        if (typeof t.getDerivedStateFromProps == "function" && _ === null) {
          var x = wt(t) || "Component";
          yg.has(x) || (yg.add(x), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", x, g.state === null ? "null" : "undefined", x));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof g.getSnapshotBeforeUpdate == "function") {
          var M = null, U = null, H = null;
          if (typeof g.componentWillMount == "function" && g.componentWillMount.__suppressDeprecationWarning !== !0 ? M = "componentWillMount" : typeof g.UNSAFE_componentWillMount == "function" && (M = "UNSAFE_componentWillMount"), typeof g.componentWillReceiveProps == "function" && g.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? U = "componentWillReceiveProps" : typeof g.UNSAFE_componentWillReceiveProps == "function" && (U = "UNSAFE_componentWillReceiveProps"), typeof g.componentWillUpdate == "function" && g.componentWillUpdate.__suppressDeprecationWarning !== !0 ? H = "componentWillUpdate" : typeof g.UNSAFE_componentWillUpdate == "function" && (H = "UNSAFE_componentWillUpdate"), M !== null || U !== null || H !== null) {
            var fe = wt(t) || "Component", Oe = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            Sg.has(fe) || (Sg.add(fe), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, fe, Oe, M !== null ? `
  ` + M : "", U !== null ? `
  ` + U : "", H !== null ? `
  ` + H : ""));
          }
        }
      }
      return i && q0(e, u, s), g;
    }
    function zw(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", Ye(e) || "Component"), xg.enqueueReplaceState(t, t.state, null));
    }
    function bE(e, t, a, i) {
      var u = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, i), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, i), t.state !== u) {
        {
          var s = Ye(e) || "Component";
          mg.has(s) || (mg.add(s), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", s));
        }
        xg.enqueueReplaceState(t, t.state, null);
      }
    }
    function bg(e, t, a, i) {
      Nw(e, t, a);
      var u = e.stateNode;
      u.props = a, u.state = e.memoizedState, u.refs = EE, pg(e);
      var s = t.contextType;
      if (typeof s == "object" && s !== null)
        u.context = Jn(s);
      else {
        var f = pf(e, t, !0);
        u.context = vf(e, f);
      }
      {
        if (u.state === a) {
          var p = wt(t) || "Component";
          Cg.has(p) || (Cg.add(p), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", p));
        }
        e.mode & yn && Xi.recordLegacyContextWarning(e, u), Xi.recordUnsafeLifecycleWarnings(e, u);
      }
      u.state = e.memoizedState;
      var v = t.getDerivedStateFromProps;
      if (typeof v == "function" && (wg(e, t, v, a), u.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof u.getSnapshotBeforeUpdate != "function" && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (zw(e, u), Yh(e, a, u, i), u.state = e.memoizedState), typeof u.componentDidMount == "function") {
        var y = Ke;
        y |= Kr, (e.mode & za) !== Me && (y |= Zr), e.flags |= y;
      }
    }
    function Uw(e, t, a, i) {
      var u = e.stateNode, s = e.memoizedProps;
      u.props = s;
      var f = u.context, p = t.contextType, v = ai;
      if (typeof p == "object" && p !== null)
        v = Jn(p);
      else {
        var y = pf(e, t, !0);
        v = vf(e, y);
      }
      var g = t.getDerivedStateFromProps, _ = typeof g == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      !_ && (typeof u.UNSAFE_componentWillReceiveProps == "function" || typeof u.componentWillReceiveProps == "function") && (s !== a || f !== v) && bE(e, u, a, v), gE();
      var x = e.memoizedState, M = u.state = x;
      if (Yh(e, a, u, i), M = e.memoizedState, s === a && x === M && !_h() && !Ih()) {
        if (typeof u.componentDidMount == "function") {
          var U = Ke;
          U |= Kr, (e.mode & za) !== Me && (U |= Zr), e.flags |= U;
        }
        return !1;
      }
      typeof g == "function" && (wg(e, t, g, a), M = e.memoizedState);
      var H = Ih() || TE(e, t, s, a, x, M, v);
      if (H) {
        if (!_ && (typeof u.UNSAFE_componentWillMount == "function" || typeof u.componentWillMount == "function") && (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function") {
          var fe = Ke;
          fe |= Kr, (e.mode & za) !== Me && (fe |= Zr), e.flags |= fe;
        }
      } else {
        if (typeof u.componentDidMount == "function") {
          var Oe = Ke;
          Oe |= Kr, (e.mode & za) !== Me && (Oe |= Zr), e.flags |= Oe;
        }
        e.memoizedProps = a, e.memoizedState = M;
      }
      return u.props = a, u.state = M, u.context = v, H;
    }
    function Aw(e, t, a, i, u) {
      var s = t.stateNode;
      yE(e, t);
      var f = t.memoizedProps, p = t.type === t.elementType ? f : Ki(t.type, f);
      s.props = p;
      var v = t.pendingProps, y = s.context, g = a.contextType, _ = ai;
      if (typeof g == "object" && g !== null)
        _ = Jn(g);
      else {
        var x = pf(t, a, !0);
        _ = vf(t, x);
      }
      var M = a.getDerivedStateFromProps, U = typeof M == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !U && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (f !== v || y !== _) && bE(t, s, i, _), gE();
      var H = t.memoizedState, fe = s.state = H;
      if (Yh(t, i, s, u), fe = t.memoizedState, f === v && H === fe && !_h() && !Ih() && !we)
        return typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= Ke), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= Oa), !1;
      typeof M == "function" && (wg(t, a, M, i), fe = t.memoizedState);
      var Oe = Ih() || TE(t, a, p, i, H, fe, _) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      we;
      return Oe ? (!U && (typeof s.UNSAFE_componentWillUpdate == "function" || typeof s.componentWillUpdate == "function") && (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(i, fe, _), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(i, fe, _)), typeof s.componentDidUpdate == "function" && (t.flags |= Ke), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= Oa)) : (typeof s.componentDidUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= Ke), typeof s.getSnapshotBeforeUpdate == "function" && (f !== e.memoizedProps || H !== e.memoizedState) && (t.flags |= Oa), t.memoizedProps = i, t.memoizedState = fe), s.props = i, s.state = fe, s.context = _, Oe;
    }
    var _g, kg, Dg, Og, Lg, _E = function(e, t) {
    };
    _g = !1, kg = !1, Dg = {}, Og = {}, Lg = {}, _E = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = Ye(t) || "Component";
        Og[a] || (Og[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function mp(e, t, a) {
      var i = a.ref;
      if (i !== null && typeof i != "function" && typeof i != "object") {
        if ((e.mode & yn || Fe) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self)) {
          var u = Ye(e) || "Component";
          Dg[u] || (S('A string ref, "%s", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', i), Dg[u] = !0);
        }
        if (a._owner) {
          var s = a._owner, f;
          if (s) {
            var p = s;
            if (p.tag !== pe)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            f = p.stateNode;
          }
          if (!f)
            throw new Error("Missing owner for string ref " + i + ". This error is likely caused by a bug in React. Please file an issue.");
          var v = f;
          In(i, "ref");
          var y = "" + i;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === y)
            return t.ref;
          var g = function(_) {
            var x = v.refs;
            x === EE && (x = v.refs = {}), _ === null ? delete x[y] : x[y] = _;
          };
          return g._stringRef = y, g;
        } else {
          if (typeof i != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + i + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return i;
    }
    function Wh(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Gh(e) {
      {
        var t = Ye(e) || "Component";
        if (Lg[t])
          return;
        Lg[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function kE(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function DE(e) {
      function t(D, j) {
        if (e) {
          var O = D.deletions;
          O === null ? (D.deletions = [j], D.flags |= Mt) : O.push(j);
        }
      }
      function a(D, j) {
        if (!e)
          return null;
        for (var O = j; O !== null; )
          t(D, O), O = O.sibling;
        return null;
      }
      function i(D, j) {
        for (var O = /* @__PURE__ */ new Map(), q = j; q !== null; )
          q.key !== null ? O.set(q.key, q) : O.set(q.index, q), q = q.sibling;
        return O;
      }
      function u(D, j) {
        var O = qs(D, j);
        return O.index = 0, O.sibling = null, O;
      }
      function s(D, j, O) {
        if (D.index = O, !e)
          return D.flags |= sd, j;
        var q = D.alternate;
        if (q !== null) {
          var de = q.index;
          return de < j ? (D.flags |= rn, j) : de;
        } else
          return D.flags |= rn, j;
      }
      function f(D) {
        return e && D.alternate === null && (D.flags |= rn), D;
      }
      function p(D, j, O, q) {
        if (j === null || j.tag !== Ve) {
          var de = a0(O, D.mode, q);
          return de.return = D, de;
        } else {
          var ue = u(j, O);
          return ue.return = D, ue;
        }
      }
      function v(D, j, O, q) {
        var de = O.type;
        if (de === pa)
          return g(D, j, O.props.children, q, O.key);
        if (j !== null && (j.elementType === de || // Keep this check inline so it only runs on the false path:
        S1(j, O) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof de == "object" && de !== null && de.$$typeof === De && kE(de) === j.type)) {
          var ue = u(j, O.props);
          return ue.ref = mp(D, j, O), ue.return = D, ue._debugSource = O._source, ue._debugOwner = O._owner, ue;
        }
        var je = r0(O, D.mode, q);
        return je.ref = mp(D, j, O), je.return = D, je;
      }
      function y(D, j, O, q) {
        if (j === null || j.tag !== me || j.stateNode.containerInfo !== O.containerInfo || j.stateNode.implementation !== O.implementation) {
          var de = i0(O, D.mode, q);
          return de.return = D, de;
        } else {
          var ue = u(j, O.children || []);
          return ue.return = D, ue;
        }
      }
      function g(D, j, O, q, de) {
        if (j === null || j.tag !== Ct) {
          var ue = Io(O, D.mode, q, de);
          return ue.return = D, ue;
        } else {
          var je = u(j, O);
          return je.return = D, je;
        }
      }
      function _(D, j, O) {
        if (typeof j == "string" && j !== "" || typeof j == "number") {
          var q = a0("" + j, D.mode, O);
          return q.return = D, q;
        }
        if (typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case si: {
              var de = r0(j, D.mode, O);
              return de.ref = mp(D, null, j), de.return = D, de;
            }
            case br: {
              var ue = i0(j, D.mode, O);
              return ue.return = D, ue;
            }
            case De: {
              var je = j._payload, We = j._init;
              return _(D, We(je), O);
            }
          }
          if (vt(j) || qa(j)) {
            var Gt = Io(j, D.mode, O, null);
            return Gt.return = D, Gt;
          }
          Wh(D, j);
        }
        return typeof j == "function" && Gh(D), null;
      }
      function x(D, j, O, q) {
        var de = j !== null ? j.key : null;
        if (typeof O == "string" && O !== "" || typeof O == "number")
          return de !== null ? null : p(D, j, "" + O, q);
        if (typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case si:
              return O.key === de ? v(D, j, O, q) : null;
            case br:
              return O.key === de ? y(D, j, O, q) : null;
            case De: {
              var ue = O._payload, je = O._init;
              return x(D, j, je(ue), q);
            }
          }
          if (vt(O) || qa(O))
            return de !== null ? null : g(D, j, O, q, null);
          Wh(D, O);
        }
        return typeof O == "function" && Gh(D), null;
      }
      function M(D, j, O, q, de) {
        if (typeof q == "string" && q !== "" || typeof q == "number") {
          var ue = D.get(O) || null;
          return p(j, ue, "" + q, de);
        }
        if (typeof q == "object" && q !== null) {
          switch (q.$$typeof) {
            case si: {
              var je = D.get(q.key === null ? O : q.key) || null;
              return v(j, je, q, de);
            }
            case br: {
              var We = D.get(q.key === null ? O : q.key) || null;
              return y(j, We, q, de);
            }
            case De:
              var Gt = q._payload, Dt = q._init;
              return M(D, j, O, Dt(Gt), de);
          }
          if (vt(q) || qa(q)) {
            var $n = D.get(O) || null;
            return g(j, $n, q, de, null);
          }
          Wh(j, q);
        }
        return typeof q == "function" && Gh(j), null;
      }
      function U(D, j, O) {
        {
          if (typeof D != "object" || D === null)
            return j;
          switch (D.$$typeof) {
            case si:
            case br:
              _E(D, O);
              var q = D.key;
              if (typeof q != "string")
                break;
              if (j === null) {
                j = /* @__PURE__ */ new Set(), j.add(q);
                break;
              }
              if (!j.has(q)) {
                j.add(q);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", q);
              break;
            case De:
              var de = D._payload, ue = D._init;
              U(ue(de), j, O);
              break;
          }
        }
        return j;
      }
      function H(D, j, O, q) {
        for (var de = null, ue = 0; ue < O.length; ue++) {
          var je = O[ue];
          de = U(je, de, D);
        }
        for (var We = null, Gt = null, Dt = j, $n = 0, Ot = 0, Un = null; Dt !== null && Ot < O.length; Ot++) {
          Dt.index > Ot ? (Un = Dt, Dt = null) : Un = Dt.sibling;
          var ua = x(D, Dt, O[Ot], q);
          if (ua === null) {
            Dt === null && (Dt = Un);
            break;
          }
          e && Dt && ua.alternate === null && t(D, Dt), $n = s(ua, $n, Ot), Gt === null ? We = ua : Gt.sibling = ua, Gt = ua, Dt = Un;
        }
        if (Ot === O.length) {
          if (a(D, Dt), Mr()) {
            var jr = Ot;
            As(D, jr);
          }
          return We;
        }
        if (Dt === null) {
          for (; Ot < O.length; Ot++) {
            var li = _(D, O[Ot], q);
            li !== null && ($n = s(li, $n, Ot), Gt === null ? We = li : Gt.sibling = li, Gt = li);
          }
          if (Mr()) {
            var Ta = Ot;
            As(D, Ta);
          }
          return We;
        }
        for (var wa = i(D, Dt); Ot < O.length; Ot++) {
          var oa = M(wa, D, Ot, O[Ot], q);
          oa !== null && (e && oa.alternate !== null && wa.delete(oa.key === null ? Ot : oa.key), $n = s(oa, $n, Ot), Gt === null ? We = oa : Gt.sibling = oa, Gt = oa);
        }
        if (e && wa.forEach(function(Af) {
          return t(D, Af);
        }), Mr()) {
          var Hu = Ot;
          As(D, Hu);
        }
        return We;
      }
      function fe(D, j, O, q) {
        var de = qa(O);
        if (typeof de != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          O[Symbol.toStringTag] === "Generator" && (kg || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), kg = !0), O.entries === de && (_g || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), _g = !0);
          var ue = de.call(O);
          if (ue)
            for (var je = null, We = ue.next(); !We.done; We = ue.next()) {
              var Gt = We.value;
              je = U(Gt, je, D);
            }
        }
        var Dt = de.call(O);
        if (Dt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var $n = null, Ot = null, Un = j, ua = 0, jr = 0, li = null, Ta = Dt.next(); Un !== null && !Ta.done; jr++, Ta = Dt.next()) {
          Un.index > jr ? (li = Un, Un = null) : li = Un.sibling;
          var wa = x(D, Un, Ta.value, q);
          if (wa === null) {
            Un === null && (Un = li);
            break;
          }
          e && Un && wa.alternate === null && t(D, Un), ua = s(wa, ua, jr), Ot === null ? $n = wa : Ot.sibling = wa, Ot = wa, Un = li;
        }
        if (Ta.done) {
          if (a(D, Un), Mr()) {
            var oa = jr;
            As(D, oa);
          }
          return $n;
        }
        if (Un === null) {
          for (; !Ta.done; jr++, Ta = Dt.next()) {
            var Hu = _(D, Ta.value, q);
            Hu !== null && (ua = s(Hu, ua, jr), Ot === null ? $n = Hu : Ot.sibling = Hu, Ot = Hu);
          }
          if (Mr()) {
            var Af = jr;
            As(D, Af);
          }
          return $n;
        }
        for (var Qp = i(D, Un); !Ta.done; jr++, Ta = Dt.next()) {
          var Gl = M(Qp, D, jr, Ta.value, q);
          Gl !== null && (e && Gl.alternate !== null && Qp.delete(Gl.key === null ? jr : Gl.key), ua = s(Gl, ua, jr), Ot === null ? $n = Gl : Ot.sibling = Gl, Ot = Gl);
        }
        if (e && Qp.forEach(function(X_) {
          return t(D, X_);
        }), Mr()) {
          var q_ = jr;
          As(D, q_);
        }
        return $n;
      }
      function Oe(D, j, O, q) {
        if (j !== null && j.tag === Ve) {
          a(D, j.sibling);
          var de = u(j, O);
          return de.return = D, de;
        }
        a(D, j);
        var ue = a0(O, D.mode, q);
        return ue.return = D, ue;
      }
      function Te(D, j, O, q) {
        for (var de = O.key, ue = j; ue !== null; ) {
          if (ue.key === de) {
            var je = O.type;
            if (je === pa) {
              if (ue.tag === Ct) {
                a(D, ue.sibling);
                var We = u(ue, O.props.children);
                return We.return = D, We._debugSource = O._source, We._debugOwner = O._owner, We;
              }
            } else if (ue.elementType === je || // Keep this check inline so it only runs on the false path:
            S1(ue, O) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof je == "object" && je !== null && je.$$typeof === De && kE(je) === ue.type) {
              a(D, ue.sibling);
              var Gt = u(ue, O.props);
              return Gt.ref = mp(D, ue, O), Gt.return = D, Gt._debugSource = O._source, Gt._debugOwner = O._owner, Gt;
            }
            a(D, ue);
            break;
          } else
            t(D, ue);
          ue = ue.sibling;
        }
        if (O.type === pa) {
          var Dt = Io(O.props.children, D.mode, q, O.key);
          return Dt.return = D, Dt;
        } else {
          var $n = r0(O, D.mode, q);
          return $n.ref = mp(D, j, O), $n.return = D, $n;
        }
      }
      function St(D, j, O, q) {
        for (var de = O.key, ue = j; ue !== null; ) {
          if (ue.key === de)
            if (ue.tag === me && ue.stateNode.containerInfo === O.containerInfo && ue.stateNode.implementation === O.implementation) {
              a(D, ue.sibling);
              var je = u(ue, O.children || []);
              return je.return = D, je;
            } else {
              a(D, ue);
              break;
            }
          else
            t(D, ue);
          ue = ue.sibling;
        }
        var We = i0(O, D.mode, q);
        return We.return = D, We;
      }
      function pt(D, j, O, q) {
        var de = typeof O == "object" && O !== null && O.type === pa && O.key === null;
        if (de && (O = O.props.children), typeof O == "object" && O !== null) {
          switch (O.$$typeof) {
            case si:
              return f(Te(D, j, O, q));
            case br:
              return f(St(D, j, O, q));
            case De:
              var ue = O._payload, je = O._init;
              return pt(D, j, je(ue), q);
          }
          if (vt(O))
            return H(D, j, O, q);
          if (qa(O))
            return fe(D, j, O, q);
          Wh(D, O);
        }
        return typeof O == "string" && O !== "" || typeof O == "number" ? f(Oe(D, j, "" + O, q)) : (typeof O == "function" && Gh(D), a(D, j));
      }
      return pt;
    }
    var Ef = DE(!0), OE = DE(!1);
    function Fw(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, i = qs(a, a.pendingProps);
        for (t.child = i, i.return = t; a.sibling !== null; )
          a = a.sibling, i = i.sibling = qs(a, a.pendingProps), i.return = t;
        i.sibling = null;
      }
    }
    function Hw(e, t) {
      for (var a = e.child; a !== null; )
        p_(a, t), a = a.sibling;
    }
    var yp = {}, Ao = Lo(yp), gp = Lo(yp), qh = Lo(yp);
    function Xh(e) {
      if (e === yp)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function LE() {
      var e = Xh(qh.current);
      return e;
    }
    function Mg(e, t) {
      ia(qh, t, e), ia(gp, e, e), ia(Ao, yp, e);
      var a = ZR(t);
      aa(Ao, e), ia(Ao, a, e);
    }
    function Cf(e) {
      aa(Ao, e), aa(gp, e), aa(qh, e);
    }
    function Ng() {
      var e = Xh(Ao.current);
      return e;
    }
    function ME(e) {
      Xh(qh.current);
      var t = Xh(Ao.current), a = JR(t, e.type);
      t !== a && (ia(gp, e, e), ia(Ao, a, e));
    }
    function zg(e) {
      gp.current === e && (aa(Ao, e), aa(gp, e));
    }
    var jw = 0, NE = 1, zE = 1, Sp = 2, Zi = Lo(jw);
    function Ug(e, t) {
      return (e & t) !== 0;
    }
    function Rf(e) {
      return e & NE;
    }
    function Ag(e, t) {
      return e & NE | t;
    }
    function Vw(e, t) {
      return e | t;
    }
    function Fo(e, t) {
      ia(Zi, t, e);
    }
    function Tf(e) {
      aa(Zi, e);
    }
    function Pw(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function Kh(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === be) {
          var a = t.memoizedState;
          if (a !== null) {
            var i = a.dehydrated;
            if (i === null || Y0(i) || By(i))
              return t;
          }
        } else if (t.tag === _t && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var u = (t.flags & Pe) !== ke;
          if (u)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Ba = (
      /*   */
      0
    ), ir = (
      /* */
      1
    ), Pl = (
      /*  */
      2
    ), lr = (
      /*    */
      4
    ), Nr = (
      /*   */
      8
    ), Fg = [];
    function Hg() {
      for (var e = 0; e < Fg.length; e++) {
        var t = Fg[e];
        t._workInProgressVersionPrimary = null;
      }
      Fg.length = 0;
    }
    function Bw(e, t) {
      var a = t._getVersion, i = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, i] : e.mutableSourceEagerHydrationData.push(t, i);
    }
    var se = N.ReactCurrentDispatcher, Ep = N.ReactCurrentBatchConfig, jg, wf;
    jg = /* @__PURE__ */ new Set();
    var Bs = V, Wt = null, ur = null, or = null, Zh = !1, Cp = !1, Rp = 0, $w = 0, Yw = 25, P = null, xi = null, Ho = -1, Vg = !1;
    function Pt() {
      {
        var e = P;
        xi === null ? xi = [e] : xi.push(e);
      }
    }
    function ne() {
      {
        var e = P;
        xi !== null && (Ho++, xi[Ho] !== e && Iw(e));
      }
    }
    function xf(e) {
      e != null && !vt(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", P, typeof e);
    }
    function Iw(e) {
      {
        var t = Ye(Wt);
        if (!jg.has(t) && (jg.add(t), xi !== null)) {
          for (var a = "", i = 30, u = 0; u <= Ho; u++) {
            for (var s = xi[u], f = u === Ho ? e : s, p = u + 1 + ". " + s; p.length < i; )
              p += " ";
            p += f + `
`, a += p;
          }
          S(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function la() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function Pg(e, t) {
      if (Vg)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", P), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, P, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Se(e[a], t[a]))
          return !1;
      return !0;
    }
    function bf(e, t, a, i, u, s) {
      Bs = s, Wt = t, xi = e !== null ? e._debugHookTypes : null, Ho = -1, Vg = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = V, e !== null && e.memoizedState !== null ? se.current = nC : xi !== null ? se.current = tC : se.current = eC;
      var f = a(i, u);
      if (Cp) {
        var p = 0;
        do {
          if (Cp = !1, Rp = 0, p >= Yw)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          p += 1, Vg = !1, ur = null, or = null, t.updateQueue = null, Ho = -1, se.current = rC, f = a(i, u);
        } while (Cp);
      }
      se.current = fm, t._debugHookTypes = xi;
      var v = ur !== null && ur.next !== null;
      if (Bs = V, Wt = null, ur = null, or = null, P = null, xi = null, Ho = -1, e !== null && (e.flags & nr) !== (t.flags & nr) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & ot) !== Me && S("Internal React error: Expected static flag was missing. Please notify the React team."), Zh = !1, v)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return f;
    }
    function _f() {
      var e = Rp !== 0;
      return Rp = 0, e;
    }
    function UE(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & za) !== Me ? t.flags &= ~(lu | Zr | sn | Ke) : t.flags &= ~(sn | Ke), e.lanes = vo(e.lanes, a);
    }
    function AE() {
      if (se.current = fm, Zh) {
        for (var e = Wt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Zh = !1;
      }
      Bs = V, Wt = null, ur = null, or = null, xi = null, Ho = -1, P = null, qE = !1, Cp = !1, Rp = 0;
    }
    function Bl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return or === null ? Wt.memoizedState = or = e : or = or.next = e, or;
    }
    function bi() {
      var e;
      if (ur === null) {
        var t = Wt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = ur.next;
      var a;
      if (or === null ? a = Wt.memoizedState : a = or.next, a !== null)
        or = a, a = or.next, ur = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        ur = e;
        var i = {
          memoizedState: ur.memoizedState,
          baseState: ur.baseState,
          baseQueue: ur.baseQueue,
          queue: ur.queue,
          next: null
        };
        or === null ? Wt.memoizedState = or = i : or = or.next = i;
      }
      return or;
    }
    function FE() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function Bg(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function $g(e, t, a) {
      var i = Bl(), u;
      a !== void 0 ? u = a(t) : u = t, i.memoizedState = i.baseState = u;
      var s = {
        pending: null,
        interleaved: null,
        lanes: V,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      };
      i.queue = s;
      var f = s.dispatch = qw.bind(null, Wt, s);
      return [i.memoizedState, f];
    }
    function Yg(e, t, a) {
      var i = bi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = ur, f = s.baseQueue, p = u.pending;
      if (p !== null) {
        if (f !== null) {
          var v = f.next, y = p.next;
          f.next = y, p.next = v;
        }
        s.baseQueue !== f && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), s.baseQueue = f = p, u.pending = null;
      }
      if (f !== null) {
        var g = f.next, _ = s.baseState, x = null, M = null, U = null, H = g;
        do {
          var fe = H.lane;
          if (mu(Bs, fe)) {
            if (U !== null) {
              var Te = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: yt,
                action: H.action,
                hasEagerState: H.hasEagerState,
                eagerState: H.eagerState,
                next: null
              };
              U = U.next = Te;
            }
            if (H.hasEagerState)
              _ = H.eagerState;
            else {
              var St = H.action;
              _ = e(_, St);
            }
          } else {
            var Oe = {
              lane: fe,
              action: H.action,
              hasEagerState: H.hasEagerState,
              eagerState: H.eagerState,
              next: null
            };
            U === null ? (M = U = Oe, x = _) : U = U.next = Oe, Wt.lanes = Ze(Wt.lanes, fe), Pp(fe);
          }
          H = H.next;
        } while (H !== null && H !== g);
        U === null ? x = _ : U.next = M, Se(_, i.memoizedState) || Dp(), i.memoizedState = _, i.baseState = x, i.baseQueue = U, u.lastRenderedState = _;
      }
      var pt = u.interleaved;
      if (pt !== null) {
        var D = pt;
        do {
          var j = D.lane;
          Wt.lanes = Ze(Wt.lanes, j), Pp(j), D = D.next;
        } while (D !== pt);
      } else
        f === null && (u.lanes = V);
      var O = u.dispatch;
      return [i.memoizedState, O];
    }
    function Ig(e, t, a) {
      var i = bi(), u = i.queue;
      if (u === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      u.lastRenderedReducer = e;
      var s = u.dispatch, f = u.pending, p = i.memoizedState;
      if (f !== null) {
        u.pending = null;
        var v = f.next, y = v;
        do {
          var g = y.action;
          p = e(p, g), y = y.next;
        } while (y !== v);
        Se(p, i.memoizedState) || Dp(), i.memoizedState = p, i.baseQueue === null && (i.baseState = p), u.lastRenderedState = p;
      }
      return [p, s];
    }
    function vk(e, t, a) {
    }
    function hk(e, t, a) {
    }
    function Qg(e, t, a) {
      var i = Wt, u = Bl(), s, f = Mr();
      if (f) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        s = a(), wf || s !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), wf = !0);
      } else {
        if (s = t(), !wf) {
          var p = t();
          Se(s, p) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), wf = !0);
        }
        var v = Dm();
        if (v === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Ss(v, Bs) || HE(i, t, s);
      }
      u.memoizedState = s;
      var y = {
        value: s,
        getSnapshot: t
      };
      return u.queue = y, rm(VE.bind(null, i, y, e), [e]), i.flags |= sn, Tp(ir | Nr, jE.bind(null, i, y, s, t), void 0, null), s;
    }
    function Jh(e, t, a) {
      var i = Wt, u = bi(), s = t();
      if (!wf) {
        var f = t();
        Se(s, f) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), wf = !0);
      }
      var p = u.memoizedState, v = !Se(p, s);
      v && (u.memoizedState = s, Dp());
      var y = u.queue;
      if (xp(VE.bind(null, i, y, e), [e]), y.getSnapshot !== t || v || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      or !== null && or.memoizedState.tag & ir) {
        i.flags |= sn, Tp(ir | Nr, jE.bind(null, i, y, s, t), void 0, null);
        var g = Dm();
        if (g === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Ss(g, Bs) || HE(i, t, s);
      }
      return s;
    }
    function HE(e, t, a) {
      e.flags |= cs;
      var i = {
        getSnapshot: t,
        value: a
      }, u = Wt.updateQueue;
      if (u === null)
        u = FE(), Wt.updateQueue = u, u.stores = [i];
      else {
        var s = u.stores;
        s === null ? u.stores = [i] : s.push(i);
      }
    }
    function jE(e, t, a, i) {
      t.value = a, t.getSnapshot = i, PE(t) && BE(e);
    }
    function VE(e, t, a) {
      var i = function() {
        PE(t) && BE(e);
      };
      return a(i);
    }
    function PE(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var i = t();
        return !Se(a, i);
      } catch {
        return !0;
      }
    }
    function BE(e) {
      var t = Pa(e, Ae);
      t !== null && dr(t, e, Ae, Zt);
    }
    function em(e) {
      var t = Bl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: V,
        dispatch: null,
        lastRenderedReducer: Bg,
        lastRenderedState: e
      };
      t.queue = a;
      var i = a.dispatch = Xw.bind(null, Wt, a);
      return [t.memoizedState, i];
    }
    function Wg(e) {
      return Yg(Bg);
    }
    function Gg(e) {
      return Ig(Bg);
    }
    function Tp(e, t, a, i) {
      var u = {
        tag: e,
        create: t,
        destroy: a,
        deps: i,
        // Circular
        next: null
      }, s = Wt.updateQueue;
      if (s === null)
        s = FE(), Wt.updateQueue = s, s.lastEffect = u.next = u;
      else {
        var f = s.lastEffect;
        if (f === null)
          s.lastEffect = u.next = u;
        else {
          var p = f.next;
          f.next = u, u.next = p, s.lastEffect = u;
        }
      }
      return u;
    }
    function qg(e) {
      var t = Bl();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function tm(e) {
      var t = bi();
      return t.memoizedState;
    }
    function wp(e, t, a, i) {
      var u = Bl(), s = i === void 0 ? null : i;
      Wt.flags |= e, u.memoizedState = Tp(ir | t, a, void 0, s);
    }
    function nm(e, t, a, i) {
      var u = bi(), s = i === void 0 ? null : i, f = void 0;
      if (ur !== null) {
        var p = ur.memoizedState;
        if (f = p.destroy, s !== null) {
          var v = p.deps;
          if (Pg(s, v)) {
            u.memoizedState = Tp(t, a, f, s);
            return;
          }
        }
      }
      Wt.flags |= e, u.memoizedState = Tp(ir | t, a, f, s);
    }
    function rm(e, t) {
      return (Wt.mode & za) !== Me ? wp(lu | sn | wl, Nr, e, t) : wp(sn | wl, Nr, e, t);
    }
    function xp(e, t) {
      return nm(sn, Nr, e, t);
    }
    function Xg(e, t) {
      return wp(Ke, Pl, e, t);
    }
    function am(e, t) {
      return nm(Ke, Pl, e, t);
    }
    function Kg(e, t) {
      var a = Ke;
      return a |= Kr, (Wt.mode & za) !== Me && (a |= Zr), wp(a, lr, e, t);
    }
    function im(e, t) {
      return nm(Ke, lr, e, t);
    }
    function $E(e, t) {
      if (typeof t == "function") {
        var a = t, i = e();
        return a(i), function() {
          a(null);
        };
      } else if (t != null) {
        var u = t;
        u.hasOwnProperty("current") || S("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(u).join(", ") + "}");
        var s = e();
        return u.current = s, function() {
          u.current = null;
        };
      }
    }
    function Zg(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null, u = Ke;
      return u |= Kr, (Wt.mode & za) !== Me && (u |= Zr), wp(u, lr, $E.bind(null, t, e), i);
    }
    function lm(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var i = a != null ? a.concat([e]) : null;
      return nm(Ke, lr, $E.bind(null, t, e), i);
    }
    function Qw(e, t) {
    }
    var um = Qw;
    function Jg(e, t) {
      var a = Bl(), i = t === void 0 ? null : t;
      return a.memoizedState = [e, i], e;
    }
    function om(e, t) {
      var a = bi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Pg(i, s))
          return u[0];
      }
      return a.memoizedState = [e, i], e;
    }
    function eS(e, t) {
      var a = Bl(), i = t === void 0 ? null : t, u = e();
      return a.memoizedState = [u, i], u;
    }
    function sm(e, t) {
      var a = bi(), i = t === void 0 ? null : t, u = a.memoizedState;
      if (u !== null && i !== null) {
        var s = u[1];
        if (Pg(i, s))
          return u[0];
      }
      var f = e();
      return a.memoizedState = [f, i], f;
    }
    function tS(e) {
      var t = Bl();
      return t.memoizedState = e, e;
    }
    function YE(e) {
      var t = bi(), a = ur, i = a.memoizedState;
      return QE(t, i, e);
    }
    function IE(e) {
      var t = bi();
      if (ur === null)
        return t.memoizedState = e, e;
      var a = ur.memoizedState;
      return QE(t, a, e);
    }
    function QE(e, t, a) {
      var i = !uy(Bs);
      if (i) {
        if (!Se(a, t)) {
          var u = bd();
          Wt.lanes = Ze(Wt.lanes, u), Pp(u), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Dp()), e.memoizedState = a, a;
    }
    function Ww(e, t, a) {
      var i = Aa();
      Vn(Sr(i, ar)), e(!0);
      var u = Ep.transition;
      Ep.transition = {};
      var s = Ep.transition;
      Ep.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (Vn(i), Ep.transition = u, u === null && s._updatedFibers) {
          var f = s._updatedFibers.size;
          f > 10 && Je("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), s._updatedFibers.clear();
        }
      }
    }
    function nS() {
      var e = em(!1), t = e[0], a = e[1], i = Ww.bind(null, a), u = Bl();
      return u.memoizedState = i, [t, i];
    }
    function WE() {
      var e = Wg(), t = e[0], a = bi(), i = a.memoizedState;
      return [t, i];
    }
    function GE() {
      var e = Gg(), t = e[0], a = bi(), i = a.memoizedState;
      return [t, i];
    }
    var qE = !1;
    function Gw() {
      return qE;
    }
    function rS() {
      var e = Bl(), t = Dm(), a = t.identifierPrefix, i;
      if (Mr()) {
        var u = ow();
        i = ":" + a + "R" + u;
        var s = Rp++;
        s > 0 && (i += "H" + s.toString(32)), i += ":";
      } else {
        var f = $w++;
        i = ":" + a + "r" + f.toString(32) + ":";
      }
      return e.memoizedState = i, i;
    }
    function cm() {
      var e = bi(), t = e.memoizedState;
      return t;
    }
    function qw(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $o(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (XE(e))
        KE(t, u);
      else {
        var s = vE(e, t, u, i);
        if (s !== null) {
          var f = Ra();
          dr(s, e, i, f), ZE(s, t, i);
        }
      }
      JE(e, i);
    }
    function Xw(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var i = $o(e), u = {
        lane: i,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (XE(e))
        KE(t, u);
      else {
        var s = e.alternate;
        if (e.lanes === V && (s === null || s.lanes === V)) {
          var f = t.lastRenderedReducer;
          if (f !== null) {
            var p;
            p = se.current, se.current = Ji;
            try {
              var v = t.lastRenderedState, y = f(v, a);
              if (u.hasEagerState = !0, u.eagerState = y, Se(y, v)) {
                kw(e, t, u, i);
                return;
              }
            } catch {
            } finally {
              se.current = p;
            }
          }
        }
        var g = vE(e, t, u, i);
        if (g !== null) {
          var _ = Ra();
          dr(g, e, i, _), ZE(g, t, i);
        }
      }
      JE(e, i);
    }
    function XE(e) {
      var t = e.alternate;
      return e === Wt || t !== null && t === Wt;
    }
    function KE(e, t) {
      Cp = Zh = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function ZE(e, t, a) {
      if (xd(a)) {
        var i = t.lanes;
        i = _d(i, e.pendingLanes);
        var u = Ze(i, a);
        t.lanes = u, ho(e, u);
      }
    }
    function JE(e, t, a) {
      Ol(e, t);
    }
    var fm = {
      readContext: Jn,
      useCallback: la,
      useContext: la,
      useEffect: la,
      useImperativeHandle: la,
      useInsertionEffect: la,
      useLayoutEffect: la,
      useMemo: la,
      useReducer: la,
      useRef: la,
      useState: la,
      useDebugValue: la,
      useDeferredValue: la,
      useTransition: la,
      useMutableSource: la,
      useSyncExternalStore: la,
      useId: la,
      unstable_isNewReconciler: Z
    }, eC = null, tC = null, nC = null, rC = null, $l = null, Ji = null, dm = null;
    {
      var aS = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, Ie = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      eC = {
        readContext: function(e) {
          return Jn(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", Pt(), xf(t), Jg(e, t);
        },
        useContext: function(e) {
          return P = "useContext", Pt(), Jn(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", Pt(), xf(t), rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", Pt(), xf(a), Zg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", Pt(), xf(t), Xg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", Pt(), xf(t), Kg(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", Pt(), xf(t);
          var a = se.current;
          se.current = $l;
          try {
            return eS(e, t);
          } finally {
            se.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", Pt();
          var i = se.current;
          se.current = $l;
          try {
            return $g(e, t, a);
          } finally {
            se.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", Pt(), qg(e);
        },
        useState: function(e) {
          P = "useState", Pt();
          var t = se.current;
          se.current = $l;
          try {
            return em(e);
          } finally {
            se.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", Pt(), void 0;
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", Pt(), tS(e);
        },
        useTransition: function() {
          return P = "useTransition", Pt(), nS();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", Pt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", Pt(), Qg(e, t, a);
        },
        useId: function() {
          return P = "useId", Pt(), rS();
        },
        unstable_isNewReconciler: Z
      }, tC = {
        readContext: function(e) {
          return Jn(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", ne(), Jg(e, t);
        },
        useContext: function(e) {
          return P = "useContext", ne(), Jn(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", ne(), rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", ne(), Zg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", ne(), Xg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", ne(), Kg(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", ne();
          var a = se.current;
          se.current = $l;
          try {
            return eS(e, t);
          } finally {
            se.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", ne();
          var i = se.current;
          se.current = $l;
          try {
            return $g(e, t, a);
          } finally {
            se.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", ne(), qg(e);
        },
        useState: function(e) {
          P = "useState", ne();
          var t = se.current;
          se.current = $l;
          try {
            return em(e);
          } finally {
            se.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", ne(), void 0;
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", ne(), tS(e);
        },
        useTransition: function() {
          return P = "useTransition", ne(), nS();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", ne(), Qg(e, t, a);
        },
        useId: function() {
          return P = "useId", ne(), rS();
        },
        unstable_isNewReconciler: Z
      }, nC = {
        readContext: function(e) {
          return Jn(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", ne(), om(e, t);
        },
        useContext: function(e) {
          return P = "useContext", ne(), Jn(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", ne(), xp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", ne(), lm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", ne(), am(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", ne(), im(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", ne();
          var a = se.current;
          se.current = Ji;
          try {
            return sm(e, t);
          } finally {
            se.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", ne();
          var i = se.current;
          se.current = Ji;
          try {
            return Yg(e, t, a);
          } finally {
            se.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", ne(), tm();
        },
        useState: function(e) {
          P = "useState", ne();
          var t = se.current;
          se.current = Ji;
          try {
            return Wg(e);
          } finally {
            se.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", ne(), um();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", ne(), YE(e);
        },
        useTransition: function() {
          return P = "useTransition", ne(), WE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", ne(), Jh(e, t);
        },
        useId: function() {
          return P = "useId", ne(), cm();
        },
        unstable_isNewReconciler: Z
      }, rC = {
        readContext: function(e) {
          return Jn(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", ne(), om(e, t);
        },
        useContext: function(e) {
          return P = "useContext", ne(), Jn(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", ne(), xp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", ne(), lm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", ne(), am(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", ne(), im(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", ne();
          var a = se.current;
          se.current = dm;
          try {
            return sm(e, t);
          } finally {
            se.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", ne();
          var i = se.current;
          se.current = dm;
          try {
            return Ig(e, t, a);
          } finally {
            se.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", ne(), tm();
        },
        useState: function(e) {
          P = "useState", ne();
          var t = se.current;
          se.current = dm;
          try {
            return Gg(e);
          } finally {
            se.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", ne(), um();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", ne(), IE(e);
        },
        useTransition: function() {
          return P = "useTransition", ne(), GE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", ne(), Jh(e, t);
        },
        useId: function() {
          return P = "useId", ne(), cm();
        },
        unstable_isNewReconciler: Z
      }, $l = {
        readContext: function(e) {
          return aS(), Jn(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", Ie(), Pt(), Jg(e, t);
        },
        useContext: function(e) {
          return P = "useContext", Ie(), Pt(), Jn(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", Ie(), Pt(), rm(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", Ie(), Pt(), Zg(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", Ie(), Pt(), Xg(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", Ie(), Pt(), Kg(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", Ie(), Pt();
          var a = se.current;
          se.current = $l;
          try {
            return eS(e, t);
          } finally {
            se.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", Ie(), Pt();
          var i = se.current;
          se.current = $l;
          try {
            return $g(e, t, a);
          } finally {
            se.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", Ie(), Pt(), qg(e);
        },
        useState: function(e) {
          P = "useState", Ie(), Pt();
          var t = se.current;
          se.current = $l;
          try {
            return em(e);
          } finally {
            se.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", Ie(), Pt(), void 0;
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", Ie(), Pt(), tS(e);
        },
        useTransition: function() {
          return P = "useTransition", Ie(), Pt(), nS();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", Ie(), Pt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", Ie(), Pt(), Qg(e, t, a);
        },
        useId: function() {
          return P = "useId", Ie(), Pt(), rS();
        },
        unstable_isNewReconciler: Z
      }, Ji = {
        readContext: function(e) {
          return aS(), Jn(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", Ie(), ne(), om(e, t);
        },
        useContext: function(e) {
          return P = "useContext", Ie(), ne(), Jn(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", Ie(), ne(), xp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", Ie(), ne(), lm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", Ie(), ne(), am(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", Ie(), ne(), im(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", Ie(), ne();
          var a = se.current;
          se.current = Ji;
          try {
            return sm(e, t);
          } finally {
            se.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", Ie(), ne();
          var i = se.current;
          se.current = Ji;
          try {
            return Yg(e, t, a);
          } finally {
            se.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", Ie(), ne(), tm();
        },
        useState: function(e) {
          P = "useState", Ie(), ne();
          var t = se.current;
          se.current = Ji;
          try {
            return Wg(e);
          } finally {
            se.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", Ie(), ne(), um();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", Ie(), ne(), YE(e);
        },
        useTransition: function() {
          return P = "useTransition", Ie(), ne(), WE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", Ie(), ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", Ie(), ne(), Jh(e, t);
        },
        useId: function() {
          return P = "useId", Ie(), ne(), cm();
        },
        unstable_isNewReconciler: Z
      }, dm = {
        readContext: function(e) {
          return aS(), Jn(e);
        },
        useCallback: function(e, t) {
          return P = "useCallback", Ie(), ne(), om(e, t);
        },
        useContext: function(e) {
          return P = "useContext", Ie(), ne(), Jn(e);
        },
        useEffect: function(e, t) {
          return P = "useEffect", Ie(), ne(), xp(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return P = "useImperativeHandle", Ie(), ne(), lm(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return P = "useInsertionEffect", Ie(), ne(), am(e, t);
        },
        useLayoutEffect: function(e, t) {
          return P = "useLayoutEffect", Ie(), ne(), im(e, t);
        },
        useMemo: function(e, t) {
          P = "useMemo", Ie(), ne();
          var a = se.current;
          se.current = Ji;
          try {
            return sm(e, t);
          } finally {
            se.current = a;
          }
        },
        useReducer: function(e, t, a) {
          P = "useReducer", Ie(), ne();
          var i = se.current;
          se.current = Ji;
          try {
            return Ig(e, t, a);
          } finally {
            se.current = i;
          }
        },
        useRef: function(e) {
          return P = "useRef", Ie(), ne(), tm();
        },
        useState: function(e) {
          P = "useState", Ie(), ne();
          var t = se.current;
          se.current = Ji;
          try {
            return Gg(e);
          } finally {
            se.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return P = "useDebugValue", Ie(), ne(), um();
        },
        useDeferredValue: function(e) {
          return P = "useDeferredValue", Ie(), ne(), IE(e);
        },
        useTransition: function() {
          return P = "useTransition", Ie(), ne(), GE();
        },
        useMutableSource: function(e, t, a) {
          return P = "useMutableSource", Ie(), ne(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return P = "useSyncExternalStore", Ie(), ne(), Jh(e, t);
        },
        useId: function() {
          return P = "useId", Ie(), ne(), cm();
        },
        unstable_isNewReconciler: Z
      };
    }
    var jo = W.unstable_now, aC = 0, pm = -1, bp = -1, vm = -1, iS = !1, hm = !1;
    function iC() {
      return iS;
    }
    function Kw() {
      hm = !0;
    }
    function Zw() {
      iS = !1, hm = !1;
    }
    function Jw() {
      iS = hm, hm = !1;
    }
    function lC() {
      return aC;
    }
    function uC() {
      aC = jo();
    }
    function lS(e) {
      bp = jo(), e.actualStartTime < 0 && (e.actualStartTime = jo());
    }
    function oC(e) {
      bp = -1;
    }
    function mm(e, t) {
      if (bp >= 0) {
        var a = jo() - bp;
        e.actualDuration += a, t && (e.selfBaseDuration = a), bp = -1;
      }
    }
    function Yl(e) {
      if (pm >= 0) {
        var t = jo() - pm;
        pm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case re:
              var i = a.stateNode;
              i.effectDuration += t;
              return;
            case ct:
              var u = a.stateNode;
              u.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function uS(e) {
      if (vm >= 0) {
        var t = jo() - vm;
        vm = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case re:
              var i = a.stateNode;
              i !== null && (i.passiveEffectDuration += t);
              return;
            case ct:
              var u = a.stateNode;
              u !== null && (u.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function Il() {
      pm = jo();
    }
    function oS() {
      vm = jo();
    }
    function sS(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function $s(e, t) {
      return {
        value: e,
        source: t,
        stack: Iu(t),
        digest: null
      };
    }
    function cS(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function ex(e, t) {
      return !0;
    }
    function fS(e, t) {
      try {
        var a = ex(e, t);
        if (a === !1)
          return;
        var i = t.value, u = t.source, s = t.stack, f = s !== null ? s : "";
        if (i != null && i._suppressLogging) {
          if (e.tag === pe)
            return;
          console.error(i);
        }
        var p = u ? Ye(u) : null, v = p ? "The above error occurred in the <" + p + "> component:" : "The above error occurred in one of your React components:", y;
        if (e.tag === re)
          y = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var g = Ye(e) || "Anonymous";
          y = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + g + ".");
        }
        var _ = v + `
` + f + `

` + ("" + y);
        console.error(_);
      } catch (x) {
        setTimeout(function() {
          throw x;
        });
      }
    }
    var tx = typeof WeakMap == "function" ? WeakMap : Map;
    function sC(e, t, a) {
      var i = Mu(Zt, a);
      i.tag = fg, i.payload = {
        element: null
      };
      var u = t.value;
      return i.callback = function() {
        Wb(u), fS(e, t);
      }, i;
    }
    function dS(e, t, a) {
      var i = Mu(Zt, a);
      i.tag = fg;
      var u = e.type.getDerivedStateFromError;
      if (typeof u == "function") {
        var s = t.value;
        i.payload = function() {
          return u(s);
        }, i.callback = function() {
          E1(e), fS(e, t);
        };
      }
      var f = e.stateNode;
      return f !== null && typeof f.componentDidCatch == "function" && (i.callback = function() {
        E1(e), fS(e, t), typeof u != "function" && Ib(this);
        var v = t.value, y = t.stack;
        this.componentDidCatch(v, {
          componentStack: y !== null ? y : ""
        }), typeof u != "function" && (ra(e.lanes, Ae) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", Ye(e) || "Unknown"));
      }), i;
    }
    function cC(e, t, a) {
      var i = e.pingCache, u;
      if (i === null ? (i = e.pingCache = new tx(), u = /* @__PURE__ */ new Set(), i.set(t, u)) : (u = i.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), i.set(t, u))), !u.has(a)) {
        u.add(a);
        var s = Gb.bind(null, e, t, a);
        rr && Bp(e, a), t.then(s, s);
      }
    }
    function nx(e, t, a, i) {
      var u = e.updateQueue;
      if (u === null) {
        var s = /* @__PURE__ */ new Set();
        s.add(a), e.updateQueue = s;
      } else
        u.add(a);
    }
    function rx(e, t) {
      var a = e.tag;
      if ((e.mode & ot) === Me && (a === he || a === Qe || a === He)) {
        var i = e.alternate;
        i ? (e.updateQueue = i.updateQueue, e.memoizedState = i.memoizedState, e.lanes = i.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function fC(e) {
      var t = e;
      do {
        if (t.tag === be && Pw(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function dC(e, t, a, i, u) {
      if ((e.mode & ot) === Me) {
        if (e === t)
          e.flags |= Gn;
        else {
          if (e.flags |= Pe, a.flags |= fs, a.flags &= ~(fc | va), a.tag === pe) {
            var s = a.alternate;
            if (s === null)
              a.tag = xn;
            else {
              var f = Mu(Zt, Ae);
              f.tag = Vh, Uo(a, f, Ae);
            }
          }
          a.lanes = Ze(a.lanes, Ae);
        }
        return e;
      }
      return e.flags |= Gn, e.lanes = u, e;
    }
    function ax(e, t, a, i, u) {
      if (a.flags |= va, rr && Bp(e, u), i !== null && typeof i == "object" && typeof i.then == "function") {
        var s = i;
        rx(a), Mr() && a.mode & ot && nE();
        var f = fC(t);
        if (f !== null) {
          f.flags &= ~Rn, dC(f, t, a, e, u), f.mode & ot && cC(e, s, u), nx(f, e, s);
          return;
        } else {
          if (!po(u)) {
            cC(e, s, u), IS();
            return;
          }
          var p = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          i = p;
        }
      } else if (Mr() && a.mode & ot) {
        nE();
        var v = fC(t);
        if (v !== null) {
          (v.flags & Gn) === ke && (v.flags |= Rn), dC(v, t, a, e, u), ag($s(i, a));
          return;
        }
      }
      i = $s(i, a), Fb(i);
      var y = t;
      do {
        switch (y.tag) {
          case re: {
            var g = i;
            y.flags |= Gn;
            var _ = jn(u);
            y.lanes = Ze(y.lanes, _);
            var x = sC(y, g, _);
            vg(y, x);
            return;
          }
          case pe:
            var M = i, U = y.type, H = y.stateNode;
            if ((y.flags & Pe) === ke && (typeof U.getDerivedStateFromError == "function" || H !== null && typeof H.componentDidCatch == "function" && !f1(H))) {
              y.flags |= Gn;
              var fe = jn(u);
              y.lanes = Ze(y.lanes, fe);
              var Oe = dS(y, M, fe);
              vg(y, Oe);
              return;
            }
            break;
        }
        y = y.return;
      } while (y !== null);
    }
    function ix() {
      return null;
    }
    var _p = N.ReactCurrentOwner, el = !1, pS, kp, vS, hS, mS, Ys, yS, ym;
    pS = {}, kp = {}, vS = {}, hS = {}, mS = {}, Ys = !1, yS = {}, ym = {};
    function Ea(e, t, a, i) {
      e === null ? t.child = OE(t, null, a, i) : t.child = Ef(t, e.child, a, i);
    }
    function lx(e, t, a, i) {
      t.child = Ef(t, e.child, null, i), t.child = Ef(t, null, a, i);
    }
    function pC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && Gi(
          s,
          i,
          // Resolved props
          "prop",
          wt(a)
        );
      }
      var f = a.render, p = t.ref, v, y;
      Sf(t, u), Dl(t);
      {
        if (_p.current = t, Gr(!0), v = bf(e, t, f, i, p, u), y = _f(), t.mode & yn) {
          Hn(!0);
          try {
            v = bf(e, t, f, i, p, u), y = _f();
          } finally {
            Hn(!1);
          }
        }
        Gr(!1);
      }
      return uu(), e !== null && !el ? (UE(e, t, u), Nu(e, t, u)) : (Mr() && y && Zy(t), t.flags |= Rl, Ea(e, t, v, u), t.child);
    }
    function vC(e, t, a, i, u) {
      if (e === null) {
        var s = a.type;
        if (f_(s) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var f = s;
          return f = Uf(s), t.tag = He, t.type = f, ES(t, s), hC(e, t, f, i, u);
        }
        {
          var p = s.propTypes;
          p && Gi(
            p,
            i,
            // Resolved props
            "prop",
            wt(s)
          );
        }
        var v = n0(a.type, null, i, t, t.mode, u);
        return v.ref = t.ref, v.return = t, t.child = v, v;
      }
      {
        var y = a.type, g = y.propTypes;
        g && Gi(
          g,
          i,
          // Resolved props
          "prop",
          wt(y)
        );
      }
      var _ = e.child, x = bS(e, u);
      if (!x) {
        var M = _.memoizedProps, U = a.compare;
        if (U = U !== null ? U : _e, U(M, i) && e.ref === t.ref)
          return Nu(e, t, u);
      }
      t.flags |= Rl;
      var H = qs(_, i);
      return H.ref = t.ref, H.return = t, t.child = H, H;
    }
    function hC(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = t.elementType;
        if (s.$$typeof === De) {
          var f = s, p = f._payload, v = f._init;
          try {
            s = v(p);
          } catch {
            s = null;
          }
          var y = s && s.propTypes;
          y && Gi(
            y,
            i,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            wt(s)
          );
        }
      }
      if (e !== null) {
        var g = e.memoizedProps;
        if (_e(g, i) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (el = !1, t.pendingProps = i = g, bS(e, u))
            (e.flags & fs) !== ke && (el = !0);
          else
            return t.lanes = e.lanes, Nu(e, t, u);
      }
      return gS(e, t, a, i, u);
    }
    function mC(e, t, a) {
      var i = t.pendingProps, u = i.children, s = e !== null ? e.memoizedState : null;
      if (i.mode === "hidden" || T)
        if ((t.mode & ot) === Me) {
          var f = {
            baseLanes: V,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = f, Om(t, a);
        } else if (ra(a, na)) {
          var _ = {
            baseLanes: V,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = _;
          var x = s !== null ? s.baseLanes : a;
          Om(t, x);
        } else {
          var p = null, v;
          if (s !== null) {
            var y = s.baseLanes;
            v = Ze(y, a);
          } else
            v = a;
          t.lanes = t.childLanes = na;
          var g = {
            baseLanes: v,
            cachePool: p,
            transitions: null
          };
          return t.memoizedState = g, t.updateQueue = null, Om(t, v), null;
        }
      else {
        var M;
        s !== null ? (M = Ze(s.baseLanes, a), t.memoizedState = null) : M = a, Om(t, M);
      }
      return Ea(e, t, u, a), t.child;
    }
    function ux(e, t, a) {
      var i = t.pendingProps;
      return Ea(e, t, i, a), t.child;
    }
    function ox(e, t, a) {
      var i = t.pendingProps.children;
      return Ea(e, t, i, a), t.child;
    }
    function sx(e, t, a) {
      {
        t.flags |= Ke;
        {
          var i = t.stateNode;
          i.effectDuration = 0, i.passiveEffectDuration = 0;
        }
      }
      var u = t.pendingProps, s = u.children;
      return Ea(e, t, s, a), t.child;
    }
    function yC(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Xr, t.flags |= cd);
    }
    function gS(e, t, a, i, u) {
      if (t.type !== t.elementType) {
        var s = a.propTypes;
        s && Gi(
          s,
          i,
          // Resolved props
          "prop",
          wt(a)
        );
      }
      var f;
      {
        var p = pf(t, a, !0);
        f = vf(t, p);
      }
      var v, y;
      Sf(t, u), Dl(t);
      {
        if (_p.current = t, Gr(!0), v = bf(e, t, a, i, f, u), y = _f(), t.mode & yn) {
          Hn(!0);
          try {
            v = bf(e, t, a, i, f, u), y = _f();
          } finally {
            Hn(!1);
          }
        }
        Gr(!1);
      }
      return uu(), e !== null && !el ? (UE(e, t, u), Nu(e, t, u)) : (Mr() && y && Zy(t), t.flags |= Rl, Ea(e, t, v, u), t.child);
    }
    function gC(e, t, a, i, u) {
      {
        switch (b_(t)) {
          case !1: {
            var s = t.stateNode, f = t.type, p = new f(t.memoizedProps, s.context), v = p.state;
            s.updater.enqueueSetState(s, v, null);
            break;
          }
          case !0: {
            t.flags |= Pe, t.flags |= Gn;
            var y = new Error("Simulated error coming from DevTools"), g = jn(u);
            t.lanes = Ze(t.lanes, g);
            var _ = dS(t, $s(y, t), g);
            vg(t, _);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var x = a.propTypes;
          x && Gi(
            x,
            i,
            // Resolved props
            "prop",
            wt(a)
          );
        }
      }
      var M;
      Vl(a) ? (M = !0, Dh(t)) : M = !1, Sf(t, u);
      var U = t.stateNode, H;
      U === null ? (Sm(e, t), xE(t, a, i), bg(t, a, i, u), H = !0) : e === null ? H = Uw(t, a, i, u) : H = Aw(e, t, a, i, u);
      var fe = SS(e, t, a, H, M, u);
      {
        var Oe = t.stateNode;
        H && Oe.props !== i && (Ys || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", Ye(t) || "a component"), Ys = !0);
      }
      return fe;
    }
    function SS(e, t, a, i, u, s) {
      yC(e, t);
      var f = (t.flags & Pe) !== ke;
      if (!i && !f)
        return u && Z0(t, a, !1), Nu(e, t, s);
      var p = t.stateNode;
      _p.current = t;
      var v;
      if (f && typeof a.getDerivedStateFromError != "function")
        v = null, oC();
      else {
        Dl(t);
        {
          if (Gr(!0), v = p.render(), t.mode & yn) {
            Hn(!0);
            try {
              p.render();
            } finally {
              Hn(!1);
            }
          }
          Gr(!1);
        }
        uu();
      }
      return t.flags |= Rl, e !== null && f ? lx(e, t, v, s) : Ea(e, t, v, s), t.memoizedState = p.state, u && Z0(t, a, !0), t.child;
    }
    function SC(e) {
      var t = e.stateNode;
      t.pendingContext ? X0(e, t.pendingContext, t.pendingContext !== t.context) : t.context && X0(e, t.context, !1), Mg(e, t.containerInfo);
    }
    function cx(e, t, a) {
      if (SC(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var i = t.pendingProps, u = t.memoizedState, s = u.element;
      yE(e, t), Yh(t, i, null, a);
      var f = t.memoizedState;
      t.stateNode;
      var p = f.element;
      if (u.isDehydrated) {
        var v = {
          element: p,
          isDehydrated: !1,
          cache: f.cache,
          pendingSuspenseBoundaries: f.pendingSuspenseBoundaries,
          transitions: f.transitions
        }, y = t.updateQueue;
        if (y.baseState = v, t.memoizedState = v, t.flags & Rn) {
          var g = $s(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return EC(e, t, p, a, g);
        } else if (p !== s) {
          var _ = $s(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return EC(e, t, p, a, _);
        } else {
          vw(t);
          var x = OE(t, null, p, a);
          t.child = x;
          for (var M = x; M; )
            M.flags = M.flags & ~rn | La, M = M.sibling;
        }
      } else {
        if (yf(), p === s)
          return Nu(e, t, a);
        Ea(e, t, p, a);
      }
      return t.child;
    }
    function EC(e, t, a, i, u) {
      return yf(), ag(u), t.flags |= Rn, Ea(e, t, a, i), t.child;
    }
    function fx(e, t, a) {
      ME(t), e === null && rg(t);
      var i = t.type, u = t.pendingProps, s = e !== null ? e.memoizedProps : null, f = u.children, p = Hy(i, u);
      return p ? f = null : s !== null && Hy(i, s) && (t.flags |= Vt), yC(e, t), Ea(e, t, f, a), t.child;
    }
    function dx(e, t) {
      return e === null && rg(t), null;
    }
    function px(e, t, a, i) {
      Sm(e, t);
      var u = t.pendingProps, s = a, f = s._payload, p = s._init, v = p(f);
      t.type = v;
      var y = t.tag = d_(v), g = Ki(v, u), _;
      switch (y) {
        case he:
          return ES(t, v), t.type = v = Uf(v), _ = gS(null, t, v, g, i), _;
        case pe:
          return t.type = v = XS(v), _ = gC(null, t, v, g, i), _;
        case Qe:
          return t.type = v = KS(v), _ = pC(null, t, v, g, i), _;
        case it: {
          if (t.type !== t.elementType) {
            var x = v.propTypes;
            x && Gi(
              x,
              g,
              // Resolved for outer only
              "prop",
              wt(v)
            );
          }
          return _ = vC(
            null,
            t,
            v,
            Ki(v.type, g),
            // The inner type can have defaults too
            i
          ), _;
        }
      }
      var M = "";
      throw v !== null && typeof v == "object" && v.$$typeof === De && (M = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + v + ". " + ("Lazy element type must resolve to a class or function." + M));
    }
    function vx(e, t, a, i, u) {
      Sm(e, t), t.tag = pe;
      var s;
      return Vl(a) ? (s = !0, Dh(t)) : s = !1, Sf(t, u), xE(t, a, i), bg(t, a, i, u), SS(null, t, a, !0, s, u);
    }
    function hx(e, t, a, i) {
      Sm(e, t);
      var u = t.pendingProps, s;
      {
        var f = pf(t, a, !1);
        s = vf(t, f);
      }
      Sf(t, i);
      var p, v;
      Dl(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var y = wt(a) || "Unknown";
          pS[y] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", y, y), pS[y] = !0);
        }
        t.mode & yn && Xi.recordLegacyContextWarning(t, null), Gr(!0), _p.current = t, p = bf(null, t, a, u, s, i), v = _f(), Gr(!1);
      }
      if (uu(), t.flags |= Rl, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0) {
        var g = wt(a) || "Unknown";
        kp[g] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", g, g, g), kp[g] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0
      ) {
        {
          var _ = wt(a) || "Unknown";
          kp[_] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", _, _, _), kp[_] = !0);
        }
        t.tag = pe, t.memoizedState = null, t.updateQueue = null;
        var x = !1;
        return Vl(a) ? (x = !0, Dh(t)) : x = !1, t.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, pg(t), wE(t, p), bg(t, a, u, i), SS(null, t, a, !0, x, i);
      } else {
        if (t.tag = he, t.mode & yn) {
          Hn(!0);
          try {
            p = bf(null, t, a, u, s, i), v = _f();
          } finally {
            Hn(!1);
          }
        }
        return Mr() && v && Zy(t), Ea(null, t, p, i), ES(t, a), t.child;
      }
    }
    function ES(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", i = Dr();
          i && (a += `

Check the render method of \`` + i + "`.");
          var u = i || "", s = e._debugSource;
          s && (u = s.fileName + ":" + s.lineNumber), mS[u] || (mS[u] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var f = wt(t) || "Unknown";
          hS[f] || (S("%s: Function components do not support getDerivedStateFromProps.", f), hS[f] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var p = wt(t) || "Unknown";
          vS[p] || (S("%s: Function components do not support contextType.", p), vS[p] = !0);
        }
      }
    }
    var CS = {
      dehydrated: null,
      treeContext: null,
      retryLane: yt
    };
    function RS(e) {
      return {
        baseLanes: e,
        cachePool: ix(),
        transitions: null
      };
    }
    function mx(e, t) {
      var a = null;
      return {
        baseLanes: Ze(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function yx(e, t, a, i) {
      if (t !== null) {
        var u = t.memoizedState;
        if (u === null)
          return !1;
      }
      return Ug(e, Sp);
    }
    function gx(e, t) {
      return vo(e.childLanes, t);
    }
    function CC(e, t, a) {
      var i = t.pendingProps;
      __(t) && (t.flags |= Pe);
      var u = Zi.current, s = !1, f = (t.flags & Pe) !== ke;
      if (f || yx(u, e) ? (s = !0, t.flags &= ~Pe) : (e === null || e.memoizedState !== null) && (u = Vw(u, zE)), u = Rf(u), Fo(t, u), e === null) {
        rg(t);
        var p = t.memoizedState;
        if (p !== null) {
          var v = p.dehydrated;
          if (v !== null)
            return Tx(t, v);
        }
        var y = i.children, g = i.fallback;
        if (s) {
          var _ = Sx(t, y, g, a), x = t.child;
          return x.memoizedState = RS(a), t.memoizedState = CS, _;
        } else
          return TS(t, y);
      } else {
        var M = e.memoizedState;
        if (M !== null) {
          var U = M.dehydrated;
          if (U !== null)
            return wx(e, t, f, i, U, M, a);
        }
        if (s) {
          var H = i.fallback, fe = i.children, Oe = Cx(e, t, fe, H, a), Te = t.child, St = e.child.memoizedState;
          return Te.memoizedState = St === null ? RS(a) : mx(St, a), Te.childLanes = gx(e, a), t.memoizedState = CS, Oe;
        } else {
          var pt = i.children, D = Ex(e, t, pt, a);
          return t.memoizedState = null, D;
        }
      }
    }
    function TS(e, t, a) {
      var i = e.mode, u = {
        mode: "visible",
        children: t
      }, s = wS(u, i);
      return s.return = e, e.child = s, s;
    }
    function Sx(e, t, a, i) {
      var u = e.mode, s = e.child, f = {
        mode: "hidden",
        children: t
      }, p, v;
      return (u & ot) === Me && s !== null ? (p = s, p.childLanes = V, p.pendingProps = f, e.mode & ze && (p.actualDuration = 0, p.actualStartTime = -1, p.selfBaseDuration = 0, p.treeBaseDuration = 0), v = Io(a, u, i, null)) : (p = wS(f, u), v = Io(a, u, i, null)), p.return = e, v.return = e, p.sibling = v, e.child = p, v;
    }
    function wS(e, t, a) {
      return R1(e, t, V, null);
    }
    function RC(e, t) {
      return qs(e, t);
    }
    function Ex(e, t, a, i) {
      var u = e.child, s = u.sibling, f = RC(u, {
        mode: "visible",
        children: a
      });
      if ((t.mode & ot) === Me && (f.lanes = i), f.return = t, f.sibling = null, s !== null) {
        var p = t.deletions;
        p === null ? (t.deletions = [s], t.flags |= Mt) : p.push(s);
      }
      return t.child = f, f;
    }
    function Cx(e, t, a, i, u) {
      var s = t.mode, f = e.child, p = f.sibling, v = {
        mode: "hidden",
        children: a
      }, y;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (s & ot) === Me && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== f
      ) {
        var g = t.child;
        y = g, y.childLanes = V, y.pendingProps = v, t.mode & ze && (y.actualDuration = 0, y.actualStartTime = -1, y.selfBaseDuration = f.selfBaseDuration, y.treeBaseDuration = f.treeBaseDuration), t.deletions = null;
      } else
        y = RC(f, v), y.subtreeFlags = f.subtreeFlags & nr;
      var _;
      return p !== null ? _ = qs(p, i) : (_ = Io(i, s, u, null), _.flags |= rn), _.return = t, y.return = t, y.sibling = _, t.child = y, _;
    }
    function gm(e, t, a, i) {
      i !== null && ag(i), Ef(t, e.child, null, a);
      var u = t.pendingProps, s = u.children, f = TS(t, s);
      return f.flags |= rn, t.memoizedState = null, f;
    }
    function Rx(e, t, a, i, u) {
      var s = t.mode, f = {
        mode: "visible",
        children: a
      }, p = wS(f, s), v = Io(i, s, u, null);
      return v.flags |= rn, p.return = t, v.return = t, p.sibling = v, t.child = p, (t.mode & ot) !== Me && Ef(t, e.child, null, u), v;
    }
    function Tx(e, t, a) {
      return (e.mode & ot) === Me ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = Ae) : By(t) ? e.lanes = cu : e.lanes = na, null;
    }
    function wx(e, t, a, i, u, s, f) {
      if (a)
        if (t.flags & Rn) {
          t.flags &= ~Rn;
          var D = cS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return gm(e, t, f, D);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Pe, null;
          var j = i.children, O = i.fallback, q = Rx(e, t, j, O, f), de = t.child;
          return de.memoizedState = RS(f), t.memoizedState = CS, q;
        }
      else {
        if (dw(), (t.mode & ot) === Me)
          return gm(
            e,
            t,
            f,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (By(u)) {
          var p, v, y;
          {
            var g = DT(u);
            p = g.digest, v = g.message, y = g.stack;
          }
          var _;
          v ? _ = new Error(v) : _ = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var x = cS(_, p, y);
          return gm(e, t, f, x);
        }
        var M = ra(f, e.childLanes);
        if (el || M) {
          var U = Dm();
          if (U !== null) {
            var H = sy(U, f);
            if (H !== yt && H !== s.retryLane) {
              s.retryLane = H;
              var fe = Zt;
              Pa(e, H), dr(U, e, H, fe);
            }
          }
          IS();
          var Oe = cS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return gm(e, t, f, Oe);
        } else if (Y0(u)) {
          t.flags |= Pe, t.child = e.child;
          var Te = qb.bind(null, e);
          return OT(u, Te), null;
        } else {
          hw(t, u, s.treeContext);
          var St = i.children, pt = TS(t, St);
          return pt.flags |= La, pt;
        }
      }
    }
    function TC(e, t, a) {
      e.lanes = Ze(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = Ze(i.lanes, t)), sg(e.return, t, a);
    }
    function xx(e, t, a) {
      for (var i = t; i !== null; ) {
        if (i.tag === be) {
          var u = i.memoizedState;
          u !== null && TC(i, a, e);
        } else if (i.tag === _t)
          TC(i, a, e);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    function bx(e) {
      for (var t = e, a = null; t !== null; ) {
        var i = t.alternate;
        i !== null && Kh(i) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function _x(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !yS[e])
        if (yS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              S('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          S('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function kx(e, t) {
      e !== void 0 && !ym[e] && (e !== "collapsed" && e !== "hidden" ? (ym[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (ym[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function wC(e, t) {
      {
        var a = vt(e), i = !a && typeof qa(e) == "function";
        if (a || i) {
          var u = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", u, t, u), !1;
        }
      }
      return !0;
    }
    function Dx(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (vt(e)) {
          for (var a = 0; a < e.length; a++)
            if (!wC(e[a], a))
              return;
        } else {
          var i = qa(e);
          if (typeof i == "function") {
            var u = i.call(e);
            if (u)
              for (var s = u.next(), f = 0; !s.done; s = u.next()) {
                if (!wC(s.value, f))
                  return;
                f++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function xS(e, t, a, i, u) {
      var s = e.memoizedState;
      s === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: i,
        tail: a,
        tailMode: u
      } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = a, s.tailMode = u);
    }
    function xC(e, t, a) {
      var i = t.pendingProps, u = i.revealOrder, s = i.tail, f = i.children;
      _x(u), kx(s, u), Dx(f, u), Ea(e, t, f, a);
      var p = Zi.current, v = Ug(p, Sp);
      if (v)
        p = Ag(p, Sp), t.flags |= Pe;
      else {
        var y = e !== null && (e.flags & Pe) !== ke;
        y && xx(t, t.child, a), p = Rf(p);
      }
      if (Fo(t, p), (t.mode & ot) === Me)
        t.memoizedState = null;
      else
        switch (u) {
          case "forwards": {
            var g = bx(t.child), _;
            g === null ? (_ = t.child, t.child = null) : (_ = g.sibling, g.sibling = null), xS(
              t,
              !1,
              // isBackwards
              _,
              g,
              s
            );
            break;
          }
          case "backwards": {
            var x = null, M = t.child;
            for (t.child = null; M !== null; ) {
              var U = M.alternate;
              if (U !== null && Kh(U) === null) {
                t.child = M;
                break;
              }
              var H = M.sibling;
              M.sibling = x, x = M, M = H;
            }
            xS(
              t,
              !0,
              // isBackwards
              x,
              null,
              // last
              s
            );
            break;
          }
          case "together": {
            xS(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function Ox(e, t, a) {
      Mg(t, t.stateNode.containerInfo);
      var i = t.pendingProps;
      return e === null ? t.child = Ef(t, null, i, a) : Ea(e, t, i, a), t.child;
    }
    var bC = !1;
    function Lx(e, t, a) {
      var i = t.type, u = i._context, s = t.pendingProps, f = t.memoizedProps, p = s.value;
      {
        "value" in s || bC || (bC = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var v = t.type.propTypes;
        v && Gi(v, s, "prop", "Context.Provider");
      }
      if (pE(t, u, p), f !== null) {
        var y = f.value;
        if (Se(y, p)) {
          if (f.children === s.children && !_h())
            return Nu(e, t, a);
        } else
          xw(t, u, a);
      }
      var g = s.children;
      return Ea(e, t, g, a), t.child;
    }
    var _C = !1;
    function Mx(e, t, a) {
      var i = t.type;
      i._context === void 0 ? i !== i.Consumer && (_C || (_C = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : i = i._context;
      var u = t.pendingProps, s = u.children;
      typeof s != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), Sf(t, a);
      var f = Jn(i);
      Dl(t);
      var p;
      return _p.current = t, Gr(!0), p = s(f), Gr(!1), uu(), t.flags |= Rl, Ea(e, t, p, a), t.child;
    }
    function Dp() {
      el = !0;
    }
    function Sm(e, t) {
      (t.mode & ot) === Me && e !== null && (e.alternate = null, t.alternate = null, t.flags |= rn);
    }
    function Nu(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), oC(), Pp(t.lanes), ra(a, t.childLanes) ? (Fw(e, t), t.child) : null;
    }
    function Nx(e, t, a) {
      {
        var i = t.return;
        if (i === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === i.child)
          i.child = a;
        else {
          var u = i.child;
          if (u === null)
            throw new Error("Expected parent to have a child.");
          for (; u.sibling !== t; )
            if (u = u.sibling, u === null)
              throw new Error("Expected to find the previous sibling.");
          u.sibling = a;
        }
        var s = i.deletions;
        return s === null ? (i.deletions = [e], i.flags |= Mt) : s.push(e), a.flags |= rn, a;
      }
    }
    function bS(e, t) {
      var a = e.lanes;
      return !!ra(a, t);
    }
    function zx(e, t, a) {
      switch (t.tag) {
        case re:
          SC(t), t.stateNode, yf();
          break;
        case ie:
          ME(t);
          break;
        case pe: {
          var i = t.type;
          Vl(i) && Dh(t);
          break;
        }
        case me:
          Mg(t, t.stateNode.containerInfo);
          break;
        case at: {
          var u = t.memoizedProps.value, s = t.type._context;
          pE(t, s, u);
          break;
        }
        case ct:
          {
            var f = ra(a, t.childLanes);
            f && (t.flags |= Ke);
            {
              var p = t.stateNode;
              p.effectDuration = 0, p.passiveEffectDuration = 0;
            }
          }
          break;
        case be: {
          var v = t.memoizedState;
          if (v !== null) {
            if (v.dehydrated !== null)
              return Fo(t, Rf(Zi.current)), t.flags |= Pe, null;
            var y = t.child, g = y.childLanes;
            if (ra(a, g))
              return CC(e, t, a);
            Fo(t, Rf(Zi.current));
            var _ = Nu(e, t, a);
            return _ !== null ? _.sibling : null;
          } else
            Fo(t, Rf(Zi.current));
          break;
        }
        case _t: {
          var x = (e.flags & Pe) !== ke, M = ra(a, t.childLanes);
          if (x) {
            if (M)
              return xC(e, t, a);
            t.flags |= Pe;
          }
          var U = t.memoizedState;
          if (U !== null && (U.rendering = null, U.tail = null, U.lastEffect = null), Fo(t, Zi.current), M)
            break;
          return null;
        }
        case Ue:
        case qe:
          return t.lanes = V, mC(e, t, a);
      }
      return Nu(e, t, a);
    }
    function kC(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return Nx(e, t, n0(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var i = e.memoizedProps, u = t.pendingProps;
        if (i !== u || _h() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          el = !0;
        else {
          var s = bS(e, a);
          if (!s && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & Pe) === ke)
            return el = !1, zx(e, t, a);
          (e.flags & fs) !== ke ? el = !0 : el = !1;
        }
      } else if (el = !1, Mr() && lw(t)) {
        var f = t.index, p = uw();
        tE(t, p, f);
      }
      switch (t.lanes = V, t.tag) {
        case rt:
          return hx(e, t, t.type, a);
        case nn: {
          var v = t.elementType;
          return px(e, t, v, a);
        }
        case he: {
          var y = t.type, g = t.pendingProps, _ = t.elementType === y ? g : Ki(y, g);
          return gS(e, t, y, _, a);
        }
        case pe: {
          var x = t.type, M = t.pendingProps, U = t.elementType === x ? M : Ki(x, M);
          return gC(e, t, x, U, a);
        }
        case re:
          return cx(e, t, a);
        case ie:
          return fx(e, t, a);
        case Ve:
          return dx(e, t);
        case be:
          return CC(e, t, a);
        case me:
          return Ox(e, t, a);
        case Qe: {
          var H = t.type, fe = t.pendingProps, Oe = t.elementType === H ? fe : Ki(H, fe);
          return pC(e, t, H, Oe, a);
        }
        case Ct:
          return ux(e, t, a);
        case st:
          return ox(e, t, a);
        case ct:
          return sx(e, t, a);
        case at:
          return Lx(e, t, a);
        case fn:
          return Mx(e, t, a);
        case it: {
          var Te = t.type, St = t.pendingProps, pt = Ki(Te, St);
          if (t.type !== t.elementType) {
            var D = Te.propTypes;
            D && Gi(
              D,
              pt,
              // Resolved for outer only
              "prop",
              wt(Te)
            );
          }
          return pt = Ki(Te.type, pt), vC(e, t, Te, pt, a);
        }
        case He:
          return hC(e, t, t.type, t.pendingProps, a);
        case xn: {
          var j = t.type, O = t.pendingProps, q = t.elementType === j ? O : Ki(j, O);
          return vx(e, t, j, q, a);
        }
        case _t:
          return xC(e, t, a);
        case En:
          break;
        case Ue:
          return mC(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function kf(e) {
      e.flags |= Ke;
    }
    function DC(e) {
      e.flags |= Xr, e.flags |= cd;
    }
    var OC, _S, LC, MC;
    OC = function(e, t, a, i) {
      for (var u = t.child; u !== null; ) {
        if (u.tag === ie || u.tag === Ve)
          rT(e, u.stateNode);
        else if (u.tag !== me) {
          if (u.child !== null) {
            u.child.return = u, u = u.child;
            continue;
          }
        }
        if (u === t)
          return;
        for (; u.sibling === null; ) {
          if (u.return === null || u.return === t)
            return;
          u = u.return;
        }
        u.sibling.return = u.return, u = u.sibling;
      }
    }, _S = function(e, t) {
    }, LC = function(e, t, a, i, u) {
      var s = e.memoizedProps;
      if (s !== i) {
        var f = t.stateNode, p = Ng(), v = iT(f, a, s, i, u, p);
        t.updateQueue = v, v && kf(t);
      }
    }, MC = function(e, t, a, i) {
      a !== i && kf(t);
    };
    function Op(e, t) {
      if (!Mr())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, i = null; a !== null; )
              a.alternate !== null && (i = a), a = a.sibling;
            i === null ? e.tail = null : i.sibling = null;
            break;
          }
          case "collapsed": {
            for (var u = e.tail, s = null; u !== null; )
              u.alternate !== null && (s = u), u = u.sibling;
            s === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : s.sibling = null;
            break;
          }
        }
    }
    function zr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = V, i = ke;
      if (t) {
        if ((e.mode & ze) !== Me) {
          for (var v = e.selfBaseDuration, y = e.child; y !== null; )
            a = Ze(a, Ze(y.lanes, y.childLanes)), i |= y.subtreeFlags & nr, i |= y.flags & nr, v += y.treeBaseDuration, y = y.sibling;
          e.treeBaseDuration = v;
        } else
          for (var g = e.child; g !== null; )
            a = Ze(a, Ze(g.lanes, g.childLanes)), i |= g.subtreeFlags & nr, i |= g.flags & nr, g.return = e, g = g.sibling;
        e.subtreeFlags |= i;
      } else {
        if ((e.mode & ze) !== Me) {
          for (var u = e.actualDuration, s = e.selfBaseDuration, f = e.child; f !== null; )
            a = Ze(a, Ze(f.lanes, f.childLanes)), i |= f.subtreeFlags, i |= f.flags, u += f.actualDuration, s += f.treeBaseDuration, f = f.sibling;
          e.actualDuration = u, e.treeBaseDuration = s;
        } else
          for (var p = e.child; p !== null; )
            a = Ze(a, Ze(p.lanes, p.childLanes)), i |= p.subtreeFlags, i |= p.flags, p.return = e, p = p.sibling;
        e.subtreeFlags |= i;
      }
      return e.childLanes = a, t;
    }
    function Ux(e, t, a) {
      if (Ew() && (t.mode & ot) !== Me && (t.flags & Pe) === ke)
        return oE(t), yf(), t.flags |= Rn | va | Gn, !1;
      var i = zh(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!i)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (gw(t), zr(t), (t.mode & ze) !== Me) {
            var u = a !== null;
            if (u) {
              var s = t.child;
              s !== null && (t.treeBaseDuration -= s.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (yf(), (t.flags & Pe) === ke && (t.memoizedState = null), t.flags |= Ke, zr(t), (t.mode & ze) !== Me) {
            var f = a !== null;
            if (f) {
              var p = t.child;
              p !== null && (t.treeBaseDuration -= p.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return sE(), !0;
    }
    function NC(e, t, a) {
      var i = t.pendingProps;
      switch (Jy(t), t.tag) {
        case rt:
        case nn:
        case He:
        case he:
        case Qe:
        case Ct:
        case st:
        case ct:
        case fn:
        case it:
          return zr(t), null;
        case pe: {
          var u = t.type;
          return Vl(u) && kh(t), zr(t), null;
        }
        case re: {
          var s = t.stateNode;
          if (Cf(t), qy(t), Hg(), s.pendingContext && (s.context = s.pendingContext, s.pendingContext = null), e === null || e.child === null) {
            var f = zh(t);
            if (f)
              kf(t);
            else if (e !== null) {
              var p = e.memoizedState;
              // Check if this is a client root
              (!p.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Rn) !== ke) && (t.flags |= Oa, sE());
            }
          }
          return _S(e, t), zr(t), null;
        }
        case ie: {
          zg(t);
          var v = LE(), y = t.type;
          if (e !== null && t.stateNode != null)
            LC(e, t, y, i, v), e.ref !== t.ref && DC(t);
          else {
            if (!i) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return zr(t), null;
            }
            var g = Ng(), _ = zh(t);
            if (_)
              mw(t, v, g) && kf(t);
            else {
              var x = nT(y, i, v, g, t);
              OC(x, t, !1, !1), t.stateNode = x, aT(x, y, i, v) && kf(t);
            }
            t.ref !== null && DC(t);
          }
          return zr(t), null;
        }
        case Ve: {
          var M = i;
          if (e && t.stateNode != null) {
            var U = e.memoizedProps;
            MC(e, t, U, M);
          } else {
            if (typeof M != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var H = LE(), fe = Ng(), Oe = zh(t);
            Oe ? yw(t) && kf(t) : t.stateNode = lT(M, H, fe, t);
          }
          return zr(t), null;
        }
        case be: {
          Tf(t);
          var Te = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var St = Ux(e, t, Te);
            if (!St)
              return t.flags & Gn ? t : null;
          }
          if ((t.flags & Pe) !== ke)
            return t.lanes = a, (t.mode & ze) !== Me && sS(t), t;
          var pt = Te !== null, D = e !== null && e.memoizedState !== null;
          if (pt !== D && pt) {
            var j = t.child;
            if (j.flags |= Tl, (t.mode & ot) !== Me) {
              var O = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !$);
              O || Ug(Zi.current, zE) ? Ab() : IS();
            }
          }
          var q = t.updateQueue;
          if (q !== null && (t.flags |= Ke), zr(t), (t.mode & ze) !== Me && pt) {
            var de = t.child;
            de !== null && (t.treeBaseDuration -= de.treeBaseDuration);
          }
          return null;
        }
        case me:
          return Cf(t), _S(e, t), e === null && JT(t.stateNode.containerInfo), zr(t), null;
        case at:
          var ue = t.type._context;
          return og(ue, t), zr(t), null;
        case xn: {
          var je = t.type;
          return Vl(je) && kh(t), zr(t), null;
        }
        case _t: {
          Tf(t);
          var We = t.memoizedState;
          if (We === null)
            return zr(t), null;
          var Gt = (t.flags & Pe) !== ke, Dt = We.rendering;
          if (Dt === null)
            if (Gt)
              Op(We, !1);
            else {
              var $n = Hb() && (e === null || (e.flags & Pe) === ke);
              if (!$n)
                for (var Ot = t.child; Ot !== null; ) {
                  var Un = Kh(Ot);
                  if (Un !== null) {
                    Gt = !0, t.flags |= Pe, Op(We, !1);
                    var ua = Un.updateQueue;
                    return ua !== null && (t.updateQueue = ua, t.flags |= Ke), t.subtreeFlags = ke, Hw(t, a), Fo(t, Ag(Zi.current, Sp)), t.child;
                  }
                  Ot = Ot.sibling;
                }
              We.tail !== null && mn() > e1() && (t.flags |= Pe, Gt = !0, Op(We, !1), t.lanes = Td);
            }
          else {
            if (!Gt) {
              var jr = Kh(Dt);
              if (jr !== null) {
                t.flags |= Pe, Gt = !0;
                var li = jr.updateQueue;
                if (li !== null && (t.updateQueue = li, t.flags |= Ke), Op(We, !0), We.tail === null && We.tailMode === "hidden" && !Dt.alternate && !Mr())
                  return zr(t), null;
              } else
                // The time it took to render last row is greater than the remaining
                // time we have to render. So rendering one more row would likely
                // exceed it.
                mn() * 2 - We.renderingStartTime > e1() && a !== na && (t.flags |= Pe, Gt = !0, Op(We, !1), t.lanes = Td);
            }
            if (We.isBackwards)
              Dt.sibling = t.child, t.child = Dt;
            else {
              var Ta = We.last;
              Ta !== null ? Ta.sibling = Dt : t.child = Dt, We.last = Dt;
            }
          }
          if (We.tail !== null) {
            var wa = We.tail;
            We.rendering = wa, We.tail = wa.sibling, We.renderingStartTime = mn(), wa.sibling = null;
            var oa = Zi.current;
            return Gt ? oa = Ag(oa, Sp) : oa = Rf(oa), Fo(t, oa), wa;
          }
          return zr(t), null;
        }
        case En:
          break;
        case Ue:
        case qe: {
          YS(t);
          var Hu = t.memoizedState, Af = Hu !== null;
          if (e !== null) {
            var Qp = e.memoizedState, Gl = Qp !== null;
            Gl !== Af && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !T && (t.flags |= Tl);
          }
          return !Af || (t.mode & ot) === Me ? zr(t) : ra(Wl, na) && (zr(t), t.subtreeFlags & (rn | Ke) && (t.flags |= Tl)), null;
        }
        case zt:
          return null;
        case Rt:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ax(e, t, a) {
      switch (Jy(t), t.tag) {
        case pe: {
          var i = t.type;
          Vl(i) && kh(t);
          var u = t.flags;
          return u & Gn ? (t.flags = u & ~Gn | Pe, (t.mode & ze) !== Me && sS(t), t) : null;
        }
        case re: {
          t.stateNode, Cf(t), qy(t), Hg();
          var s = t.flags;
          return (s & Gn) !== ke && (s & Pe) === ke ? (t.flags = s & ~Gn | Pe, t) : null;
        }
        case ie:
          return zg(t), null;
        case be: {
          Tf(t);
          var f = t.memoizedState;
          if (f !== null && f.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            yf();
          }
          var p = t.flags;
          return p & Gn ? (t.flags = p & ~Gn | Pe, (t.mode & ze) !== Me && sS(t), t) : null;
        }
        case _t:
          return Tf(t), null;
        case me:
          return Cf(t), null;
        case at:
          var v = t.type._context;
          return og(v, t), null;
        case Ue:
        case qe:
          return YS(t), null;
        case zt:
          return null;
        default:
          return null;
      }
    }
    function zC(e, t, a) {
      switch (Jy(t), t.tag) {
        case pe: {
          var i = t.type.childContextTypes;
          i != null && kh(t);
          break;
        }
        case re: {
          t.stateNode, Cf(t), qy(t), Hg();
          break;
        }
        case ie: {
          zg(t);
          break;
        }
        case me:
          Cf(t);
          break;
        case be:
          Tf(t);
          break;
        case _t:
          Tf(t);
          break;
        case at:
          var u = t.type._context;
          og(u, t);
          break;
        case Ue:
        case qe:
          YS(t);
          break;
      }
    }
    var UC = null;
    UC = /* @__PURE__ */ new Set();
    var Em = !1, Ur = !1, Fx = typeof WeakSet == "function" ? WeakSet : Set, Ee = null, Df = null, Of = null;
    function Hx(e) {
      iu(null, function() {
        throw e;
      }), od();
    }
    var jx = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & ze)
        try {
          Il(), t.componentWillUnmount();
        } finally {
          Yl(e);
        }
      else
        t.componentWillUnmount();
    };
    function AC(e, t) {
      try {
        Vo(lr, e);
      } catch (a) {
        on(e, t, a);
      }
    }
    function kS(e, t, a) {
      try {
        jx(e, a);
      } catch (i) {
        on(e, t, i);
      }
    }
    function Vx(e, t, a) {
      try {
        a.componentDidMount();
      } catch (i) {
        on(e, t, i);
      }
    }
    function FC(e, t) {
      try {
        jC(e);
      } catch (a) {
        on(e, t, a);
      }
    }
    function Lf(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var i;
          try {
            if (et && ft && e.mode & ze)
              try {
                Il(), i = a(null);
              } finally {
                Yl(e);
              }
            else
              i = a(null);
          } catch (u) {
            on(e, t, u);
          }
          typeof i == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ye(e));
        } else
          a.current = null;
    }
    function Cm(e, t, a) {
      try {
        a();
      } catch (i) {
        on(e, t, i);
      }
    }
    var HC = !1;
    function Px(e, t) {
      eT(e.containerInfo), Ee = t, Bx();
      var a = HC;
      return HC = !1, a;
    }
    function Bx() {
      for (; Ee !== null; ) {
        var e = Ee, t = e.child;
        (e.subtreeFlags & io) !== ke && t !== null ? (t.return = e, Ee = t) : $x();
      }
    }
    function $x() {
      for (; Ee !== null; ) {
        var e = Ee;
        jt(e);
        try {
          Yx(e);
        } catch (a) {
          on(e, e.return, a);
        }
        Cn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ee = t;
          return;
        }
        Ee = e.return;
      }
    }
    function Yx(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Oa) !== ke) {
        switch (jt(e), e.tag) {
          case he:
          case Qe:
          case He:
            break;
          case pe: {
            if (t !== null) {
              var i = t.memoizedProps, u = t.memoizedState, s = e.stateNode;
              e.type === e.elementType && !Ys && (s.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ye(e) || "instance"), s.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ye(e) || "instance"));
              var f = s.getSnapshotBeforeUpdate(e.elementType === e.type ? i : Ki(e.type, i), u);
              {
                var p = UC;
                f === void 0 && !p.has(e.type) && (p.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", Ye(e)));
              }
              s.__reactInternalSnapshotBeforeUpdate = f;
            }
            break;
          }
          case re: {
            {
              var v = e.stateNode;
              xT(v.containerInfo);
            }
            break;
          }
          case ie:
          case Ve:
          case me:
          case xn:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        Cn();
      }
    }
    function tl(e, t, a) {
      var i = t.updateQueue, u = i !== null ? i.lastEffect : null;
      if (u !== null) {
        var s = u.next, f = s;
        do {
          if ((f.tag & e) === e) {
            var p = f.destroy;
            f.destroy = void 0, p !== void 0 && ((e & Nr) !== Ba ? Sc(t) : (e & lr) !== Ba && Ec(t), (e & Pl) !== Ba && $p(!0), Cm(t, a, p), (e & Pl) !== Ba && $p(!1), (e & Nr) !== Ba ? Nv() : (e & lr) !== Ba && lo());
          }
          f = f.next;
        } while (f !== s);
      }
    }
    function Vo(e, t) {
      var a = t.updateQueue, i = a !== null ? a.lastEffect : null;
      if (i !== null) {
        var u = i.next, s = u;
        do {
          if ((s.tag & e) === e) {
            (e & Nr) !== Ba ? Mv(t) : (e & lr) !== Ba && zv(t);
            var f = s.create;
            (e & Pl) !== Ba && $p(!0), s.destroy = f(), (e & Pl) !== Ba && $p(!1), (e & Nr) !== Ba ? Ed() : (e & lr) !== Ba && Uv();
            {
              var p = s.destroy;
              if (p !== void 0 && typeof p != "function") {
                var v = void 0;
                (s.tag & lr) !== ke ? v = "useLayoutEffect" : (s.tag & Pl) !== ke ? v = "useInsertionEffect" : v = "useEffect";
                var y = void 0;
                p === null ? y = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof p.then == "function" ? y = `

It looks like you wrote ` + v + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + v + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : y = " You returned: " + p, S("%s must not return anything besides a function, which is used for clean-up.%s", v, y);
              }
            }
          }
          s = s.next;
        } while (s !== u);
      }
    }
    function Ix(e, t) {
      if ((t.flags & Ke) !== ke)
        switch (t.tag) {
          case ct: {
            var a = t.stateNode.passiveEffectDuration, i = t.memoizedProps, u = i.id, s = i.onPostCommit, f = lC(), p = t.alternate === null ? "mount" : "update";
            iC() && (p = "nested-update"), typeof s == "function" && s(u, p, a, f);
            var v = t.return;
            e:
              for (; v !== null; ) {
                switch (v.tag) {
                  case re:
                    var y = v.stateNode;
                    y.passiveEffectDuration += a;
                    break e;
                  case ct:
                    var g = v.stateNode;
                    g.passiveEffectDuration += a;
                    break e;
                }
                v = v.return;
              }
            break;
          }
        }
    }
    function Qx(e, t, a, i) {
      if ((a.flags & yr) !== ke)
        switch (a.tag) {
          case he:
          case Qe:
          case He: {
            if (!Ur)
              if (a.mode & ze)
                try {
                  Il(), Vo(lr | ir, a);
                } finally {
                  Yl(a);
                }
              else
                Vo(lr | ir, a);
            break;
          }
          case pe: {
            var u = a.stateNode;
            if (a.flags & Ke && !Ur)
              if (t === null)
                if (a.type === a.elementType && !Ys && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ye(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ye(a) || "instance")), a.mode & ze)
                  try {
                    Il(), u.componentDidMount();
                  } finally {
                    Yl(a);
                  }
                else
                  u.componentDidMount();
              else {
                var s = a.elementType === a.type ? t.memoizedProps : Ki(a.type, t.memoizedProps), f = t.memoizedState;
                if (a.type === a.elementType && !Ys && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ye(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ye(a) || "instance")), a.mode & ze)
                  try {
                    Il(), u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Yl(a);
                  }
                else
                  u.componentDidUpdate(s, f, u.__reactInternalSnapshotBeforeUpdate);
              }
            var p = a.updateQueue;
            p !== null && (a.type === a.elementType && !Ys && (u.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", Ye(a) || "instance"), u.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", Ye(a) || "instance")), SE(a, p, u));
            break;
          }
          case re: {
            var v = a.updateQueue;
            if (v !== null) {
              var y = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case ie:
                    y = a.child.stateNode;
                    break;
                  case pe:
                    y = a.child.stateNode;
                    break;
                }
              SE(a, v, y);
            }
            break;
          }
          case ie: {
            var g = a.stateNode;
            if (t === null && a.flags & Ke) {
              var _ = a.type, x = a.memoizedProps;
              fT(g, _, x);
            }
            break;
          }
          case Ve:
            break;
          case me:
            break;
          case ct: {
            {
              var M = a.memoizedProps, U = M.onCommit, H = M.onRender, fe = a.stateNode.effectDuration, Oe = lC(), Te = t === null ? "mount" : "update";
              iC() && (Te = "nested-update"), typeof H == "function" && H(a.memoizedProps.id, Te, a.actualDuration, a.treeBaseDuration, a.actualStartTime, Oe);
              {
                typeof U == "function" && U(a.memoizedProps.id, Te, fe, Oe), $b(a);
                var St = a.return;
                e:
                  for (; St !== null; ) {
                    switch (St.tag) {
                      case re:
                        var pt = St.stateNode;
                        pt.effectDuration += fe;
                        break e;
                      case ct:
                        var D = St.stateNode;
                        D.effectDuration += fe;
                        break e;
                    }
                    St = St.return;
                  }
              }
            }
            break;
          }
          case be: {
            eb(e, a);
            break;
          }
          case _t:
          case xn:
          case En:
          case Ue:
          case qe:
          case Rt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Ur || a.flags & Xr && jC(a);
    }
    function Wx(e) {
      switch (e.tag) {
        case he:
        case Qe:
        case He: {
          if (e.mode & ze)
            try {
              Il(), AC(e, e.return);
            } finally {
              Yl(e);
            }
          else
            AC(e, e.return);
          break;
        }
        case pe: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && Vx(e, e.return, t), FC(e, e.return);
          break;
        }
        case ie: {
          FC(e, e.return);
          break;
        }
      }
    }
    function Gx(e, t) {
      for (var a = null, i = e; ; ) {
        if (i.tag === ie) {
          if (a === null) {
            a = i;
            try {
              var u = i.stateNode;
              t ? CT(u) : TT(i.stateNode, i.memoizedProps);
            } catch (f) {
              on(e, e.return, f);
            }
          }
        } else if (i.tag === Ve) {
          if (a === null)
            try {
              var s = i.stateNode;
              t ? RT(s) : wT(s, i.memoizedProps);
            } catch (f) {
              on(e, e.return, f);
            }
        } else if (!((i.tag === Ue || i.tag === qe) && i.memoizedState !== null && i !== e)) {
          if (i.child !== null) {
            i.child.return = i, i = i.child;
            continue;
          }
        }
        if (i === e)
          return;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === e)
            return;
          a === i && (a = null), i = i.return;
        }
        a === i && (a = null), i.sibling.return = i.return, i = i.sibling;
      }
    }
    function jC(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, i;
        switch (e.tag) {
          case ie:
            i = a;
            break;
          default:
            i = a;
        }
        if (typeof t == "function") {
          var u;
          if (e.mode & ze)
            try {
              Il(), u = t(i);
            } finally {
              Yl(e);
            }
          else
            u = t(i);
          typeof u == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", Ye(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", Ye(e)), t.current = i;
      }
    }
    function qx(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function VC(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, VC(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === ie) {
          var a = e.stateNode;
          a !== null && nw(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function Xx(e) {
      for (var t = e.return; t !== null; ) {
        if (PC(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function PC(e) {
      return e.tag === ie || e.tag === re || e.tag === me;
    }
    function BC(e) {
      var t = e;
      e:
        for (; ; ) {
          for (; t.sibling === null; ) {
            if (t.return === null || PC(t.return))
              return null;
            t = t.return;
          }
          for (t.sibling.return = t.return, t = t.sibling; t.tag !== ie && t.tag !== Ve && t.tag !== Qt; ) {
            if (t.flags & rn || t.child === null || t.tag === me)
              continue e;
            t.child.return = t, t = t.child;
          }
          if (!(t.flags & rn))
            return t.stateNode;
        }
    }
    function Kx(e) {
      var t = Xx(e);
      switch (t.tag) {
        case ie: {
          var a = t.stateNode;
          t.flags & Vt && ($0(a), t.flags &= ~Vt);
          var i = BC(e);
          OS(e, i, a);
          break;
        }
        case re:
        case me: {
          var u = t.stateNode.containerInfo, s = BC(e);
          DS(e, s, u);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function DS(e, t, a) {
      var i = e.tag, u = i === ie || i === Ve;
      if (u) {
        var s = e.stateNode;
        t ? yT(a, s, t) : hT(a, s);
      } else if (i !== me) {
        var f = e.child;
        if (f !== null) {
          DS(f, t, a);
          for (var p = f.sibling; p !== null; )
            DS(p, t, a), p = p.sibling;
        }
      }
    }
    function OS(e, t, a) {
      var i = e.tag, u = i === ie || i === Ve;
      if (u) {
        var s = e.stateNode;
        t ? mT(a, s, t) : vT(a, s);
      } else if (i !== me) {
        var f = e.child;
        if (f !== null) {
          OS(f, t, a);
          for (var p = f.sibling; p !== null; )
            OS(p, t, a), p = p.sibling;
        }
      }
    }
    var Ar = null, nl = !1;
    function Zx(e, t, a) {
      {
        var i = t;
        e:
          for (; i !== null; ) {
            switch (i.tag) {
              case ie: {
                Ar = i.stateNode, nl = !1;
                break e;
              }
              case re: {
                Ar = i.stateNode.containerInfo, nl = !0;
                break e;
              }
              case me: {
                Ar = i.stateNode.containerInfo, nl = !0;
                break e;
              }
            }
            i = i.return;
          }
        if (Ar === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        $C(e, t, a), Ar = null, nl = !1;
      }
      qx(a);
    }
    function Po(e, t, a) {
      for (var i = a.child; i !== null; )
        $C(e, t, i), i = i.sibling;
    }
    function $C(e, t, a) {
      switch (gd(a), a.tag) {
        case ie:
          Ur || Lf(a, t);
        case Ve: {
          {
            var i = Ar, u = nl;
            Ar = null, Po(e, t, a), Ar = i, nl = u, Ar !== null && (nl ? ST(Ar, a.stateNode) : gT(Ar, a.stateNode));
          }
          return;
        }
        case Qt: {
          Ar !== null && (nl ? ET(Ar, a.stateNode) : Py(Ar, a.stateNode));
          return;
        }
        case me: {
          {
            var s = Ar, f = nl;
            Ar = a.stateNode.containerInfo, nl = !0, Po(e, t, a), Ar = s, nl = f;
          }
          return;
        }
        case he:
        case Qe:
        case it:
        case He: {
          if (!Ur) {
            var p = a.updateQueue;
            if (p !== null) {
              var v = p.lastEffect;
              if (v !== null) {
                var y = v.next, g = y;
                do {
                  var _ = g, x = _.destroy, M = _.tag;
                  x !== void 0 && ((M & Pl) !== Ba ? Cm(a, t, x) : (M & lr) !== Ba && (Ec(a), a.mode & ze ? (Il(), Cm(a, t, x), Yl(a)) : Cm(a, t, x), lo())), g = g.next;
                } while (g !== y);
              }
            }
          }
          Po(e, t, a);
          return;
        }
        case pe: {
          if (!Ur) {
            Lf(a, t);
            var U = a.stateNode;
            typeof U.componentWillUnmount == "function" && kS(a, t, U);
          }
          Po(e, t, a);
          return;
        }
        case En: {
          Po(e, t, a);
          return;
        }
        case Ue: {
          if (
            // TODO: Remove this dead flag
            a.mode & ot
          ) {
            var H = Ur;
            Ur = H || a.memoizedState !== null, Po(e, t, a), Ur = H;
          } else
            Po(e, t, a);
          break;
        }
        default: {
          Po(e, t, a);
          return;
        }
      }
    }
    function Jx(e) {
      e.memoizedState;
    }
    function eb(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var i = t.alternate;
        if (i !== null) {
          var u = i.memoizedState;
          if (u !== null) {
            var s = u.dehydrated;
            s !== null && jT(s);
          }
        }
      }
    }
    function YC(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new Fx()), t.forEach(function(i) {
          var u = Xb.bind(null, e, i);
          if (!a.has(i)) {
            if (a.add(i), rr)
              if (Df !== null && Of !== null)
                Bp(Of, Df);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            i.then(u, u);
          }
        });
      }
    }
    function tb(e, t, a) {
      Df = a, Of = e, jt(t), IC(t, e), jt(t), Df = null, Of = null;
    }
    function rl(e, t, a) {
      var i = t.deletions;
      if (i !== null)
        for (var u = 0; u < i.length; u++) {
          var s = i[u];
          try {
            Zx(e, t, s);
          } catch (v) {
            on(s, t, v);
          }
        }
      var f = Ks();
      if (t.subtreeFlags & Jr)
        for (var p = t.child; p !== null; )
          jt(p), IC(p, e), p = p.sibling;
      jt(f);
    }
    function IC(e, t, a) {
      var i = e.alternate, u = e.flags;
      switch (e.tag) {
        case he:
        case Qe:
        case it:
        case He: {
          if (rl(t, e), Ql(e), u & Ke) {
            try {
              tl(Pl | ir, e, e.return), Vo(Pl | ir, e);
            } catch (je) {
              on(e, e.return, je);
            }
            if (e.mode & ze) {
              try {
                Il(), tl(lr | ir, e, e.return);
              } catch (je) {
                on(e, e.return, je);
              }
              Yl(e);
            } else
              try {
                tl(lr | ir, e, e.return);
              } catch (je) {
                on(e, e.return, je);
              }
          }
          return;
        }
        case pe: {
          rl(t, e), Ql(e), u & Xr && i !== null && Lf(i, i.return);
          return;
        }
        case ie: {
          rl(t, e), Ql(e), u & Xr && i !== null && Lf(i, i.return);
          {
            if (e.flags & Vt) {
              var s = e.stateNode;
              try {
                $0(s);
              } catch (je) {
                on(e, e.return, je);
              }
            }
            if (u & Ke) {
              var f = e.stateNode;
              if (f != null) {
                var p = e.memoizedProps, v = i !== null ? i.memoizedProps : p, y = e.type, g = e.updateQueue;
                if (e.updateQueue = null, g !== null)
                  try {
                    dT(f, g, y, v, p, e);
                  } catch (je) {
                    on(e, e.return, je);
                  }
              }
            }
          }
          return;
        }
        case Ve: {
          if (rl(t, e), Ql(e), u & Ke) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var _ = e.stateNode, x = e.memoizedProps, M = i !== null ? i.memoizedProps : x;
            try {
              pT(_, M, x);
            } catch (je) {
              on(e, e.return, je);
            }
          }
          return;
        }
        case re: {
          if (rl(t, e), Ql(e), u & Ke && i !== null) {
            var U = i.memoizedState;
            if (U.isDehydrated)
              try {
                HT(t.containerInfo);
              } catch (je) {
                on(e, e.return, je);
              }
          }
          return;
        }
        case me: {
          rl(t, e), Ql(e);
          return;
        }
        case be: {
          rl(t, e), Ql(e);
          var H = e.child;
          if (H.flags & Tl) {
            var fe = H.stateNode, Oe = H.memoizedState, Te = Oe !== null;
            if (fe.isHidden = Te, Te) {
              var St = H.alternate !== null && H.alternate.memoizedState !== null;
              St || Ub();
            }
          }
          if (u & Ke) {
            try {
              Jx(e);
            } catch (je) {
              on(e, e.return, je);
            }
            YC(e);
          }
          return;
        }
        case Ue: {
          var pt = i !== null && i.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & ot
          ) {
            var D = Ur;
            Ur = D || pt, rl(t, e), Ur = D;
          } else
            rl(t, e);
          if (Ql(e), u & Tl) {
            var j = e.stateNode, O = e.memoizedState, q = O !== null, de = e;
            if (j.isHidden = q, q && !pt && (de.mode & ot) !== Me) {
              Ee = de;
              for (var ue = de.child; ue !== null; )
                Ee = ue, rb(ue), ue = ue.sibling;
            }
            Gx(de, q);
          }
          return;
        }
        case _t: {
          rl(t, e), Ql(e), u & Ke && YC(e);
          return;
        }
        case En:
          return;
        default: {
          rl(t, e), Ql(e);
          return;
        }
      }
    }
    function Ql(e) {
      var t = e.flags;
      if (t & rn) {
        try {
          Kx(e);
        } catch (a) {
          on(e, e.return, a);
        }
        e.flags &= ~rn;
      }
      t & La && (e.flags &= ~La);
    }
    function nb(e, t, a) {
      Df = a, Of = t, Ee = e, QC(e, t, a), Df = null, Of = null;
    }
    function QC(e, t, a) {
      for (var i = (e.mode & ot) !== Me; Ee !== null; ) {
        var u = Ee, s = u.child;
        if (u.tag === Ue && i) {
          var f = u.memoizedState !== null, p = f || Em;
          if (p) {
            LS(e, t, a);
            continue;
          } else {
            var v = u.alternate, y = v !== null && v.memoizedState !== null, g = y || Ur, _ = Em, x = Ur;
            Em = p, Ur = g, Ur && !x && (Ee = u, ab(u));
            for (var M = s; M !== null; )
              Ee = M, QC(
                M,
                // New root; bubble back up to here and stop.
                t,
                a
              ), M = M.sibling;
            Ee = u, Em = _, Ur = x, LS(e, t, a);
            continue;
          }
        }
        (u.subtreeFlags & yr) !== ke && s !== null ? (s.return = u, Ee = s) : LS(e, t, a);
      }
    }
    function LS(e, t, a) {
      for (; Ee !== null; ) {
        var i = Ee;
        if ((i.flags & yr) !== ke) {
          var u = i.alternate;
          jt(i);
          try {
            Qx(t, u, i, a);
          } catch (f) {
            on(i, i.return, f);
          }
          Cn();
        }
        if (i === e) {
          Ee = null;
          return;
        }
        var s = i.sibling;
        if (s !== null) {
          s.return = i.return, Ee = s;
          return;
        }
        Ee = i.return;
      }
    }
    function rb(e) {
      for (; Ee !== null; ) {
        var t = Ee, a = t.child;
        switch (t.tag) {
          case he:
          case Qe:
          case it:
          case He: {
            if (t.mode & ze)
              try {
                Il(), tl(lr, t, t.return);
              } finally {
                Yl(t);
              }
            else
              tl(lr, t, t.return);
            break;
          }
          case pe: {
            Lf(t, t.return);
            var i = t.stateNode;
            typeof i.componentWillUnmount == "function" && kS(t, t.return, i);
            break;
          }
          case ie: {
            Lf(t, t.return);
            break;
          }
          case Ue: {
            var u = t.memoizedState !== null;
            if (u) {
              WC(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ee = a) : WC(e);
      }
    }
    function WC(e) {
      for (; Ee !== null; ) {
        var t = Ee;
        if (t === e) {
          Ee = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ee = a;
          return;
        }
        Ee = t.return;
      }
    }
    function ab(e) {
      for (; Ee !== null; ) {
        var t = Ee, a = t.child;
        if (t.tag === Ue) {
          var i = t.memoizedState !== null;
          if (i) {
            GC(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ee = a) : GC(e);
      }
    }
    function GC(e) {
      for (; Ee !== null; ) {
        var t = Ee;
        jt(t);
        try {
          Wx(t);
        } catch (i) {
          on(t, t.return, i);
        }
        if (Cn(), t === e) {
          Ee = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ee = a;
          return;
        }
        Ee = t.return;
      }
    }
    function ib(e, t, a, i) {
      Ee = t, lb(t, e, a, i);
    }
    function lb(e, t, a, i) {
      for (; Ee !== null; ) {
        var u = Ee, s = u.child;
        (u.subtreeFlags & Ma) !== ke && s !== null ? (s.return = u, Ee = s) : ub(e, t, a, i);
      }
    }
    function ub(e, t, a, i) {
      for (; Ee !== null; ) {
        var u = Ee;
        if ((u.flags & sn) !== ke) {
          jt(u);
          try {
            ob(t, u, a, i);
          } catch (f) {
            on(u, u.return, f);
          }
          Cn();
        }
        if (u === e) {
          Ee = null;
          return;
        }
        var s = u.sibling;
        if (s !== null) {
          s.return = u.return, Ee = s;
          return;
        }
        Ee = u.return;
      }
    }
    function ob(e, t, a, i) {
      switch (t.tag) {
        case he:
        case Qe:
        case He: {
          if (t.mode & ze) {
            oS();
            try {
              Vo(Nr | ir, t);
            } finally {
              uS(t);
            }
          } else
            Vo(Nr | ir, t);
          break;
        }
      }
    }
    function sb(e) {
      Ee = e, cb();
    }
    function cb() {
      for (; Ee !== null; ) {
        var e = Ee, t = e.child;
        if ((Ee.flags & Mt) !== ke) {
          var a = e.deletions;
          if (a !== null) {
            for (var i = 0; i < a.length; i++) {
              var u = a[i];
              Ee = u, pb(u, e);
            }
            {
              var s = e.alternate;
              if (s !== null) {
                var f = s.child;
                if (f !== null) {
                  s.child = null;
                  do {
                    var p = f.sibling;
                    f.sibling = null, f = p;
                  } while (f !== null);
                }
              }
            }
            Ee = e;
          }
        }
        (e.subtreeFlags & Ma) !== ke && t !== null ? (t.return = e, Ee = t) : fb();
      }
    }
    function fb() {
      for (; Ee !== null; ) {
        var e = Ee;
        (e.flags & sn) !== ke && (jt(e), db(e), Cn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ee = t;
          return;
        }
        Ee = e.return;
      }
    }
    function db(e) {
      switch (e.tag) {
        case he:
        case Qe:
        case He: {
          e.mode & ze ? (oS(), tl(Nr | ir, e, e.return), uS(e)) : tl(Nr | ir, e, e.return);
          break;
        }
      }
    }
    function pb(e, t) {
      for (; Ee !== null; ) {
        var a = Ee;
        jt(a), hb(a, t), Cn();
        var i = a.child;
        i !== null ? (i.return = a, Ee = i) : vb(e);
      }
    }
    function vb(e) {
      for (; Ee !== null; ) {
        var t = Ee, a = t.sibling, i = t.return;
        if (VC(t), t === e) {
          Ee = null;
          return;
        }
        if (a !== null) {
          a.return = i, Ee = a;
          return;
        }
        Ee = i;
      }
    }
    function hb(e, t) {
      switch (e.tag) {
        case he:
        case Qe:
        case He: {
          e.mode & ze ? (oS(), tl(Nr, e, t), uS(e)) : tl(Nr, e, t);
          break;
        }
      }
    }
    function mb(e) {
      switch (e.tag) {
        case he:
        case Qe:
        case He: {
          try {
            Vo(lr | ir, e);
          } catch (a) {
            on(e, e.return, a);
          }
          break;
        }
        case pe: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            on(e, e.return, a);
          }
          break;
        }
      }
    }
    function yb(e) {
      switch (e.tag) {
        case he:
        case Qe:
        case He: {
          try {
            Vo(Nr | ir, e);
          } catch (t) {
            on(e, e.return, t);
          }
          break;
        }
      }
    }
    function gb(e) {
      switch (e.tag) {
        case he:
        case Qe:
        case He: {
          try {
            tl(lr | ir, e, e.return);
          } catch (a) {
            on(e, e.return, a);
          }
          break;
        }
        case pe: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && kS(e, e.return, t);
          break;
        }
      }
    }
    function Sb(e) {
      switch (e.tag) {
        case he:
        case Qe:
        case He:
          try {
            tl(Nr | ir, e, e.return);
          } catch (t) {
            on(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Lp = Symbol.for;
      Lp("selector.component"), Lp("selector.has_pseudo_class"), Lp("selector.role"), Lp("selector.test_id"), Lp("selector.text");
    }
    var Eb = [];
    function Cb() {
      Eb.forEach(function(e) {
        return e();
      });
    }
    var Rb = N.ReactCurrentActQueue;
    function Tb(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function qC() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && Rb.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var wb = Math.ceil, MS = N.ReactCurrentDispatcher, NS = N.ReactCurrentOwner, Fr = N.ReactCurrentBatchConfig, al = N.ReactCurrentActQueue, sr = (
      /*             */
      0
    ), XC = (
      /*               */
      1
    ), Hr = (
      /*                */
      2
    ), _i = (
      /*                */
      4
    ), zu = 0, Mp = 1, Is = 2, Rm = 3, Np = 4, KC = 5, zS = 6, gt = sr, Ca = null, On = null, cr = V, Wl = V, US = Lo(V), fr = zu, zp = null, Tm = V, Up = V, wm = V, Ap = null, $a = null, AS = 0, ZC = 500, JC = 1 / 0, xb = 500, Uu = null;
    function Fp() {
      JC = mn() + xb;
    }
    function e1() {
      return JC;
    }
    var xm = !1, FS = null, Mf = null, Qs = !1, Bo = null, Hp = V, HS = [], jS = null, bb = 50, jp = 0, VS = null, PS = !1, bm = !1, _b = 50, Nf = 0, _m = null, Vp = Zt, km = V, t1 = !1;
    function Dm() {
      return Ca;
    }
    function Ra() {
      return (gt & (Hr | _i)) !== sr ? mn() : (Vp !== Zt || (Vp = mn()), Vp);
    }
    function $o(e) {
      var t = e.mode;
      if ((t & ot) === Me)
        return Ae;
      if ((gt & Hr) !== sr && cr !== V)
        return jn(cr);
      var a = Tw() !== Rw;
      if (a) {
        if (Fr.transition !== null) {
          var i = Fr.transition;
          i._updatedFibers || (i._updatedFibers = /* @__PURE__ */ new Set()), i._updatedFibers.add(e);
        }
        return km === yt && (km = bd()), km;
      }
      var u = Aa();
      if (u !== yt)
        return u;
      var s = uT();
      return s;
    }
    function kb(e) {
      var t = e.mode;
      return (t & ot) === Me ? Ae : oy();
    }
    function dr(e, t, a, i) {
      Zb(), t1 && S("useInsertionEffect must not schedule updates."), PS && (bm = !0), yu(e, a, i), (gt & Hr) !== V && e === Ca ? t_(t) : (rr && Ld(e, t, a), n_(t), e === Ca && ((gt & Hr) === sr && (Up = Ze(Up, a)), fr === Np && Yo(e, cr)), Ya(e, i), a === Ae && gt === sr && (t.mode & ot) === Me && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !al.isBatchingLegacy && (Fp(), eE()));
    }
    function Db(e, t, a) {
      var i = e.current;
      i.lanes = t, yu(e, t, a), Ya(e, a);
    }
    function Ob(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (gt & Hr) !== sr
      );
    }
    function Ya(e, t) {
      var a = e.callbackNode;
      iy(e, t);
      var i = ys(e, e === Ca ? cr : V);
      if (i === V) {
        a !== null && y1(a), e.callbackNode = null, e.callbackPriority = yt;
        return;
      }
      var u = Nn(i), s = e.callbackPriority;
      if (s === u && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(al.current !== null && a !== GS)) {
        a == null && s !== Ae && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && y1(a);
      var f;
      if (u === Ae)
        e.tag === Mo ? (al.isBatchingLegacy !== null && (al.didScheduleLegacyUpdate = !0), iw(a1.bind(null, e))) : J0(a1.bind(null, e)), al.current !== null ? al.current.push(No) : sT(function() {
          (gt & (Hr | _i)) === sr && No();
        }), f = null;
      else {
        var p;
        switch (Rs(i)) {
          case gr:
            p = mc;
            break;
          case ar:
            p = ya;
            break;
          case $i:
            p = yi;
            break;
          case Es:
            p = xl;
            break;
          default:
            p = yi;
            break;
        }
        f = qS(p, n1.bind(null, e));
      }
      e.callbackPriority = u, e.callbackNode = f;
    }
    function n1(e, t) {
      if (Zw(), Vp = Zt, km = V, (gt & (Hr | _i)) !== sr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, i = Fu();
      if (i && e.callbackNode !== a)
        return null;
      var u = ys(e, e === Ca ? cr : V);
      if (u === V)
        return null;
      var s = !Ss(e, u) && !Pv(e, u) && !t, f = s ? Vb(e, u) : Lm(e, u);
      if (f !== zu) {
        if (f === Is) {
          var p = wd(e);
          p !== V && (u = p, f = BS(e, p));
        }
        if (f === Mp) {
          var v = zp;
          throw Ws(e, V), Yo(e, u), Ya(e, mn()), v;
        }
        if (f === zS)
          Yo(e, u);
        else {
          var y = !Ss(e, u), g = e.current.alternate;
          if (y && !Mb(g)) {
            if (f = Lm(e, u), f === Is) {
              var _ = wd(e);
              _ !== V && (u = _, f = BS(e, _));
            }
            if (f === Mp) {
              var x = zp;
              throw Ws(e, V), Yo(e, u), Ya(e, mn()), x;
            }
          }
          e.finishedWork = g, e.finishedLanes = u, Lb(e, f, u);
        }
      }
      return Ya(e, mn()), e.callbackNode === a ? n1.bind(null, e) : null;
    }
    function BS(e, t) {
      var a = Ap;
      if (Pn(e)) {
        var i = Ws(e, t);
        i.flags |= Rn, ZT(e.containerInfo);
      }
      var u = Lm(e, t);
      if (u !== Is) {
        var s = $a;
        $a = a, s !== null && r1(s);
      }
      return u;
    }
    function r1(e) {
      $a === null ? $a = e : $a.push.apply($a, e);
    }
    function Lb(e, t, a) {
      switch (t) {
        case zu:
        case Mp:
          throw new Error("Root did not complete. This is a bug in React.");
        case Is: {
          Gs(e, $a, Uu);
          break;
        }
        case Rm: {
          if (Yo(e, a), Vc(a) && // do not delay if we're inside an act() scope
          !g1()) {
            var i = AS + ZC - mn();
            if (i > 10) {
              var u = ys(e, V);
              if (u !== V)
                break;
              var s = e.suspendedLanes;
              if (!mu(s, a)) {
                Ra(), Dd(e, s);
                break;
              }
              e.timeoutHandle = jy(Gs.bind(null, e, $a, Uu), i);
              break;
            }
          }
          Gs(e, $a, Uu);
          break;
        }
        case Np: {
          if (Yo(e, a), Vv(a))
            break;
          if (!g1()) {
            var f = jv(e, a), p = f, v = mn() - p, y = Kb(v) - v;
            if (y > 10) {
              e.timeoutHandle = jy(Gs.bind(null, e, $a, Uu), y);
              break;
            }
          }
          Gs(e, $a, Uu);
          break;
        }
        case KC: {
          Gs(e, $a, Uu);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function Mb(e) {
      for (var t = e; ; ) {
        if (t.flags & cs) {
          var a = t.updateQueue;
          if (a !== null) {
            var i = a.stores;
            if (i !== null)
              for (var u = 0; u < i.length; u++) {
                var s = i[u], f = s.getSnapshot, p = s.value;
                try {
                  if (!Se(f(), p))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var v = t.child;
        if (t.subtreeFlags & cs && v !== null) {
          v.return = t, t = v;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function Yo(e, t) {
      t = vo(t, wm), t = vo(t, Up), kd(e, t);
    }
    function a1(e) {
      if (Jw(), (gt & (Hr | _i)) !== sr)
        throw new Error("Should not already be working.");
      Fu();
      var t = ys(e, V);
      if (!ra(t, Ae))
        return Ya(e, mn()), null;
      var a = Lm(e, t);
      if (e.tag !== Mo && a === Is) {
        var i = wd(e);
        i !== V && (t = i, a = BS(e, i));
      }
      if (a === Mp) {
        var u = zp;
        throw Ws(e, V), Yo(e, t), Ya(e, mn()), u;
      }
      if (a === zS)
        throw new Error("Root did not complete. This is a bug in React.");
      var s = e.current.alternate;
      return e.finishedWork = s, e.finishedLanes = t, Gs(e, $a, Uu), Ya(e, mn()), null;
    }
    function Nb(e, t) {
      t !== V && (ho(e, Ze(t, Ae)), Ya(e, mn()), (gt & (Hr | _i)) === sr && (Fp(), No()));
    }
    function $S(e, t) {
      var a = gt;
      gt |= XC;
      try {
        return e(t);
      } finally {
        gt = a, gt === sr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !al.isBatchingLegacy && (Fp(), eE());
      }
    }
    function zb(e, t, a, i, u) {
      var s = Aa(), f = Fr.transition;
      try {
        return Fr.transition = null, Vn(gr), e(t, a, i, u);
      } finally {
        Vn(s), Fr.transition = f, gt === sr && Fp();
      }
    }
    function Au(e) {
      Bo !== null && Bo.tag === Mo && (gt & (Hr | _i)) === sr && Fu();
      var t = gt;
      gt |= XC;
      var a = Fr.transition, i = Aa();
      try {
        return Fr.transition = null, Vn(gr), e ? e() : void 0;
      } finally {
        Vn(i), Fr.transition = a, gt = t, (gt & (Hr | _i)) === sr && No();
      }
    }
    function i1() {
      return (gt & (Hr | _i)) !== sr;
    }
    function Om(e, t) {
      ia(US, Wl, e), Wl = Ze(Wl, t);
    }
    function YS(e) {
      Wl = US.current, aa(US, e);
    }
    function Ws(e, t) {
      e.finishedWork = null, e.finishedLanes = V;
      var a = e.timeoutHandle;
      if (a !== Vy && (e.timeoutHandle = Vy, oT(a)), On !== null)
        for (var i = On.return; i !== null; ) {
          var u = i.alternate;
          zC(u, i), i = i.return;
        }
      Ca = e;
      var s = qs(e.current, null);
      return On = s, cr = Wl = t, fr = zu, zp = null, Tm = V, Up = V, wm = V, Ap = null, $a = null, _w(), Xi.discardPendingWarnings(), s;
    }
    function l1(e, t) {
      do {
        var a = On;
        try {
          if (Hh(), AE(), Cn(), NS.current = null, a === null || a.return === null) {
            fr = Mp, zp = t, On = null;
            return;
          }
          if (et && a.mode & ze && mm(a, !0), ht)
            if (uu(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var i = t;
              Av(a, i, cr);
            } else
              Cc(a, t, cr);
          ax(e, a.return, a, t, cr), c1(a);
        } catch (u) {
          t = u, On === a && a !== null ? (a = a.return, On = a) : a = On;
          continue;
        }
        return;
      } while (!0);
    }
    function u1() {
      var e = MS.current;
      return MS.current = fm, e === null ? fm : e;
    }
    function o1(e) {
      MS.current = e;
    }
    function Ub() {
      AS = mn();
    }
    function Pp(e) {
      Tm = Ze(e, Tm);
    }
    function Ab() {
      fr === zu && (fr = Rm);
    }
    function IS() {
      (fr === zu || fr === Rm || fr === Is) && (fr = Np), Ca !== null && (gs(Tm) || gs(Up)) && Yo(Ca, cr);
    }
    function Fb(e) {
      fr !== Np && (fr = Is), Ap === null ? Ap = [e] : Ap.push(e);
    }
    function Hb() {
      return fr === zu;
    }
    function Lm(e, t) {
      var a = gt;
      gt |= Hr;
      var i = u1();
      if (Ca !== e || cr !== t) {
        if (rr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Bp(e, cr), u.clear()), $c(e, t);
        }
        Uu = Md(), Ws(e, t);
      }
      ni(t);
      do
        try {
          jb();
          break;
        } catch (s) {
          l1(e, s);
        }
      while (!0);
      if (Hh(), gt = a, o1(i), On !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return oo(), Ca = null, cr = V, fr;
    }
    function jb() {
      for (; On !== null; )
        s1(On);
    }
    function Vb(e, t) {
      var a = gt;
      gt |= Hr;
      var i = u1();
      if (Ca !== e || cr !== t) {
        if (rr) {
          var u = e.memoizedUpdaters;
          u.size > 0 && (Bp(e, cr), u.clear()), $c(e, t);
        }
        Uu = Md(), Fp(), Ws(e, t);
      }
      ni(t);
      do
        try {
          Pb();
          break;
        } catch (s) {
          l1(e, s);
        }
      while (!0);
      return Hh(), o1(i), gt = a, On !== null ? (ps(), zu) : (oo(), Ca = null, cr = V, fr);
    }
    function Pb() {
      for (; On !== null && !hc(); )
        s1(On);
    }
    function s1(e) {
      var t = e.alternate;
      jt(e);
      var a;
      (e.mode & ze) !== Me ? (lS(e), a = QS(t, e, Wl), mm(e, !0)) : a = QS(t, e, Wl), Cn(), e.memoizedProps = e.pendingProps, a === null ? c1(e) : On = a, NS.current = null;
    }
    function c1(e) {
      var t = e;
      do {
        var a = t.alternate, i = t.return;
        if ((t.flags & va) === ke) {
          jt(t);
          var u = void 0;
          if ((t.mode & ze) === Me ? u = NC(a, t, Wl) : (lS(t), u = NC(a, t, Wl), mm(t, !1)), Cn(), u !== null) {
            On = u;
            return;
          }
        } else {
          var s = Ax(a, t);
          if (s !== null) {
            s.flags &= _v, On = s;
            return;
          }
          if ((t.mode & ze) !== Me) {
            mm(t, !1);
            for (var f = t.actualDuration, p = t.child; p !== null; )
              f += p.actualDuration, p = p.sibling;
            t.actualDuration = f;
          }
          if (i !== null)
            i.flags |= va, i.subtreeFlags = ke, i.deletions = null;
          else {
            fr = zS, On = null;
            return;
          }
        }
        var v = t.sibling;
        if (v !== null) {
          On = v;
          return;
        }
        t = i, On = t;
      } while (t !== null);
      fr === zu && (fr = KC);
    }
    function Gs(e, t, a) {
      var i = Aa(), u = Fr.transition;
      try {
        Fr.transition = null, Vn(gr), Bb(e, t, a, i);
      } finally {
        Fr.transition = u, Vn(i);
      }
      return null;
    }
    function Bb(e, t, a, i) {
      do
        Fu();
      while (Bo !== null);
      if (Jb(), (gt & (Hr | _i)) !== sr)
        throw new Error("Should not already be working.");
      var u = e.finishedWork, s = e.finishedLanes;
      if (gc(s), u === null)
        return Sd(), null;
      if (s === V && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = V, u === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = yt;
      var f = Ze(u.lanes, u.childLanes);
      Od(e, f), e === Ca && (Ca = null, On = null, cr = V), ((u.subtreeFlags & Ma) !== ke || (u.flags & Ma) !== ke) && (Qs || (Qs = !0, jS = a, qS(yi, function() {
        return Fu(), null;
      })));
      var p = (u.subtreeFlags & (io | Jr | yr | Ma)) !== ke, v = (u.flags & (io | Jr | yr | Ma)) !== ke;
      if (p || v) {
        var y = Fr.transition;
        Fr.transition = null;
        var g = Aa();
        Vn(gr);
        var _ = gt;
        gt |= _i, NS.current = null, Px(e, u), uC(), tb(e, u, s), tT(e.containerInfo), e.current = u, Fv(s), nb(u, e, s), uo(), Ov(), gt = _, Vn(g), Fr.transition = y;
      } else
        e.current = u, uC();
      var x = Qs;
      if (Qs ? (Qs = !1, Bo = e, Hp = s) : (Nf = 0, _m = null), f = e.pendingLanes, f === V && (Mf = null), x || v1(e.current, !1), Vi(u.stateNode, i), rr && e.memoizedUpdaters.clear(), Cb(), Ya(e, mn()), t !== null)
        for (var M = e.onRecoverableError, U = 0; U < t.length; U++) {
          var H = t[U], fe = H.stack, Oe = H.digest;
          M(H.value, {
            componentStack: fe,
            digest: Oe
          });
        }
      if (xm) {
        xm = !1;
        var Te = FS;
        throw FS = null, Te;
      }
      return ra(Hp, Ae) && e.tag !== Mo && Fu(), f = e.pendingLanes, ra(f, Ae) ? (Kw(), e === VS ? jp++ : (jp = 0, VS = e)) : jp = 0, No(), Sd(), null;
    }
    function Fu() {
      if (Bo !== null) {
        var e = Rs(Hp), t = cy($i, e), a = Fr.transition, i = Aa();
        try {
          return Fr.transition = null, Vn(t), Yb();
        } finally {
          Vn(i), Fr.transition = a;
        }
      }
      return !1;
    }
    function $b(e) {
      HS.push(e), Qs || (Qs = !0, qS(yi, function() {
        return Fu(), null;
      }));
    }
    function Yb() {
      if (Bo === null)
        return !1;
      var e = jS;
      jS = null;
      var t = Bo, a = Hp;
      if (Bo = null, Hp = V, (gt & (Hr | _i)) !== sr)
        throw new Error("Cannot flush passive effects while already rendering.");
      PS = !0, bm = !1, Hv(a);
      var i = gt;
      gt |= _i, sb(t.current), ib(t, t.current, a, e);
      {
        var u = HS;
        HS = [];
        for (var s = 0; s < u.length; s++) {
          var f = u[s];
          Ix(t, f);
        }
      }
      ds(), v1(t.current, !0), gt = i, No(), bm ? t === _m ? Nf++ : (Nf = 0, _m = t) : Nf = 0, PS = !1, bm = !1, _l(t);
      {
        var p = t.current.stateNode;
        p.effectDuration = 0, p.passiveEffectDuration = 0;
      }
      return !0;
    }
    function f1(e) {
      return Mf !== null && Mf.has(e);
    }
    function Ib(e) {
      Mf === null ? Mf = /* @__PURE__ */ new Set([e]) : Mf.add(e);
    }
    function Qb(e) {
      xm || (xm = !0, FS = e);
    }
    var Wb = Qb;
    function d1(e, t, a) {
      var i = $s(a, t), u = sC(e, i, Ae), s = Uo(e, u, Ae), f = Ra();
      s !== null && (yu(s, Ae, f), Ya(s, f));
    }
    function on(e, t, a) {
      if (Hx(a), $p(!1), e.tag === re) {
        d1(e, e, a);
        return;
      }
      var i = null;
      for (i = t; i !== null; ) {
        if (i.tag === re) {
          d1(i, e, a);
          return;
        } else if (i.tag === pe) {
          var u = i.type, s = i.stateNode;
          if (typeof u.getDerivedStateFromError == "function" || typeof s.componentDidCatch == "function" && !f1(s)) {
            var f = $s(a, e), p = dS(i, f, Ae), v = Uo(i, p, Ae), y = Ra();
            v !== null && (yu(v, Ae, y), Ya(v, y));
            return;
          }
        }
        i = i.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function Gb(e, t, a) {
      var i = e.pingCache;
      i !== null && i.delete(t);
      var u = Ra();
      Dd(e, a), r_(e), Ca === e && mu(cr, a) && (fr === Np || fr === Rm && Vc(cr) && mn() - AS < ZC ? Ws(e, V) : wm = Ze(wm, a)), Ya(e, u);
    }
    function p1(e, t) {
      t === yt && (t = kb(e));
      var a = Ra(), i = Pa(e, t);
      i !== null && (yu(i, t, a), Ya(i, a));
    }
    function qb(e) {
      var t = e.memoizedState, a = yt;
      t !== null && (a = t.retryLane), p1(e, a);
    }
    function Xb(e, t) {
      var a = yt, i;
      switch (e.tag) {
        case be:
          i = e.stateNode;
          var u = e.memoizedState;
          u !== null && (a = u.retryLane);
          break;
        case _t:
          i = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      i !== null && i.delete(t), p1(e, a);
    }
    function Kb(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : wb(e / 1960) * 1960;
    }
    function Zb() {
      if (jp > bb)
        throw jp = 0, VS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      Nf > _b && (Nf = 0, _m = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function Jb() {
      Xi.flushLegacyContextWarning(), Xi.flushPendingUnsafeLifecycleWarnings();
    }
    function v1(e, t) {
      jt(e), Mm(e, Zr, gb), t && Mm(e, lu, Sb), Mm(e, Zr, mb), t && Mm(e, lu, yb), Cn();
    }
    function Mm(e, t, a) {
      for (var i = e, u = null; i !== null; ) {
        var s = i.subtreeFlags & t;
        i !== u && i.child !== null && s !== ke ? i = i.child : ((i.flags & t) !== ke && a(i), i.sibling !== null ? i = i.sibling : i = u = i.return);
      }
    }
    var Nm = null;
    function h1(e) {
      {
        if ((gt & Hr) !== sr || !(e.mode & ot))
          return;
        var t = e.tag;
        if (t !== rt && t !== re && t !== pe && t !== he && t !== Qe && t !== it && t !== He)
          return;
        var a = Ye(e) || "ReactComponent";
        if (Nm !== null) {
          if (Nm.has(a))
            return;
          Nm.add(a);
        } else
          Nm = /* @__PURE__ */ new Set([a]);
        var i = hn;
        try {
          jt(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          i ? jt(e) : Cn();
        }
      }
    }
    var QS;
    {
      var e_ = null;
      QS = function(e, t, a) {
        var i = T1(e_, t);
        try {
          return kC(e, t, a);
        } catch (s) {
          if (pw() || s !== null && typeof s == "object" && typeof s.then == "function")
            throw s;
          if (Hh(), AE(), zC(e, t), T1(t, i), t.mode & ze && lS(t), iu(null, kC, null, e, t, a), ry()) {
            var u = od();
            typeof u == "object" && u !== null && u._suppressLogging && typeof s == "object" && s !== null && !s._suppressLogging && (s._suppressLogging = !0);
          }
          throw s;
        }
      };
    }
    var m1 = !1, WS;
    WS = /* @__PURE__ */ new Set();
    function t_(e) {
      if (Wr && !Gw())
        switch (e.tag) {
          case he:
          case Qe:
          case He: {
            var t = On && Ye(On) || "Unknown", a = t;
            if (!WS.has(a)) {
              WS.add(a);
              var i = Ye(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", i, t, t);
            }
            break;
          }
          case pe: {
            m1 || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), m1 = !0);
            break;
          }
        }
    }
    function Bp(e, t) {
      if (rr) {
        var a = e.memoizedUpdaters;
        a.forEach(function(i) {
          Ld(e, i, t);
        });
      }
    }
    var GS = {};
    function qS(e, t) {
      {
        var a = al.current;
        return a !== null ? (a.push(t), GS) : vc(e, t);
      }
    }
    function y1(e) {
      if (e !== GS)
        return Dv(e);
    }
    function g1() {
      return al.current !== null;
    }
    function n_(e) {
      {
        if (e.mode & ot) {
          if (!qC())
            return;
        } else if (!Tb() || gt !== sr || e.tag !== he && e.tag !== Qe && e.tag !== He)
          return;
        if (al.current === null) {
          var t = hn;
          try {
            jt(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, Ye(e));
          } finally {
            t ? jt(e) : Cn();
          }
        }
      }
    }
    function r_(e) {
      e.tag !== Mo && qC() && al.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function $p(e) {
      t1 = e;
    }
    var ki = null, zf = null, a_ = function(e) {
      ki = e;
    };
    function Uf(e) {
      {
        if (ki === null)
          return e;
        var t = ki(e);
        return t === void 0 ? e : t.current;
      }
    }
    function XS(e) {
      return Uf(e);
    }
    function KS(e) {
      {
        if (ki === null)
          return e;
        var t = ki(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = Uf(e.render);
            if (e.render !== a) {
              var i = {
                $$typeof: ce,
                render: a
              };
              return e.displayName !== void 0 && (i.displayName = e.displayName), i;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function S1(e, t) {
      {
        if (ki === null)
          return !1;
        var a = e.elementType, i = t.type, u = !1, s = typeof i == "object" && i !== null ? i.$$typeof : null;
        switch (e.tag) {
          case pe: {
            typeof i == "function" && (u = !0);
            break;
          }
          case he: {
            (typeof i == "function" || s === De) && (u = !0);
            break;
          }
          case Qe: {
            (s === ce || s === De) && (u = !0);
            break;
          }
          case it:
          case He: {
            (s === Xe || s === De) && (u = !0);
            break;
          }
          default:
            return !1;
        }
        if (u) {
          var f = ki(a);
          if (f !== void 0 && f === ki(i))
            return !0;
        }
        return !1;
      }
    }
    function E1(e) {
      {
        if (ki === null || typeof WeakSet != "function")
          return;
        zf === null && (zf = /* @__PURE__ */ new WeakSet()), zf.add(e);
      }
    }
    var i_ = function(e, t) {
      {
        if (ki === null)
          return;
        var a = t.staleFamilies, i = t.updatedFamilies;
        Fu(), Au(function() {
          ZS(e.current, i, a);
        });
      }
    }, l_ = function(e, t) {
      {
        if (e.context !== ai)
          return;
        Fu(), Au(function() {
          Yp(t, e, null, null);
        });
      }
    };
    function ZS(e, t, a) {
      {
        var i = e.alternate, u = e.child, s = e.sibling, f = e.tag, p = e.type, v = null;
        switch (f) {
          case he:
          case He:
          case pe:
            v = p;
            break;
          case Qe:
            v = p.render;
            break;
        }
        if (ki === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var y = !1, g = !1;
        if (v !== null) {
          var _ = ki(v);
          _ !== void 0 && (a.has(_) ? g = !0 : t.has(_) && (f === pe ? g = !0 : y = !0));
        }
        if (zf !== null && (zf.has(e) || i !== null && zf.has(i)) && (g = !0), g && (e._debugNeedsRemount = !0), g || y) {
          var x = Pa(e, Ae);
          x !== null && dr(x, e, Ae, Zt);
        }
        u !== null && !g && ZS(u, t, a), s !== null && ZS(s, t, a);
      }
    }
    var u_ = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), i = new Set(t.map(function(u) {
          return u.current;
        }));
        return JS(e.current, i, a), a;
      }
    };
    function JS(e, t, a) {
      {
        var i = e.child, u = e.sibling, s = e.tag, f = e.type, p = null;
        switch (s) {
          case he:
          case He:
          case pe:
            p = f;
            break;
          case Qe:
            p = f.render;
            break;
        }
        var v = !1;
        p !== null && t.has(p) && (v = !0), v ? o_(e, a) : i !== null && JS(i, t, a), u !== null && JS(u, t, a);
      }
    }
    function o_(e, t) {
      {
        var a = s_(e, t);
        if (a)
          return;
        for (var i = e; ; ) {
          switch (i.tag) {
            case ie:
              t.add(i.stateNode);
              return;
            case me:
              t.add(i.stateNode.containerInfo);
              return;
            case re:
              t.add(i.stateNode.containerInfo);
              return;
          }
          if (i.return === null)
            throw new Error("Expected to reach root first.");
          i = i.return;
        }
      }
    }
    function s_(e, t) {
      for (var a = e, i = !1; ; ) {
        if (a.tag === ie)
          i = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return i;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return i;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var e0;
    {
      e0 = !1;
      try {
        var C1 = Object.preventExtensions({});
      } catch {
        e0 = !0;
      }
    }
    function c_(e, t, a, i) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = i, this.flags = ke, this.subtreeFlags = ke, this.deletions = null, this.lanes = V, this.childLanes = V, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !e0 && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var ii = function(e, t, a, i) {
      return new c_(e, t, a, i);
    };
    function t0(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function f_(e) {
      return typeof e == "function" && !t0(e) && e.defaultProps === void 0;
    }
    function d_(e) {
      if (typeof e == "function")
        return t0(e) ? pe : he;
      if (e != null) {
        var t = e.$$typeof;
        if (t === ce)
          return Qe;
        if (t === Xe)
          return it;
      }
      return rt;
    }
    function qs(e, t) {
      var a = e.alternate;
      a === null ? (a = ii(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = ke, a.subtreeFlags = ke, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & nr, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var i = e.dependencies;
      switch (a.dependencies = i === null ? null : {
        lanes: i.lanes,
        firstContext: i.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case rt:
        case he:
        case He:
          a.type = Uf(e.type);
          break;
        case pe:
          a.type = XS(e.type);
          break;
        case Qe:
          a.type = KS(e.type);
          break;
      }
      return a;
    }
    function p_(e, t) {
      e.flags &= nr | rn;
      var a = e.alternate;
      if (a === null)
        e.childLanes = V, e.lanes = t, e.child = null, e.subtreeFlags = ke, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = ke, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var i = a.dependencies;
        e.dependencies = i === null ? null : {
          lanes: i.lanes,
          firstContext: i.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function v_(e, t, a) {
      var i;
      return e === Oh ? (i = ot, t === !0 && (i |= yn, i |= za)) : i = Me, rr && (i |= ze), ii(re, null, null, i);
    }
    function n0(e, t, a, i, u, s) {
      var f = rt, p = e;
      if (typeof e == "function")
        t0(e) ? (f = pe, p = XS(p)) : p = Uf(p);
      else if (typeof e == "string")
        f = ie;
      else {
        e:
          switch (e) {
            case pa:
              return Io(a.children, u, s, t);
            case ci:
              f = st, u |= yn, (u & ot) !== Me && (u |= za);
              break;
            case R:
              return h_(a, u, s, t);
            case Ge:
              return m_(a, u, s, t);
            case mt:
              return y_(a, u, s, t);
            case en:
              return R1(a, u, s, t);
            case tr:
            case Ln:
            case fi:
            case Vu:
            case Jt:
            default: {
              if (typeof e == "object" && e !== null)
                switch (e.$$typeof) {
                  case Y:
                    f = at;
                    break e;
                  case ee:
                    f = fn;
                    break e;
                  case ce:
                    f = Qe, p = KS(p);
                    break e;
                  case Xe:
                    f = it;
                    break e;
                  case De:
                    f = nn, p = null;
                    break e;
                }
              var v = "";
              {
                (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
                var y = i ? Ye(i) : null;
                y && (v += `

Check the render method of \`` + y + "`.");
              }
              throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + v));
            }
          }
      }
      var g = ii(f, a, t, u);
      return g.elementType = e, g.type = p, g.lanes = s, g._debugOwner = i, g;
    }
    function r0(e, t, a) {
      var i = null;
      i = e._owner;
      var u = e.type, s = e.key, f = e.props, p = n0(u, s, f, i, t, a);
      return p._debugSource = e._source, p._debugOwner = e._owner, p;
    }
    function Io(e, t, a, i) {
      var u = ii(Ct, e, i, t);
      return u.lanes = a, u;
    }
    function h_(e, t, a, i) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var u = ii(ct, e, i, t | ze);
      return u.elementType = R, u.lanes = a, u.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, u;
    }
    function m_(e, t, a, i) {
      var u = ii(be, e, i, t);
      return u.elementType = Ge, u.lanes = a, u;
    }
    function y_(e, t, a, i) {
      var u = ii(_t, e, i, t);
      return u.elementType = mt, u.lanes = a, u;
    }
    function R1(e, t, a, i) {
      var u = ii(Ue, e, i, t);
      u.elementType = en, u.lanes = a;
      var s = {
        isHidden: !1
      };
      return u.stateNode = s, u;
    }
    function a0(e, t, a) {
      var i = ii(Ve, e, null, t);
      return i.lanes = a, i;
    }
    function g_() {
      var e = ii(ie, null, null, Me);
      return e.elementType = "DELETED", e;
    }
    function S_(e) {
      var t = ii(Qt, null, null, Me);
      return t.stateNode = e, t;
    }
    function i0(e, t, a) {
      var i = e.children !== null ? e.children : [], u = ii(me, i, e.key, t);
      return u.lanes = a, u.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, u;
    }
    function T1(e, t) {
      return e === null && (e = ii(rt, null, null, Me)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function E_(e, t, a, i, u) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Vy, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = yt, this.eventTimes = Bc(V), this.expirationTimes = Bc(Zt), this.pendingLanes = V, this.suspendedLanes = V, this.pingedLanes = V, this.expiredLanes = V, this.mutableReadLanes = V, this.finishedLanes = V, this.entangledLanes = V, this.entanglements = Bc(V), this.identifierPrefix = i, this.onRecoverableError = u, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var s = this.pendingUpdatersLaneMap = [], f = 0; f < ln; f++)
          s.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case Oh:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case Mo:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function w1(e, t, a, i, u, s, f, p, v, y) {
      var g = new E_(e, t, a, p, v), _ = v_(t, s);
      g.current = _, _.stateNode = g;
      {
        var x = {
          element: i,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        _.memoizedState = x;
      }
      return pg(_), g;
    }
    var l0 = "18.2.0";
    function C_(e, t, a) {
      var i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return $r(i), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: br,
        key: i == null ? null : "" + i,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var u0, o0;
    u0 = !1, o0 = {};
    function x1(e) {
      if (!e)
        return ai;
      var t = Da(e), a = aw(t);
      if (t.tag === pe) {
        var i = t.type;
        if (Vl(i))
          return K0(t, i, a);
      }
      return a;
    }
    function R_(e, t) {
      {
        var a = Da(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var i = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + i);
        }
        var u = Na(a);
        if (u === null)
          return null;
        if (u.mode & yn) {
          var s = Ye(a) || "Component";
          if (!o0[s]) {
            o0[s] = !0;
            var f = hn;
            try {
              jt(u), a.mode & yn ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, s);
            } finally {
              f ? jt(f) : Cn();
            }
          }
        }
        return u.stateNode;
      }
    }
    function b1(e, t, a, i, u, s, f, p) {
      var v = !1, y = null;
      return w1(e, t, v, y, a, i, u, s, f);
    }
    function _1(e, t, a, i, u, s, f, p, v, y) {
      var g = !0, _ = w1(a, i, g, e, u, s, f, p, v);
      _.context = x1(null);
      var x = _.current, M = Ra(), U = $o(x), H = Mu(M, U);
      return H.callback = t ?? null, Uo(x, H, U), Db(_, U, M), _;
    }
    function Yp(e, t, a, i) {
      Lv(t, e);
      var u = t.current, s = Ra(), f = $o(u);
      ou(f);
      var p = x1(a);
      t.context === null ? t.context = p : t.pendingContext = p, Wr && hn !== null && !u0 && (u0 = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, Ye(hn) || "Unknown"));
      var v = Mu(s, f);
      v.payload = {
        element: e
      }, i = i === void 0 ? null : i, i !== null && (typeof i != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", i), v.callback = i);
      var y = Uo(u, v, f);
      return y !== null && (dr(y, u, f, s), $h(y, u, f)), f;
    }
    function zm(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case ie:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function T_(e) {
      switch (e.tag) {
        case re: {
          var t = e.stateNode;
          if (Pn(t)) {
            var a = ly(t);
            Nb(t, a);
          }
          break;
        }
        case be: {
          Au(function() {
            var u = Pa(e, Ae);
            if (u !== null) {
              var s = Ra();
              dr(u, e, Ae, s);
            }
          });
          var i = Ae;
          s0(e, i);
          break;
        }
      }
    }
    function k1(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = $v(a.retryLane, t));
    }
    function s0(e, t) {
      k1(e, t);
      var a = e.alternate;
      a && k1(a, t);
    }
    function w_(e) {
      if (e.tag === be) {
        var t = so, a = Pa(e, t);
        if (a !== null) {
          var i = Ra();
          dr(a, e, t, i);
        }
        s0(e, t);
      }
    }
    function x_(e) {
      if (e.tag === be) {
        var t = $o(e), a = Pa(e, t);
        if (a !== null) {
          var i = Ra();
          dr(a, e, t, i);
        }
        s0(e, t);
      }
    }
    function D1(e) {
      var t = kv(e);
      return t === null ? null : t.stateNode;
    }
    var O1 = function(e) {
      return null;
    };
    function b_(e) {
      return O1(e);
    }
    var L1 = function(e) {
      return !1;
    };
    function __(e) {
      return L1(e);
    }
    var M1 = null, N1 = null, z1 = null, U1 = null, A1 = null, F1 = null, H1 = null, j1 = null, V1 = null;
    {
      var P1 = function(e, t, a) {
        var i = t[a], u = vt(e) ? e.slice() : lt({}, e);
        return a + 1 === t.length ? (vt(u) ? u.splice(i, 1) : delete u[i], u) : (u[i] = P1(e[i], t, a + 1), u);
      }, B1 = function(e, t) {
        return P1(e, t, 0);
      }, $1 = function(e, t, a, i) {
        var u = t[i], s = vt(e) ? e.slice() : lt({}, e);
        if (i + 1 === t.length) {
          var f = a[i];
          s[f] = s[u], vt(s) ? s.splice(u, 1) : delete s[u];
        } else
          s[u] = $1(
            // $FlowFixMe number or string is fine here
            e[u],
            t,
            a,
            i + 1
          );
        return s;
      }, Y1 = function(e, t, a) {
        if (t.length !== a.length) {
          Je("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var i = 0; i < a.length - 1; i++)
            if (t[i] !== a[i]) {
              Je("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return $1(e, t, a, 0);
      }, I1 = function(e, t, a, i) {
        if (a >= t.length)
          return i;
        var u = t[a], s = vt(e) ? e.slice() : lt({}, e);
        return s[u] = I1(e[u], t, a + 1, i), s;
      }, Q1 = function(e, t, a) {
        return I1(e, t, 0, a);
      }, c0 = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      M1 = function(e, t, a, i) {
        var u = c0(e, t);
        if (u !== null) {
          var s = Q1(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = lt({}, e.memoizedProps);
          var f = Pa(e, Ae);
          f !== null && dr(f, e, Ae, Zt);
        }
      }, N1 = function(e, t, a) {
        var i = c0(e, t);
        if (i !== null) {
          var u = B1(i.memoizedState, a);
          i.memoizedState = u, i.baseState = u, e.memoizedProps = lt({}, e.memoizedProps);
          var s = Pa(e, Ae);
          s !== null && dr(s, e, Ae, Zt);
        }
      }, z1 = function(e, t, a, i) {
        var u = c0(e, t);
        if (u !== null) {
          var s = Y1(u.memoizedState, a, i);
          u.memoizedState = s, u.baseState = s, e.memoizedProps = lt({}, e.memoizedProps);
          var f = Pa(e, Ae);
          f !== null && dr(f, e, Ae, Zt);
        }
      }, U1 = function(e, t, a) {
        e.pendingProps = Q1(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pa(e, Ae);
        i !== null && dr(i, e, Ae, Zt);
      }, A1 = function(e, t) {
        e.pendingProps = B1(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Pa(e, Ae);
        a !== null && dr(a, e, Ae, Zt);
      }, F1 = function(e, t, a) {
        e.pendingProps = Y1(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Pa(e, Ae);
        i !== null && dr(i, e, Ae, Zt);
      }, H1 = function(e) {
        var t = Pa(e, Ae);
        t !== null && dr(t, e, Ae, Zt);
      }, j1 = function(e) {
        O1 = e;
      }, V1 = function(e) {
        L1 = e;
      };
    }
    function k_(e) {
      var t = Na(e);
      return t === null ? null : t.stateNode;
    }
    function D_(e) {
      return null;
    }
    function O_() {
      return hn;
    }
    function L_(e) {
      var t = e.findFiberByHostInstance, a = N.ReactCurrentDispatcher;
      return yd({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: M1,
        overrideHookStateDeletePath: N1,
        overrideHookStateRenamePath: z1,
        overrideProps: U1,
        overridePropsDeletePath: A1,
        overridePropsRenamePath: F1,
        setErrorHandler: j1,
        setSuspenseHandler: V1,
        scheduleUpdate: H1,
        currentDispatcherRef: a,
        findHostInstanceByFiber: k_,
        findFiberByHostInstance: t || D_,
        // React Refresh
        findHostInstancesForRefresh: u_,
        scheduleRefresh: i_,
        scheduleRoot: l_,
        setRefreshHandler: a_,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: O_,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: l0
      });
    }
    var W1 = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function f0(e) {
      this._internalRoot = e;
    }
    Um.prototype.render = f0.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : Am(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Mn) {
          var i = D1(t.current);
          i && i.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Yp(e, t, null, null);
    }, Um.prototype.unmount = f0.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        i1() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Au(function() {
          Yp(null, e, null, null);
        }), Q0(t);
      }
    };
    function M_(e, t) {
      if (!Am(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      G1(e);
      var a = !1, i = !1, u = "", s = W1;
      t != null && (t.hydrate ? Je("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === si && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (s = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var f = b1(e, Oh, null, a, i, u, s);
      Th(f.current, e);
      var p = e.nodeType === Mn ? e.parentNode : e;
      return Zd(p), new f0(f);
    }
    function Um(e) {
      this._internalRoot = e;
    }
    function N_(e) {
      e && Kv(e);
    }
    Um.prototype.unstable_scheduleHydration = N_;
    function z_(e, t, a) {
      if (!Am(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      G1(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var i = a ?? null, u = a != null && a.hydratedSources || null, s = !1, f = !1, p = "", v = W1;
      a != null && (a.unstable_strictMode === !0 && (s = !0), a.identifierPrefix !== void 0 && (p = a.identifierPrefix), a.onRecoverableError !== void 0 && (v = a.onRecoverableError));
      var y = _1(t, null, e, Oh, i, s, f, p, v);
      if (Th(y.current, e), Zd(e), u)
        for (var g = 0; g < u.length; g++) {
          var _ = u[g];
          Bw(y, _);
        }
      return new Um(y);
    }
    function Am(e) {
      return !!(e && (e.nodeType === qr || e.nodeType === Ja || e.nodeType === Jl || !le));
    }
    function Ip(e) {
      return !!(e && (e.nodeType === qr || e.nodeType === Ja || e.nodeType === Jl || e.nodeType === Mn && e.nodeValue === " react-mount-point-unstable "));
    }
    function G1(e) {
      e.nodeType === qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), sp(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var U_ = N.ReactCurrentOwner, q1;
    q1 = function(e) {
      if (e._reactRootContainer && e.nodeType !== Mn) {
        var t = D1(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, i = d0(e), u = !!(i && Oo(i));
      u && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === qr && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function d0(e) {
      return e ? e.nodeType === Ja ? e.documentElement : e.firstChild : null;
    }
    function X1() {
    }
    function A_(e, t, a, i, u) {
      if (u) {
        if (typeof i == "function") {
          var s = i;
          i = function() {
            var x = zm(f);
            s.call(x);
          };
        }
        var f = _1(
          t,
          i,
          e,
          Mo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          X1
        );
        e._reactRootContainer = f, Th(f.current, e);
        var p = e.nodeType === Mn ? e.parentNode : e;
        return Zd(p), Au(), f;
      } else {
        for (var v; v = e.lastChild; )
          e.removeChild(v);
        if (typeof i == "function") {
          var y = i;
          i = function() {
            var x = zm(g);
            y.call(x);
          };
        }
        var g = b1(
          e,
          Mo,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          X1
        );
        e._reactRootContainer = g, Th(g.current, e);
        var _ = e.nodeType === Mn ? e.parentNode : e;
        return Zd(_), Au(function() {
          Yp(t, g, a, i);
        }), g;
      }
    }
    function F_(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Fm(e, t, a, i, u) {
      q1(a), F_(u === void 0 ? null : u, "render");
      var s = a._reactRootContainer, f;
      if (!s)
        f = A_(a, t, e, u, i);
      else {
        if (f = s, typeof u == "function") {
          var p = u;
          u = function() {
            var v = zm(f);
            p.call(v);
          };
        }
        Yp(t, f, e, u);
      }
      return zm(f);
    }
    function H_(e) {
      {
        var t = U_.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", wt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === qr ? e : R_(e, "findDOMNode");
    }
    function j_(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Ip(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = sp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Fm(null, e, t, !0, a);
    }
    function V_(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Ip(t))
        throw new Error("Target container is not a DOM element.");
      {
        var i = sp(t) && t._reactRootContainer === void 0;
        i && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Fm(null, e, t, !1, a);
    }
    function P_(e, t, a, i) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Ip(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !ss(e))
        throw new Error("parentComponent must be a valid React Component");
      return Fm(e, t, a, !1, i);
    }
    function B_(e) {
      if (!Ip(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = sp(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = d0(e), i = a && !Oo(a);
          i && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Au(function() {
          Fm(null, null, e, !1, function() {
            e._reactRootContainer = null, Q0(e);
          });
        }), !0;
      } else {
        {
          var u = d0(e), s = !!(u && Oo(u)), f = e.nodeType === qr && Ip(e.parentNode) && !!e.parentNode._reactRootContainer;
          s && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", f ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    ve(T_), Iv(w_), ws(x_), zd(Aa), Wv(Cs), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), xv(IR), sc($S, zb, Au);
    function $_(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!Am(t))
        throw new Error("Target container is not a DOM element.");
      return C_(e, t, null, a);
    }
    function Y_(e, t, a, i) {
      return P_(e, t, a, i);
    }
    var p0 = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Oo, df, wh, oc, ls, $S]
    };
    function I_(e, t) {
      return p0.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), M_(e, t);
    }
    function Q_(e, t, a) {
      return p0.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), z_(e, t, a);
    }
    function W_(e) {
      return i1() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Au(e);
    }
    var G_ = L_({
      findFiberByHostInstance: zs,
      bundleType: 1,
      version: l0,
      rendererPackageName: "react-dom"
    });
    if (!G_ && dn && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var K1 = window.location.protocol;
      /^(https?|file):$/.test(K1) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (K1 === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Qa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = p0, Qa.createPortal = $_, Qa.createRoot = I_, Qa.findDOMNode = H_, Qa.flushSync = W_, Qa.hydrate = j_, Qa.hydrateRoot = Q_, Qa.render = V_, Qa.unmountComponentAtNode = B_, Qa.unstable_batchedUpdates = $S, Qa.unstable_renderSubtreeIntoContainer = Y_, Qa.version = l0, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Qa;
}
(function(B) {
  function W() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(W);
      } catch (N) {
        console.error(N);
      }
    }
  }
  process.env.NODE_ENV === "production" ? (W(), B.exports = ck()) : B.exports = fk();
})(lk);
var qp = y0;
if (process.env.NODE_ENV === "production")
  Xp.createRoot = qp.createRoot, Xp.hydrateRoot = qp.hydrateRoot;
else {
  var Hm = qp.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  Xp.createRoot = function(B, W) {
    Hm.usingClientEntryPoint = !0;
    try {
      return qp.createRoot(B, W);
    } finally {
      Hm.usingClientEntryPoint = !1;
    }
  }, Xp.hydrateRoot = function(B, W, N) {
    Hm.usingClientEntryPoint = !0;
    try {
      return qp.hydrateRoot(B, W, N);
    } finally {
      Hm.usingClientEntryPoint = !1;
    }
  };
}
const jm = ({
  primary: B = !1,
  size: W = "medium",
  backgroundColor: N,
  label: Nt = "Button",
  className: Yt,
  ...Je
}) => {
  const S = B ? "storybook-button--primary" : "storybook-button--secondary";
  return /* @__PURE__ */ Wa(
    "button",
    {
      type: "button",
      className: [
        "storybook-button",
        `storybook-button--${W}`,
        S,
        Yt ?? ""
      ].join(" "),
      style: { backgroundColor: N },
      ...Je,
      children: Nt
    }
  );
};
const dk = ({
  user: B,
  onLogin: W,
  onLogout: N,
  onCreateAccount: Nt,
  ...Yt
}) => /* @__PURE__ */ Wa("header", { ...Yt, children: /* @__PURE__ */ Ff("div", { className: "wrapper", children: [
  /* @__PURE__ */ Ff("div", { children: [
    /* @__PURE__ */ Wa(
      "svg",
      {
        width: "32",
        height: "32",
        viewBox: "0 0 32 32",
        xmlns: "http://www.w3.org/2000/svg",
        children: /* @__PURE__ */ Ff("g", { fill: "none", fillRule: "evenodd", children: [
          /* @__PURE__ */ Wa(
            "path",
            {
              d: "M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z",
              fill: "#FFF"
            }
          ),
          /* @__PURE__ */ Wa(
            "path",
            {
              d: "M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z",
              fill: "#555AB9"
            }
          ),
          /* @__PURE__ */ Wa(
            "path",
            {
              d: "M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z",
              fill: "#91BAF8"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ Wa("h1", { children: "Acme" })
  ] }),
  /* @__PURE__ */ Wa("div", { children: B ? /* @__PURE__ */ Ff(rR, { children: [
    /* @__PURE__ */ Ff("span", { className: "welcome", children: [
      "Welcome, ",
      /* @__PURE__ */ Wa("b", { children: B.name }),
      "!"
    ] }),
    /* @__PURE__ */ Wa(jm, { size: "small", onClick: N, label: "Log out" })
  ] }) : /* @__PURE__ */ Ff(rR, { children: [
    /* @__PURE__ */ Wa(jm, { size: "small", onClick: W, label: "Log in" }),
    /* @__PURE__ */ Wa(
      jm,
      {
        primary: !0,
        size: "small",
        onClick: Nt,
        label: "Sign up"
      }
    )
  ] }) })
] }) });
class sR {
  constructor(W, N) {
    v0(this, "reactRoot");
    v0(this, "component");
    this.reactRoot = Xp.createRoot(W), this.component = N;
  }
  render(W) {
    return new Promise((N) => {
      this.reactRoot.render(
        /* @__PURE__ */ Wa("div", { style: { display: "contents" }, ref: () => N(), children: /* @__PURE__ */ Wa(this.component, { ...W }) })
      );
    });
  }
  dispose() {
    this.reactRoot.unmount();
  }
}
const yk = [
  {
    framework: "react",
    path: "src/stories/Button.tsx",
    name: "Button",
    props: [
      {
        name: "primary",
        type: { type: "boolean" }
      },
      {
        name: "backgroundColor",
        type: { type: "string" }
      },
      {
        name: "size",
        type: {
          type: "enum",
          values: ["small", "medium", "large"]
        }
      },
      {
        name: "label",
        type: { type: "string" }
      }
    ],
    createRenderer: (B) => new sR(B, jm)
  },
  {
    framework: "react",
    path: "src/stories/Header.tsx",
    name: "Header",
    props: [],
    createRenderer: (B) => new sR(B, dk)
  }
];
export {
  yk as components
};
