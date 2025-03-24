import { SurveyInterface } from "./survey.interface";

export interface SurveyListInterface {
  surveys: SurveyInterface[],
  currentPage: number,
  totalPages: number,
  totalSurveys: number
}