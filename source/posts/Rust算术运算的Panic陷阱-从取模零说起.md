---
title: Rust 算术运算的 Panic 陷阱：从取模零说起
date: 2025-12-02 10:00:00
tags:
  - Rust
  - 算法
  - 安全
  - Panic
  - 算术运算
categories: Rust 学习笔记
description: 在刷 Rust 算法题时发现了一个独特现象：对零取模会直接导致程序 panic！这与其他语言的行为截然不同。本文深入探讨 Rust 中会导致 panic 的算术运算场景，包括除零、整数溢出、INT_MIN/-1 等特殊情况，以及 Rust 提供的 checked_、wrapping_、saturating_ 等安全替代方案。理解这些行为对于编写健壮的 Rust 程序至关重要。
---

## 前言

今天在刷 Rust 算法题时，遇到了一个让我印象深刻的情况：**当我尝试对 0 取模时，程序直接 panic 了！**

```rust
fn main() {
    let x = 10;
    let y = 0;
    let result = x % y;  // 💥 thread 'main' panicked at 'attempt to calculate the remainder with a divisor of zero'
}
```

这个行为在其他语言中并不常见。比如在 JavaScript 中，`10 % 0` 会返回 `NaN`；在 Python 中会抛出 `ZeroDivisionError` 异常（可以被捕获）。而 **Rust 选择直接 panic，整个程序崩溃，无法通过普通的错误处理机制捕获**。

这引发了我的好奇：Rust 中还有哪些类似的"地雷"？让我们一探究竟。

## Rust 中会导致 Panic 的算术运算

### 1. 除法和取模运算的零除错误

在 Rust 中，**整数的除法和取模运算遇到零除数时会无条件 panic**：

```rust
fn main() {
    let a = 10;
    let b = 0;

    // 💥 除法遇到零：panic!
    // let div = a / b;

    // 💥 取模遇到零：panic!
    // let rem = a % b;

    println!("这行代码永远不会执行");
}
```

**为什么会这样？**

Rust 的设计哲学是：**宁可 panic 也不产生未定义行为（Undefined Behavior, UB）**。在很多底层语言（如 C/C++）中，除以零会导致 UB，这可能造成：
- 程序段错误（Segmentation Fault）
- 返回垃圾值
- 安全漏洞

Rust 通过显式 panic 来避免这些不可预测的行为，让错误在第一时间暴露出来。

**浮点数例外**

有趣的是，**浮点数的除零操作不会 panic**，而是遵循 IEEE 754 标准：

```rust
fn main() {
    let x = 10.0;
    let y = 0.0;

    println!("{}", x / y);      // ✅ inf (正无穷)
    println!("{}", -x / y);     // ✅ -inf (负无穷)
    println!("{}", y / y);      // ✅ NaN (Not a Number)

    // 浮点数取模也不会 panic，但会返回 NaN
    println!("{}", x % y);      // ✅ NaN
}
```

### 2. 整数溢出的特殊边界情况

还有一个更隐蔽的陷阱：**`INT_MIN / -1` 和 `INT_MIN % -1` 也会 panic**！

```rust
fn main() {
    let min = i8::MIN;  // -128
    let divisor = -1;

    // 💥 这会 panic！
    // let result = min / divisor;

    // 💥 这也会 panic！
    // let remainder = min % divisor;
}
```

**为什么？**

对于 8 位有符号整数 `i8`：
- 最小值：`i8::MIN = -128`
- 最大值：`i8::MAX = 127`

当我们计算 `-128 / -1` 时，数学结果应该是 `128`，但这**超出了 `i8` 的表示范围**（最大只能到 127），导致溢出。Rust 选择 panic 而不是返回错误的结果。

```rust
fn demonstrate_overflow() {
    // 对于不同的整数类型，都存在这个问题
    println!("i8::MIN  / -1 会 panic: {}", i8::MIN);   // -128 / -1 = 128 (溢出!)
    println!("i16::MIN / -1 会 panic: {}", i16::MIN);  // -32768 / -1 = 32768 (溢出!)
    println!("i32::MIN / -1 会 panic: {}", i32::MIN);  // -2147483648 / -1 = 2147483648 (溢出!)
    println!("i64::MIN / -1 会 panic: {}", i64::MIN);  // 同理
}
```

### 3. Debug 模式下的整数溢出

Rust 在 **debug 模式和 release 模式下对整数溢出的处理不同**：

