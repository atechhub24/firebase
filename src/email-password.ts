import { getApp, getApps } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type UserCredential,
} from "firebase/auth";
import { assertEmailPassword, validatePassword } from "./validation";

export type LoginAction = {
  action: "login";
  email: string;
  password: string;
};

export type SignupAction = {
  action: "signup";
  email: string;
  password: string;
};

export type LogoutAction = {
  action: "logout";
};

export type ChangePasswordAction = {
  action: "changePassword";
  newPassword: string;
};

export type AuthActionPayload =
  | LoginAction
  | SignupAction
  | LogoutAction
  | ChangePasswordAction;

export async function firebaseAuth(
  payload: LoginAction
): Promise<UserCredential>;
export async function firebaseAuth(
  payload: SignupAction
): Promise<UserCredential>;
export async function firebaseAuth(payload: LogoutAction): Promise<void>;
export async function firebaseAuth(
  payload: ChangePasswordAction
): Promise<void>;
export async function firebaseAuth(
  payload: AuthActionPayload
): Promise<unknown> {
  if (getApps().length === 0) {
    throw new Error("Firebase not initialized");
  }
  const app = getApp();
  const auth = getAuth(app);

  switch (payload.action) {
    case "login": {
      const { email, password } = payload;
      assertEmailPassword(email, password);
      return await signInWithEmailAndPassword(auth, email, password);
    }
    case "signup": {
      const { email, password } = payload;
      assertEmailPassword(email, password);
      return await createUserWithEmailAndPassword(auth, email, password);
    }
    case "logout": {
      return await signOut(auth);
    }
    case "changePassword": {
      const { newPassword } = payload;
      if (!validatePassword(newPassword)) {
        throw new Error("Password must be at least 6 characters long");
      }
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not found");
      }
      return await updatePassword(currentUser, newPassword);
    }
  }
}
