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
  // Сопоставляем опции с их текстами
  const sheetHeader: SheetHeader[] = []

  questions.forEach((q) => {
    if (q.type !== QuestionType.TEXT) {
      const options: { id: string, text: string }[] = []
      q.questionOptions!.forEach((qo) => {
        options.push({ id: qo.id, text: qo.text })
      })
      const optionsAmount = q.questionOptions!.length
      sheetHeader.push({ id: q.id, optionsAmount, name: q.name, options })
    } else {
      sheetHeader.push({ id: q.id, optionsAmount: 1, name: q.name, options: null })
    }
  })
  console.log("//////////////////////")
  console.dir(sheetHeader, {depth: 5})
  console.log("//////////////////////")

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
      <tbody>
        {data.map((response) => (
          <tr key={response.id}>
            <td>{response.id}</td>
            <td>{response.score}</td>
            <td>{response.totalPoints}</td>
            <td>{response.createdAt}</td>
            {sheetHeader.map((q) => {
              const answer = response.answers.find((a) => a.questionId === q.id)

              if (q.options) {
                // Вопрос с опциями — выделяем каждую опцию в свою ячейку
                return q.options.map((o) => (
                  <td key={o.id}>{answer?.answerOptions?.includes(o.id) ? '✔️' : '❌'}</td>
                ))
              } else {
                // Вопрос с текстовым ответом
                return <td key={q.id}>{answer?.answerText || ''}</td>
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ResponsesSheet


// import { ResponseInterface } from "../../interfaces/response.interface"

// type SheetProps = {
//   data: ResponseInterface[]
// }

// function ResponsesSheet({ data }: SheetProps) {
//   const questionIds = new Set<string>()
//   const optionIds = new Set<string>()

//   data.forEach((item) => {
//     item.answers.forEach((answer) => {
//       questionIds.add(answer.questionId);
//       answer.answerOptions?.forEach((option) => optionIds.add(option))
//     })
//   })

//   const questionColumns = Array.from(questionIds)
//   const optionColumns = Array.from(optionIds)

//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Очки</th>
//           <th>Всего очков</th>
//           <th>Дата создания</th>
//           {questionColumns.map((qid) => (
//             <th key={qid}>Вопрос {qid}</th>
//           ))}
//           {optionColumns.map((oid) => (
//             <th key={oid}>Опция {oid}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data?.map((item) => (
//           <tr key={item.id}>
//             <td>{item.id}</td>
//             <td>{item.score}</td>
//             <td>{item.totalPoints}</td>
//             <td>{new Date(item.createdAt).toLocaleString()}</td>
//             {questionColumns.map((qid) => {
//               const answer = item.answers.find((a) => a.questionId === qid);
//               return <td key={qid}>{answer ? answer.answerText || "Нет ответа" : "-"}</td>;
//             })}
//             {optionColumns.map((oid) => {
//               const hasOption = item.answers.some((answer) =>
//                 answer.answerOptions?.some((option) => option === oid)
//               );
//               return <td key={oid}>{hasOption ? "✔" : "-"}</td>;
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }

// export default ResponsesSheet