import { LoginResponse } from "@controllers/users/utils";
import { useRouter } from "next/router";
import * as React from "react";

type AuthenticationState = {
  accessToken?: string;
  status: "LOGIN" | "LOGOUT";
  signIn?: (data: LoginResponse) => void;
  signOut?: () => void;
};

const initialState: {
  context: AuthenticationState;
  setContext?: React.Dispatch<React.SetStateAction<AuthenticationState>>;
  signIn?: (data: LoginResponse) => void;
  signOut?: () => void;
} = {
  context: {
    status: "LOGOUT",
    accessToken: undefined,
  },
};

export const AuthenticationContext = React.createContext(initialState);

interface AuthenticationProviderProps {
  children?: React.ReactElement;
}

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [context, setContext] = React.useState<AuthenticationState>({
    accessToken: undefined,
    status: "LOGOUT",
  });
  const signIn = React.useCallback((data: LoginResponse) => {
    setContext?.((state) => ({
      ...state,
      status: "LOGIN",
      accessToken: data.accessToken,
    }));
    sessionStorage.setItem("_auth", data.refreshToken);
    sessionStorage.setItem("_authAccess", data.accessToken);
  }, []);

  const signOut = React.useCallback(() => {
    setContext?.((state) => ({
      ...state,
      status: "LOGOUT",
      accessToken: undefined,
    }));
    sessionStorage.removeItem("_auth");
    sessionStorage.removeItem("_authAccess");
    router.push("/login");
  }, [router]);

  React.useEffect(() => {
    const accessToken = localStorage.getItem("_authAccess");
    if (accessToken) {
      setContext?.((state) => ({
        ...state,
        accessToken,
        status: "LOGIN",
      }));
    }
  }, []);

  // React.useEffect(() => {
  //   const url = window.location.pathname;
  //   if (url.includes("login")) return;
  //   if (context.status != "LOGIN") {
  //     router.push("/login");
  //   }
  // }, [context, router]);

  return (
    <AuthenticationContext.Provider
      value={{
        context,
        setContext,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
