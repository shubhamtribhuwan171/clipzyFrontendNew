import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Button,Spacer,
  Icon,
  Text,
  Flex,
  useColorModeValue,
  Divider,
  useColorMode,
  Progress,
  Tooltip,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiHome, FiVideo, FiBook, FiPackage, FiCalendar, FiSettings, FiGlobe, FiDollarSign, FiHelpCircle, FiLogOut, FiZap } from 'react-icons/fi';
import { FaCreditCard } from 'react-icons/fa';
import axios from 'axios';
import { UserContext } from '../App';
import { useLogout } from '../hooks/useLogout';
import Generate from '../Dashboardpages/Generate';

function SidebarItem({ icon, children, to, hoverBg }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeBg = useColorModeValue('purple.100', 'purple.800');
  const activeColor = useColorModeValue('purple.800', 'purple.200');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Button
      as={RouterLink}
      to={to}
      variant="ghost"
      justifyContent="flex-start"
      alignItems="center"
      fontWeight="medium"
      py={2}
      px={3}
      borderRadius="md"
      _hover={{ bg: hoverBg }}
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : textColor}
      leftIcon={<Icon as={icon} boxSize={5} color={isActive ? activeColor : 'gray.500'} />}
      position="relative"
      overflow="hidden"
      width="100%"
    >
      <Text>{children}</Text>
      {isActive && (
        <Box
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width="4px"
          bg={activeColor}
        />
      )}
    </Button>
  );
}

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Flex
      as="button"
      onClick={toggleColorMode}
      bg={useColorModeValue('gray.300', 'gray.600')}
      w="60px"
      h="30px"
      borderRadius="full"
      p="2px"
      justifyContent={isDark ? 'flex-end' : 'flex-start'}
      alignItems="center"
      cursor="pointer"
      transition="background-color 0.2s ease"
    >
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        w="26px"
        h="26px"
        borderRadius="full"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
      >
        <Flex
          w="100%"
          h="100%"
          alignItems="center"
          justifyContent="center"
          color={useColorModeValue('yellow.500', 'blue.200')}
        >
          {isDark ? '🌙' : '☀️'}
        </Flex>
      </Box>
    </Flex>
  );
}

