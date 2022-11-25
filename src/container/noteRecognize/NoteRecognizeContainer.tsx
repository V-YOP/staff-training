import { SingleAnswerGroup, Answer } from "@/component/answer";
import { NumberStat } from "@/component/stat";
import { Stave } from "@/component/stave/Stave";
import { andP } from "@/util/FunctionUtil";
import { noteQG, prefabNotePredicate } from "@/util/NoteRandom";
import { FC, RefObject, useCallback, useMemo, useReducer, useRef, useState } from "react";
import { useSetting } from '@/SettingProvider'
import { Note } from "@/musicTheory/Note";
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, HStack, IconButton, Input, useDisclosure, useMediaQuery, VStack } from "@chakra-ui/react";
import _ from "lodash";
import { NoteRecognizeSettingComponent } from "@/container/noteRecognize/NoteRecognizeSetting";
import { SettingsIcon } from "@chakra-ui/icons";
import { useMQ } from "@/useMQ";

export const NoteRecognizeContainer: FC<Record<string,never>> = () => {
  const {isMobile, isLaptop, isPC} = useMQ()

  const {setting: {NoteRecognize: {startNoteInclusive,endNoteInclusive,choiceCount,accidentals,withOctave,sortAnswer, clef}}} = useSetting()
  
  const quizGenerator = useMemo(() => noteQG(choiceCount, andP(
    withOctave ? 
    Note.get(startNoteInclusive).andThen(startNote =>
      Note.get(endNoteInclusive).map(endNote => 
        prefabNotePredicate.noteBetween(startNote, endNote)))
        .unwrap() : _.constant(true),
    prefabNotePredicate.accidentalIn(accidentals)), withOctave), 
    [accidentals, startNoteInclusive, endNoteInclusive, withOctave, choiceCount])

  const [seed, setSeed] = useState(() => Math.random())
  const [[answer, choices], nextSeed] = useMemo(() => quizGenerator.runState(seed), [seed, quizGenerator])
  
  const [correctCount, plusCorrectCount] = useReducer(s => s + 1, 0)
  const [incorrectCount, plusIncorrectCount] = useReducer(s => s + 1, 0)

  
  const onAnswer = useCallback((correct: boolean) => {
    correct ? plusCorrectCount() : plusIncorrectCount();
    setSeed(nextSeed)
  }, [nextSeed])

  // if without octave, use a random octave number in [3, 5]
  const displayedAnswer = useMemo(() => {
    if (withOctave) return answer;
    return answer.withOctave(3 + Math.floor(Math.random() * 3))
  }, [withOctave, answer])


  const { isOpen, onClose, onOpen } = useDisclosure()
  const settingBtnRef = useRef() as RefObject <HTMLButtonElement>

  return (
    <VStack spacing={10} paddingTop={12} >
      <Stave clef={clef} keySignature="C" notes={[displayedAnswer]} />
      <SingleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
        {(sortAnswer ? _.sortBy(choices, note => note.id) : choices).map((note) => 
          <Answer key={note.name} label={note.name} correct={Note.equal(note)(answer)}/>)}
      </SingleAnswerGroup>
      <HStack gap={10}>
        <NumberStat label="Correct" number={correctCount} align="center" labelPosition="down" />
        <NumberStat label="Incorrect" number={incorrectCount} align="center" labelPosition="down" />
      </HStack>

      {
        isLaptop ? 
          <IconButton 
            aria-label="Toggle setting interface" 
            ref={settingBtnRef}
            colorScheme='green' 
            onClick={onOpen}
            position='fixed'
            bottom="4rem"
            right="2rem"
            icon={<SettingsIcon fontSize="2xl" />}
            size='lg' /> :
          <Flex
            w="100%"
            justifyContent='flex-end'
            maxW={1280}
            marginLeft='auto'
            marginRight='auto'
            position='fixed'
            bottom="3rem"
            paddingRight='6rem'>
            <Button 
              aria-label="Toggle setting interface" 
              ref={settingBtnRef}
              colorScheme='green' 
              onClick={onOpen}
              fontSize='2xl'
              size='lg'>SETTING&nbsp;<SettingsIcon fontSize="2xl" /></Button> 
          </Flex>
      }

      <Drawer
         finalFocusRef={settingBtnRef}
         isOpen={isOpen}
         placement='right'
         size={isMobile ? 'xs' : 'sm'}
         onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
           <DrawerCloseButton size='lg' />
            <DrawerHeader>Note Recognize Setting</DrawerHeader>
            <DrawerBody marginTop={10}>
              <NoteRecognizeSettingComponent />
            </DrawerBody>
        </DrawerContent>
      </Drawer>
    </VStack>
  )
}
