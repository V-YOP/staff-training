import { Button, HStack, useToast, VStack } from "@chakra-ui/react";
import React, { FC, useCallback, useState } from "react";
import { AnswerParam, Answer, AnswerContext } from "./Answer";
import _ from 'lodash'


const SingleAnswerGroupContainer: FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <HStack flexWrap='wrap' width='100%' justifyContent={'center'} gap={2} spacing={0} padding={[1, 2]}>
      {children}
    </HStack>
  )
}

interface MultipleAnswerGroupParam {
  children: React.ReactElement<AnswerParam, typeof Answer>[]
  onCorrect: () => void
  onIncorrect: () => void
}

export const MultipleAnswerGroup: FC<MultipleAnswerGroupParam> = ({
  children,
  onCorrect,
  onIncorrect,
}) => {
  const toast = useToast()

  const propss = children.map(child => child.props)
  // eslint-disable-next-line react/prop-types
  const correctAnswerCount = propss.filter(props => props.correct).length
  
  if (correctAnswerCount === 0) {
    throw new Error('There\'s no correct answer!')
  } 

  const [answerSelected, setAnswerSelected] = useState<Record<string, boolean>>({})

  const onAnswerClick = useCallback((label: string) => {
    setAnswerSelected(answerSelected => {
      if (answerSelected[label]) return {...answerSelected, [label]: false}
      return {...answerSelected, [label]: true}
    })
  }, [])



  const onSubmit = useCallback(() => {
    // if no answer, argued
    if (Object.values(answerSelected).every(b => !b)) {
      toast({
        description: '你未选择任何选项！',
        position: 'top',
        status: 'error',
        duration: 2000,
      })
      return
    }

    // if any incorrect answer is selected or any correct answer is not selected
    if (propss.some(({correct, label}) => (!correct && answerSelected[label]) || (correct && !answerSelected[label]))) {
      onIncorrect()
    } else {
      onCorrect()
    }
    setAnswerSelected({})
  }, [answerSelected, onCorrect, onIncorrect, propss, toast])

  return (
    <AnswerContext.Provider value={{onAnswerClick, selected: answerSelected}}>
      <VStack w="100%">
        <SingleAnswerGroupContainer>
          {children}
        </SingleAnswerGroupContainer>
        <Button w="100%" onClick={onSubmit}>作答</Button>
      </VStack>
    </AnswerContext.Provider>
  )
}

