import { IconButton, useColorMode, useTheme } from "@chakra-ui/react"
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

export const DarkModeToggle = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <IconButton aria-label='Toggle Color Mode' icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />} onClick={toggleColorMode} />
    )
}