import { Suspense, useEffect, useState } from "react"
import { send_secure_request } from "../api/authorized-request"
import { useNavigate, useParams } from "react-router"
import { useAuth } from "../hooks/AuthProvider"
import { useMutation, useQuery } from "@tanstack/react-query"
import { AnswerInterface } from "../interfaces/answer.interface"
import logger from "../utils/logger"
import "../styles/main.style.scss"
import { QuestionOption } from "../interfaces/question-option.interface"
import { QuestionInterface } from "../interfaces/question.interface"
import { SurveyInterface } from "../interfaces/survey.interface"
import { QuestionType } from "../enums/question.enum"

async function fetchForm(
  setAuth: (isAuth: boolean) => void,
  surveyId: string,
) {
  const response = await send_secure_request(
    "get",
    `/surveys/${surveyId}/form`,
    setAuth
  )
  return response
}

async function createFormRequest(
  setAuth: (isAuth: boolean) => void,
  surveyId: string,
  answersData: Partial<AnswerInterface>[]
) {
  const response = await send_secure_request(
    "post",
    `/surveys/${surveyId}/responses`,
    setAuth,
    undefined,
    { answers: answersData }
  )
  return response.data
}


function FormPage() {
  const [formData, setFormData] = useState<SurveyInterface>()
  const [answers, setAnswers] = useState<Partial<AnswerInterface>[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { surveyId } = useParams()
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["form", surveyId],
    queryFn: () => fetchForm(setAuth, surveyId!),
    placeholderData: (prev) => prev
  })

  useEffect(() => {
    if (data) {
      setFormData(data)
    }
    if (isError) {
      setErrorMessage(error.message)
    }
  }, [data])
  

  const updateMutation = useMutation({
    mutationFn: (answersData: Partial<AnswerInterface>[]) => 
      createFormRequest(setAuth, surveyId!, answersData),
    onSuccess: () => {
      logger.info("Form response created successfully")
      navigate("success")
    },
    onError: (error: any) => {
      logger.error("Error creating form response", error.response.data)
      setErrorMessage("Failed to create form response: " + error.response.data.message)
    }
  })


  function handleChange(questionId: string, value: string, type: QuestionType) {
    setAnswers((prev) => {
      const existingAnswer = prev.find((a) => a.questionId === questionId)
  
      if (type == QuestionType.TEXT) {
        // Обработка текстовых вопросов
        if (existingAnswer) {
          return prev.map((a) =>
            a.questionId === questionId ? { ...a, answerText: value } : a
          )
        }
        return [...prev, { questionId, answerText: value }]
      }
  
      // Обработка для чекбоксов и радиокнопок
      if (type == QuestionType.CHECK_BOX) {
        // Для чекбоксов (множественные ответы)
        if (existingAnswer) {
          return prev.map((a) =>
            a.questionId === questionId
              ? {
                  ...a,
                  answerOptions: a.answerOptions?.includes(value)
                    ? a.answerOptions.filter((v) => v !== value) // Убираем, если был
                    : [...(a.answerOptions || []), value], // Добавляем, если не было
                }
              : a
          )
        }
      }
  
      // Для радиокнопок (одиночный ответ)
      if (existingAnswer) {
        return prev.map((a) =>
          a.questionId === questionId
            ? { ...a, answerOptions: [value] } : a // Заменяем старый ответ на новый
        )
      }
  
      return [...prev, { questionId, answerOptions: [value] }]
    })
  }  


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Найти все обязательные вопросы
    const requiredQuestions = formData?.questions.filter((q) => q.isMandatory) || [];

    // Проверяем, есть ли ответы на обязательные вопросы
    const unansweredQuestions = requiredQuestions.filter((q) => {
      const answer = answers.find((a) => a.questionId === q.id)
      return !answer || (!answer.answerText && (!answer.answerOptions || answer.answerOptions.length === 0))
    })

    if (unansweredQuestions.length > 0) {
      setErrorMessage("All mandatory questions must be answered")
      return
    }
    console.dir(answers, {depth:5})
    updateMutation.mutate(answers)
  }


  if (isLoading) {
    return <Suspense fallback={<div>Loading...</div>} />
  }

  return (
    <form className="container">
      <h1>form page</h1>
      <h2>{formData?.name}</h2>
      <p>{formData?.description}</p>
      {formData?.questions.map((q: QuestionInterface) => (
        <div key={q.id} className="question">
          <label>
            {q.name} {q.isMandatory && "*"}
          </label>
          {q.type === "text" && (
            <input
              type="text"
              value={answers.find((a) => a.questionId === q.id)?.answerText || ""}
              onChange={(e) => handleChange(q.id, e.target.value, QuestionType.TEXT)}
              required={q.isMandatory}
            />
          )}
          {q.type === "checkbox" && (
            <div>
              {q.questionOptions!.map((opt: QuestionOption) => (
                <label key={opt.id}>
                  <input
                    type="checkbox"
                    checked={answers.find((a) => a.questionId === q.id)?.answerOptions?.includes(opt.id) || false}
                    onChange={() => handleChange(q.id, opt.id, QuestionType.CHECK_BOX)}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          )}
          {q.type === "radio" && (
            <div>
              {q.questionOptions!.map((opt: QuestionOption) => (
                <label key={opt.id}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={answers.find((a) => a.questionId === q.id)?.answerOptions?.includes(opt.id) || false}
                    onChange={() => handleChange(q.id, opt.id, QuestionType.RADIO)}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="button" type="submit" onClick={handleSubmit}>Отправить</button>
    </form>
  )
}

export default FormPage