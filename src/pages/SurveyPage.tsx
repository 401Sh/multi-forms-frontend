import { useParams, useSearchParams } from "react-router"
import Constructor from "../components/surveys/Constructor"
import { createContext, Suspense, useState } from "react"
import UpdateSurvey from "../components/surveys/UpdateSurvey"
import { send_secure_request } from "../api/authorized-request"
import { useAuth } from "../hooks/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import "../styles/main.style.scss"
import "../styles/tab,style.scss"
import ResponseData from "../components/forms/ResponseData"

export const SurveyContext = createContext<string | undefined>(undefined)

async function fetchSurvey(setAuth: (isAuth: boolean) => void, surveyId: string) {
  const response = await send_secure_request("get", `/surveys/${surveyId}`, setAuth)
  return response
}

function SurveyPage() {
  const [isUpdateSurveyModalOpen, setIsUpdateSurveyModalOpen] = useState(false)

  const { surveyId } = useParams()
  const { setAuth } = useAuth()

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "constructor"

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => fetchSurvey(setAuth, surveyId!),
    enabled: !!surveyId,
    placeholderData: (prev) => prev
  })

  function handleUpdateSurvey() {
    setIsUpdateSurveyModalOpen(true)
  }

  function handleSaveUpdateSurvey() {
    refetch()
  }

  function changeTab(tab: string) {
    setSearchParams({ tab })
  }

  if (isLoading) return <Suspense></Suspense>
  if (error) return <p>Error loading survey</p>

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
        />
      </> }

      {activeTab === "responses" && (
          <ResponseData />
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

export default SurveyPage