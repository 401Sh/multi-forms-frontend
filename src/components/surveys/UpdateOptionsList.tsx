import { QuestionType } from "../../enums/question.enum"
import { QuestionOption } from "../../interfaces/question-option.interface"

type CreateQuestionProps = {
  type: QuestionType,
  data: QuestionOption[],
  handleChange: React.Dispatch<React.SetStateAction<QuestionOption[] | undefined>>
}

function UpdateOptionsList({ type, data, handleChange }: CreateQuestionProps) {

  function handleAddOption() {
    const newOption: QuestionOption = {
      id: crypto.randomUUID(),
      position: data.length + 1,
      isCorrect: false,
      text: "",
      points: 0
    }
    handleChange([...data, newOption])
  }


  function handleDeleteOption(optionId: string) {
    handleChange(data.filter(option => option.id !== optionId))
  }

  
  function handleOptionChange(optionId: string, key: keyof QuestionOption, value: any) {
    handleChange(
      data.map(option =>
        option.id === optionId ? { ...option, [key]: value } : option
      )
    )
  }

  function handleCorrectChange(optionId: string) {
    if (type === QuestionType.RADIO) {
      handleChange(
        data.map(option => ({
          ...option,
          isCorrect: option.id === optionId
        }))
      )
    } else {
      handleChange(
        data.map(option =>
          option.id === optionId ? { ...option, isCorrect: !option.isCorrect } : option
        )
      )
    }
  }

  return (
    <div>
      <h3>Question Options:</h3>
      {data.map(option => (
        <div key={option.id} className="option-item">
          <input
            type="text"
            value={option.text}
            onChange={(e) => handleOptionChange(option.id, "text", e.target.value)}
            placeholder="Option text"
          />
          <input
            type="number"
            value={option.points || 0}
            onChange={(e) => handleOptionChange(option.id, "points", Number(e.target.value))}
            min="0"
          />

          {type === QuestionType.CHECK_BOX ? (
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={() => handleCorrectChange(option.id)}
            />
          ) : (
            <input
              type="radio"
              name="correctOption"
              checked={option.isCorrect}
              onChange={() => handleCorrectChange(option.id)}
            />
          )}
          
          <button className="cancel"  onClick={() => handleDeleteOption(option.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleAddOption}>Add Option</button>
    </div>
  )
}

export default UpdateOptionsList