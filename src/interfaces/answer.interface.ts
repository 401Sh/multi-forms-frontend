import { QuestionType } from "../enums/question.enum"

export interface AnswerInterface {
  id: string,
  questionId: string,
  answerText?: string,
  answerId: string,
  type: QuestionType,
  answerOptions?: string[]
}