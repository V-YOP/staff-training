import { FC } from "react"
import styled from "styled-components"


const f: FC<{a: number, b: string}> = param => <></>


const StatContainer = styled.dl<{align: 'left' | 'center' | 'right'}>`
  flex-flow: column nowrap;
  align-items: ${({align}) => 
    align === 'left' ? 
      'flex-start' :
      align === 'center' ?
        'center': 
        'flex-end'};
  display: flex;
  width: fit-content;
`

const StatLabel = styled.dt`
  font-size: 1em;
`

const StatValue = styled.dd`
  font-size: 2em;
  margin-left: 0;
`

type StatParam = {
  label: string
  number: string,
  align?: 'left' | 'center' | 'right'
  labelPosition? : 'up' | 'down'
}

export const Stat: FC<StatParam> = ({
  label, number, align = 'left', labelPosition = 'up'
}) => {
  return (
    <StatContainer align={align}>
    {labelPosition === 'up' ? 
      <><StatLabel>{label}</StatLabel>
      <StatValue>{number}</StatValue></> :
      <><StatValue>{number}</StatValue>
      <StatLabel>{label}</StatLabel></>
    }
    </StatContainer>
  )
}

