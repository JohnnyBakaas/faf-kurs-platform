import { notFound, redirect } from "next/navigation";
import rawQuizes from "@/quizes/quizes.json";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import QuizCard from "./components/QuizCard";

type Props = {
  params: Promise<{ quizId: keyof typeof rawQuizes }>;
};

async function startQuizAction(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  const quizId = formData.get("quizId") as string;

  await fetchMutation(api.userQuizTrackers.startQuiz, { userId, quizId });
}

const QuizPage = async ({ params }: Props) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return (
      <main className="p-8">
        <p>You need to log in to access this quiz.</p>
      </main>
    );
  }

  const p = await params;
  const quiz = rawQuizes[p.quizId] as Quiz;
  if (!quiz) notFound();

  const existingTracker = await fetchQuery(
    api.userQuizTrackers.getByUserAndQuiz,
    {
      userId: user.id,
      quizId: p.quizId as string,
    },
  );

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">{quiz.name}</h1>
      <p>{quiz.description}</p>

      {existingTracker ? (
        <>
          <QuizCard quiz={quiz} existingTracker={existingTracker} />

          <br />
          <br />
          <br />
          <p className="text-green-600">
            You already started this quiz at{" "}
            {new Date(existingTracker.startedAt).toLocaleString()}.
          </p>
          <pre>{JSON.stringify(existingTracker, null, 2)}</pre>
        </>
      ) : (
        <form action={startQuizAction}>
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="quizId" value={p.quizId as string} />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Start Quiz
          </button>
        </form>
      )}
    </main>
  );
};

export default QuizPage;
