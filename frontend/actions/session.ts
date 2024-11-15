import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const getSessionFromActions = async () => {
  const session = await getServerSession(options);
  if (session) {
    return session;
  }
  return null;
};
