import { Answer } from "@/component/answer";
import { NumberStat } from "@/component/stat";
import { Stave } from "@/component/stave/Stave";
import { FC, useCallback, useMemo, useReducer, useState } from "react";
import { useSetting } from '@/SettingProvider'
import { Box, HStack, VStack } from "@chakra-ui/react";
import _ from "lodash";
import { KeyRecognizeSettingComponent } from "@/container/keyRecognize/KeyRecognizeSetting";
import '@/util/KeyRandom'
import { MultipleAnswerGroup } from "@/component/answer/MultipleAnswerGroup";
import { keyQG } from "@/util/KeyRandom";
import { NaturalKey } from "@/musicTheory/NaturalKey";

export const KeyRecognizeContainer: FC<Record<string,never>> = () => {

  const {setting: {KeyRecognize: {choiceCount}}} = useSetting()
  const sortAnswer = false

  const quizGenerator = useMemo(() => keyQG(choiceCount, _.constant(true)), [choiceCount])
  const [seed, setSeed] = useState(() => Math.random())

  const [[answer, choices], nextSeed] = useMemo(() => quizGenerator.runState(seed),
     [seed, quizGenerator])
  
  const [correctCount, plusCorrectCount] = useReducer(s => s + 1, 0)
  const [incorrectCount, plusIncorrectCount] = useReducer(s => s + 1, 0)

  const displayedChoices = useMemo(() => 
    _(choices)
      .flatMap(i => i)
      .filter(choice => !_.some(answer, NaturalKey.equal(choice)))
      .take(choiceCount - answer.length)
      .concat(answer)
      .shuffle()
      .value(), [answer, choices, choiceCount])

  const onAnswer = useCallback((correct: boolean) => {
    correct ? plusCorrectCount() : plusIncorrectCount();
    setSeed(nextSeed)
  }, [nextSeed])

  return (
      <VStack maxWidth={960} marginLeft="auto" marginRight="auto" spacing={10} paddingTop={4} >
        
        <KeyRecognizeSettingComponent />
        <Stave staffYOffset={25} height={150} keySignature={answer[0].name} notes={[]} />
        <Box minW={360} maxW={450}>
          <MultipleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
            {(sortAnswer ? _.sortBy(displayedChoices, key => key.tonic.id) : displayedChoices).map(key => 
              <Answer key={key.name} label={key.name} correct={_.some(answer, NaturalKey.equal(key))}/>)}
          </MultipleAnswerGroup>
        </Box>
        <HStack gap={10}>
          <NumberStat label="Correct" number={correctCount} align="center" labelPosition="down" />
          <NumberStat label="Incorrect" number={incorrectCount} align="center" labelPosition="down" />
        </HStack>
      </VStack>
  )
}