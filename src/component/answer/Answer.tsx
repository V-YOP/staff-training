import { Button } from "@chakra-ui/react"
import _ from "lodash"
import { createContext, FC, ReactNode, useContext } from "react"

type AnswerContextValue = {
  onAnswerClick(label: string): void,
  selected?: Record<string, boolean>
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AnswerContext = createContext<AnswerContextValue>({
  onAnswerClick: _.constant(false),
  selected: {}
})

type AnswerButtonProps = {
  onClick(): void,
  selected?: boolean
  children?: ReactNode
}

const AnswerButton: FC<AnswerButtonProps> = ({onClick, selected = false, children}) => {
  return (
    <Button
      padding={[1, 0]}
      textAlign='center'
      variant={selected ? 'solid' : 'outline'}
      colorScheme='blue'
      size='lg'
      flexBasis={20}
      onClick={onClick}>
        {children}
    </Button>
  )
}

export interface AnswerParam {
  label: string
  correct?: boolean
  style?: React.CSSProperties
}

export const Answer: FC<AnswerParam> = ({label}) => {
  const {onAnswerClick: onClick, selected = {}} = useContext(AnswerContext)
  return (
    <AnswerButton onClick={() => onClick(label)} selected={selected[label] ?? false}>{label}</AnswerButton>
  )
}