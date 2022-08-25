import { LoginResponse } from "@controllers/users/utils";
import type { NextPage } from "next";
import Head from 'next/head'
import LoginForm from "sources/components/forms/LoginForm";
import CenterChildPage from "sources/components/templates/CenterChildPage";

const LoginPage: NextPage = () => {
  const handleLogin = (data: LoginResponse) => {
    console.log(data)
  }
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
