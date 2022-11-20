import { Button } from "@chakra-ui/react"
import { createContext, FC, ReactNode, useContext } from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AnswerContext = createContext<[onCorrect: () => void, onIncorrect: () => void]>([() => {}, () => {}])

type AnswerButtonProps = {
  onClick(): void,
  children?: ReactNode
}

const AnswerButton: FC<AnswerButtonProps> = ({onClick, children}) => {
  return (
    <Button
      padding={[1, 0]}
      textAlign='center'
      variant='outline'
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

export const Answer: FC<AnswerParam> = ({label, correct}) => {
  const [onCorrect, onIncorrect] = useContext(AnswerContext)
  return (
    <AnswerButton onClick={() => correct ? onCorrect() : onIncorrect()}>{label}</AnswerButton>
  )
}