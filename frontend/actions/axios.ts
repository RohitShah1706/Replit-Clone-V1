import axios from "axios";

import { getSessionFromActions } from "./session";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAxiosInstance = async () => {
  const session = await getSessionFromActions();
  const accessToken = session?.accessToken;

  return axios.create({
    baseURL: NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
