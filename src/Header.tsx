import { useMQ } from "@/useMQ";
import { CloseIcon, MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, Collapse, Heading, IconButton, useBoolean, useColorMode, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Route, useRoute } from './RouteProvider';

const HeaderContainer_: FC<{ children?: React.ReactNode, className?: string }> = ({ className = '', children }) => {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      className={className}
      width="100%">
      {children}
    </Box>
  )
}

const HeaderContainer = chakra(HeaderContainer_)

const HeaderSection: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      width='fit-content'
      display='flex'
      alignItems='center'
      gap={2}>
      {children}
    </Box>
  )
}

type LinkParam = {
  to: Route,
  children: string,
  className?: string,
  onClick?(): void
}

const Link_ = ({
  to,
  children,
  className = '',
  onClick = () => {}
}: LinkParam) => {
  const [route, setRoute] = useRoute()
  //  <HeaderItem active={to === route} onClick={() => setRoute(to)}>{children}</HeaderItem>
  return (
    <Button 
      className={className}
      minW={28} 
      height={10} 
      fontSize={'xl'} 
      borderRadius={'3xl'}
      colorScheme='blue' 
      onClick={() => {
        setRoute(to)
        onClick()
      }} 
      variant={to === route ? 'solid' : 'ghost'}>
      {children}
    </Button>
  )
}

const Link = chakra(Link_)

export const Header: FC<Record<string, never>> = () => {
  const [, setRoute] = useRoute()
  const { isMobile, isLaptop, isPC } = useMQ()
  const { colorMode, toggleColorMode } = useColorMode()

  const [menuOpen, { toggle: toggleMenu, off: closeMenu }] = useBoolean(false)

  return (
    <VStack
      width='100%'
      padding='4'
      boxShadow={'md'}>
      <HeaderContainer maxW={1280}>
        <HeaderSection>
          <Button variant='link' marginRight={4}>
            <Heading onClick={() => setRoute('ABOUT')}>Staff Quiz</Heading>
          </Button>
          {
            isLaptop ?
              null :
              <>
                <Link to='NOTE_RECOGNIZE'>NOTE</Link>
                <Link to='KEY_RECOGNIZE'>KEY</Link>
                <Link to='CHORD_RECOGNIZE'>CHORD</Link>
                <Link to='INTERVAL_RECOGNIZE'>INTERVAL</Link>
              </>
          }
        </HeaderSection>
        <HeaderSection>
          {/* <Link to='NOT_IMPLEMENTED'>STATS</Link>
          <Link to='ABOUT'>ABOUT</Link> */}
          {
            // if width less than laptop, show menu button, otherwise show toggle color mode button
            isLaptop ?
              <IconButton
                variant='ghost'
                aria-label="Menu"
                onClick={toggleMenu}
                size='lg'
                icon={menuOpen ? 
                  // TODO consider use a animation?
                  <CloseIcon fontSize='xl'  /> : 
                  <HamburgerIcon fontSize='3xl' />} /> :
              <IconButton
                aria-label='Toggle Color Mode'
                variant='ghost'
                icon={colorMode === 'light' ?
                  <MoonIcon fontSize='2xl' /> :
                  <SunIcon fontSize='2xl' />}
                onClick={toggleColorMode} />
          }
        </HeaderSection>
      </HeaderContainer>
      <Collapse style={{width: '100%', marginTop: '1rem'}} in={menuOpen && isLaptop} animateOpacity>
        <VStack width="100%">
          <Link width={"100%"} onClick={closeMenu} to='NOTE_RECOGNIZE'>NOTE</Link>
          <Link width={"100%"} onClick={closeMenu} to='KEY_RECOGNIZE'>KEY</Link>
          <Link width={"100%"} onClick={closeMenu} to='CHORD_RECOGNIZE'>CHORD</Link>
          <Link width={"100%"} onClick={closeMenu} to='INTERVAL_RECOGNIZE'>INTERVAL</Link>
        </VStack>
      </Collapse>
    </VStack>
  )
}