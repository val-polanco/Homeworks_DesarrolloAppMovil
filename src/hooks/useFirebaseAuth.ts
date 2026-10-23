import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth } from "../firebase/config";


export function useFirebaseAuth() {

  const register = async (
    email: string,
    password: string
  ) => {

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    return result.user;
  };


  const login = async (
    email: string,
    password: string
  ) => {

    const result =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    return result.user;
  };


  const logout = async () => {

    await signOut(auth);

  };


  return {
    register,
    login,
    logout
  };
}