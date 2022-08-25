import { Center } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import BaseTemplate from "sources/components/templates/BaseTemplate";

const InvoicePage: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Invoice</title>
      </Head>
      <BaseTemplate>
        <Center>TODO: Make this view</Center>
      </BaseTemplate>
    </main>
  );
};

export default InvoicePage
