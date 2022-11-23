import { State } from "./state"
import seedrandom from "seedrandom"

export type RNG<T> = State<T, number>

export const RNG = {
  nextDouble(): RNG<number> {
    return new State(seed => {
      const rng = seedrandom(seed + '', {state: true})
      const value = rng()
      const state = rng()
      return [value, state]
    })
  },
  nextPositiveInt(upperBoundExclusive: number): RNG<number> {
    return this.nextDouble().map(double => Math.floor(double * upperBoundExclusive))
  },
  randomItem<T>(arr: T[]): RNG<[item: T, others: T[]]> {
    return this.nextPositiveInt(arr.length).map(index => [arr[index], arr.filter((_, i) => i !== index)])
  },
  shuffle<T>(arr: T[]): RNG<T[]> {
    return this.randomItem(arr).flatMap(([item, others]) => {
      if (others.length !== 0) return this.shuffle(others).map(other => [item, ...other])
      return State.constant([item])
    })
  }
}
