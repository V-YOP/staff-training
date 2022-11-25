import { NaturalKey } from "@/musicTheory/NaturalKey";
import { Note } from "@/musicTheory/Note";

export const Modes = [
  'Natural Major', 
  'Natural Minor', 
  'Harmonic Minor',
  'Melodic Minor',
  'Major Pentatonic',
  'Minor Pentatonic',
  'Ionian',  // 大调性
  'Dorian',  // 小调性
  'Phrygian', // 小调性
  'Lydian', // 大调性
  'Mixolydian', // 大调性
  'Aeolian', // 小调性
  'Locrian', // 小调性
] as const

export type Mode = (typeof Modes)[number]

export class Scale {
  constructor(
    private _tonic: Note,
    private _name: Mode,
    private _scale: Note[],
  ) {}
  
  getRelateNaturalKey(): NaturalKey {
    throw new Error('TODO: 根据音阶的性质去获取同主音的相应自然调号，比如对Ionian，Lydian，Mixolydian，Major Pentatonic，找其作为主音的自然大调')
  }

  ascScale(): Note[] {
    return this._scale
  }
  descScale(): Note[] {
    // TODO harmonic minor and melodic minor
    return [...this._scale].reverse()
  }
  allNotes(): Note[] {
    // TODO harmonic minor and melodic minor
    return this._scale
  }
}