```rust
fn main() {
    let max = u8::MAX;  // 255

    // Debug 模式：💥 panic!
    // Release 模式：✅ 环绕到 0 (wrapping)
    let result = max + 1;

    println!("Result: {}", result);
}
```

**行为差异：**

| 模式 | 溢出行为 | 原因 |
|------|----------|------|
| **Debug** (`cargo build`) | Panic | 帮助开发者尽早发现 bug |
| **Release** (`cargo build --release`) | 二进制补码环绕 | 性能优化，避免运行时检查开销 |

在 release 模式下：
```rust
u8::MAX + 1      // => 0   (255 + 1 环绕为 0)
u8::MIN - 1      // => 255 (0 - 1 环绕为 255)
i8::MAX + 1      // => -128 (127 + 1 环绕为 -128)
```

这意味着：**同样的代码在不同编译模式下可能有完全不同的行为！**

## Rust 的解决方案：显式的溢出处理

为了让开发者能够精确控制溢出行为，Rust 提供了多种方法变体：

### 1. `checked_*` 系列：安全检查，返回 Option

```rust
fn safe_division(a: i32, b: i32) -> Option<i32> {
    a.checked_div(b)
}

fn main() {
    println!("{:?}", 10.checked_div(2));   // Some(5)
    println!("{:?}", 10.checked_div(0));   // None - 零除返回 None 而不是 panic
    println!("{:?}", i32::MIN.checked_div(-1)); // None - 溢出返回 None

    // 其他 checked 方法
    println!("{:?}", 255u8.checked_add(1));     // None
    println!("{:?}", 0u8.checked_sub(1));       // None
    println!("{:?}", 128i8.checked_mul(2));     // None
    println!("{:?}", 10.checked_rem(0));        // None - 取模零也返回 None
}
```

**适用场景：**
- 用户输入处理
- 外部数据验证
- 需要优雅处理错误的场景

### 2. `wrapping_*` 系列：显式环绕行为

```rust
fn main() {
    // 无论 debug 还是 release 模式，都保证环绕行为
    println!("{}", 255u8.wrapping_add(1));      // 0
    println!("{}", 0u8.wrapping_sub(1));        // 255
    println!("{}", 200u8.wrapping_mul(2));      // 144 (400 % 256)

    // 环绕除法：零除仍然会 panic！
    // println!("{}", 10.wrapping_div(0));  // 💥 仍然 panic

    // 但 INT_MIN / -1 会环绕而不是 panic
    println!("{}", i8::MIN.wrapping_div(-1));   // -128 (环绕到自身)
}
```

**适用场景：**
- 哈希计算
- 密码学算法
- 需要明确的模运算语义

### 3. `saturating_*` 系列：饱和到边界值

```rust
fn main() {
    // 溢出时返回类型的最大/最小值
    println!("{}", 255u8.saturating_add(1));    // 255 (不超过最大值)
    println!("{}", 0u8.saturating_sub(1));      // 0   (不低于最小值)
    println!("{}", 200u8.saturating_mul(2));    // 255 (饱和到最大值)

    // 有符号整数
    println!("{}", 127i8.saturating_add(1));    // 127
    println!("{}", (-128i8).saturating_sub(1)); // -128

    // 除法仍然对零除 panic
    // println!("{}", 10.saturating_div(0));  // 💥 panic
}
```

**适用场景：**
- 音频/视频处理（音量、亮度限制）
- 游戏开发（生命值、伤害计算）
- UI 组件（滚动位置、进度条）

### 4. `overflowing_*` 系列：返回结果和溢出标志

```rust
fn main() {
    let (result, overflowed) = 255u8.overflowing_add(1);
    println!("Result: {}, Overflowed: {}", result, overflowed);
    // Result: 0, Overflowed: true

    let (result, overflowed) = 100u8.overflowing_add(50);
    println!("Result: {}, Overflowed: {}", result, overflowed);
    // Result: 150, Overflowed: false

    // 可以用来实现自定义的溢出处理逻辑
    let (div, overflow) = i8::MIN.overflowing_div(-1);
    println!("Division: {}, Overflow: {}", div, overflow);
    // Division: -128, Overflow: true
}
```

**适用场景：**
- 需要记录溢出事件
- 实现自定义的错误报告
- 性能敏感但需要溢出信息的代码

### 5. `strict_*` 系列：总是 Panic（Rust 1.80+）

