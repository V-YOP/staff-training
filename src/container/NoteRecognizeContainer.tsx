import { SingleAnswerGroup, Answer } from "@/component/answer";
import { Stat } from "@/component/stat";
import { Stave } from "@/component/stave/Stave";
import { useLocalStorage } from "@/custom/useLocalStorage";
import { randomItem } from "@/util/CollectionUtil";
import { NoteRandom } from "@/util/NoteRandom";
import { NoteLiteral } from "@tonaljs/tonal";
import R from "ramda";
import { FC, useCallback, useMemo, useReducer, useState } from "react";

type NoteRecognizeContainerSetting = {
  startNote: string,
  endNote: string,
  accidental: 'all' | 'natural' | 'sharp' | 'flat'
}


export const NoteRecognizeContainer: FC<{}> = param => {
  const [{startNote, endNote, accidental}, ] = useLocalStorage<NoteRecognizeContainerSetting>('NOTE_RECOGNIZE_CONFIG', {
    startNote: 'C4', endNote: 'C6', accidental: 'natural'
  })
  const noteRandom = useMemo(() => 
    new NoteRandom(startNote, endNote, note => {
      switch(accidental) {
        case 'all': return true
        case 'sharp': return note.acc === '#'
        case 'flat': return note.acc === 'b'
        case 'natural': return note.acc === ''
      }
    }), [startNote, endNote, accidental])

  const [correctCount, plusCorrectCount] = useReducer(s => s + 1, 0)
  const [incorrectCount, plusIncorrectCount] = useReducer(s => s + 1, 0)
  const [noteList, setNoteList] = useState(() => noteRandom.nextNoteList(4))
  const correctNote = useMemo(() => randomItem(noteList), [noteList])

  const onAnswer = useCallback((correct: boolean) => {
    correct ? plusCorrectCount() : plusIncorrectCount();
    setNoteList(noteRandom.nextNoteList(4))
  }, [startNote, endNote, accidental])

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Stave keySignature="C" notes={[correctNote]}/>
      <SingleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
        {noteList.map((note, i) => <Answer key={note} label={note} correct={note === correctNote}/>)}
      </SingleAnswerGroup>
      <div style={{display: 'flex', gap: '2em'}}>
        <Stat label="Correct" number={correctCount} align="center" labelPosition="down" />
        <Stat label="Incorrect" number={incorrectCount} align="center" labelPosition="down" />
      </div>
    </div>
  )
}

export const NoteRecognizeOption: FC<NoteRecognizeContainerSetting & 
  {onSettingChange: (setting: NoteRecognizeContainerSetting) => void}> = param => {
  return (
    <>

    </>
  )
}