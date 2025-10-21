import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
    </div>
  );
};

export default DashboardPage;
