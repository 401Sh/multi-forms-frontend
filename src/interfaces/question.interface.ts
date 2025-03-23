import { QuestionType } from "../enums/question.enum"
import { QuestionOption } from "./question-option.interface"

export interface QuestionInterface {
  id: string,
  name: string,
  position: number,
  questionText?: string,
  isMandatory: boolean,
  answer?: string,
  points?: number,
  type: QuestionType,
  questionOptions?: QuestionOption[]
}