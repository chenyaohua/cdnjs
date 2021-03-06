(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["Immutable"], factory);
	else if(typeof exports === 'object')
		exports["GyreJS"] = factory(require("Immutable"));
	else
		root["GyreJS"] = factory(root["Immutable"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _main = __webpack_require__(3);

	var _main2 = _interopRequireDefault(_main);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = _main2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * Action creator and dispatcher.
	 *
	 * @param {Object} store instance.
	 * @param {Object} options Options object.
	 * @returns {{addAction: Function, dispatch: Function}} API.
	 */
	var actionHandler = function actionHandler(store, options) {
	  // Private variables
	  var actionMap = new Map();
	  var middleWare = [];

	  // Private methods
	  /**
	   * Creates a higher order function to wrap the final action with any present middleware.
	   * Adds a custom method 'dispatch' to the middleWare array.
	   *
	   * @param {Function} dp Dispatch function.
	   * @returns {void}
	   */
	  var wrapDispatchMiddleware = function wrapDispatchMiddleware(dp) {
	    // Invoke all registered middleWare before running the final action.
	    // First call functions which have been added first.
	    middleWare.dispatch = function (id, args) {
	      return middleWare.reduce(function (nextToCall, firstToCall) {
	        return function () {
	          return firstToCall(options.NS, id, args, nextToCall, dp);
	        };
	      }, function () {
	        return actionMap.get(id)(args.push(dp) && args);
	      })();
	    };
	  };

	  // Public methods
	  /**
	   * Dispatch a registered action by ID.
	   * Uses a custom method 'dispatch' in the middleWare array created by parseMiddleware().
	   *
	   * @param {String|Object} action Id or FSA (Flux standard action). See: https://github.com/acdlite/flux-standard-action.
	   * @param {Array} [args] Function arguments.
	   * @returns {void}
	   */
	  var dispatch = function dispatch(action) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var payload = args;

	    // Support FSA type actions. Use basic ducktyping to detect if the
	    // provided action may be a FSA.
	    if ((typeof action === "undefined" ? "undefined" : _typeof(action)) === "object" && Object.prototype.hasOwnProperty.call(action, "type")) {
	      payload = [action.payload];
	      action = action.type;
	    }

	    // Dispatch action if the id is present in the action map.
	    if (actionMap.has(action)) {
	      middleWare.dispatch(action, payload);
	    } else {
	      console.warn(">> GyreJS-'" + options.NS + "'-gyre: Unregistered action dispatched: '" + action + "' with arguments:", payload, ". (This is a no-op)"); // eslint-disable-line no-console
	    }
	  };

	  /**
	   * Add a single action.
	   *
	   * @param {String} id Action ID.
	   * @param {Function} func Reducer function.
	   * the actions.
	   * @returns {void}
	   */
	  var addAction = function addAction(id, func) {
	    if (typeof id !== "string") {
	      throw new Error("GyreJS (addAction): first argument (id) should be a string.");
	    }
	    if (typeof func !== "function") {
	      throw new Error("GyreJS (addAction): second argument (reducer) should be a function.");
	    }

	    actionMap.set(id, function (args) {
	      return store.update(options.NS, func, args);
	    });
	  };

	  /**
	   * Add multiple actions.
	   *
	   * @param {Object} actions Key/func object of actions.
	   * the actions.
	   * @returns {void}
	   */
	  var addActions = function addActions(actions) {
	    if ((typeof actions === "undefined" ? "undefined" : _typeof(actions)) !== "object") {
	      throw new Error("GyreJS (addActions): first argument (actions object) should be an object.");
	    }

	    Object.keys(actions).forEach(function (action) {
	      addAction(action, actions[action]);
	    });
	  };

	  /**
	   * Apply middleware. Middleware is called in the order in which it's added.
	   *
	   * @param {Function} mware Middleware function.
	   * @returns {void}
	   */
	  var use = function use(mware) {
	    if (typeof mware !== "function") {
	      throw new Error("GyreJS (use): first argument should be a function.");
	    }

	    middleWare.unshift(mware);
	    wrapDispatchMiddleware(dispatch);
	  };

	  // Setup
	  wrapDispatchMiddleware(dispatch);

	  // API
	  return {
	    addAction: addAction,
	    addActions: addActions,
	    dispatch: dispatch,
	    use: use
	  };
	};

	exports.default = actionHandler;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _actionHandler = __webpack_require__(1);

	var _actionHandler2 = _interopRequireDefault(_actionHandler);

	var _selectorFactory = __webpack_require__(4);

	var _selectorFactory2 = _interopRequireDefault(_selectorFactory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var defaultActions = function defaultActions() {
	  return {};
	};
	var defaultTicker = function defaultTicker(cb) {
	  return cb();
	};

	/**
	 * Gyre Factory
	 *
	 * @param {Function} [actions] Default actions object.
	 * @param {Function} [selectors] Default selectors object.
	 * @param {Immutable.Map|Object} [state] Initial state object.
	 * @param {Function} [ticker] Store update tick function.
	 * @returns {Function} Gyre factory function.
	 */
	var gyreFactory = function gyreFactory() {
	  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var _ref$actions = _ref.actions;
	  var actions = _ref$actions === undefined ? defaultActions : _ref$actions;
	  var _ref$selectors = _ref.selectors;
	  var selectors = _ref$selectors === undefined ? {} : _ref$selectors;
	  var _ref$state = _ref.state;
	  var state = _ref$state === undefined ? {} : _ref$state;
	  var _ref$ticker = _ref.ticker;
	  var ticker = _ref$ticker === undefined ? defaultTicker : _ref$ticker;
	  return function (store, options) {
	    // Private variables
	    var API = {};
	    var AH = (0, _actionHandler2.default)(store, options);
	    var selectorFactory = (0, _selectorFactory2.default)(store, options, AH.dispatch);
	    var selObj = {};

	    // Public methods
	    /**
	     * Add a single action to gyre.
	     *
	     * @param {Array} args Arguments
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var addAction = function addAction() {
	      AH.addAction.apply(AH, arguments);
	      return API;
	    };

	    /**
	     * Add a multiple actions to gyre.
	     *
	     * @param {Array} args Arguments
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var addActions = function addActions() {
	      AH.addActions.apply(AH, arguments);
	      return API;
	    };

	    /**
	     * Add a selector factory function.
	     *
	     * @param {String} id Id
	     * @param {Function} selector Selector factory function.
	     * @param {boolean} [replace] Whether to overwrite any existing selector registered by the id.
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var addSelector = function addSelector(id, selector, replace) {
	      if (typeof id !== "string") {
	        throw new Error("GyreJS (addSelector): first argument (id) should be a string.");
	      }
	      if (typeof selector !== "function") {
	        throw new Error("GyreJS (addSelector): second argument (selector) should be a function.");
	      }
	      if (typeof replace !== "boolean" && typeof replace !== "undefined" && replace !== null) {
	        throw new Error("GyreJS (addSelector(s)): last argument (replace) should either be a boolean or undefined/null.");
	      }

	      if (!Object.prototype.hasOwnProperty.call(selObj, id) || replace) {
	        selObj[id] = selector;
	      } else {
	        console.warn(">> GyreJS-'" + options.NS + "'-gyre: AddFilter -> Selector with id: '" + id + "' already exists."); // eslint-disable-line no-console
	      }
	      return API;
	    };

	    /**
	     * Add multiple selectors.
	     *
	     * @param {Object} selectorsObj Key/func object of selector factory functions.
	     * @param {boolean|void|null} [replace] Whether to overwrite any existing selector registered by the id.
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var addSelectors = function addSelectors(selectorsObj, replace) {
	      if ((typeof selectorsObj === "undefined" ? "undefined" : _typeof(selectorsObj)) !== "object") {
	        throw new Error("GyreJS (addSelectors): first argument (selectors) should be an object.");
	      }

	      Object.keys(selectorsObj).forEach(function (selector) {
	        addSelector(selector, selectorsObj[selector], replace);
	      });
	      return API;
	    };

	    /**
	     * Selector factory.
	     *
	     * @param {Function|Object|String} sel Selector function, object or id.
	     * @param {Function} cb Callback to invoke after selector update.
	     * @param {Array} [args] Remaining arguments.
	     * @returns {Function|void} Selector Un-subscribe function.
	     */
	    var createSelector = function createSelector(sel, cb) {
	      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	        args[_key - 2] = arguments[_key];
	      }

	      if (typeof sel === "function" || (typeof sel === "undefined" ? "undefined" : _typeof(sel)) === "object") {
	        return selectorFactory(sel, cb);
	      }
	      if (Object.prototype.hasOwnProperty.call(selObj, sel)) {
	        return selectorFactory(selObj[sel].apply(selObj, args), cb);
	      }
	      console.warn(">> GyreJS-'" + options.NS + "'-gyre: Unregistered selector requested: '" + sel + "' with arguments:", args, "."); // eslint-disable-line no-console
	    };

	    /**
	     * Dispatch a registered action.
	     *
	     * @param {Array} args Arguments.
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var dispatch = function dispatch() {
	      AH.dispatch.apply(AH, arguments);
	      return API;
	    };

	    /**
	     * Get the current gyre state.
	     *
	     * @returns {Immutable.Map} Current gyre store state.
	     */
	    var getState = function getState() {
	      return store.getState(options.NS);
	    };

	    /**
	     * Set the gyre state. Overwrites the current state.
	     *
	     * @param {Array} args Arguments.
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var setState = function setState() {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      store.setState.apply(store, args.concat([options.NS]));
	      return API;
	    };

	    /**
	     * Set store tick function for this gyre.
	     *
	     * @param {Array} args Arguments.
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var setTicker = function setTicker() {
	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      store.setTicker.apply(store, [options.NS].concat(args));
	      return API;
	    };

	    /**
	     * Add middleware to dispatcher
	     *
	     * @param {Array} args Arguments.
	     * @returns {Object} API Chainable gyre instance.
	     */
	    var use = function use() {
	      AH.use.apply(AH, arguments);
	      return API;
	    };

	    // Setup
	    addActions(actions(options));
	    addSelectors(selectors);
	    setTicker(ticker);
	    setState(state);

	    // Gyre API
	    return Object.assign(API, {
	      addAction: addAction,
	      addActions: addActions,
	      addSelector: addSelector,
	      addSelectors: addSelectors,
	      createSelector: createSelector,
	      dispatch: dispatch,
	      getState: getState,
	      nameSpace: options.NS,
	      setState: setState,
	      setTicker: setTicker,
	      use: use
	    });
	  };
	};

	exports.default = gyreFactory;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _store = __webpack_require__(5);

	var _store2 = _interopRequireDefault(_store);

	var _gyreFactory = __webpack_require__(2);

	var _gyreFactory2 = _interopRequireDefault(_gyreFactory);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Private variables
	var API = {};

	// Private methods
	/**
	 * Get store singleton
	 *
	 * @returns {Store} Store singleton.
	 */
	var getStore = (function () {
	  var store = arguments.length <= 0 || arguments[0] === undefined ? (0, _store2.default)() : arguments[0];
	  return function () {
	    return store;
	  };
	})();

	/**
	 * Get gyre map singleton
	 *
	 * @returns {Object} Gyre map singleton.
	 */
	var getGyres = (function () {
	  var gyreMap = arguments.length <= 0 || arguments[0] === undefined ? { "empty": (0, _gyreFactory2.default)() } : arguments[0];
	  return function () {
	    return gyreMap;
	  };
	})();

	// Public functions
	/**
	 * Create a new gyre instance. Based on a factory function by id.
	 * If no id is provided, an empty gyre instance will be returned.
	 *
	 * @param {String} [id] Id of a registered gyre factory.
	 * @param {Object} [options] Options object for gyre.
	 * @returns {Object|void} Gyre instance.
	 */
	var createGyre = function createGyre() {
	  var id = arguments.length <= 0 || arguments[0] === undefined ? "empty" : arguments[0];
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  if (!getGyres.hasOwnProperty(id)) {
	    // Return gyre instance object with a unique namespace.
	    return getGyres()[id](getStore(), Object.assign({}, options, { NS: id + "-" + Date.now() }));
	  }
	  console.warn(">> GyreJS: Error on create - Gyre factory '" + id + "' not registered."); // eslint-disable-line no-console
	};

	/**
	 * Register a gyre factory function. Overides any gyre factory which is already present at that ID.
	 *
	 * @param {String} id Id of to register gyre.
	 * @param {Function} factory Gyre factory function.
	 * @returns {Object} API Chainable GyreJS object.
	 */
	var registerGyreFactory = function registerGyreFactory(id, factory) {
	  if (id === "empty") {
	    throw new Error("GyreJS (registerGyreFactory): cannot use 'empty, it is a reserved id.");
	  }

	  getGyres()[id] = factory;
	  return API;
	};

	/**
	 * Un-register a gyre factory function.
	 *
	 * @param {String} id Id of a registered gyre factory.
	 * @returns {boolean} Whether the factory has been un-registered.
	 */
	var unRegisterGyreFactory = function unRegisterGyreFactory(id) {
	  if (!getGyres.hasOwnProperty(id)) {
	    console.warn(">> GyreJS: (unRegisterGyreFactory) Cannot un-register - Gyre factory '" + id + "' not registered."); // eslint-disable-line no-console
	    return false;
	  }
	  return delete getGyres()[id] && true;
	};

	// GyreJS API
	exports.default = Object.assign(API, {
	  createGyre: createGyre,
	  registerGyreFactory: registerGyreFactory,
	  unRegisterGyreFactory: unRegisterGyreFactory,
	  createGyreFactory: _gyreFactory2.default
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * Selector factory function
	 *
	 * @param {Object} store Store instance.
	 * @param {String} NS Gyre namespace.
	 * @param {Function} dispatch Gyre action dispatch function.
	 * @returns {Function} Selector un-register function.
	 */
	var selectorFactory = function selectorFactory(store, _ref, dispatch) {
	  var NS = _ref.NS;
	  return function (selector, cb) {
	    // Check if the provided selector is either an object with the required api
	    // or a function.
	    if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) === "object" && typeof selector.onUpdate !== "function") {
	      throw new Error("GyreJS: Selector object should expose an 'onUpdate' method.");
	    }
	    if ((typeof selector === "undefined" ? "undefined" : _typeof(selector)) !== "object" && typeof selector !== "function") {
	      throw new Error("GyreJS: Selector should either be a function or an object with an 'onUpdate' method.");
	    }

	    // Invoke subscribe method if present.
	    if (typeof selector.onSubscribe === "function") {
	      selector.onSubscribe(dispatch);
	    }

	    // Register callback (update) function with the store.
	    var update = (typeof selector === "undefined" ? "undefined" : _typeof(selector)) === "object" ? selector.onUpdate : selector;
	    var unRegister = store.addSelector(NS, function (state) {
	      return update(state, cb);
	    });

	    // Return selector un-register function.
	    // Invoke onUnsubscribe method if present.
	    return function () {
	      unRegister();
	      if (typeof selector.onUnsubscribe === "function") {
	        selector.onUnsubscribe(dispatch);
	      }
	    };
	  };
	};

	exports.default = selectorFactory;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _immutable = __webpack_require__(6);

	var _immutable2 = _interopRequireDefault(_immutable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 * Store factory function
	 *
	 * @returns {{addSelector: Function, getState: Function, setState: Function, updateState: Function}} Store API
	 */
	var store = function store() {
	  // Private variables
	  var state = _immutable2.default.Map({});
	  var selectorList = {};

	  // Private methods
	  var getSelectorList = function getSelectorList(ns) {
	    return selectorList[ns] || (selectorList[ns] = []);
	  };

	  /**
	   * Send update to all registered selectors.
	   *
	   * @param {String} ns Namespace.
	   * @param {Function} [scb] Specific callback to solely invoke.
	   * @returns {Function} sendUpdate function for a namespace.
	   */
	  var sendUpdate = function sendUpdate(ns, scb) {
	    return function () {
	      var list = getSelectorList(ns);
	      list.updateRequested = false;
	      return scb ? scb(state.get(ns)) : list.forEach(function (selector) {
	        return selector(state.get(ns));
	      });
	    };
	  };

	  /**
	   * Request to issue update to filters of a given namespace.
	   *
	   * @param {String} ns Namespace.
	   * @param {Function} [scb] Specific callback to solely invoke.
	   * @returns {void}
	   */
	  var requestUpdate = function requestUpdate(ns, scb) {
	    var nsList = getSelectorList(ns);
	    if (!nsList.updateRequested) {
	      nsList.updateRequested = true;
	      nsList.ticker(sendUpdate(ns, scb));
	    }
	  };

	  /**
	   * Remove selector from the store
	   *
	   * @param {String} ns Namespace.
	   * @param {Function} cb Selector callback.
	   * @returns {Function} removal function.
	   */
	  var removeSelector = function removeSelector(ns, cb) {
	    return function () {
	      return selectorList[ns].splice(selectorList[ns].indexOf(cb), 1);
	    };
	  };

	  /**
	   * Overwrite the current state in the store.
	   * Use for setting an initial state or debugging.
	   *
	   * @param {Immutable.Map} newState New state.
	   * @param {String} ns Namespace.
	   * @returns {Immutable.Map} state Current state
	   */
	  var setNewState = function setNewState(newState, ns) {
	    if (state.get(ns) !== newState) {
	      state = state.set(ns, newState);
	      requestUpdate(ns);
	    }
	    return state;
	  };

	  // Public methods
	  /**
	   * addSelector() Register a selector with the store and send initial data.
	   *
	   * @param {String} ns Namespace.
	   * @param {Function} cb callback.
	   * @returns {Function} un-register function.
	   */
	  var addSelector = function addSelector(ns, cb) {
	    // Save to local register
	    getSelectorList(ns).push(cb);

	    // Request update to make sure the new filter gets data asap.
	    requestUpdate(ns, cb);

	    // Return function to remove selector from store.
	    return removeSelector(ns, cb);
	  };

	  /**
	   * getState() returns the current state.
	   *
	   * @param {String} ns Namespace.
	   * @returns {Immutable.Map} Current state
	   */
	  var getState = function getState(ns) {
	    return state.has(ns) ? state.get(ns) : state;
	  };

	  /**
	   * setState()
	   *
	   * @param {Immutable.Map|Object} newState State.
	   * @param {String} ns Namespace.
	   * @returns {Immutable.Map} New state.
	   */
	  var setState = function setState(newState, ns) {
	    if ((typeof newState === "undefined" ? "undefined" : _typeof(newState)) !== "object") {
	      throw new Error("GyreJS (setState): New state should either be an object or an instance of Immutable.Map.");
	    }

	    return setNewState(_immutable2.default.Map.isMap(newState) ? newState : _immutable2.default.Map(newState), ns);
	  };

	  /**
	   * Set tick function for a given namespace.
	   *
	   * The tick function is added as a property to the selector array for given namespace.
	   *
	   * @param {String} ns Namespace.
	   * @param {Function} ticker Store update tick function for given namespace.
	   * @returns {void}
	   */
	  var setTicker = function setTicker(ns, ticker) {
	    if (typeof ticker !== "function") {
	      throw new Error("GyreJS (setTicker): Ticker should be a function.");
	    }

	    getSelectorList(ns).ticker = ticker;
	  };

	  /**
	   * Applies a given reducer function to the state, which
	   * is supposed to return a new Immutable state.
	   * If nothing is returned, the original state is kept.
	   *
	   * @param {String} ns Namespace.
	   * @param {Function} func Reducer function.
	   * @param {Array} args Reducer function arguments.
	   * @returns {Immutable.Map} state New state.
	   */
	  var update = function update(ns, func, args) {
	    return setNewState(func.apply(undefined, _toConsumableArray([state.get(ns)].concat(args))) || state.get(ns), ns);
	  };

	  // API
	  return {
	    addSelector: addSelector,
	    getState: getState,
	    setState: setState,
	    setTicker: setTicker,
	    update: update
	  };
	};

	exports.default = store;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }
/******/ ])
});
;