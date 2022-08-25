import Login from "../../sources/components/forms/LoginForm";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "forms/Login",
  component: Login,
  parameters: {},
} as ComponentMeta<typeof Login>;

export const LoginSucess: ComponentStory<typeof Login> = () => {
  return <Login onSuccessLogin={() => {}} onFailLogin={() => {}} />;
};
