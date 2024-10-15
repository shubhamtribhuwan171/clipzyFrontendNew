import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { Box, Button, Flex, Text, useColorModeValue, VStack, HStack, Icon, Divider, useBreakpointValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@chakra-ui/icons';
import 'react-day-picker/dist/style.css';

const CustomDatePicker = ({ dateRange, onDateChange }) => {
  const [month, setMonth] = useState(new Date());
  const [range, setRange] = useState(dateRange);

  useEffect(() => {
    setRange(dateRange);
  }, [dateRange]);

  const handleRangeSelect = (newRange) => {
    setRange(newRange);
  };

  const handleApply = () => {
    if (range?.from && range?.to) {
      onDateChange(range);
    }
  };

  const primaryColor = useColorModeValue('purple.500', 'purple.300');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverColor = useColorModeValue('purple.50', 'rgba(214, 188, 250, 0.12)');
  const selectedBgColor = useColorModeValue('purple.100', 'rgba(214, 188, 250, 0.24)');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date';
  };

  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <Box bg={bgColor} borderRadius="2xl" boxShadow="xl" overflow="hidden" width="100%" maxWidth={{ base: "100%", md: "320px" }}>
      <VStack spacing={0} align="stretch">
        <Flex justifyContent="space-between" alignItems="center" p={4} bg={primaryColor}>
          <Text fontSize="lg" fontWeight="bold" color="white">
            Select Dates
          </Text>
          <Button size="sm" onClick={() => setMonth(new Date())} colorScheme="whiteAlpha" variant="solid">
            Today
          </Button>
        </Flex>
        <Box p={4}>
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
            month={month}
            onMonthChange={setMonth}
            styles={{
              months: { justifyContent: 'center' },
              caption: { color: textColor, fontSize: '0.9rem', fontWeight: 'bold' },
              head_cell: { color: textColor, fontSize: '0.8rem' },
              day: { color: textColor, fontSize: '0.9rem' },
              day_outside: { color: `${textColor}66` },
              nav_button: { color: primaryColor },
              nav_button_previous: { marginRight: '0.5rem' },
              nav_button_next: { marginLeft: '0.5rem' },
              table: { width: '100%' },
              cell: { width: isSmallScreen ? '14.28%' : 'auto' },
            }}
            components={{
              IconLeft: () => <ChevronLeftIcon boxSize={5} />,
              IconRight: () => <ChevronRightIcon boxSize={5} />,
            }}
            modifiersStyles={{
              selected: { 
                backgroundColor: selectedBgColor,
                color: primaryColor,
                fontWeight: 'bold'
              },
              range_start: { 
                borderTopLeftRadius: '50%', 
                borderBottomLeftRadius: '50%',
                color: 'white',
                backgroundColor: primaryColor
              },
              range_end: { 
                borderTopRightRadius: '50%', 
                borderBottomRightRadius: '50%',
                color: 'white',
                backgroundColor: primaryColor
              },
              range_middle: { backgroundColor: selectedBgColor },
              today: { 
                border: `2px solid ${primaryColor}`,
                backgroundColor: 'transparent',
                color: primaryColor
              },
            }}
          />
        </Box>
        <Divider />
        <VStack spacing={2} p={4} align="stretch" bg={useColorModeValue('gray.50', 'gray.700')}>
          <HStack justifyContent="space-between">
            <Text color={textColor} fontWeight="medium" fontSize="sm">
              <Icon as={CalendarIcon} mr={2} color={primaryColor} />
              Start Date:
            </Text>
            <Text color={primaryColor} fontWeight="semibold" fontSize="sm">
              {formatDate(range?.from)}
            </Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text color={textColor} fontWeight="medium" fontSize="sm">
              <Icon as={CalendarIcon} mr={2} color={primaryColor} />
              End Date:
            </Text>
            <Text color={primaryColor} fontWeight="semibold" fontSize="sm">
              {formatDate(range?.to)}
            </Text>
          </HStack>
          <Button
            onClick={handleApply}
            colorScheme="purple"
            isDisabled={!range?.from || !range?.to}
            size="md"
            width="100%"
            mt={2}
          >
            Apply Range
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default CustomDatePicker;