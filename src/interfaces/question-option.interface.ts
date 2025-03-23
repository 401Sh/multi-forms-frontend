export interface QuestionOption {
  id: string,
  position: number,
  isCorrect: boolean,
  points?: number,
  text: string
}