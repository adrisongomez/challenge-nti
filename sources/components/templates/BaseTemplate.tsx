import { Box, Center, Stack } from "@chakra-ui/react";
import * as React from "react";
import Navigation from "../navigations/Navigation";

interface BaseTemplateProps {
  children?: React.ReactElement;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({ children }) => {
  return (
    <Stack w="100vw" minHeight="100vh">
      <Navigation />
      <Center paddingX="6" paddingY="3">
        <Box
          shadow="md"
          w="90vw"
          minHeight="90vh"
          borderRadius="sm"
          overflow="auto"
        >
          {children}
        </Box>
      </Center>
    </Stack>
  );
};

export default BaseTemplate;
