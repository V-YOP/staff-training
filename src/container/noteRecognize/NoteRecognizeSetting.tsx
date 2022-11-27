import { useCallback, useMemo } from "react";
import { Setting, useSetting } from '@/SettingProvider'
import { Accidental, Note } from "@/musicTheory/Note";
import { FormControl, FormHelperText, FormLabel, HStack, Select, Switch, VStack, Text, ButtonGroup, Button, Flex, chakra, IconButton, Collapse } from "@chakra-ui/react";
import _ from "lodash";
import { GClef, FClef } from "@/icon";
import { NaturalKey } from "@/musicTheory/NaturalKey";

const allNaturalNote = Note.allNote().filter(note => note.accidental === '')

const mode2ValidTonics: Record<string, string[]> = {
  "chromatic": ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"],
  "ionian": ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"],
  "aeolian": ["C", "C#", "D", "D#", "Eb", "E", "F", "F#", "G", "G#", "Ab", "A", "A#", "Bb", "B"],
  "harmonic minor": ["C", "C#", "D", "D#", "Eb", "E", "F", "F#", "G", "G#", "Ab", "A", "A#", "Bb", "B"],
  "melodic minor": ["C", "C#", "D", "D#", "Eb", "E", "F", "F#", "G", "G#", "Ab", "A", "A#", "Bb", "B"],
  "major pentatonic": ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"],
  "minor pentatonic": ["C", "C#", "D", "D#", "Eb", "E", "F", "F#", "G", "G#", "Ab", "A", "A#", "Bb", "B"],
  "dorian": ["C", "C#", "D", "D#", "Eb", "E", "F", "F#", "G", "G#", "Ab", "A", "A#", "Bb", "B"],
  "phrygian": ["C", "C#", "D", "D#", "Eb", "E", "F", "F#", "G", "G#", "Ab", "A", "A#", "Bb", "B"],
  "lydian": ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"],
  "mixolydian": ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"],
  "locrian": ["C", "C#", "D", "D#", "Eb", "E", "F", "F#", "G", "G#", "Ab", "A", "A#", "Bb", "B"]
}

export const NoteRecognizeSettingComponent = () => {
  const { setting: { NoteRecognize: { startNoteInclusive, endNoteInclusive, accidentals, withOctave, choiceCount, sortAnswer, clef, dohType, tonic, mode } }, updateSetting, resetSetting } = useSetting()

  const update = useCallback((setting: Partial<Setting['NoteRecognize']>) => {
    updateSetting({ NoteRecognize: setting })
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
        update({ accidentals: accidentals.filter(elem => elem !== acc) })
      } else {
        update({ accidentals: [...accidentals, acc] })
      }
    }
    const isDisabled = accidentals.length === 1 && accidentalSelected
    const colorScheme = accidentalSelected ? 'blue' : undefined
    return { onClick, isDisabled, colorScheme }
  }, [accidentals, update])

  return (
    <VStack gap={4} width="100%">
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>八度记号</FormLabel>
        <Switch size='lg' onChange={() => update({ withOctave: !withOctave })} isChecked={withOctave} defaultChecked={withOctave} />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>谱号</FormLabel>
        <ButtonGroup isAttached minW='10rem'>
          <IconButton
            aria-label='Set clef to treble'
            icon={<GClef />}
            colorScheme={clef === 'treble' ? 'blue' : undefined}
            onClick={() => update({ clef: 'treble' })}
            fontSize={26}
            flexGrow={1} />
          <IconButton
            aria-label='Set clef to bass'
            icon={<FClef />}
            colorScheme={clef === 'bass' ? 'blue' : undefined}
            onClick={() => update({ clef: 'bass' })}
            fontSize={20}
            flexGrow={1} />
        </ButtonGroup>
      </FormControl>
      <FormControl isDisabled={!withOctave} display={withOctave ? 'unset' : 'none'}>
        <FormLabel>音域范围</FormLabel>
        <HStack>
          <Select
            borderRadius={'3xl'}
            value={startNoteInclusive}
            onChange={({ target: { value } }) => update({ startNoteInclusive: value })}>
            {startNoteOptions.map(note => <option key={note.id}>{note.name}</option>)}
          </Select>
          <Text>~</Text>
          <Select
            borderRadius={'3xl'}
            value={endNoteInclusive}
            onChange={({ target: { value } }) => update({ endNoteInclusive: value })}>
            {endNoteOptions.map(note => <option key={note.id}>{note.name}</option>)}
          </Select>
        </HStack>
        <FormHelperText>
          设定问题的音域，不使用八度记号时无效
        </FormHelperText>
      </FormControl>

      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexShrink='0' flexGrow='1'>选项数量</FormLabel>
        <Select
          maxW={24}
          borderRadius={'3xl'}
          value={choiceCount}
          onChange={({ target: { value } }) => update({ choiceCount: +value })}>
          {_.range(2, 8).map(num => <option key={num}>{num}</option>)}
        </Select>
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>选项排序</FormLabel>
        <Switch size='lg' onChange={() => update({ sortAnswer: !sortAnswer })} isChecked={sortAnswer} defaultChecked={sortAnswer} />
      </FormControl>

      <FormControl display='flex' flexDir='column'>
        <FormLabel>练习方式</FormLabel>
        <ButtonGroup isAttached fontSize={12}>
          <Button
            flexGrow={1}
            colorScheme={dohType === 'fixed-doh' ? 'blue' : undefined}
            onClick={() => update({ dohType: 'fixed-doh' })}>固定调</Button>
          <Button
            flexGrow={1}
            colorScheme={dohType === 'movable-doh' ? 'blue' : undefined}
            onClick={() => update({ dohType: 'movable-doh' })}>首调</Button>
        </ButtonGroup>
        <FormHelperText>
          <Collapse startingHeight='2rem' in={true}>
            设定练习方式为固定调练习或是首调练习<br />
            <b>固定调练习</b>：调号限制为C大调，问题音符在选择的音域范围和变音符中随机选定 <br />
            <b>首调练习</b>：音符从特定主音、特定调的音阶中的音符随机选定，调号根据调的色彩决定，在调式音阶中，ionian，lydian，mixolydian调式使用大调调号，dorian，phrygian，aeolian，locrian调式使用小调调号，当前主音、调式会被展示出来
          </Collapse>
        </FormHelperText>
      </FormControl>

      {
        dohType === 'fixed-doh' ?
          <>
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
          </> : null
      }

      {
        dohType === 'movable-doh' ?
          <>
            <HStack width='100%'>
              <FormControl flexGrow={2} flexBasis='0'>
                <FormLabel>调式</FormLabel>
                <Select
                    borderRadius={'3xl'}
                    value={mode}
                    onChange={({ target: { value } }) => update({ mode: value, tonic: 'C' })}>
                    {Object.keys(mode2ValidTonics).map(mode => <option key={mode}> {_.startCase(mode)} </option>)}
                  </Select>
              </FormControl>
              <FormControl flexGrow={1} flexBasis='0'>
                <FormLabel>主音</FormLabel>
                <Select
                    borderRadius={'3xl'}
                    value={tonic}
                    onChange={({ target: { value } }) => update({ tonic: value })}>
                    {mode2ValidTonics[mode].map(note => <option key={note}>{note}</option>)}
                  </Select>
              </FormControl>
            </HStack>
          </> : null
      }

      <Button colorScheme='blue' width='100%' onClick={() => resetSetting('NoteRecognize')}>选项重置</Button>
    </VStack>
  )
}