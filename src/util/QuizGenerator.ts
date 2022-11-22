import _ from "lodash"
import { shuffle } from "./CollectionUtil"

export type SAQG<T> = {
  choices(): T[],
  nextQuiz(choiceCount: number): [answer: T, choices: T[]]
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

      // no need to provide a equal function because it only should check if they are a same reference. 
      if (answer === lastAnswer) {
        return this.nextQuiz(choiceCount)
      }
      lastAnswer = answer
      return [answer, shuffle(choices)] 
    }
  }
}

