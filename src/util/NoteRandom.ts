import { mkQuizGenerator, QuizGenerator } from './QuizGenerator';
import { Accidental, Note } from '@/musicTheory/Note';
import _ from 'lodash'
import { Scale } from '@/musicTheory/Scale';

export function noteQG(choiceCount: number, filter: (note: Note) => boolean, withOctave = true): QuizGenerator<Note> {
  const validNotes = Note.allNote(withOctave).filter(filter)
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
  noteBetween(startNote: Note, endNote: Note): (note: Note) => boolean {
    if (_.isNil(startNote.octave) || _.isNil(endNote.octave)) return _.constant(true)
    const validNotes = Note.between(startNote, endNote).unwrap()
    return note => _.some(validNotes, Note.equal(note))
  },

  accidentalIn(accidentals: Accidental[]): (note: Note) => boolean {
    return note => _.some(accidentals, acc => acc === note.accidental) 
  },

  /**
   * note in specific scale.
   */
  inScales(scales: Scale[]): (note: Note) => boolean {
    return note => _.some(scales.flatMap(scale => scale.allNotes), n => Note.equal(note.withoutOctave())(n.withoutOctave()))
  }
} as const
