import { Heading, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export const ForFun = () => {
  const [dotNum, setDotNum] = useState(1)
  useEffect(() => {
    const i = setInterval(() => {
      setDotNum(dotNum => dotNum === 5 ? 1 : dotNum + 1)
    }, 500)
    return () => clearInterval(i)
  }, [])
  return (
    <VStack marginTop={20}>

    <Heading>开发中{'.'.repeat(dotNum)}</Heading>
    </VStack>
  )
}