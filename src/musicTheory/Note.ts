import { Err, Ok, Result } from '@/monads/'
import { resultSequence } from '@/monads/result'
import * as T from '@tonaljs/tonal'
import _ from 'lodash'
import { z } from 'zod'

const ENHARMONIC_NOTES = [
  ['C1', 'Dbb1', 'B#1'], ['C#1', 'Db1', 'B##1'], ['C##1', 'D1', 'Ebb1'],
  ['D#1', 'Eb1', 'Fbb1'], ['D##1', 'E1', 'Fb1'], ['E#1', 'F1', 'Gbb1'],
  ['E##1', 'F#1', 'Gb1'], ['F##1', 'G1', 'Abb1'], ['G#1', 'Ab1'],
  ['G##1', 'A1', 'Bbb1'], ['Cbb1', 'A#1', 'Bb1'], ['Cb1', 'A##1', 'B1'],
  ['C2', 'Dbb2', 'B#2'], ['C#2', 'Db2', 'B##2'], ['C##2', 'D2', 'Ebb2'],
  ['D#2', 'Eb2', 'Fbb2'], ['D##2', 'E2', 'Fb2'], ['E#2', 'F2', 'Gbb2'],
  ['E##2', 'F#2', 'Gb2'], ['F##2', 'G2', 'Abb2'], ['G#2', 'Ab2'],
  ['G##2', 'A2', 'Bbb2'], ['Cbb2', 'A#2', 'Bb2'], ['Cb2', 'A##2', 'B2'],
  ['C3', 'Dbb3', 'B#3'], ['C#3', 'Db3', 'B##3'], ['C##3', 'D3', 'Ebb3'],
  ['D#3', 'Eb3', 'Fbb3'], ['D##3', 'E3', 'Fb3'], ['E#3', 'F3', 'Gbb3'],
  ['E##3', 'F#3', 'Gb3'], ['F##3', 'G3', 'Abb3'], ['G#3', 'Ab3'],
  ['G##3', 'A3', 'Bbb3'], ['Cbb3', 'A#3', 'Bb3'], ['Cb3', 'A##3', 'B3'],
  ['C4', 'Dbb4', 'B#4'], ['C#4', 'Db4', 'B##4'], ['C##4', 'D4', 'Ebb4'],
  ['D#4', 'Eb4', 'Fbb4'], ['D##4', 'E4', 'Fb4'], ['E#4', 'F4', 'Gbb4'],
  ['E##4', 'F#4', 'Gb4'], ['F##4', 'G4', 'Abb4'], ['G#4', 'Ab4'],
  ['G##4', 'A4', 'Bbb4'], ['Cbb4', 'A#4', 'Bb4'], ['Cb4', 'A##4', 'B4'],
  ['C5', 'Dbb5', 'B#5'], ['C#5', 'Db5', 'B##5'], ['C##5', 'D5', 'Ebb5'],
  ['D#5', 'Eb5', 'Fbb5'], ['D##5', 'E5', 'Fb5'], ['E#5', 'F5', 'Gbb5'],
  ['E##5', 'F#5', 'Gb5'], ['F##5', 'G5', 'Abb5'], ['G#5', 'Ab5'],
  ['G##5', 'A5', 'Bbb5'], ['Cbb5', 'A#5', 'Bb5'], ['Cb5', 'A##5', 'B5'],
  ['C6', 'Dbb6', 'B#6'], ['C#6', 'Db6', 'B##6'], ['C##6', 'D6', 'Ebb6'],
  ['D#6', 'Eb6', 'Fbb6'], ['D##6', 'E6', 'Fb6'], ['E#6', 'F6', 'Gbb6'],
  ['E##6', 'F#6', 'Gb6'], ['F##6', 'G6', 'Abb6'], ['G#6', 'Ab6'],
  ['G##6', 'A6', 'Bbb6'], ['Cbb6', 'A#6', 'Bb6'], ['Cb6', 'A##6', 'B6'],
  ['C7', 'Dbb7', 'B#7'], ['C#7', 'Db7', 'B##7'], ['C##7', 'D7', 'Ebb7'],
  ['D#7', 'Eb7', 'Fbb7'], ['D##7', 'E7', 'Fb7'], ['E#7', 'F7', 'Gbb7'],
  ['E##7', 'F#7', 'Gb7'], ['F##7', 'G7', 'Abb7'], ['G#7', 'Ab7'],
  ['G##7', 'A7', 'Bbb7'], ['Cbb7', 'A#7', 'Bb7'], ['Cb7', 'A##7', 'B7']
]

