import { RNG } from "@/monads/RNG"
import _ from "lodash"

export type QuizGenerator<T> = RNG<[answer: T, choices: T[]]>

export function mkQuizGenerator<T>(choiceCount: number, answerScope: T[]): QuizGenerator<T> {
  return RNG.shuffle(answerScope).flatMap(shuffledAnswers => {
    const choices = _.take(shuffledAnswers, choiceCount)
    const answer = choices[0]
    return RNG.shuffle(choices).map(shuffledChoices => [answer, shuffledChoices])
  })
}