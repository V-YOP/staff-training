import { FC } from "react"

export interface AnswerParam {
    label: string
    correct?: boolean
    style?: React.CSSProperties
  }
  
export const Answer: FC<AnswerParam> = () => <></>
