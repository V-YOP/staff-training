import * as R from 'ramda'
import * as T from '@tonaljs/tonal'
import * as Tc from '@tonaljs/core'

const SEMITONE2NOTES: Record<number, string[]> = {
  '12': [ 'C1', 'Dbb1', 'B#1' ],
  '13': [ 'C#1', 'Db1', 'B##1' ],
  '14': [ 'C##1', 'D1', 'Ebb1' ],
  '15': [ 'D#1', 'Eb1', 'Fbb1' ],
  '16': [ 'D##1', 'E1', 'Fb1' ],
  '17': [ 'E#1', 'F1', 'Gbb1' ],
  '18': [ 'E##1', 'F#1', 'Gb1' ],
  '19': [ 'F##1', 'G1', 'Abb1' ],
  '20': [ 'G#1', 'Ab1' ],
  '21': [ 'G##1', 'A1', 'Bbb1' ],
  '22': [ 'Cbb1', 'A#1', 'Bb1' ],
  '23': [ 'Cb1', 'A##1', 'B1' ],
  '24': [ 'C2', 'Dbb2', 'B#2' ],
  '25': [ 'C#2', 'Db2', 'B##2' ],
  '26': [ 'C##2', 'D2', 'Ebb2' ],
  '27': [ 'D#2', 'Eb2', 'Fbb2' ],
  '28': [ 'D##2', 'E2', 'Fb2' ],
  '29': [ 'E#2', 'F2', 'Gbb2' ],
  '30': [ 'E##2', 'F#2', 'Gb2' ],
  '31': [ 'F##2', 'G2', 'Abb2' ],
  '32': [ 'G#2', 'Ab2' ],
  '33': [ 'G##2', 'A2', 'Bbb2' ],
  '34': [ 'Cbb2', 'A#2', 'Bb2' ],
  '35': [ 'Cb2', 'A##2', 'B2' ],
  '36': [ 'C3', 'Dbb3', 'B#3' ],
  '37': [ 'C#3', 'Db3', 'B##3' ],
  '38': [ 'C##3', 'D3', 'Ebb3' ],
  '39': [ 'D#3', 'Eb3', 'Fbb3' ],
  '40': [ 'D##3', 'E3', 'Fb3' ],
  '41': [ 'E#3', 'F3', 'Gbb3' ],
  '42': [ 'E##3', 'F#3', 'Gb3' ],
  '43': [ 'F##3', 'G3', 'Abb3' ],
  '44': [ 'G#3', 'Ab3' ],
  '45': [ 'G##3', 'A3', 'Bbb3' ],
  '46': [ 'Cbb3', 'A#3', 'Bb3' ],
  '47': [ 'Cb3', 'A##3', 'B3' ],
  '48': [ 'C4', 'Dbb4', 'B#4' ],
  '49': [ 'C#4', 'Db4', 'B##4' ],
  '50': [ 'C##4', 'D4', 'Ebb4' ],
  '51': [ 'D#4', 'Eb4', 'Fbb4' ],
  '52': [ 'D##4', 'E4', 'Fb4' ],
  '53': [ 'E#4', 'F4', 'Gbb4' ],
  '54': [ 'E##4', 'F#4', 'Gb4' ],
  '55': [ 'F##4', 'G4', 'Abb4' ],
  '56': [ 'G#4', 'Ab4' ],
  '57': [ 'G##4', 'A4', 'Bbb4' ],
  '58': [ 'Cbb4', 'A#4', 'Bb4' ],
  '59': [ 'Cb4', 'A##4', 'B4' ],
  '60': [ 'C5', 'Dbb5', 'B#5' ],
  '61': [ 'C#5', 'Db5', 'B##5' ],
  '62': [ 'C##5', 'D5', 'Ebb5' ],
  '63': [ 'D#5', 'Eb5', 'Fbb5' ],
  '64': [ 'D##5', 'E5', 'Fb5' ],
  '65': [ 'E#5', 'F5', 'Gbb5' ],
  '66': [ 'E##5', 'F#5', 'Gb5' ],
  '67': [ 'F##5', 'G5', 'Abb5' ],
  '68': [ 'G#5', 'Ab5' ],
  '69': [ 'G##5', 'A5', 'Bbb5' ],
  '70': [ 'Cbb5', 'A#5', 'Bb5' ],
  '71': [ 'Cb5', 'A##5', 'B5' ],
  '72': [ 'C6', 'Dbb6', 'B#6' ],
  '73': [ 'C#6', 'Db6', 'B##6' ],
  '74': [ 'C##6', 'D6', 'Ebb6' ],
  '75': [ 'D#6', 'Eb6', 'Fbb6' ],
  '76': [ 'D##6', 'E6', 'Fb6' ],
  '77': [ 'E#6', 'F6', 'Gbb6' ],
  '78': [ 'E##6', 'F#6', 'Gb6' ],
  '79': [ 'F##6', 'G6', 'Abb6' ],
  '80': [ 'G#6', 'Ab6' ],
  '81': [ 'G##6', 'A6', 'Bbb6' ],
  '82': [ 'Cbb6', 'A#6', 'Bb6' ],
  '83': [ 'Cb6', 'A##6', 'B6' ],
  '84': [ 'C7', 'Dbb7', 'B#7' ],
  '85': [ 'C#7', 'Db7', 'B##7' ],
  '86': [ 'C##7', 'D7', 'Ebb7' ],
  '87': [ 'D#7', 'Eb7', 'Fbb7' ],
  '88': [ 'D##7', 'E7', 'Fb7' ],
  '89': [ 'E#7', 'F7', 'Gbb7' ],
  '90': [ 'E##7', 'F#7', 'Gb7' ],
  '91': [ 'F##7', 'G7', 'Abb7' ],
  '92': [ 'G#7', 'Ab7' ],
  '93': [ 'G##7', 'A7', 'Bbb7' ],
  '94': [ 'Cbb7', 'A#7', 'Bb7' ],
  '95': [ 'Cb7', 'A##7', 'B7' ]
}

