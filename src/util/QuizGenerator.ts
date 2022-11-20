import _ from "lodash"
import { shuffle } from "./CollectionUtil"

export type SAQG<T> = {
  choices(): T[],
  nextQuiz(choiceCount: number): [answer: T, choices: T[]]
}

export type MAQG<T> = {
  choices(): T[],
  nextQuiz(answerCount: number, choiceCount: number): [answers: T[], choices: T[]]
}


export function mkSAQG<T>(answerScope: T[]): SAQG<T> {
  const answerScopeCopy = [...answerScope]
  let lastAnswer: T | null = null;
  return {
    choices() {return answerScopeCopy},
    nextQuiz(choiceCount) {
      const shuffledAnswerScope = shuffle(answerScopeCopy)
      const choices = _.take(shuffledAnswerScope, choiceCount)
      const answer = choices[0]
      if (answer === lastAnswer) {
        return this.nextQuiz(choiceCount)
      }
      lastAnswer = answer
      return [answer, shuffle(choices)] 
    }
  }
}

export function mkMAQG<T>(answerScope: T[]): MAQG<T> {
  const answerScopeCopy = [...answerScope]
  return {
    choices() {return answerScopeCopy},
    nextQuiz(answerCount, choiceCount) {
      if (answerCount <= 0) {
        throw new Error(`answer number cannot less or equal than 0!`)
      }
      
      if (choiceCount > answerCount) {
        throw new Error('Choice number cannot be bigger than answer number!')
      }
      const shuffledAnswerScope = shuffle(answerScopeCopy)
      const choices = _.take(shuffledAnswerScope, choiceCount)

      const answers = _.take(choices, answerCount)
      return [answers, shuffle(choices)]
    },
  }
}

