import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { QuestionType } from "../../enums/question.enum";
import { QuestionInterface } from "../../interfaces/question.interface";
import { ResponseInterface } from "../../interfaces/response.interface";

type ChartProps = {
  data: ResponseInterface[];
  questions: QuestionInterface[];
};

function ResponsesChart({ data, questions }: ChartProps) {
  const chartData = useMemo(() => {
    const results: { [questionId: string]: { [optionId: string]: number } } = {}

    questions.forEach((q) => {
      if (q.type === QuestionType.TEXT) return

      results[q.id] = {}
      q.questionOptions?.forEach((option) => {
        results[q.id][option.id] = 0
      })
    })

    data.forEach((response) => {
      response.answers.forEach((answer) => {
        if (results[answer.questionId] && answer.answerOptions) {
          answer.answerOptions.forEach((optId) => {
            results[answer.questionId][optId]++
          });
        }
      })
    })

    return questions
      .filter((q) => q.type !== QuestionType.TEXT)
      .map((q) => ({
        question: q.name,
        ...Object.fromEntries(
          q.questionOptions!.map((opt) => [opt.text, results[q.id][opt.id] || 0])
        ),
      }))
  }, [data, questions])

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="question" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {questions
            .filter((q) => q.type !== QuestionType.TEXT)
            .flatMap((q) =>
              q.questionOptions!.map((opt) => (
                <Bar key={opt.id} dataKey={opt.text} fill="#8884d8" />
              ))
            )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ResponsesChart
