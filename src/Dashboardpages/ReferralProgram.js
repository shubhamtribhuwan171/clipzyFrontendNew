import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Input, Button, useClipboard, useToast,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,IconButton,
  useColorModeValue, Icon, Flex, Progress, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Avatar, AvatarGroup, Tooltip, Link
} from '@chakra-ui/react';
import { FaUserFriends, FaCoins, FaLink, FaShareAlt, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const ReferralProgram = () => {
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [nextTier, setNextTier] = useState({ threshold: 0, reward: 0 });
  const { hasCopied, onCopy } = useClipboard(referralLink);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', '#121212');
  const cardBgColor = useColorModeValue('white', '#1E1E1E');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const statBgColor = useColorModeValue('purple.500', 'purple.700');
  const statTextColor = 'white';

  useEffect(() => {
    // Simulating API call to fetch referral data
    setTimeout(() => {
      setReferralLink(`https://www.clipzy.ai/refer/${Math.random().toString(36).substr(2, 9)}`);
      setReferrals([
        { name: 'John Doe', date: '2023-05-01', status: 'Signed Up' },
        { name: 'Jane Smith', date: '2023-05-03', status: 'Subscribed' },
        { name: 'Bob Johnson', date: '2023-05-05', status: 'Signed Up' },
      ]);
      setTotalCredits(600);
      setNextTier({ threshold: 20, reward: 1000 });
    }, 1000);
  }, []);

  const handleShare = (platform) => {
    // Implement sharing logic for each platform
    toast({
      title: `Sharing on ${platform}`,
      description: "Opening share dialog...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box minHeight="100vh" bg={bgColor} py={8}>
      <VStack align="stretch" spacing={8} maxWidth="1200px" margin="auto" px={4}>
        <Heading size="xl" color={textColor}>Refer Friends, Earn Rewards</Heading>
        <Text fontSize="lg" color={textColor}>Invite your friends to join Clipzy AI and earn amazing rewards!</Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat bg={statBgColor} p={4} borderRadius="lg" boxShadow="md">
            <StatLabel color={statTextColor}>Total Referrals</StatLabel>
            <StatNumber color={statTextColor}>{referrals.length}</StatNumber>
            <StatHelpText color={statTextColor}>
              <Progress value={(referrals.length / nextTier.threshold) * 100} size="sm" colorScheme="green" />
              {referrals.length} / {nextTier.threshold} to next tier
            </StatHelpText>
          </Stat>
          <Stat bg={statBgColor} p={4} borderRadius="lg" boxShadow="md">
            <StatLabel color={statTextColor}>Credits Earned</StatLabel>
            <StatNumber color={statTextColor}>{totalCredits}</StatNumber>
            <StatHelpText color={statTextColor}>50 credits per referral</StatHelpText>
          </Stat>
          <Stat bg={statBgColor} p={4} borderRadius="lg" boxShadow="md">
            <StatLabel color={statTextColor}>Next Tier Reward</StatLabel>
            <StatNumber color={statTextColor}>{nextTier.reward} credits</StatNumber>
            <StatHelpText color={statTextColor}>at {nextTier.threshold} referrals</StatHelpText>
          </Stat>
        </SimpleGrid>

        <MotionBox
          bg={cardBgColor}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <VStack align="stretch" spacing={4}>
            <Heading size="md" color={textColor}>Your Referral Link</Heading>
            <Flex>
              <Input value={referralLink} isReadOnly pr="4.5rem" color={textColor} bg={useColorModeValue('gray.100', 'gray.700')} />
              <Button onClick={onCopy} ml={2} colorScheme="purple">
                {hasCopied ? "Copied!" : "Copy"}
              </Button>
            </Flex>
            <Text fontSize="sm" color={textColor}>Share your referral link on:</Text>
            <Flex justify="center" gap={4}>
              <IconButton icon={<FaTwitter />} onClick={() => handleShare('Twitter')} colorScheme="twitter" aria-label="Share on Twitter" />
              <IconButton icon={<FaFacebook />} onClick={() => handleShare('Facebook')} colorScheme="facebook" aria-label="Share on Facebook" />
              <IconButton icon={<FaLinkedin />} onClick={() => handleShare('LinkedIn')} colorScheme="linkedin" aria-label="Share on LinkedIn" />
            </Flex>
          </VStack>
        </MotionBox>

        <MotionBox
          bg={cardBgColor}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Heading size="md" mb={4} color={textColor}>Referral History</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color={textColor}>Name</Th>
                <Th color={textColor}>Date</Th>
                <Th color={textColor}>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {referrals.map((referral, index) => (
                <Tr key={index}>
                  <Td color={textColor}>{referral.name}</Td>
                  <Td color={textColor}>{referral.date}</Td>
                  <Td>
                    <Badge colorScheme={referral.status === 'Subscribed' ? 'green' : 'yellow'}>
                      {referral.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {['Refer 5 friends', 'Refer 10 friends', 'Refer 20 friends'].map((milestone, index) => (
            <MotionBox
              key={index}
              bg={cardBgColor}
              p={4}
              borderRadius="lg"
              boxShadow="md"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <VStack>
                <Icon as={FaUserFriends} boxSize={8} color="blue.500" />
                <Text fontWeight="bold" color={textColor}>{milestone}</Text>
                <Text color={textColor}>Earn 500 bonus credits</Text>
              </VStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ReferralProgram;
