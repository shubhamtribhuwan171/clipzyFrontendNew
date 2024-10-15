
import React, { useState, useEffect } from 'react';
import {
    Box, Container, Heading, Text, SimpleGrid, Image, VStack, HStack, Center, GridItem, TagLabel, Avatar, Circle, Grid,
    TagLeftIcon, Button, Flex, Icon, List, ListItem, ListIcon, Skeleton, useColorModeValue, Wrap, WrapItem, Progress, Link, useDisclosure, Badge, Input, Tag
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const BlogsInsights = () => {
    const styles = {
        container: {
            backgroundColor: '#e7eefb',
            textAlign: 'center',
            padding: '50px 20px',
            fontFamily: 'Arial, sans-serif',
        },
        experienceButton: {
            backgroundColor: 'white',
            border: '1px solid #d0d5e0',
            borderRadius: '20px',
            padding: '5px 20px',
            fontSize: '12px',
            marginBottom: '20px',
            cursor: 'pointer',
        },
        title: {
            fontSize: '48px',
            color: '#1b1f24',
        },
        description: {
            fontSize: '18px',
            color: '#525a61',
            marginTop: '10px',
            marginBottom: '30px',
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
        },
        tryFreeButton: {
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#ffffff',
            color: '#0d5dfc',
            border: '2px solid #0d5dfc',
            borderRadius: '30px',
            cursor: 'pointer',
        },
        learnMoreButton: {
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#0d5dfc',
            color: '#ffffff',
            borderRadius: '30px',
            border: 'none',
            cursor: 'pointer',
        },
        noCreditCard: {
            fontSize: '12px',
            color: '#9b9b9b',
            marginTop: '20px',
        },
    };

    const cardBg = useColorModeValue('white', 'gray.800');
    const cardTextColor = useColorModeValue('gray.600', 'gray.300');
    const cardDateColor = useColorModeValue('gray.500', 'gray.400');
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCardClick = (id) => {
        navigate(`/blogDetails/${id}`); // Navigate to blog detail page with the blog id
    };

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await fetch('https://strapi-ai-9.onrender.com/api/blog-alls'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch blog data');
                }
                const data = await response.json();
                setBlogData(data || null);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchBlogData();
    }, []);

    return (
        <div>
            <div style={styles.container}>
                <div>
                    <button style={styles.experienceButton}>Experience Creative Freedom</button>
                </div>
                <h1 style={styles.title}>Blogs & Insights</h1>
                <p style={styles.description}>
                    Get Quick tips and how-tos for content and marketing teams and take your game to next level
                </p>
                <div style={styles.buttonsContainer}>
                    <button style={styles.tryFreeButton}>Try us for Free</button>
                    <button style={styles.learnMoreButton}>Learn More</button>
                </div>
                <p style={styles.noCreditCard}>No credit card required.</p>

            </div>
            <div>
                <Box maxW="7xl" mx="auto" py={8} px={4}>
                    <Heading as="h1" size="xl" mb={8} textAlign="center">
                        Latest Blog Posts
                    </Heading>

                    {isLoading && <Text>Loading...</Text>}

                    {error && <Text color="red.500">{error}</Text>}

                    {blogData && blogData.data && (
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                            {blogData.data.map((post) => (
                                <GridItem key={post.id} onClick={() => handleCardClick(post.id)}>
                                    <Box
                                        bg="white"
                                        boxShadow="md"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        p={5}
                                    >
                                        <Image src={post.image} alt={post.title} borderRadius="md" mb={4} />
                                        <Text
                                            fontSize="xs"
                                            color="blue.500"
                                            mb={2}
                                            textTransform="uppercase"
                                            fontWeight="bold"
                                        >
                                            Short Form Content
                                        </Text>
                                        <Text
                                            color="gray.500"
                                            fontSize="xs"
                                            mb={4}
                                        >
                                            {new Date(post.publishedAt).toLocaleDateString()}
                                        </Text>
                                        <Heading as="h2" size="md" mb={4}>
                                            {post.title}
                                        </Heading>
                                        <Text color="gray.600">{post.description}</Text>
                                    </Box>
                                </GridItem>
                            ))}
                        </Grid>
                    )}

                    {!isLoading && !blogData && <Text>No blog data available</Text>}
                </Box>
            </div>
        </div>
    );
};

export default BlogsInsights;
