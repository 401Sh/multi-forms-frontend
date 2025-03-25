import { useContext, useState } from "react"
import { QuestionInterface } from "../../interfaces/question.interface"
import logger from "../../utils/logger"
import { useMutation } from "@tanstack/react-query"
import { SurveyContext } from "../../pages/SurveyPage"
import axiosPrivate from "../../utils/axios-private"
import CreateQuestion from "./CreateQuestion"
import Question from "./Question"
import "../../styles/survey.style.scss"
import { SurveyInterface } from "../../interfaces/survey.interface"

async function deleteQuestionRequest(surveyId: string, questionId: string) {
  const response = await axiosPrivate.delete(`/surveys/${surveyId}/questions/${questionId}`)
  return response.data
}

function Constructor({ data }: { data: SurveyInterface }) {
  const [questions, setQuestions] = useState<Partial<QuestionInterface>[]>(data.questions)
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] = useState(false)

  const surveyId = useContext(SurveyContext) as string

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) => deleteQuestionRequest(surveyId, questionId),
    onSuccess: (_data, questionId: string) => {
      logger.info("Question deleted successfully")
      setQuestions(questions.filter(q => q.id !== questionId))
    },
    onError: (error) => {
      logger.error("Error deleting question", error)
    }
  })

  function handleAddQuestion() {
    setIsCreateQuestionModalOpen(true)
  }

  function handleDeleteQuestion(questionId: string) {
    deleteMutation.mutate(questionId)
  }

  function handleSaveNewQuestion(newQuestion: Partial<QuestionInterface>) {
    setQuestions([...questions, newQuestion])
  }
  
  return (
    <div className="survey">
      <div className="survey-header">
        <button className="add-question-btn" onClick={handleAddQuestion}>Add Question</button>
      </div>

      {questions.map(q => (
        <div key={q.id} className="question">
          <Question
            questionData={q}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </div>
      ))}

      {isCreateQuestionModalOpen && (
        <CreateQuestion
          onClose={() => setIsCreateQuestionModalOpen(false)}
          onSave={handleSaveNewQuestion}
        />
      )}
    </div>
  )
}

export default Constructor