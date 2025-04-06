import { useContext, useRef, useState } from "react"
import { SurveyContext } from "../../pages/SurveyPage"
import { useAuth } from "../../hooks/AuthProvider"
import { useMutation } from "@tanstack/react-query"
import { send_secure_request } from "../../api/authorized-request"
import logger from "../../utils/logger"
import { QuestionInterface } from "../../interfaces/question.interface"
import { QuestionType } from "../../enums/question.enum"
import UpdateOptionsList from "./UpdateOptionsList"

async function updateQuestionData(
  setAuth: (isAuth: boolean) => void,
  surveyId: string,
  questionId: string,
  updateData: Partial<QuestionInterface>
) {
  const response =  await send_secure_request(
    "patch",
    `/surveys/${surveyId}/questions/${questionId}`,
    setAuth,
    undefined,
    updateData
  )
  return response
}

type CreateQuestionProps = {
  data: Partial<QuestionInterface>,
  onClose: () => void,
  onSave: (newQuestion: Partial<QuestionInterface>) => void
}

function UpdateQuestion({ data, onClose, onSave }: CreateQuestionProps) {
  const [name, setName] = useState(data.name)
  const [position, setPosition] = useState(data.position)
  const [questionText, setQuestionText] = useState(data?.questionText || "")
  const [isMandatory, setIsMandatory] = useState(data?.isMandatory || false)
  const [answer, setAnswer] = useState(data?.answer || "")
  const [points, setPoints] = useState(data?.points || 0)
  const [questionOptions, setQuestionOptions] = useState(data.questionOptions)
  const [error, setError] = useState<string | null>(null)

  const questionIdRef = useRef(data.id!)
  const surveyId = useContext(SurveyContext) as string
  const { setAuth } = useAuth()

  const mutation = useMutation({
    mutationFn: (updateData: Partial<QuestionInterface>) => 
      updateQuestionData(setAuth, surveyId, questionIdRef.current, updateData),
    onSuccess: (data) => {
      logger.info("Question updated successfully", data)
      onSave(data)
      onClose()
    },
    onError: (error) => {
      logger.error("Error updating question", error)
      setError("Error updating question")
    }
  })

  function handleSave() {
    const updateData: Partial<QuestionInterface> = {
      name,
      position,
      questionText,
      isMandatory
    }

    if (data.type === QuestionType.TEXT) {
      updateData.answer = answer
      updateData.points = points
    } else if (data.type === QuestionType.RADIO || data.type === QuestionType.CHECK_BOX) {
      updateData.questionOptions = questionOptions
    }
    
    mutation.mutate(updateData)
  }

  return (
    <div className="modal-window">
    <div className="modal-content">
      
    <h2>Update Question Data</h2>
      <div>
        <label htmlFor="questionName">Question Name:</label>
        <input
          type="text"
          id="questionName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter question name"
        />
      </div>
      <div>
        <label htmlFor="questionText">Question Text:</label>
        <input
          type="text"
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question text"
        >
        </input>
      </div>
      <div className="radio-option">
        <label htmlFor="mandatoryType">is Question Mandatory?</label>
        <div>
          <input
            type="radio"
            id="mandatory-true"
            name="mandatoryType"
            value="true"
            checked={isMandatory === true}
            onChange={(e) => setIsMandatory(e.target.value === "true")}
          />
          <label htmlFor="mandatory-true">Yes</label>
        </div>
        <div>
          <input
            type="radio"
            id="mandatory-false"
            name="mandatoryType"
            value="false"
            checked={isMandatory === false}
            onChange={(e) => setIsMandatory(e.target.value === "true")}
          />
          <label htmlFor="mandatory-false">No</label>
        </div>
      </div>
      <div>
        <label
          htmlFor="questionPosition"
        >
          Question Position:
        </label>
        <input
          type="number"
          id="questionPosition"
          value={position}
          onChange={(e) => setPosition(Math.max(1, Number(e.target.value)))}
          min="1"
        />
      </div>

      {data.type === QuestionType.TEXT ? (
        <div className="question-extra">
          <div>
            <label htmlFor="answer">Correct Answer:</label>
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter answer"
            />
          </div>
          <div>
            <label htmlFor="questionPoints">
              Question Points:
            </label>
            <input
              type="number"
              id="questionPoints"
              value={points}
              onChange={(e) => setPoints(Math.max(1, Number(e.target.value)))}
              min="0"
            />
          </div>
        </div>
      ) : (
        <UpdateOptionsList
          type={data.type!}
          data={questionOptions!}
          handleChange={setQuestionOptions}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="modal-actions">
        <button onClick={handleSave}>Save</button>
        <button className="cancel" onClick={onClose}>Cancel</button>
      </div>

    </div>
    </div>
  )
}

export default UpdateQuestion