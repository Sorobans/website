name: astro-react-zustand
description: Build and hydrate React 19 islands inside Astro using @astrojs/react, with Zustand stores for shared state. Use when creating/updating React components with client directives, wiring Zustand stores, or debugging SSR/CSR hydration.
---

# Astro React Zustand

## Overview

Embed React islands in Astro, manage shared state with Zustand, and avoid hydration pitfalls.

## Quick Start

- Integration: keep `@astrojs/react` in `astro.config.mjs` integrations. Use client directives (`client:load|visible|idle|only="react"`) when placing React components in `.astro`.
- Entry point example:
```astro
---
import Counter from '../components/Counter';
---
<Counter client:load />
```

## Zustand Store Pattern

Create stores once per module to avoid multi-instance bugs during SSR.

```ts
// src/stores/useCounter.ts
import { create } from 'zustand';

type CounterState = { count: number; inc: () => void; reset: () => void };

export const useCounter = create<CounterState>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

Use selectors to limit re-renders:
```ts
const count = useCounter((s) => s.count);
const inc = useCounter((s) => s.inc);
```

## Hydration & SSR Notes

- Keep store modules free of browser-only APIs; guard with `typeof window !== 'undefined'` inside actions if needed.
- For initial server data, pass props into islands and hydrate store inside `useEffect` to avoid mismatches:
```tsx
useEffect(() => useCounter.setState({ count: initialCount }), [initialCount]);
```
- Prefer `client:visible`/`client:idle` for non-critical UI to reduce bundle cost; use `client:only="react"` for pure React pages.

## Component Template

```tsx
// src/components/Counter.tsx
import { useEffect } from 'react';
import { useCounter } from '../stores/useCounter';

export default function Counter({ initialCount = 0 }) {
  const count = useCounter((s) => s.count);
  const inc = useCounter((s) => s.inc);
  useEffect(() => useCounter.setState({ count: initialCount }), [initialCount]);
  return (
    <div>
      <p>{count}</p>
      <button onClick={inc}>+</button>
    </div>
  );
}
```

## Debugging Checklist

- Hydration warnings: align server/client markup; avoid random values during render (move to `useEffect`).
- Multiple store instances: confirm `create()` is not inside a component.
- TypeScript: export types for store shape; prefer `satisfies` to ensure literal inference for actions/state.
