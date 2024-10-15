import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
  useColorMode,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { FiSettings, FiHelpCircle, FiCreditCard, FiFileText, FiUsers, FiGlobe, FiMoon, FiSun, FiCalendar, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLogout } from '../hooks/useLogout';

const MotionFlex = motion(Flex);

function MoreMenu({ isOpen, onClose }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('purple.500', 'purple.300');

  const logout = useLogout();

  const menuItems = [
    { icon: FiSettings, label: 'Account', to: '/dashboard/settings' },
    { icon: FiHelpCircle, label: 'Support', to: '/dashboard/help-and-support' },
    { icon: FiCalendar, label: 'Schedule', to: '/dashboard/schedule' },
    { icon: FiUsers, label: 'Referral', to: '/dashboard/referral' },
  ];

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent borderTopRadius="20px" bg={bgColor}>
        <DrawerCloseButton color={textColor} />
        <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} color={textColor}>
          More Options
        </DrawerHeader>
        <DrawerBody py={4}>
          <VStack spacing={4} align="stretch">
            {menuItems.map((item, index) => (
              <MotionFlex
                key={item.label}
                as={Link}
                to={item.to}
                align="center"
                p={3}
                borderRadius="md"
                _hover={{ bg: hoverBg }}
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Icon as={item.icon} boxSize={5} mr={3} color={iconColor} />
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  {item.label}
                </Text>
              </MotionFlex>
            ))}
            <Divider my={2} />
            <MotionFlex
              align="center"
              justify="space-between"
              p={3}
              borderRadius="md"
              _hover={{ bg: hoverBg }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: menuItems.length * 0.1 }}
            >
              <Flex align="center">
                <Icon
                  as={colorMode === 'light' ? FiMoon : FiSun}
                  boxSize={5}
                  mr={3}
                  color={iconColor}
                />
                <Text fontSize="md" fontWeight="medium" color={textColor}>
                  {colorMode === 'light' ? 'Dark' : 'Light'} Mode
                </Text>
              </Flex>
              <Button
                onClick={toggleColorMode}
                size="sm"
                colorScheme="purple"
                variant="outline"
              >
                Toggle
              </Button>
            </MotionFlex>
            <Divider my={2} />
            <MotionFlex
              align="center"
              p={3}
              borderRadius="md"
              _hover={{ bg: hoverBg }}
              onClick={() => {
                logout();
                onClose();
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (menuItems.length + 1) * 0.1 }}
              cursor="pointer"
            >
              <Icon as={FiLogOut} boxSize={5} mr={3} color={iconColor} />
              <Text fontSize="md" fontWeight="medium" color={textColor}>
                Logout
              </Text>
            </MotionFlex>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default MoreMenu;
