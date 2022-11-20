import { mkSAQG, SAQG } from './QuizGenerator';
import { Accidental, Note } from '@/musicTheory/Note';
import _ from 'lodash'

export function noteSAQG(filter: (note: Note) => boolean, withOctave = true): SAQG<Note> {
  const validNotes = Note.allNote(withOctave).filter(filter)
  console.log(Note.allNote(false))
  return mkSAQG(validNotes)
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
    const validNotes = Note.between(startNote, endNote)
    if (validNotes instanceof Error) throw validNotes;
    return note => _.some(validNotes, Note.equal(note))
  },
  /**
   * check if note accidental in a given accidental set
   * @param accidentals accidental set, empty string means no accidental
   * @returns 
   */
  accidentalIn(accidentals: Accidental[]): (note: Note) => boolean {
    return note => _.some(accidentals, acc => acc === note.accidental) 
  },
  // TODO note in specific key
} as const
