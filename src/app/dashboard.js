import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <pre>NO SESSION FOUND</pre>;
  }

  return (
    <pre>{JSON.stringify(session, null, 2)}</pre>
  );
}
