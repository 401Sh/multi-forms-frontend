import { useParams } from "react-router"
import Constructor from "../components/surveys/Constructor"
import { createContext, Suspense } from "react"
import axiosInstance from "../utils/axios-instance"
import { useQuery } from "@tanstack/react-query"

export const SurveyContext = createContext<string | undefined>(undefined)

async function fetchSurvey(surveyId: string) {
  const response = await axiosInstance.get(`/surveys/${surveyId}`)
  return response.data
}

function SurveyPage() {
  const { surveyId } = useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => fetchSurvey(surveyId!),
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