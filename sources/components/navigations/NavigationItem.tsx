import * as React from "react";
import Link from "next/link";
import { Box, Center, Text } from "@chakra-ui/react";

export type NavItem = {
  path: string;
  label: string;
  icon?: React.ReactElement;
};

interface NavigationItemProps {
  path: string;
  label: string;
  icon?: React.ReactElement;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  path,
  label,
  icon,
}) => {
  return (
    <Link href={path}>
      <Box cursor="pointer" display="flex" paddingX="2">
        <Center>
          <Box paddingRight='1'>{icon}</Box>
          <Text fontSize="md" fontWeight="bold" color="white">
            {label}
          </Text>
        </Center>
      </Box>
    </Link>
  );
};

export default NavigationItem;
