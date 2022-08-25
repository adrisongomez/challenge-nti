import {
  Box,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Input,
  ButtonGroup,
  Button,
  FormHelperText,
  Alert,
  AlertTitle,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { LoginResponse } from "@controllers/users/utils";
import axios, { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import * as React from "react";
import { useForm } from "react-hook-form";

type LoginData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onLogin?: (data: LoginResponse) => Promise<void> | void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [failLogin, setFailLogin] = React.useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();
  const handleLogin = async (inputs: LoginData) => {
    try {
      const { data } = await axios.post<LoginResponse>(
        "/api/user/login",
        inputs
      );
      onLogin?.(data);
    } catch (error) {
      setFailLogin(true);
      if (error instanceof AxiosError) {
        if (error.response?.status === StatusCodes.FORBIDDEN)
          setFailLogin(true);
      }
      throw error;
    }
  };
  return (
    <FormControl>
      <Stack>
        <Box>
          <Heading>Login</Heading>
        </Box>
        {failLogin && (
          <Alert
            status="error"
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Box display="flex" flexDir="row">
              <AlertIcon />
              <AlertTitle>Login</AlertTitle>
            </Box>
            <AlertDescription>
              Your credentials are not valid, please entrer a valid email and
              password
            </AlertDescription>
          </Alert>
        )}
        <Box paddingY="5">
          <FormLabel>Email address</FormLabel>
          <Input
            isInvalid={errors.email !== undefined}
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                message: "Email is not valid",
              },
            })}
          />
          {errors.email !== undefined && (
            <FormHelperText>{errors.email.message}</FormHelperText>
          )}
        </Box>
        <Box paddingBottom="5">
          <FormLabel>Password</FormLabel>
          <Input
            isInvalid={errors.password !== undefined}
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password !== undefined && (
            <FormHelperText>{errors.password.message}</FormHelperText>
          )}
        </Box>
        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              setFailLogin(false);
              reset({
                email: "",
                password: "",
              });
            }}
            variant="ghost"
            type="reset"
            size="md"
          >
            Clear
          </Button>
          <Button
            onClick={handleSubmit(handleLogin)}
            colorScheme="blue"
            type="submit"
            size="md"
          >
            Login
          </Button>
        </ButtonGroup>
      </Stack>
    </FormControl>
  );
};

export default LoginForm;
