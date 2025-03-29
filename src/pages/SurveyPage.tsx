import { useParams } from "react-router"
import Constructor from "../components/surveys/Constructor"
import { createContext, Suspense } from "react"

export const SurveyContext = createContext<string | undefined>(undefined)

function SurveyPage() {
  const { surveyId } = useParams()

  return (
    <>
    <SurveyContext.Provider value={surveyId}>
      <h1>survey page</h1>
      <Constructor></Constructor>
    </SurveyContext.Provider>
    </>
  )
}

export default SurveyPage