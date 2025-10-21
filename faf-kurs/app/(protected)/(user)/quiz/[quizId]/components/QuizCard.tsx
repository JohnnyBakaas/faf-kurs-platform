"use client";

import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import type { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

type QuizCardProps = {
  quiz: Quiz;
  existingTracker: Doc<"userQuizTrackers">;
};

export default function QuizCard({ quiz, existingTracker }: QuizCardProps) {
  const total = quiz.quizQuestions.length;

  // Initial step = how many answers are already saved, but clamp to [0, total-1]
  const initialStep = useMemo(
    () => Math.min(existingTracker.answers.length, Math.max(total - 1, 0)),
    [existingTracker.answers.length, total],
  );

  const [step, setStep] = useState(initialStep);
  const question = quiz.quizQuestions[step];
  const optionKeys = Object.keys(question.options);

  const savedAnswerForStep = existingTracker.answers[step] ?? "";
  const [selected, setSelected] = useState<string>(savedAnswerForStep);
  const [showExplanation, setShowExplanation] =
    useState<boolean>(!!savedAnswerForStep);

  const setAnswer = useMutation(api.userQuizTrackers.setAnswer);
  const completeQuiz = useMutation(api.userQuizTrackers.completeQuiz);

  // Calculate score when finished
  const calcScore = () => {
    let score = 0;
    const answers = existingTracker.answers;
    for (let i = 0; i < total; i++) {
      if (answers[i] && answers[i] === quiz.quizQuestions[i].answer) score++;
    }
    // If the user just answered the final step locally but it isn't in `existingTracker.answers` yet,
    // also include the current selected value:
    if (
      step === total - 1 &&
      selected &&
      selected === question.answer &&
      !savedAnswerForStep
    ) {
      score++;
    }
    return score;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return; // require a choice

    // Persist this step’s answer
    await setAnswer({
      trackerId: existingTracker._id,
      index: step,
      answer: selected,
    });

    // Show explanation for this step
    setShowExplanation(true);

    // If there are more questions, go next after a short delay
    if (step < total - 1) {
      // let the user read the explanation before advancing; or advance immediately:
      setTimeout(() => {
        setShowExplanation(false);
        setSelected(existingTracker.answers[step + 1] ?? "");
        setStep((s) => s + 1);
      }, 4000); // tweak or remove the delay as you like
    } else {
      // Last question → complete the quiz
      const score = calcScore();
      await completeQuiz({
        trackerId: existingTracker._id,
        endedAt: Date.now(),
        score,
      });
      // You could route to a results page or just show a summary:
      // router.push(`/quiz/${quiz.id}/results`);
    }
  }

  // Guard: if user already answered everything, show a simple summary
  if (existingTracker.answers.length >= total) {
    const score = calcScore();
    return (
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quiz completed</h2>
        <p>
          Score: {score} / {total}
        </p>
        <details className="rounded border p-3">
          <summary>Review</summary>
          <ol className="list-decimal ml-5 space-y-2 mt-2">
            {quiz.quizQuestions.map((q, i) => {
              const userAns = existingTracker.answers[i];
              const correct = userAns === q.answer;
              return (
                <li key={i}>
                  <p className="font-medium">{q.question}</p>
                  <p>
                    Your answer:{" "}
                    {userAns ? `${userAns} — ${q.options[userAns]}` : "—"}
                  </p>
                  <p>
                    Correct answer: {q.answer} — {q.options[q.answer]}
                  </p>
                  <p className={correct ? "text-green-600" : "text-red-600"}>
                    {correct ? "Correct" : "Incorrect"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{q.explanation}</p>
                </li>
              );
            })}
          </ol>
        </details>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        <p className="text-sm text-gray-600">
          {step + 1} / {total}
        </p>
        {question.image && (
          <img
            src={question.image}
            alt=""
            className="max-w-full rounded-md border"
          />
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-3">
        <fieldset className="space-y-2">
          {optionKeys.map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`q_${step}`} // important: same name per question
                value={key}
                checked={selected === key}
                onChange={() => setSelected(key)}
              />
              <span>
                <strong>{key}.</strong> {question.options[key]}
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            disabled={!selected}
          >
            {step === total - 1
              ? "Finish"
              : savedAnswerForStep
                ? "Save & Next"
                : "Answer"}
          </button>

          {showExplanation && (
            <span className="text-sm text-gray-700">
              {question.explanation}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