```rust
fn main() {
    // 无论 debug 还是 release，溢出总是 panic
    // let result = 255u8.strict_add(1);  // 💥 panic in both debug and release

    // 这对于需要严格保证数学正确性的场景很有用
}
```

**适用场景：**
- 金融计算
- 科学计算
- 任何不能容忍静默溢出的场景

## 完整的除零安全处理示例

结合上面的知识，我们可以写一个安全的计算器函数：

```rust
#[derive(Debug, PartialEq)]
enum CalcError {
    DivisionByZero,
    Overflow,
}

fn safe_calculator(a: i32, b: i32, op: char) -> Result<i32, CalcError> {
    match op {
        '+' => a.checked_add(b).ok_or(CalcError::Overflow),
        '-' => a.checked_sub(b).ok_or(CalcError::Overflow),
        '*' => a.checked_mul(b).ok_or(CalcError::Overflow),
        '/' => {
            if b == 0 {
                Err(CalcError::DivisionByZero)
            } else {
                a.checked_div(b).ok_or(CalcError::Overflow)
            }
        }
        '%' => {
            if b == 0 {
                Err(CalcError::DivisionByZero)
            } else {
                a.checked_rem(b).ok_or(CalcError::Overflow)
            }
        }
        _ => panic!("Unsupported operation"),
    }
}

fn main() {
    println!("{:?}", safe_calculator(10, 2, '/'));   // Ok(5)
    println!("{:?}", safe_calculator(10, 0, '/'));   // Err(DivisionByZero)
    println!("{:?}", safe_calculator(10, 0, '%'));   // Err(DivisionByZero)
    println!("{:?}", safe_calculator(i32::MAX, 1, '+')); // Err(Overflow)
    println!("{:?}", safe_calculator(i32::MIN, -1, '/')); // Err(Overflow)
}
```

## Rust vs 其他语言

让我们对比一下不同语言对除零的处理：

| 语言 | `10 / 0` 行为 | `10 % 0` 行为 | 可捕获？ |
|------|---------------|---------------|----------|
| **Rust** | Panic（程序崩溃） | Panic（程序崩溃） | ❌ 不可用 try-catch 捕获 |
| **Python** | 抛出 `ZeroDivisionError` | 抛出 `ZeroDivisionError` | ✅ 可用 try-except 捕获 |
| **JavaScript** | `Infinity` | `NaN` | ✅ 不抛出异常，返回特殊值 |
| **Java** | 抛出 `ArithmeticException` | 抛出 `ArithmeticException` | ✅ 可用 try-catch 捕获 |
| **C/C++** | 未定义行为（UB） | 未定义行为（UB） | ❌ 无标准异常机制 |
| **Go** | Panic | Panic | ⚠️ 可用 recover 捕获（不推荐） |

**Rust 的设计权衡：**

1. **不使用异常机制**：Rust 没有 try-catch 异常系统，这避免了隐藏的控制流和性能开销
2. **强制显式处理**：通过 `checked_*` 等方法，强制开发者在可能出错的地方显式处理
3. **Panic 是最后手段**：Panic 用于"不可恢复的错误"，而零除被认为是编程错误而非业务逻辑错误

## 实战建议

### 1. 算法题中的处理

在刷算法题时，可以这样处理：

```rust
// ❌ 危险：可能 panic
fn solve_naive(n: i32, m: i32) -> i32 {
    (n * n) % m  // 如果 m 为 0，直接崩溃
}

// ✅ 安全：添加前置检查
fn solve_safe(n: i32, m: i32) -> Option<i32> {
    if m == 0 {
        return None;
    }
    Some((n * n) % m)
}

// ✅ 更好：使用 checked 方法
fn solve_better(n: i32, m: i32) -> Option<i32> {
    n.checked_mul(n)?.checked_rem(m)
}
```

### 2. 生产代码的建议

```rust
// 对于用户输入，总是使用 checked_* 方法
fn process_user_input(dividend: i32, divisor: i32) -> Result<i32, String> {
    dividend
        .checked_div(divisor)
        .ok_or_else(|| {
            if divisor == 0 {
                "除数不能为零".to_string()
            } else {
                "计算溢出".to_string()
            }
        })
}

// 对于性能敏感且确定不会溢出的代码，可以使用普通运算符
fn fast_index_calculation(base: usize, offset: usize, size: usize) -> usize {
    // 假设已经在外层保证了不会溢出
    (base + offset) % size
}

// 对于需要环绕语义的场景，明确使用 wrapping_*
fn hash_combine(hash1: u64, hash2: u64) -> u64 {
    hash1.wrapping_add(hash2).wrapping_mul(0x9e3779b97f4a7c15)
}
```

