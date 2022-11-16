import { FC } from "react";
import { AnswerParam, Answer } from "./Answer";


interface SingleAnswerGroupParam {
  children: React.ReactElement<AnswerParam, typeof Answer>[]
  onCorrect: () => void
  onIncorrect: () => void
}

export const SingleAnswerGroup: FC<SingleAnswerGroupParam> = ({
  children,
  onCorrect,
  onIncorrect
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
      <div>
        {propss.map(({ correct = false, label }) => {
          return <button onClick={() => {
            if (correct) onCorrect()
            else onIncorrect()
          }}>{label}</button>
        })}
      </div>
    </>
  )
}

