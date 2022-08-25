import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthenticationProvider } from "sources/providers/authentication";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ChakraProvider>
      <AuthenticationProvider>
        <Component {...pageProps} />
      </AuthenticationProvider>
    </ChakraProvider>
  );
}

export default MyApp;
