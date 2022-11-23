import { Note } from "@/musicTheory/Note";

export class Scale {
  constructor(
    private _tonic: Note,
    private _name: string,
    private _scale: Note[],
  ) {}
  
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