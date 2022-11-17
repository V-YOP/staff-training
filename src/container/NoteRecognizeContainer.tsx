import { SingleAnswerGroup, Answer } from "@/component/answer";
import { Stat } from "@/component/stat";
import { Stave } from "@/component/stave/Stave";
import { useLocalStorage } from "@/custom/useLocalStorage";
import { randomNoteList, shuffle } from "@/RandomUtil";
import { NoteLiteral } from "@tonaljs/tonal";
import R from "ramda";
import { FC, useCallback, useMemo, useReducer, useState } from "react";

type NoteRecognizeContainerSetting = {
  startNote: NoteLiteral,
  endNote: NoteLiteral,
  accidental: 'all' | 'natural' | 'sharp' | 'flat'
}


export const NoteRecognizeContainer: FC<{}> = param => {
  const [{startNote, endNote, accidental}, setConfig] = useLocalStorage<NoteRecognizeContainerSetting>('NOTE_RECOGNIZE_CONFIG', {
    startNote: 'C4', endNote: 'C6', accidental: 'all'
  })

  const [correctCount, plusCorrectCount] = useReducer(s => s + 1, 0)
  const [incorrectCount, plusIncorrectCount] = useReducer(s => s + 1, 0)
  const [noteGroup, setNoteGroup] = useState(() => R.take(4, randomNoteList('E3', 'D7', {accidental: 'natural'})))
  const correctNote = useMemo(() => noteGroup[0], [noteGroup])
  const noteList = useMemo(() => shuffle(noteGroup), [noteGroup])

  const onAnswer = useCallback((correct: boolean) => {
    correct ? plusCorrectCount() : plusIncorrectCount();
    setNoteGroup(R.take(4, randomNoteList(startNote, endNote, {accidental})))
  }, [startNote, endNote, accidental])

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Stave keySignature="C" notes={[correctNote]}/>
      <SingleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
        {noteList.map((note, i) => <Answer key={note.name} label={note.name} correct={note.name === correctNote.name}/>)}
      </SingleAnswerGroup>
      <div style={{display: 'flex', gap: '2em'}}>
        <Stat label="correct" number={correctCount} align="center" labelPosition="down" />
        <Stat label="incorrect" number={incorrectCount} align="center" labelPosition="down" />
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