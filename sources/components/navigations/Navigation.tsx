import * as React from "react";
import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { AuthenticationContext } from "sources/providers/authentication";
import NavigationItem, { NavItem } from "./NavigationItem";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { User, Archive } from "react-feather";

const items: NavItem[] = [
  {
    path: "/customer",
    label: "Customer",
    icon: <User size={16} color='white' />,
  },
  {
    path: "/invoice",
    label: "Invoice",
    icon: <Archive size={16} color='white' />
  },
];

const Navigation: React.FC = () => {
  const { signOut } = React.useContext(AuthenticationContext);
  return (
    <Box
      w="100%"
      h="50"
      bgColor="blue.500"
      display="flex"
      justifyContent="space-between"
      paddingX="10"
    >
      <Flex>
        {items.map((item, index) => (
          <NavigationItem key={index} icon={item.icon} path={item.path} label={item.label} />
        ))}
      </Flex>
      <Center>
        <Text
          cursor="pointer"
          onClick={() => signOut?.()}
          fontSize="md"
          color="white"
          fontWeight="bold"
          paddingRight="2"
        >
          Logout
        </Text>
        <ArrowRightIcon color="white" fontSize="sm" />
      </Center>
    </Box>
  );
};

export default Navigation;
