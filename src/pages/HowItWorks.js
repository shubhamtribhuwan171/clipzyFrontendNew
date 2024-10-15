import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, SimpleGrid } from '@chakra-ui/react';
import { AIScriptGeneratorCard } from './AIScriptGeneratorCard';
import { CustomizeAndStyleCard } from '../components/CustomizeAndStyleCard';
import { FinishAndExportCard } from './FinishAndExportCard';

export const HowItWorks = () => {
  return (
    <VStack spacing={12} align="stretch" py={20}>
      <Heading size="2xl" mb={4} color="white" textAlign="center">How It Works</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <AIScriptGeneratorCard />
        <CustomizeAndStyleCard />
        <FinishAndExportCard />
      </SimpleGrid>
    </VStack>
  );
};