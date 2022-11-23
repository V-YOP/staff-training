import { Note } from './Note';
import * as T from '@tonaljs/tonal';
import { Ok, Result, resultSequence, Err } from '@/monads/result';

const MAJOR_SCALES = ['F', 'C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'F#', 'Cb', 'Db', 'C#', 'Ab', 'Eb',             'Bb'] as const
const MINOR_SCALES = ['f', 'c', 'g', 'd', 'a', 'e', 'b',       'f#',             'c#', 'g#', 'eb', 'd#',       'bb'] as const

type MajorKeyLiteral = (typeof MAJOR_SCALES)[number] 
type MinorKeyLiteral = (typeof MINOR_SCALES)[number]

export type NaturalKeyMode = 'Major' | 'Minor'

/**
 * Major key and minor key abstraction, ***only used in Key Signature Recognize***
 */
export class NaturalKey<T extends NaturalKeyMode = NaturalKeyMode> {
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
  get name() { return `${this.mode === 'Major' ? this.tonic.letter.toUpperCase() : this.tonic.letter.toLocaleLowerCase()}${this.tonic.accidental}` }

  static equal(key1: NaturalKey<NaturalKeyMode>): (key2: NaturalKey<NaturalKeyMode>) => boolean {
    return key2 => Note.equal(key1.tonic)(key2.tonic) && key1.mode === key2.mode 
  }
  /**
   * All major key in Circle of Fifths
   * @returns 
   */
  static allMajorKey(): NaturalKey<'Major'>[] {
    return resultSequence(MAJOR_SCALES.map(NaturalKey.get)).map(keys => keys.map(key => key.relateMajorKey())).unwrap()
  }

  /**
   * All minor key in Circle of Fifths
   * @returns 
   */
  static allMinorKey(): NaturalKey<'Minor'>[] {
    return resultSequence(MINOR_SCALES.map(NaturalKey.get)).map(keys => keys.map(key => key.relateMinorKey())).unwrap()
  }

  static get(keyLiteral: MajorKeyLiteral): Result<NaturalKey<'Major'>, Error>;
  static get(keyLiteral: MinorKeyLiteral): Result<NaturalKey<'Minor'>, Error>;
  static get<T extends NaturalKeyMode>(noteLiteral: string): Result<NaturalKey<T>, Error>;
  static get<T extends NaturalKeyMode>(note: Note, mode: T): Result<NaturalKey<T>, Error>;
  static get<T extends NaturalKeyMode>(keyLiteral: string | Note, mode?: T): Result<NaturalKey<T>, Error>{
    if (keyLiteral instanceof Note) {
      keyLiteral = `${mode === 'Major' ? keyLiteral.letter.toUpperCase() : keyLiteral.letter.toLowerCase()}${keyLiteral.accidental}`
    }
    if (!/[A-Ga-g](##|b|bb|#)?$/.test(keyLiteral)) {
      return Err(new Error(`Key '${keyLiteral}' is illegal.`))
    }

    const tonic = Note.get(keyLiteral).unwrap()
    const majorKeyScale = resultSequence(T.Key.majorKey(keyLiteral).scale.map(Note.get)).unwrap()
    if (keyLiteral[0] === keyLiteral[0].toUpperCase()) {
      return Ok(new NaturalKey(tonic, 'Major', majorKeyScale) as NaturalKey<T>)
    } else {
      return Ok(new NaturalKey(tonic, 'Minor', majorKeyScale) as NaturalKey<T>)
    }
  }

  isMajorKey(): this is NaturalKey<'Major'> {
    return this.mode === 'Major'
  }
  isMinorKey(): this is NaturalKey<'Minor'> {
    return this.mode === 'Minor'
  }
  
  relateMajorKey(): NaturalKey<'Major'> {
    if (this.isMajorKey()) return this
    return NaturalKey.get(this._majorKeyScale[2], 'Major').unwrap()
  }
  relateMinorKey(): NaturalKey<'Minor'> {
    if (this.isMinorKey()) return this
    return NaturalKey.get(this._majorKeyScale[5], 'Minor').unwrap()
  }
}