const NOTE2SEMITONE: Record<string, number> = R.reduce((acc: Record<string, number>, x: [string, string[]]) => {
  const [value, keys] = x
  return {...acc, ...keys.reduce((subAcc, x) => ({...subAcc, [x]: +value}), {} as Record<string, number>)}
}, {}, Object.entries(SEMITONE2NOTES))

// const CHROMA2NOTE_WITHOUT_OCT = {
// '0': [ 'C', 'Dbb', 'B#' ],
// '1': [ 'C#', 'Db', 'B##' ],
// '2': [ 'C##', 'D', 'Ebb' ],
// '3': [ 'D#', 'Eb', 'Fbb' ],
// '4': [ 'D##', 'E', 'Fb' ],
// '5': [ 'E#', 'F', 'Gbb' ],
// '6': [ 'E##', 'F#', 'Gb' ],
// '7': [ 'F##', 'G', 'Abb' ],
// '8': [ 'G#', 'Ab' ],
// '9': [ 'G##', 'A', 'Bbb' ],
// '10': [ 'Cbb', 'A#', 'Bb' ],
// '11': [ 'Cb', 'A##', 'B' ]
// }

// const NOTE_WITHOUT_OCT2CHROMA: Record<string, number> = R.reduce((acc: Record<string, number>, x: [string, string[]]) => {
//   const [value, keys] = x
//   return {...acc, ...keys.reduce((subAcc, x) => ({...subAcc, [x]: +value}), {} as Record<string, number>)}
// }, {}, Object.entries(CHROMA2NOTE_WITHOUT_OCT))

function getSemitoneByNote(note: string): number {
  const semitone = NOTE2SEMITONE[note]
  if (semitone == null) {
    throw new Error(`note ${note} is illegal`)
  }
  return semitone
}

function getNotesBySemitones(semitone: number): string[] {
  const res = SEMITONE2NOTES[semitone]
  if (res == null) {
    throw new Error(`note semitone ${semitone} is illegal`)
  }
  return res
}

function getEnharmonicNotes(note: string): string[] {
  return getNotesBySemitones(getSemitoneByNote(note))
}

function notesBetween(startNoteInclusive: string, endNoteInclusive: string): string[] {
  const s1 = getSemitoneByNote(startNoteInclusive)
  const s2 = getSemitoneByNote(endNoteInclusive)
  const lower = R.min(s1, s2)
  const higher = R.max(s1, s2)
  return R.chain(getNotesBySemitones)(R.range(lower, higher))
}

/**
 * shuffle in-place
 * @param arr 
 */
function shuffle<T>(arr: T[]): void {
  let n = arr.length,
  tmp,
  random
  while(n != 0){
    random = Math.floor(Math.random() * n)
    n-- // n减一
    // 交换
    tmp = arr[n]
    arr[n] = arr[random]
    arr[random] = tmp
  }
}

type Accidental = '#' | 'b' | '' | 'bb' | 'x'

class NoteRandom {
  constructor(
    private startNoteInclusive: string,
    private endNoteInclusive: string,
    private validAccidental: Accidental[] = ['', '#', 'x']
  ) {}
  nextNote(): string {
    return this.nextNoteList(1)[0]
  }
  nextNoteList(len: number): string[] {
    const noteList = notesBetween(this.startNoteInclusive, this.endNoteInclusive)
      .filter(note => R.any(R.equals(T.Note.get(note).acc), this.validAccidental))
    if (noteList.length < len) {
      throw new Error(`There are only ${noteList.length} valid notes but acquired ${len} notes.`)
    }
    shuffle(noteList)
    return R.take(len, noteList)
  }
}

const noteRandom = new NoteRandom('C4', 'C6', [''])