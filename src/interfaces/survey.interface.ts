import { SurveyAccess } from "../enums/survey.enum"
import { QuestionInterface } from "./question.interface"

export interface SurveyInterface {
  id: string,
  name: string,
  description: string,
  isPublished: boolean,
  access: SurveyAccess,
  totalPoints: number,
  questions: QuestionInterface[]
}