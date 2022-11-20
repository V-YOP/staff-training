// import { getAllIntervals, intervalsBetween } from '@/musicTheory/Interval'
// import * as Tc from '@tonaljs/core'
// import * as T from '@tonaljs/tonal'
// import * as R from 'ramda'
// import { mkSAQG, SAQG } from './QuizGenerator'

// export function intervalSAQG(filter: (interval: Tc.Interval) => boolean): SAQG<string> {
//   const validIntervals = getAllIntervals().filter(interval => filter(T.Interval.get(interval) as Tc.Interval))
//   return mkSAQG(validIntervals)
// }

// export const prefabIntervalPredicate = {
//   /**
//    * check if interval is between startInterval and endInterval, enharmonic interval inclusive
//    * @param startInterval 
//    * @param endInterval 
//    * @returns 
//    */
//   intervalBetween(startInterval: string, endInterval: string): (interval: Tc.Interval) => boolean {
//     const validIntervals = intervalsBetween(startInterval, endInterval)
//     return interval => R.any(R.equals(interval.name), validIntervals)
//   },
//   /**
//    * check if interval quality in a given quality set
//    * @param qualities quality set
//    * @returns 
//    */
//   qualityIn(qualities: ('M' | 'm' | 'P' | 'A' | 'd' | 'AA' | 'dd')[]): (interval: Tc.Interval) => boolean {
//     return quality => R.any(R.equals(quality.q))(qualities)
//   }
// } as const
