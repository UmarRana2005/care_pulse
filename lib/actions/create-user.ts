"use server"

import { createUser as createAppwriteUser } from "./patient.actions";

export const createUserAction = async (formData: {
  name: string;
  email: string;
  phone: string;
}) => {
  try {
    const user = await createAppwriteUser(formData);
    return user;
  } catch (error) {
    console.error("Server action error:", error);
    return null;
  }
};
