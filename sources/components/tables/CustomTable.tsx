import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

export type TableMetadata = {
  headers: {
    key: string;
    label: string;
  }[];
};

export type TableRow = { [key: string]: any };

interface CustomTableProps {
  data: TableRow[];
  metadata: TableMetadata;
}

const CustomTable: React.FC<CustomTableProps> = ({ data, metadata }) => {
  return (
    <TableContainer overflow="auto">
      <Table>
        <Thead>
          <Tr>
            {metadata.headers.map((value) => (
              <Th key={value.key} id={value.key}>
                {value.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((value, index) => (
            <Tr key={index}>
              {metadata.headers.map(({ key }) => (
                <Td key={`${key}-${value[key]}-${index}`}>{value[key]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
