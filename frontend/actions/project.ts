"use server";

import { getAxiosInstance } from "./axios";

export const hitProtectedRoute = async (): Promise<string> => {
  const axiosInstance = await getAxiosInstance();

  const response = await axiosInstance.get("/protected");
  return response.data.emailId;
};
