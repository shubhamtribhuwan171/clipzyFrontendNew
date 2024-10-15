import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const CompletionScreen = () => {
    return (
        <Box textAlign="center" py={10}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading size="xl" mb={4}>
                    Your video is ready!
                </Heading>
                <Text fontSize="lg">Preparing to showcase your creation...</Text>
            </motion.div>
        </Box>
    );
};

export default CompletionScreen;