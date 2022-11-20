import { DarkModeToggle } from "@/component/DarkModeToggle";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { Route, useRoute } from './RouteProvider';

const HeaderContainer: FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <Box
      width='100%'
      display='flex'
      justifyContent='space-between'
      position='sticky'
      top='0'
      padding='4'
      boxShadow={'md'}
      >
      {children}
    </Box>
  )
}

const HeaderSection: FC<{children?: React.ReactNode}> = ({children}) => {
  return (
    <Box
      width='fit-content'
      display='flex'
      alignItems='center'
      gap={4}>
      {children}
    </Box>
  )
}

type LinkParam = {
  to: Route,
  children: string
}

const Link = ({
  to,
  children
}: LinkParam) => {
  const [route, setRoute] = useRoute()
  //  <HeaderItem active={to === route} onClick={() => setRoute(to)}>{children}</HeaderItem>
  return (
    <>
      <Button minW={28} height={10} fontSize={'xl'} borderRadius={'3xl'} colorScheme='blue' onClick={() => setRoute(to)} variant={to === route ? 'solid' : 'ghost'}>
        {children}
      </Button>
    </>
  )
}

export const Header: FC<Record<string, never>> = () => {
  const [, setRoute] = useRoute()
  return (
    <HeaderContainer>
      <HeaderSection>
        <Button variant='link' marginRight={4}>
          <Heading onClick={() => setRoute('ABOUT')}>Staff Quiz</Heading>
        </Button>
        <Link to='NOTE_RECOGNIZE'>NOTE</Link>
        <Link to='KEY_RECOGNIZE'>KEY</Link>
        <Link to='TONIC_SOLFA_RECOGNIZE'>TONIC SOL-FA</Link>
        <Link to='CHORD_RECOGNIZE'>CHORD</Link>
        <Link to='INTERVAL_RECOGNIZE'>INTERVAL</Link>
      </HeaderSection>
      <HeaderSection>
        {/* <Link to='NOT_IMPLEMENTED'>STATS</Link>
        <Link to='ABOUT'>ABOUT</Link> */}
        <DarkModeToggle />
      </HeaderSection>
    </HeaderContainer>
  )
}