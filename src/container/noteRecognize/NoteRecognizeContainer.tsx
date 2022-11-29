import { SingleAnswerGroup, Answer } from "@/component/answer";
import { NumberStat } from "@/component/stat";
import { Stave } from "@/component/stave/Stave";
import { andP, compose } from "@/util/FunctionUtil";
import { noteQG, prefabNotePredicate } from "@/util/NoteRandom";
import { FC, RefObject, useCallback, useMemo, useReducer, useRef, useState } from "react";
import { useSetting } from '@/SettingProvider'
import { Note } from "@/musicTheory/Note";
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, HStack, IconButton, useDisclosure, VStack } from "@chakra-ui/react";
import _ from "lodash";
import { NoteRecognizeSettingComponent } from "@/container/noteRecognize/NoteRecognizeSetting";
import { SettingsIcon } from "@chakra-ui/icons";
import { useMQ } from "@/useMQ";
import { Scale } from "@/musicTheory/Scale";
import { QuizGenerator } from "@/util/QuizGenerator";

export const NoteRecognizeContainer: FC<Record<string,never>> = () => {
  const {isMobile, isLaptop, isPC} = useMQ()

  const {setting: {NoteRecognize: { 
    startNoteInclusive,
    endNoteInclusive,
    choiceCount,
    accidentals,
    withOctave,
    sortAnswer,
    clef,
    dohType,
    tonic,
    mode,
    answerDisplayType }}} = useSetting()
  
  console.log(tonic, mode)
  const scale = useMemo(() => Scale.get(Note.get(tonic).unwrap(), mode).unwrap(), [tonic, mode])
  console.log(scale)
  const quizGenerator = useMemo<QuizGenerator<Note>>(() => {
    const noteBetweenP = 
      Note.get(startNoteInclusive)
        .andThen(startNote =>
          Note.get(endNoteInclusive).map(endNote => prefabNotePredicate.noteBetween(startNote, endNote)))
        .unwrap();
    const accidentalInP = prefabNotePredicate.accidentalIn(accidentals);

    const inScaleP = prefabNotePredicate.inScales([scale])
    const uniqByP = prefabNotePredicate.uniqBy(n => scale.getNoteDisplayName(n, answerDisplayType).unwrap())
    switch (dohType) {
      case 'fixed-doh': 
        return noteQG(choiceCount, compose(
            accidentalInP,
            withOctave ? noteBetweenP : x => x
          ), withOctave)

      case 'movable-doh':
        return noteQG(choiceCount, compose(
          answerDisplayType !== 'C' ? uniqByP : x => x,
          inScaleP,
          withOctave ? noteBetweenP : x => x,
        ), withOctave)
    }
  }, [accidentals, startNoteInclusive, endNoteInclusive, withOctave, choiceCount, dohType, scale, answerDisplayType])

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

  const displayedKeySignature = useMemo(() => {
    switch(dohType) {
      case 'fixed-doh': return 'C'
      case 'movable-doh': 
        return scale.getRelateNaturalKey().unwrap().relateMajorKey().name
    }
  }, [dohType, scale])

  const { isOpen, onClose, onOpen } = useDisclosure()
  const settingBtnRef = useRef() as RefObject <HTMLButtonElement>

  const sortedAnswer = useMemo(() => {
    if (!sortAnswer) return choices;
    if (dohType === 'fixed-doh' || answerDisplayType === 'C') return _.sortBy(choices, note => note.id)
    console.log( _.sortBy(choices, note => note.withoutOctave().chroma + 12 - Note.get(tonic).unwrap().chroma))    
    return _.sortBy(choices, note => note.withoutOctave().chroma >= Note.get(tonic).unwrap().chroma ? note.withoutOctave().chroma : note.withoutOctave().chroma + 100) 
    

  }, [answerDisplayType, dohType, sortAnswer, tonic,choices])

  return (
    <VStack spacing={10} paddingTop={12} >
      <Stave clef={clef} keySignature={displayedKeySignature} notes={[displayedAnswer]} />
      <SingleAnswerGroup onCorrect={() => onAnswer(true)} onIncorrect={() => onAnswer(false)}>
        {sortedAnswer.map((note, index) => 
          <Answer key={index} label={dohType === 'fixed-doh' ? note.name : scale.getNoteDisplayName(note, answerDisplayType).unwrapOrElse(err => {throw err;})} correct={Note.equal(note)(answer)}/>)}
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
            <DrawerBody paddingTop={5} paddingBottom={12}>
              <NoteRecognizeSettingComponent />
            </DrawerBody>
        </DrawerContent>
      </Drawer>
    </VStack>
  )
}
