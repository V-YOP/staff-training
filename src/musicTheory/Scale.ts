import { Err, Ok, Result } from "@/monads";
import { resultSequence } from "@/monads/result";
import { NaturalKey } from "@/musicTheory/NaturalKey";
import { Note } from "@/musicTheory/Note";
import { Setting } from "@/SettingProvider";
import * as T from '@tonaljs/tonal'
import _ from "lodash";

// ALL is valid Tonal mode literal
export const Modes = [
  'chromatic',  // 大调性
  'major',
  'minor',
  'ionian',  // 大调性
  'aeolian', // 小调性
  'harmonic minor', // 小调
  'melodic minor', // 小调
  'major pentatonic', // 大调
  'minor pentatonic', // 小调
  'dorian',  // 小调性
  'phrygian', // 小调性
  'lydian', // 大调性
  'mixolydian', // 大调性
  'locrian', // 小调性
] as const

export type Mode = (typeof Modes)[number]

type Color = 'Major' | 'Minor'

const modeColor: Record<Mode, Color> = {
  chromatic: 'Major',
  major: 'Major',
  ionian: 'Major',
  aeolian: 'Minor',
  minor: 'Minor',
  "harmonic minor": 'Minor',
  "melodic minor": 'Minor',
  "major pentatonic": 'Major',
  "minor pentatonic": 'Minor',
  dorian: 'Minor',
  phrygian: 'Minor',
  lydian: 'Major',
  mixolydian: 'Major',
  locrian: 'Minor',
}

export class Scale {
  static allMode(): Mode[] {
    return [...Modes]
  }

  static get(tonic: Note, mode: string): Result<Scale> {
    if (mode === 'chromatic') {
      const asc = _.sortBy(Note.allNote(false).filter(note => note.accidental.length <= 1), note => note.id);
      const desc = [...asc].reverse()
      return Ok(new Scale(Note.get('C').unwrap(), mode, 'Major', asc, desc))
    }

    const res = T.Scale.get(`${tonic.name} ${mode}`)

    if (!Modes.some(mode => mode === res.type)) {
      return Err(new Error(`Mode '${res.type}' invalid! valid Mode: ${Modes.join(', ')}`))
    }

    const color = modeColor[res.type as Mode] 
    return resultSequence(res.notes.map(Note.get)).andThen(ascScale => 
      (mode === 'melodic minor' ?  // 旋律小调下行还原
        NaturalKey.get(tonic, 'Minor').map(k => k.scale().reverse()) :
        Ok([...ascScale].reverse())).andThen(descScale => 
          Ok(new Scale(tonic, mode as Mode, color, ascScale, descScale))))
  }

  private constructor(
    private _tonic: Note,
    private _mode: Mode,
    private _color: 'Major' | 'Minor',
    private _ascScale: Note[],
    private _descScale: Note[],
  ) {}
  
  getRelateNaturalKey(): Result<NaturalKey> {
    return NaturalKey.get(this._tonic, this._color)
  }

  get ascScale(): Note[] {
    return this._ascScale
  }
  get descScale(): Note[] {
    // TODO harmonic minor and melodic minor
    return this._descScale
  }
  get allNotes(): Note[] {
    // TODO harmonic minor and melodic minor
    return _.uniqBy([...this.ascScale, ...this.descScale], note => note.id)
  }

  get tonic(): Note {
    return this._tonic
  }

  get mode(): Mode {
    return this._mode
  }

  get name() {
    return `${this._tonic.name} ${this._mode}`
  }

  getNoteDisplayName(note: Note, type: Setting['NoteRecognize']['answerDisplayType']): Result<string> {
    // get The interval from tonic to the target note and map it to display name

    /**
     * 上行do、di、rei、ri、mi、fa、fi、so、si、la、li、xi、do。
     * 下行do、xi、xe、la、le、so、se、fa、mi、me、rei、re、do。
     */
    const interval = T.Interval.distance(this.tonic.withoutOctave().name, note.withoutOctave().name)
    console.log(interval)
    const interval2DisplayName: Record<string, [string, string]> = {
      '1P': ['1', 'Do'],
      '2M': ['2', 'Re'],
      '3M': ['3', 'Mi'],
      '4P': ['4', 'Fa'],
      '5P': ['5', 'Sol'],
      '6M': ['6', 'La'],
      '7M': ['7', 'Ti'],
      '1A': ['#1', 'Di'],
      '2m': ['b2', 'Ra'],
      '2A': ['#2', 'Ri'],
      '3m': ['b3', 'Me'],
      '4A': ['#4', 'Fi'],
      '5d': ['b5', 'Se'],
      '5A': ['#5', 'Si'],
      '6m': ['b6', 'Le'],
      '6A': ['#6', 'Li'],
      '7m': ['b7', 'Te'],

      '8d': ['b1', 'De'],
      '3A': ['#3', 'Ma'],
      '4d': ['b4', 'Fe'],
      '7A': ['#7', 'To']
    }
    switch (type) {
      case 'C': return Ok(note.name)
      case '1': return Ok(interval2DisplayName[interval][0])
      case 'Do': return Ok(interval2DisplayName[interval][1])
    }
  }
}