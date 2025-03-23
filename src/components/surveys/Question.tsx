import { QuestionType } from "../../enums/question.enum"
import { QuestionInterface } from "../../interfaces/question.interface"
import "../../styles/survey.style.scss"

type QuestType = {
  questionData: Partial<QuestionInterface>,
  onDeleteQuestion: (questionId: string) => void
}

function Question({ questionData, onDeleteQuestion  }: QuestType) {
  const data = questionData

  function handleDeleteQuestion() {
    onDeleteQuestion(questionData.id!)
  }

  if (data.type === QuestionType.RADIO) {
    return (
      <div className="radio-options">
        <label>{data.name}</label>
        {data.questionOptions?.map(option => (
          <div key={option.id} className="radio-option">
            <input type="radio" id={option.id} />
            <label htmlFor={option.id}>{option.text}</label>
          </div>
        ))}
        <button className="delete-question-btn" onClick={handleDeleteQuestion}>Delete Question</button>
      </div>
    )
  }

  if (data.type === QuestionType.CHECK_BOX) {
    return (
      <div className="checkbox-options">
        <label>{data.name}</label>
        {data.questionOptions?.map(option => (
          <div key={option.id} className="checkbox-option">
            <input type="checkbox" id={option.id} />
            <label htmlFor={option.id}>{option.text}</label>
          </div>
        ))}
        <button className="delete-question-btn" onClick={handleDeleteQuestion}>Delete Question</button>
      </div>
    )
  }

  return (
    <div>
      <label>{data.name}</label>
      <p>{data.questionText}</p>
      <button className="delete-question-btn" onClick={handleDeleteQuestion}>Delete Question</button>
    </div>
  )
}

export default Question