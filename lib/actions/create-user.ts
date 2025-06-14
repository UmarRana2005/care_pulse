// lib/actions/create-user.ts
"use server"

import { createUser as createAppwriteUser } from "./patient.actions";
import { revalidatePath } from "next/cache";

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
