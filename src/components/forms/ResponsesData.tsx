import { useParams, useSearchParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import { send_secure_request } from "../../api/authorized-request"
import ResponsesSheet from "./ResponsesSheet"
import { QuestionInterface } from "../../interfaces/question.interface"
import ResponsesChart from "./ResponsesChart"
import { JSX } from "react"

async function fetchResponses(
  setAuth: (isAuth: boolean) => void,
  surveyId: string,
) {
  const response = await send_secure_request(
    "get",
    `/surveys/${surveyId}/responses`,
    setAuth
  )
  return response
}

function ResponsesData({ questions }: { questions: QuestionInterface[] }) {
  const { surveyId } = useParams()
  const { setAuth } = useAuth()

  const [searchParams] = useSearchParams()
  const tab = searchParams.get("tab")
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["form", surveyId],
    queryFn: () => fetchResponses(setAuth, surveyId!),
    placeholderData: (prev) => prev
  })

  const currentTab = (tab ?? "").toLowerCase()
  
  const tabComponents: Record<string, JSX.Element> = {
    sheets: <ResponsesSheet data={data} questions={questions} />,
    charts: <ResponsesChart data={data} questions={questions} />
  }

  if (isLoading) {
    return <div className="container">Loading...</div>
  }
  if (isError) return <p>Error loading survey responses</p>

  return (
    <div className="container">
      <h2>responses</h2>
      {tabComponents[currentTab] ?? <div>Нет такой вкладки</div>}
    </div>
  )
}

export default ResponsesData