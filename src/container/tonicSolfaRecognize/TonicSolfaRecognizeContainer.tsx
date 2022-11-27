import { Stave } from "@/component/stave/Stave";
import { noteQG, prefabNotePredicate } from "@/util/NoteRandom";
import { FC, useCallback, useMemo, useState } from "react";
import { Note } from "@/musicTheory/Note";
import { Select, VStack } from "@chakra-ui/react";
import _ from "lodash";
import { Scale } from "@/musicTheory/Scale";
import { QuizGenerator } from "@/util/QuizGenerator";






// console.log(
//   _(Note.allNote(false).flatMap(note => allModes.map(mode => Scale.get(note, mode))))
//     .filter(res => res.isOk())
//     .map(res => res.unwrap())
//     .filter(res => res.getRelateNaturalKey().isOk())
//     .map(s => [s.tonic.name, s.mode])
//     .groupBy(s => s[1]).mapValues(s => s.map(g => g[0]).flat()).value())
const mode2ValidTonics = {
  "chromatic":["C","C#","Db","D","Eb","E","F","F#","Gb","G","Ab","A","Bb","B","Cb"],
  "major":["C","C#","Db","D","Eb","E","F","F#","Gb","G","Ab","A","Bb","B","Cb"],
  "minor":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"],
  "ionian":["C","C#","Db","D","Eb","E","F","F#","Gb","G","Ab","A","Bb","B","Cb"],
  "aeolian":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"],
  "harmonic minor":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"],
  "melodic minor":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"],
  "major pentatonic":["C","C#","Db","D","Eb","E","F","F#","Gb","G","Ab","A","Bb","B","Cb"],
  "minor pentatonic":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"],
  "dorian":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"],
  "phrygian":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"],
  "lydian":["C","C#","Db","D","Eb","E","F","F#","Gb","G","Ab","A","Bb","B","Cb"],
  "mixolydian":["C","C#","Db","D","Eb","E","F","F#","Gb","G","Ab","A","Bb","B","Cb"],
  "locrian":["C","C#","D","D#","Eb","E","F","F#","G","G#","Ab","A","A#","Bb","B"]
} as const



export const TEST: FC<Record<string,never>> = () => {

  const withOctave = false

  const quizGenerator = useMemo<QuizGenerator<Note>>(() => {
    return noteQG(4, _.constant(true), true)
  }, [])

  const [seed, setSeed] = useState(() => Math.random())
  const [[answer, choices], nextSeed] = useMemo(() => quizGenerator.runState(seed), [seed, quizGenerator])

  const [mode, setMode] = useState<keyof typeof mode2ValidTonics>('major')
  const [tonic, setTonic] = useState<string>('C')
  const [note, setNote] = useState(Note.get(tonic).unwrap())
  
  const modeChange = useCallback<(mode: keyof typeof mode2ValidTonics) => void>(mode => {
    setMode(mode)
    if (!mode2ValidTonics[mode].some(t => t === tonic)) {
      setTonic('C')
      setNote(Note.get('C').unwrap())
    }
  }, [tonic]);

  const tonicChange = useCallback<(mode: string) => void>(tonic => {
    setTonic(tonic)
    setNote(Note.get(tonic).unwrap())
  }, []);

  const scale = useMemo(() => {
    return Scale.get(Note.get(tonic).unwrap(), mode).unwrap()
  }, [tonic, mode])
  
  // if without octave, use a random octave number in [3, 5]
  const displayedAnswer = useMemo(() => {
    if (withOctave) return answer;
    return answer.withOctave(3 + Math.floor(Math.random() * 3))
  }, [withOctave, answer])
  

  return (
    <VStack spacing={10} paddingTop={12} >
      <Stave keySignature={scale.getRelateNaturalKey().unwrap().relateMajorKey().name} notes={[note]} />
      <VStack>
        <Select value={mode} onChange={({target: {value}}) => modeChange(value as keyof typeof mode2ValidTonics)}>
          {Object.keys(mode2ValidTonics).map(mode => <option key={mode} value={mode}>{mode}</option>)}
        </Select>
        <Select value={tonic}  onChange={({target: {value}}) => tonicChange(value)}>
          {mode2ValidTonics[mode].map(tonic => <option key={tonic} value={tonic}>{tonic}</option>)}
        </Select>
        <Select value={note.name}  onChange={({target: {value}}) => setNote(Note.get(value).unwrap())}>
          {Note.allNote(withOctave)
          .filter(prefabNotePredicate.inScales([scale])).map(note => <option key={note.id} value={note.name}>{note.name}</option>)}
        </Select>
      </VStack>
    </VStack>
  )
}
