import { Heading, VStack } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"

const content = [
  '开发中',
  '少女祈祷中',
  '摸鱼中',
  '学习中',
  'Zzz',
  '进取中',
  '整蛊中',
  '练结实的 Muscle 中',
  '吃热狗中',
  '中暑中',
  '晒太阳中',
  '喝茶中',
  '下班中',
  '上班中',
]

export const ForFun = () => {
  const [dotNum, setDotNum] = useState(1)
  const title = useMemo(() => content[Math.floor(Math.random() * content.length)], [])
  useEffect(() => {
    const i = setInterval(() => {
      setDotNum(dotNum => dotNum === 5 ? 1 : dotNum + 1)
    }, 500)
    return () => clearInterval(i)
  }, [])
  return (
    <VStack marginTop={20}>

    <Heading>{title + '.'.repeat(dotNum)}</Heading>
    </VStack>
  )
}