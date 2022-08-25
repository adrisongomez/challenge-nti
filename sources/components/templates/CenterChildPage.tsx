import { Box, Center } from "@chakra-ui/react";
import * as React from "react";

const CenterChildPage: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return (
    <Center
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100vw"
      minH="100vh"
    >
      <Box padding="10" w="50%" boxShadow="md">
        {children}
      </Box>
    </Center>
  );
};

export default CenterChildPage;
