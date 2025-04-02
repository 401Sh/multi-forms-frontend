import { useState } from "react"
import { QuestionType } from "../../enums/question.enum"
import { QuestionInterface } from "../../interfaces/question.interface"
import "../../styles/survey.style.scss"
import UpdateQuestion from "./UpdateQuestion"
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query"

type QuestType = {
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>,
  questionData: Partial<QuestionInterface>,
  onDeleteQuestion: (questionId: string) => void
}

function Question({ refetch, questionData, onDeleteQuestion  }: QuestType) {
  const { type, name, questionOptions, questionText } = questionData

  const [isUpdateQuestionModalOpen, setIsUpdateQuestionModalOpen] = useState(false)

  function handleDeleteQuestion() {
    onDeleteQuestion(questionData.id!)
  }

  const isOptionBased = type === QuestionType.RADIO || type === QuestionType.CHECK_BOX

  function handleUpdateQuestion() {
    setIsUpdateQuestionModalOpen(true)
  }

  function handleSaveQuestionUpdate() {
    refetch()
  }

  return (
    <div className={isOptionBased ? `${type.toLowerCase()}-options` : "text-question"}>
      <label>{name}</label>

      {isOptionBased ? (
        questionOptions?.map(option => (
          <div key={option.id} className={`${type.toLowerCase()}-option`}>
            <input type={type === QuestionType.RADIO ? "radio" : "checkbox"} id={option.id} />
            <label htmlFor={option.id}>{option.text}</label>
          </div>
        ))
      ) : (
        <p>{questionText}</p>
      )}

      <button className="add-question-btn" onClick={handleUpdateQuestion}>
        Update Question
      </button>

      <button className="delete-question-btn" onClick={handleDeleteQuestion}>
        Delete Question
      </button>

      {isUpdateQuestionModalOpen && (
        <UpdateQuestion
          data={questionData}
          onClose={() => setIsUpdateQuestionModalOpen(false)}
          onSave={handleSaveQuestionUpdate}
        />
      )}
    </div>
  )
}

export default Question