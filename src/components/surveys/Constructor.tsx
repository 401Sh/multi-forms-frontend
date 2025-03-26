import { useContext, useState } from "react"
import { QuestionInterface } from "../../interfaces/question.interface"
import logger from "../../utils/logger"
import { useMutation } from "@tanstack/react-query"
import { SurveyContext } from "../../pages/SurveyPage"
import CreateQuestion from "./CreateQuestion"
import Question from "./Question"
import "../../styles/survey.style.scss"
import { SurveyInterface } from "../../interfaces/survey.interface"
import { send_secure_request } from "../../api/authorized-request"
import { useAuth } from "../../hooks/AuthProvider"

async function deleteQuestionRequest(
  setAuth: (isAuth: boolean) => void,
  surveyId: string,
  questionId: string
) {
  const response = await send_secure_request(
    "delete",
    `/surveys/${surveyId}/questions/${questionId}`,
    setAuth
  )
  return response.data
}

function Constructor({ data }: { data: SurveyInterface }) {
  const [questions, setQuestions] = useState<Partial<QuestionInterface>[]>(data.questions)
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] = useState(false)

  const surveyId = useContext(SurveyContext) as string
  const { setAuth } = useAuth()

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) => deleteQuestionRequest(setAuth, surveyId, questionId),
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