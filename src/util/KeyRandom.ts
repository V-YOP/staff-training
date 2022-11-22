import { Key } from "@/musicTheory/Key";
import { SAQG, mkSAQG } from "@/util/QuizGenerator";
import  _  from "lodash";

// There are 13 major-minor key pair in Circle of fifth 
const keyPairs: [Key<'Major'>, Key<'Minor'>][] = [["F","d"],["C","a"],["G","e"],["D","b"],["A","f#"],["E","c#"],["B","g#"],["Gb","eb"],["F#","d#"],["Db","bb"],["Ab","f"],["Eb","c"],["Bb","g"]]
  .map(pairs => pairs.map(key => Key.get(key).unwrap()) as [Key<'Major'>, Key<'Minor'>])
// and 2 major keys which doesn't have relative minor key.
const lastMajorKeys = [Key.get('C#').unwrap(), Key.get('Cb').unwrap()]

/**
 * For Key SAQG, There may be one or two answer for a same key sign. 
 */
export function keySAQG(filter: (note: [Key<'Major'>, Key<'Minor'>] | Key<'Major'>) => boolean = _.constant(true)): SAQG<[Key<'Major'>, Key<'Minor'>] | Key<'Major'>> {
  const validKeyPairs = [...keyPairs, ...lastMajorKeys].filter(filter)
  return mkSAQG(validKeyPairs)
}