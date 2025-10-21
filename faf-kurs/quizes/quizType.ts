type Quiz = {
  id: string;
  name: string;
  description: string;
  quizQuestions: QuizQuestion[];
};

type QuizQuestion = {
  question: string;
  image: string;
  options: Record<string, string>;
  hints: string[];
  answer: string;
  explanation: string;
};
