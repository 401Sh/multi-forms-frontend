import { useParams } from "react-router"
import Constructor from "../components/surveys/Constructor"
import { createContext, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { send_secure_request } from "../api/authorized-request"
import { useAuth } from "../hooks/AuthProvider"

export const SurveyContext = createContext<string | undefined>(undefined)

async function fetchSurvey(setAuth: (isAuth: boolean) => void, surveyId: string) {
  const response = await send_secure_request("get", `/surveys/${surveyId}`, setAuth)
  return response.data
}

function SurveyPage() {
  const { surveyId } = useParams()
  const { setAuth } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => fetchSurvey(setAuth, surveyId!),
    enabled: !!surveyId,
  })

  if (isLoading) return <Suspense></Suspense>
  if (error) return <p>Error loading survey</p>

  return (
    <>
    <SurveyContext.Provider value={surveyId}>
      <h1>survey page</h1>
      <Constructor data={data}></Constructor>
    </SurveyContext.Provider>
    </>
  )
}

export default SurveyPage