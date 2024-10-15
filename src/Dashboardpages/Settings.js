import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Button, Input, Select, Switch, FormControl, FormLabel,
  Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue, HStack, Avatar, Divider,
  Icon, Progress, Badge, SimpleGrid, InputGroup, InputLeftElement, InputRightElement,
  Flex, useToast, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb, Alert, AlertIcon, IconButton,
  Container
} from '@chakra-ui/react';
import { FiUser, FiBell, FiLock, FiCreditCard, FiDownload, FiTrash2, FiMail, FiGlobe, FiHelpCircle, FiEye, FiEyeOff, FiEdit, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const GradientCard = ({ title, children, gradient }) => {
  const bgColor = useColorModeValue('white', '#1E1E1E');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <MotionBox
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      position="relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="5px"
        bgGradient={gradient}
      />
      <Box p={6}>
        <Heading size="md" mb={4}>{title}</Heading>
        {children}
      </Box>
    </MotionBox>
  );
};

const Settings = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    subscription: null,
    userId: null,
    email: '',
    workspaceId: null,
    username: '',
  });
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('en');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');
  const modalBgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = userData ? userData.userId : localStorage.getItem('userId');
        if (!token || !userId) {
          console.error('No auth token or user ID found');
          return;
        }
        const response = await axios.get(
          `https://api.clipzy.ai/subscription/current-plan?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setCurrentPlan(response.data);
      } catch (error) {
        console.error('Error fetching current plan:', error);
      }
    };

    if (userData && userData.userId) {
      fetchCurrentPlan();
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://api.clipzy.ai/current',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUserData(response.data);
      fetchSubscription(response.data.userId);
      fetchTokenInfo();
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchSubscription = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://api.clipzy.ai/subscription/getForUser?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSubscription(response.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    }
  };

  const fetchTokenInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://api.clipzy.ai/user/token-info',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTokenInfo(response.data);
    } catch (error) {
      console.error('Error fetching token info:', error);
      setTokenInfo(null);
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New password and confirm password do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (passwordStrength < 100) {
      toast({
        title: "Error",
        description: "Please use a stronger password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://api.clipzy.ai/user/edit?id=${userData.userId}`,
        {
          ...userData,
          plainPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast({
        title: "Success",
        description: "Password changed successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    let feedback = [];

    if (password.length >= 5) {
      strength += 40;
    } else {
      feedback.push("Use at least 5 characters");
    }

    if (password.match(/[0-9]/)) {
      strength += 30;
    } else {
      feedback.push("Include at least one number");
    }

    if (password.match(/[^a-zA-Z0-9]/)) {
      strength += 30;
    } else {
      feedback.push("Include at least one special character");
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback.join(". "));
  };

  const handleCloseModal = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStrength(0);
    setPasswordFeedback('');
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleEditProfile = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `https://api.clipzy.ai/user/edit?id=${userData.userId}`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast({
          title: "Success",
          description: "Profile updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="2xl" color={headingColor} mb={2}>
              Settings & Preferences
            </Heading>
            <Text fontSize="lg" color={textColor}>
              Customize your AI-Powered Content Studio experience
            </Text>
          </Box>

          <Tabs variant="soft-rounded" colorScheme="purple">
            <TabList mb="1em">
              <Tab><Icon as={FiUser} mr={2} />Profile</Tab>
              <Tab><Icon as={FiCreditCard} mr={2} />Billing</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <GradientCard title="Profile Information" gradient="linear(to-r, purple.400, pink.400)">
                    <VStack spacing={6} align="stretch">
                      <HStack spacing={4}>
                        <Avatar size="xl" name={`${userData.firstName} ${userData.lastName}`} src="https://bit.ly/broken-link" />
                        <VStack align="start" spacing={2}>
                          <Text fontWeight="bold" color={headingColor}>{`${userData.firstName || ''} ${userData.lastName || ''}`}</Text>
                          <Text color={textColor}>{userData.email}</Text>
                        </VStack>
                      </HStack>
                      <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" children={<FiUser color="gray.300" />} />
                          <Input
                            name="firstName"
                            value={userData.firstName || ''}
                            onChange={handleInputChange}
                            pl="2.5rem"
                            isReadOnly={!isEditing}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" children={<FiUser color="gray.300" />} />
                          <Input
                            name="lastName"
                            value={userData.lastName || ''}
                            onChange={handleInputChange}
                            pl="2.5rem"
                            isReadOnly={!isEditing}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none" children={<FiMail color="gray.300" />} />
                          <Input
                            name="email"
                            value={userData.email || ''}
                            onChange={handleInputChange}
                            pl="2.5rem"
                            isReadOnly={!isEditing}
                          />
                        </InputGroup>
                      </FormControl>
                      {currentPlan && (
                        <FormControl>
                          <FormLabel>Current Plan</FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none" children={<FiCreditCard color="gray.300" />} />
                            <Input value={currentPlan.subscriptionType} isReadOnly pl="2.5rem" />
                          </InputGroup>
                        </FormControl>
                      )}
                      {currentPlan && (
                        <FormControl>
                          <FormLabel>Plan Expiry</FormLabel>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none" children={<FiCalendar color="gray.300" />} />
                            <Input value={new Date(currentPlan.endDate).toLocaleDateString()} isReadOnly pl="2.5rem" />
                          </InputGroup>
                        </FormControl>
                      )}
                      <Button
                        leftIcon={isEditing ? <FiUser /> : <FiEdit />}
                        colorScheme="purple"
                        onClick={handleEditProfile}
                      >
                        {isEditing ? 'Save Profile' : 'Edit Profile'}
                      </Button>
                    </VStack>
                  </GradientCard>
                  <GradientCard title="Preferences" gradient="linear(to-r, blue.400, teal.400)">
                    <FormControl>
                      <FormLabel>Language</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<FiGlobe color="gray.300" />} />
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)} pl="2.5rem">
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </Select>
                      </InputGroup>
                    </FormControl>
                    <FormControl display="flex" alignItems="center" justifyContent="space-between" mt={4}>
                      <FormLabel htmlFor="2fa" mb="0">
                        Enable Two-Factor Authentication
                      </FormLabel>
                      <Switch id="2fa" isChecked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
                    </FormControl>
                  </GradientCard>
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                  <GradientCard title="Current Plan" gradient="linear(to-r, green.400, yellow.400)">
                    <Flex justify="space-between" align="center" mb={4}>
                      <Heading size="md">{currentPlan ? currentPlan.subscriptionType : 'No active subscription'}</Heading>
                      <Badge colorScheme={currentPlan && currentPlan.subscriptionStatus === 'ACTIVE' ? 'green' : 'red'}>
                        {currentPlan ? currentPlan.subscriptionStatus : 'INACTIVE'}
                      </Badge>
                    </Flex>
                    {currentPlan && (
                      <>
                        <Text mb={2}>Next billing date: {new Date(currentPlan.endDate).toLocaleDateString()}</Text>
                        <Progress value={(currentPlan.usedTokensCount / currentPlan.receivedTokensCount) * 100 || 0} size="sm" colorScheme="purple" mb={2} />
                        <Text fontSize="sm" mb={4}>
                          {currentPlan.usedTokensCount} / {currentPlan.receivedTokensCount} magic points used this month
                        </Text>
                      </>
                    )}
                    {(!currentPlan || (currentPlan && currentPlan.pendingTokensCount === 0)) && (
                      <Alert status="warning" mb={4}>
                        <AlertIcon />
                        You don't have any credits left. Purchase more to continue using our services.
                      </Alert>
                    )}
                    <HStack>
                      <Button colorScheme="purple" onClick={() => navigate('/dashboard/subscription-and-credits')}>
                        {currentPlan ? 'Upgrade Plan' : 'Get a Plan'}
                      </Button>
                      {currentPlan && <Button variant="outline">Manage Billing</Button>}
                    </HStack>
                  </GradientCard>
                  <GradientCard title="Payment Method" gradient="linear(to-r, orange.400, red.400)">
                    <HStack mb={4}>
                      <Icon as={FiCreditCard} boxSize={6} />
                      <Text>Visa ending in 4242</Text>
                      <Badge colorScheme="green">Primary</Badge>
                    </HStack>
                    <Button width="full" variant="outline">Add Payment Method</Button>
                  </GradientCard>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Divider my={8} />

          <GradientCard title="Danger Zone" gradient="linear(to-r, red.500, red.300)">
            <Button leftIcon={<FiTrash2 />} colorScheme="red" variant="outline">
              Delete Account
            </Button>
          </GradientCard>
        </VStack>
      </Container>

      
    </Box>
  );
};

export default Settings;