import { useCallback, useMemo } from "react";
import { Setting, useSetting } from '@/SettingProvider'
import { Accidental, Note } from "@/musicTheory/Note";
import { FormControl, FormHelperText, FormLabel, HStack, Select, Switch, VStack, Text, ButtonGroup, Button, Flex, chakra, IconButton } from "@chakra-ui/react";
import _ from "lodash";
import {GClef, FClef} from "@/icon";

const allNaturalNote = Note.allNote().filter(note => note.accidental === '')
export const NoteRecognizeSettingComponent = () => {
  const {setting: {NoteRecognize: {startNoteInclusive,endNoteInclusive,accidentals,withOctave,choiceCount, sortAnswer,accidentalRelateKey, clef}}, updateSetting, resetSetting} = useSetting()
  
  const update = useCallback((setting: Partial<Setting['NoteRecognize']>) => {
    updateSetting({NoteRecognize: setting})
  }, [updateSetting]);

  const startNoteOptions = useMemo<Note[]>(() => {
    // start Note must be less or equal than end Note a Octave
    const lessThanAOctave = Note.get(endNoteInclusive).unwrap().shiftOctave(-1)
    if (_.isNil(lessThanAOctave.octave) || lessThanAOctave.octave < 1) return []
    return _.takeWhile(allNaturalNote, note => note.id <= lessThanAOctave.id)
  }, [endNoteInclusive])

  const endNoteOptions = useMemo<Note[]>(() => {
    // start Note must be less or equal than end Note a Octave
    const higherThanAOctave = Note.get(startNoteInclusive).unwrap().shiftOctave(1)
    if (_.isNil(higherThanAOctave.octave) || higherThanAOctave.octave > 7) return []
    return _.dropWhile(allNaturalNote, note => note.id < higherThanAOctave.id)
  }, [startNoteInclusive])

  const accidentalProps = useCallback((acc: Accidental) => {
    const accidentalSelected = accidentals.some(elem => elem === acc)
    function onClick() {
      if (accidentalSelected) {
        if (accidentals.length <= 1) return
        update({accidentals: accidentals.filter(elem => elem !== acc)})
      } else {
        update({accidentals: [...accidentals, acc]})
      }
    }
    const isDisabled = accidentals.length === 1 && accidentalSelected
    const colorScheme = accidentalSelected ? 'blue' : undefined
    return {onClick, isDisabled, colorScheme }
  }, [accidentals, update])

  return (
    <VStack gap={4} width="100%">      
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>八度记号</FormLabel> 
        <Switch size='lg' onChange={() => update({withOctave: !withOctave})} isChecked={withOctave} defaultChecked={withOctave} />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>谱号</FormLabel> 
        <ButtonGroup isAttached minW='10rem'>
          <IconButton 
            aria-label='Set clef to treble'
            icon={<GClef />}
            colorScheme={clef === 'treble' ? 'blue' : undefined}
            onClick={() => update({clef: 'treble'})}
            fontSize={26} 
            flexGrow={1} />
          <IconButton 
            aria-label='Set clef to bass'
            icon={<FClef />}
            colorScheme={clef === 'bass' ? 'blue' : undefined}
            onClick={() => update({clef: 'bass'})}
            fontSize={20} 
            flexGrow={1} />
        </ButtonGroup>
      </FormControl>
      <FormControl isDisabled={!withOctave} display={withOctave ? 'unset': 'none'}>
        <FormLabel>音域范围</FormLabel>
        <HStack>
          <Select 
            borderRadius={'3xl'}
            value={startNoteInclusive} 
            onChange={({target: {value}}) => update({startNoteInclusive: value})}>
            {startNoteOptions.map(note => <option key={note.id}>{note.name}</option>)}
          </Select>
          <Text>~</Text>
          <Select 
            borderRadius={'3xl'}
            value={endNoteInclusive} 
            onChange={({target: {value}} ) => update({endNoteInclusive: value})}>
            {endNoteOptions.map(note => <option key={note.id}>{note.name}</option>)}
          </Select>
        </HStack>
        <FormHelperText>
          设定问题的音域，不使用八度记号时无效
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel margin={0} flexGrow='1'>调号</FormLabel> 
        <FormHelperText>
          TODO，应当允许选择多种大调，小调，在这之前需要对调号做好抽象
        </FormHelperText>
      </FormControl>
      <FormControl>
        <Flex alignItems='center'>
          <FormLabel margin={0} flexGrow='1'>变音符号相对调计算</FormLabel> 
          <Switch size='lg' onChange={() => update({accidentalRelateKey: !accidentalRelateKey})} isChecked={accidentalRelateKey} defaultChecked={accidentalRelateKey} />
        </Flex>
        <FormHelperText>
          设置变音符号是否相对<chakra.b fontSize='1.1em' display='inline-block'>调内音</chakra.b>计算
        </FormHelperText>
      </FormControl>
      <FormControl display='flex' flexDir='column'>
        <FormLabel>变音符号</FormLabel> 
        <ButtonGroup isAttached fontSize={12}>
          <Button 
            fontSize={22} 
            flexGrow={1}
            {...accidentalProps('')}>♮</Button>
          <Button 
            fontSize={22}
            flexGrow={1}
            {...accidentalProps('#')}>♯</Button>
          <Button 
            fontSize={22}
            flexGrow={1}
            {...accidentalProps('b')}>♭</Button>
          <Button 
            fontSize={22}
            flexGrow={1}
            {...accidentalProps('##')}>♯♯</Button>
          <Button 
            fontSize={22}
            flexGrow={1}
            {...accidentalProps('bb')}>♭♭</Button>
        </ButtonGroup>
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexShrink='0' flexGrow='1'>选项数量</FormLabel> 
        <Select 
            maxW={24}
            borderRadius={'3xl'}
            value={choiceCount} 
            onChange={({target: {value}} ) => update({choiceCount: +value})}>
            {_.range(2, 8).map(num => <option key={num}>{num}</option>)}
        </Select>
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>选项排序</FormLabel> 
        <Switch size='lg' onChange={() => update({sortAnswer: !sortAnswer})} isChecked={sortAnswer} defaultChecked={sortAnswer} />
      </FormControl>
      <Button colorScheme='blue' width='100%' onClick={() => resetSetting('NoteRecognize')}>选项重置</Button>
    </VStack>
  )
}