### 3. 测试建议

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "divide by zero")]
    fn test_division_by_zero_panics() {
        let _ = 10 / 0;
    }

    #[test]
    #[should_panic(expected = "remainder")]
    fn test_modulo_by_zero_panics() {
        let _ = 10 % 0;
    }

    #[test]
    fn test_safe_division() {
        assert_eq!(10.checked_div(2), Some(5));
        assert_eq!(10.checked_div(0), None);
        assert_eq!(i32::MIN.checked_div(-1), None);
    }
}
```

## 总结

### 关键要点

1. **Rust 中会导致 panic 的算术运算：**
   - `a / 0` 和 `a % 0`（整数）
   - `INT_MIN / -1` 和 `INT_MIN % -1`
   - Debug 模式下的整数溢出

2. **浮点数例外：**
   - `f32/f64` 的除零不会 panic，返回 `Infinity` 或 `NaN`

3. **Debug vs Release 的差异：**
   - Debug：溢出 panic，帮助调试
   - Release：溢出环绕，优化性能
   - 使用 `checked_*` 等方法可以统一行为

4. **Rust 的解决方案：**
   - `checked_*`：安全检查，返回 `Option<T>`
   - `wrapping_*`：显式环绕
   - `saturating_*`：饱和到边界
   - `overflowing_*`：返回结果和溢出标志
   - `strict_*`：总是 panic（Rust 1.80+）

5. **设计哲学：**
   - 避免未定义行为
   - 强制显式处理
   - Panic 用于不可恢复的编程错误

### 实践建议

- ✅ **用户输入和外部数据**：总是使用 `checked_*` 方法
- ✅ **算法题**：添加边界检查或使用 `checked_*`
- ✅ **性能关键路径**：如果确定安全，可以用普通运算符，但要有充分的注释说明
- ✅ **需要环绕语义**：明确使用 `wrapping_*`
- ✅ **测试**：为边界情况编写测试，包括 panic 测试

### 延伸阅读

- [Rust RFC 560 - Integer Overflow](https://rust-lang.github.io/rfcs/0560-integer-overflow.html)
- [Myths and Legends about Integer Overflow in Rust](https://huonw.github.io/blog/2016/04/myths-and-legends-about-integer-overflow-in-rust/)
- [Rust Documentation - Div trait](https://doc.rust-lang.org/std/ops/trait.Div.html)
- [Behavior not considered unsafe - Rust Reference](https://doc.rust-lang.org/reference/behavior-not-considered-unsafe.html)
- [Exploring Rust's Overflow Behavior - Sling Academy](https://www.slingacademy.com/article/exploring-rusts-overflow-behavior-wrapping-saturating-and-panicking/)

---

**最后提醒：** 这些行为不是 bug，而是 Rust 为了安全性做出的有意设计。理解这些特性，才能写出既安全又高效的 Rust 代码。下次刷算法题时，记得留意除法和取模操作，不要让你的解答因为一个 `% 0` 而崩溃！

写到这里，我想起了前一个月的 cloudflare的unwarp 造成的panic!。真的很好笑。

一定要注意rust一切可能引起panic!的可能性，才不会像cloudflare的unwarp方法一样，搞出的几十亿美金的全球网站崩溃漏洞。

Sources:
- [Rust RFC 560 - Integer Overflow](https://rust-lang.github.io/rfcs/0560-integer-overflow.html)
- [Myths and Legends about Integer Overflow in Rust](https://huonw.github.io/blog/2016/04/myths-and-legends-about-integer-overflow-in-rust/)
- [What happens in Rust programming language when an integer arithmetic operation overflows? - Stack Overflow](https://stackoverflow.com/questions/68807024/what-happens-in-rust-programming-language-when-an-integer-arithmetic-operation-o)
- [Exploring Rust's Overflow Behavior: Wrapping, Saturating, and Panicking - Sling Academy](https://www.slingacademy.com/article/exploring-rusts-overflow-behavior-wrapping-saturating-and-panicking/)
- [Div in std::ops - Rust](https://doc.rust-lang.org/std/ops/trait.Div.html)
