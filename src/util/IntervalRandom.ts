import * as R from 'ramda'
import * as T from '@tonaljs/tonal'
import * as Tc from '@tonaljs/core'
import { shuffle } from './CollectionUtil'

const SEMITONE2INTERVALS: Record<number, string[]> = {
  '-2': [ 'dd1' ],
  '-1': [ 'd1', 'dd2' ],
  '0': [ 'P1', 'd2' ],
  '1': [ 'A1', 'dd3', 'm2' ],
  '2': [ 'AA1', 'd3', 'M2' ],
  '3': [ 'A2', 'dd4', 'm3' ],
  '4': [ 'AA2', 'd4', 'M3' ],
  '5': [ 'P4', 'A3', 'dd5' ],
  '6': [ 'AA3', 'A4', 'd5', 'dd6' ],
  '7': [ 'P5', 'AA4', 'd6', 'M5', 'm5' ],
  '8': [ 'A5', 'dd7', 'm6' ],
  '9': [ 'AA5', 'd7', 'M6' ],
  '10': [ 'A6', 'dd8', 'm7', 'dd8' ],
  '11': [ 'AA6', 'd8', 'M7', 'd8', 'dd9' ],
  '12': [ 'P8', 'A7', 'P8', 'd9' ],
  '13': [ 'AA7', 'A8', 'A8', 'dd10', 'm9' ],
  '14': [ 'AA8', 'AA8', 'd10', 'M9' ],
  '15': [ 'A9', 'dd11', 'm10' ],
  '16': [ 'AA9', 'd11', 'M10' ],
  '17': [ 'P11', 'A10', 'dd12' ],
  '18': [ 'AA10', 'A11', 'd12', 'dd13' ],
  '19': [ 'P12', 'AA11', 'd13', 'M12', 'm12' ],
  '20': [ 'A12', 'dd14', 'm13' ],
  '21': [ 'AA12', 'd14', 'M13' ],
  '22': [ 'dd15', 'A13', 'dd15', 'm14' ],
  '23': [ 'd15', 'dd16', 'AA13', 'd15', 'M14' ],
  '24': [ 'P15', 'd16', 'P15', 'A14' ],
  '25': [ 'A15', 'dd17', 'm16', 'AA14', 'A15' ],
  '26': [ 'AA15', 'd17', 'M16', 'AA15' ],
  '27': [ 'A16', 'dd18', 'm17' ],
  '28': [ 'AA16', 'd18', 'M17' ],
  '29': [ 'P18', 'A17', 'dd19' ],
  '30': [ 'AA17', 'A18', 'd19', 'dd20' ],
  '31': [ 'P19', 'AA18', 'd20', 'M19', 'm19' ],
  '32': [ 'A19', 'dd21', 'm20' ],
  '33': [ 'AA19', 'd21', 'M20' ],
  '34': [ 'A20', 'dd22', 'm21' ],
  '35': [ 'AA20', 'd22', 'M21' ],
  '36': [ 'P22', 'A21' ],
  '37': [ 'AA21', 'A22' ],
  '38': [ 'AA22' ]
}

const INTERVAL2SEMITONE: Record<string, number> = R.reduce((acc: Record<string, number>, x: [string, string[]]) => {
  const [value, keys] = x
  return {...acc, ...keys.reduce((subAcc, x) => ({...subAcc, [x]: +value}), {} as Record<string, number>)}
}, {}, Object.entries(SEMITONE2INTERVALS))


function getSemitoneByInterval(interval: string): number {
  const semitone = INTERVAL2SEMITONE[interval]
  console.log(INTERVAL2SEMITONE)
  if (semitone == null) {
    throw new Error(`interval ${interval} is illegal`)
  }
  return semitone
}

function getIntervalsBySemitones(semitone: number): string[] {
  const res = SEMITONE2INTERVALS[semitone]
  if (res == null) {
    throw new Error(`interval with semitone ${semitone} is illegal`)
  }
  return res
}

function getEnharmonicIntervals(interval: string): string[] {
  return getIntervalsBySemitones(getSemitoneByInterval(interval))
}

function intervalsBetween(startIntervalInclusive: string, endIntervalInclusive: string): string[] {
  const s1 = getSemitoneByInterval(startIntervalInclusive)
  const s2 = getSemitoneByInterval(endIntervalInclusive)
  const lower = R.min(s1, s2)
  const higher = R.max(s1, s2)
  return R.chain(getIntervalsBySemitones)(R.range(lower, higher))
}

export class IntervalRandom {
  constructor(
    private startIntervalInclusive: string,
    private endIntervalInclusive: string,
    private intervalFilter: (note: Tc.Interval) => boolean = R.T,
  ) {}
  nextInterval(): string {
    return this.nextIntervalList()[0]
  }
  nextIntervalList(len: number = 4): string[] {
    const intervalList = intervalsBetween(this.startIntervalInclusive, this.endIntervalInclusive)
      .filter(interval => this.intervalFilter(T.Interval.get(interval) as Tc.Interval))
    if (intervalList.length < len) {
      throw new Error(`There are only ${intervalList.length} valid intervals but acquired ${len}.`)
    }
    shuffle(intervalList)
    return R.take(len, intervalList)
  }
}