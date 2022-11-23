export class State<T, S> {
  static pure<S>(): State<null, S> {
    return new State(s => [null, s])
  }
  static constant<T, S>(value: T): State<T, S> {
    return new State(s => [value, s])
  }

  constructor(
    public runState: (state: S) => [value: T, newState: S]
  ) {}

  map<A>(f: (value: T) => A): State<A, S> {
    return new State(state => {
      const [v, s] = this.runState(state)
      return [f(v), s]
    })
  }

  flatMap<A>(f: (value: T) => State<A, S>): State<A, S> {
    return new State(state => {
      const [v, s] = this.runState(state)
      return f(v).runState(s)
    })
  }

  get(): State<S, S> {
    return new State(state => {
      const [, s] = this.runState(state)
      return [s, s]
    })
  }
  set(action: (oldState: S) => S): State<T, S> {
    return new State(state => this.runState(action(state)))
  }
}

// State 来自函数式编程，是其对命令式编程中状态操作的模拟，其行为就像一个无状态的对象中封装了 **一个** 状态

// 比如下面是一个简单的状态操作
let str = "hello"
str = str + " world!"
const upperCase = str.toUpperCase()
str = upperCase + str;

// 相应操作：
State.constant({})
