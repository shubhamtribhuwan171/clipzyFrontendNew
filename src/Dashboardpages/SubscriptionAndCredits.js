import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  AspectRatio,
  Container,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCoins, FaRocket, FaCheck, FaBolt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MotionBox = motion(Box);

function SubscriptionAndCredits() {
  const [activeTab, setActiveTab] = useState(0);
  const [isYearly, setIsYearly] = useState(false);
  const creditPackagesRef = useRef(null);
  const plansRef = useRef(null);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({ remainingTokens: 0 });
  const [subscription, setSubscription] = useState({ name: 'Free', expiresAt: 'N/A' });
  const [currentPlan, setCurrentPlan] = useState(null);

  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', 'rgba(0,0,0,0.2)');
  const textColor = useColorModeValue('gray.800', 'white');
  const headingColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');

  const isMobile = useBreakpointValue({ base: true, md: false });

  const exchangeRate = 84.14; // 1 USD = 84.14 INR

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    fetchUserInfo();
    fetchPlans();
    fetchTokenInfo();
    fetchCurrentPlan();
  }, []);

  const fetchTokenInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get(
        'https://api.clipzy.ai/user/token-info',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      setTokenInfo(response.data);
    } catch (error) {
      console.error('Error fetching token info:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await axios.get(
        'https://api.clipzy.ai/current',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      setUserInfo(response.data);
      localStorage.setItem('userId', response.data.userId.toString());
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://api.clipzy.ai/subType/getAll',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      const fetchedPlans = response.data.map(plan => ({
        ...plan,
        icon: plan.name === 'Starter' ? FaBolt : FaRocket,
        monthlyPrice: (plan.price / 100 / exchangeRate).toFixed(2), // Convert paisa to USD
        yearlyPrice: ((plan.price * 12 * 0.8) / 100 / exchangeRate).toFixed(2), // Convert paisa to USD with 20% discount
        videoLimit: plan.tokensCount,
        features: plan.description.split(', ')
      }));
      setPlans(fetchedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = userInfo ? userInfo.userId : localStorage.getItem('userId');
      if (!token || !userId) {
        console.error('No auth token or user ID found');
        return;
      }

      const response = await axios.get(
        `https://api.clipzy.ai/subscription/current-plan?userId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      setCurrentPlan(response.data);
    } catch (error) {
      console.error('Error fetching current plan:', error);
    }
  };

  const handlePlanSelect = async (plan) => {
    if (!plan) {
      console.error('No plan selected');
      return;
    }
    setSelectedPlan(plan);
    try {
      const token = localStorage.getItem('token');
      const userId = userInfo ? userInfo.userId : localStorage.getItem('userId');
      if (!token || !userId) {
        console.error('No auth token or user ID found');
        return;
      }
      const response = await axios.post(
        'https://api.clipzy.ai/subscription/initiate',
        {
          planId: plan.planId,
          userId: parseInt(userId, 10)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Payment initiation response:', response.data);
      setPaymentData(response.data);
      openRazorpay(response.data);
    } catch (error) {
      console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    }
  };

  const openRazorpay = (data) => {
    const options = {
      key: data.razorpayKeyId,
      amount: data.amount,
      currency: data.currency,
      name: "Clipzy",
      description: `Subscription for ${selectedPlan.name} plan`,
      order_id: data.orderId,
      handler: function (response) {
        console.log('Razorpay payment response:', response);
        handlePaymentConfirmation(response);
      },
      prefill: {
        name: userInfo?.name || "User's Name",
        email: userInfo?.email || "user@example.com",
        contact: userInfo?.phone || "9999999999"
      },
      theme: {
        color: "#3399cc"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      console.error('Razorpay payment failed:', response);
    });
    rzp.open();
  };

  const handlePaymentConfirmation = async (response) => {
    try {
      const token = localStorage.getItem('token');
      const userId = userInfo ? userInfo.userId : localStorage.getItem('userId');
      if (!token || !userId) {
        throw new Error('No authentication token or user ID found');
      }

      if (!paymentData) {
        throw new Error('Payment data is missing');
      }

      const payload = {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        planId: paymentData.planId,
        userId: parseInt(userId, 10)
      };

      console.log('Payload for confirm-payment:', payload);

      const confirmResponse = await axios.post(
        'https://api.clipzy.ai/subscription/confirm-payment',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Payment confirmation response:', confirmResponse.data);
      fetchUserInfo();
      fetchTokenInfo();
    } catch (error) {
      console.error('Error confirming payment:', error.response ? error.response.data : error.message);
      console.error('Full error object:', error);
    }
  };

  const renderCurrentInfo = () => {
    return (
      <SimpleGrid columns={{ base: 2, md: 2 }} spacing={{ base: 2, md: 6 }} width="full" mb={8}>
        <MotionBox
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AspectRatio ratio={isMobile ? 1 : 21 / 9}>
            <Box>
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="radial-gradient(circle at 30% 107%, #667EEA 0%, #764BA2 5%, #6B8DD6 45%, #8E37D7 60%, #B721FF 90%)"
                opacity={0.8}
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0,0,0,0.4)"
              />
              <Flex
                position="relative"
                height="100%"
                direction="column"
                justify="center"
                align="flex-start"
                p={{ base: 3, md: 6 }}
              >
                <Text fontSize={{ base: "xs", md: "lg" }} fontWeight="medium" color="white" mb={{ base: 1, md: 2 }}>
                  Current Credit Balance
                </Text>
                <Flex align="center" justify="space-between" width="full">
                  <Text fontSize={{ base: "lg", md: "3xl" }} fontWeight="bold" color="white">
                    {tokenInfo.remainingTokens} Credits
                  </Text>
                  <Icon as={FaCoins} boxSize={{ base: 4, md: 8 }} color="white" />
                </Flex>
                <Text fontSize={{ base: "2xs", md: "sm" }} color="white" mt={{ base: 1, md: 2 }}>
                  Est. videos: {Math.floor(tokenInfo.remainingTokens / 10)}
                </Text>
              </Flex>
            </Box>
          </AspectRatio>
        </MotionBox>

        <MotionBox
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AspectRatio ratio={isMobile ? 1 : 21 / 9}>
            <Box>
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="radial-gradient(circle at 30% 107%, #FFA07A 0%, #FF6347 5%, #FF4500 45%, #FF8C00 60%, #FFA500 90%)"
                opacity={0.8}
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="rgba(0,0,0,0.4)"
              />
              <Flex
                position="relative"
                height="100%"
                direction="column"
                justify="center"
                align="flex-start"
                p={{ base: 3, md: 6 }}
              >
                <Text fontSize={{ base: "xs", md: "lg" }} fontWeight="medium" color="white" mb={{ base: 1, md: 2 }}>
                  Current Plan
                </Text>
                <Flex align="center" justify="space-between" width="full">
                  <Text fontSize={{ base: "lg", md: "3xl" }} fontWeight="bold" color="white">
                    {currentPlan ? currentPlan.subscriptionType : 'Loading...'}
                  </Text>
                  <Icon as={FaRocket} boxSize={{ base: 4, md: 8 }} color="white" />
                </Flex>
                <Text fontSize={{ base: "2xs", md: "sm" }} color="white" mt={{ base: 1, md: 2 }}>
                  Expires: {currentPlan ? new Date(currentPlan.endDate).toLocaleDateString() : 'N/A'}
                </Text>
              </Flex>
            </Box>
          </AspectRatio>
        </MotionBox>
      </SimpleGrid>
    );
  };

  const creditPackages = [
    { credits: 50, price: 9.99, videos: 5 },
    { credits: 100, price: 18.99, videos: 10 },
    { credits: 250, price: 44.99, videos: 25 },
    { credits: 500, price: 84.99, videos: 50 },
  ];

  const handlePackageSelect = (pkg) => {
    console.log('Selected package:', pkg);
  };

  return (
    <>
      <style jsx global>{`
        .crisp-client .cc-kv6t .cc-1ada {
          bottom: 20px !important;
        }
      `}</style>
      <Box minHeight="100vh" bg={bgColor} py={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            <Box>
              <Heading as="h1" size="2xl" color={headingColor} mb={2}>
                Subscription & Credits
              </Heading>
              <Text fontSize="lg" color={secondaryTextColor}>
                Manage your subscription and credit balance
              </Text>
            </Box>
           
            {renderCurrentInfo()}
           
            <Tabs isFitted variant="enclosed" index={activeTab} onChange={(index) => setActiveTab(index)}>
              <TabList mb="1em">
                <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Credits</Tab>
                <Tab _selected={{ color: 'white', bg: 'purple.500' }}>Subscription</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={12} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                      {creditPackages.map((pkg, index) => (
                        <MotionBox
                          key={index}
                          bg={cardBgColor}
                          p={6}
                          borderRadius="xl"
                          boxShadow={`0 4px 6px ${shadowColor}`}
                          transition="all 0.3s"
                          _hover={{ transform: 'translateY(-5px)', boxShadow: `0 6px 8px ${shadowColor}` }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <VStack spacing={3} align="start">
                            <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                              {pkg.credits} Credits
                            </Text>
                            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                              ${pkg.price}
                            </Text>
                            <Text fontSize="sm" color={secondaryTextColor}>
                              Approx. {pkg.videos} videos
                            </Text>
                            <Button
                              colorScheme="purple"
                              width="full"
                              onClick={() => handlePackageSelect(pkg)}
                            >
                              Buy Now
                            </Button>
                          </VStack>
                        </MotionBox>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={12} align="stretch">
                     <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {['Clipzy', 'Clipzy Pro', 'Clipzy Enterprise'].map((planName) => {
                        const plan = plans.find(p => p.name === planName);
                        if (!plan) return null;
                        return (
                          <MotionBox
                            key={plan.name}
                            bg={cardBgColor}
                            p={6}
                            borderRadius="xl"
                            boxShadow={`0 4px 6px ${shadowColor}`}
                            transition="all 0.3s"
                            _hover={{ transform: 'translateY(-5px)', boxShadow: `0 6px 8px ${shadowColor}` }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <VStack spacing={3} align="start">
                              <Flex align="center" justify="space-between" width="full">
                                <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                                  {plan.name}
                                </Text>
                                <Icon as={plan.icon} boxSize={8} color={accentColor} />
                              </Flex>
                              <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                ${parseFloat(plan.monthlyPrice).toFixed(2)}/mo
                              </Text>
                              <Text fontSize="sm" color={secondaryTextColor}>
                                or ${parseFloat(plan.yearlyPrice).toFixed(2)}/year
                              </Text>
                              <Text fontSize="sm" color={secondaryTextColor}>
                                {plan.videoLimit} videos/month
                              </Text>
                              <VStack align="start" spacing={2}>
                                {plan.features.map((feature, idx) => (
                                  <Flex key={idx} align="center">
                                    <Icon as={FaCheck} color={accentColor} mr={2} />
                                    <Text fontSize="sm">{feature}</Text>
                                  </Flex>
                                ))}
                              </VStack>
                              <Button
                                colorScheme="purple"
                                width="full"
                                onClick={() => handlePlanSelect(plan)}
                              >
                                {plan.name === subscription.name ? 'Current Plan' : 'Select Plan'}
                              </Button>
                            </VStack>
                          </MotionBox>
                        );
                      })}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Container>
      </Box>
    </>
  );
  }
  
  export default SubscriptionAndCredits;