const ALL_NOTE = [
  'C1', 'Dbb1', 'B#1', 'C#1', 'Db1', 'B##1', 'C##1', 'D1', 'Ebb1', 'D#1', 'Eb1', 'Fbb1',
  'D##1', 'E1', 'Fb1', 'E#1', 'F1', 'Gbb1', 'E##1', 'F#1', 'Gb1', 'F##1', 'G1', 'Abb1',
  'G#1', 'Ab1', 'G##1', 'A1', 'Bbb1', 'Cbb1', 'A#1', 'Bb1', 'Cb1', 'A##1', 'B1', 'C2',
  'Dbb2', 'B#2', 'C#2', 'Db2', 'B##2', 'C##2', 'D2', 'Ebb2', 'D#2', 'Eb2', 'Fbb2', 'D##2',
  'E2', 'Fb2', 'E#2', 'F2', 'Gbb2', 'E##2', 'F#2', 'Gb2', 'F##2', 'G2', 'Abb2', 'G#2',
  'Ab2', 'G##2', 'A2', 'Bbb2', 'Cbb2', 'A#2', 'Bb2', 'Cb2', 'A##2', 'B2', 'C3', 'Dbb3',
  'B#3', 'C#3', 'Db3', 'B##3', 'C##3', 'D3', 'Ebb3', 'D#3', 'Eb3', 'Fbb3', 'D##3', 'E3',
  'Fb3', 'E#3', 'F3', 'Gbb3', 'E##3', 'F#3', 'Gb3', 'F##3', 'G3', 'Abb3', 'G#3', 'Ab3',
  'G##3', 'A3', 'Bbb3', 'Cbb3', 'A#3', 'Bb3', 'Cb3', 'A##3', 'B3', 'C4', 'Dbb4', 'B#4',
  'C#4', 'Db4', 'B##4', 'C##4', 'D4', 'Ebb4', 'D#4', 'Eb4', 'Fbb4', 'D##4', 'E4', 'Fb4',
  'E#4', 'F4', 'Gbb4', 'E##4', 'F#4', 'Gb4', 'F##4', 'G4', 'Abb4', 'G#4', 'Ab4', 'G##4',
  'A4', 'Bbb4', 'Cbb4', 'A#4', 'Bb4', 'Cb4', 'A##4', 'B4', 'C5', 'Dbb5', 'B#5', 'C#5',
  'Db5', 'B##5', 'C##5', 'D5', 'Ebb5', 'D#5', 'Eb5', 'Fbb5', 'D##5', 'E5', 'Fb5', 'E#5',
  'F5', 'Gbb5', 'E##5', 'F#5', 'Gb5', 'F##5', 'G5', 'Abb5', 'G#5', 'Ab5', 'G##5', 'A5',
  'Bbb5', 'Cbb5', 'A#5', 'Bb5', 'Cb5', 'A##5', 'B5', 'C6', 'Dbb6', 'B#6', 'C#6', 'Db6',
  'B##6', 'C##6', 'D6', 'Ebb6', 'D#6', 'Eb6', 'Fbb6', 'D##6', 'E6', 'Fb6', 'E#6', 'F6',
  'Gbb6', 'E##6', 'F#6', 'Gb6', 'F##6', 'G6', 'Abb6', 'G#6', 'Ab6', 'G##6', 'A6', 'Bbb6',
  'Cbb6', 'A#6', 'Bb6', 'Cb6', 'A##6', 'B6', 'C7', 'Dbb7', 'B#7', 'C#7', 'Db7', 'B##7',
  'C##7', 'D7', 'Ebb7', 'D#7', 'Eb7', 'Fbb7', 'D##7', 'E7', 'Fb7', 'E#7', 'F7', 'Gbb7',
  'E##7', 'F#7', 'Gb7', 'F##7', 'G7', 'Abb7', 'G#7', 'Ab7', 'G##7', 'A7', 'Bbb7', 'Cbb7',
  'A#7', 'Bb7', 'Cb7', 'A##7', 'B7'
] as const

