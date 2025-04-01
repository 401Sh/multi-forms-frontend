import { useParams } from "react-router"
import Constructor from "../components/surveys/Constructor"
import { createContext, Suspense, useState } from "react"
import UpdateSurveyData from "../components/surveys/UpdateSurveyData"
import { send_secure_request } from "../api/authorized-request"
import { useAuth } from "../hooks/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import "../styles/main.style.scss"

export const SurveyContext = createContext<string | undefined>(undefined)

async function fetchSurvey(setAuth: (isAuth: boolean) => void, surveyId: string) {
  const response = await send_secure_request("get", `/surveys/${surveyId}`, setAuth)
  return response
}

function SurveyPage() {
  const [isUpdateSurveyModalOpen, setIsUpdateSurveyModalOpen] = useState(false)

  const { surveyId } = useParams()
  const { setAuth } = useAuth()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => fetchSurvey(setAuth, surveyId!),
    enabled: !!surveyId,
  })

  function handleUpdateSurvey() {
    setIsUpdateSurveyModalOpen(true)
  }

  function handleSaveUpdateSurvey() {
    refetch()
  }

  if (isLoading) return <Suspense></Suspense>
  if (error) return <p>Error loading survey</p>

  return (
    <div className="container">
    <SurveyContext.Provider value={surveyId}>
      <h1>survey page</h1>
      <h2>Name: {data.name}</h2>
      <h2>Description: {data.description}</h2>
      <h2>Published: {String(data.isPublished)}</h2>
      <h2>Access type: {data.access}</h2>
      
      <button
        className="add-question-btn"
        onClick={handleUpdateSurvey}
      >
        Update Survey
      </button>
      <Constructor
        refetch={refetch}
        questionsData={data.questions}
      >
      </Constructor>

      {isUpdateSurveyModalOpen && (
        <UpdateSurveyData
          data={data}
          onClose={() => setIsUpdateSurveyModalOpen(false)}
          onSave={handleSaveUpdateSurvey}
        />
      )}

    </SurveyContext.Provider>
    </div>
  )
}

export default SurveyPage