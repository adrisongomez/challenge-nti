import { Box, Center, Heading, Stack } from "@chakra-ui/react";
import * as React from "react";
import Navigation from "../navigations/Navigation";

interface BaseTemplateProps {
  children?: React.ReactElement;
  title?: string;
}

const BaseTemplate: React.FC<BaseTemplateProps> = ({ children, title }) => {
  return (
    <Stack w="100vw" minHeight="100vh">
      <Navigation />
      <Center paddingX="6" paddingY="3">
        <Box>
          {title && <Heading marginBottom='3'>{title}</Heading>}
          <Box shadow="md" w="90vw" minHeight="80vh" borderRadius="md" padding={5}>
            {children}
          </Box>
        </Box>
      </Center>
    </Stack>
  );
};

export default BaseTemplate;
