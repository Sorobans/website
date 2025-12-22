---
title: Rust 树结构中 Rc 与 Weak 的配合使用
date: 2025-12-06
tags:
  - Rust
  - Rc
  - Weak
  - Smart Pointers
  - Data Structures
description: 深入探讨在 Rust 中构建树结构时，如何通过 Rc 和 Weak 智能指针的配合使用来避免循环引用导致的内存泄漏。本文详细讲解父子节点之间的引用关系设计原则，以及为什么父节点用 Rc 指向子节点，而子节点用 Weak 指向父节点。
---

在 Rust 中构建树形数据结构时，我们经常需要处理父子节点之间的双向引用关系。如果处理不当，会导致循环引用（circular reference）和内存泄漏。本文将详细介绍如何通过 `Rc` 和 `Weak` 智能指针的配合使用来优雅地解决这个问题。

## 核心原则

在树结构中，节点之间的引用遵循以下原则：

**父节点指向子节点：使用 `Rc<T>`**
**子节点指向父节点：使用 `Weak<T>`**

这个设计模式是避免循环引用的关键。

## 为什么需要 Weak？

### 循环引用问题

如果我们同时使用 `Rc` 来表示父子双向引用，会产生循环引用：

```rust
use std::rc::Rc;
use std::cell::RefCell;

// ❌ 错误示例：会导致循环引用
struct Node {
    value: i32,
    parent: Option<Rc<RefCell<Node>>>,    // 使用 Rc 指向父节点
    children: Vec<Rc<RefCell<Node>>>,     // 使用 Rc 指向子节点
}
```

在这种设计下：
- 父节点持有子节点的 `Rc`，引用计数 +1
- 子节点持有父节点的 `Rc`，引用计数 +1
- 当树结构离开作用域时，父子节点互相持有对方的强引用，引用计数永远不会降为 0
- 结果：内存泄漏

### 使用 Weak 打破循环

`Weak<T>` 是一种不影响引用计数的"弱引用"。它可以观察 `Rc<T>` 指向的数据，但不会阻止数据被释放。

```rust
use std::rc::{Rc, Weak};
use std::cell::RefCell;

// ✅ 正确示例：使用 Weak 打破循环引用
struct Node {
    value: i32,
    parent: Option<Weak<RefCell<Node>>>,  // 使用 Weak 指向父节点
    children: Vec<Rc<RefCell<Node>>>,     // 使用 Rc 指向子节点
}

impl Node {
    fn new(value: i32) -> Rc<RefCell<Node>> {
        Rc::new(RefCell::new(Node {
            value,
            parent: None,
            children: Vec::new(),
        }))
    }
}
```

## 所有权关系分析

### 所有权流向

在树结构中，所有权的流向是从上到下的：

1. **父节点拥有子节点**：父节点通过 `Rc<RefCell<Node>>` 持有子节点的所有权
2. **子节点不拥有父节点**：子节点通过 `Weak<RefCell<Node>>` 观察父节点，但不持有所有权
3. **释放顺序**：当根节点被释放时，子节点的引用计数会递减，最终整棵树被正确释放

### 为什么是这个方向？

这个设计符合树结构的自然语义：

- **父节点控制子节点的生命周期**：父节点存在，子节点才有意义
- **子节点不应该延长父节点的生命**：子节点被某处引用时，不应该阻止父节点（乃至整棵树）被释放
- **访问父节点需要检查有效性**：通过 `Weak::upgrade()` 访问父节点时，会得到 `Option<Rc<T>>`，自动处理父节点已被释放的情况

## 实际使用示例

```rust
use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Node {
    value: i32,
    parent: Option<Weak<RefCell<Node>>>,
    children: Vec<Rc<RefCell<Node>>>,
}

impl Node {
    fn new(value: i32) -> Rc<RefCell<Node>> {
        Rc::new(RefCell::new(Node {
            value,
            parent: None,
            children: Vec::new(),
        }))
    }

    fn add_child(parent: &Rc<RefCell<Node>>, child_value: i32) -> Rc<RefCell<Node>> {
        let child = Node::new(child_value);

        // 子节点设置父节点的弱引用
        child.borrow_mut().parent = Some(Rc::downgrade(parent));

        // 父节点添加子节点的强引用
        parent.borrow_mut().children.push(Rc::clone(&child));

        child
    }

    fn get_parent_value(node: &Rc<RefCell<Node>>) -> Option<i32> {
        node.borrow()
            .parent
            .as_ref()
            .and_then(|weak_parent| weak_parent.upgrade()) // 尝试升级为强引用
            .map(|parent| parent.borrow().value)
    }
}

fn main() {
    // 创建根节点
    let root = Node::new(1);

    // 添加子节点
    let child1 = Node::add_child(&root, 2);
    let child2 = Node::add_child(&root, 3);

    // 为子节点添加子节点
    let grandchild = Node::add_child(&child1, 4);

    // 访问父节点
    println!("Grandchild's parent: {:?}", Node::get_parent_value(&grandchild)); // Some(2)
    println!("Child1's parent: {:?}", Node::get_parent_value(&child1));         // Some(1)

    // 当 root 离开作用域时，整棵树会被正确释放
}
```

## RefCell 的作用

你可能注意到我们使用了 `Rc<RefCell<Node>>` 而不是 `Rc<Node>`。这是因为：

- `Rc<T>` 提供共享所有权，但只允许不可变借用
- `RefCell<T>` 提供内部可变性，允许在运行时进行可变借用检查
- 组合使用可以实现"多个所有者可以修改数据"的需求

在树结构中，我们需要从父节点修改子节点（添加子节点），也需要从子节点设置父节点引用，因此需要 `RefCell` 提供的内部可变性。

## 关键要点总结

1. **父 → 子：`Rc`**，表示强引用和所有权
2. **子 → 父：`Weak`**，表示弱引用和观察关系
3. **访问 Weak 引用**：使用 `upgrade()` 方法尝试获取 `Rc`，返回 `Option<Rc<T>>`
4. **创建 Weak 引用**：使用 `Rc::downgrade()` 从 `Rc` 创建 `Weak`
5. **避免循环引用**：Weak 不增加引用计数，打破循环
6. **配合 RefCell**：实现共享可变性

通过这种设计模式，我们可以在 Rust 中安全地构建复杂的树形数据结构，既满足所有权规则，又避免内存泄漏。