function Sidebar() {
  const { userInfo } = useContext(UserContext);
  const bgColor = useColorModeValue('gray.50', '#121212'); // Light grey for light mode, light black for dark mode
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const itemHoverBg = useColorModeValue('gray.100', 'gray.700');

  const [language, setLanguage] = useState('en');
  const { colorMode, toggleColorMode } = useColorMode();

  const [tokenInfo, setTokenInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPlan, setCurrentPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [planError, setPlanError] = useState(null);

  useEffect(() => {
    fetchTokenInfo();
    fetchCurrentPlan();
  }, []);

  const fetchTokenInfo = async () => {
    try {
      console.log('from home');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }
  
      const response = await axios.get(
        'https://api.clipzy.ai/user/token-info',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Token Info:', response.data);
      setTokenInfo(response.data);
    } catch (error) {
      console.error('Error fetching token info:', error);
      setError('Failed to load token information');
    } finally {
      // Ensure that loading state is set to false after the request is completed
      setIsLoading(false);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = userInfo ? userInfo.userId : localStorage.getItem('userId');
      if (!token || !userId) {
        console.error('No auth token or user ID found');
        setIsLoadingPlan(false);
        return;
      }

      const response = await axios.get(
        `https://api.clipzy.ai/subscription/current-plan?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCurrentPlan(response.data);
      setIsLoadingPlan(false);
    } catch (error) {
      console.error('Error fetching current plan:', error);
      setPlanError('Failed to load plan information');
      setIsLoadingPlan(false);
    }
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const isDark = colorMode === 'dark';

  const navigate = useNavigate();

  const handleAddCredits = () => {
    navigate('/dashboard/add-credits');
  };

  const calculateRemainingDays = () => {
    if (!currentPlan || !currentPlan.endDate) {
      return null;
    }

    const endDate = new Date(currentPlan.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const remainingDays = calculateRemainingDays();

  const logout = useLogout();

  return (
    <Box
      width="250px"
      height="100vh"
      py={4}
      px={3}
      borderRight="1px"
      borderColor={borderColor}
      bg={bgColor}
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch" height="100%">
        <VStack spacing={1} align="stretch">
          <SidebarItem icon={FiHome} to="/dashboard" hoverBg={itemHoverBg}>
            Home
          </SidebarItem>
          <SidebarItem icon={FiZap} to="/dashboard/content-studio" hoverBg={itemHoverBg}>
          Content Studio
          </SidebarItem>
          <SidebarItem icon={FiVideo} to="/dashboard/videos" hoverBg={itemHoverBg}>
            My  Videos
          </SidebarItem>
          <SidebarItem icon={FiCalendar} to="/dashboard/schedule" hoverBg={itemHoverBg}>
            Schedule
          </SidebarItem>
          <SidebarItem icon={FiGlobe} to="/dashboard/referral" hoverBg={itemHoverBg}>
            Referral
          </SidebarItem>
        </VStack>

        <Divider />

        <VStack spacing={2} align="stretch">
          <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color={textColor} mb={1}>
            Settings
          </Text>
          <SidebarItem icon={FiSettings} to="/dashboard/settings" hoverBg={itemHoverBg}>
            Account
          </SidebarItem>
          <SidebarItem icon={FiHelpCircle} to="/dashboard/help-and-support" hoverBg={itemHoverBg}>
            Support
          </SidebarItem>
          <SidebarItem icon={FaCreditCard} to="/dashboard/subscription-and-credits" hoverBg={itemHoverBg}>
            Subscription
          </SidebarItem>
        </VStack>

        <Divider />

        <VStack spacing={2} align="stretch">
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="sm">Theme</Text>
            <ThemeToggle />
          </Flex>
        </VStack>
        <Spacer />
        
        <Button
          leftIcon={<FiLogOut />}
          variant="ghost"
          onClick={logout}
          w="full"
          justifyContent="flex-start"
          color={textColor}
          _hover={{ bg: itemHoverBg }}
        >
          Logout
        </Button>

        {isLoadingPlan ? (
          <Spinner />
        ) : planError ? (
          <Text color="red.500">{planError}</Text>
        ) : currentPlan ? (
          <Box
            borderWidth={1}
            borderRadius="lg"
            p={4}
            bg={cardBgColor}
            boxShadow="md"
          >
            <VStack spacing={4} align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold" color={accentColor}>
                  {currentPlan.subscriptionType}
                </Text>
                <Badge colorScheme={currentPlan.subscriptionStatus === 'ACTIVE' ? 'green' : 'red'}>
                  {currentPlan.subscriptionStatus}
                </Badge>
              </Flex>
              <Divider />
              <Flex alignItems="center">
                <Icon as={FiCalendar} color={accentColor} mr={2} />
                <Text fontSize="sm" color={textColor}>
                  {remainingDays} days remaining
                </Text>
              </Flex>
              <Divider />
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                  <Icon as={FiDollarSign} color={accentColor} mr={2} />
                  <Text fontSize="sm" color={textColor}>Tokens</Text>
                </Flex>
                <Text fontSize="sm" fontWeight="bold" color={accentColor}>
                  {currentPlan.pendingTokensCount} / {currentPlan.receivedTokensCount}
                </Text>
              </Flex>
              <Tooltip label={`${currentPlan.pendingTokensCount} tokens remaining`} placement="top">
                <Progress
                  value={(currentPlan.pendingTokensCount / currentPlan.receivedTokensCount) * 100}
                  size="sm"
                  colorScheme="yellow"
                  borderRadius="full"
                />
              </Tooltip>
              {currentPlan.pendingTokensCount < 100 && (
                <Button
                  size="sm"
                  leftIcon={<FiDollarSign />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={handleAddCredits}
                >
                  Add Credits
                </Button>
              )}
            </VStack>
          </Box>
        ) : null}


      </VStack>
    </Box>
  );
}

export default Sidebar;
