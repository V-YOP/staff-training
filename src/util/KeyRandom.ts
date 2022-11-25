import { NaturalKey } from "@/musicTheory/NaturalKey";
import { QuizGenerator, mkQuizGenerator } from "@/util/QuizGenerator";
import  _  from "lodash";

// There are 13 major-minor key pair in Circle of fifth 
const keyPairs: [NaturalKey<'Major'>, NaturalKey<'Minor'>][] = [
  ["F","d"],
  ["C","a"],
  ["G","e"],
  ["D","b"],
  ["A","f#"],
  ["E","c#"],
  ["B","g#"],
  ['Cb','ab'],
  ["Gb","eb"],
  ["F#","d#"],
  ["Db","bb"],
  ['C#','a#'],
  ["Ab","f"],
  ["Eb","c"],
  ["Bb","g"]]
  .map(pairs => pairs.map(key => NaturalKey.get(key).unwrap()) as [NaturalKey<'Major'>, NaturalKey<'Minor'>])

/**
 * For Key SAQG, There may be one or two answer for a same key sign. 
 */
export function keyQG(choiceCount: number, filter: (note: [NaturalKey<'Major'>, NaturalKey<'Minor'>]) => boolean = _.constant(true)): QuizGenerator<[NaturalKey<'Major'>, NaturalKey<'Minor'>]> {
  const validKeyPairs = keyPairs.filter(filter)
  return mkQuizGenerator(choiceCount, validKeyPairs)
}