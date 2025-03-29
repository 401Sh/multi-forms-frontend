import { Suspense, useContext, useState } from "react"
import logger from "../../utils/logger"
import { useMutation, useQuery } from "@tanstack/react-query"
import { SurveyContext } from "../../pages/SurveyPage"
import CreateQuestion from "./CreateQuestion"
import Question from "./Question"
import "../../styles/survey.style.scss"
import { send_secure_request } from "../../api/authorized-request"
import { useAuth } from "../../hooks/AuthProvider"
import { QuestionInterface } from "../../interfaces/question.interface"

async function fetchSurvey(setAuth: (isAuth: boolean) => void, surveyId: string) {
  const response = await send_secure_request("get", `/surveys/${surveyId}`, setAuth)
  return response
}

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

function Constructor() {
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] = useState(false)

  const surveyId = useContext(SurveyContext) as string
  const { setAuth } = useAuth()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => fetchSurvey(setAuth, surveyId!),
    enabled: !!surveyId,
  })

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) => deleteQuestionRequest(setAuth, surveyId, questionId),
    onSuccess: (_data) => {
      logger.info("Question deleted successfully")
      refetch()
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

  function handleSaveNewQuestion() {
    refetch()
  }

  if (isLoading) return <Suspense></Suspense>
  if (error) return <p>Error loading survey</p>
  
  return (
    <div className="survey">
      <div className="survey-header">
        <button className="add-question-btn" onClick={handleAddQuestion}>Add Question</button>
      </div>

      {data.questions.map((q: Partial<QuestionInterface>) => (
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