---
title: React Effect 依赖优化最佳实践
date: 2025-10-21 21:00:34
tags:
  - React
  - Hooks
  - 性能优化
  - 源码解析
categories: 技术教程
---

## 前言

在使用 React Hooks 开发时，`useEffect` 的依赖数组管理是一个常见的痛点。很多开发者遇到过这样的困扰：依赖项过多导致 Effect 频繁执行，或者为了图方便直接禁用 ESLint 规则，最终引发难以调试的 bug。

本文将从 React 官方文档和源码层面深入探讨如何正确管理 Effect 依赖，帮助你写出更高效、更可维护的 React 代码。

## 核心原则：依赖必须与代码匹配

React 官方文档明确指出：**依赖应该与代码匹配**。这意味着 Effect 中使用的每一个响应式值（props、state）都必须出现在依赖数组中。

React 的 ESLint 插件 `eslint-plugin-react-hooks` 会自动检查这一规则，确保你的依赖声明是完整的。

### ⚠️ 关键警告

**永远不要用注释禁用依赖检查：**

```javascript
// ❌ 危险做法
useEffect(() => {
  // ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

React 文档强调：**应该把依赖检查错误当作编译错误来对待**。忽略它会导致微妙且难以诊断的 bug。

## 六大策略移除不必要的依赖

### 1. 将逻辑移至事件处理器

如果某段代码应该响应特定的用户交互而非响应式变化，应该放在事件处理器中：

```javascript
// ❌ 不好的做法
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (message) {
      logVisit(roomId, message);
    }
  }, [roomId, message]); // message 变化会重复记录

  return <input value={message} onChange={e => setMessage(e.target.value)} />;
}

// ✅ 好的做法
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    logVisit(roomId, message); // 只在发送时记录
  };

  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSend}>发送</button>
    </>
  );
}
```

### 2. 拆分多目的 Effect

当一个 Effect 同步多个不相关的过程时,应该拆分成多个 Effect：

```javascript
// ❌ 不好的做法
useEffect(() => {
  connectToChat(roomId);
  trackPageView(page);
}, [roomId, page]); // roomId 变化会触发不必要的页面追踪

// ✅ 好的做法
useEffect(() => {
  connectToChat(roomId);
}, [roomId]);

useEffect(() => {
  trackPageView(page);
}, [page]);
```

### 3. 使用状态更新函数

通过传递更新函数而非直接读取 state，可以移除状态依赖：

```javascript
// ❌ 不好的做法
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // 依赖 count
    }, 1000);
    return () => clearInterval(timer);
  }, [count]); // 每次 count 变化都会重置定时器

  return <div>{count}</div>;
}

// ✅ 好的做法
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1); // 使用更新函数,不依赖 count
    }, 1000);
    return () => clearInterval(timer);
  }, []); // 空依赖数组,定时器不会重置

  return <div>{count}</div>;
}
```

### 4. 使用 Effect Event（实验性）

`useEffectEvent` 允许你提取非响应式逻辑，读取最新值而不触发重新同步：

```javascript
// ✅ 使用 Effect Event
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('已连接', theme); // 读取最新的 theme
  });

  useEffect(() => {
    const connection = connectToChat(roomId);
    connection.on('connected', onConnected);
    return () => connection.disconnect();
  }, [roomId]); // theme 变化不会重新连接
}
```

**注意：** `useEffectEvent` 目前仍是实验性 API，尚未包含在稳定版 React 中。

### 5. 避免对象和函数依赖

对象和函数在每次渲染时都是新的引用，会导致不必要的重新执行：

```javascript
// ❌ 不好的做法
function SearchResults({ query }) {
  const options = { // 每次渲染都是新对象
    includeArchived: true
  };

  useEffect(() => {
    fetchResults(query, options);
  }, [query, options]); // options 每次都会触发
}

// ✅ 解决方案 1: 移到 Effect 内部
function SearchResults({ query }) {
  useEffect(() => {
    const options = { includeArchived: true };
    fetchResults(query, options);
  }, [query]);
}

// ✅ 解决方案 2: 移到组件外部
const OPTIONS = { includeArchived: true };

function SearchResults({ query }) {
  useEffect(() => {
    fetchResults(query, OPTIONS);
  }, [query]);
}

// ✅ 解决方案 3: 使用 useMemo
function SearchResults({ query, includeArchived }) {
  const options = useMemo(() => ({
    includeArchived
  }), [includeArchived]);

  useEffect(() => {
    fetchResults(query, options);
  }, [query, options]);
}
```

### 6. 提取原始值

当接收对象 props 时，解构出原始值作为依赖：

```javascript
// ❌ 不好的做法
function ChatRoom({ options }) {
  useEffect(() => {
    connectToChat(options.roomId);
  }, [options]); // options 对象每次渲染都是新的
}

