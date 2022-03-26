## 实现构造函数
- 传入一个 `executor`函数
- 接收 `resolve`, `reject` 两个函数
- 默认是 `pending`状态， 只能由`pending` 变为`fulfilled`或者`rejected`。
- 只要这两种情况发生，状态就凝固了，不会再变了
- `executor`函数默认执行， 但是有可能报错，需要需要`try` - `catch`
- 在内部声明 `resolve`, `reject` ，查看`status`后赋值，并且修改`status`状态
