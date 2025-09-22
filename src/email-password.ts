import { getApp, getApps } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { assertEmailPassword } from "./validation";

export async function firebaseAuth(
  action: "login" | "signup" | "logout" | "changePassword",
  data: Record<string, unknown>
) {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }
  const app = getApp();
  const auth = getAuth(app);

  switch (action) {
    case "login":
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }
      assertEmailPassword(data.email, data.password);
      return await signInWithEmailAndPassword(
        auth,
        data.email as string,
        data.password as string
      );
    case "signup":
      if (!data.email || !data.password) {
        throw new Error("Email and password are required");
      }
      assertEmailPassword(data.email, data.password);
      return await createUserWithEmailAndPassword(
        auth,
        data.email as string,
        data.password as string
      );
    case "logout":
      return await signOut(auth);
    case "changePassword":
      if (!data.newPassword) {
        throw new Error("Email, password and new password are required");
      }
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not found");
      }
      return await updatePassword(auth.currentUser, data.newPassword as string);
  }

  return auth;
}
