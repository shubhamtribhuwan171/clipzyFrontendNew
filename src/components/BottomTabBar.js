import React from 'react';
import { Flex, Button, useDisclosure, useColorModeValue, Box, Text, Icon } from '@chakra-ui/react';
import { FiHome, FiVideo, FiCalendar, FiMoreHorizontal, FiCreditCard, FiZap } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import MoreMenu from './MoreMenu';
import { useLogout } from '../hooks/useLogout';

function BottomTabBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const iconColor = useColorModeValue('purple.500', 'purple.300');
  const activeColor = useColorModeValue('purple.600', 'purple.200');
  const activeBgColor = useColorModeValue('purple.100', 'purple.800');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  const tabItems = [
    { icon: FiHome, label: 'Home', to: '/dashboard' },
    { icon: FiZap, label: 'Studio', to: '/dashboard/content-studio' },

    { icon: FiVideo, label: 'Videos', to: '/dashboard/videos' },
    { icon: FiCreditCard, label: 'Subscription', to: '/dashboard/subscription-and-credits' },

  ];

  return (
    <>
      <Flex
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        paddingTop="50px"
        bg={bgColor}
        borderTop="1px"
        borderColor={borderColor}
        justifyContent="space-around"
        py={2}
        px={4}
        boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      >
        {tabItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Button
              key={item.label}
              as={Link}
              to={item.to}
              variant="ghost"
              flexDirection="column"
              alignItems="center"
              py={2}
              px={1}
              height="auto"
              minW={0}
              flex={1}
              bg={isActive ? activeBgColor : 'transparent'}
              _hover={{ bg: isActive ? activeBgColor : hoverBgColor }}
            >
              <Icon
                as={item.icon}
                boxSize={6}
                color={isActive ? activeColor : iconColor}
                mb={1}
              />
              <Text
                fontSize="xs"
                color={isActive ? activeColor : textColor}
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                {item.label}
              </Text>
            </Button>
          );
        })}
        <Button
          onClick={onOpen}
          variant="ghost"
          flexDirection="column"
          alignItems="center"
          py={2}
          px={1}
          height="auto"
          minW={0}
          flex={1}
        >
          <Icon as={FiMoreHorizontal} boxSize={6} color={iconColor} mb={1} />
          <Text fontSize="xs" color={textColor}>
            More
          </Text>
        </Button>
      </Flex>
      <MoreMenu isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default BottomTabBar;