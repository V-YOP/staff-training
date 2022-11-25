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
