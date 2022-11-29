import _ from "lodash"

export function andP<T>(...fs: ((t: T) => boolean)[]): (t: T) => boolean {
  return t => fs.map(f => f(t)).every(_.identity)
}

export function orP<T>(...fs: ((t: T) => boolean)[]): (t: T) => boolean {
  return t => fs.map(f => f(t)).some(_.identity)
}

export function compose<A>(...fs: ((x: A) => A)[]): (x: A) => A {
  return x => fs.reduceRight((acc, x) => x(acc), x)
}