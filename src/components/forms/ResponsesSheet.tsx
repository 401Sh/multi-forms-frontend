import { useMemo } from "react"
import { QuestionType } from "../../enums/question.enum"
import { QuestionInterface } from "../../interfaces/question.interface"
import { ResponseInterface } from "../../interfaces/response.interface"
import "../../styles/table.style.scss"

type SheetHeader = {
  id: string,
  optionsAmount: number,
  name: string,
  options: { id: string, text: string }[] | null
}

type SheetProps = {
  data: ResponseInterface[],
  questions: QuestionInterface[]
}

function ResponsesSheet({ data, questions }: SheetProps) {
  
  if (!Array.isArray(data)) {
    return <div>No data available</div>;
  }

  const sheetHeader = useMemo<SheetHeader[]>(() => {
    return questions.map((q) => ({
      id: q.id,
      optionsAmount: q.type !== QuestionType.TEXT ? q.questionOptions!.length : 1,
      name: q.name,
      options: q.type !== QuestionType.TEXT
        ? q.questionOptions!.map((qo) => ({ id: qo.id, text: qo.text }))
        : null,
    }));
  }, [questions])

  // Оптимизация данных таблицы
  const tableRows = useMemo(() => {
    return data.map((response) => (
      <tr key={response.id}>
        <td>{response.id}</td>
        <td>{response.score}</td>
        <td>{response.totalPoints}</td>
        <td>{response.createdAt}</td>
        {sheetHeader.map((q) => {
          const answer = response.answers.find((a) => a.questionId === q.id);

          if (q.options) {
            return q.options.map((o) => (
              <td key={o.id}>{answer?.answerOptions?.includes(o.id) ? "✔️" : "❌"}</td>
            ))
          } else {
            return <td key={q.id}>{answer?.answerText || ""}</td>
          }
        })}
      </tr>
    ))
  }, [data, sheetHeader])

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Очки</th>
          <th>Всего очков</th>
          <th>Дата создания</th>
          {sheetHeader.map((q) => (
            <th key={q.id} colSpan={q.optionsAmount}>{q.name}</th>
          ))}
        </tr>
        <tr>
          <th colSpan={4}></th>
          {sheetHeader.map((q) =>
            q.options
              ? q.options.map((o) => <th key={o.id}>{o.text}</th>)
              : <th key={q.id}></th>
          )}
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  )
}

export default ResponsesSheet