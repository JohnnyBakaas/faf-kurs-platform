"use client";

import { useState } from "react";

const NewQuizPage = () => {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([
    {
      question: "",
      image: "",
      options: {},
      hints: [],
      answer: "",
      explanation: "",
    },
  ]);
  return (
    <main>
      {quiz.map((e, i) => (
        <QuizQuestionCard key={i} data={e} />
      ))}
    </main>
  );
};

export default NewQuizPage;

const QuizQuestionCard = ({ data }: { data: QuizQuestion }) => {
  return <section></section>;
};
