import { Center, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

import BaseTemplate from "sources/components/templates/BaseTemplate";

const Home: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Home</title>
      </Head>
      <BaseTemplate>
        <Center height='100%'>
          <Text> Todo: Show graphs </Text>
        </Center>
      </BaseTemplate>
    </main>
  );
};

export default Home;
