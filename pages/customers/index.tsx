import { Center, Table, TableCaption } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import BaseTemplate from "sources/components/templates/BaseTemplate";
import CustomTable, {
  TableMetadata,
} from "sources/components/tables/CustomTable";
import { Customer } from "@prisma/client";
import prisma from "@clients/prisma";
import CustomerController from "@controllers/customers";

const tableMetadata: TableMetadata = {
  headers: [
    {
      key: "personalId",
      label: "ID",
    },
    {
      key: "firstName",
      label: "First Name",
    },
    {
      key: "lastName",
      label: "Last Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phoneNumber",
      label: "Telephone",
    },
  ],
};

interface CustomerResponse {
  id: string;
  personalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}
type CustomerPage = {
  data: CustomerResponse[];
};

const CustomerPage: NextPage<CustomerPage> = ({ data }) => {
  return (
    <main>
      <Head>
        <title>Customers</title>
      </Head>
      <BaseTemplate title='Customers'>
        <CustomTable metadata={tableMetadata} data={data} />
      </BaseTemplate>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<CustomerPage> =
  async () => {
    const controller = new CustomerController(prisma);
    const data = await controller.list();
    return {
      props: {
        data: data.map((value) => ({
          id: value.id,
	  personalId: value.personalId,
	  firstName: value.firstName,
	  lastName: value.lastName,
	  email: value.email,
	  phoneNumber: value.phoneNumber,
          createdAt: value.createdAt.toISOString(),
          updatedAt: value.updatedAt.toISOString(),
        })),
      },
    };
  };

export default CustomerPage;
