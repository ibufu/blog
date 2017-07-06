---
title: Redux, Redux-thunk 和 React-Redux 源码阅读
date: 2017-07-04 18:53:53
tags: 
 - React
 - Redux
category: 知识碎片
---
一年前看过一遍，看完后感觉良好，但是过了一段时间一些细节记不清了，Orz。今年再看一遍，顺便记录下来。
Redux 这方面必须整得明明白白 :D
<!--more-->
## Redux
![Redux](https://ooo.0o0.ooo/2017/07/05/595c8e1b90d80.png)

### 目录结构
```
├── utils/
│     ├── warning.js 
├── applyMiddleware.js
├── bindActionCreators.js
├── combineReducers.js
├── compose.js
├── createStore.js
├── index.js # 入口文件
```

### compose(...funcs)

工具方法，在`applyMiddleware`中使用。

```js
/**
 * 将多个函数合并成一个函数，嵌套执行
 * compose(f, g, h): f(g(h())) 函数的执行顺序从右到左，h() g() f()，
 * 上一个函数的返回值作为下个函数的参数。
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  /**
   * 核心语句就是这一句reduce，队列中的下一个函数b，已组合的函数a，把b作为参数扔给a，
   * 如此反复直至循环完毕。
   */
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

```

### bindActionCreators(actionCreators, dispatch)

用 `dispatch` 封装 `actionCreator`，可以让 Redux 相对组件**透明**，降低耦合度。

```js
/**
 * 用 dispatch 封装 actionCreators。
 * 封装好可以直接调用 boundActionCreator()，无需 dispatch。
 * dispatch(actionCreator()) -> boundActionCreator()
 *
 * @param {Function|Object} 
 *
 * @param {Function}
 *
 * @returns {Function|Object} 
 */
export default function bindActionCreators(actionCreators, dispatch) {
  // 略去参数检验

  const keys = Object.keys(actionCreators)
  const boundActionCreators = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}

function bindActionCreator(actionCreator, dispatch) {
  // 很简单，就是套一下
  return (...args) => dispatch(actionCreator(...args))
}
```

### combineReducers(reducers)

合并 reducers，大项目一定会用到的 api，拆分逻辑，模块化 reducer。

```js
// 省去许多检验函数
/**
 * 将许多 reducers 合并成一个 Function，
 * 循环所有 reducers，每个 state 就像坐滑梯一样从对应的 reducer 里过一遍
 *
 * @param {Object}
 *
 * @returns {Function}
 */
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }

  const finalReducerKeys = Object.keys(finalReducers)

  // 返回 combination 方法，具名方法
  return function combination(state = {}, action) {

    let hasChanged = false
    const nextState = {}
    // 开始循环各个 reducer
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    return hasChanged ? nextState : state
  }
}
```

### createStore(reducer, preloadedState, enhancer)

终极核心 api，Redux 中的一切都是围绕着 `store(state)` 来运转的。

`createStore()` 可以算 `store` 的构造函数了，`store`的所有方法都是在这里定义的。

`state` 存放在 `createStore()` 这个闭包里，所以只能用 `getState` 来获取。

`dispatch`, `subscribe`, `getState`, `replaceReducer`, 四个核心 api，代码都相当简单。

以下代码删去了一些校验代码，只保留核心代码。

```js
/**
 * 创建一个 store，持有整个 state tree。
 * 唯一改变 state 的方法就是 dispatch(action)。
 *
 * @param {Function} reducer
 *
 * @param {any} [preloadedState] 初始 state
 *
 * @param {Function} [enhancer] applyMiddleware() 返回的函数，
 * 重载 store 的 dispatch() 方法。
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */
export default function createStore(reducer, preloadedState, enhancer) {
  // 多态
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {

    return enhancer(createStore)(reducer, preloadedState)
  }


  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false

  /**
   * 返回当前的 state
   *
   * @returns {any}
   */
  function getState() {
    return currentState
  }

  /**
   * 将一个回调放到 listeners 队列里，当 dispatch 的时候，逐一调用 listeners 中的回调方法。 
   *
   * @param {Function} 回调函数
   * @returns {Function} 解除绑定的方法
   */
  function subscribe(listener) {
    let isSubscribed = true

    // 放进去，嘿嘿
    nextListeners.push(listener)

    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  /**
   * 大名鼎鼎的 dispatch() 方法。调用reducer(state, action)。
   * 更新后调用 listeners。
   *
   * @param {Object} action
   *
   * @returns {Object} 返回 action， 但是如果用了中间件的话，中间件可能会返回其他东西
   */
  function dispatch(action) {
    // dispatch 是同步滴
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    // 关键流程
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }

    // 挨个调用跟班
    const listeners = currentListeners = nextListeners
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

  /**
   * 动态替换 reducer
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    dispatch({ type: ActionTypes.INIT })
  }

  /**
   * 留给 observable 的接口， rx 相关
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    // 略了
  }

  // 暴露 api，大闭包，哈哈
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
```

### applyMiddleware(...middlewares)

终于到最后一个api了，嘎嘎。

同样是非常简短的源码，但是却最值得细读回味。

```js
/**
 * 
 *
 * @param {...Function} middlewares
 * @returns {Function} store 增强器
 */
export default function applyMiddleware(...middlewares) {
  // 增强器，创建一个重载了 dispatch() 的 store
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer)
    // 就是这里
    let dispatch = store.dispatch
    // 中间件链
    let chain = []

    // 把 getState 和 dispatch 包在外面， 
    // 注意这个 dispatch 将会变成组合后的 
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    
    /**
     * 用了 middleware 后 dispatch() 的真实样貌：
     * 经过 compose() 组合的中间件合体函数
     * 调用的时候真实的流程：
     * M1(M2(M3(dispatch)))(action)
     * M3 的参数是原生的 dispatch
     * M2 的参数是包含 M3 逻辑 + 原生 dispatch 的函数
     * M1 的参数是包含 M2逻辑 + M3 逻辑 + 原生 dispatch 的函数
     */ 
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

一个中间件一般是长这样的 
```js
function middleware(store) {
  return function(next) {
    return function(action) {
      console.log('middleware 开始')
      next(action)
      console.log('middleware 结束')
    }
  }
}
```
然后经过
```js
chain = middlewares.map(middleware => middleware(middlewareAPI))
```
`chain` 里每个元素就变成了这个样子：
```js
function middlewareWrapped(next) {
  return function(action) {
    console.log('middleware 开始')
    next(action)
    console.log('middleware 结束')
  }
}
```

那么现在有三个中间件：

```js
function middleware1(store) {
  return function(next) {
    return function(action) {
      console.log('middleware1 开始')
      next(action)
      console.log('middleware1 结束')
    }
  }
}

function middleware2(store) {
  return function(next) {
    return function(action) {
      console.log('middleware2 开始')
      next(action)
      console.log('middleware2 结束')
    }
  }
}

function middleware3(store) {
  return function(next) {
    return function(action) {
      console.log('middleware3 开始')
      next(action)
      console.log('middleware3 结束')
    }
  }
}
```

类似的 `chain` 里面也有三个被扔进了 `store` 的函数。
每个函数里的 `next` 都是之后中间件逻辑的组合。

这里有个点：
`M1(M2(M3(dispatch)))`
粗粗一看，一定是以为M3会先执行。

这样顺序不就不对了吗？其实，确实是 M3 先执行，但是 M3 只是 return 了一个 **function** ，并**没有执行**里面的逻辑。

所以最终是 M1 得到了 M2 , M3 和 dispatch 的逻辑封装，先执行 M1 的逻辑，打印。
执行到中间，碰到了 next，这个 next 就是我上面说的那一大串逻辑封装函数。
以此类推，M2 和 M3 在 next 之前的代码都会依次执行。
M3 的 next 是真正的 dispatch 了，没有其它中间件。
于是，接着会依次执行 M3 余下的逻辑， M2 余下的逻辑， M1余下的逻辑，直至跳出整个函数。

这就是**洋葱模型**，几个同心圆代表各个中间件，一条直线从圆心穿过，有始有终，放得初心。

一个简化的洋葱模型，只要搞懂了这个，Redux 的中间件的基本原理就算整明白了，嘿嘿。
```js
function f1(next) {
  return function() {
    console.log('f1 start')
    next()
    console.log('f1 end')
  }
}
function f2(next) {
  return function() {
    console.log('f2 start')
    next()
    console.log('f2 end')
  }
}
function f3(next) {
  return function() {
    console.log('f3 start')
    next()
    console.log('f3 end')
  }
}
function f() {
  console.log('heart')
}
f1(f2(f3(f)))()

/**
 * 输出：
 * f1 start
 * f2 start
 * f3 start
 * heart
 * f3 end
 * f2 end
 * f1 end
 */
```

[在线例子](https://jsfiddle.net/7rsbvsmr/)

## Redux Thunk

### 简介

首先港一下，Redux 里面是可以**异步**调用 `dispatch()` 的，比如：

```js
setTimeout(function() {
  dispatch({ type: 'MIDDLEWARE_TEST' })
}, 500)
```

恩，没毛病。但是这样有许多不便之处，可以看看这个[回答](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559)，了解有什么不便之处，主要是手动传递 `dispatch` 和难以分辨普通的 `actionCreator`。

> This was the motivation for finding a way to “legitimize” this pattern of providing dispatch to a helper function, and help Redux “see” such asynchronous action creators as a special case of normal action creators rather than totally different functions.

所以就诞生了 Redux Thunk。

Redux Thunk 可以让 action 作为一个**函数**，并传递`dispatch`和`getState`作为参数。

### 源码
```js
/**
* 吐槽一下 redux 和 redux-thunk都出自 Dan Abramov 之手，
* 但是一个句尾分号一个没有，真是奇怪。
* 
* 源码非常的精短，一眼就能看出来是干嘛的。
* 如果 action 是一个函数，就执行该 action，
* 并将 dispatch， getState作为参数传入。
* 且将不会执行 next()。
* 若是普通的 action，则啥也不干，直接 next()。
*/
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      // 这里的 dispatch 是组合后的，可以看上文 applyMiddleware() 的代码，
      // 所以在此处调用也会进入中间件链
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
```
### 啥是 thunk

作者是这样描述的：

> A thunk is a function that wraps an expression to delay its evaluation.

thunk 首先它是一个**函数**，然后这个函数里面封装了一个要**延迟执行**的表达式。

[拓展阅读](/2016/11/29/thunk函数/)

## React Redux

看的我头好晕啊。+_+ 没想到小小的 React Redux 里面这么绕。

简单的港港吧，具体细节以后再补齐。

### Provider

```js
// 略去部分代码
export function createProvider(storeKey = 'store', subKey) {
    const subscriptionKey = subKey || `${storeKey}Subscription`

    class Provider extends Component {
        getChildContext() {
          return { [storeKey]: this[storeKey], [subscriptionKey]: null }
        }

        constructor(props, context) {
          super(props, context)
          this[storeKey] = props.store;
        }

        render() {
          return Children.only(this.props.children)
        }
    }

    return Provider
}
```
Provider 这个组件的功能比较简单，将 store 挂在 context 上。
利用 React [context](https://facebook.github.io/react/docs/context.html) 的特性，使所有 Provider 的子组件都可以访问到 store。
因此，connect 高阶组件可以轻松地获取 store。

### Connect

```js
class Connect extends Component {
  constructor(props, context) {
    super(props, context)

    this.version = version
    this.state = {}
    this.renderCount = 0
    this.store = props[storeKey] || context[storeKey]
    this.propsMode = Boolean(props[storeKey])
    this.setWrappedInstance = this.setWrappedInstance.bind(this)

    this.initSelector()
    this.initSubscription()
  }

  getChildContext() {
    const subscription = this.propsMode ? null : this.subscription
    return { [subscriptionKey]: subscription || this.context[subscriptionKey] }
  }

  componentDidMount() {
    if (!shouldHandleStateChanges) return

    this.subscription.trySubscribe()
    this.selector.run(this.props)
    if (this.selector.shouldComponentUpdate) this.forceUpdate()
  }

  componentWillReceiveProps(nextProps) {
    this.selector.run(nextProps)
  }

  shouldComponentUpdate() {
    return this.selector.shouldComponentUpdate
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.tryUnsubscribe()
    this.subscription = null
    this.notifyNestedSubs = noop
    this.store = null
    this.selector.run = noop
    this.selector.shouldComponentUpdate = false
  }

  getWrappedInstance() {
    return this.wrappedInstance
  }

  setWrappedInstance(ref) {
    this.wrappedInstance = ref
  }

  initSelector() {
    const sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions)
    this.selector = makeSelectorStateful(sourceSelector, this.store)
    this.selector.run(this.props)
  }

  initSubscription() {
    if (!shouldHandleStateChanges) return

    const parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey]
    this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this))

    this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription)
  }

  onStateChange() {
    this.selector.run(this.props)

    if (!this.selector.shouldComponentUpdate) {
      this.notifyNestedSubs()
    } else {
      this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate
      this.setState(dummyState)
    }
  }

  notifyNestedSubsOnComponentDidUpdate() {
    this.componentDidUpdate = undefined
    this.notifyNestedSubs()
  }

  isSubscribed() {
    return Boolean(this.subscription) && this.subscription.isSubscribed()
  }

  addExtraProps(props) {
    if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props
    const withExtras = { ...props }
    if (withRef) withExtras.ref = this.setWrappedInstance
    if (renderCountProp) withExtras[renderCountProp] = this.renderCount++
    if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription
    return withExtras
  }

  render() {
    const selector = this.selector
    selector.shouldComponentUpdate = false

    if (selector.error) {
      throw selector.error
    } else {
      return createElement(WrappedComponent, this.addExtraProps(selector.props))
    }
  }
}
```

在构造函数中，从 context 中获得 store，并初始化 selector （一个对象，作用是在初始化和 update 的时候 mapStateToProps）。

在 `componentDidMount()` 中，调用 store 的 `subscribe()`，将`onStateChange()`作为回调传入。

在 state 更新时，触发`onStateChange()`，组件 `setState(dummyState)`。（dummyState是一个空对象，但以前的版本当中，是整个 store 的 state）

组件更新，selector `getState()` 并重新map数据，更新props，子组件因此更新。
