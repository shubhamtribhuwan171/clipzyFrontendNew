
import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Tag,
  Skeleton,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { CalendarIcon, ViewIcon, TimeIcon } from '@chakra-ui/icons';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await fetch(`https://strapi-ai-9.onrender.com/api/blog-alls`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog details');
        }
        const data = await response.json();
        const foundBlog = data.data.find((item) => item.id === parseInt(id));
        if (!foundBlog) {
          throw new Error('Blog not found');
        }
        setBlog(foundBlog);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const { title, bio, image, publishedAt } = blog;

  return (
    <Box bg={bgColor} minH="100vh" py={12}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          <Image
            src={image || '/placeholder.svg?height=400&width=800'}
            alt={title}
            borderRadius="xl"
            objectFit="cover"
            w="full"
            h={{ base: "250px", md: "400px" }}
            shadow="2xl"
          />
          <VStack align="start" spacing={6} bg="white" p={8} borderRadius="xl" shadow="md">
            <Heading as="h1" size="2xl" lineHeight="shorter" color="gray.800">
              {title}
            </Heading>
            <HStack spacing={4} wrap="wrap">
              <Tag size="lg" variant="subtle" colorScheme="blue">
                <HStack spacing={2}>
                  <CalendarIcon />
                  <Text>{new Date(publishedAt).toLocaleDateString()}</Text>
                </HStack>
              </Tag>
              <Tag size="lg" variant="subtle" colorScheme="green">
                <HStack spacing={2}>
                  <ViewIcon />
                  <Text>5 min read</Text>
                </HStack>
              </Tag>
              <Tag size="lg" variant="subtle" colorScheme="purple">
                <HStack spacing={2}>
                  <TimeIcon />
                  <Text>{new Date(publishedAt).toLocaleTimeString()}</Text>
                </HStack>
              </Tag>
            </HStack>
            <Divider />
            <Text fontSize="lg" lineHeight="tall" color='black'>
              {bio}
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

function LoadingSkeleton() {
  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          <Skeleton height="400px" borderRadius="xl" />
          <VStack align="start" spacing={6} bg="white" p={8} borderRadius="xl" shadow="md">
            <Skeleton height="40px" width="70%" />
            <HStack spacing={4}>
              <Skeleton height="30px" width="120px" />
              <Skeleton height="30px" width="120px" />
              <Skeleton height="30px" width="120px" />
            </HStack>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

function ErrorMessage({ message }) {
  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="4xl">
        <Box textAlign="center" py={10} px={6} bg="white" borderRadius="xl" shadow="md">
          <Heading as="h2" size="xl" mt={6} mb={2} color="red.500">
            Error
          </Heading>
          <Text color="gray.500">
            {message}
          </Text>
        </Box>
      </Container>
    </Box>
  );
}