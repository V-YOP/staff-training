
import React, { useEffect, useMemo } from "react";
import * as V from 'vexflow';
import * as T from '@tonaljs/tonal';
import { Note } from "@/musicTheory/Note";
import _ from "lodash";
import { Box, Flex, useColorMode } from "@chakra-ui/react";

/**
 * 
 * @returns random GUID
 */
function getGUID(): string {
  function _p8(s?: boolean) {
    const p = (Math.random().toString(16) + "000000000").substring(2, 8);
    return s ? "-" + p.substring(0, 4) + "-" + p.substring(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

/**
 * get display accidental of a Note in a specfical key signature, e.g: F4 in G key displays as a F♮4 and F#4 displays as F4
 * @param note Note in the key
 * @param keySignature tonic, upper case corresponds to major key and lower case corresponds to minor key
 * @returns 
 */
function getDisplayAccidental(note: Note, keySignature: string): string {
  // TODO
  const key = keySignature.toUpperCase() === keySignature ? T.Key.majorKey(keySignature) : T.Key.majorKey(keySignature)
  const noteName = note.letter + note.accidental

  // if this note is in the key scale, no accidental
  if (_.some(key.scale, scale => noteName === scale)) return ''

  // if note's original accidental is natural, use 
  if (note.accidental === '') return 'n'
  return note.accidental
}

export type StaveParam = Partial<{
  width: number
  height: number
  staffXOffset: number
  staffYOffset: number
  staffWidth: number
  clef: 'treble' | 'bass'
  keySignature: string
  style: React.CSSProperties
  /**
   * Notes sequence, element within is single note or chord 
   */
  notes: (Note | Note[])[]
}>

export interface StaveOpt {
  // TODO
}

/**
 * Vexflow Renderer Wrapper
 */
export const Stave : React.ForwardRefExoticComponent<StaveParam & React.RefAttributes<StaveOpt>> 
  = React.forwardRef<StaveOpt, StaveParam>(({
    clef = 'treble',
    keySignature = 'C',
    width = 300,
    height = 180,
    staffXOffset = 0,
    staffYOffset = 30,
    staffWidth = 300,
    notes = [],
    style = {}
  }, ref) => {
  const {colorMode} = useColorMode();
  const randomId = useMemo(getGUID, [])
  const staveNotes = useMemo<V.StaveNote[]>(() => {
    return notes.map(noteOrChord => {
      const notes = Array.isArray(noteOrChord) ? noteOrChord : [noteOrChord]

      const keys = notes.map(note => `${note.letter}${note.accidental}/${note.octave?? 4}`) 
      return notes.reduce((acc, x, index) => {
        const displayAccidental = getDisplayAccidental(x, keySignature)
        if (displayAccidental !== '') {
          return acc.addModifier(new V.Accidental(displayAccidental), index)
        }
        return acc
      }, new V.StaveNote({
        keys, 
        duration: '4',
        auto_stem: true,
        clef,
      }))
    })
  }, [clef, keySignature, notes])
  
  useEffect(() => {
    const div = document.getElementById(randomId) as HTMLDivElement;
    const renderer = new V.Renderer(div, V.RendererBackends.SVG);
    renderer.resize(width, height)
    const context = renderer.getContext();
    
    const stave = new V.Stave(staffXOffset, staffYOffset, staffWidth)
        .addClef(clef)
        .addKeySignature(keySignature)
        .setContext(context)
        .draw();
    if (staveNotes.length !== 0) {
      V.Formatter.FormatAndDraw(context, stave, staveNotes)
    }
    return () => {
      [...div.children].forEach(node => node.remove())
    }
  })
  return (
    <Box 
      borderRadius="3xl"
      boxShadow='xl'
      style={style}>
      <Flex 
        justifyContent="center"
        alignItems="center"
        width={width + 20} 
        height={height + 20} 
        id={randomId} filter={colorMode === 'dark' ? 'invert(100%)' : 'unset'}></Flex>
    </Box>
  )
})
Stave.displayName = 'Stave'