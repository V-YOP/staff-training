import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys)

const baseStyle = definePartsStyle({
  // IT CANNOT WORK! MAYBE A BUG
  field: {
    borderRadius: '3xl',
  },
  icon: {
  },
})

export default defineMultiStyleConfig({ baseStyle })