import {
  createContext,
  ReactNode,
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged,
  User
} from "firebase/auth";

import { auth } from "../firebase/config";

import { useFirebaseAuth } from "../hooks/useFirebaseAuth";


interface AuthContextType {

  user: User | null;

  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}


export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );


interface Props {
  children: ReactNode;
}


export function AuthProvider({
  children
}: Props) {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);


  const firebaseAuth =
    useFirebaseAuth();


  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {

          setUser(firebaseUser);

          setLoading(false);

        }
      );


    return () => unsubscribe();

  }, []);


  const login = async (
    email: string,
    password: string
  ) => {

    await firebaseAuth.login(
      email,
      password
    );

  };


  const register = async (
    email: string,
    password: string
  ) => {

    await firebaseAuth.register(
      email,
      password
    );

  };


  const logout = async () => {

    await firebaseAuth.logout();

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );
}