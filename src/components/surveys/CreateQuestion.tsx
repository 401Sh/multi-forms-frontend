import { useContext, useState } from "react"
import { QuestionType } from "../../enums/question.enum"
import { QuestionInterface } from "../../interfaces/question.interface"
import { SurveyContext } from "../../pages/SurveyPage"
import { useMutation } from "@tanstack/react-query"
import logger from "../../utils/logger"
import "../../styles/modal.style.scss"
import { send_secure_request } from "../../api/authorized-request"
import { useAuth } from "../../hooks/AuthProvider"

async function createQuestionRequest(
  setAuth: (isAuth: boolean) => void,
  surveyId: string,
  questionData: Partial<QuestionInterface>
) {
  const response =  await send_secure_request(
    "post",
    `/surveys/${surveyId}/questions`,
    setAuth,
    undefined,
    questionData
  )
  return response
}

type CreateQuestionProps = {
  onClose: () => void,
  onSave: (newQuestion: Partial<QuestionInterface>) => void
}

function CreateQuestion({ onClose, onSave }: CreateQuestionProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<QuestionType>(QuestionType.TEXT)
  const [position, setPosition] = useState(1)
  const [error, setError] = useState<string | null>(null)
  
  const surveyId = useContext(SurveyContext) as string
  const { setAuth } = useAuth()

  const mutation = useMutation({
    mutationFn: (newQuestion: Partial<QuestionInterface>) => 
      createQuestionRequest(setAuth, surveyId, newQuestion),
    onSuccess: (data) => {
      logger.info("Question created successfully", data)
      onSave(data)
      onClose()
    },
    onError: (error) => {
      logger.error("Error creating question", error)
      setError("Error creating question")
    }
  })
  
  
  function handleSave() {
    if (!name.trim()) {
      logger.error("Question name is required")
      setError("Question name is required")
      return
    }

    const newQuestion = {
      name,
      type,
      position
    }
    
    mutation.mutate(newQuestion)
  }

  return (
    <div className="modal-window">
    <div className="modal-content">

      <h2>Create New Question</h2>
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
        <label htmlFor="questionType">Question Type:</label>
        <select
          id="questionType"
          value={type}
          onChange={(e) => setType(e.target.value as QuestionType)}
        >
          <option value={QuestionType.TEXT}>Text</option>
          <option value={QuestionType.RADIO}>Radio</option>
          <option value={QuestionType.CHECK_BOX}>Checkbox</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="questionPosition"
        >
          Question Position:</label>
        <input
          type="number"
          id="questionPosition"
          value={position}
          onChange={(e) => setPosition(Math.max(1, Number(e.target.value)))}
          min="1"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="modal-actions">
        <button onClick={handleSave}>Save</button>
        <button className="cancel" onClick={onClose}>Cancel</button>
      </div>

    </div>
    </div>
  )
}

export default CreateQuestion
