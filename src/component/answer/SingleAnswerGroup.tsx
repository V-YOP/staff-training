import { HStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { AnswerParam, Answer, AnswerContext } from "./Answer";

const SingleAnswerGroupContainer: FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <HStack flexWrap='wrap' width='100%' justifyContent={'center'} gap={2} spacing={0} padding={[1, 2]}>
      {children}
    </HStack>
  )
}

interface SingleAnswerGroupParam {
  children: React.ReactElement<AnswerParam, typeof Answer>[]
  onCorrect: () => void
  onIncorrect: () => void
}

export const SingleAnswerGroup: FC<SingleAnswerGroupParam> = ({
  children,
  onCorrect,
  onIncorrect,
}) => {
  const propss = children.map(child => child.props)
  const correctAnswerCount = propss.filter(props => props.correct).length
  
  if (correctAnswerCount === 0) {
    throw new Error('There\'s no correct answer!')
  } else if (correctAnswerCount !== 1) {
    throw new Error('There\'s more than one correct answer!')
  }
  return (
    <AnswerContext.Provider value={[onCorrect, onIncorrect]}>
      <SingleAnswerGroupContainer>
        {children}
      </SingleAnswerGroupContainer>
    </AnswerContext.Provider>
  )
}

