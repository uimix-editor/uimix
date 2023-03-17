var Of = Object.defineProperty;
var Df = (E, M, m) => M in E ? Of(E, M, { enumerable: !0, configurable: !0, writable: !0, value: m }) : E[M] = m;
var Pu = (E, M, m) => (Df(E, typeof M != "symbol" ? M + "" : M, m), m);
var gr = {}, Ff = {
  get exports() {
    return gr;
  },
  set exports(E) {
    gr = E;
  }
}, yr = {}, Tl = {}, If = {
  get exports() {
    return Tl;
  },
  set exports(E) {
    Tl = E;
  }
}, D = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var xa;
function jf() {
  if (xa)
    return D;
  xa = 1;
  var E = Symbol.for("react.element"), M = Symbol.for("react.portal"), m = Symbol.for("react.fragment"), Se = Symbol.for("react.strict_mode"), ie = Symbol.for("react.profiler"), Ee = Symbol.for("react.provider"), me = Symbol.for("react.context"), se = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), _e = Symbol.for("react.memo"), ve = Symbol.for("react.lazy"), J = Symbol.iterator;
  function X(a) {
    return a === null || typeof a != "object" ? null : (a = J && a[J] || a["@@iterator"], typeof a == "function" ? a : null);
  }
  var He = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, $e = Object.assign, G = {};
  function H(a, h, N) {
    this.props = a, this.context = h, this.refs = G, this.updater = N || He;
  }
  H.prototype.isReactComponent = {}, H.prototype.setState = function(a, h) {
    if (typeof a != "object" && typeof a != "function" && a != null)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, h, "setState");
  }, H.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function hn() {
  }
  hn.prototype = H.prototype;
  function sn(a, h, N) {
    this.props = a, this.context = h, this.refs = G, this.updater = N || He;
  }
  var Je = sn.prototype = new hn();
  Je.constructor = sn, $e(Je, H.prototype), Je.isPureReactComponent = !0;
  var he = Array.isArray, qe = Object.prototype.hasOwnProperty, Ce = { current: null }, Ne = { key: !0, ref: !0, __self: !0, __source: !0 };
  function We(a, h, N) {
    var F, O = {}, W = null, U = null;
    if (h != null)
      for (F in h.ref !== void 0 && (U = h.ref), h.key !== void 0 && (W = "" + h.key), h)
        qe.call(h, F) && !Ne.hasOwnProperty(F) && (O[F] = h[F]);
    var $ = arguments.length - 2;
    if ($ === 1)
      O.children = N;
    else if (1 < $) {
      for (var A = Array($), Le = 0; Le < $; Le++)
        A[Le] = arguments[Le + 2];
      O.children = A;
    }
    if (a && a.defaultProps)
      for (F in $ = a.defaultProps, $)
        O[F] === void 0 && (O[F] = $[F]);
    return { $$typeof: E, type: a, key: W, ref: U, props: O, _owner: Ce.current };
  }
  function Pn(a, h) {
    return { $$typeof: E, type: a.type, key: h, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function yn(a) {
    return typeof a == "object" && a !== null && a.$$typeof === E;
  }
  function Kn(a) {
    var h = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(N) {
      return h[N];
    });
  }
  var an = /\/+/g;
  function je(a, h) {
    return typeof a == "object" && a !== null && a.key != null ? Kn("" + a.key) : h.toString(36);
  }
  function be(a, h, N, F, O) {
    var W = typeof a;
    (W === "undefined" || W === "boolean") && (a = null);
    var U = !1;
    if (a === null)
      U = !0;
    else
      switch (W) {
        case "string":
        case "number":
          U = !0;
          break;
        case "object":
          switch (a.$$typeof) {
            case E:
            case M:
              U = !0;
          }
      }
    if (U)
      return U = a, O = O(U), a = F === "" ? "." + je(U, 0) : F, he(O) ? (N = "", a != null && (N = a.replace(an, "$&/") + "/"), be(O, h, N, "", function(Le) {
        return Le;
      })) : O != null && (yn(O) && (O = Pn(O, N + (!O.key || U && U.key === O.key ? "" : ("" + O.key).replace(an, "$&/") + "/") + a)), h.push(O)), 1;
    if (U = 0, F = F === "" ? "." : F + ":", he(a))
      for (var $ = 0; $ < a.length; $++) {
        W = a[$];
        var A = F + je(W, $);
        U += be(W, h, N, A, O);
      }
    else if (A = X(a), typeof A == "function")
      for (a = A.call(a), $ = 0; !(W = a.next()).done; )
        W = W.value, A = F + je(W, $++), U += be(W, h, N, A, O);
    else if (W === "object")
      throw h = String(a), Error("Objects are not valid as a React child (found: " + (h === "[object Object]" ? "object with keys {" + Object.keys(a).join(", ") + "}" : h) + "). If you meant to render a collection of children, use an array instead.");
    return U;
  }
  function cn(a, h, N) {
    if (a == null)
      return a;
    var F = [], O = 0;
    return be(a, F, "", "", function(W) {
      return h.call(N, W, O++);
    }), F;
  }
  function ze(a) {
    if (a._status === -1) {
      var h = a._result;
      h = h(), h.then(function(N) {
        (a._status === 0 || a._status === -1) && (a._status = 1, a._result = N);
      }, function(N) {
        (a._status === 0 || a._status === -1) && (a._status = 2, a._result = N);
      }), a._status === -1 && (a._status = 0, a._result = h);
    }
    if (a._status === 1)
      return a._result.default;
    throw a._result;
  }
  var ee = { current: null }, k = { transition: null }, T = { ReactCurrentDispatcher: ee, ReactCurrentBatchConfig: k, ReactCurrentOwner: Ce };
  return D.Children = { map: cn, forEach: function(a, h, N) {
    cn(a, function() {
      h.apply(this, arguments);
    }, N);
  }, count: function(a) {
    var h = 0;
    return cn(a, function() {
      h++;
    }), h;
  }, toArray: function(a) {
    return cn(a, function(h) {
      return h;
    }) || [];
  }, only: function(a) {
    if (!yn(a))
      throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } }, D.Component = H, D.Fragment = m, D.Profiler = ie, D.PureComponent = sn, D.StrictMode = Se, D.Suspense = B, D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = T, D.cloneElement = function(a, h, N) {
    if (a == null)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var F = $e({}, a.props), O = a.key, W = a.ref, U = a._owner;
    if (h != null) {
      if (h.ref !== void 0 && (W = h.ref, U = Ce.current), h.key !== void 0 && (O = "" + h.key), a.type && a.type.defaultProps)
        var $ = a.type.defaultProps;
      for (A in h)
        qe.call(h, A) && !Ne.hasOwnProperty(A) && (F[A] = h[A] === void 0 && $ !== void 0 ? $[A] : h[A]);
    }
    var A = arguments.length - 2;
    if (A === 1)
      F.children = N;
    else if (1 < A) {
      $ = Array(A);
      for (var Le = 0; Le < A; Le++)
        $[Le] = arguments[Le + 2];
      F.children = $;
    }
    return { $$typeof: E, type: a.type, key: O, ref: W, props: F, _owner: U };
  }, D.createContext = function(a) {
    return a = { $$typeof: me, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, a.Provider = { $$typeof: Ee, _context: a }, a.Consumer = a;
  }, D.createElement = We, D.createFactory = function(a) {
    var h = We.bind(null, a);
    return h.type = a, h;
  }, D.createRef = function() {
    return { current: null };
  }, D.forwardRef = function(a) {
    return { $$typeof: se, render: a };
  }, D.isValidElement = yn, D.lazy = function(a) {
    return { $$typeof: ve, _payload: { _status: -1, _result: a }, _init: ze };
  }, D.memo = function(a, h) {
    return { $$typeof: _e, type: a, compare: h === void 0 ? null : h };
  }, D.startTransition = function(a) {
    var h = k.transition;
    k.transition = {};
    try {
      a();
    } finally {
      k.transition = h;
    }
  }, D.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  }, D.useCallback = function(a, h) {
    return ee.current.useCallback(a, h);
  }, D.useContext = function(a) {
    return ee.current.useContext(a);
  }, D.useDebugValue = function() {
  }, D.useDeferredValue = function(a) {
    return ee.current.useDeferredValue(a);
  }, D.useEffect = function(a, h) {
    return ee.current.useEffect(a, h);
  }, D.useId = function() {
    return ee.current.useId();
  }, D.useImperativeHandle = function(a, h, N) {
    return ee.current.useImperativeHandle(a, h, N);
  }, D.useInsertionEffect = function(a, h) {
    return ee.current.useInsertionEffect(a, h);
  }, D.useLayoutEffect = function(a, h) {
    return ee.current.useLayoutEffect(a, h);
  }, D.useMemo = function(a, h) {
    return ee.current.useMemo(a, h);
  }, D.useReducer = function(a, h, N) {
    return ee.current.useReducer(a, h, N);
  }, D.useRef = function(a) {
    return ee.current.useRef(a);
  }, D.useState = function(a) {
    return ee.current.useState(a);
  }, D.useSyncExternalStore = function(a, h, N) {
    return ee.current.useSyncExternalStore(a, h, N);
  }, D.useTransition = function() {
    return ee.current.useTransition();
  }, D.version = "18.2.0", D;
}
var Pa;
function Da() {
  return Pa || (Pa = 1, function(E) {
    E.exports = jf();
  }(If)), Tl;
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
var Na;
function Uf() {
  if (Na)
    return yr;
  Na = 1;
  var E = Da(), M = Symbol.for("react.element"), m = Symbol.for("react.fragment"), Se = Object.prototype.hasOwnProperty, ie = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, Ee = { key: !0, ref: !0, __self: !0, __source: !0 };
  function me(se, B, _e) {
    var ve, J = {}, X = null, He = null;
    _e !== void 0 && (X = "" + _e), B.key !== void 0 && (X = "" + B.key), B.ref !== void 0 && (He = B.ref);
    for (ve in B)
      Se.call(B, ve) && !Ee.hasOwnProperty(ve) && (J[ve] = B[ve]);
    if (se && se.defaultProps)
      for (ve in B = se.defaultProps, B)
        J[ve] === void 0 && (J[ve] = B[ve]);
    return { $$typeof: M, type: se, key: X, ref: He, props: J, _owner: ie.current };
  }
  return yr.Fragment = m, yr.jsx = me, yr.jsxs = me, yr;
}
(function(E) {
  E.exports = Uf();
})(Ff);
const za = gr.Fragment, Ie = gr.jsx, Rt = gr.jsxs;
var zu = {}, Lu = {}, Af = {
  get exports() {
    return Lu;
  },
  set exports(E) {
    Lu = E;
  }
}, Fe = {}, Rl = {}, Vf = {
  get exports() {
    return Rl;
  },
  set exports(E) {
    Rl = E;
  }
}, Nu = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var La;
function Bf() {
  return La || (La = 1, function(E) {
    function M(k, T) {
      var a = k.length;
      k.push(T);
      e:
        for (; 0 < a; ) {
          var h = a - 1 >>> 1, N = k[h];
          if (0 < ie(N, T))
            k[h] = T, k[a] = N, a = h;
          else
            break e;
        }
    }
    function m(k) {
      return k.length === 0 ? null : k[0];
    }
    function Se(k) {
      if (k.length === 0)
        return null;
      var T = k[0], a = k.pop();
      if (a !== T) {
        k[0] = a;
        e:
          for (var h = 0, N = k.length, F = N >>> 1; h < F; ) {
            var O = 2 * (h + 1) - 1, W = k[O], U = O + 1, $ = k[U];
            if (0 > ie(W, a))
              U < N && 0 > ie($, W) ? (k[h] = $, k[U] = a, h = U) : (k[h] = W, k[O] = a, h = O);
            else if (U < N && 0 > ie($, a))
              k[h] = $, k[U] = a, h = U;
            else
              break e;
          }
      }
      return T;
    }
    function ie(k, T) {
      var a = k.sortIndex - T.sortIndex;
      return a !== 0 ? a : k.id - T.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var Ee = performance;
      E.unstable_now = function() {
        return Ee.now();
      };
    } else {
      var me = Date, se = me.now();
      E.unstable_now = function() {
        return me.now() - se;
      };
    }
    var B = [], _e = [], ve = 1, J = null, X = 3, He = !1, $e = !1, G = !1, H = typeof setTimeout == "function" ? setTimeout : null, hn = typeof clearTimeout == "function" ? clearTimeout : null, sn = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Je(k) {
      for (var T = m(_e); T !== null; ) {
        if (T.callback === null)
          Se(_e);
        else if (T.startTime <= k)
          Se(_e), T.sortIndex = T.expirationTime, M(B, T);
        else
          break;
        T = m(_e);
      }
    }
    function he(k) {
      if (G = !1, Je(k), !$e)
        if (m(B) !== null)
          $e = !0, ze(qe);
        else {
          var T = m(_e);
          T !== null && ee(he, T.startTime - k);
        }
    }
    function qe(k, T) {
      $e = !1, G && (G = !1, hn(We), We = -1), He = !0;
      var a = X;
      try {
        for (Je(T), J = m(B); J !== null && (!(J.expirationTime > T) || k && !Kn()); ) {
          var h = J.callback;
          if (typeof h == "function") {
            J.callback = null, X = J.priorityLevel;
            var N = h(J.expirationTime <= T);
            T = E.unstable_now(), typeof N == "function" ? J.callback = N : J === m(B) && Se(B), Je(T);
          } else
            Se(B);
          J = m(B);
        }
        if (J !== null)
          var F = !0;
        else {
          var O = m(_e);
          O !== null && ee(he, O.startTime - T), F = !1;
        }
        return F;
      } finally {
        J = null, X = a, He = !1;
      }
    }
    var Ce = !1, Ne = null, We = -1, Pn = 5, yn = -1;
    function Kn() {
      return !(E.unstable_now() - yn < Pn);
    }
    function an() {
      if (Ne !== null) {
        var k = E.unstable_now();
        yn = k;
        var T = !0;
        try {
          T = Ne(!0, k);
        } finally {
          T ? je() : (Ce = !1, Ne = null);
        }
      } else
        Ce = !1;
    }
    var je;
    if (typeof sn == "function")
      je = function() {
        sn(an);
      };
    else if (typeof MessageChannel < "u") {
      var be = new MessageChannel(), cn = be.port2;
      be.port1.onmessage = an, je = function() {
        cn.postMessage(null);
      };
    } else
      je = function() {
        H(an, 0);
      };
    function ze(k) {
      Ne = k, Ce || (Ce = !0, je());
    }
    function ee(k, T) {
      We = H(function() {
        k(E.unstable_now());
      }, T);
    }
    E.unstable_IdlePriority = 5, E.unstable_ImmediatePriority = 1, E.unstable_LowPriority = 4, E.unstable_NormalPriority = 3, E.unstable_Profiling = null, E.unstable_UserBlockingPriority = 2, E.unstable_cancelCallback = function(k) {
      k.callback = null;
    }, E.unstable_continueExecution = function() {
      $e || He || ($e = !0, ze(qe));
    }, E.unstable_forceFrameRate = function(k) {
      0 > k || 125 < k ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Pn = 0 < k ? Math.floor(1e3 / k) : 5;
    }, E.unstable_getCurrentPriorityLevel = function() {
      return X;
    }, E.unstable_getFirstCallbackNode = function() {
      return m(B);
    }, E.unstable_next = function(k) {
      switch (X) {
        case 1:
        case 2:
        case 3:
          var T = 3;
          break;
        default:
          T = X;
      }
      var a = X;
      X = T;
      try {
        return k();
      } finally {
        X = a;
      }
    }, E.unstable_pauseExecution = function() {
    }, E.unstable_requestPaint = function() {
    }, E.unstable_runWithPriority = function(k, T) {
      switch (k) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          k = 3;
      }
      var a = X;
      X = k;
      try {
        return T();
      } finally {
        X = a;
      }
    }, E.unstable_scheduleCallback = function(k, T, a) {
      var h = E.unstable_now();
      switch (typeof a == "object" && a !== null ? (a = a.delay, a = typeof a == "number" && 0 < a ? h + a : h) : a = h, k) {
        case 1:
          var N = -1;
          break;
        case 2:
          N = 250;
          break;
        case 5:
          N = 1073741823;
          break;
        case 4:
          N = 1e4;
          break;
        default:
          N = 5e3;
      }
      return N = a + N, k = { id: ve++, callback: T, priorityLevel: k, startTime: a, expirationTime: N, sortIndex: -1 }, a > h ? (k.sortIndex = a, M(_e, k), m(B) === null && k === m(_e) && (G ? (hn(We), We = -1) : G = !0, ee(he, a - h))) : (k.sortIndex = N, M(B, k), $e || He || ($e = !0, ze(qe))), k;
    }, E.unstable_shouldYield = Kn, E.unstable_wrapCallback = function(k) {
      var T = X;
      return function() {
        var a = X;
        X = T;
        try {
          return k.apply(this, arguments);
        } finally {
          X = a;
        }
      };
    };
  }(Nu)), Nu;
}
var Ta;
function Hf() {
  return Ta || (Ta = 1, function(E) {
    E.exports = Bf();
  }(Vf)), Rl;
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
var Ra;
function $f() {
  if (Ra)
    return Fe;
  Ra = 1;
  var E = Da(), M = Hf();
  function m(e) {
    for (var n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, t = 1; t < arguments.length; t++)
      n += "&args[]=" + encodeURIComponent(arguments[t]);
    return "Minified React error #" + e + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var Se = /* @__PURE__ */ new Set(), ie = {};
  function Ee(e, n) {
    me(e, n), me(e + "Capture", n);
  }
  function me(e, n) {
    for (ie[e] = n, e = 0; e < n.length; e++)
      Se.add(n[e]);
  }
  var se = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), B = Object.prototype.hasOwnProperty, _e = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, ve = {}, J = {};
  function X(e) {
    return B.call(J, e) ? !0 : B.call(ve, e) ? !1 : _e.test(e) ? J[e] = !0 : (ve[e] = !0, !1);
  }
  function He(e, n, t, r) {
    if (t !== null && t.type === 0)
      return !1;
    switch (typeof n) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r ? !1 : t !== null ? !t.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function $e(e, n, t, r) {
    if (n === null || typeof n > "u" || He(e, n, t, r))
      return !0;
    if (r)
      return !1;
    if (t !== null)
      switch (t.type) {
        case 3:
          return !n;
        case 4:
          return n === !1;
        case 5:
          return isNaN(n);
        case 6:
          return isNaN(n) || 1 > n;
      }
    return !1;
  }
  function G(e, n, t, r, l, o, u) {
    this.acceptsBooleans = n === 2 || n === 3 || n === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = t, this.propertyName = e, this.type = n, this.sanitizeURL = o, this.removeEmptyString = u;
  }
  var H = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    H[e] = new G(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var n = e[0];
    H[n] = new G(n, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    H[e] = new G(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    H[e] = new G(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    H[e] = new G(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    H[e] = new G(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    H[e] = new G(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    H[e] = new G(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    H[e] = new G(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var hn = /[\-:]([a-z])/g;
  function sn(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var n = e.replace(
      hn,
      sn
    );
    H[n] = new G(n, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var n = e.replace(hn, sn);
    H[n] = new G(n, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var n = e.replace(hn, sn);
    H[n] = new G(n, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    H[e] = new G(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), H.xlinkHref = new G("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    H[e] = new G(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function Je(e, n, t, r) {
    var l = H.hasOwnProperty(n) ? H[n] : null;
    (l !== null ? l.type !== 0 : r || !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && ($e(n, t, l, r) && (t = null), r || l === null ? X(n) && (t === null ? e.removeAttribute(n) : e.setAttribute(n, "" + t)) : l.mustUseProperty ? e[l.propertyName] = t === null ? l.type === 3 ? !1 : "" : t : (n = l.attributeName, r = l.attributeNamespace, t === null ? e.removeAttribute(n) : (l = l.type, t = l === 3 || l === 4 && t === !0 ? "" : "" + t, r ? e.setAttributeNS(r, n, t) : e.setAttribute(n, t))));
  }
  var he = E.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, qe = Symbol.for("react.element"), Ce = Symbol.for("react.portal"), Ne = Symbol.for("react.fragment"), We = Symbol.for("react.strict_mode"), Pn = Symbol.for("react.profiler"), yn = Symbol.for("react.provider"), Kn = Symbol.for("react.context"), an = Symbol.for("react.forward_ref"), je = Symbol.for("react.suspense"), be = Symbol.for("react.suspense_list"), cn = Symbol.for("react.memo"), ze = Symbol.for("react.lazy"), ee = Symbol.for("react.offscreen"), k = Symbol.iterator;
  function T(e) {
    return e === null || typeof e != "object" ? null : (e = k && e[k] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var a = Object.assign, h;
  function N(e) {
    if (h === void 0)
      try {
        throw Error();
      } catch (t) {
        var n = t.stack.trim().match(/\n( *(at )?)/);
        h = n && n[1] || "";
      }
    return `
` + h + e;
  }
  var F = !1;
  function O(e, n) {
    if (!e || F)
      return "";
    F = !0;
    var t = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (n)
        if (n = function() {
          throw Error();
        }, Object.defineProperty(n.prototype, "props", { set: function() {
          throw Error();
        } }), typeof Reflect == "object" && Reflect.construct) {
          try {
            Reflect.construct(n, []);
          } catch (p) {
            var r = p;
          }
          Reflect.construct(e, [], n);
        } else {
          try {
            n.call();
          } catch (p) {
            r = p;
          }
          e.call(n.prototype);
        }
      else {
        try {
          throw Error();
        } catch (p) {
          r = p;
        }
        e();
      }
    } catch (p) {
      if (p && r && typeof p.stack == "string") {
        for (var l = p.stack.split(`
`), o = r.stack.split(`
`), u = l.length - 1, i = o.length - 1; 1 <= u && 0 <= i && l[u] !== o[i]; )
          i--;
        for (; 1 <= u && 0 <= i; u--, i--)
          if (l[u] !== o[i]) {
            if (u !== 1 || i !== 1)
              do
                if (u--, i--, 0 > i || l[u] !== o[i]) {
                  var s = `
` + l[u].replace(" at new ", " at ");
                  return e.displayName && s.includes("<anonymous>") && (s = s.replace("<anonymous>", e.displayName)), s;
                }
              while (1 <= u && 0 <= i);
            break;
          }
      }
    } finally {
      F = !1, Error.prepareStackTrace = t;
    }
    return (e = e ? e.displayName || e.name : "") ? N(e) : "";
  }
  function W(e) {
    switch (e.tag) {
      case 5:
        return N(e.type);
      case 16:
        return N("Lazy");
      case 13:
        return N("Suspense");
      case 19:
        return N("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = O(e.type, !1), e;
      case 11:
        return e = O(e.type.render, !1), e;
      case 1:
        return e = O(e.type, !0), e;
      default:
        return "";
    }
  }
  function U(e) {
    if (e == null)
      return null;
    if (typeof e == "function")
      return e.displayName || e.name || null;
    if (typeof e == "string")
      return e;
    switch (e) {
      case Ne:
        return "Fragment";
      case Ce:
        return "Portal";
      case Pn:
        return "Profiler";
      case We:
        return "StrictMode";
      case je:
        return "Suspense";
      case be:
        return "SuspenseList";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case Kn:
          return (e.displayName || "Context") + ".Consumer";
        case yn:
          return (e._context.displayName || "Context") + ".Provider";
        case an:
          var n = e.render;
          return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case cn:
          return n = e.displayName || null, n !== null ? n : U(e.type) || "Memo";
        case ze:
          n = e._payload, e = e._init;
          try {
            return U(e(n));
          } catch {
          }
      }
    return null;
  }
  function $(e) {
    var n = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (n.displayName || "Context") + ".Consumer";
      case 10:
        return (n._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = n.render, e = e.displayName || e.name || "", n.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return n;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return U(n);
      case 8:
        return n === We ? "StrictMode" : "Mode";
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
        if (typeof n == "function")
          return n.displayName || n.name || null;
        if (typeof n == "string")
          return n;
    }
    return null;
  }
  function A(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Le(e) {
    var n = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
  }
  function Fa(e) {
    var n = Le(e) ? "checked" : "value", t = Object.getOwnPropertyDescriptor(e.constructor.prototype, n), r = "" + e[n];
    if (!e.hasOwnProperty(n) && typeof t < "u" && typeof t.get == "function" && typeof t.set == "function") {
      var l = t.get, o = t.set;
      return Object.defineProperty(e, n, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(u) {
        r = "" + u, o.call(this, u);
      } }), Object.defineProperty(e, n, { enumerable: t.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(u) {
        r = "" + u;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[n];
      } };
    }
  }
  function wr(e) {
    e._valueTracker || (e._valueTracker = Fa(e));
  }
  function Tu(e) {
    if (!e)
      return !1;
    var n = e._valueTracker;
    if (!n)
      return !0;
    var t = n.getValue(), r = "";
    return e && (r = Le(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== t ? (n.setValue(e), !0) : !1;
  }
  function kr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Ml(e, n) {
    var t = n.checked;
    return a({}, n, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: t ?? e._wrapperState.initialChecked });
  }
  function Ru(e, n) {
    var t = n.defaultValue == null ? "" : n.defaultValue, r = n.checked != null ? n.checked : n.defaultChecked;
    t = A(n.value != null ? n.value : t), e._wrapperState = { initialChecked: r, initialValue: t, controlled: n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null };
  }
  function Mu(e, n) {
    n = n.checked, n != null && Je(e, "checked", n, !1);
  }
  function Ol(e, n) {
    Mu(e, n);
    var t = A(n.value), r = n.type;
    if (t != null)
      r === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + t) : e.value !== "" + t && (e.value = "" + t);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    n.hasOwnProperty("value") ? Dl(e, n.type, t) : n.hasOwnProperty("defaultValue") && Dl(e, n.type, A(n.defaultValue)), n.checked == null && n.defaultChecked != null && (e.defaultChecked = !!n.defaultChecked);
  }
  function Ou(e, n, t) {
    if (n.hasOwnProperty("value") || n.hasOwnProperty("defaultValue")) {
      var r = n.type;
      if (!(r !== "submit" && r !== "reset" || n.value !== void 0 && n.value !== null))
        return;
      n = "" + e._wrapperState.initialValue, t || n === e.value || (e.value = n), e.defaultValue = n;
    }
    t = e.name, t !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, t !== "" && (e.name = t);
  }
  function Dl(e, n, t) {
    (n !== "number" || kr(e.ownerDocument) !== e) && (t == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + t && (e.defaultValue = "" + t));
  }
  var Mt = Array.isArray;
  function ut(e, n, t, r) {
    if (e = e.options, n) {
      n = {};
      for (var l = 0; l < t.length; l++)
        n["$" + t[l]] = !0;
      for (t = 0; t < e.length; t++)
        l = n.hasOwnProperty("$" + e[t].value), e[t].selected !== l && (e[t].selected = l), l && r && (e[t].defaultSelected = !0);
    } else {
      for (t = "" + A(t), n = null, l = 0; l < e.length; l++) {
        if (e[l].value === t) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        n !== null || e[l].disabled || (n = e[l]);
      }
      n !== null && (n.selected = !0);
    }
  }
  function Fl(e, n) {
    if (n.dangerouslySetInnerHTML != null)
      throw Error(m(91));
    return a({}, n, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Du(e, n) {
    var t = n.value;
    if (t == null) {
      if (t = n.children, n = n.defaultValue, t != null) {
        if (n != null)
          throw Error(m(92));
        if (Mt(t)) {
          if (1 < t.length)
            throw Error(m(93));
          t = t[0];
        }
        n = t;
      }
      n == null && (n = ""), t = n;
    }
    e._wrapperState = { initialValue: A(t) };
  }
  function Fu(e, n) {
    var t = A(n.value), r = A(n.defaultValue);
    t != null && (t = "" + t, t !== e.value && (e.value = t), n.defaultValue == null && e.defaultValue !== t && (e.defaultValue = t)), r != null && (e.defaultValue = "" + r);
  }
  function Iu(e) {
    var n = e.textContent;
    n === e._wrapperState.initialValue && n !== "" && n !== null && (e.value = n);
  }
  function ju(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Il(e, n) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? ju(n) : e === "http://www.w3.org/2000/svg" && n === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Sr, Uu = function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(n, t, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(n, t, r, l);
      });
    } : e;
  }(function(e, n) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = n;
    else {
      for (Sr = Sr || document.createElement("div"), Sr.innerHTML = "<svg>" + n.valueOf().toString() + "</svg>", n = Sr.firstChild; e.firstChild; )
        e.removeChild(e.firstChild);
      for (; n.firstChild; )
        e.appendChild(n.firstChild);
    }
  });
  function Ot(e, n) {
    if (n) {
      var t = e.firstChild;
      if (t && t === e.lastChild && t.nodeType === 3) {
        t.nodeValue = n;
        return;
      }
    }
    e.textContent = n;
  }
  var Dt = {
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
  }, Ia = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Dt).forEach(function(e) {
    Ia.forEach(function(n) {
      n = n + e.charAt(0).toUpperCase() + e.substring(1), Dt[n] = Dt[e];
    });
  });
  function Au(e, n, t) {
    return n == null || typeof n == "boolean" || n === "" ? "" : t || typeof n != "number" || n === 0 || Dt.hasOwnProperty(e) && Dt[e] ? ("" + n).trim() : n + "px";
  }
  function Vu(e, n) {
    e = e.style;
    for (var t in n)
      if (n.hasOwnProperty(t)) {
        var r = t.indexOf("--") === 0, l = Au(t, n[t], r);
        t === "float" && (t = "cssFloat"), r ? e.setProperty(t, l) : e[t] = l;
      }
  }
  var ja = a({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function jl(e, n) {
    if (n) {
      if (ja[e] && (n.children != null || n.dangerouslySetInnerHTML != null))
        throw Error(m(137, e));
      if (n.dangerouslySetInnerHTML != null) {
        if (n.children != null)
          throw Error(m(60));
        if (typeof n.dangerouslySetInnerHTML != "object" || !("__html" in n.dangerouslySetInnerHTML))
          throw Error(m(61));
      }
      if (n.style != null && typeof n.style != "object")
        throw Error(m(62));
    }
  }
  function Ul(e, n) {
    if (e.indexOf("-") === -1)
      return typeof n.is == "string";
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
  var Al = null;
  function Vl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Bl = null, it = null, st = null;
  function Bu(e) {
    if (e = tr(e)) {
      if (typeof Bl != "function")
        throw Error(m(280));
      var n = e.stateNode;
      n && (n = Wr(n), Bl(e.stateNode, e.type, n));
    }
  }
  function Hu(e) {
    it ? st ? st.push(e) : st = [e] : it = e;
  }
  function $u() {
    if (it) {
      var e = it, n = st;
      if (st = it = null, Bu(e), n)
        for (e = 0; e < n.length; e++)
          Bu(n[e]);
    }
  }
  function Wu(e, n) {
    return e(n);
  }
  function Qu() {
  }
  var Hl = !1;
  function Ku(e, n, t) {
    if (Hl)
      return e(n, t);
    Hl = !0;
    try {
      return Wu(e, n, t);
    } finally {
      Hl = !1, (it !== null || st !== null) && (Qu(), $u());
    }
  }
  function Ft(e, n) {
    var t = e.stateNode;
    if (t === null)
      return null;
    var r = Wr(t);
    if (r === null)
      return null;
    t = r[n];
    e:
      switch (n) {
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
          (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
          break e;
        default:
          e = !1;
      }
    if (e)
      return null;
    if (t && typeof t != "function")
      throw Error(m(231, n, typeof t));
    return t;
  }
  var $l = !1;
  if (se)
    try {
      var It = {};
      Object.defineProperty(It, "passive", { get: function() {
        $l = !0;
      } }), window.addEventListener("test", It, It), window.removeEventListener("test", It, It);
    } catch {
      $l = !1;
    }
  function Ua(e, n, t, r, l, o, u, i, s) {
    var p = Array.prototype.slice.call(arguments, 3);
    try {
      n.apply(t, p);
    } catch (y) {
      this.onError(y);
    }
  }
  var jt = !1, Er = null, _r = !1, Wl = null, Aa = { onError: function(e) {
    jt = !0, Er = e;
  } };
  function Va(e, n, t, r, l, o, u, i, s) {
    jt = !1, Er = null, Ua.apply(Aa, arguments);
  }
  function Ba(e, n, t, r, l, o, u, i, s) {
    if (Va.apply(this, arguments), jt) {
      if (jt) {
        var p = Er;
        jt = !1, Er = null;
      } else
        throw Error(m(198));
      _r || (_r = !0, Wl = p);
    }
  }
  function Yn(e) {
    var n = e, t = e;
    if (e.alternate)
      for (; n.return; )
        n = n.return;
    else {
      e = n;
      do
        n = e, n.flags & 4098 && (t = n.return), e = n.return;
      while (e);
    }
    return n.tag === 3 ? t : null;
  }
  function Yu(e) {
    if (e.tag === 13) {
      var n = e.memoizedState;
      if (n === null && (e = e.alternate, e !== null && (n = e.memoizedState)), n !== null)
        return n.dehydrated;
    }
    return null;
  }
  function Xu(e) {
    if (Yn(e) !== e)
      throw Error(m(188));
  }
  function Ha(e) {
    var n = e.alternate;
    if (!n) {
      if (n = Yn(e), n === null)
        throw Error(m(188));
      return n !== e ? null : e;
    }
    for (var t = e, r = n; ; ) {
      var l = t.return;
      if (l === null)
        break;
      var o = l.alternate;
      if (o === null) {
        if (r = l.return, r !== null) {
          t = r;
          continue;
        }
        break;
      }
      if (l.child === o.child) {
        for (o = l.child; o; ) {
          if (o === t)
            return Xu(l), e;
          if (o === r)
            return Xu(l), n;
          o = o.sibling;
        }
        throw Error(m(188));
      }
      if (t.return !== r.return)
        t = l, r = o;
      else {
        for (var u = !1, i = l.child; i; ) {
          if (i === t) {
            u = !0, t = l, r = o;
            break;
          }
          if (i === r) {
            u = !0, r = l, t = o;
            break;
          }
          i = i.sibling;
        }
        if (!u) {
          for (i = o.child; i; ) {
            if (i === t) {
              u = !0, t = o, r = l;
              break;
            }
            if (i === r) {
              u = !0, r = o, t = l;
              break;
            }
            i = i.sibling;
          }
          if (!u)
            throw Error(m(189));
        }
      }
      if (t.alternate !== r)
        throw Error(m(190));
    }
    if (t.tag !== 3)
      throw Error(m(188));
    return t.stateNode.current === t ? e : n;
  }
  function Gu(e) {
    return e = Ha(e), e !== null ? Zu(e) : null;
  }
  function Zu(e) {
    if (e.tag === 5 || e.tag === 6)
      return e;
    for (e = e.child; e !== null; ) {
      var n = Zu(e);
      if (n !== null)
        return n;
      e = e.sibling;
    }
    return null;
  }
  var Ju = M.unstable_scheduleCallback, qu = M.unstable_cancelCallback, $a = M.unstable_shouldYield, Wa = M.unstable_requestPaint, te = M.unstable_now, Qa = M.unstable_getCurrentPriorityLevel, Ql = M.unstable_ImmediatePriority, bu = M.unstable_UserBlockingPriority, Cr = M.unstable_NormalPriority, Ka = M.unstable_LowPriority, ei = M.unstable_IdlePriority, xr = null, fn = null;
  function Ya(e) {
    if (fn && typeof fn.onCommitFiberRoot == "function")
      try {
        fn.onCommitFiberRoot(xr, e, void 0, (e.current.flags & 128) === 128);
      } catch {
      }
  }
  var en = Math.clz32 ? Math.clz32 : Za, Xa = Math.log, Ga = Math.LN2;
  function Za(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Xa(e) / Ga | 0) | 0;
  }
  var Pr = 64, Nr = 4194304;
  function Ut(e) {
    switch (e & -e) {
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
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function zr(e, n) {
    var t = e.pendingLanes;
    if (t === 0)
      return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, u = t & 268435455;
    if (u !== 0) {
      var i = u & ~l;
      i !== 0 ? r = Ut(i) : (o &= u, o !== 0 && (r = Ut(o)));
    } else
      u = t & ~l, u !== 0 ? r = Ut(u) : o !== 0 && (r = Ut(o));
    if (r === 0)
      return 0;
    if (n !== 0 && n !== r && !(n & l) && (l = r & -r, o = n & -n, l >= o || l === 16 && (o & 4194240) !== 0))
      return n;
    if (r & 4 && (r |= t & 16), n = e.entangledLanes, n !== 0)
      for (e = e.entanglements, n &= r; 0 < n; )
        t = 31 - en(n), l = 1 << t, r |= e[t], n &= ~l;
    return r;
  }
  function Ja(e, n) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return n + 250;
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
        return n + 5e3;
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
  function qa(e, n) {
    for (var t = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var u = 31 - en(o), i = 1 << u, s = l[u];
      s === -1 ? (!(i & t) || i & r) && (l[u] = Ja(i, n)) : s <= n && (e.expiredLanes |= i), o &= ~i;
    }
  }
  function Kl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ni() {
    var e = Pr;
    return Pr <<= 1, !(Pr & 4194240) && (Pr = 64), e;
  }
  function Yl(e) {
    for (var n = [], t = 0; 31 > t; t++)
      n.push(e);
    return n;
  }
  function At(e, n, t) {
    e.pendingLanes |= n, n !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, n = 31 - en(n), e[n] = t;
  }
  function ba(e, n) {
    var t = e.pendingLanes & ~n;
    e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= n, e.mutableReadLanes &= n, e.entangledLanes &= n, n = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < t; ) {
      var l = 31 - en(t), o = 1 << l;
      n[l] = 0, r[l] = -1, e[l] = -1, t &= ~o;
    }
  }
  function Xl(e, n) {
    var t = e.entangledLanes |= n;
    for (e = e.entanglements; t; ) {
      var r = 31 - en(t), l = 1 << r;
      l & n | e[r] & n && (e[r] |= n), t &= ~l;
    }
  }
  var V = 0;
  function ti(e) {
    return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var ri, Gl, li, oi, ui, Zl = !1, Lr = [], Nn = null, zn = null, Ln = null, Vt = /* @__PURE__ */ new Map(), Bt = /* @__PURE__ */ new Map(), Tn = [], ec = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ii(e, n) {
    switch (e) {
      case "focusin":
      case "focusout":
        Nn = null;
        break;
      case "dragenter":
      case "dragleave":
        zn = null;
        break;
      case "mouseover":
      case "mouseout":
        Ln = null;
        break;
      case "pointerover":
      case "pointerout":
        Vt.delete(n.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Bt.delete(n.pointerId);
    }
  }
  function Ht(e, n, t, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: n, domEventName: t, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, n !== null && (n = tr(n), n !== null && Gl(n)), e) : (e.eventSystemFlags |= r, n = e.targetContainers, l !== null && n.indexOf(l) === -1 && n.push(l), e);
  }
  function nc(e, n, t, r, l) {
    switch (n) {
      case "focusin":
        return Nn = Ht(Nn, e, n, t, r, l), !0;
      case "dragenter":
        return zn = Ht(zn, e, n, t, r, l), !0;
      case "mouseover":
        return Ln = Ht(Ln, e, n, t, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return Vt.set(o, Ht(Vt.get(o) || null, e, n, t, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, Bt.set(o, Ht(Bt.get(o) || null, e, n, t, r, l)), !0;
    }
    return !1;
  }
  function si(e) {
    var n = Xn(e.target);
    if (n !== null) {
      var t = Yn(n);
      if (t !== null) {
        if (n = t.tag, n === 13) {
          if (n = Yu(t), n !== null) {
            e.blockedOn = n, ui(e.priority, function() {
              li(t);
            });
            return;
          }
        } else if (n === 3 && t.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Tr(e) {
    if (e.blockedOn !== null)
      return !1;
    for (var n = e.targetContainers; 0 < n.length; ) {
      var t = ql(e.domEventName, e.eventSystemFlags, n[0], e.nativeEvent);
      if (t === null) {
        t = e.nativeEvent;
        var r = new t.constructor(t.type, t);
        Al = r, t.target.dispatchEvent(r), Al = null;
      } else
        return n = tr(t), n !== null && Gl(n), e.blockedOn = t, !1;
      n.shift();
    }
    return !0;
  }
  function ai(e, n, t) {
    Tr(e) && t.delete(n);
  }
  function tc() {
    Zl = !1, Nn !== null && Tr(Nn) && (Nn = null), zn !== null && Tr(zn) && (zn = null), Ln !== null && Tr(Ln) && (Ln = null), Vt.forEach(ai), Bt.forEach(ai);
  }
  function $t(e, n) {
    e.blockedOn === n && (e.blockedOn = null, Zl || (Zl = !0, M.unstable_scheduleCallback(M.unstable_NormalPriority, tc)));
  }
  function Wt(e) {
    function n(l) {
      return $t(l, e);
    }
    if (0 < Lr.length) {
      $t(Lr[0], e);
      for (var t = 1; t < Lr.length; t++) {
        var r = Lr[t];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Nn !== null && $t(Nn, e), zn !== null && $t(zn, e), Ln !== null && $t(Ln, e), Vt.forEach(n), Bt.forEach(n), t = 0; t < Tn.length; t++)
      r = Tn[t], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < Tn.length && (t = Tn[0], t.blockedOn === null); )
      si(t), t.blockedOn === null && Tn.shift();
  }
  var at = he.ReactCurrentBatchConfig, Rr = !0;
  function rc(e, n, t, r) {
    var l = V, o = at.transition;
    at.transition = null;
    try {
      V = 1, Jl(e, n, t, r);
    } finally {
      V = l, at.transition = o;
    }
  }
  function lc(e, n, t, r) {
    var l = V, o = at.transition;
    at.transition = null;
    try {
      V = 4, Jl(e, n, t, r);
    } finally {
      V = l, at.transition = o;
    }
  }
  function Jl(e, n, t, r) {
    if (Rr) {
      var l = ql(e, n, t, r);
      if (l === null)
        ho(e, n, r, Mr, t), ii(e, r);
      else if (nc(l, e, n, t, r))
        r.stopPropagation();
      else if (ii(e, r), n & 4 && -1 < ec.indexOf(e)) {
        for (; l !== null; ) {
          var o = tr(l);
          if (o !== null && ri(o), o = ql(e, n, t, r), o === null && ho(e, n, r, Mr, t), o === l)
            break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else
        ho(e, n, r, null, t);
    }
  }
  var Mr = null;
  function ql(e, n, t, r) {
    if (Mr = null, e = Vl(r), e = Xn(e), e !== null)
      if (n = Yn(e), n === null)
        e = null;
      else if (t = n.tag, t === 13) {
        if (e = Yu(n), e !== null)
          return e;
        e = null;
      } else if (t === 3) {
        if (n.stateNode.current.memoizedState.isDehydrated)
          return n.tag === 3 ? n.stateNode.containerInfo : null;
        e = null;
      } else
        n !== e && (e = null);
    return Mr = e, null;
  }
  function ci(e) {
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
        switch (Qa()) {
          case Ql:
            return 1;
          case bu:
            return 4;
          case Cr:
          case Ka:
            return 16;
          case ei:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Rn = null, bl = null, Or = null;
  function fi() {
    if (Or)
      return Or;
    var e, n = bl, t = n.length, r, l = "value" in Rn ? Rn.value : Rn.textContent, o = l.length;
    for (e = 0; e < t && n[e] === l[e]; e++)
      ;
    var u = t - e;
    for (r = 1; r <= u && n[t - r] === l[o - r]; r++)
      ;
    return Or = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Dr(e) {
    var n = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && n === 13 && (e = 13)) : e = n, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Fr() {
    return !0;
  }
  function di() {
    return !1;
  }
  function Ue(e) {
    function n(t, r, l, o, u) {
      this._reactName = t, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = u, this.currentTarget = null;
      for (var i in e)
        e.hasOwnProperty(i) && (t = e[i], this[i] = t ? t(o) : o[i]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Fr : di, this.isPropagationStopped = di, this;
    }
    return a(n.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var t = this.nativeEvent;
      t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue != "unknown" && (t.returnValue = !1), this.isDefaultPrevented = Fr);
    }, stopPropagation: function() {
      var t = this.nativeEvent;
      t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble != "unknown" && (t.cancelBubble = !0), this.isPropagationStopped = Fr);
    }, persist: function() {
    }, isPersistent: Fr }), n;
  }
  var ct = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, eo = Ue(ct), Qt = a({}, ct, { view: 0, detail: 0 }), oc = Ue(Qt), no, to, Kt, Ir = a({}, Qt, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: lo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Kt && (Kt && e.type === "mousemove" ? (no = e.screenX - Kt.screenX, to = e.screenY - Kt.screenY) : to = no = 0, Kt = e), no);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : to;
  } }), pi = Ue(Ir), uc = a({}, Ir, { dataTransfer: 0 }), ic = Ue(uc), sc = a({}, Qt, { relatedTarget: 0 }), ro = Ue(sc), ac = a({}, ct, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), cc = Ue(ac), fc = a({}, ct, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), dc = Ue(fc), pc = a({}, ct, { data: 0 }), mi = Ue(pc), mc = {
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
  }, vc = {
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
  }, hc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function yc(e) {
    var n = this.nativeEvent;
    return n.getModifierState ? n.getModifierState(e) : (e = hc[e]) ? !!n[e] : !1;
  }
  function lo() {
    return yc;
  }
  var gc = a({}, Qt, { key: function(e) {
    if (e.key) {
      var n = mc[e.key] || e.key;
      if (n !== "Unidentified")
        return n;
    }
    return e.type === "keypress" ? (e = Dr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? vc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: lo, charCode: function(e) {
    return e.type === "keypress" ? Dr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Dr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), wc = Ue(gc), kc = a({}, Ir, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), vi = Ue(kc), Sc = a({}, Qt, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: lo }), Ec = Ue(Sc), _c = a({}, ct, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Cc = Ue(_c), xc = a({}, Ir, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Pc = Ue(xc), Nc = [9, 13, 27, 32], oo = se && "CompositionEvent" in window, Yt = null;
  se && "documentMode" in document && (Yt = document.documentMode);
  var zc = se && "TextEvent" in window && !Yt, hi = se && (!oo || Yt && 8 < Yt && 11 >= Yt), yi = String.fromCharCode(32), gi = !1;
  function wi(e, n) {
    switch (e) {
      case "keyup":
        return Nc.indexOf(n.keyCode) !== -1;
      case "keydown":
        return n.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function ki(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var ft = !1;
  function Lc(e, n) {
    switch (e) {
      case "compositionend":
        return ki(n);
      case "keypress":
        return n.which !== 32 ? null : (gi = !0, yi);
      case "textInput":
        return e = n.data, e === yi && gi ? null : e;
      default:
        return null;
    }
  }
  function Tc(e, n) {
    if (ft)
      return e === "compositionend" || !oo && wi(e, n) ? (e = fi(), Or = bl = Rn = null, ft = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
          if (n.char && 1 < n.char.length)
            return n.char;
          if (n.which)
            return String.fromCharCode(n.which);
        }
        return null;
      case "compositionend":
        return hi && n.locale !== "ko" ? null : n.data;
      default:
        return null;
    }
  }
  var Rc = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Si(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return n === "input" ? !!Rc[e.type] : n === "textarea";
  }
  function Ei(e, n, t, r) {
    Hu(r), n = Br(n, "onChange"), 0 < n.length && (t = new eo("onChange", "change", null, t, r), e.push({ event: t, listeners: n }));
  }
  var Xt = null, Gt = null;
  function Mc(e) {
    Vi(e, 0);
  }
  function jr(e) {
    var n = ht(e);
    if (Tu(n))
      return e;
  }
  function Oc(e, n) {
    if (e === "change")
      return n;
  }
  var _i = !1;
  if (se) {
    var uo;
    if (se) {
      var io = "oninput" in document;
      if (!io) {
        var Ci = document.createElement("div");
        Ci.setAttribute("oninput", "return;"), io = typeof Ci.oninput == "function";
      }
      uo = io;
    } else
      uo = !1;
    _i = uo && (!document.documentMode || 9 < document.documentMode);
  }
  function xi() {
    Xt && (Xt.detachEvent("onpropertychange", Pi), Gt = Xt = null);
  }
  function Pi(e) {
    if (e.propertyName === "value" && jr(Gt)) {
      var n = [];
      Ei(n, Gt, e, Vl(e)), Ku(Mc, n);
    }
  }
  function Dc(e, n, t) {
    e === "focusin" ? (xi(), Xt = n, Gt = t, Xt.attachEvent("onpropertychange", Pi)) : e === "focusout" && xi();
  }
  function Fc(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return jr(Gt);
  }
  function Ic(e, n) {
    if (e === "click")
      return jr(n);
  }
  function jc(e, n) {
    if (e === "input" || e === "change")
      return jr(n);
  }
  function Uc(e, n) {
    return e === n && (e !== 0 || 1 / e === 1 / n) || e !== e && n !== n;
  }
  var nn = typeof Object.is == "function" ? Object.is : Uc;
  function Zt(e, n) {
    if (nn(e, n))
      return !0;
    if (typeof e != "object" || e === null || typeof n != "object" || n === null)
      return !1;
    var t = Object.keys(e), r = Object.keys(n);
    if (t.length !== r.length)
      return !1;
    for (r = 0; r < t.length; r++) {
      var l = t[r];
      if (!B.call(n, l) || !nn(e[l], n[l]))
        return !1;
    }
    return !0;
  }
  function Ni(e) {
    for (; e && e.firstChild; )
      e = e.firstChild;
    return e;
  }
  function zi(e, n) {
    var t = Ni(e);
    e = 0;
    for (var r; t; ) {
      if (t.nodeType === 3) {
        if (r = e + t.textContent.length, e <= n && r >= n)
          return { node: t, offset: n - e };
        e = r;
      }
      e: {
        for (; t; ) {
          if (t.nextSibling) {
            t = t.nextSibling;
            break e;
          }
          t = t.parentNode;
        }
        t = void 0;
      }
      t = Ni(t);
    }
  }
  function Li(e, n) {
    return e && n ? e === n ? !0 : e && e.nodeType === 3 ? !1 : n && n.nodeType === 3 ? Li(e, n.parentNode) : "contains" in e ? e.contains(n) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(n) & 16) : !1 : !1;
  }
  function Ti() {
    for (var e = window, n = kr(); n instanceof e.HTMLIFrameElement; ) {
      try {
        var t = typeof n.contentWindow.location.href == "string";
      } catch {
        t = !1;
      }
      if (t)
        e = n.contentWindow;
      else
        break;
      n = kr(e.document);
    }
    return n;
  }
  function so(e) {
    var n = e && e.nodeName && e.nodeName.toLowerCase();
    return n && (n === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || n === "textarea" || e.contentEditable === "true");
  }
  function Ac(e) {
    var n = Ti(), t = e.focusedElem, r = e.selectionRange;
    if (n !== t && t && t.ownerDocument && Li(t.ownerDocument.documentElement, t)) {
      if (r !== null && so(t)) {
        if (n = r.start, e = r.end, e === void 0 && (e = n), "selectionStart" in t)
          t.selectionStart = n, t.selectionEnd = Math.min(e, t.value.length);
        else if (e = (n = t.ownerDocument || document) && n.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = t.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = zi(t, o);
          var u = zi(
            t,
            r
          );
          l && u && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== u.node || e.focusOffset !== u.offset) && (n = n.createRange(), n.setStart(l.node, l.offset), e.removeAllRanges(), o > r ? (e.addRange(n), e.extend(u.node, u.offset)) : (n.setEnd(u.node, u.offset), e.addRange(n)));
        }
      }
      for (n = [], e = t; e = e.parentNode; )
        e.nodeType === 1 && n.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof t.focus == "function" && t.focus(), t = 0; t < n.length; t++)
        e = n[t], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var Vc = se && "documentMode" in document && 11 >= document.documentMode, dt = null, ao = null, Jt = null, co = !1;
  function Ri(e, n, t) {
    var r = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
    co || dt == null || dt !== kr(r) || (r = dt, "selectionStart" in r && so(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), Jt && Zt(Jt, r) || (Jt = r, r = Br(ao, "onSelect"), 0 < r.length && (n = new eo("onSelect", "select", null, n, t), e.push({ event: n, listeners: r }), n.target = dt)));
  }
  function Ur(e, n) {
    var t = {};
    return t[e.toLowerCase()] = n.toLowerCase(), t["Webkit" + e] = "webkit" + n, t["Moz" + e] = "moz" + n, t;
  }
  var pt = { animationend: Ur("Animation", "AnimationEnd"), animationiteration: Ur("Animation", "AnimationIteration"), animationstart: Ur("Animation", "AnimationStart"), transitionend: Ur("Transition", "TransitionEnd") }, fo = {}, Mi = {};
  se && (Mi = document.createElement("div").style, "AnimationEvent" in window || (delete pt.animationend.animation, delete pt.animationiteration.animation, delete pt.animationstart.animation), "TransitionEvent" in window || delete pt.transitionend.transition);
  function Ar(e) {
    if (fo[e])
      return fo[e];
    if (!pt[e])
      return e;
    var n = pt[e], t;
    for (t in n)
      if (n.hasOwnProperty(t) && t in Mi)
        return fo[e] = n[t];
    return e;
  }
  var Oi = Ar("animationend"), Di = Ar("animationiteration"), Fi = Ar("animationstart"), Ii = Ar("transitionend"), ji = /* @__PURE__ */ new Map(), Ui = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Mn(e, n) {
    ji.set(e, n), Ee(n, [e]);
  }
  for (var po = 0; po < Ui.length; po++) {
    var mo = Ui[po], Bc = mo.toLowerCase(), Hc = mo[0].toUpperCase() + mo.slice(1);
    Mn(Bc, "on" + Hc);
  }
  Mn(Oi, "onAnimationEnd"), Mn(Di, "onAnimationIteration"), Mn(Fi, "onAnimationStart"), Mn("dblclick", "onDoubleClick"), Mn("focusin", "onFocus"), Mn("focusout", "onBlur"), Mn(Ii, "onTransitionEnd"), me("onMouseEnter", ["mouseout", "mouseover"]), me("onMouseLeave", ["mouseout", "mouseover"]), me("onPointerEnter", ["pointerout", "pointerover"]), me("onPointerLeave", ["pointerout", "pointerover"]), Ee("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Ee("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Ee("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ee("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Ee("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Ee("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var qt = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), $c = new Set("cancel close invalid load scroll toggle".split(" ").concat(qt));
  function Ai(e, n, t) {
    var r = e.type || "unknown-event";
    e.currentTarget = t, Ba(r, n, void 0, e), e.currentTarget = null;
  }
  function Vi(e, n) {
    n = (n & 4) !== 0;
    for (var t = 0; t < e.length; t++) {
      var r = e[t], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (n)
          for (var u = r.length - 1; 0 <= u; u--) {
            var i = r[u], s = i.instance, p = i.currentTarget;
            if (i = i.listener, s !== o && l.isPropagationStopped())
              break e;
            Ai(l, i, p), o = s;
          }
        else
          for (u = 0; u < r.length; u++) {
            if (i = r[u], s = i.instance, p = i.currentTarget, i = i.listener, s !== o && l.isPropagationStopped())
              break e;
            Ai(l, i, p), o = s;
          }
      }
    }
    if (_r)
      throw e = Wl, _r = !1, Wl = null, e;
  }
  function K(e, n) {
    var t = n[Eo];
    t === void 0 && (t = n[Eo] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    t.has(r) || (Bi(n, e, 2, !1), t.add(r));
  }
  function vo(e, n, t) {
    var r = 0;
    n && (r |= 4), Bi(t, e, r, n);
  }
  var Vr = "_reactListening" + Math.random().toString(36).slice(2);
  function bt(e) {
    if (!e[Vr]) {
      e[Vr] = !0, Se.forEach(function(t) {
        t !== "selectionchange" && ($c.has(t) || vo(t, !1, e), vo(t, !0, e));
      });
      var n = e.nodeType === 9 ? e : e.ownerDocument;
      n === null || n[Vr] || (n[Vr] = !0, vo("selectionchange", !1, n));
    }
  }
  function Bi(e, n, t, r) {
    switch (ci(n)) {
      case 1:
        var l = rc;
        break;
      case 4:
        l = lc;
        break;
      default:
        l = Jl;
    }
    t = l.bind(null, n, t, e), l = void 0, !$l || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(n, t, { capture: !0, passive: l }) : e.addEventListener(n, t, !0) : l !== void 0 ? e.addEventListener(n, t, { passive: l }) : e.addEventListener(n, t, !1);
  }
  function ho(e, n, t, r, l) {
    var o = r;
    if (!(n & 1) && !(n & 2) && r !== null)
      e:
        for (; ; ) {
          if (r === null)
            return;
          var u = r.tag;
          if (u === 3 || u === 4) {
            var i = r.stateNode.containerInfo;
            if (i === l || i.nodeType === 8 && i.parentNode === l)
              break;
            if (u === 4)
              for (u = r.return; u !== null; ) {
                var s = u.tag;
                if ((s === 3 || s === 4) && (s = u.stateNode.containerInfo, s === l || s.nodeType === 8 && s.parentNode === l))
                  return;
                u = u.return;
              }
            for (; i !== null; ) {
              if (u = Xn(i), u === null)
                return;
              if (s = u.tag, s === 5 || s === 6) {
                r = o = u;
                continue e;
              }
              i = i.parentNode;
            }
          }
          r = r.return;
        }
    Ku(function() {
      var p = o, y = Vl(t), g = [];
      e: {
        var v = ji.get(e);
        if (v !== void 0) {
          var S = eo, C = e;
          switch (e) {
            case "keypress":
              if (Dr(t) === 0)
                break e;
            case "keydown":
            case "keyup":
              S = wc;
              break;
            case "focusin":
              C = "focus", S = ro;
              break;
            case "focusout":
              C = "blur", S = ro;
              break;
            case "beforeblur":
            case "afterblur":
              S = ro;
              break;
            case "click":
              if (t.button === 2)
                break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              S = pi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              S = ic;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              S = Ec;
              break;
            case Oi:
            case Di:
            case Fi:
              S = cc;
              break;
            case Ii:
              S = Cc;
              break;
            case "scroll":
              S = oc;
              break;
            case "wheel":
              S = Pc;
              break;
            case "copy":
            case "cut":
            case "paste":
              S = dc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              S = vi;
          }
          var x = (n & 4) !== 0, re = !x && e === "scroll", f = x ? v !== null ? v + "Capture" : null : v;
          x = [];
          for (var c = p, d; c !== null; ) {
            d = c;
            var w = d.stateNode;
            if (d.tag === 5 && w !== null && (d = w, f !== null && (w = Ft(c, f), w != null && x.push(er(c, w, d)))), re)
              break;
            c = c.return;
          }
          0 < x.length && (v = new S(v, C, null, t, y), g.push({ event: v, listeners: x }));
        }
      }
      if (!(n & 7)) {
        e: {
          if (v = e === "mouseover" || e === "pointerover", S = e === "mouseout" || e === "pointerout", v && t !== Al && (C = t.relatedTarget || t.fromElement) && (Xn(C) || C[gn]))
            break e;
          if ((S || v) && (v = y.window === y ? y : (v = y.ownerDocument) ? v.defaultView || v.parentWindow : window, S ? (C = t.relatedTarget || t.toElement, S = p, C = C ? Xn(C) : null, C !== null && (re = Yn(C), C !== re || C.tag !== 5 && C.tag !== 6) && (C = null)) : (S = null, C = p), S !== C)) {
            if (x = pi, w = "onMouseLeave", f = "onMouseEnter", c = "mouse", (e === "pointerout" || e === "pointerover") && (x = vi, w = "onPointerLeave", f = "onPointerEnter", c = "pointer"), re = S == null ? v : ht(S), d = C == null ? v : ht(C), v = new x(w, c + "leave", S, t, y), v.target = re, v.relatedTarget = d, w = null, Xn(y) === p && (x = new x(f, c + "enter", C, t, y), x.target = d, x.relatedTarget = re, w = x), re = w, S && C)
              n: {
                for (x = S, f = C, c = 0, d = x; d; d = mt(d))
                  c++;
                for (d = 0, w = f; w; w = mt(w))
                  d++;
                for (; 0 < c - d; )
                  x = mt(x), c--;
                for (; 0 < d - c; )
                  f = mt(f), d--;
                for (; c--; ) {
                  if (x === f || f !== null && x === f.alternate)
                    break n;
                  x = mt(x), f = mt(f);
                }
                x = null;
              }
            else
              x = null;
            S !== null && Hi(g, v, S, x, !1), C !== null && re !== null && Hi(g, re, C, x, !0);
          }
        }
        e: {
          if (v = p ? ht(p) : window, S = v.nodeName && v.nodeName.toLowerCase(), S === "select" || S === "input" && v.type === "file")
            var P = Oc;
          else if (Si(v))
            if (_i)
              P = jc;
            else {
              P = Fc;
              var z = Dc;
            }
          else
            (S = v.nodeName) && S.toLowerCase() === "input" && (v.type === "checkbox" || v.type === "radio") && (P = Ic);
          if (P && (P = P(e, p))) {
            Ei(g, P, t, y);
            break e;
          }
          z && z(e, v, p), e === "focusout" && (z = v._wrapperState) && z.controlled && v.type === "number" && Dl(v, "number", v.value);
        }
        switch (z = p ? ht(p) : window, e) {
          case "focusin":
            (Si(z) || z.contentEditable === "true") && (dt = z, ao = p, Jt = null);
            break;
          case "focusout":
            Jt = ao = dt = null;
            break;
          case "mousedown":
            co = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            co = !1, Ri(g, t, y);
            break;
          case "selectionchange":
            if (Vc)
              break;
          case "keydown":
          case "keyup":
            Ri(g, t, y);
        }
        var L;
        if (oo)
          e: {
            switch (e) {
              case "compositionstart":
                var R = "onCompositionStart";
                break e;
              case "compositionend":
                R = "onCompositionEnd";
                break e;
              case "compositionupdate":
                R = "onCompositionUpdate";
                break e;
            }
            R = void 0;
          }
        else
          ft ? wi(e, t) && (R = "onCompositionEnd") : e === "keydown" && t.keyCode === 229 && (R = "onCompositionStart");
        R && (hi && t.locale !== "ko" && (ft || R !== "onCompositionStart" ? R === "onCompositionEnd" && ft && (L = fi()) : (Rn = y, bl = "value" in Rn ? Rn.value : Rn.textContent, ft = !0)), z = Br(p, R), 0 < z.length && (R = new mi(R, e, null, t, y), g.push({ event: R, listeners: z }), L ? R.data = L : (L = ki(t), L !== null && (R.data = L)))), (L = zc ? Lc(e, t) : Tc(e, t)) && (p = Br(p, "onBeforeInput"), 0 < p.length && (y = new mi("onBeforeInput", "beforeinput", null, t, y), g.push({ event: y, listeners: p }), y.data = L));
      }
      Vi(g, n);
    });
  }
  function er(e, n, t) {
    return { instance: e, listener: n, currentTarget: t };
  }
  function Br(e, n) {
    for (var t = n + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Ft(e, t), o != null && r.unshift(er(e, o, l)), o = Ft(e, n), o != null && r.push(er(e, o, l))), e = e.return;
    }
    return r;
  }
  function mt(e) {
    if (e === null)
      return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function Hi(e, n, t, r, l) {
    for (var o = n._reactName, u = []; t !== null && t !== r; ) {
      var i = t, s = i.alternate, p = i.stateNode;
      if (s !== null && s === r)
        break;
      i.tag === 5 && p !== null && (i = p, l ? (s = Ft(t, o), s != null && u.unshift(er(t, s, i))) : l || (s = Ft(t, o), s != null && u.push(er(t, s, i)))), t = t.return;
    }
    u.length !== 0 && e.push({ event: n, listeners: u });
  }
  var Wc = /\r\n?/g, Qc = /\u0000|\uFFFD/g;
  function $i(e) {
    return (typeof e == "string" ? e : "" + e).replace(Wc, `
`).replace(Qc, "");
  }
  function Hr(e, n, t) {
    if (n = $i(n), $i(e) !== n && t)
      throw Error(m(425));
  }
  function $r() {
  }
  var yo = null, go = null;
  function wo(e, n) {
    return e === "textarea" || e === "noscript" || typeof n.children == "string" || typeof n.children == "number" || typeof n.dangerouslySetInnerHTML == "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
  }
  var ko = typeof setTimeout == "function" ? setTimeout : void 0, Kc = typeof clearTimeout == "function" ? clearTimeout : void 0, Wi = typeof Promise == "function" ? Promise : void 0, Yc = typeof queueMicrotask == "function" ? queueMicrotask : typeof Wi < "u" ? function(e) {
    return Wi.resolve(null).then(e).catch(Xc);
  } : ko;
  function Xc(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function So(e, n) {
    var t = n, r = 0;
    do {
      var l = t.nextSibling;
      if (e.removeChild(t), l && l.nodeType === 8)
        if (t = l.data, t === "/$") {
          if (r === 0) {
            e.removeChild(l), Wt(n);
            return;
          }
          r--;
        } else
          t !== "$" && t !== "$?" && t !== "$!" || r++;
      t = l;
    } while (t);
    Wt(n);
  }
  function On(e) {
    for (; e != null; e = e.nextSibling) {
      var n = e.nodeType;
      if (n === 1 || n === 3)
        break;
      if (n === 8) {
        if (n = e.data, n === "$" || n === "$!" || n === "$?")
          break;
        if (n === "/$")
          return null;
      }
    }
    return e;
  }
  function Qi(e) {
    e = e.previousSibling;
    for (var n = 0; e; ) {
      if (e.nodeType === 8) {
        var t = e.data;
        if (t === "$" || t === "$!" || t === "$?") {
          if (n === 0)
            return e;
          n--;
        } else
          t === "/$" && n++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var vt = Math.random().toString(36).slice(2), dn = "__reactFiber$" + vt, nr = "__reactProps$" + vt, gn = "__reactContainer$" + vt, Eo = "__reactEvents$" + vt, Gc = "__reactListeners$" + vt, Zc = "__reactHandles$" + vt;
  function Xn(e) {
    var n = e[dn];
    if (n)
      return n;
    for (var t = e.parentNode; t; ) {
      if (n = t[gn] || t[dn]) {
        if (t = n.alternate, n.child !== null || t !== null && t.child !== null)
          for (e = Qi(e); e !== null; ) {
            if (t = e[dn])
              return t;
            e = Qi(e);
          }
        return n;
      }
      e = t, t = e.parentNode;
    }
    return null;
  }
  function tr(e) {
    return e = e[dn] || e[gn], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function ht(e) {
    if (e.tag === 5 || e.tag === 6)
      return e.stateNode;
    throw Error(m(33));
  }
  function Wr(e) {
    return e[nr] || null;
  }
  var _o = [], yt = -1;
  function Dn(e) {
    return { current: e };
  }
  function Y(e) {
    0 > yt || (e.current = _o[yt], _o[yt] = null, yt--);
  }
  function Q(e, n) {
    yt++, _o[yt] = e.current, e.current = n;
  }
  var Fn = {}, ye = Dn(Fn), Te = Dn(!1), Gn = Fn;
  function gt(e, n) {
    var t = e.type.contextTypes;
    if (!t)
      return Fn;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === n)
      return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in t)
      l[o] = n[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = n, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Re(e) {
    return e = e.childContextTypes, e != null;
  }
  function Qr() {
    Y(Te), Y(ye);
  }
  function Ki(e, n, t) {
    if (ye.current !== Fn)
      throw Error(m(168));
    Q(ye, n), Q(Te, t);
  }
  function Yi(e, n, t) {
    var r = e.stateNode;
    if (n = n.childContextTypes, typeof r.getChildContext != "function")
      return t;
    r = r.getChildContext();
    for (var l in r)
      if (!(l in n))
        throw Error(m(108, $(e) || "Unknown", l));
    return a({}, t, r);
  }
  function Kr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Fn, Gn = ye.current, Q(ye, e), Q(Te, Te.current), !0;
  }
  function Xi(e, n, t) {
    var r = e.stateNode;
    if (!r)
      throw Error(m(169));
    t ? (e = Yi(e, n, Gn), r.__reactInternalMemoizedMergedChildContext = e, Y(Te), Y(ye), Q(ye, e)) : Y(Te), Q(Te, t);
  }
  var wn = null, Yr = !1, Co = !1;
  function Gi(e) {
    wn === null ? wn = [e] : wn.push(e);
  }
  function Jc(e) {
    Yr = !0, Gi(e);
  }
  function In() {
    if (!Co && wn !== null) {
      Co = !0;
      var e = 0, n = V;
      try {
        var t = wn;
        for (V = 1; e < t.length; e++) {
          var r = t[e];
          do
            r = r(!0);
          while (r !== null);
        }
        wn = null, Yr = !1;
      } catch (l) {
        throw wn !== null && (wn = wn.slice(e + 1)), Ju(Ql, In), l;
      } finally {
        V = n, Co = !1;
      }
    }
    return null;
  }
  var wt = [], kt = 0, Xr = null, Gr = 0, Qe = [], Ke = 0, Zn = null, kn = 1, Sn = "";
  function Jn(e, n) {
    wt[kt++] = Gr, wt[kt++] = Xr, Xr = e, Gr = n;
  }
  function Zi(e, n, t) {
    Qe[Ke++] = kn, Qe[Ke++] = Sn, Qe[Ke++] = Zn, Zn = e;
    var r = kn;
    e = Sn;
    var l = 32 - en(r) - 1;
    r &= ~(1 << l), t += 1;
    var o = 32 - en(n) + l;
    if (30 < o) {
      var u = l - l % 5;
      o = (r & (1 << u) - 1).toString(32), r >>= u, l -= u, kn = 1 << 32 - en(n) + l | t << l | r, Sn = o + e;
    } else
      kn = 1 << o | t << l | r, Sn = e;
  }
  function xo(e) {
    e.return !== null && (Jn(e, 1), Zi(e, 1, 0));
  }
  function Po(e) {
    for (; e === Xr; )
      Xr = wt[--kt], wt[kt] = null, Gr = wt[--kt], wt[kt] = null;
    for (; e === Zn; )
      Zn = Qe[--Ke], Qe[Ke] = null, Sn = Qe[--Ke], Qe[Ke] = null, kn = Qe[--Ke], Qe[Ke] = null;
  }
  var Ae = null, Ve = null, Z = !1, tn = null;
  function Ji(e, n) {
    var t = Ze(5, null, null, 0);
    t.elementType = "DELETED", t.stateNode = n, t.return = e, n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t);
  }
  function qi(e, n) {
    switch (e.tag) {
      case 5:
        var t = e.type;
        return n = n.nodeType !== 1 || t.toLowerCase() !== n.nodeName.toLowerCase() ? null : n, n !== null ? (e.stateNode = n, Ae = e, Ve = On(n.firstChild), !0) : !1;
      case 6:
        return n = e.pendingProps === "" || n.nodeType !== 3 ? null : n, n !== null ? (e.stateNode = n, Ae = e, Ve = null, !0) : !1;
      case 13:
        return n = n.nodeType !== 8 ? null : n, n !== null ? (t = Zn !== null ? { id: kn, overflow: Sn } : null, e.memoizedState = { dehydrated: n, treeContext: t, retryLane: 1073741824 }, t = Ze(18, null, null, 0), t.stateNode = n, t.return = e, e.child = t, Ae = e, Ve = null, !0) : !1;
      default:
        return !1;
    }
  }
  function No(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function zo(e) {
    if (Z) {
      var n = Ve;
      if (n) {
        var t = n;
        if (!qi(e, n)) {
          if (No(e))
            throw Error(m(418));
          n = On(t.nextSibling);
          var r = Ae;
          n && qi(e, n) ? Ji(r, t) : (e.flags = e.flags & -4097 | 2, Z = !1, Ae = e);
        }
      } else {
        if (No(e))
          throw Error(m(418));
        e.flags = e.flags & -4097 | 2, Z = !1, Ae = e;
      }
    }
  }
  function bi(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; )
      e = e.return;
    Ae = e;
  }
  function Zr(e) {
    if (e !== Ae)
      return !1;
    if (!Z)
      return bi(e), Z = !0, !1;
    var n;
    if ((n = e.tag !== 3) && !(n = e.tag !== 5) && (n = e.type, n = n !== "head" && n !== "body" && !wo(e.type, e.memoizedProps)), n && (n = Ve)) {
      if (No(e))
        throw es(), Error(m(418));
      for (; n; )
        Ji(e, n), n = On(n.nextSibling);
    }
    if (bi(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e)
        throw Error(m(317));
      e: {
        for (e = e.nextSibling, n = 0; e; ) {
          if (e.nodeType === 8) {
            var t = e.data;
            if (t === "/$") {
              if (n === 0) {
                Ve = On(e.nextSibling);
                break e;
              }
              n--;
            } else
              t !== "$" && t !== "$!" && t !== "$?" || n++;
          }
          e = e.nextSibling;
        }
        Ve = null;
      }
    } else
      Ve = Ae ? On(e.stateNode.nextSibling) : null;
    return !0;
  }
  function es() {
    for (var e = Ve; e; )
      e = On(e.nextSibling);
  }
  function St() {
    Ve = Ae = null, Z = !1;
  }
  function Lo(e) {
    tn === null ? tn = [e] : tn.push(e);
  }
  var qc = he.ReactCurrentBatchConfig;
  function rn(e, n) {
    if (e && e.defaultProps) {
      n = a({}, n), e = e.defaultProps;
      for (var t in e)
        n[t] === void 0 && (n[t] = e[t]);
      return n;
    }
    return n;
  }
  var Jr = Dn(null), qr = null, Et = null, To = null;
  function Ro() {
    To = Et = qr = null;
  }
  function Mo(e) {
    var n = Jr.current;
    Y(Jr), e._currentValue = n;
  }
  function Oo(e, n, t) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & n) !== n ? (e.childLanes |= n, r !== null && (r.childLanes |= n)) : r !== null && (r.childLanes & n) !== n && (r.childLanes |= n), e === t)
        break;
      e = e.return;
    }
  }
  function _t(e, n) {
    qr = e, To = Et = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & n && (Me = !0), e.firstContext = null);
  }
  function Ye(e) {
    var n = e._currentValue;
    if (To !== e)
      if (e = { context: e, memoizedValue: n, next: null }, Et === null) {
        if (qr === null)
          throw Error(m(308));
        Et = e, qr.dependencies = { lanes: 0, firstContext: e };
      } else
        Et = Et.next = e;
    return n;
  }
  var qn = null;
  function Do(e) {
    qn === null ? qn = [e] : qn.push(e);
  }
  function ns(e, n, t, r) {
    var l = n.interleaved;
    return l === null ? (t.next = t, Do(n)) : (t.next = l.next, l.next = t), n.interleaved = t, En(e, r);
  }
  function En(e, n) {
    e.lanes |= n;
    var t = e.alternate;
    for (t !== null && (t.lanes |= n), t = e, e = e.return; e !== null; )
      e.childLanes |= n, t = e.alternate, t !== null && (t.childLanes |= n), t = e, e = e.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var jn = !1;
  function Fo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function ts(e, n) {
    e = e.updateQueue, n.updateQueue === e && (n.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function _n(e, n) {
    return { eventTime: e, lane: n, tag: 0, payload: null, callback: null, next: null };
  }
  function Un(e, n, t) {
    var r = e.updateQueue;
    if (r === null)
      return null;
    if (r = r.shared, I & 2) {
      var l = r.pending;
      return l === null ? n.next = n : (n.next = l.next, l.next = n), r.pending = n, En(e, t);
    }
    return l = r.interleaved, l === null ? (n.next = n, Do(r)) : (n.next = l.next, l.next = n), r.interleaved = n, En(e, t);
  }
  function br(e, n, t) {
    if (n = n.updateQueue, n !== null && (n = n.shared, (t & 4194240) !== 0)) {
      var r = n.lanes;
      r &= e.pendingLanes, t |= r, n.lanes = t, Xl(e, t);
    }
  }
  function rs(e, n) {
    var t = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, t === r)) {
      var l = null, o = null;
      if (t = t.firstBaseUpdate, t !== null) {
        do {
          var u = { eventTime: t.eventTime, lane: t.lane, tag: t.tag, payload: t.payload, callback: t.callback, next: null };
          o === null ? l = o = u : o = o.next = u, t = t.next;
        } while (t !== null);
        o === null ? l = o = n : o = o.next = n;
      } else
        l = o = n;
      t = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: r.shared, effects: r.effects }, e.updateQueue = t;
      return;
    }
    e = t.lastBaseUpdate, e === null ? t.firstBaseUpdate = n : e.next = n, t.lastBaseUpdate = n;
  }
  function el(e, n, t, r) {
    var l = e.updateQueue;
    jn = !1;
    var o = l.firstBaseUpdate, u = l.lastBaseUpdate, i = l.shared.pending;
    if (i !== null) {
      l.shared.pending = null;
      var s = i, p = s.next;
      s.next = null, u === null ? o = p : u.next = p, u = s;
      var y = e.alternate;
      y !== null && (y = y.updateQueue, i = y.lastBaseUpdate, i !== u && (i === null ? y.firstBaseUpdate = p : i.next = p, y.lastBaseUpdate = s));
    }
    if (o !== null) {
      var g = l.baseState;
      u = 0, y = p = s = null, i = o;
      do {
        var v = i.lane, S = i.eventTime;
        if ((r & v) === v) {
          y !== null && (y = y.next = {
            eventTime: S,
            lane: 0,
            tag: i.tag,
            payload: i.payload,
            callback: i.callback,
            next: null
          });
          e: {
            var C = e, x = i;
            switch (v = n, S = t, x.tag) {
              case 1:
                if (C = x.payload, typeof C == "function") {
                  g = C.call(S, g, v);
                  break e;
                }
                g = C;
                break e;
              case 3:
                C.flags = C.flags & -65537 | 128;
              case 0:
                if (C = x.payload, v = typeof C == "function" ? C.call(S, g, v) : C, v == null)
                  break e;
                g = a({}, g, v);
                break e;
              case 2:
                jn = !0;
            }
          }
          i.callback !== null && i.lane !== 0 && (e.flags |= 64, v = l.effects, v === null ? l.effects = [i] : v.push(i));
        } else
          S = { eventTime: S, lane: v, tag: i.tag, payload: i.payload, callback: i.callback, next: null }, y === null ? (p = y = S, s = g) : y = y.next = S, u |= v;
        if (i = i.next, i === null) {
          if (i = l.shared.pending, i === null)
            break;
          v = i, i = v.next, v.next = null, l.lastBaseUpdate = v, l.shared.pending = null;
        }
      } while (1);
      if (y === null && (s = g), l.baseState = s, l.firstBaseUpdate = p, l.lastBaseUpdate = y, n = l.shared.interleaved, n !== null) {
        l = n;
        do
          u |= l.lane, l = l.next;
        while (l !== n);
      } else
        o === null && (l.shared.lanes = 0);
      nt |= u, e.lanes = u, e.memoizedState = g;
    }
  }
  function ls(e, n, t) {
    if (e = n.effects, n.effects = null, e !== null)
      for (n = 0; n < e.length; n++) {
        var r = e[n], l = r.callback;
        if (l !== null) {
          if (r.callback = null, r = t, typeof l != "function")
            throw Error(m(191, l));
          l.call(r);
        }
      }
  }
  var os = new E.Component().refs;
  function Io(e, n, t, r) {
    n = e.memoizedState, t = t(r, n), t = t == null ? n : a({}, n, t), e.memoizedState = t, e.lanes === 0 && (e.updateQueue.baseState = t);
  }
  var nl = { isMounted: function(e) {
    return (e = e._reactInternals) ? Yn(e) === e : !1;
  }, enqueueSetState: function(e, n, t) {
    e = e._reactInternals;
    var r = Pe(), l = Hn(e), o = _n(r, l);
    o.payload = n, t != null && (o.callback = t), n = Un(e, o, l), n !== null && (un(n, e, l, r), br(n, e, l));
  }, enqueueReplaceState: function(e, n, t) {
    e = e._reactInternals;
    var r = Pe(), l = Hn(e), o = _n(r, l);
    o.tag = 1, o.payload = n, t != null && (o.callback = t), n = Un(e, o, l), n !== null && (un(n, e, l, r), br(n, e, l));
  }, enqueueForceUpdate: function(e, n) {
    e = e._reactInternals;
    var t = Pe(), r = Hn(e), l = _n(t, r);
    l.tag = 2, n != null && (l.callback = n), n = Un(e, l, r), n !== null && (un(n, e, r, t), br(n, e, r));
  } };
  function us(e, n, t, r, l, o, u) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, u) : n.prototype && n.prototype.isPureReactComponent ? !Zt(t, r) || !Zt(l, o) : !0;
  }
  function is(e, n, t) {
    var r = !1, l = Fn, o = n.contextType;
    return typeof o == "object" && o !== null ? o = Ye(o) : (l = Re(n) ? Gn : ye.current, r = n.contextTypes, o = (r = r != null) ? gt(e, l) : Fn), n = new n(t, o), e.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = nl, e.stateNode = n, n._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), n;
  }
  function ss(e, n, t, r) {
    e = n.state, typeof n.componentWillReceiveProps == "function" && n.componentWillReceiveProps(t, r), typeof n.UNSAFE_componentWillReceiveProps == "function" && n.UNSAFE_componentWillReceiveProps(t, r), n.state !== e && nl.enqueueReplaceState(n, n.state, null);
  }
  function jo(e, n, t, r) {
    var l = e.stateNode;
    l.props = t, l.state = e.memoizedState, l.refs = os, Fo(e);
    var o = n.contextType;
    typeof o == "object" && o !== null ? l.context = Ye(o) : (o = Re(n) ? Gn : ye.current, l.context = gt(e, o)), l.state = e.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Io(e, n, o, t), l.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (n = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), n !== l.state && nl.enqueueReplaceState(l, l.state, null), el(e, t, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function rr(e, n, t) {
    if (e = t.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (t._owner) {
        if (t = t._owner, t) {
          if (t.tag !== 1)
            throw Error(m(309));
          var r = t.stateNode;
        }
        if (!r)
          throw Error(m(147, e));
        var l = r, o = "" + e;
        return n !== null && n.ref !== null && typeof n.ref == "function" && n.ref._stringRef === o ? n.ref : (n = function(u) {
          var i = l.refs;
          i === os && (i = l.refs = {}), u === null ? delete i[o] : i[o] = u;
        }, n._stringRef = o, n);
      }
      if (typeof e != "string")
        throw Error(m(284));
      if (!t._owner)
        throw Error(m(290, e));
    }
    return e;
  }
  function tl(e, n) {
    throw e = Object.prototype.toString.call(n), Error(m(31, e === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : e));
  }
  function as(e) {
    var n = e._init;
    return n(e._payload);
  }
  function cs(e) {
    function n(f, c) {
      if (e) {
        var d = f.deletions;
        d === null ? (f.deletions = [c], f.flags |= 16) : d.push(c);
      }
    }
    function t(f, c) {
      if (!e)
        return null;
      for (; c !== null; )
        n(f, c), c = c.sibling;
      return null;
    }
    function r(f, c) {
      for (f = /* @__PURE__ */ new Map(); c !== null; )
        c.key !== null ? f.set(c.key, c) : f.set(c.index, c), c = c.sibling;
      return f;
    }
    function l(f, c) {
      return f = Wn(f, c), f.index = 0, f.sibling = null, f;
    }
    function o(f, c, d) {
      return f.index = d, e ? (d = f.alternate, d !== null ? (d = d.index, d < c ? (f.flags |= 2, c) : d) : (f.flags |= 2, c)) : (f.flags |= 1048576, c);
    }
    function u(f) {
      return e && f.alternate === null && (f.flags |= 2), f;
    }
    function i(f, c, d, w) {
      return c === null || c.tag !== 6 ? (c = ku(d, f.mode, w), c.return = f, c) : (c = l(c, d), c.return = f, c);
    }
    function s(f, c, d, w) {
      var P = d.type;
      return P === Ne ? y(f, c, d.props.children, w, d.key) : c !== null && (c.elementType === P || typeof P == "object" && P !== null && P.$$typeof === ze && as(P) === c.type) ? (w = l(c, d.props), w.ref = rr(f, c, d), w.return = f, w) : (w = Sl(d.type, d.key, d.props, null, f.mode, w), w.ref = rr(f, c, d), w.return = f, w);
    }
    function p(f, c, d, w) {
      return c === null || c.tag !== 4 || c.stateNode.containerInfo !== d.containerInfo || c.stateNode.implementation !== d.implementation ? (c = Su(d, f.mode, w), c.return = f, c) : (c = l(c, d.children || []), c.return = f, c);
    }
    function y(f, c, d, w, P) {
      return c === null || c.tag !== 7 ? (c = ot(d, f.mode, w, P), c.return = f, c) : (c = l(c, d), c.return = f, c);
    }
    function g(f, c, d) {
      if (typeof c == "string" && c !== "" || typeof c == "number")
        return c = ku("" + c, f.mode, d), c.return = f, c;
      if (typeof c == "object" && c !== null) {
        switch (c.$$typeof) {
          case qe:
            return d = Sl(c.type, c.key, c.props, null, f.mode, d), d.ref = rr(f, null, c), d.return = f, d;
          case Ce:
            return c = Su(c, f.mode, d), c.return = f, c;
          case ze:
            var w = c._init;
            return g(f, w(c._payload), d);
        }
        if (Mt(c) || T(c))
          return c = ot(c, f.mode, d, null), c.return = f, c;
        tl(f, c);
      }
      return null;
    }
    function v(f, c, d, w) {
      var P = c !== null ? c.key : null;
      if (typeof d == "string" && d !== "" || typeof d == "number")
        return P !== null ? null : i(f, c, "" + d, w);
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case qe:
            return d.key === P ? s(f, c, d, w) : null;
          case Ce:
            return d.key === P ? p(f, c, d, w) : null;
          case ze:
            return P = d._init, v(
              f,
              c,
              P(d._payload),
              w
            );
        }
        if (Mt(d) || T(d))
          return P !== null ? null : y(f, c, d, w, null);
        tl(f, d);
      }
      return null;
    }
    function S(f, c, d, w, P) {
      if (typeof w == "string" && w !== "" || typeof w == "number")
        return f = f.get(d) || null, i(c, f, "" + w, P);
      if (typeof w == "object" && w !== null) {
        switch (w.$$typeof) {
          case qe:
            return f = f.get(w.key === null ? d : w.key) || null, s(c, f, w, P);
          case Ce:
            return f = f.get(w.key === null ? d : w.key) || null, p(c, f, w, P);
          case ze:
            var z = w._init;
            return S(f, c, d, z(w._payload), P);
        }
        if (Mt(w) || T(w))
          return f = f.get(d) || null, y(c, f, w, P, null);
        tl(c, w);
      }
      return null;
    }
    function C(f, c, d, w) {
      for (var P = null, z = null, L = c, R = c = 0, fe = null; L !== null && R < d.length; R++) {
        L.index > R ? (fe = L, L = null) : fe = L.sibling;
        var j = v(f, L, d[R], w);
        if (j === null) {
          L === null && (L = fe);
          break;
        }
        e && L && j.alternate === null && n(f, L), c = o(j, c, R), z === null ? P = j : z.sibling = j, z = j, L = fe;
      }
      if (R === d.length)
        return t(f, L), Z && Jn(f, R), P;
      if (L === null) {
        for (; R < d.length; R++)
          L = g(f, d[R], w), L !== null && (c = o(L, c, R), z === null ? P = L : z.sibling = L, z = L);
        return Z && Jn(f, R), P;
      }
      for (L = r(f, L); R < d.length; R++)
        fe = S(L, f, R, d[R], w), fe !== null && (e && fe.alternate !== null && L.delete(fe.key === null ? R : fe.key), c = o(fe, c, R), z === null ? P = fe : z.sibling = fe, z = fe);
      return e && L.forEach(function(Qn) {
        return n(f, Qn);
      }), Z && Jn(f, R), P;
    }
    function x(f, c, d, w) {
      var P = T(d);
      if (typeof P != "function")
        throw Error(m(150));
      if (d = P.call(d), d == null)
        throw Error(m(151));
      for (var z = P = null, L = c, R = c = 0, fe = null, j = d.next(); L !== null && !j.done; R++, j = d.next()) {
        L.index > R ? (fe = L, L = null) : fe = L.sibling;
        var Qn = v(f, L, j.value, w);
        if (Qn === null) {
          L === null && (L = fe);
          break;
        }
        e && L && Qn.alternate === null && n(f, L), c = o(Qn, c, R), z === null ? P = Qn : z.sibling = Qn, z = Qn, L = fe;
      }
      if (j.done)
        return t(
          f,
          L
        ), Z && Jn(f, R), P;
      if (L === null) {
        for (; !j.done; R++, j = d.next())
          j = g(f, j.value, w), j !== null && (c = o(j, c, R), z === null ? P = j : z.sibling = j, z = j);
        return Z && Jn(f, R), P;
      }
      for (L = r(f, L); !j.done; R++, j = d.next())
        j = S(L, f, R, j.value, w), j !== null && (e && j.alternate !== null && L.delete(j.key === null ? R : j.key), c = o(j, c, R), z === null ? P = j : z.sibling = j, z = j);
      return e && L.forEach(function(Mf) {
        return n(f, Mf);
      }), Z && Jn(f, R), P;
    }
    function re(f, c, d, w) {
      if (typeof d == "object" && d !== null && d.type === Ne && d.key === null && (d = d.props.children), typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case qe:
            e: {
              for (var P = d.key, z = c; z !== null; ) {
                if (z.key === P) {
                  if (P = d.type, P === Ne) {
                    if (z.tag === 7) {
                      t(f, z.sibling), c = l(z, d.props.children), c.return = f, f = c;
                      break e;
                    }
                  } else if (z.elementType === P || typeof P == "object" && P !== null && P.$$typeof === ze && as(P) === z.type) {
                    t(f, z.sibling), c = l(z, d.props), c.ref = rr(f, z, d), c.return = f, f = c;
                    break e;
                  }
                  t(f, z);
                  break;
                } else
                  n(f, z);
                z = z.sibling;
              }
              d.type === Ne ? (c = ot(d.props.children, f.mode, w, d.key), c.return = f, f = c) : (w = Sl(d.type, d.key, d.props, null, f.mode, w), w.ref = rr(f, c, d), w.return = f, f = w);
            }
            return u(f);
          case Ce:
            e: {
              for (z = d.key; c !== null; ) {
                if (c.key === z)
                  if (c.tag === 4 && c.stateNode.containerInfo === d.containerInfo && c.stateNode.implementation === d.implementation) {
                    t(f, c.sibling), c = l(c, d.children || []), c.return = f, f = c;
                    break e;
                  } else {
                    t(f, c);
                    break;
                  }
                else
                  n(f, c);
                c = c.sibling;
              }
              c = Su(d, f.mode, w), c.return = f, f = c;
            }
            return u(f);
          case ze:
            return z = d._init, re(f, c, z(d._payload), w);
        }
        if (Mt(d))
          return C(f, c, d, w);
        if (T(d))
          return x(f, c, d, w);
        tl(f, d);
      }
      return typeof d == "string" && d !== "" || typeof d == "number" ? (d = "" + d, c !== null && c.tag === 6 ? (t(f, c.sibling), c = l(c, d), c.return = f, f = c) : (t(f, c), c = ku(d, f.mode, w), c.return = f, f = c), u(f)) : t(f, c);
    }
    return re;
  }
  var Ct = cs(!0), fs = cs(!1), lr = {}, pn = Dn(lr), or = Dn(lr), ur = Dn(lr);
  function bn(e) {
    if (e === lr)
      throw Error(m(174));
    return e;
  }
  function Uo(e, n) {
    switch (Q(ur, n), Q(or, e), Q(pn, lr), e = n.nodeType, e) {
      case 9:
      case 11:
        n = (n = n.documentElement) ? n.namespaceURI : Il(null, "");
        break;
      default:
        e = e === 8 ? n.parentNode : n, n = e.namespaceURI || null, e = e.tagName, n = Il(n, e);
    }
    Y(pn), Q(pn, n);
  }
  function xt() {
    Y(pn), Y(or), Y(ur);
  }
  function ds(e) {
    bn(ur.current);
    var n = bn(pn.current), t = Il(n, e.type);
    n !== t && (Q(or, e), Q(pn, t));
  }
  function Ao(e) {
    or.current === e && (Y(pn), Y(or));
  }
  var q = Dn(0);
  function rl(e) {
    for (var n = e; n !== null; ) {
      if (n.tag === 13) {
        var t = n.memoizedState;
        if (t !== null && (t = t.dehydrated, t === null || t.data === "$?" || t.data === "$!"))
          return n;
      } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
        if (n.flags & 128)
          return n;
      } else if (n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === e)
        break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === e)
          return null;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
    return null;
  }
  var Vo = [];
  function Bo() {
    for (var e = 0; e < Vo.length; e++)
      Vo[e]._workInProgressVersionPrimary = null;
    Vo.length = 0;
  }
  var ll = he.ReactCurrentDispatcher, Ho = he.ReactCurrentBatchConfig, et = 0, b = null, oe = null, ae = null, ol = !1, ir = !1, sr = 0, bc = 0;
  function ge() {
    throw Error(m(321));
  }
  function $o(e, n) {
    if (n === null)
      return !1;
    for (var t = 0; t < n.length && t < e.length; t++)
      if (!nn(e[t], n[t]))
        return !1;
    return !0;
  }
  function Wo(e, n, t, r, l, o) {
    if (et = o, b = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, ll.current = e === null || e.memoizedState === null ? rf : lf, e = t(r, l), ir) {
      o = 0;
      do {
        if (ir = !1, sr = 0, 25 <= o)
          throw Error(m(301));
        o += 1, ae = oe = null, n.updateQueue = null, ll.current = of, e = t(r, l);
      } while (ir);
    }
    if (ll.current = sl, n = oe !== null && oe.next !== null, et = 0, ae = oe = b = null, ol = !1, n)
      throw Error(m(300));
    return e;
  }
  function Qo() {
    var e = sr !== 0;
    return sr = 0, e;
  }
  function mn() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return ae === null ? b.memoizedState = ae = e : ae = ae.next = e, ae;
  }
  function Xe() {
    if (oe === null) {
      var e = b.alternate;
      e = e !== null ? e.memoizedState : null;
    } else
      e = oe.next;
    var n = ae === null ? b.memoizedState : ae.next;
    if (n !== null)
      ae = n, oe = e;
    else {
      if (e === null)
        throw Error(m(310));
      oe = e, e = { memoizedState: oe.memoizedState, baseState: oe.baseState, baseQueue: oe.baseQueue, queue: oe.queue, next: null }, ae === null ? b.memoizedState = ae = e : ae = ae.next = e;
    }
    return ae;
  }
  function ar(e, n) {
    return typeof n == "function" ? n(e) : n;
  }
  function Ko(e) {
    var n = Xe(), t = n.queue;
    if (t === null)
      throw Error(m(311));
    t.lastRenderedReducer = e;
    var r = oe, l = r.baseQueue, o = t.pending;
    if (o !== null) {
      if (l !== null) {
        var u = l.next;
        l.next = o.next, o.next = u;
      }
      r.baseQueue = l = o, t.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var i = u = null, s = null, p = o;
      do {
        var y = p.lane;
        if ((et & y) === y)
          s !== null && (s = s.next = { lane: 0, action: p.action, hasEagerState: p.hasEagerState, eagerState: p.eagerState, next: null }), r = p.hasEagerState ? p.eagerState : e(r, p.action);
        else {
          var g = {
            lane: y,
            action: p.action,
            hasEagerState: p.hasEagerState,
            eagerState: p.eagerState,
            next: null
          };
          s === null ? (i = s = g, u = r) : s = s.next = g, b.lanes |= y, nt |= y;
        }
        p = p.next;
      } while (p !== null && p !== o);
      s === null ? u = r : s.next = i, nn(r, n.memoizedState) || (Me = !0), n.memoizedState = r, n.baseState = u, n.baseQueue = s, t.lastRenderedState = r;
    }
    if (e = t.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, b.lanes |= o, nt |= o, l = l.next;
      while (l !== e);
    } else
      l === null && (t.lanes = 0);
    return [n.memoizedState, t.dispatch];
  }
  function Yo(e) {
    var n = Xe(), t = n.queue;
    if (t === null)
      throw Error(m(311));
    t.lastRenderedReducer = e;
    var r = t.dispatch, l = t.pending, o = n.memoizedState;
    if (l !== null) {
      t.pending = null;
      var u = l = l.next;
      do
        o = e(o, u.action), u = u.next;
      while (u !== l);
      nn(o, n.memoizedState) || (Me = !0), n.memoizedState = o, n.baseQueue === null && (n.baseState = o), t.lastRenderedState = o;
    }
    return [o, r];
  }
  function ps() {
  }
  function ms(e, n) {
    var t = b, r = Xe(), l = n(), o = !nn(r.memoizedState, l);
    if (o && (r.memoizedState = l, Me = !0), r = r.queue, Xo(ys.bind(null, t, r, e), [e]), r.getSnapshot !== n || o || ae !== null && ae.memoizedState.tag & 1) {
      if (t.flags |= 2048, cr(9, hs.bind(null, t, r, l, n), void 0, null), ce === null)
        throw Error(m(349));
      et & 30 || vs(t, n, l);
    }
    return l;
  }
  function vs(e, n, t) {
    e.flags |= 16384, e = { getSnapshot: n, value: t }, n = b.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, b.updateQueue = n, n.stores = [e]) : (t = n.stores, t === null ? n.stores = [e] : t.push(e));
  }
  function hs(e, n, t, r) {
    n.value = t, n.getSnapshot = r, gs(n) && ws(e);
  }
  function ys(e, n, t) {
    return t(function() {
      gs(n) && ws(e);
    });
  }
  function gs(e) {
    var n = e.getSnapshot;
    e = e.value;
    try {
      var t = n();
      return !nn(e, t);
    } catch {
      return !0;
    }
  }
  function ws(e) {
    var n = En(e, 1);
    n !== null && un(n, e, 1, -1);
  }
  function ks(e) {
    var n = mn();
    return typeof e == "function" && (e = e()), n.memoizedState = n.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ar, lastRenderedState: e }, n.queue = e, e = e.dispatch = tf.bind(null, b, e), [n.memoizedState, e];
  }
  function cr(e, n, t, r) {
    return e = { tag: e, create: n, destroy: t, deps: r, next: null }, n = b.updateQueue, n === null ? (n = { lastEffect: null, stores: null }, b.updateQueue = n, n.lastEffect = e.next = e) : (t = n.lastEffect, t === null ? n.lastEffect = e.next = e : (r = t.next, t.next = e, e.next = r, n.lastEffect = e)), e;
  }
  function Ss() {
    return Xe().memoizedState;
  }
  function ul(e, n, t, r) {
    var l = mn();
    b.flags |= e, l.memoizedState = cr(1 | n, t, void 0, r === void 0 ? null : r);
  }
  function il(e, n, t, r) {
    var l = Xe();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (oe !== null) {
      var u = oe.memoizedState;
      if (o = u.destroy, r !== null && $o(r, u.deps)) {
        l.memoizedState = cr(n, t, o, r);
        return;
      }
    }
    b.flags |= e, l.memoizedState = cr(1 | n, t, o, r);
  }
  function Es(e, n) {
    return ul(8390656, 8, e, n);
  }
  function Xo(e, n) {
    return il(2048, 8, e, n);
  }
  function _s(e, n) {
    return il(4, 2, e, n);
  }
  function Cs(e, n) {
    return il(4, 4, e, n);
  }
  function xs(e, n) {
    if (typeof n == "function")
      return e = e(), n(e), function() {
        n(null);
      };
    if (n != null)
      return e = e(), n.current = e, function() {
        n.current = null;
      };
  }
  function Ps(e, n, t) {
    return t = t != null ? t.concat([e]) : null, il(4, 4, xs.bind(null, n, e), t);
  }
  function Go() {
  }
  function Ns(e, n) {
    var t = Xe();
    n = n === void 0 ? null : n;
    var r = t.memoizedState;
    return r !== null && n !== null && $o(n, r[1]) ? r[0] : (t.memoizedState = [e, n], e);
  }
  function zs(e, n) {
    var t = Xe();
    n = n === void 0 ? null : n;
    var r = t.memoizedState;
    return r !== null && n !== null && $o(n, r[1]) ? r[0] : (e = e(), t.memoizedState = [e, n], e);
  }
  function Ls(e, n, t) {
    return et & 21 ? (nn(t, n) || (t = ni(), b.lanes |= t, nt |= t, e.baseState = !0), n) : (e.baseState && (e.baseState = !1, Me = !0), e.memoizedState = t);
  }
  function ef(e, n) {
    var t = V;
    V = t !== 0 && 4 > t ? t : 4, e(!0);
    var r = Ho.transition;
    Ho.transition = {};
    try {
      e(!1), n();
    } finally {
      V = t, Ho.transition = r;
    }
  }
  function Ts() {
    return Xe().memoizedState;
  }
  function nf(e, n, t) {
    var r = Hn(e);
    if (t = { lane: r, action: t, hasEagerState: !1, eagerState: null, next: null }, Rs(e))
      Ms(n, t);
    else if (t = ns(e, n, t, r), t !== null) {
      var l = Pe();
      un(t, e, r, l), Os(t, n, r);
    }
  }
  function tf(e, n, t) {
    var r = Hn(e), l = { lane: r, action: t, hasEagerState: !1, eagerState: null, next: null };
    if (Rs(e))
      Ms(n, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = n.lastRenderedReducer, o !== null))
        try {
          var u = n.lastRenderedState, i = o(u, t);
          if (l.hasEagerState = !0, l.eagerState = i, nn(i, u)) {
            var s = n.interleaved;
            s === null ? (l.next = l, Do(n)) : (l.next = s.next, s.next = l), n.interleaved = l;
            return;
          }
        } catch {
        } finally {
        }
      t = ns(e, n, l, r), t !== null && (l = Pe(), un(t, e, r, l), Os(t, n, r));
    }
  }
  function Rs(e) {
    var n = e.alternate;
    return e === b || n !== null && n === b;
  }
  function Ms(e, n) {
    ir = ol = !0;
    var t = e.pending;
    t === null ? n.next = n : (n.next = t.next, t.next = n), e.pending = n;
  }
  function Os(e, n, t) {
    if (t & 4194240) {
      var r = n.lanes;
      r &= e.pendingLanes, t |= r, n.lanes = t, Xl(e, t);
    }
  }
  var sl = { readContext: Ye, useCallback: ge, useContext: ge, useEffect: ge, useImperativeHandle: ge, useInsertionEffect: ge, useLayoutEffect: ge, useMemo: ge, useReducer: ge, useRef: ge, useState: ge, useDebugValue: ge, useDeferredValue: ge, useTransition: ge, useMutableSource: ge, useSyncExternalStore: ge, useId: ge, unstable_isNewReconciler: !1 }, rf = { readContext: Ye, useCallback: function(e, n) {
    return mn().memoizedState = [e, n === void 0 ? null : n], e;
  }, useContext: Ye, useEffect: Es, useImperativeHandle: function(e, n, t) {
    return t = t != null ? t.concat([e]) : null, ul(
      4194308,
      4,
      xs.bind(null, n, e),
      t
    );
  }, useLayoutEffect: function(e, n) {
    return ul(4194308, 4, e, n);
  }, useInsertionEffect: function(e, n) {
    return ul(4, 2, e, n);
  }, useMemo: function(e, n) {
    var t = mn();
    return n = n === void 0 ? null : n, e = e(), t.memoizedState = [e, n], e;
  }, useReducer: function(e, n, t) {
    var r = mn();
    return n = t !== void 0 ? t(n) : n, r.memoizedState = r.baseState = n, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: n }, r.queue = e, e = e.dispatch = nf.bind(null, b, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var n = mn();
    return e = { current: e }, n.memoizedState = e;
  }, useState: ks, useDebugValue: Go, useDeferredValue: function(e) {
    return mn().memoizedState = e;
  }, useTransition: function() {
    var e = ks(!1), n = e[0];
    return e = ef.bind(null, e[1]), mn().memoizedState = e, [n, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, n, t) {
    var r = b, l = mn();
    if (Z) {
      if (t === void 0)
        throw Error(m(407));
      t = t();
    } else {
      if (t = n(), ce === null)
        throw Error(m(349));
      et & 30 || vs(r, n, t);
    }
    l.memoizedState = t;
    var o = { value: t, getSnapshot: n };
    return l.queue = o, Es(ys.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, cr(9, hs.bind(null, r, o, t, n), void 0, null), t;
  }, useId: function() {
    var e = mn(), n = ce.identifierPrefix;
    if (Z) {
      var t = Sn, r = kn;
      t = (r & ~(1 << 32 - en(r) - 1)).toString(32) + t, n = ":" + n + "R" + t, t = sr++, 0 < t && (n += "H" + t.toString(32)), n += ":";
    } else
      t = bc++, n = ":" + n + "r" + t.toString(32) + ":";
    return e.memoizedState = n;
  }, unstable_isNewReconciler: !1 }, lf = {
    readContext: Ye,
    useCallback: Ns,
    useContext: Ye,
    useEffect: Xo,
    useImperativeHandle: Ps,
    useInsertionEffect: _s,
    useLayoutEffect: Cs,
    useMemo: zs,
    useReducer: Ko,
    useRef: Ss,
    useState: function() {
      return Ko(ar);
    },
    useDebugValue: Go,
    useDeferredValue: function(e) {
      var n = Xe();
      return Ls(n, oe.memoizedState, e);
    },
    useTransition: function() {
      var e = Ko(ar)[0], n = Xe().memoizedState;
      return [e, n];
    },
    useMutableSource: ps,
    useSyncExternalStore: ms,
    useId: Ts,
    unstable_isNewReconciler: !1
  }, of = { readContext: Ye, useCallback: Ns, useContext: Ye, useEffect: Xo, useImperativeHandle: Ps, useInsertionEffect: _s, useLayoutEffect: Cs, useMemo: zs, useReducer: Yo, useRef: Ss, useState: function() {
    return Yo(ar);
  }, useDebugValue: Go, useDeferredValue: function(e) {
    var n = Xe();
    return oe === null ? n.memoizedState = e : Ls(n, oe.memoizedState, e);
  }, useTransition: function() {
    var e = Yo(ar)[0], n = Xe().memoizedState;
    return [e, n];
  }, useMutableSource: ps, useSyncExternalStore: ms, useId: Ts, unstable_isNewReconciler: !1 };
  function Pt(e, n) {
    try {
      var t = "", r = n;
      do
        t += W(r), r = r.return;
      while (r);
      var l = t;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: n, stack: l, digest: null };
  }
  function Zo(e, n, t) {
    return { value: e, source: null, stack: t ?? null, digest: n ?? null };
  }
  function Jo(e, n) {
    try {
      console.error(n.value);
    } catch (t) {
      setTimeout(function() {
        throw t;
      });
    }
  }
  var uf = typeof WeakMap == "function" ? WeakMap : Map;
  function Ds(e, n, t) {
    t = _n(-1, t), t.tag = 3, t.payload = { element: null };
    var r = n.value;
    return t.callback = function() {
      vl || (vl = !0, du = r), Jo(e, n);
    }, t;
  }
  function Fs(e, n, t) {
    t = _n(-1, t), t.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = n.value;
      t.payload = function() {
        return r(l);
      }, t.callback = function() {
        Jo(e, n);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (t.callback = function() {
      Jo(e, n), typeof r != "function" && (Vn === null ? Vn = /* @__PURE__ */ new Set([this]) : Vn.add(this));
      var u = n.stack;
      this.componentDidCatch(n.value, { componentStack: u !== null ? u : "" });
    }), t;
  }
  function Is(e, n, t) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new uf();
      var l = /* @__PURE__ */ new Set();
      r.set(n, l);
    } else
      l = r.get(n), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(n, l));
    l.has(t) || (l.add(t), e = Sf.bind(null, e, n, t), n.then(e, e));
  }
  function js(e) {
    do {
      var n;
      if ((n = e.tag === 13) && (n = e.memoizedState, n = n !== null ? n.dehydrated !== null : !0), n)
        return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Us(e, n, t, r, l) {
    return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === n ? e.flags |= 65536 : (e.flags |= 128, t.flags |= 131072, t.flags &= -52805, t.tag === 1 && (t.alternate === null ? t.tag = 17 : (n = _n(-1, 1), n.tag = 2, Un(t, n, 1))), t.lanes |= 1), e);
  }
  var sf = he.ReactCurrentOwner, Me = !1;
  function xe(e, n, t, r) {
    n.child = e === null ? fs(n, null, t, r) : Ct(n, e.child, t, r);
  }
  function As(e, n, t, r, l) {
    t = t.render;
    var o = n.ref;
    return _t(n, l), r = Wo(e, n, t, r, o, l), t = Qo(), e !== null && !Me ? (n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, Cn(e, n, l)) : (Z && t && xo(n), n.flags |= 1, xe(e, n, r, l), n.child);
  }
  function Vs(e, n, t, r, l) {
    if (e === null) {
      var o = t.type;
      return typeof o == "function" && !wu(o) && o.defaultProps === void 0 && t.compare === null && t.defaultProps === void 0 ? (n.tag = 15, n.type = o, Bs(e, n, o, r, l)) : (e = Sl(t.type, null, r, n, n.mode, l), e.ref = n.ref, e.return = n, n.child = e);
    }
    if (o = e.child, !(e.lanes & l)) {
      var u = o.memoizedProps;
      if (t = t.compare, t = t !== null ? t : Zt, t(u, r) && e.ref === n.ref)
        return Cn(e, n, l);
    }
    return n.flags |= 1, e = Wn(o, r), e.ref = n.ref, e.return = n, n.child = e;
  }
  function Bs(e, n, t, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (Zt(o, r) && e.ref === n.ref)
        if (Me = !1, n.pendingProps = r = o, (e.lanes & l) !== 0)
          e.flags & 131072 && (Me = !0);
        else
          return n.lanes = e.lanes, Cn(e, n, l);
    }
    return qo(e, n, t, r, l);
  }
  function Hs(e, n, t) {
    var r = n.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden")
      if (!(n.mode & 1))
        n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Q(zt, Be), Be |= t;
      else {
        if (!(t & 1073741824))
          return e = o !== null ? o.baseLanes | t : t, n.lanes = n.childLanes = 1073741824, n.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, n.updateQueue = null, Q(zt, Be), Be |= e, null;
        n.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : t, Q(zt, Be), Be |= r;
      }
    else
      o !== null ? (r = o.baseLanes | t, n.memoizedState = null) : r = t, Q(zt, Be), Be |= r;
    return xe(e, n, l, t), n.child;
  }
  function $s(e, n) {
    var t = n.ref;
    (e === null && t !== null || e !== null && e.ref !== t) && (n.flags |= 512, n.flags |= 2097152);
  }
  function qo(e, n, t, r, l) {
    var o = Re(t) ? Gn : ye.current;
    return o = gt(n, o), _t(n, l), t = Wo(e, n, t, r, o, l), r = Qo(), e !== null && !Me ? (n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, Cn(e, n, l)) : (Z && r && xo(n), n.flags |= 1, xe(e, n, t, l), n.child);
  }
  function Ws(e, n, t, r, l) {
    if (Re(t)) {
      var o = !0;
      Kr(n);
    } else
      o = !1;
    if (_t(n, l), n.stateNode === null)
      cl(e, n), is(n, t, r), jo(n, t, r, l), r = !0;
    else if (e === null) {
      var u = n.stateNode, i = n.memoizedProps;
      u.props = i;
      var s = u.context, p = t.contextType;
      typeof p == "object" && p !== null ? p = Ye(p) : (p = Re(t) ? Gn : ye.current, p = gt(n, p));
      var y = t.getDerivedStateFromProps, g = typeof y == "function" || typeof u.getSnapshotBeforeUpdate == "function";
      g || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== r || s !== p) && ss(n, u, r, p), jn = !1;
      var v = n.memoizedState;
      u.state = v, el(n, r, u, l), s = n.memoizedState, i !== r || v !== s || Te.current || jn ? (typeof y == "function" && (Io(n, t, y, r), s = n.memoizedState), (i = jn || us(n, t, i, r, v, s, p)) ? (g || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (n.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (n.flags |= 4194308), n.memoizedProps = r, n.memoizedState = s), u.props = r, u.state = s, u.context = p, r = i) : (typeof u.componentDidMount == "function" && (n.flags |= 4194308), r = !1);
    } else {
      u = n.stateNode, ts(e, n), i = n.memoizedProps, p = n.type === n.elementType ? i : rn(n.type, i), u.props = p, g = n.pendingProps, v = u.context, s = t.contextType, typeof s == "object" && s !== null ? s = Ye(s) : (s = Re(t) ? Gn : ye.current, s = gt(n, s));
      var S = t.getDerivedStateFromProps;
      (y = typeof S == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== g || v !== s) && ss(n, u, r, s), jn = !1, v = n.memoizedState, u.state = v, el(n, r, u, l);
      var C = n.memoizedState;
      i !== g || v !== C || Te.current || jn ? (typeof S == "function" && (Io(n, t, S, r), C = n.memoizedState), (p = jn || us(n, t, p, r, v, C, s) || !1) ? (y || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(r, C, s), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(r, C, s)), typeof u.componentDidUpdate == "function" && (n.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (n.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (n.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (n.flags |= 1024), n.memoizedProps = r, n.memoizedState = C), u.props = r, u.state = C, u.context = s, r = p) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (n.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && v === e.memoizedState || (n.flags |= 1024), r = !1);
    }
    return bo(e, n, t, r, o, l);
  }
  function bo(e, n, t, r, l, o) {
    $s(e, n);
    var u = (n.flags & 128) !== 0;
    if (!r && !u)
      return l && Xi(n, t, !1), Cn(e, n, o);
    r = n.stateNode, sf.current = n;
    var i = u && typeof t.getDerivedStateFromError != "function" ? null : r.render();
    return n.flags |= 1, e !== null && u ? (n.child = Ct(n, e.child, null, o), n.child = Ct(n, null, i, o)) : xe(e, n, i, o), n.memoizedState = r.state, l && Xi(n, t, !0), n.child;
  }
  function Qs(e) {
    var n = e.stateNode;
    n.pendingContext ? Ki(e, n.pendingContext, n.pendingContext !== n.context) : n.context && Ki(e, n.context, !1), Uo(e, n.containerInfo);
  }
  function Ks(e, n, t, r, l) {
    return St(), Lo(l), n.flags |= 256, xe(e, n, t, r), n.child;
  }
  var eu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nu(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function Ys(e, n, t) {
    var r = n.pendingProps, l = q.current, o = !1, u = (n.flags & 128) !== 0, i;
    if ((i = u) || (i = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), i ? (o = !0, n.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), Q(q, l & 1), e === null)
      return zo(n), e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (n.mode & 1 ? e.data === "$!" ? n.lanes = 8 : n.lanes = 1073741824 : n.lanes = 1, null) : (u = r.children, e = r.fallback, o ? (r = n.mode, o = n.child, u = { mode: "hidden", children: u }, !(r & 1) && o !== null ? (o.childLanes = 0, o.pendingProps = u) : o = El(u, r, 0, null), e = ot(e, r, t, null), o.return = n, e.return = n, o.sibling = e, n.child = o, n.child.memoizedState = nu(t), n.memoizedState = eu, e) : tu(n, u));
    if (l = e.memoizedState, l !== null && (i = l.dehydrated, i !== null))
      return af(e, n, u, r, i, l, t);
    if (o) {
      o = r.fallback, u = n.mode, l = e.child, i = l.sibling;
      var s = { mode: "hidden", children: r.children };
      return !(u & 1) && n.child !== l ? (r = n.child, r.childLanes = 0, r.pendingProps = s, n.deletions = null) : (r = Wn(l, s), r.subtreeFlags = l.subtreeFlags & 14680064), i !== null ? o = Wn(i, o) : (o = ot(o, u, t, null), o.flags |= 2), o.return = n, r.return = n, r.sibling = o, n.child = r, r = o, o = n.child, u = e.child.memoizedState, u = u === null ? nu(t) : { baseLanes: u.baseLanes | t, cachePool: null, transitions: u.transitions }, o.memoizedState = u, o.childLanes = e.childLanes & ~t, n.memoizedState = eu, r;
    }
    return o = e.child, e = o.sibling, r = Wn(o, { mode: "visible", children: r.children }), !(n.mode & 1) && (r.lanes = t), r.return = n, r.sibling = null, e !== null && (t = n.deletions, t === null ? (n.deletions = [e], n.flags |= 16) : t.push(e)), n.child = r, n.memoizedState = null, r;
  }
  function tu(e, n) {
    return n = El({ mode: "visible", children: n }, e.mode, 0, null), n.return = e, e.child = n;
  }
  function al(e, n, t, r) {
    return r !== null && Lo(r), Ct(n, e.child, null, t), e = tu(n, n.pendingProps.children), e.flags |= 2, n.memoizedState = null, e;
  }
  function af(e, n, t, r, l, o, u) {
    if (t)
      return n.flags & 256 ? (n.flags &= -257, r = Zo(Error(m(422))), al(e, n, u, r)) : n.memoizedState !== null ? (n.child = e.child, n.flags |= 128, null) : (o = r.fallback, l = n.mode, r = El({ mode: "visible", children: r.children }, l, 0, null), o = ot(o, l, u, null), o.flags |= 2, r.return = n, o.return = n, r.sibling = o, n.child = r, n.mode & 1 && Ct(n, e.child, null, u), n.child.memoizedState = nu(u), n.memoizedState = eu, o);
    if (!(n.mode & 1))
      return al(e, n, u, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r)
        var i = r.dgst;
      return r = i, o = Error(m(419)), r = Zo(o, r, void 0), al(e, n, u, r);
    }
    if (i = (u & e.childLanes) !== 0, Me || i) {
      if (r = ce, r !== null) {
        switch (u & -u) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
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
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = l & (r.suspendedLanes | u) ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, En(e, l), un(r, e, l, -1));
      }
      return gu(), r = Zo(Error(m(421))), al(e, n, u, r);
    }
    return l.data === "$?" ? (n.flags |= 128, n.child = e.child, n = Ef.bind(null, e), l._reactRetry = n, null) : (e = o.treeContext, Ve = On(l.nextSibling), Ae = n, Z = !0, tn = null, e !== null && (Qe[Ke++] = kn, Qe[Ke++] = Sn, Qe[Ke++] = Zn, kn = e.id, Sn = e.overflow, Zn = n), n = tu(n, r.children), n.flags |= 4096, n);
  }
  function Xs(e, n, t) {
    e.lanes |= n;
    var r = e.alternate;
    r !== null && (r.lanes |= n), Oo(e.return, n, t);
  }
  function ru(e, n, t, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: n, rendering: null, renderingStartTime: 0, last: r, tail: t, tailMode: l } : (o.isBackwards = n, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = t, o.tailMode = l);
  }
  function Gs(e, n, t) {
    var r = n.pendingProps, l = r.revealOrder, o = r.tail;
    if (xe(e, n, r.children, t), r = q.current, r & 2)
      r = r & 1 | 2, n.flags |= 128;
    else {
      if (e !== null && e.flags & 128)
        e:
          for (e = n.child; e !== null; ) {
            if (e.tag === 13)
              e.memoizedState !== null && Xs(e, t, n);
            else if (e.tag === 19)
              Xs(e, t, n);
            else if (e.child !== null) {
              e.child.return = e, e = e.child;
              continue;
            }
            if (e === n)
              break e;
            for (; e.sibling === null; ) {
              if (e.return === null || e.return === n)
                break e;
              e = e.return;
            }
            e.sibling.return = e.return, e = e.sibling;
          }
      r &= 1;
    }
    if (Q(q, r), !(n.mode & 1))
      n.memoizedState = null;
    else
      switch (l) {
        case "forwards":
          for (t = n.child, l = null; t !== null; )
            e = t.alternate, e !== null && rl(e) === null && (l = t), t = t.sibling;
          t = l, t === null ? (l = n.child, n.child = null) : (l = t.sibling, t.sibling = null), ru(n, !1, l, t, o);
          break;
        case "backwards":
          for (t = null, l = n.child, n.child = null; l !== null; ) {
            if (e = l.alternate, e !== null && rl(e) === null) {
              n.child = l;
              break;
            }
            e = l.sibling, l.sibling = t, t = l, l = e;
          }
          ru(n, !0, t, null, o);
          break;
        case "together":
          ru(n, !1, null, null, void 0);
          break;
        default:
          n.memoizedState = null;
      }
    return n.child;
  }
  function cl(e, n) {
    !(n.mode & 1) && e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2);
  }
  function Cn(e, n, t) {
    if (e !== null && (n.dependencies = e.dependencies), nt |= n.lanes, !(t & n.childLanes))
      return null;
    if (e !== null && n.child !== e.child)
      throw Error(m(153));
    if (n.child !== null) {
      for (e = n.child, t = Wn(e, e.pendingProps), n.child = t, t.return = n; e.sibling !== null; )
        e = e.sibling, t = t.sibling = Wn(e, e.pendingProps), t.return = n;
      t.sibling = null;
    }
    return n.child;
  }
  function cf(e, n, t) {
    switch (n.tag) {
      case 3:
        Qs(n), St();
        break;
      case 5:
        ds(n);
        break;
      case 1:
        Re(n.type) && Kr(n);
        break;
      case 4:
        Uo(n, n.stateNode.containerInfo);
        break;
      case 10:
        var r = n.type._context, l = n.memoizedProps.value;
        Q(Jr, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = n.memoizedState, r !== null)
          return r.dehydrated !== null ? (Q(q, q.current & 1), n.flags |= 128, null) : t & n.child.childLanes ? Ys(e, n, t) : (Q(q, q.current & 1), e = Cn(e, n, t), e !== null ? e.sibling : null);
        Q(q, q.current & 1);
        break;
      case 19:
        if (r = (t & n.childLanes) !== 0, e.flags & 128) {
          if (r)
            return Gs(e, n, t);
          n.flags |= 128;
        }
        if (l = n.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), Q(q, q.current), r)
          break;
        return null;
      case 22:
      case 23:
        return n.lanes = 0, Hs(e, n, t);
    }
    return Cn(e, n, t);
  }
  var Zs, lu, Js, qs;
  Zs = function(e, n) {
    for (var t = n.child; t !== null; ) {
      if (t.tag === 5 || t.tag === 6)
        e.appendChild(t.stateNode);
      else if (t.tag !== 4 && t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === n)
        break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === n)
          return;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  }, lu = function() {
  }, Js = function(e, n, t, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = n.stateNode, bn(pn.current);
      var o = null;
      switch (t) {
        case "input":
          l = Ml(e, l), r = Ml(e, r), o = [];
          break;
        case "select":
          l = a({}, l, { value: void 0 }), r = a({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Fl(e, l), r = Fl(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = $r);
      }
      jl(t, r);
      var u;
      t = null;
      for (p in l)
        if (!r.hasOwnProperty(p) && l.hasOwnProperty(p) && l[p] != null)
          if (p === "style") {
            var i = l[p];
            for (u in i)
              i.hasOwnProperty(u) && (t || (t = {}), t[u] = "");
          } else
            p !== "dangerouslySetInnerHTML" && p !== "children" && p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (ie.hasOwnProperty(p) ? o || (o = []) : (o = o || []).push(p, null));
      for (p in r) {
        var s = r[p];
        if (i = l != null ? l[p] : void 0, r.hasOwnProperty(p) && s !== i && (s != null || i != null))
          if (p === "style")
            if (i) {
              for (u in i)
                !i.hasOwnProperty(u) || s && s.hasOwnProperty(u) || (t || (t = {}), t[u] = "");
              for (u in s)
                s.hasOwnProperty(u) && i[u] !== s[u] && (t || (t = {}), t[u] = s[u]);
            } else
              t || (o || (o = []), o.push(
                p,
                t
              )), t = s;
          else
            p === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, i = i ? i.__html : void 0, s != null && i !== s && (o = o || []).push(p, s)) : p === "children" ? typeof s != "string" && typeof s != "number" || (o = o || []).push(p, "" + s) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && (ie.hasOwnProperty(p) ? (s != null && p === "onScroll" && K("scroll", e), o || i === s || (o = [])) : (o = o || []).push(p, s));
      }
      t && (o = o || []).push("style", t);
      var p = o;
      (n.updateQueue = p) && (n.flags |= 4);
    }
  }, qs = function(e, n, t, r) {
    t !== r && (n.flags |= 4);
  };
  function fr(e, n) {
    if (!Z)
      switch (e.tailMode) {
        case "hidden":
          n = e.tail;
          for (var t = null; n !== null; )
            n.alternate !== null && (t = n), n = n.sibling;
          t === null ? e.tail = null : t.sibling = null;
          break;
        case "collapsed":
          t = e.tail;
          for (var r = null; t !== null; )
            t.alternate !== null && (r = t), t = t.sibling;
          r === null ? n || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
      }
  }
  function we(e) {
    var n = e.alternate !== null && e.alternate.child === e.child, t = 0, r = 0;
    if (n)
      for (var l = e.child; l !== null; )
        t |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else
      for (l = e.child; l !== null; )
        t |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = t, n;
  }
  function ff(e, n, t) {
    var r = n.pendingProps;
    switch (Po(n), n.tag) {
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
        return we(n), null;
      case 1:
        return Re(n.type) && Qr(), we(n), null;
      case 3:
        return r = n.stateNode, xt(), Y(Te), Y(ye), Bo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (Zr(n) ? n.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(n.flags & 256) || (n.flags |= 1024, tn !== null && (vu(tn), tn = null))), lu(e, n), we(n), null;
      case 5:
        Ao(n);
        var l = bn(ur.current);
        if (t = n.type, e !== null && n.stateNode != null)
          Js(e, n, t, r, l), e.ref !== n.ref && (n.flags |= 512, n.flags |= 2097152);
        else {
          if (!r) {
            if (n.stateNode === null)
              throw Error(m(166));
            return we(n), null;
          }
          if (e = bn(pn.current), Zr(n)) {
            r = n.stateNode, t = n.type;
            var o = n.memoizedProps;
            switch (r[dn] = n, r[nr] = o, e = (n.mode & 1) !== 0, t) {
              case "dialog":
                K("cancel", r), K("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                K("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < qt.length; l++)
                  K(qt[l], r);
                break;
              case "source":
                K("error", r);
                break;
              case "img":
              case "image":
              case "link":
                K(
                  "error",
                  r
                ), K("load", r);
                break;
              case "details":
                K("toggle", r);
                break;
              case "input":
                Ru(r, o), K("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, K("invalid", r);
                break;
              case "textarea":
                Du(r, o), K("invalid", r);
            }
            jl(t, o), l = null;
            for (var u in o)
              if (o.hasOwnProperty(u)) {
                var i = o[u];
                u === "children" ? typeof i == "string" ? r.textContent !== i && (o.suppressHydrationWarning !== !0 && Hr(r.textContent, i, e), l = ["children", i]) : typeof i == "number" && r.textContent !== "" + i && (o.suppressHydrationWarning !== !0 && Hr(
                  r.textContent,
                  i,
                  e
                ), l = ["children", "" + i]) : ie.hasOwnProperty(u) && i != null && u === "onScroll" && K("scroll", r);
              }
            switch (t) {
              case "input":
                wr(r), Ou(r, o, !0);
                break;
              case "textarea":
                wr(r), Iu(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = $r);
            }
            r = l, n.updateQueue = r, r !== null && (n.flags |= 4);
          } else {
            u = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = ju(t)), e === "http://www.w3.org/1999/xhtml" ? t === "script" ? (e = u.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = u.createElement(t, { is: r.is }) : (e = u.createElement(t), t === "select" && (u = e, r.multiple ? u.multiple = !0 : r.size && (u.size = r.size))) : e = u.createElementNS(e, t), e[dn] = n, e[nr] = r, Zs(e, n, !1, !1), n.stateNode = e;
            e: {
              switch (u = Ul(t, r), t) {
                case "dialog":
                  K("cancel", e), K("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  K("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < qt.length; l++)
                    K(qt[l], e);
                  l = r;
                  break;
                case "source":
                  K("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  K(
                    "error",
                    e
                  ), K("load", e), l = r;
                  break;
                case "details":
                  K("toggle", e), l = r;
                  break;
                case "input":
                  Ru(e, r), l = Ml(e, r), K("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = a({}, r, { value: void 0 }), K("invalid", e);
                  break;
                case "textarea":
                  Du(e, r), l = Fl(e, r), K("invalid", e);
                  break;
                default:
                  l = r;
              }
              jl(t, l), i = l;
              for (o in i)
                if (i.hasOwnProperty(o)) {
                  var s = i[o];
                  o === "style" ? Vu(e, s) : o === "dangerouslySetInnerHTML" ? (s = s ? s.__html : void 0, s != null && Uu(e, s)) : o === "children" ? typeof s == "string" ? (t !== "textarea" || s !== "") && Ot(e, s) : typeof s == "number" && Ot(e, "" + s) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (ie.hasOwnProperty(o) ? s != null && o === "onScroll" && K("scroll", e) : s != null && Je(e, o, s, u));
                }
              switch (t) {
                case "input":
                  wr(e), Ou(e, r, !1);
                  break;
                case "textarea":
                  wr(e), Iu(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + A(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? ut(e, !!r.multiple, o, !1) : r.defaultValue != null && ut(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = $r);
              }
              switch (t) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (n.flags |= 4);
          }
          n.ref !== null && (n.flags |= 512, n.flags |= 2097152);
        }
        return we(n), null;
      case 6:
        if (e && n.stateNode != null)
          qs(e, n, e.memoizedProps, r);
        else {
          if (typeof r != "string" && n.stateNode === null)
            throw Error(m(166));
          if (t = bn(ur.current), bn(pn.current), Zr(n)) {
            if (r = n.stateNode, t = n.memoizedProps, r[dn] = n, (o = r.nodeValue !== t) && (e = Ae, e !== null))
              switch (e.tag) {
                case 3:
                  Hr(r.nodeValue, t, (e.mode & 1) !== 0);
                  break;
                case 5:
                  e.memoizedProps.suppressHydrationWarning !== !0 && Hr(r.nodeValue, t, (e.mode & 1) !== 0);
              }
            o && (n.flags |= 4);
          } else
            r = (t.nodeType === 9 ? t : t.ownerDocument).createTextNode(r), r[dn] = n, n.stateNode = r;
        }
        return we(n), null;
      case 13:
        if (Y(q), r = n.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Z && Ve !== null && n.mode & 1 && !(n.flags & 128))
            es(), St(), n.flags |= 98560, o = !1;
          else if (o = Zr(n), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o)
                throw Error(m(318));
              if (o = n.memoizedState, o = o !== null ? o.dehydrated : null, !o)
                throw Error(m(317));
              o[dn] = n;
            } else
              St(), !(n.flags & 128) && (n.memoizedState = null), n.flags |= 4;
            we(n), o = !1;
          } else
            tn !== null && (vu(tn), tn = null), o = !0;
          if (!o)
            return n.flags & 65536 ? n : null;
        }
        return n.flags & 128 ? (n.lanes = t, n) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (n.child.flags |= 8192, n.mode & 1 && (e === null || q.current & 1 ? ue === 0 && (ue = 3) : gu())), n.updateQueue !== null && (n.flags |= 4), we(n), null);
      case 4:
        return xt(), lu(e, n), e === null && bt(n.stateNode.containerInfo), we(n), null;
      case 10:
        return Mo(n.type._context), we(n), null;
      case 17:
        return Re(n.type) && Qr(), we(n), null;
      case 19:
        if (Y(q), o = n.memoizedState, o === null)
          return we(n), null;
        if (r = (n.flags & 128) !== 0, u = o.rendering, u === null)
          if (r)
            fr(o, !1);
          else {
            if (ue !== 0 || e !== null && e.flags & 128)
              for (e = n.child; e !== null; ) {
                if (u = rl(e), u !== null) {
                  for (n.flags |= 128, fr(o, !1), r = u.updateQueue, r !== null && (n.updateQueue = r, n.flags |= 4), n.subtreeFlags = 0, r = t, t = n.child; t !== null; )
                    o = t, e = r, o.flags &= 14680066, u = o.alternate, u === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = u.childLanes, o.lanes = u.lanes, o.child = u.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = u.memoizedProps, o.memoizedState = u.memoizedState, o.updateQueue = u.updateQueue, o.type = u.type, e = u.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), t = t.sibling;
                  return Q(q, q.current & 1 | 2), n.child;
                }
                e = e.sibling;
              }
            o.tail !== null && te() > Lt && (n.flags |= 128, r = !0, fr(o, !1), n.lanes = 4194304);
          }
        else {
          if (!r)
            if (e = rl(u), e !== null) {
              if (n.flags |= 128, r = !0, t = e.updateQueue, t !== null && (n.updateQueue = t, n.flags |= 4), fr(o, !0), o.tail === null && o.tailMode === "hidden" && !u.alternate && !Z)
                return we(n), null;
            } else
              2 * te() - o.renderingStartTime > Lt && t !== 1073741824 && (n.flags |= 128, r = !0, fr(o, !1), n.lanes = 4194304);
          o.isBackwards ? (u.sibling = n.child, n.child = u) : (t = o.last, t !== null ? t.sibling = u : n.child = u, o.last = u);
        }
        return o.tail !== null ? (n = o.tail, o.rendering = n, o.tail = n.sibling, o.renderingStartTime = te(), n.sibling = null, t = q.current, Q(q, r ? t & 1 | 2 : t & 1), n) : (we(n), null);
      case 22:
      case 23:
        return yu(), r = n.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (n.flags |= 8192), r && n.mode & 1 ? Be & 1073741824 && (we(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : we(n), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(m(156, n.tag));
  }
  function df(e, n) {
    switch (Po(n), n.tag) {
      case 1:
        return Re(n.type) && Qr(), e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
      case 3:
        return xt(), Y(Te), Y(ye), Bo(), e = n.flags, e & 65536 && !(e & 128) ? (n.flags = e & -65537 | 128, n) : null;
      case 5:
        return Ao(n), null;
      case 13:
        if (Y(q), e = n.memoizedState, e !== null && e.dehydrated !== null) {
          if (n.alternate === null)
            throw Error(m(340));
          St();
        }
        return e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
      case 19:
        return Y(q), null;
      case 4:
        return xt(), null;
      case 10:
        return Mo(n.type._context), null;
      case 22:
      case 23:
        return yu(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var fl = !1, ke = !1, pf = typeof WeakSet == "function" ? WeakSet : Set, _ = null;
  function Nt(e, n) {
    var t = e.ref;
    if (t !== null)
      if (typeof t == "function")
        try {
          t(null);
        } catch (r) {
          ne(e, n, r);
        }
      else
        t.current = null;
  }
  function ou(e, n, t) {
    try {
      t();
    } catch (r) {
      ne(e, n, r);
    }
  }
  var bs = !1;
  function mf(e, n) {
    if (yo = Rr, e = Ti(), so(e)) {
      if ("selectionStart" in e)
        var t = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          t = (t = e.ownerDocument) && t.defaultView || window;
          var r = t.getSelection && t.getSelection();
          if (r && r.rangeCount !== 0) {
            t = r.anchorNode;
            var l = r.anchorOffset, o = r.focusNode;
            r = r.focusOffset;
            try {
              t.nodeType, o.nodeType;
            } catch {
              t = null;
              break e;
            }
            var u = 0, i = -1, s = -1, p = 0, y = 0, g = e, v = null;
            n:
              for (; ; ) {
                for (var S; g !== t || l !== 0 && g.nodeType !== 3 || (i = u + l), g !== o || r !== 0 && g.nodeType !== 3 || (s = u + r), g.nodeType === 3 && (u += g.nodeValue.length), (S = g.firstChild) !== null; )
                  v = g, g = S;
                for (; ; ) {
                  if (g === e)
                    break n;
                  if (v === t && ++p === l && (i = u), v === o && ++y === r && (s = u), (S = g.nextSibling) !== null)
                    break;
                  g = v, v = g.parentNode;
                }
                g = S;
              }
            t = i === -1 || s === -1 ? null : { start: i, end: s };
          } else
            t = null;
        }
      t = t || { start: 0, end: 0 };
    } else
      t = null;
    for (go = { focusedElem: e, selectionRange: t }, Rr = !1, _ = n; _ !== null; )
      if (n = _, e = n.child, (n.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = n, _ = e;
      else
        for (; _ !== null; ) {
          n = _;
          try {
            var C = n.alternate;
            if (n.flags & 1024)
              switch (n.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (C !== null) {
                    var x = C.memoizedProps, re = C.memoizedState, f = n.stateNode, c = f.getSnapshotBeforeUpdate(n.elementType === n.type ? x : rn(n.type, x), re);
                    f.__reactInternalSnapshotBeforeUpdate = c;
                  }
                  break;
                case 3:
                  var d = n.stateNode.containerInfo;
                  d.nodeType === 1 ? d.textContent = "" : d.nodeType === 9 && d.documentElement && d.removeChild(d.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(m(163));
              }
          } catch (w) {
            ne(n, n.return, w);
          }
          if (e = n.sibling, e !== null) {
            e.return = n.return, _ = e;
            break;
          }
          _ = n.return;
        }
    return C = bs, bs = !1, C;
  }
  function dr(e, n, t) {
    var r = n.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && ou(n, t, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function dl(e, n) {
    if (n = n.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
      var t = n = n.next;
      do {
        if ((t.tag & e) === e) {
          var r = t.create;
          t.destroy = r();
        }
        t = t.next;
      } while (t !== n);
    }
  }
  function uu(e) {
    var n = e.ref;
    if (n !== null) {
      var t = e.stateNode;
      switch (e.tag) {
        case 5:
          e = t;
          break;
        default:
          e = t;
      }
      typeof n == "function" ? n(e) : n.current = e;
    }
  }
  function ea(e) {
    var n = e.alternate;
    n !== null && (e.alternate = null, ea(n)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (n = e.stateNode, n !== null && (delete n[dn], delete n[nr], delete n[Eo], delete n[Gc], delete n[Zc])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function na(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ta(e) {
    e:
      for (; ; ) {
        for (; e.sibling === null; ) {
          if (e.return === null || na(e.return))
            return null;
          e = e.return;
        }
        for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
          if (e.flags & 2 || e.child === null || e.tag === 4)
            continue e;
          e.child.return = e, e = e.child;
        }
        if (!(e.flags & 2))
          return e.stateNode;
      }
  }
  function iu(e, n, t) {
    var r = e.tag;
    if (r === 5 || r === 6)
      e = e.stateNode, n ? t.nodeType === 8 ? t.parentNode.insertBefore(e, n) : t.insertBefore(e, n) : (t.nodeType === 8 ? (n = t.parentNode, n.insertBefore(e, t)) : (n = t, n.appendChild(e)), t = t._reactRootContainer, t != null || n.onclick !== null || (n.onclick = $r));
    else if (r !== 4 && (e = e.child, e !== null))
      for (iu(e, n, t), e = e.sibling; e !== null; )
        iu(e, n, t), e = e.sibling;
  }
  function su(e, n, t) {
    var r = e.tag;
    if (r === 5 || r === 6)
      e = e.stateNode, n ? t.insertBefore(e, n) : t.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null))
      for (su(e, n, t), e = e.sibling; e !== null; )
        su(e, n, t), e = e.sibling;
  }
  var de = null, ln = !1;
  function An(e, n, t) {
    for (t = t.child; t !== null; )
      ra(e, n, t), t = t.sibling;
  }
  function ra(e, n, t) {
    if (fn && typeof fn.onCommitFiberUnmount == "function")
      try {
        fn.onCommitFiberUnmount(xr, t);
      } catch {
      }
    switch (t.tag) {
      case 5:
        ke || Nt(t, n);
      case 6:
        var r = de, l = ln;
        de = null, An(e, n, t), de = r, ln = l, de !== null && (ln ? (e = de, t = t.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(t) : e.removeChild(t)) : de.removeChild(t.stateNode));
        break;
      case 18:
        de !== null && (ln ? (e = de, t = t.stateNode, e.nodeType === 8 ? So(e.parentNode, t) : e.nodeType === 1 && So(e, t), Wt(e)) : So(de, t.stateNode));
        break;
      case 4:
        r = de, l = ln, de = t.stateNode.containerInfo, ln = !0, An(e, n, t), de = r, ln = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!ke && (r = t.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, u = o.destroy;
            o = o.tag, u !== void 0 && (o & 2 || o & 4) && ou(t, n, u), l = l.next;
          } while (l !== r);
        }
        An(e, n, t);
        break;
      case 1:
        if (!ke && (Nt(t, n), r = t.stateNode, typeof r.componentWillUnmount == "function"))
          try {
            r.props = t.memoizedProps, r.state = t.memoizedState, r.componentWillUnmount();
          } catch (i) {
            ne(t, n, i);
          }
        An(e, n, t);
        break;
      case 21:
        An(e, n, t);
        break;
      case 22:
        t.mode & 1 ? (ke = (r = ke) || t.memoizedState !== null, An(e, n, t), ke = r) : An(e, n, t);
        break;
      default:
        An(e, n, t);
    }
  }
  function la(e) {
    var n = e.updateQueue;
    if (n !== null) {
      e.updateQueue = null;
      var t = e.stateNode;
      t === null && (t = e.stateNode = new pf()), n.forEach(function(r) {
        var l = _f.bind(null, e, r);
        t.has(r) || (t.add(r), r.then(l, l));
      });
    }
  }
  function on(e, n) {
    var t = n.deletions;
    if (t !== null)
      for (var r = 0; r < t.length; r++) {
        var l = t[r];
        try {
          var o = e, u = n, i = u;
          e:
            for (; i !== null; ) {
              switch (i.tag) {
                case 5:
                  de = i.stateNode, ln = !1;
                  break e;
                case 3:
                  de = i.stateNode.containerInfo, ln = !0;
                  break e;
                case 4:
                  de = i.stateNode.containerInfo, ln = !0;
                  break e;
              }
              i = i.return;
            }
          if (de === null)
            throw Error(m(160));
          ra(o, u, l), de = null, ln = !1;
          var s = l.alternate;
          s !== null && (s.return = null), l.return = null;
        } catch (p) {
          ne(l, n, p);
        }
      }
    if (n.subtreeFlags & 12854)
      for (n = n.child; n !== null; )
        oa(n, e), n = n.sibling;
  }
  function oa(e, n) {
    var t = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (on(n, e), vn(e), r & 4) {
          try {
            dr(3, e, e.return), dl(3, e);
          } catch (x) {
            ne(e, e.return, x);
          }
          try {
            dr(5, e, e.return);
          } catch (x) {
            ne(e, e.return, x);
          }
        }
        break;
      case 1:
        on(n, e), vn(e), r & 512 && t !== null && Nt(t, t.return);
        break;
      case 5:
        if (on(n, e), vn(e), r & 512 && t !== null && Nt(t, t.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Ot(l, "");
          } catch (x) {
            ne(e, e.return, x);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, u = t !== null ? t.memoizedProps : o, i = e.type, s = e.updateQueue;
          if (e.updateQueue = null, s !== null)
            try {
              i === "input" && o.type === "radio" && o.name != null && Mu(l, o), Ul(i, u);
              var p = Ul(i, o);
              for (u = 0; u < s.length; u += 2) {
                var y = s[u], g = s[u + 1];
                y === "style" ? Vu(l, g) : y === "dangerouslySetInnerHTML" ? Uu(l, g) : y === "children" ? Ot(l, g) : Je(l, y, g, p);
              }
              switch (i) {
                case "input":
                  Ol(l, o);
                  break;
                case "textarea":
                  Fu(l, o);
                  break;
                case "select":
                  var v = l._wrapperState.wasMultiple;
                  l._wrapperState.wasMultiple = !!o.multiple;
                  var S = o.value;
                  S != null ? ut(l, !!o.multiple, S, !1) : v !== !!o.multiple && (o.defaultValue != null ? ut(
                    l,
                    !!o.multiple,
                    o.defaultValue,
                    !0
                  ) : ut(l, !!o.multiple, o.multiple ? [] : "", !1));
              }
              l[nr] = o;
            } catch (x) {
              ne(e, e.return, x);
            }
        }
        break;
      case 6:
        if (on(n, e), vn(e), r & 4) {
          if (e.stateNode === null)
            throw Error(m(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (x) {
            ne(e, e.return, x);
          }
        }
        break;
      case 3:
        if (on(n, e), vn(e), r & 4 && t !== null && t.memoizedState.isDehydrated)
          try {
            Wt(n.containerInfo);
          } catch (x) {
            ne(e, e.return, x);
          }
        break;
      case 4:
        on(n, e), vn(e);
        break;
      case 13:
        on(n, e), vn(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (fu = te())), r & 4 && la(e);
        break;
      case 22:
        if (y = t !== null && t.memoizedState !== null, e.mode & 1 ? (ke = (p = ke) || y, on(n, e), ke = p) : on(n, e), vn(e), r & 8192) {
          if (p = e.memoizedState !== null, (e.stateNode.isHidden = p) && !y && e.mode & 1)
            for (_ = e, y = e.child; y !== null; ) {
              for (g = _ = y; _ !== null; ) {
                switch (v = _, S = v.child, v.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    dr(4, v, v.return);
                    break;
                  case 1:
                    Nt(v, v.return);
                    var C = v.stateNode;
                    if (typeof C.componentWillUnmount == "function") {
                      r = v, t = v.return;
                      try {
                        n = r, C.props = n.memoizedProps, C.state = n.memoizedState, C.componentWillUnmount();
                      } catch (x) {
                        ne(r, t, x);
                      }
                    }
                    break;
                  case 5:
                    Nt(v, v.return);
                    break;
                  case 22:
                    if (v.memoizedState !== null) {
                      sa(g);
                      continue;
                    }
                }
                S !== null ? (S.return = v, _ = S) : sa(g);
              }
              y = y.sibling;
            }
          e:
            for (y = null, g = e; ; ) {
              if (g.tag === 5) {
                if (y === null) {
                  y = g;
                  try {
                    l = g.stateNode, p ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (i = g.stateNode, s = g.memoizedProps.style, u = s != null && s.hasOwnProperty("display") ? s.display : null, i.style.display = Au("display", u));
                  } catch (x) {
                    ne(e, e.return, x);
                  }
                }
              } else if (g.tag === 6) {
                if (y === null)
                  try {
                    g.stateNode.nodeValue = p ? "" : g.memoizedProps;
                  } catch (x) {
                    ne(e, e.return, x);
                  }
              } else if ((g.tag !== 22 && g.tag !== 23 || g.memoizedState === null || g === e) && g.child !== null) {
                g.child.return = g, g = g.child;
                continue;
              }
              if (g === e)
                break e;
              for (; g.sibling === null; ) {
                if (g.return === null || g.return === e)
                  break e;
                y === g && (y = null), g = g.return;
              }
              y === g && (y = null), g.sibling.return = g.return, g = g.sibling;
            }
        }
        break;
      case 19:
        on(n, e), vn(e), r & 4 && la(e);
        break;
      case 21:
        break;
      default:
        on(
          n,
          e
        ), vn(e);
    }
  }
  function vn(e) {
    var n = e.flags;
    if (n & 2) {
      try {
        e: {
          for (var t = e.return; t !== null; ) {
            if (na(t)) {
              var r = t;
              break e;
            }
            t = t.return;
          }
          throw Error(m(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Ot(l, ""), r.flags &= -33);
            var o = ta(e);
            su(e, o, l);
            break;
          case 3:
          case 4:
            var u = r.stateNode.containerInfo, i = ta(e);
            iu(e, i, u);
            break;
          default:
            throw Error(m(161));
        }
      } catch (s) {
        ne(e, e.return, s);
      }
      e.flags &= -3;
    }
    n & 4096 && (e.flags &= -4097);
  }
  function vf(e, n, t) {
    _ = e, ua(e);
  }
  function ua(e, n, t) {
    for (var r = (e.mode & 1) !== 0; _ !== null; ) {
      var l = _, o = l.child;
      if (l.tag === 22 && r) {
        var u = l.memoizedState !== null || fl;
        if (!u) {
          var i = l.alternate, s = i !== null && i.memoizedState !== null || ke;
          i = fl;
          var p = ke;
          if (fl = u, (ke = s) && !p)
            for (_ = l; _ !== null; )
              u = _, s = u.child, u.tag === 22 && u.memoizedState !== null ? aa(l) : s !== null ? (s.return = u, _ = s) : aa(l);
          for (; o !== null; )
            _ = o, ua(o), o = o.sibling;
          _ = l, fl = i, ke = p;
        }
        ia(e);
      } else
        l.subtreeFlags & 8772 && o !== null ? (o.return = l, _ = o) : ia(e);
    }
  }
  function ia(e) {
    for (; _ !== null; ) {
      var n = _;
      if (n.flags & 8772) {
        var t = n.alternate;
        try {
          if (n.flags & 8772)
            switch (n.tag) {
              case 0:
              case 11:
              case 15:
                ke || dl(5, n);
                break;
              case 1:
                var r = n.stateNode;
                if (n.flags & 4 && !ke)
                  if (t === null)
                    r.componentDidMount();
                  else {
                    var l = n.elementType === n.type ? t.memoizedProps : rn(n.type, t.memoizedProps);
                    r.componentDidUpdate(l, t.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
                  }
                var o = n.updateQueue;
                o !== null && ls(n, o, r);
                break;
              case 3:
                var u = n.updateQueue;
                if (u !== null) {
                  if (t = null, n.child !== null)
                    switch (n.child.tag) {
                      case 5:
                        t = n.child.stateNode;
                        break;
                      case 1:
                        t = n.child.stateNode;
                    }
                  ls(n, u, t);
                }
                break;
              case 5:
                var i = n.stateNode;
                if (t === null && n.flags & 4) {
                  t = i;
                  var s = n.memoizedProps;
                  switch (n.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      s.autoFocus && t.focus();
                      break;
                    case "img":
                      s.src && (t.src = s.src);
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
                if (n.memoizedState === null) {
                  var p = n.alternate;
                  if (p !== null) {
                    var y = p.memoizedState;
                    if (y !== null) {
                      var g = y.dehydrated;
                      g !== null && Wt(g);
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
                throw Error(m(163));
            }
          ke || n.flags & 512 && uu(n);
        } catch (v) {
          ne(n, n.return, v);
        }
      }
      if (n === e) {
        _ = null;
        break;
      }
      if (t = n.sibling, t !== null) {
        t.return = n.return, _ = t;
        break;
      }
      _ = n.return;
    }
  }
  function sa(e) {
    for (; _ !== null; ) {
      var n = _;
      if (n === e) {
        _ = null;
        break;
      }
      var t = n.sibling;
      if (t !== null) {
        t.return = n.return, _ = t;
        break;
      }
      _ = n.return;
    }
  }
  function aa(e) {
    for (; _ !== null; ) {
      var n = _;
      try {
        switch (n.tag) {
          case 0:
          case 11:
          case 15:
            var t = n.return;
            try {
              dl(4, n);
            } catch (s) {
              ne(n, t, s);
            }
            break;
          case 1:
            var r = n.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = n.return;
              try {
                r.componentDidMount();
              } catch (s) {
                ne(n, l, s);
              }
            }
            var o = n.return;
            try {
              uu(n);
            } catch (s) {
              ne(n, o, s);
            }
            break;
          case 5:
            var u = n.return;
            try {
              uu(n);
            } catch (s) {
              ne(n, u, s);
            }
        }
      } catch (s) {
        ne(n, n.return, s);
      }
      if (n === e) {
        _ = null;
        break;
      }
      var i = n.sibling;
      if (i !== null) {
        i.return = n.return, _ = i;
        break;
      }
      _ = n.return;
    }
  }
  var hf = Math.ceil, pl = he.ReactCurrentDispatcher, au = he.ReactCurrentOwner, Ge = he.ReactCurrentBatchConfig, I = 0, ce = null, le = null, pe = 0, Be = 0, zt = Dn(0), ue = 0, pr = null, nt = 0, ml = 0, cu = 0, mr = null, Oe = null, fu = 0, Lt = 1 / 0, xn = null, vl = !1, du = null, Vn = null, hl = !1, Bn = null, yl = 0, vr = 0, pu = null, gl = -1, wl = 0;
  function Pe() {
    return I & 6 ? te() : gl !== -1 ? gl : gl = te();
  }
  function Hn(e) {
    return e.mode & 1 ? I & 2 && pe !== 0 ? pe & -pe : qc.transition !== null ? (wl === 0 && (wl = ni()), wl) : (e = V, e !== 0 || (e = window.event, e = e === void 0 ? 16 : ci(e.type)), e) : 1;
  }
  function un(e, n, t, r) {
    if (50 < vr)
      throw vr = 0, pu = null, Error(m(185));
    At(e, t, r), (!(I & 2) || e !== ce) && (e === ce && (!(I & 2) && (ml |= t), ue === 4 && $n(e, pe)), De(e, r), t === 1 && I === 0 && !(n.mode & 1) && (Lt = te() + 500, Yr && In()));
  }
  function De(e, n) {
    var t = e.callbackNode;
    qa(e, n);
    var r = zr(e, e === ce ? pe : 0);
    if (r === 0)
      t !== null && qu(t), e.callbackNode = null, e.callbackPriority = 0;
    else if (n = r & -r, e.callbackPriority !== n) {
      if (t != null && qu(t), n === 1)
        e.tag === 0 ? Jc(fa.bind(null, e)) : Gi(fa.bind(null, e)), Yc(function() {
          !(I & 6) && In();
        }), t = null;
      else {
        switch (ti(r)) {
          case 1:
            t = Ql;
            break;
          case 4:
            t = bu;
            break;
          case 16:
            t = Cr;
            break;
          case 536870912:
            t = ei;
            break;
          default:
            t = Cr;
        }
        t = wa(t, ca.bind(null, e));
      }
      e.callbackPriority = n, e.callbackNode = t;
    }
  }
  function ca(e, n) {
    if (gl = -1, wl = 0, I & 6)
      throw Error(m(327));
    var t = e.callbackNode;
    if (Tt() && e.callbackNode !== t)
      return null;
    var r = zr(e, e === ce ? pe : 0);
    if (r === 0)
      return null;
    if (r & 30 || r & e.expiredLanes || n)
      n = kl(e, r);
    else {
      n = r;
      var l = I;
      I |= 2;
      var o = pa();
      (ce !== e || pe !== n) && (xn = null, Lt = te() + 500, rt(e, n));
      do
        try {
          wf();
          break;
        } catch (i) {
          da(e, i);
        }
      while (1);
      Ro(), pl.current = o, I = l, le !== null ? n = 0 : (ce = null, pe = 0, n = ue);
    }
    if (n !== 0) {
      if (n === 2 && (l = Kl(e), l !== 0 && (r = l, n = mu(e, l))), n === 1)
        throw t = pr, rt(e, 0), $n(e, r), De(e, te()), t;
      if (n === 6)
        $n(e, r);
      else {
        if (l = e.current.alternate, !(r & 30) && !yf(l) && (n = kl(e, r), n === 2 && (o = Kl(e), o !== 0 && (r = o, n = mu(e, o))), n === 1))
          throw t = pr, rt(e, 0), $n(e, r), De(e, te()), t;
        switch (e.finishedWork = l, e.finishedLanes = r, n) {
          case 0:
          case 1:
            throw Error(m(345));
          case 2:
            lt(e, Oe, xn);
            break;
          case 3:
            if ($n(e, r), (r & 130023424) === r && (n = fu + 500 - te(), 10 < n)) {
              if (zr(e, 0) !== 0)
                break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Pe(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = ko(lt.bind(null, e, Oe, xn), n);
              break;
            }
            lt(e, Oe, xn);
            break;
          case 4:
            if ($n(e, r), (r & 4194240) === r)
              break;
            for (n = e.eventTimes, l = -1; 0 < r; ) {
              var u = 31 - en(r);
              o = 1 << u, u = n[u], u > l && (l = u), r &= ~o;
            }
            if (r = l, r = te() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * hf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = ko(lt.bind(null, e, Oe, xn), r);
              break;
            }
            lt(e, Oe, xn);
            break;
          case 5:
            lt(e, Oe, xn);
            break;
          default:
            throw Error(m(329));
        }
      }
    }
    return De(e, te()), e.callbackNode === t ? ca.bind(null, e) : null;
  }
  function mu(e, n) {
    var t = mr;
    return e.current.memoizedState.isDehydrated && (rt(e, n).flags |= 256), e = kl(e, n), e !== 2 && (n = Oe, Oe = t, n !== null && vu(n)), e;
  }
  function vu(e) {
    Oe === null ? Oe = e : Oe.push.apply(Oe, e);
  }
  function yf(e) {
    for (var n = e; ; ) {
      if (n.flags & 16384) {
        var t = n.updateQueue;
        if (t !== null && (t = t.stores, t !== null))
          for (var r = 0; r < t.length; r++) {
            var l = t[r], o = l.getSnapshot;
            l = l.value;
            try {
              if (!nn(o(), l))
                return !1;
            } catch {
              return !1;
            }
          }
      }
      if (t = n.child, n.subtreeFlags & 16384 && t !== null)
        t.return = n, n = t;
      else {
        if (n === e)
          break;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === e)
            return !0;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
    }
    return !0;
  }
  function $n(e, n) {
    for (n &= ~cu, n &= ~ml, e.suspendedLanes |= n, e.pingedLanes &= ~n, e = e.expirationTimes; 0 < n; ) {
      var t = 31 - en(n), r = 1 << t;
      e[t] = -1, n &= ~r;
    }
  }
  function fa(e) {
    if (I & 6)
      throw Error(m(327));
    Tt();
    var n = zr(e, 0);
    if (!(n & 1))
      return De(e, te()), null;
    var t = kl(e, n);
    if (e.tag !== 0 && t === 2) {
      var r = Kl(e);
      r !== 0 && (n = r, t = mu(e, r));
    }
    if (t === 1)
      throw t = pr, rt(e, 0), $n(e, n), De(e, te()), t;
    if (t === 6)
      throw Error(m(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = n, lt(e, Oe, xn), De(e, te()), null;
  }
  function hu(e, n) {
    var t = I;
    I |= 1;
    try {
      return e(n);
    } finally {
      I = t, I === 0 && (Lt = te() + 500, Yr && In());
    }
  }
  function tt(e) {
    Bn !== null && Bn.tag === 0 && !(I & 6) && Tt();
    var n = I;
    I |= 1;
    var t = Ge.transition, r = V;
    try {
      if (Ge.transition = null, V = 1, e)
        return e();
    } finally {
      V = r, Ge.transition = t, I = n, !(I & 6) && In();
    }
  }
  function yu() {
    Be = zt.current, Y(zt);
  }
  function rt(e, n) {
    e.finishedWork = null, e.finishedLanes = 0;
    var t = e.timeoutHandle;
    if (t !== -1 && (e.timeoutHandle = -1, Kc(t)), le !== null)
      for (t = le.return; t !== null; ) {
        var r = t;
        switch (Po(r), r.tag) {
          case 1:
            r = r.type.childContextTypes, r != null && Qr();
            break;
          case 3:
            xt(), Y(Te), Y(ye), Bo();
            break;
          case 5:
            Ao(r);
            break;
          case 4:
            xt();
            break;
          case 13:
            Y(q);
            break;
          case 19:
            Y(q);
            break;
          case 10:
            Mo(r.type._context);
            break;
          case 22:
          case 23:
            yu();
        }
        t = t.return;
      }
    if (ce = e, le = e = Wn(e.current, null), pe = Be = n, ue = 0, pr = null, cu = ml = nt = 0, Oe = mr = null, qn !== null) {
      for (n = 0; n < qn.length; n++)
        if (t = qn[n], r = t.interleaved, r !== null) {
          t.interleaved = null;
          var l = r.next, o = t.pending;
          if (o !== null) {
            var u = o.next;
            o.next = l, r.next = u;
          }
          t.pending = r;
        }
      qn = null;
    }
    return e;
  }
  function da(e, n) {
    do {
      var t = le;
      try {
        if (Ro(), ll.current = sl, ol) {
          for (var r = b.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          ol = !1;
        }
        if (et = 0, ae = oe = b = null, ir = !1, sr = 0, au.current = null, t === null || t.return === null) {
          ue = 1, pr = n, le = null;
          break;
        }
        e: {
          var o = e, u = t.return, i = t, s = n;
          if (n = pe, i.flags |= 32768, s !== null && typeof s == "object" && typeof s.then == "function") {
            var p = s, y = i, g = y.tag;
            if (!(y.mode & 1) && (g === 0 || g === 11 || g === 15)) {
              var v = y.alternate;
              v ? (y.updateQueue = v.updateQueue, y.memoizedState = v.memoizedState, y.lanes = v.lanes) : (y.updateQueue = null, y.memoizedState = null);
            }
            var S = js(u);
            if (S !== null) {
              S.flags &= -257, Us(S, u, i, o, n), S.mode & 1 && Is(o, p, n), n = S, s = p;
              var C = n.updateQueue;
              if (C === null) {
                var x = /* @__PURE__ */ new Set();
                x.add(s), n.updateQueue = x;
              } else
                C.add(s);
              break e;
            } else {
              if (!(n & 1)) {
                Is(o, p, n), gu();
                break e;
              }
              s = Error(m(426));
            }
          } else if (Z && i.mode & 1) {
            var re = js(u);
            if (re !== null) {
              !(re.flags & 65536) && (re.flags |= 256), Us(re, u, i, o, n), Lo(Pt(s, i));
              break e;
            }
          }
          o = s = Pt(s, i), ue !== 4 && (ue = 2), mr === null ? mr = [o] : mr.push(o), o = u;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, n &= -n, o.lanes |= n;
                var f = Ds(o, s, n);
                rs(o, f);
                break e;
              case 1:
                i = s;
                var c = o.type, d = o.stateNode;
                if (!(o.flags & 128) && (typeof c.getDerivedStateFromError == "function" || d !== null && typeof d.componentDidCatch == "function" && (Vn === null || !Vn.has(d)))) {
                  o.flags |= 65536, n &= -n, o.lanes |= n;
                  var w = Fs(o, i, n);
                  rs(o, w);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        va(t);
      } catch (P) {
        n = P, le === t && t !== null && (le = t = t.return);
        continue;
      }
      break;
    } while (1);
  }
  function pa() {
    var e = pl.current;
    return pl.current = sl, e === null ? sl : e;
  }
  function gu() {
    (ue === 0 || ue === 3 || ue === 2) && (ue = 4), ce === null || !(nt & 268435455) && !(ml & 268435455) || $n(ce, pe);
  }
  function kl(e, n) {
    var t = I;
    I |= 2;
    var r = pa();
    (ce !== e || pe !== n) && (xn = null, rt(e, n));
    do
      try {
        gf();
        break;
      } catch (l) {
        da(e, l);
      }
    while (1);
    if (Ro(), I = t, pl.current = r, le !== null)
      throw Error(m(261));
    return ce = null, pe = 0, ue;
  }
  function gf() {
    for (; le !== null; )
      ma(le);
  }
  function wf() {
    for (; le !== null && !$a(); )
      ma(le);
  }
  function ma(e) {
    var n = ga(e.alternate, e, Be);
    e.memoizedProps = e.pendingProps, n === null ? va(e) : le = n, au.current = null;
  }
  function va(e) {
    var n = e;
    do {
      var t = n.alternate;
      if (e = n.return, n.flags & 32768) {
        if (t = df(t, n), t !== null) {
          t.flags &= 32767, le = t;
          return;
        }
        if (e !== null)
          e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          ue = 6, le = null;
          return;
        }
      } else if (t = ff(t, n, Be), t !== null) {
        le = t;
        return;
      }
      if (n = n.sibling, n !== null) {
        le = n;
        return;
      }
      le = n = e;
    } while (n !== null);
    ue === 0 && (ue = 5);
  }
  function lt(e, n, t) {
    var r = V, l = Ge.transition;
    try {
      Ge.transition = null, V = 1, kf(e, n, t, r);
    } finally {
      Ge.transition = l, V = r;
    }
    return null;
  }
  function kf(e, n, t, r) {
    do
      Tt();
    while (Bn !== null);
    if (I & 6)
      throw Error(m(327));
    t = e.finishedWork;
    var l = e.finishedLanes;
    if (t === null)
      return null;
    if (e.finishedWork = null, e.finishedLanes = 0, t === e.current)
      throw Error(m(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = t.lanes | t.childLanes;
    if (ba(e, o), e === ce && (le = ce = null, pe = 0), !(t.subtreeFlags & 2064) && !(t.flags & 2064) || hl || (hl = !0, wa(Cr, function() {
      return Tt(), null;
    })), o = (t.flags & 15990) !== 0, t.subtreeFlags & 15990 || o) {
      o = Ge.transition, Ge.transition = null;
      var u = V;
      V = 1;
      var i = I;
      I |= 4, au.current = null, mf(e, t), oa(t, e), Ac(go), Rr = !!yo, go = yo = null, e.current = t, vf(t), Wa(), I = i, V = u, Ge.transition = o;
    } else
      e.current = t;
    if (hl && (hl = !1, Bn = e, yl = l), o = e.pendingLanes, o === 0 && (Vn = null), Ya(t.stateNode), De(e, te()), n !== null)
      for (r = e.onRecoverableError, t = 0; t < n.length; t++)
        l = n[t], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (vl)
      throw vl = !1, e = du, du = null, e;
    return yl & 1 && e.tag !== 0 && Tt(), o = e.pendingLanes, o & 1 ? e === pu ? vr++ : (vr = 0, pu = e) : vr = 0, In(), null;
  }
  function Tt() {
    if (Bn !== null) {
      var e = ti(yl), n = Ge.transition, t = V;
      try {
        if (Ge.transition = null, V = 16 > e ? 16 : e, Bn === null)
          var r = !1;
        else {
          if (e = Bn, Bn = null, yl = 0, I & 6)
            throw Error(m(331));
          var l = I;
          for (I |= 4, _ = e.current; _ !== null; ) {
            var o = _, u = o.child;
            if (_.flags & 16) {
              var i = o.deletions;
              if (i !== null) {
                for (var s = 0; s < i.length; s++) {
                  var p = i[s];
                  for (_ = p; _ !== null; ) {
                    var y = _;
                    switch (y.tag) {
                      case 0:
                      case 11:
                      case 15:
                        dr(8, y, o);
                    }
                    var g = y.child;
                    if (g !== null)
                      g.return = y, _ = g;
                    else
                      for (; _ !== null; ) {
                        y = _;
                        var v = y.sibling, S = y.return;
                        if (ea(y), y === p) {
                          _ = null;
                          break;
                        }
                        if (v !== null) {
                          v.return = S, _ = v;
                          break;
                        }
                        _ = S;
                      }
                  }
                }
                var C = o.alternate;
                if (C !== null) {
                  var x = C.child;
                  if (x !== null) {
                    C.child = null;
                    do {
                      var re = x.sibling;
                      x.sibling = null, x = re;
                    } while (x !== null);
                  }
                }
                _ = o;
              }
            }
            if (o.subtreeFlags & 2064 && u !== null)
              u.return = o, _ = u;
            else
              e:
                for (; _ !== null; ) {
                  if (o = _, o.flags & 2048)
                    switch (o.tag) {
                      case 0:
                      case 11:
                      case 15:
                        dr(9, o, o.return);
                    }
                  var f = o.sibling;
                  if (f !== null) {
                    f.return = o.return, _ = f;
                    break e;
                  }
                  _ = o.return;
                }
          }
          var c = e.current;
          for (_ = c; _ !== null; ) {
            u = _;
            var d = u.child;
            if (u.subtreeFlags & 2064 && d !== null)
              d.return = u, _ = d;
            else
              e:
                for (u = c; _ !== null; ) {
                  if (i = _, i.flags & 2048)
                    try {
                      switch (i.tag) {
                        case 0:
                        case 11:
                        case 15:
                          dl(9, i);
                      }
                    } catch (P) {
                      ne(i, i.return, P);
                    }
                  if (i === u) {
                    _ = null;
                    break e;
                  }
                  var w = i.sibling;
                  if (w !== null) {
                    w.return = i.return, _ = w;
                    break e;
                  }
                  _ = i.return;
                }
          }
          if (I = l, In(), fn && typeof fn.onPostCommitFiberRoot == "function")
            try {
              fn.onPostCommitFiberRoot(xr, e);
            } catch {
            }
          r = !0;
        }
        return r;
      } finally {
        V = t, Ge.transition = n;
      }
    }
    return !1;
  }
  function ha(e, n, t) {
    n = Pt(t, n), n = Ds(e, n, 1), e = Un(e, n, 1), n = Pe(), e !== null && (At(e, 1, n), De(e, n));
  }
  function ne(e, n, t) {
    if (e.tag === 3)
      ha(e, e, t);
    else
      for (; n !== null; ) {
        if (n.tag === 3) {
          ha(n, e, t);
          break;
        } else if (n.tag === 1) {
          var r = n.stateNode;
          if (typeof n.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Vn === null || !Vn.has(r))) {
            e = Pt(t, e), e = Fs(n, e, 1), n = Un(n, e, 1), e = Pe(), n !== null && (At(n, 1, e), De(n, e));
            break;
          }
        }
        n = n.return;
      }
  }
  function Sf(e, n, t) {
    var r = e.pingCache;
    r !== null && r.delete(n), n = Pe(), e.pingedLanes |= e.suspendedLanes & t, ce === e && (pe & t) === t && (ue === 4 || ue === 3 && (pe & 130023424) === pe && 500 > te() - fu ? rt(e, 0) : cu |= t), De(e, n);
  }
  function ya(e, n) {
    n === 0 && (e.mode & 1 ? (n = Nr, Nr <<= 1, !(Nr & 130023424) && (Nr = 4194304)) : n = 1);
    var t = Pe();
    e = En(e, n), e !== null && (At(e, n, t), De(e, t));
  }
  function Ef(e) {
    var n = e.memoizedState, t = 0;
    n !== null && (t = n.retryLane), ya(e, t);
  }
  function _f(e, n) {
    var t = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, l = e.memoizedState;
        l !== null && (t = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(m(314));
    }
    r !== null && r.delete(n), ya(e, t);
  }
  var ga;
  ga = function(e, n, t) {
    if (e !== null)
      if (e.memoizedProps !== n.pendingProps || Te.current)
        Me = !0;
      else {
        if (!(e.lanes & t) && !(n.flags & 128))
          return Me = !1, cf(e, n, t);
        Me = !!(e.flags & 131072);
      }
    else
      Me = !1, Z && n.flags & 1048576 && Zi(n, Gr, n.index);
    switch (n.lanes = 0, n.tag) {
      case 2:
        var r = n.type;
        cl(e, n), e = n.pendingProps;
        var l = gt(n, ye.current);
        _t(n, t), l = Wo(null, n, r, e, l, t);
        var o = Qo();
        return n.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (n.tag = 1, n.memoizedState = null, n.updateQueue = null, Re(r) ? (o = !0, Kr(n)) : o = !1, n.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Fo(n), l.updater = nl, n.stateNode = l, l._reactInternals = n, jo(n, r, e, t), n = bo(null, n, r, !0, o, t)) : (n.tag = 0, Z && o && xo(n), xe(null, n, l, t), n = n.child), n;
      case 16:
        r = n.elementType;
        e: {
          switch (cl(e, n), e = n.pendingProps, l = r._init, r = l(r._payload), n.type = r, l = n.tag = xf(r), e = rn(r, e), l) {
            case 0:
              n = qo(null, n, r, e, t);
              break e;
            case 1:
              n = Ws(null, n, r, e, t);
              break e;
            case 11:
              n = As(null, n, r, e, t);
              break e;
            case 14:
              n = Vs(null, n, r, rn(r.type, e), t);
              break e;
          }
          throw Error(m(
            306,
            r,
            ""
          ));
        }
        return n;
      case 0:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : rn(r, l), qo(e, n, r, l, t);
      case 1:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : rn(r, l), Ws(e, n, r, l, t);
      case 3:
        e: {
          if (Qs(n), e === null)
            throw Error(m(387));
          r = n.pendingProps, o = n.memoizedState, l = o.element, ts(e, n), el(n, r, null, t);
          var u = n.memoizedState;
          if (r = u.element, o.isDehydrated)
            if (o = { element: r, isDehydrated: !1, cache: u.cache, pendingSuspenseBoundaries: u.pendingSuspenseBoundaries, transitions: u.transitions }, n.updateQueue.baseState = o, n.memoizedState = o, n.flags & 256) {
              l = Pt(Error(m(423)), n), n = Ks(e, n, r, t, l);
              break e;
            } else if (r !== l) {
              l = Pt(Error(m(424)), n), n = Ks(e, n, r, t, l);
              break e;
            } else
              for (Ve = On(n.stateNode.containerInfo.firstChild), Ae = n, Z = !0, tn = null, t = fs(n, null, r, t), n.child = t; t; )
                t.flags = t.flags & -3 | 4096, t = t.sibling;
          else {
            if (St(), r === l) {
              n = Cn(e, n, t);
              break e;
            }
            xe(e, n, r, t);
          }
          n = n.child;
        }
        return n;
      case 5:
        return ds(n), e === null && zo(n), r = n.type, l = n.pendingProps, o = e !== null ? e.memoizedProps : null, u = l.children, wo(r, l) ? u = null : o !== null && wo(r, o) && (n.flags |= 32), $s(e, n), xe(e, n, u, t), n.child;
      case 6:
        return e === null && zo(n), null;
      case 13:
        return Ys(e, n, t);
      case 4:
        return Uo(n, n.stateNode.containerInfo), r = n.pendingProps, e === null ? n.child = Ct(n, null, r, t) : xe(e, n, r, t), n.child;
      case 11:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : rn(r, l), As(e, n, r, l, t);
      case 7:
        return xe(e, n, n.pendingProps, t), n.child;
      case 8:
        return xe(e, n, n.pendingProps.children, t), n.child;
      case 12:
        return xe(e, n, n.pendingProps.children, t), n.child;
      case 10:
        e: {
          if (r = n.type._context, l = n.pendingProps, o = n.memoizedProps, u = l.value, Q(Jr, r._currentValue), r._currentValue = u, o !== null)
            if (nn(o.value, u)) {
              if (o.children === l.children && !Te.current) {
                n = Cn(e, n, t);
                break e;
              }
            } else
              for (o = n.child, o !== null && (o.return = n); o !== null; ) {
                var i = o.dependencies;
                if (i !== null) {
                  u = o.child;
                  for (var s = i.firstContext; s !== null; ) {
                    if (s.context === r) {
                      if (o.tag === 1) {
                        s = _n(-1, t & -t), s.tag = 2;
                        var p = o.updateQueue;
                        if (p !== null) {
                          p = p.shared;
                          var y = p.pending;
                          y === null ? s.next = s : (s.next = y.next, y.next = s), p.pending = s;
                        }
                      }
                      o.lanes |= t, s = o.alternate, s !== null && (s.lanes |= t), Oo(
                        o.return,
                        t,
                        n
                      ), i.lanes |= t;
                      break;
                    }
                    s = s.next;
                  }
                } else if (o.tag === 10)
                  u = o.type === n.type ? null : o.child;
                else if (o.tag === 18) {
                  if (u = o.return, u === null)
                    throw Error(m(341));
                  u.lanes |= t, i = u.alternate, i !== null && (i.lanes |= t), Oo(u, t, n), u = o.sibling;
                } else
                  u = o.child;
                if (u !== null)
                  u.return = o;
                else
                  for (u = o; u !== null; ) {
                    if (u === n) {
                      u = null;
                      break;
                    }
                    if (o = u.sibling, o !== null) {
                      o.return = u.return, u = o;
                      break;
                    }
                    u = u.return;
                  }
                o = u;
              }
          xe(e, n, l.children, t), n = n.child;
        }
        return n;
      case 9:
        return l = n.type, r = n.pendingProps.children, _t(n, t), l = Ye(l), r = r(l), n.flags |= 1, xe(e, n, r, t), n.child;
      case 14:
        return r = n.type, l = rn(r, n.pendingProps), l = rn(r.type, l), Vs(e, n, r, l, t);
      case 15:
        return Bs(e, n, n.type, n.pendingProps, t);
      case 17:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : rn(r, l), cl(e, n), n.tag = 1, Re(r) ? (e = !0, Kr(n)) : e = !1, _t(n, t), is(n, r, l), jo(n, r, l, t), bo(null, n, r, !0, e, t);
      case 19:
        return Gs(e, n, t);
      case 22:
        return Hs(e, n, t);
    }
    throw Error(m(156, n.tag));
  };
  function wa(e, n) {
    return Ju(e, n);
  }
  function Cf(e, n, t, r) {
    this.tag = e, this.key = t, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Ze(e, n, t, r) {
    return new Cf(e, n, t, r);
  }
  function wu(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function xf(e) {
    if (typeof e == "function")
      return wu(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === an)
        return 11;
      if (e === cn)
        return 14;
    }
    return 2;
  }
  function Wn(e, n) {
    var t = e.alternate;
    return t === null ? (t = Ze(e.tag, n, e.key, e.mode), t.elementType = e.elementType, t.type = e.type, t.stateNode = e.stateNode, t.alternate = e, e.alternate = t) : (t.pendingProps = n, t.type = e.type, t.flags = 0, t.subtreeFlags = 0, t.deletions = null), t.flags = e.flags & 14680064, t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, n = e.dependencies, t.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }, t.sibling = e.sibling, t.index = e.index, t.ref = e.ref, t;
  }
  function Sl(e, n, t, r, l, o) {
    var u = 2;
    if (r = e, typeof e == "function")
      wu(e) && (u = 1);
    else if (typeof e == "string")
      u = 5;
    else
      e:
        switch (e) {
          case Ne:
            return ot(t.children, l, o, n);
          case We:
            u = 8, l |= 8;
            break;
          case Pn:
            return e = Ze(12, t, n, l | 2), e.elementType = Pn, e.lanes = o, e;
          case je:
            return e = Ze(13, t, n, l), e.elementType = je, e.lanes = o, e;
          case be:
            return e = Ze(19, t, n, l), e.elementType = be, e.lanes = o, e;
          case ee:
            return El(t, l, o, n);
          default:
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case yn:
                  u = 10;
                  break e;
                case Kn:
                  u = 9;
                  break e;
                case an:
                  u = 11;
                  break e;
                case cn:
                  u = 14;
                  break e;
                case ze:
                  u = 16, r = null;
                  break e;
              }
            throw Error(m(130, e == null ? e : typeof e, ""));
        }
    return n = Ze(u, t, n, l), n.elementType = e, n.type = r, n.lanes = o, n;
  }
  function ot(e, n, t, r) {
    return e = Ze(7, e, r, n), e.lanes = t, e;
  }
  function El(e, n, t, r) {
    return e = Ze(22, e, r, n), e.elementType = ee, e.lanes = t, e.stateNode = { isHidden: !1 }, e;
  }
  function ku(e, n, t) {
    return e = Ze(6, e, null, n), e.lanes = t, e;
  }
  function Su(e, n, t) {
    return n = Ze(4, e.children !== null ? e.children : [], e.key, n), n.lanes = t, n.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, n;
  }
  function Pf(e, n, t, r, l) {
    this.tag = n, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Yl(0), this.expirationTimes = Yl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Yl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Eu(e, n, t, r, l, o, u, i, s) {
    return e = new Pf(e, n, t, i, s), n === 1 ? (n = 1, o === !0 && (n |= 8)) : n = 0, o = Ze(3, null, null, n), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: t, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Fo(o), e;
  }
  function Nf(e, n, t) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: Ce, key: r == null ? null : "" + r, children: e, containerInfo: n, implementation: t };
  }
  function ka(e) {
    if (!e)
      return Fn;
    e = e._reactInternals;
    e: {
      if (Yn(e) !== e || e.tag !== 1)
        throw Error(m(170));
      var n = e;
      do {
        switch (n.tag) {
          case 3:
            n = n.stateNode.context;
            break e;
          case 1:
            if (Re(n.type)) {
              n = n.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        n = n.return;
      } while (n !== null);
      throw Error(m(171));
    }
    if (e.tag === 1) {
      var t = e.type;
      if (Re(t))
        return Yi(e, t, n);
    }
    return n;
  }
  function Sa(e, n, t, r, l, o, u, i, s) {
    return e = Eu(t, r, !0, e, l, o, u, i, s), e.context = ka(null), t = e.current, r = Pe(), l = Hn(t), o = _n(r, l), o.callback = n ?? null, Un(t, o, l), e.current.lanes = l, At(e, l, r), De(e, r), e;
  }
  function _l(e, n, t, r) {
    var l = n.current, o = Pe(), u = Hn(l);
    return t = ka(t), n.context === null ? n.context = t : n.pendingContext = t, n = _n(o, u), n.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (n.callback = r), e = Un(l, n, u), e !== null && (un(e, l, u, o), br(e, l, u)), u;
  }
  function Cl(e) {
    if (e = e.current, !e.child)
      return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Ea(e, n) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var t = e.retryLane;
      e.retryLane = t !== 0 && t < n ? t : n;
    }
  }
  function _u(e, n) {
    Ea(e, n), (e = e.alternate) && Ea(e, n);
  }
  function zf() {
    return null;
  }
  var _a = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Cu(e) {
    this._internalRoot = e;
  }
  xl.prototype.render = Cu.prototype.render = function(e) {
    var n = this._internalRoot;
    if (n === null)
      throw Error(m(409));
    _l(e, n, null, null);
  }, xl.prototype.unmount = Cu.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var n = e.containerInfo;
      tt(function() {
        _l(null, e, null, null);
      }), n[gn] = null;
    }
  };
  function xl(e) {
    this._internalRoot = e;
  }
  xl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var n = oi();
      e = { blockedOn: null, target: e, priority: n };
      for (var t = 0; t < Tn.length && n !== 0 && n < Tn[t].priority; t++)
        ;
      Tn.splice(t, 0, e), t === 0 && si(e);
    }
  };
  function xu(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Pl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Ca() {
  }
  function Lf(e, n, t, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var p = Cl(u);
          o.call(p);
        };
      }
      var u = Sa(n, r, e, 0, null, !1, !1, "", Ca);
      return e._reactRootContainer = u, e[gn] = u.current, bt(e.nodeType === 8 ? e.parentNode : e), tt(), u;
    }
    for (; l = e.lastChild; )
      e.removeChild(l);
    if (typeof r == "function") {
      var i = r;
      r = function() {
        var p = Cl(s);
        i.call(p);
      };
    }
    var s = Eu(e, 0, !1, null, null, !1, !1, "", Ca);
    return e._reactRootContainer = s, e[gn] = s.current, bt(e.nodeType === 8 ? e.parentNode : e), tt(function() {
      _l(n, s, t, r);
    }), s;
  }
  function Nl(e, n, t, r, l) {
    var o = t._reactRootContainer;
    if (o) {
      var u = o;
      if (typeof l == "function") {
        var i = l;
        l = function() {
          var s = Cl(u);
          i.call(s);
        };
      }
      _l(n, u, e, l);
    } else
      u = Lf(t, n, e, l, r);
    return Cl(u);
  }
  ri = function(e) {
    switch (e.tag) {
      case 3:
        var n = e.stateNode;
        if (n.current.memoizedState.isDehydrated) {
          var t = Ut(n.pendingLanes);
          t !== 0 && (Xl(n, t | 1), De(n, te()), !(I & 6) && (Lt = te() + 500, In()));
        }
        break;
      case 13:
        tt(function() {
          var r = En(e, 1);
          if (r !== null) {
            var l = Pe();
            un(r, e, 1, l);
          }
        }), _u(e, 1);
    }
  }, Gl = function(e) {
    if (e.tag === 13) {
      var n = En(e, 134217728);
      if (n !== null) {
        var t = Pe();
        un(n, e, 134217728, t);
      }
      _u(e, 134217728);
    }
  }, li = function(e) {
    if (e.tag === 13) {
      var n = Hn(e), t = En(e, n);
      if (t !== null) {
        var r = Pe();
        un(t, e, n, r);
      }
      _u(e, n);
    }
  }, oi = function() {
    return V;
  }, ui = function(e, n) {
    var t = V;
    try {
      return V = e, n();
    } finally {
      V = t;
    }
  }, Bl = function(e, n, t) {
    switch (n) {
      case "input":
        if (Ol(e, t), n = t.name, t.type === "radio" && n != null) {
          for (t = e; t.parentNode; )
            t = t.parentNode;
          for (t = t.querySelectorAll("input[name=" + JSON.stringify("" + n) + '][type="radio"]'), n = 0; n < t.length; n++) {
            var r = t[n];
            if (r !== e && r.form === e.form) {
              var l = Wr(r);
              if (!l)
                throw Error(m(90));
              Tu(r), Ol(r, l);
            }
          }
        }
        break;
      case "textarea":
        Fu(e, t);
        break;
      case "select":
        n = t.value, n != null && ut(e, !!t.multiple, n, !1);
    }
  }, Wu = hu, Qu = tt;
  var Tf = { usingClientEntryPoint: !1, Events: [tr, ht, Wr, Hu, $u, hu] }, hr = { findFiberByHostInstance: Xn, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, Rf = { bundleType: hr.bundleType, version: hr.version, rendererPackageName: hr.rendererPackageName, rendererConfig: hr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: he.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = Gu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: hr.findFiberByHostInstance || zf, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var zl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!zl.isDisabled && zl.supportsFiber)
      try {
        xr = zl.inject(Rf), fn = zl;
      } catch {
      }
  }
  return Fe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Tf, Fe.createPortal = function(e, n) {
    var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!xu(n))
      throw Error(m(200));
    return Nf(e, n, null, t);
  }, Fe.createRoot = function(e, n) {
    if (!xu(e))
      throw Error(m(299));
    var t = !1, r = "", l = _a;
    return n != null && (n.unstable_strictMode === !0 && (t = !0), n.identifierPrefix !== void 0 && (r = n.identifierPrefix), n.onRecoverableError !== void 0 && (l = n.onRecoverableError)), n = Eu(e, 1, !1, null, null, t, !1, r, l), e[gn] = n.current, bt(e.nodeType === 8 ? e.parentNode : e), new Cu(n);
  }, Fe.findDOMNode = function(e) {
    if (e == null)
      return null;
    if (e.nodeType === 1)
      return e;
    var n = e._reactInternals;
    if (n === void 0)
      throw typeof e.render == "function" ? Error(m(188)) : (e = Object.keys(e).join(","), Error(m(268, e)));
    return e = Gu(n), e = e === null ? null : e.stateNode, e;
  }, Fe.flushSync = function(e) {
    return tt(e);
  }, Fe.hydrate = function(e, n, t) {
    if (!Pl(n))
      throw Error(m(200));
    return Nl(null, e, n, !0, t);
  }, Fe.hydrateRoot = function(e, n, t) {
    if (!xu(e))
      throw Error(m(405));
    var r = t != null && t.hydratedSources || null, l = !1, o = "", u = _a;
    if (t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (o = t.identifierPrefix), t.onRecoverableError !== void 0 && (u = t.onRecoverableError)), n = Sa(n, null, e, 1, t ?? null, l, !1, o, u), e[gn] = n.current, bt(e), r)
      for (e = 0; e < r.length; e++)
        t = r[e], l = t._getVersion, l = l(t._source), n.mutableSourceEagerHydrationData == null ? n.mutableSourceEagerHydrationData = [t, l] : n.mutableSourceEagerHydrationData.push(
          t,
          l
        );
    return new xl(n);
  }, Fe.render = function(e, n, t) {
    if (!Pl(n))
      throw Error(m(200));
    return Nl(null, e, n, !1, t);
  }, Fe.unmountComponentAtNode = function(e) {
    if (!Pl(e))
      throw Error(m(40));
    return e._reactRootContainer ? (tt(function() {
      Nl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[gn] = null;
      });
    }), !0) : !1;
  }, Fe.unstable_batchedUpdates = hu, Fe.unstable_renderSubtreeIntoContainer = function(e, n, t, r) {
    if (!Pl(t))
      throw Error(m(200));
    if (e == null || e._reactInternals === void 0)
      throw Error(m(38));
    return Nl(e, n, t, !1, r);
  }, Fe.version = "18.2.0-next-9e3b772b8-20220608", Fe;
}
(function(E) {
  function M() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(M);
      } catch (m) {
        console.error(m);
      }
  }
  M(), E.exports = $f();
})(Af);
var Ma = Lu;
zu.createRoot = Ma.createRoot, zu.hydrateRoot = Ma.hydrateRoot;
const Ll = ({
  primary: E = !1,
  size: M = "medium",
  backgroundColor: m,
  label: Se = "Button",
  className: ie,
  ...Ee
}) => {
  const me = E ? "storybook-button--primary" : "storybook-button--secondary";
  return /* @__PURE__ */ Ie(
    "button",
    {
      type: "button",
      className: [
        "storybook-button",
        `storybook-button--${M}`,
        me,
        ie ?? ""
      ].join(" "),
      style: { backgroundColor: m },
      ...Ee,
      children: Se
    }
  );
};
const Wf = ({
  user: E,
  onLogin: M,
  onLogout: m,
  onCreateAccount: Se,
  ...ie
}) => /* @__PURE__ */ Ie("header", { ...ie, children: /* @__PURE__ */ Rt("div", { className: "wrapper", children: [
  /* @__PURE__ */ Rt("div", { children: [
    /* @__PURE__ */ Ie(
      "svg",
      {
        width: "32",
        height: "32",
        viewBox: "0 0 32 32",
        xmlns: "http://www.w3.org/2000/svg",
        children: /* @__PURE__ */ Rt("g", { fill: "none", fillRule: "evenodd", children: [
          /* @__PURE__ */ Ie(
            "path",
            {
              d: "M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z",
              fill: "#FFF"
            }
          ),
          /* @__PURE__ */ Ie(
            "path",
            {
              d: "M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z",
              fill: "#555AB9"
            }
          ),
          /* @__PURE__ */ Ie(
            "path",
            {
              d: "M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z",
              fill: "#91BAF8"
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ Ie("h1", { children: "Acme" })
  ] }),
  /* @__PURE__ */ Ie("div", { children: E ? /* @__PURE__ */ Rt(za, { children: [
    /* @__PURE__ */ Rt("span", { className: "welcome", children: [
      "Welcome, ",
      /* @__PURE__ */ Ie("b", { children: E.name }),
      "!"
    ] }),
    /* @__PURE__ */ Ie(Ll, { size: "small", onClick: m, label: "Log out" })
  ] }) : /* @__PURE__ */ Rt(za, { children: [
    /* @__PURE__ */ Ie(Ll, { size: "small", onClick: M, label: "Log in" }),
    /* @__PURE__ */ Ie(
      Ll,
      {
        primary: !0,
        size: "small",
        onClick: Se,
        label: "Sign up"
      }
    )
  ] }) })
] }) });
class Oa {
  constructor(M, m) {
    Pu(this, "reactRoot");
    Pu(this, "component");
    this.reactRoot = zu.createRoot(M), this.component = m;
  }
  render(M) {
    return new Promise((m) => {
      this.reactRoot.render(
        /* @__PURE__ */ Ie("div", { style: { display: "contents" }, ref: () => m(), children: /* @__PURE__ */ Ie(this.component, { ...M }) })
      );
    });
  }
  dispose() {
    this.reactRoot.unmount();
  }
}
const Kf = [
  {
    framework: "react",
    // relative to the package root (closest package.json)
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
    createRenderer: (E) => new Oa(E, Ll)
  },
  {
    framework: "react",
    // relative to the package root (closest package.json)
    path: "src/stories/Header.tsx",
    name: "Header",
    props: [],
    createRenderer: (E) => new Oa(E, Wf)
  }
];
export {
  Kf as components
};
