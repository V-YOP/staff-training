import { useCallback, useMemo } from "react";
import { Setting, useSetting } from '@/SettingProvider'
import { Accidental, Note } from "@/musicTheory/Note";
import { FormControl, FormHelperText, FormLabel, HStack, Select, Switch, VStack, Text, ButtonGroup, Button, Flex, chakra, IconButton, Collapse } from "@chakra-ui/react";
import _ from "lodash";
import { GClef, FClef } from "@/icon";
import { NaturalKey } from "@/musicTheory/NaturalKey";

const allNaturalNote = Note.allNote().filter(note => note.accidental === '')

const mode2ValidTonics: Record<string, string[]> = {
  // "chromatic": ["C", "C#", "Db", "D", "Eb", "E", "F", "F#", "Gb", "G", "Ab", "A", "Bb", "B", "Cb"],
  "chromatic": ["C"],
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
  const { setting: { NoteRecognize: { startNoteInclusive, endNoteInclusive, accidentals, withOctave, choiceCount, sortAnswer, clef, dohType, tonic, mode, answerDisplayType } }, updateSetting, resetSetting } = useSetting()

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
        <FormLabel margin={0} flexGrow='1'>????????????</FormLabel>
        <Switch size='lg' onChange={() => update({ withOctave: !withOctave })} isChecked={withOctave} defaultChecked={withOctave} />
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>??????</FormLabel>
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
        <FormLabel>????????????</FormLabel>
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
          ??????????????????????????????????????????????????????
        </FormHelperText>
      </FormControl>

      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexShrink='0' flexGrow='1'>????????????</FormLabel>
        <Select
          maxW={24}
          borderRadius={'3xl'}
          value={choiceCount}
          onChange={({ target: { value } }) => update({ choiceCount: +value })}>
          {_.range(2, 8).map(num => <option key={num}>{num}</option>)}
        </Select>
      </FormControl>
      <FormControl display='flex' alignItems='center'>
        <FormLabel margin={0} flexGrow='1'>????????????</FormLabel>
        <Switch size='lg' onChange={() => update({ sortAnswer: !sortAnswer })} isChecked={sortAnswer} defaultChecked={sortAnswer} />
      </FormControl>

      <FormControl display='flex' flexDir='column'>
        <FormLabel>????????????</FormLabel>
        <ButtonGroup isAttached fontSize={12}>
          <Button
            flexGrow={1}
            colorScheme={dohType === 'fixed-doh' ? 'blue' : undefined}
            onClick={() => update({ dohType: 'fixed-doh' })}>?????????</Button>
          <Button
            flexGrow={1}
            colorScheme={dohType === 'movable-doh' ? 'blue' : undefined}
            onClick={() => update({ dohType: 'movable-doh' })}>??????</Button>
        </ButtonGroup>
        <FormHelperText>
          <Collapse startingHeight='2rem' in={true}>
            ??????????????????????????????????????????????????????<br />
            <b>???????????????</b>: ???????????????C??????, ??????????????????????????????????????????????????????????????? <br />
            <b>????????????</b>: ??????????????????????????????????????????????????????????????????, ??????????????????????????????, ??????????????????, Ionian, Lydian, Mixolydian????????????????????????, Dorian, Phrygian, Aeolian, Locrian???????????????????????? <br />
          </Collapse>
        </FormHelperText>
      </FormControl>

      {
        dohType === 'fixed-doh' ?
          <>
            <FormControl display='flex' flexDir='column'>
              <FormLabel>????????????</FormLabel>
              <ButtonGroup isAttached fontSize={12}>
                <Button
                  fontSize={22}
                  flexGrow={1}
                  {...accidentalProps('')}>???</Button>
                <Button
                  fontSize={22}
                  flexGrow={1}
                  {...accidentalProps('#')}>???</Button>
                <Button
                  fontSize={22}
                  flexGrow={1}
                  {...accidentalProps('b')}>???</Button>
                <Button
                  fontSize={22}
                  flexGrow={1}
                  {...accidentalProps('##')}>??????</Button>
                <Button
                  fontSize={22}
                  flexGrow={1}
                  {...accidentalProps('bb')}>??????</Button>
              </ButtonGroup>
            </FormControl>
          </> : null
      }

      {
        dohType === 'movable-doh' ?
          <>
            <HStack width='100%'>
              <FormControl flexGrow={2} flexBasis='0'>
                <FormLabel>??????</FormLabel>
                <Select
                  borderRadius={'3xl'}
                  value={mode}
                  onChange={({ target: { value } }) => update({ mode: value, tonic: 'C' })}>
                  {Object.keys(mode2ValidTonics).map(mode => <option key={mode} label={_.startCase(mode)}>{mode}</option>)}
                </Select>
              </FormControl>
              <FormControl flexGrow={1} flexBasis='0'>
                <FormLabel>??????</FormLabel>
                <Select
                  borderRadius={'3xl'}
                  value={tonic}
                  onChange={({ target: { value } }) => update({ tonic: value })}>
                  {mode2ValidTonics[mode].map(note => <option key={note}>{note}</option>)}
                </Select>
              </FormControl>
            </HStack>
            <FormControl display='flex' alignItems='center'>
              <FormLabel margin={0} flexGrow='1'>??????????????????</FormLabel>
              <ButtonGroup isAttached minW='10rem'>
                <Button
                  colorScheme={answerDisplayType === 'C' ? 'blue' : undefined}
                  onClick={() => update({ answerDisplayType: 'C' })}
                  flexGrow={1}>C</Button>
                <Button
                  colorScheme={answerDisplayType === '1' ? 'blue' : undefined}
                  onClick={() => update({ answerDisplayType: '1' })}
                  flexGrow={1}>1</Button>
                <Button
                  colorScheme={answerDisplayType === 'Do' ? 'blue' : undefined}
                  onClick={() => update({ answerDisplayType: 'Do' })}
                  flexGrow={1}>Do</Button>
              </ButtonGroup>
            </FormControl>
          </> : null
      }

      <Button colorScheme='blue' width='100%' onClick={() => resetSetting('NoteRecognize')}>????????????</Button>
    </VStack>
  )
}