import { Note } from './Note';
import * as T from '@tonaljs/tonal';
import { Ok, Result, resultSequence, Err } from '@/monads/result';
import { _ } from 'ajv';


const MAJOR_KEYS = ['F', 'C', 'G', 'D', 'A', 'E', 'B', 'Cb', 'Gb', 'F#', 'Db', 'C#', 'Ab', 'Eb', 'Bb'] as const
const MINOR_KEYS = ['f', 'c', 'g', 'd', 'a', 'e', 'b', 'f#', 'c#', 'g#', 'ab', 'd#', 'eb', 'a#', 'bb'] as const

type MajorKeyLiteral = (typeof MAJOR_KEYS)[number] 
type MinorKeyLiteral = (typeof MINOR_KEYS)[number]

type NaturalKeyMode = 'Major' | 'Minor'

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
    private _scale: Note[]
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
    return resultSequence(MAJOR_KEYS.map(NaturalKey.get)).map(keys => keys.map(key => key.relateMajorKey())).unwrap()
  }

  /**
   * All minor key in Circle of Fifths
   * @returns 
   */
  static allMinorKey(): NaturalKey<'Minor'>[] {
    return resultSequence(MINOR_KEYS.map(NaturalKey.get)).map(keys => keys.map(key => key.relateMinorKey())).unwrap()
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
    if (keyLiteral[0] === keyLiteral[0].toUpperCase()) {
      if (!MAJOR_KEYS.some(scale => keyLiteral === scale)) {
        return Err(new Error(`Key '${keyLiteral}' is illegal.`))
      }
      return Ok(new NaturalKey(tonic, 'Major', resultSequence(T.Key.majorKey(keyLiteral).scale.map(Note.get)).unwrap()) as NaturalKey<T>)
    } else {
      if (!MINOR_KEYS.some(scale => keyLiteral === scale)) {
        return Err(new Error(`Key '${keyLiteral}' is illegal.`))
      }
      return Ok(new NaturalKey(tonic, 'Minor', resultSequence(T.Key.minorKey(keyLiteral).natural.scale.map(Note.get)).unwrap()) as NaturalKey<T>)
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
    return NaturalKey.get(this._scale[2], 'Major').unwrap()
  }
  relateMinorKey(): NaturalKey<'Minor'> {
    if (this.isMinorKey()) return this
    return NaturalKey.get(this._scale[5], 'Minor').unwrap()
  }

  scale(): Note[] {
    return this._scale
  }
}