import { z } from "zod";
import * as T from '@tonaljs/tonal'
import type { Equal, Expect } from "@/util/TypeUtil";
import { Err, None, Ok, Option, Result, Some } from "@/monads";
import { resultSequence } from "@/monads/result";

const Letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
type Letter = typeof Letters[number]
const Accidentals = ['', '#', 'b', '##', 'bb'] as const
type Accidental = typeof Accidentals[number]
const Octaves = [1, 2, 3, 4, 5, 6, 7, 8] as const
type Octave = typeof Octaves[number]

type NoteLiteral = `${Letter}${Accidental}${Octave | ''}`

const EnharmonicNotes = [
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
] as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CheckAllNoteCovered = Expect<Equal<`${typeof EnharmonicNotes[number][number]}`, `${Letter}${Accidental}`>>

class Note {
  static allNote(withOctave = false): Note[] {
    const res = 
      Letters.flatMap(letter => 
        Accidentals.flatMap(accidental => 
          Octaves.map(octave => 
            Note.get(`${letter}${accidental}${withOctave ? octave : ''}`))))
    return resultSequence(res).match({
      ok(val) {
        return val
      },
      err() {
        throw new Error('Impossible')
      },
    })
  }

  static get(uniqId: number): Result<Note>;
  static get(noteLiteral: NoteLiteral): Result<Note>
  static get(noteLiteral: string): Result<Note>
  static get(noteLiteral: string | number): Result<Note> {
    if (typeof noteLiteral === 'number') {
      const id = '' + noteLiteral
      if (id.length !== 2 && id.length !== 3) {
        return Err(new Error('`Invalid Note id: ${id}`'))
      }
      try {
        const octave = id.length === 3 ? Some(+id[2]) : None
        if (Octaves.indexOf(octave.unwrapOr(4)) < 0) throw '';
        const letter = Letters[+id[0]]
        const accidental = Accidentals[+id[1]]
        return Ok(new Note(letter,accidental,octave as Option<Octave>))
      } catch (e) {
        // must be array index out of range
        return Err(new Error('`Invalid Note id: ${id}`'))
      }
    }

    const note = T.Note.get(noteLiteral)
    if (
      note.empty ||
      (note.oct && Octaves.indexOf(note.oct as Octave) < 0) ||
      Accidentals.indexOf(note.acc as Accidental) < 0) {
      return Err(new Error(`Invalid Note Literal: ${noteLiteral}`))
    }
    return Ok(new Note(note.letter as Letter, note.acc as Accidental, Some(note.oct as Octave)))
  }
  
  private constructor(
    private _letter: Letter,
    private _accidental: Accidental,
    private _octave: Option<Octave> = Some(4)
  ) {}

  get name(): NoteLiteral {
    return `${this._letter}${this._accidental}${this._octave.map(i => i + '').unwrapOr('')}` as NoteLiteral
  }

  get octave() {
    return this._octave
  }

  get chroma(): number {
    const letter2Chroma: Record<Letter, number> = {
      C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11
    }
    const accidental2ChromaOffset: Record<Accidental, number> = {
      '': 0, '#': 1, '##': 2, 'b': -1, 'bb': -2
    }
    return (letter2Chroma[this._letter] + accidental2ChromaOffset[this._accidental] + 12) % 12
  }

  get uniqId(): number {
    const letterSeq = [...Letters]
    const accidentalSeq = [...Accidentals]
    return this.octave.unwrapOr(0 as Octave) * 100 + letterSeq.indexOf(this._letter) * 10 + accidentalSeq.indexOf(this._accidental) 
  }

  withoutOctave(): Note {
    return new Note(this._letter, this._accidental, None)
  }
  withOctave(octave: number): Result<Note> {
    if (Octaves.indexOf(octave as Octave) < 0) {
      return Err(new Error(`Invalid Octave '${octave}', octave range: [1, 8]`))
    }
    return Ok(new Note(this._letter,this._accidental, Some()))
  }

  enharmonicNotes(): Note[] {
    const name = this.withoutOctave().name
    const res = EnharmonicNotes.find(notes => (notes as unknown as NoteLiteral[]).indexOf(name) > 0)
    if (!res) {
      throw new Error('Impossible')
    }
    return resultSequence(res.map(Note.get)).unwrapOrElse(() => {
      throw new Error('Impossible')
    })
  }
}