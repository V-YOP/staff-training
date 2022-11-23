import { NaturalKey } from "@/musicTheory/NaturalKey";
import { QuizGenerator, mkQuizGenerator } from "@/util/QuizGenerator";
import  _  from "lodash";

// There are 13 major-minor key pair in Circle of fifth 
const keyPairs: [NaturalKey<'Major'>, NaturalKey<'Minor'>][] = [["F","d"],["C","a"],["G","e"],["D","b"],["A","f#"],["E","c#"],["B","g#"],["Gb","eb"],["F#","d#"],["Db","bb"],["Ab","f"],["Eb","c"],["Bb","g"]]
  .map(pairs => pairs.map(key => NaturalKey.get(key).unwrap()) as [NaturalKey<'Major'>, NaturalKey<'Minor'>])

// and 2 major keys which doesn't have relative minor key (Their relative minor key have double accidental in its scale)
const lastMajorKeys = [NaturalKey.get('C#').unwrap(), NaturalKey.get('Cb').unwrap()]

/**
 * For Key SAQG, There may be one or two answer for a same key sign. 
 */
export function keyQG(choiceCount: number, filter: (note: [NaturalKey<'Major'>, NaturalKey<'Minor'>] | NaturalKey<'Major'>) => boolean = _.constant(true)): QuizGenerator<[NaturalKey<'Major'>, NaturalKey<'Minor'>] | NaturalKey<'Major'>> {
  const validKeyPairs = [...keyPairs, ...lastMajorKeys].filter(filter)
  return mkQuizGenerator(choiceCount, validKeyPairs)
}