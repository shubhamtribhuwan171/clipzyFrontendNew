import React from 'react';
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
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCoins, FaVideo } from 'react-icons/fa';

const MotionBox = motion(Box);

function AddCredits() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('purple.500', 'purple.300');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  const creditPackages = [
    { credits: 50, price: 9.99, videos: 5 },
    { credits: 100, price: 18.99, videos: 10 },
    { credits: 250, price: 44.99, videos: 25 },
    { credits: 500, price: 84.99, videos: 50 },
  ];

  const handlePackageSelect = (pkg) => {
    // Implement purchase logic here
    console.log('Selected package:', pkg);
  };

  return (
    <Box bg={bgColor} minH="100vh" py={16} px={4}>
      <VStack spacing={12} align="stretch" maxW="1200px" mx="auto">
        <VStack spacing={4} textAlign="center">
          <Heading as="h1" size="2xl" bgGradient={`linear(to-r, ${accentColor}, blue.400)`} bgClip="text">
            Fuel Your Creativity
          </Heading>
          <Text fontSize="xl" color={secondaryTextColor}>
            Choose a credit package and start creating amazing videos
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {creditPackages.map((pkg, index) => (
            <MotionBox
              key={index}
              whileHover={{ scale: 1.05, boxShadow: "xl" }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                bg={cardBgColor}
                p={6}
                borderRadius="xl"
                boxShadow="lg"
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-20px"
                  left="-20px"
                  bg={accentColor}
                  w="100px"
                  h="100px"
                  transform="rotate(-45deg)"
                />
                <Icon as={FaCoins} w={10} h={10} color={accentColor} mb={4} position="relative" zIndex={1} />
                <Text fontSize="4xl" fontWeight="bold" color={accentColor} mb={2}>
                  {pkg.credits}
                </Text>
                <Text fontSize="lg" color={textColor} mb={4}>
                  Credits
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={6}>
                  ${pkg.price}
                </Text>
                <Flex justify="center" align="center" mb={6}>
                  <Icon as={FaVideo} w={5} h={5} color={accentColor} mr={2} />
                  <Text fontSize="sm" color={secondaryTextColor}>
                    Approx. {pkg.videos} videos
                  </Text>
                </Flex>
                <Button
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  onClick={() => handlePackageSelect(pkg)}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Get Started
                </Button>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>

        <Flex justify="center">
          <Tooltip label="Credits can be used anytime" placement="top">
            <Badge colorScheme="green" fontSize="lg" p={2} borderRadius="full" boxShadow="sm">
              Credits never expire!
            </Badge>
          </Tooltip>
        </Flex>
      </VStack>
    </Box>
  );
}

export default AddCredits;