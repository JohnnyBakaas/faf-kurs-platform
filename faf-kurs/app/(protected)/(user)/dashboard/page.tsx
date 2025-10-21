import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

const DashboardPage = async () => {
  const { getUser, getPermissions, getAccessToken } = getKindeServerSession();
  const user = await getUser();
  const userPermissions = await getPermissions();
  const accessToken = await getAccessToken();
  return (
    <div>
      <p>{JSON.stringify(user)}</p>
      <p>{JSON.stringify(userPermissions)}</p>
      <p>{JSON.stringify(accessToken?.permissions)}</p>
      <br />
      <br />
      <Link href={"/quiz/quiz-1"}>quiz-1</Link>
      <br />
      <Link href={"/quiz/quiz-2"}>quiz-2</Link>
      <br />
      <Link href={"/quiz/quiz-3"}>quiz-3</Link>
    </div>
  );
};

export default DashboardPage;
