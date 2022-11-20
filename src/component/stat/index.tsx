import { Stat, StatLabel, StatNumber } from "@chakra-ui/react"
import { FC } from "react"

type StatParam = {
  label: string
  number: string,
  align?: 'left' | 'center' | 'right'
  labelPosition? : 'up' | 'down'
}

export const NumberStat: FC<StatParam> = ({
  label, number
}) => {
  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>{number}</StatNumber>
    </Stat>
  )
}