const NOTE2INDEX: Record<string, number> = ENHARMONIC_NOTES.reduce((acc, keys, value) => {
  return {...acc, ...keys.reduce((subAcc, x) => ({...subAcc, [x]: value}), {} as Record<string, number>)}
}, {} as Record<string, number>)

const ENHARMONIC_NOTES_WITHOUT_OCTAVE = [
  ['C', 'Dbb', 'B#'],
  ['C#', 'Db', 'B##'],
  ['C##', 'D', 'Ebb'],
  ['D#', 'Eb', 'Fbb'],
  ['D##', 'E', 'Fb'],
  ['E#', 'F', 'Gbb'],
  ['E##', 'F#', 'Gb'],
  ['F##', 'G', 'Abb'],
  ['G#', 'Ab'],
  ['G##', 'A', 'Bbb'],
  ['Cbb', 'A#', 'Bb'],
  ['Cb', 'A##', 'B']
]

const ALL_NOTE_WITHOUT_OCTAVE = [
  'C', 'Dbb', 'B#', 'C#', 'Db', 'B##', 'C##', 'D', 'Ebb', 'D#', 'Eb', 'Fbb',
  'D##', 'E', 'Fb', 'E#', 'F', 'Gbb', 'E##', 'F#', 'Gb', 'F##', 'G', 'Abb',
  'G#', 'Ab', 'G##', 'A', 'Bbb', 'Cbb', 'A#', 'Bb', 'Cb', 'A##', 'B'
] as const

const NOTE_WITHOUT_OCT2INDEX: Record<string, number> = ENHARMONIC_NOTES_WITHOUT_OCTAVE.reduce((acc, keys, value) => {
  return {...acc, ...keys.reduce((subAcc, x) => ({...subAcc, [x]: value}), {} as Record<string, number>)}
}, {} as Record<string, number>)

export type NoteLiteral = (typeof ALL_NOTE)[number] | (typeof ALL_NOTE_WITHOUT_OCTAVE)[number]

export const Accidental = 
  z.literal('').or(z.literal('#')).or(z.literal('##')).or(z.literal('b')).or(z.literal('bb'))
export type Accidental = z.infer<typeof Accidental>

