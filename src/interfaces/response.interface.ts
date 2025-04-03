import { AnswerInterface } from "./answer.interface"

export interface ResponseInterface {
  id: string,
  score: number,
  totalPoints: number,
  createdAt: string,
  answers: AnswerInterface[]
}