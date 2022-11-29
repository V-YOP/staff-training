import { mkQuizGenerator, QuizGenerator } from './QuizGenerator';
import { Accidental, Note } from '@/musicTheory/Note';
import _ from 'lodash'
import { Scale } from '@/musicTheory/Scale';

export function noteQG(choiceCount: number, filter: (note: Note[]) => Note[], withOctave = true): QuizGenerator<Note> {
  const validNotes = filter(Note.allNote(withOctave))
  return mkQuizGenerator(choiceCount, validNotes)
}

export const prefabNotePredicate = {
  /**
   * check if note is between startNote and endNote, enharmonic note inclusive
   * 
   * if startNote or endNote doesn't have octave, always return true
   * @param startNote 
   * @param endNote 
   * @returns 
   */
  noteBetween(startNote: Note, endNote: Note): (notes: Note[]) => Note[] {
    if (_.isNil(startNote.octave) || _.isNil(endNote.octave)) return _.identity
    const validNotes = Note.between(startNote, endNote).unwrap()
    return notes => notes.filter(note => _.some(validNotes, Note.equal(note)))
  },

  accidentalIn(accidentals: Accidental[]): (notes: Note[]) => Note[] {
    return notes => notes.filter(note => _.some(accidentals, acc => acc === note.accidental) )
  },
  /**
   * note in specific scale.
   */
  inScales(scales: Scale[]): (notes: Note[]) => Note[] {
    return notes => notes.filter(note => _.some(scales.flatMap(scale => scale.allNotes), n => Note.equal(note.withoutOctave())(n.withoutOctave())))
  },

  uniqBy(fn: (note: Note) => string | number | symbol): (notes: Note[]) => Note[] {
    return notes => _.uniqBy(notes, fn)
  }
} as const
