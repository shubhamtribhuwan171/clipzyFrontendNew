import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Icon,
  Badge,
  Divider,
  Switch,
  ScaleFade,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaRocket, FaStar, FaCrown, FaCheck, FaInfoCircle } from 'react-icons/fa';

const MotionBox = motion(Box);

function Subscription() {
  const [isYearly, setIsYearly] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    fetchUserInfo();
    fetchPlans();
  }, []);

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
        icon: plan.name === 'Starter' ? FaBolt : FaRocket, // Assign icons based on plan name
        monthlyPrice: plan.price / 100, // Convert price to dollars
        yearlyPrice: (plan.price * 12 * 0.8) / 100, // 20% discount for yearly
        videoLimit: plan.tokensCount,
        features: plan.description.split(', ')
      }));
      setPlans(fetchedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const modalTextColor = useColorModeValue('gray.600', 'gray.400');

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
      name: "Your Company Name",
      description: `Subscription for ${selectedPlan.name} plan`,
      order_id: data.orderId,
      handler: function (response) {
        console.log('Razorpay payment response:', response);
        handlePaymentConfirmation(response);
      },
      prefill: {
        name: "User's Name",
        email: "user@example.com",
        contact: "9999999999"
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
      // Handle successful payment
    } catch (error) {
      console.error('Error confirming payment:', error.response ? error.response.data : error.message);
      console.error('Full error object:', error);
      // Handle payment confirmation error
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={16} px={4}>
      <VStack spacing={12} align="stretch" maxW="1200px" mx="auto">
        <VStack spacing={4} textAlign="center">
          <Heading as="h1" size="2xl" color={textColor}>
            Unleash Your Creative Potential
          </Heading>
          <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')}>
            Choose the perfect plan to revolutionize your content creation workflow
          </Text>
        </VStack>

        <Flex justify="center" align="center">
          <Text mr={3} fontWeight="bold" color={textColor}>
            Monthly
          </Text>
          <Switch
            size="lg"
            colorScheme="purple"
            isChecked={isYearly}
            onChange={() => setIsYearly(!isYearly)}
          />
          <Text ml={3} fontWeight="bold" color={textColor}>
            Yearly
          </Text>
          <Badge ml={2} colorScheme="green" variant="solid" fontSize="0.8em">
            Save up to 20%
          </Badge>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <AnimatePresence>
            {plans.map((plan, index) => (
              <MotionBox
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ScaleFade initialScale={0.9} in={true}>
                  <Box
                    bg={cardBgColor}
                    p={6}
                    borderRadius="lg"
                    boxShadow="xl"
                    position="relative"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
                  >
                    <VStack spacing={4} align="stretch">
                      <Flex justify="space-between" align="center">
                        <Icon as={plan.icon} w={10} h={10} color={accentColor} />
                        <Badge colorScheme="purple" variant="solid" fontSize="0.8em">
                          {plan.videoLimit} tokens/month
                        </Badge>
                      </Flex>
                      <Heading size="lg" color={textColor}>
                        {plan.name}
                      </Heading>
                      <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                        ${isYearly ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                        <Text as="span" fontSize="sm" fontWeight="normal" color={textColor}>
                          {isYearly ? '/year' : '/month'}
                        </Text>
                      </Text>
                      <Divider />
                      <VStack align="start" spacing={2}>
                        {plan.features.map((feature, index) => (
                          <Flex key={index} align="center">
                            <Icon as={FaCheck} color={accentColor} mr={2} />
                            <Text color={textColor}>{feature}</Text>
                          </Flex>
                        ))}
                      </VStack>
                      <Button
                        colorScheme="purple"
                        size="lg"
                        w="full"
                        mt={4}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        Get Started
                      </Button>
                    </VStack>
                    {plan.name === 'Pro' && (
                      <Badge
                        position="absolute"
                        top={4}
                        right={4}
                        colorScheme="orange"
                        variant="solid"
                        fontSize="0.8em"
                      >
                        Most Popular
                      </Badge>
                    )}
                  </Box>
                </ScaleFade>
              </MotionBox>
            ))}
          </AnimatePresence>
        </SimpleGrid>

        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
            Not sure which plan is right for you?
          </Text>
          <Button
            rightIcon={<FaInfoCircle />}
            colorScheme="purple"
            variant="outline"
            size="lg"
          >
            Compare Plans
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}

export default Subscription;