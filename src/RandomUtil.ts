import * as Tc from '@tonaljs/core'
import * as T from '@tonaljs/tonal'
import * as R from 'ramda'

function getNote(noteLiteral: T.NoteLiteral): Tc.Note {
    const res = T.Note.get(noteLiteral)
    if (!res.empty) return res
    throw new Error(`Note literal ${noteLiteral} is invalid!`)
}

function randomItem<T>(arr: T[]): T {
    if (!arr || arr.length === 0) throw new Error('array can\'t be empty')
    return arr[Math.floor(Math.random() * arr.length)]
}

type RandomNoteOption = Partial<{
    accidental: 'all' | 'natural' | 'sharp' | 'flat'
}>
export function randomNoteList(
    startNoteInclusive: T.NoteLiteral,
    endNoteInclusive: T.NoteLiteral, 
    randomNoteOption?: RandomNoteOption): Tc.Note[] {
    const {
        accidental = 'all'
    } = randomNoteOption ?? {}
    const startNote = getNote(startNoteInclusive)
    const endNote = getNote(endNoteInclusive)
    const allInboundNotes = [...new Set(T.Range.chromatic([startNote.name, endNote.name])
        .concat(T.Range.chromatic([startNote.name, endNote.name], {sharps: true}))).values()]
    return T.Collection.shuffle(allInboundNotes.map(note => T.Note.get(note) as Tc.Note).filter(note => {
        switch(accidental) {
            case 'all': return true
            case 'natural': return note.acc === ''
            case 'sharp': return note.acc === '#'
            case 'flat': return note.acc === 'b'
        }
    })) as Tc.Note[]
}

export function shuffle<T>(arr: T[]): T[] {
    return T.Collection.shuffle([...arr])
}