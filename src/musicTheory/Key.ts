import { Note } from './Note';
import * as T from '@tonaljs/tonal';
import { Err, Ok, Result } from '@sniptt/monads';
import { resultSequence } from '@/monads/result';

const MAJOR_SCALES = ['F', 'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'F#', 'Cb', 'Db', 'C#', 'Ab', 'Eb',       'Bb'] as const
const MINOR_SCALES = ['f', 'c', 'g', 'd', 'a', 'e', 'b',       'f#',             'c#', 'g#', 'd#', 'a#', 'bb'] as const

type MajorKeyLiteral = (typeof MAJOR_SCALES)[number] 
type MinorKeyLiteral = (typeof MINOR_SCALES)[number]

type Mode = 'Major' | 'Minor'

/**
 * Key is a set of note built with one note called tonic
 * 
 * Considering abstract Scale then.
 */
export class Key<T extends Mode> {
  constructor(
    private _tonic: Note,
    private _mode: T,
    /**
     * major key scale, used for calculate relate Key
     */
    private _majorKeyScale: Note[]
  ){}
  get tonic() {return this._tonic}
  get mode() {return this._mode}

  static get(keyLiteral: MajorKeyLiteral): Result<Key<'Major'>, Error>;
  static get(keyLiteral: MinorKeyLiteral): Result<Key<'Minor'>, Error>;
  static get<T extends Mode>(noteLiteral: string): Result<Key<T>, Error>;
  static get<T extends Mode>(note: Note, mode: T): Result<Key<T>, Error>;
  static get<T extends Mode>(keyLiteral: string | Note, mode?: T): Result<Key<T>, Error>{
    if (keyLiteral instanceof Note) {
      keyLiteral = `${mode === 'Major' ? keyLiteral.letter.toUpperCase() : keyLiteral.letter.toLowerCase()}${keyLiteral.accidental}`
    }
    if (!/[A-Ga-g][#b]?$/.test(keyLiteral)) {
      return Err(new Error(`Key '${keyLiteral}' is illegal.`))
    }

    const tonic = Note.get(keyLiteral).unwrap()
    const majorKeyScale = resultSequence(T.Key.majorKey(keyLiteral).scale.map(Note.get)).unwrap()
    if (keyLiteral[0] === keyLiteral[0].toUpperCase()) {
      return Ok(new Key(tonic, 'Major', majorKeyScale) as Key<T>)
    } else {
      return Ok(new Key(tonic, 'Minor', majorKeyScale) as Key<T>)
    }
  }

  isMajorKey(): this is Key<'Major'> {
    return this.mode === 'Major'
  }
  isMinorKey(): this is Key<'Minor'> {
    return this.mode === 'Minor'
  }
  
  relateMajorKey(): Key<'Major'> {
    if (this.isMajorKey()) return this
    Key.get(this._majorKeyScale[2], 'Major').unwrap()
    return Key.get(this._majorKeyScale[2], 'Major').unwrap()
  }
  relateMinorKey(): Key<'Minor'> {
    if (this.isMinorKey()) return this
    return Key.get(this._majorKeyScale[2], 'Minor').unwrap()
  }

  // /**
  //  * All major key's tonic in Circle of Fifths, whose major key doesn't have any double accidental, used for display key signature
  //  * @returns 
  //  */
  // static allMajorKeyTonic(): Note[] {
  //   return MAJOR_SCALES.map(Note.get) as Note[]
  // }

  // /**
  //  * All minor key's tonic in Circle of Fifths, whose minor key doesn't have any double accidental, used for display key signature
  //  * @returns 
  //  */
  // static allMinorKeyTonic(): Note[] {
  //   return MINOR_SCALES.map(Note.get) as Note[]
  // }

  // /**
  //  * All major key in Circle of Fifths
  //  * @returns 
  //  */
  // static allMajorKey(): Key[] {
  //   return MAJOR_SCALES.map(Key.get) as Key[]
  // }

  // /**
  //  * All minor key in Circle of Fifths
  //  * @returns 
  //  */
  // static allMinorKey(): Key[] {
  //   return MINOR_SCALES.map(Key.get) as Key[]
  // }

  // static get(keyLiteral: KeyLiteral): Key;
  // static get(keyLiteral: string | Note): Key | Error;
  // static get(keyLiteral: string | Note): Key | Error {
  //   if (keyLiteral instanceof Note) {
  //     keyLiteral = `${keyLiteral.letter}${keyLiteral.accidental}`
  //   }
  //   if (!/[A-Ga-g][#b]?$/.test(keyLiteral)) {
  //     return new Error(`Key '${keyLiteral}' is illegal.`)
  //   }
  //   const {tonic, scale: majorScale} = T.Key.majorKey(keyLiteral)
  //   const {natural: {scale: minorScale}, harmonic: {scale: harmonicMinorScale}, melodic: {scale: melodicMinorScale}} = T.Key.minorKey(keyLiteral)
    
  //   function reverse<T>(arr: readonly T[]): T[] {
  //     return [...arr].reverse()
  //   }

  //   function helper(ascScale: readonly string[], descScale: readonly string[] = reverse(ascScale)): [Note[], Note[]] {
  //     return [ascScale.map(Note.get) as Note[], descScale.map(Note.get) as Note[]]
  //   }

  //   // 旋律小调下，七级升高半音，上下行一致
  //   // 和声小调下，上行六七级升高，下行回到自然小调
  //   const scales: Record<Mode, [asc: Note[], desc: Note[]]> = {
  //     Major: helper(majorScale), 
  //     Minor: helper(minorScale),
  //     'Melodic Minor': helper(harmonicMinorScale),
  //     'Harmonic Minor': helper(melodicMinorScale, reverse(minorScale))
  //   }
  //   return new Key(
  //     Note.get(tonic) as Note, 
  //     scales
  //   )
  // }
  
  // constructor(
  //   private _tonic: Note,
  //   private _scale: Record<Mode, [asc: Note[], desc: Note[]]>
  // ){}

  // get tonic() {return this._tonic}
  // getScale(mode: Mode) {
  //   return this._scale[mode]
  // }
}