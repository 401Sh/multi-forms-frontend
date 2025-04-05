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
  const {
    type,
    name,
    questionOptions,
    questionText,
    answer,
    points,
    isMandatory
  } = questionData

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
      <label>Question: {name}</label>
      <p>Is Mandatory: {String(isMandatory)}</p>
      { questionText && <p>Text: {questionText}</p> }

      {isOptionBased ? (
        questionOptions?.sort((a, b) => a.position - b.position)
        .map(option => (
          <div key={option.id} className={`${type.toLowerCase()}-option`}>
            <label htmlFor={option.id}>{option.text}</label>
            <input
              type={type === QuestionType.RADIO ? "radio" : "checkbox"}
              id={option.id}
              name={questionData.id}
              checked={option.isCorrect}
              readOnly
            />
            <p>Is Correct Answer: {String(option.isCorrect)}</p>
          </div>
        ))
      ) : (
        <div>
          { answer && <p>Answer: {answer}</p> }
          <p>Points: {points}</p>
        </div>
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