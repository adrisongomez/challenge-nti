import { Box, Container } from "@chakra-ui/react";
import * as React from "react";

const CenterChildPage: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  return (
    <Container
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="100vw"
      minH="100vh"
    >
      <Box padding="10" w="80%" boxShadow="md">
        {children}
      </Box>
    </Container>
  );
};

export default CenterChildPage;
