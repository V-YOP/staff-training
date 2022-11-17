import { shuffle } from "./CollectionUtil"
import * as R from 'ramda'

export type SingleAnswerQuizGenerator<T> = {
  nextQuiz(choiceCount: number): [answer: T, choices: T[]]
}

export type MultipleAnswerQuizGenerator<T> = {
  nextQuiz(answerCount: number, choiceCount: number): [answers: T[], choices: T[]]
}


export function mkSingleAnswerQuizGenerator<T>(answerScope: T[]): SingleAnswerQuizGenerator<T> {
  const answerScopeCopy = [...answerScope]
  return {
    nextQuiz(choiceCount) {
      const shuffledAnswerScope = shuffle(answerScopeCopy)
      const choices = R.take(choiceCount, shuffledAnswerScope)
      const answer = choices[0]
      return [answer, shuffle(choices)] 
    }
  }
}

export function mkMultipleAnswerQuizGenerator<T>(answerScope: T[]): MultipleAnswerQuizGenerator<T> {
  const answerScopeCopy = [...answerScope]
  return {
    nextQuiz(answerCount, choiceCount) {
      if (answerCount <= 0) {
        throw new Error(`answer number cannot less or equal than 0!`)
      }
      if (answerCount > answerScope.length) {
        throw new Error(`Requested answer number is bigger than answer set!`)
      }
      if (choiceCount > answerCount) {
        throw new Error('Choice number cannot be bigger than answer number!')
      }
      const shuffledAnswerScope = shuffle(answerScopeCopy)
      const choices = R.take(choiceCount, shuffledAnswerScope)

      const answers = R.take(answerCount, choices)
      return [answers, shuffle(choices)]
    },
  }
}