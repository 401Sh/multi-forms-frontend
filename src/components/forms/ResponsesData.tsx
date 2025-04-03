import { useParams } from "react-router"
import { useAuth } from "../../hooks/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import { send_secure_request } from "../../api/authorized-request"
import { Suspense } from "react"
import ResponsesSheet from "./ResponsesSheet"
import { QuestionInterface } from "../../interfaces/question.interface"

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
  console.dir(questions,{depth:5})
  const { data, isLoading, isError } = useQuery({
    queryKey: ["form", surveyId],
    queryFn: () => fetchResponses(setAuth, surveyId!),
    placeholderData: (prev) => prev
  })
  console.dir(data, {depth:5})
  if (isLoading) return <Suspense></Suspense>
  if (isError) return <p>Error loading survey responses</p>

  return (
    <div className="container">
      <h2>responses</h2>
      <ResponsesSheet data={data} questions={questions} />
    </div>
  )
}

export default ResponsesData