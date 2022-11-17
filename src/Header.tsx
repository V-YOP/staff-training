import { FC } from "react";
import styled from "styled-components";
import { Route, useRoute } from './RouteProvider';

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 0.5em;
  border-bottom: 1px solid black;
`

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`

const HeaderLogo = styled.div`

`

const HeaderItem = styled.div<{active?: boolean}>`
  cursor: pointer;
  padding: 0.5em 1em;
`

type LinkParam = {
  to: Route,
  children?: React.ReactNode
}

const Link = ({
  to,
  children
}: LinkParam) => {
  const [route, setRoute] = useRoute()
  return (
    <HeaderItem active={to === route} onClick={() => setRoute(to)}>{children}</HeaderItem>
  )
}

export const Header: FC<{}> = () => {
  return (
    <HeaderContainer>
      <HeaderSection>
        <HeaderLogo>Staff Training</HeaderLogo>
        <Link to='NOTE_RECOGNIZE'>音符/Note</Link>
        <Link to='NOT_IMPLEMENTED'>调号/Key</Link>
        <Link to='NOT_IMPLEMENTED'>首调唱名/Tonic Sol-fa</Link>
        <Link to='NOT_IMPLEMENTED'>和弦/Chord</Link>
        <Link to='NOT_IMPLEMENTED'>音程/Interval</Link>
      </HeaderSection>
      <HeaderSection>
        <Link to='NOT_IMPLEMENTED'>统计/Stats</Link>
        <Link to='ABOUT'>关于/About</Link>
      </HeaderSection>
    </HeaderContainer>
  )
}