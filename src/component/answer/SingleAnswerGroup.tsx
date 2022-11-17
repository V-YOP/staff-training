import { FC } from "react";
import styled from "styled-components";
import { AnswerParam, Answer } from "./Answer";

const SingleAnswerGroupContainer = styled.div`
  display: flex;
  gap: 1em;
  padding: 0.5em 1em;
  justify-content: flex-start;
`

const AnswerButton = styled.button`
  font-size: 1.11em;
  padding: 0.5em 0;
  text-align: center;
  width: 5em;
  border: 0
`

interface SingleAnswerGroupParam {
  children: React.ReactElement<AnswerParam, typeof Answer>[]
  onCorrect: () => void
  onIncorrect: () => void
  style?: React.CSSProperties
}

export const SingleAnswerGroup: FC<SingleAnswerGroupParam> = ({
  children,
  onCorrect,
  onIncorrect,
  style,
}) => {
  const propss = children.map(child => child.props)
  const correctAnswerCount = propss.filter(props => props.correct).length
  if (correctAnswerCount === 0) {
    throw new Error('There\'s no correct answer!')
  } else if (correctAnswerCount !== 1) {
    throw new Error('There\'s more than one correct answer!')
  }
  return (
    <>
      <SingleAnswerGroupContainer style={style}>
        {propss.map(({ correct = false, label, style }) => (
          <AnswerButton
            key={label}
            style={style}
            onClick={() => {
              if (correct) onCorrect()
              else onIncorrect()
            }}>{label}</AnswerButton>
        ))}
      </SingleAnswerGroupContainer>
    </>
  )
}

