import { SingleAnswerGroup, Answer } from "@/component/answer";
import { NumberStat } from "@/component/stat";
import { Stave } from "@/component/stave/Stave";
import { andP } from "@/util/FunctionUtil";
import { noteSAQG, prefabNotePredicate } from "@/util/NoteRandom";
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useSetting } from '@/SettingProvider'
import { Note } from "@/musicTheory/Note";
import { HStack, VStack } from "@chakra-ui/react";
import _ from "lodash";
import { NoteRecognizeSettingComponent } from "@/container/noteRecognize/NoteRecognizeSetting";

export const NoteRecognizeContainer: FC<Record<string,never>> = () => {
  const {setting: {NoteRecognize: {startNoteInclusive,endNoteInclusive,choiceCount,accidentals,withOctave,sortAnswer}}} = useSetting()
  const noteRecognizeQuiz = useMemo(() => {
    return noteSAQG(andP(
        withOctave ? 
          prefabNotePredicate.noteBetween(
            Note.get(startNoteInclusive) as Note,
            Note.get(endNoteInclusive) as Note) : _.constant(true),
        prefabNotePredicate.accidentalIn(accidentals)), withOctave)
  }, [accidentals, startNoteInclusive, endNoteInclusive, withOctave])
  
  const [correctCount, plusCorrectCount] = useReducer(s => s + 1, 0)
  const [incorrectCount, plusIncorrectCount] = useReducer(s => s + 1, 0)
  const [[answer, choices], setQuiz] = useState(() => noteRecognizeQuiz.nextQuiz(choiceCount))
  useEffect(() => {
    setQuiz(noteRecognizeQuiz.nextQuiz(choiceCount))
  }, [choiceCount, noteRecognizeQuiz])

  const onAnswer = useCallback((correct: boolean) => {
    correct ? plusCorrectCount() : plusIncorrectCount();
    setQuiz(noteRecognizeQuiz.nextQuiz(choiceCount))
  }, [choiceCount, noteRecognizeQuiz])

  const displayedAnswer = useMemo(() => {
    if (withOctave) return answer;
    return answer.withOctave(3 + Math.floor(Math.random() * 3))
  }, [withOctave, answer])

  return (
    <HStack maxWidth={960} marginLeft="auto" marginRight="auto" justifyContent="space-between" alignItems="flex-start" gap={10}>
      <VStack flexBasis='360px' spacing={10} paddingTop={4} >
        <Stave keySignature="C" notes={[displayedAnswer]} />
        <SingleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
          {(sortAnswer ? _.sortBy(choices, note => note.id) : choices).map((note) => 
            <Answer key={note.name} label={note.name} correct={Note.equal(note)(answer)}/>)}
        </SingleAnswerGroup>
        <HStack gap={10}>
          <NumberStat label="Correct" number={correctCount} align="center" labelPosition="down" />
          <NumberStat label="Incorrect" number={incorrectCount} align="center" labelPosition="down" />
        </HStack>
      </VStack>
      <VStack padding={4}>
        <NoteRecognizeSettingComponent />
      </VStack>
    </HStack>
  )
}