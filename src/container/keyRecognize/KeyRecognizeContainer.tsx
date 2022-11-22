import { Answer } from "@/component/answer";
import { NumberStat } from "@/component/stat";
import { Stave } from "@/component/stave/Stave";
import { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useSetting } from '@/SettingProvider'
import { HStack, VStack } from "@chakra-ui/react";
import _ from "lodash";
import { KeyRecognizeSettingComponent } from "@/container/keyRecognize/KeyRecognizeSetting";
import '@/util/KeyRandom'
import { MultipleAnswerGroup } from "@/component/answer/MultipleAnswerGroup";
import { keySAQG } from "@/util/KeyRandom";
import { Key } from "@/musicTheory/Key";
export const KeyRecognizeContainer: FC<Record<string,never>> = () => {
  const {setting: {KeyRecognize: {choiceCount}}} = useSetting()
  
  const sortAnswer = true

  const keyRecognizeQuiz = useMemo(() => keySAQG(), [])
  const [correctCount, plusCorrectCount] = useReducer(s => s + 1, 0)
  const [incorrectCount, plusIncorrectCount] = useReducer(s => s + 1, 0)

  const [[answer, choices], setQuiz] = useState(() => keyRecognizeQuiz.nextQuiz(choiceCount))

  const answerList : [ Key<'Major'>] | [ Key<'Major'>, Key<'Minor'>] = useMemo(() => answer instanceof Key ? [answer] : answer, [answer])
  const displayedChoices = useMemo(() => 
    _(choices)
      .flatMap(i => i)
      .filter(choice => !_.some(answerList, Key.equal(choice)))
      .take(choiceCount - answerList.length)
      .concat(answerList)
      .shuffle()
      .value(), [answerList, choices, choiceCount])

  useEffect(() => {
    setQuiz(keyRecognizeQuiz.nextQuiz(choiceCount))
  }, [choiceCount, keyRecognizeQuiz])

  const onAnswer = useCallback((correct: boolean) => {
    correct ? plusCorrectCount() : plusIncorrectCount();
    setQuiz(keyRecognizeQuiz.nextQuiz(choiceCount))
  }, [choiceCount, keyRecognizeQuiz])

  return (
    <HStack maxWidth={960} marginLeft="auto" marginRight="auto" justifyContent="space-between" alignItems="flex-start" gap={10}>
      <VStack flexBasis='360px' spacing={10} paddingTop={4} >
        <Stave staffYOffset={25} height={150} keySignature={answerList[0].name} notes={[]} />
        <MultipleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
          {(sortAnswer ? _.sortBy(displayedChoices, key => key.tonic.id) : displayedChoices).map(key => 
            <Answer key={key.name} label={key.name} correct={_.some(answerList, Key.equal(key))}/>)}
        </MultipleAnswerGroup>
        <HStack gap={10}>
          <NumberStat label="Correct" number={correctCount} align="center" labelPosition="down" />
          <NumberStat label="Incorrect" number={incorrectCount} align="center" labelPosition="down" />
        </HStack>
      </VStack>
      <VStack padding={4}>
        <KeyRecognizeSettingComponent />
      </VStack>
    </HStack>
  )
}