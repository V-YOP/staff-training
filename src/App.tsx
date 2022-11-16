import { Collection } from "@tonaljs/tonal";
import R from "ramda";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { SingleAnswerGroup, Answer } from "./component/answer";
import { randomNoteList, shuffle } from "./RandomUtil";
import { Stave } from "./Stave";

export default function App() {
  const [correctCount, plusCorrectCount] = useReducer(s => s + 1, 0)
  const [incorrectCount, plusIncorrectCount] = useReducer(s => s + 1, 0)

  const [noteGroup, setNoteGroup] = useState(() => R.take(4, randomNoteList('E3', 'D7', {accidental: 'natural'})))
  const correctNote = useMemo(() => noteGroup[0], [noteGroup])
  const noteList = useMemo(() => shuffle(noteGroup), [noteGroup])

  const onAnswer = useCallback((correct: boolean) => {
    correct ? plusCorrectCount() : plusIncorrectCount();
    setNoteGroup(R.take(4, randomNoteList('E3', 'D7', {accidental: 'natural'})))
  }, [])

  return (
    <>
      <Stave keySignature="C" notes={[correctNote]}/>
      <SingleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
        {noteList.map(note => <Answer label={note.name} correct={note.name === correctNote.name}/>)}
      </SingleAnswerGroup>
      <div>
        <p>correct: {correctCount}</p>
        <p>incorrect: {incorrectCount}</p>
      </div>
    </>
  )
}