export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type Chroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export class Note {
  static equal: (note1: Note) => (note2: Note)=> boolean =
    note1 => note2 => note1.name === note2.name
  
  static allNote(withOctave = true): Note[] {
    return _.sortBy(resultSequence((withOctave ? ALL_NOTE : ALL_NOTE_WITHOUT_OCTAVE).map(Note.get)).unwrap(), note => note.id)
  }
  static between(startNoteInclusive: Note, endNoteInclusive: Note): Result<Note[], Error> {
    if (_.isNil(startNoteInclusive.octave) !== _.isNil(endNoteInclusive.octave)) {
      return Err(new Error(`Note Range should both or both not have octave! startNote: ${
        startNoteInclusive.name}, endNote: ${endNoteInclusive.name}`))
    }
    
    const range = _.isNil(startNoteInclusive.octave) ?
      [NOTE_WITHOUT_OCT2INDEX[startNoteInclusive.name], NOTE_WITHOUT_OCT2INDEX[endNoteInclusive.name]] :
      [NOTE2INDEX[startNoteInclusive.name], NOTE2INDEX[endNoteInclusive.name]]

    const target = _.isNil(startNoteInclusive.octave) ?
      ENHARMONIC_NOTES_WITHOUT_OCTAVE : ENHARMONIC_NOTES
    
    const lower = Math.min(...range)
    const higher = Math.max(...range)
    
    return Ok(_.sortBy(_.range(lower, higher + 1).flatMap(i => target[i]).map(Note.get).map(res => res.unwrap()), note => note.id))
  }

  static get(noteStr: string): Result<Note, Error>;
  static get(noteLiteral: NoteLiteral): Result<Note, Error>;
  static get(noteStr: string): Result<Note, Error> {
    const note = T.Note.get(noteStr)
    if (note.empty) {
      return Err(new Error(`Note ${noteStr} is invalid`))
    }
    return Ok(new Note(note.letter as Letter, note.acc as Accidental, note.chroma as Chroma, note.oct))
  }

  private constructor(
    private _letter: Letter ,
    private _accidental: Accidental,
    private _chroma: Chroma,
    private _octave?: number,
  ) {}
  
  get letter() { return this._letter}
  get accidental() { return this._accidental }
  get chroma() {return this._chroma}
  get octave() {return this._octave }

  get name(): string {
    return `${this.letter}${this.accidental}${this.octave ?? ''}`
  }

  /**
   * an unique identifier for each note, used for sort, calculated by octave, chroma, and accidental
   */
  get id(): number {
    const semitonesFromC0 = (this.octave ?? 0) * 12 + this.chroma
    const accidentalWeight: Record<Accidental, number> = {
      '': 0, '#': 1, 'b': 2, '##': 3, 'bb': 4
    }
    return semitonesFromC0 * 5 + accidentalWeight[this.accidental]
  }

  /**
   * return a new Note with a new octave determined by argument plus original octave.
   * If no octave exists, return this
   * @param octave 
   * @returns 
   */
  shiftOctave(octave: number): Note {
    if (_.isNil(this.octave)) return this
    return this.withOctave(this.octave + octave)
  }

  /**
   * return a new Note with given octave
   * @param octave 
   */
  withOctave(octave: number): Note {
    return new Note(this.letter, this.accidental, this.chroma, octave)
  }

  enharmonicNotes(): Note[] {
    return _.sortBy(resultSequence((_.isNil(this.octave) ? 
    ENHARMONIC_NOTES_WITHOUT_OCTAVE[NOTE_WITHOUT_OCT2INDEX[this.name]] : 
    ENHARMONIC_NOTES[NOTE2INDEX[this.name]]).map(Note.get)).unwrap(), note => note.id)
  }
}

// function getSemitoneByNote(note: string): number {
//   const semitone = NOTE2SEMITONE[note]
//   if (semitone == null) {
//     throw new Error(`note ${ note } is illegal`)
//   }
//   return semitone
// }

// function getNotesBySemitones(semitone: number): string[] {
//   const res = SEMITONE2NOTES[semitone]
//   if (res == null) {
//     throw new Error(`note semitone ${ semitone } is illegal`)
//   }
//   return res
// }

// function getEnharmonicNotes(note: string): string[] {
//   return getNotesBySemitones(getSemitoneByNote(note))
// }

// export function notesBetween(startNoteInclusive: string, endNoteInclusive: string): string[] {
//   const s1 = getSemitoneByNote(startNoteInclusive)
//   const s2 = getSemitoneByNote(endNoteInclusive)
//   const lower = R.min(s1, s2)
//   const higher = R.max(s1, s2)
//   return R.chain(getNotesBySemitones)(R.range(lower, higher))
// }

// export function getAllNotes(): string[] {
//   return Object.values(SEMITONE2NOTES).flatMap(R.identity)
// }
