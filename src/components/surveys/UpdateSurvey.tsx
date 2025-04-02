import { useContext, useState } from "react"
import { SurveyInterface } from "../../interfaces/survey.interface"
import { SurveyContext } from "../../pages/SurveyPage"
import { useAuth } from "../../hooks/AuthProvider"
import { useMutation } from "@tanstack/react-query"
import { send_secure_request } from "../../api/authorized-request"
import logger from "../../utils/logger"
import { SurveyAccess } from "../../enums/survey.enum"

async function updateSurveyData(
  setAuth: (isAuth: boolean) => void,
  surveyId: string,
  updateData: Partial<SurveyInterface>
) {
  const response =  await send_secure_request(
    "patch",
    `/surveys/${surveyId}`,
    setAuth,
    undefined,
    updateData
  )
  return response
}

type CreateQuestionProps = {
  data: Omit<SurveyInterface, "questions">,
  onClose: () => void,
  onSave: (newQuestion: Partial<SurveyInterface>) => void
}

function UpdateSurvey({ data, onClose, onSave }: CreateQuestionProps) {
  const [name, setName] = useState(data.name)
  const [description, setDescription] = useState(data.description)
  const [isPublished, setIsPublished] = useState(data.isPublished)
  const [access, setAccess] = useState(data.access)
  const [error, setError] = useState<string | null>(null)

  const surveyId = useContext(SurveyContext) as string
  const { setAuth } = useAuth()

  const mutation = useMutation({
    mutationFn: (updateData: Partial<SurveyInterface>) => 
      updateSurveyData(setAuth, surveyId, updateData),
    onSuccess: (data) => {
      logger.info("Survey updated successfully", data)
      onSave(data)
      onClose()
    },
    onError: (error) => {
      logger.error("Error updating survey", error)
      setError("Error updating survey")
    }
  })

  function handleSave() {
    const updateData = {
      name,
      description,
      isPublished,
      access
    }
    
    mutation.mutate(updateData)
  }

  return (
    <div className="modal-window">
    <div className="modal-content">
      
    <h2>Update Survey Data</h2>
      <div>
        <label htmlFor="surveyName">Survey Name:</label>
        <input
          type="text"
          id="surveyName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter survey name"
        />
      </div>
      <div>
        <label htmlFor="surveyDescription">Survey Description:</label>
        <input
          type="text"
          id="surveyDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter survey description"
        >
        </input>
      </div>
      <div className="radio-option">
        <label htmlFor="publishedType">Publish Survey?</label>
        <div>
          <input
            type="radio"
            id="published-true"
            name="publishedType"
            value="true"
            checked={isPublished === true}
            onChange={(e) => setIsPublished(e.target.value === "true")}
          />
          <label htmlFor="published-true">Yes</label>
        </div>
        <div>
          <input
            type="radio"
            id="published-false"
            name="publishedType"
            value="false"
            checked={isPublished === false}
            onChange={(e) => setIsPublished(e.target.value === "true")}
          />
          <label htmlFor="published-false">No</label>
        </div>
      </div>
      <div>
        <label htmlFor="accessType">Access Type:</label>
        <select
          id="accessType"
          value={access}
          onChange={(e) => setAccess(e.target.value as SurveyAccess)}
        >
          <option value={SurveyAccess.PUBLIC}>Public</option>
          <option value={SurveyAccess.LINK}>Link</option>
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>

    </div>
    </div>
  )
}

export default UpdateSurvey