// ✅ 好的做法
function ChatRoom({ options }) {
  const { roomId } = options;

  useEffect(() => {
    connectToChat(roomId);
  }, [roomId]); // 只依赖原始值
}
```

## 源码解析：React 如何初始化 State

让我们深入 React 源码，看看 `useState` 背后的实现机制。以下代码来自 React v19.1.1 的 `ReactFiberHooks.js`：

```javascript
function mountStateImpl<S>(initialState: (() => S) | S): Hook {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    const initialStateInitializer = initialState;
    // 执行初始化函数获取初始值
    initialState = initialStateInitializer();
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      try {
        // 严格模式下会执行两次,检测副作用
        initialStateInitializer();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
  }
  hook.memoizedState = hook.baseState = initialState;
  // ...
}
```

### 源码要点解读

1. **惰性初始化支持**：当 `initialState` 是函数时，React 会执行它来获取初始值。这就是为什么我们可以写 `useState(() => expensiveComputation())`。

2. **严格模式双重调用**：在开发模式的严格模式下，初始化函数会被调用两次。这是 React 的一个特性，用于帮助检测不纯的初始化函数中的副作用。

3. **状态存储**：初始值会同时存储在 `memoizedState`（当前状态）和 `baseState`（基础状态）中。这是 React 实现状态更新和并发渲染的基础。

### 与 Effect 依赖的关联

理解 `useState` 的实现有助于我们更好地管理 Effect 依赖：

```javascript
// 为什么惰性初始化不需要依赖
function Component() {
  // ✅ 初始化函数只在首次渲染时执行一次
  const [data] = useState(() => {
    return expensiveComputation(); // 不会重复执行
  });

  useEffect(() => {
    // data 来自 state,是响应式的,需要作为依赖
    processData(data);
  }, [data]);
}
```

## 实战案例：聊天室连接管理

让我们通过一个完整的例子整合这些最佳实践：

```javascript
function ChatRoom({ roomId, theme, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ 使用 Effect Event 处理非响应式逻辑
  const onMessage = useEffectEvent((message) => {
    setMessages(msgs => [...msgs, message]); // 使用更新函数
    showNotification(message, theme); // 读取最新 theme,但不触发重连
  });

  const onConnectionChange = useEffectEvent((connected) => {
    setIsConnected(connected);
    if (connected) {
      logUserActivity(currentUser.id); // 读取最新 user,但不触发重连
    }
  });

  // ✅ 只在 roomId 变化时重新连接
  useEffect(() => {
    const connection = createConnection(roomId);

    connection.on('message', onMessage);
    connection.on('connection', onConnectionChange);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]); // 只依赖 roomId

  return (
    <div className={theme}>
      <ConnectionStatus isConnected={isConnected} />
      <MessageList messages={messages} />
    </div>
  );
}
```

### 这个例子的优点

1. **最小化依赖**：Effect 只依赖 `roomId`，只在切换房间时重新连接
2. **避免不必要的重连**：`theme` 和 `currentUser` 变化不会导致重新连接
3. **使用更新函数**：`setMessages(msgs => [...msgs, message])` 避免依赖 `messages`
4. **清晰的职责分离**：连接逻辑、消息处理、通知展示各司其职

## 调试技巧

### 1. 使用 React DevTools

React DevTools 的 Profiler 可以帮你识别哪些组件因为 Effect 重新渲染：

- 记录渲染原因
- 查看 Hook 的依赖变化
- 识别性能瓶颈

### 2. 添加日志

在开发环境添加日志帮助理解 Effect 执行时机：

```javascript
useEffect(() => {
  console.log('Effect 执行:', { roomId, theme });
  // ...
  return () => {
    console.log('Effect 清理:', { roomId, theme });
  };
}, [roomId, theme]);
```

### 3. 使用 eslint-plugin-react-hooks

确保在项目中启用并配置该插件：

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 常见误区

### 误区 1：空依赖数组万能

```javascript
// ❌ 错误理解
useEffect(() => {
  setCount(count + 1); // count 永远是初始值
}, []); // 缺少 count 依赖
```

### 误区 2：依赖越少越好

依赖少不是目标，**准确的依赖**才是目标。不要为了减少依赖而牺牲正确性。

### 误区 3：随意禁用 ESLint 规则

```javascript
// ❌ 这是技术债务
useEffect(() => {
  // ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

这会在未来引发难以追踪的 bug，绝对不要这样做。

## 性能优化建议

1. **优先使用事件处理器**：能用事件处理器就不用 Effect
2. **拆分细粒度 Effect**：每个 Effect 只负责一件事
3. **合理使用 useMemo/useCallback**：对复杂对象和函数进行缓存
4. **避免过度优化**：先保证正确性，再优化性能

## 总结

Effect 依赖管理是 React Hooks 开发中的重要技能。关键要点：

1. **依赖必须与代码匹配** - 这是不可妥协的原则
2. **永远不要禁用 ESLint 规则** - 把依赖警告当作编译错误对待
3. **优先使用事件处理器** - 不是所有逻辑都需要 Effect
4. **使用更新函数** - 减少对 state 的依赖
5. **避免对象和函数依赖** - 它们每次渲染都是新的
6. **理解源码实现** - 帮助我们更好地使用 API

通过遵循这些最佳实践，你可以写出更高效、更易维护的 React 代码，避免常见的 Effect 依赖陷阱。

## 参考资料

- [React 官方文档 - Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies#removing-unnecessary-dependencies)
- [React 源码 - ReactFiberHooks.js](https://github.com/facebook/react/blob/v19.1.1/packages/react-reconciler/src/ReactFiberHooks.js#L2927-L2942)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
