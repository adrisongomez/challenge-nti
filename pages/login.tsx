import * as React from "react";
import { LoginResponse } from "@controllers/users/utils";
import type { NextPage } from "next";
import Head from "next/head";
import LoginForm from "sources/components/forms/LoginForm";
import CenterChildPage from "sources/components/templates/CenterChildPage";
import { useRouter } from "next/router";
import { AuthenticationContext } from "sources/providers/authentication";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { signIn, context } = React.useContext(AuthenticationContext);

  const handleLogin = (data: LoginResponse) => {
        signIn?.(data)
  };
  React.useEffect(() => {
    if (context?.status == "LOGIN") {
      router.replace("/");
    }
  }, [context?.status, router]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <CenterChildPage>
        <LoginForm onLogin={handleLogin} />
      </CenterChildPage>
    </>
  );
};

export default LoginPage;
