import { useNavigate, useParams, useSearchParams } from "react-router"
import Constructor from "../components/surveys/Constructor"
import { createContext, useState } from "react"
import UpdateSurvey from "../components/surveys/UpdateSurvey"
import { send_secure_request } from "../api/authorized-request"
import { useAuth } from "../hooks/AuthProvider"
import { useMutation, useQuery } from "@tanstack/react-query"
import "../styles/tab.style.scss"
import ResponsesData from "../components/forms/ResponsesData"
import ErrorBoundary from "../utils/error-boundary"
import logger from "../utils/logger"

export const SurveyContext = createContext<string | undefined>(undefined)

async function fetchSurvey(setAuth: (isAuth: boolean) => void, surveyId: string) {
  const response = await send_secure_request("get", `/surveys/${surveyId}`, setAuth)
  return response
}


async function deleteSurveyRequest(
  setAuth: (isAuth: boolean) => void,
  surveyId: string
) {
  const response = await send_secure_request(
    "delete",
    `/surveys/${surveyId}`,
    setAuth
  )
  return response.data
}

function SurveyPage() {
  const [isUpdateSurveyModalOpen, setIsUpdateSurveyModalOpen] = useState(false)

  const navigate = useNavigate()
  const { surveyId } = useParams()
  const { setAuth } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "constructor"

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => fetchSurvey(setAuth, surveyId!),
    enabled: !!surveyId,
    placeholderData: (prev) => prev
  })

  const deleteMutation = useMutation({
    mutationFn: (surveyId: string) => deleteSurveyRequest(setAuth, surveyId),
    onSuccess: () => {
      logger.info("Survey deleted successfully")
      navigate(`/surveys/self`)
    },
    onError: (error) => {
      logger.error("Error deleting survey", error)
    }
  })

  function handleUpdateSurvey() {
    setIsUpdateSurveyModalOpen(true)
  }

  function handleDeleteSurvey() {
    deleteMutation.mutate(surveyId!)
  }

  function handleSaveUpdateSurvey() {
    refetch()
  }

  function changeTab(tab: string) {
    setSearchParams({ tab })
  }

  if (isLoading) {
    return <div className="container">Loading...</div>
  }  
  if (isError) return <p>Error loading survey</p>

  return (
    <div className="container">
    <SurveyContext.Provider value={surveyId}>
      <h1>survey page</h1>

      <div className="tabs">
        <button onClick={() => changeTab("constructor")} className={activeTab === "constructor" ? "active" : ""}>
          Constructor
        </button>
        <button onClick={() => changeTab("responses")} className={activeTab === "responses" ? "active" : ""}>
          Responses
        </button>
      </div>

      <h2>Name: {data.name}</h2>
      { activeTab === "constructor" &&
      <>
        { data.description && <h2>Description: {data.description}</h2> }
        <h2>Published: {String(data.isPublished)}</h2>
        <h2>Access type: {data.access}</h2>
        
        <button
          className="add-question-btn"
          onClick={handleUpdateSurvey}
        >
          Update Survey
        </button>

        <button
          className="delete-question-btn"
          onClick={handleDeleteSurvey}
        >
          Delete Survey
        </button>

        <Constructor
          refetch={refetch}
          questionsData={data.questions}
        />
      </> }

      {activeTab === "responses" && (
          <ResponsesData questions={data.questions}/>
      )}

      {isUpdateSurveyModalOpen && (
        <UpdateSurvey
          data={data}
          onClose={() => setIsUpdateSurveyModalOpen(false)}
          onSave={handleSaveUpdateSurvey}
        />
      )}

    </SurveyContext.Provider>
    </div>
  )
}

function TestSurveyPage() {
  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <SurveyPage></SurveyPage>
    </ErrorBoundary>
  )
}

export default TestSurveyPage