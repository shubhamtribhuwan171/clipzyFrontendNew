// WouldYouRatherSettings.js

import React from 'react';
import {
  VStack, HStack, Text, Button, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  IconButton, SimpleGrid, useColorModeValue, FormControl, FormLabel, Switch, Image,
  Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  Card, CardBody
} from '@chakra-ui/react';
import { FiClock, FiAperture, FiImage, FiUpload, FiX } from 'react-icons/fi';

function WouldYouRatherSettings({
  delay,
  setDelay,
  answerDuration,
  setAnswerDuration,
  aspectRatio,
  handleAspectRatioChange,
  backgroundImage,
  handleBackgroundImageUpload,
  handleBackgroundImageRemove,
  backgroundAnimation,
  setBackgroundAnimation,
  logoImage,
  handleLogoImageUpload,
  handleLogoImageRemove,
  showConfetti,
  setShowConfetti,
  showBackgroundAnimation,
  setShowBackgroundAnimation
}) {
  // Color scheme
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const renderSettingsCard = (title, icon, content) => (
    <Card bg={cardBgColor} shadow="md" borderRadius="lg" borderWidth={1} borderColor={borderColor}>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack>
            {icon}
            <Text fontWeight="bold" fontSize="md" color={textColor}>{title}</Text>
          </HStack>
          {content}
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <VStack spacing={6} align="stretch">
      {renderSettingsCard("Timing", <FiClock />, (
        <SimpleGrid columns={2} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Delay before revealing answer (seconds)</FormLabel>
            <NumberInput min={1} max={10} value={delay} onChange={(value) => setDelay(Number(value))}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Duration to show answer (seconds)</FormLabel>
            <NumberInput min={1} max={10} value={answerDuration} onChange={(value) => setAnswerDuration(Number(value))}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>
      ))}

      {renderSettingsCard("Aspect Ratio", <FiAperture />, (
        <Select value={aspectRatio} onChange={(e) => handleAspectRatioChange(e.target.value)}>
          <option value="9:16">Vertical (9:16)</option>
          <option value="16:9">Widescreen (16:9)</option>
        </Select>
      ))}

      {renderSettingsCard("Background", <FiImage />, (
        <VStack spacing={4} align="stretch">
          <HStack>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageUpload}
              style={{ display: 'none' }}
              id="background-image-upload"
            />
            <label htmlFor="background-image-upload">
              <Button as="span" leftIcon={<FiUpload />} size="sm">
                {backgroundImage ? 'Change Background' : 'Upload Background'}
              </Button>
            </label>
            {backgroundImage && (
              <IconButton
                icon={<FiX />}
                size="sm"
                aria-label="Remove background image"
                onClick={handleBackgroundImageRemove}
              />
            )}
          </HStack>
          {backgroundImage && (
            <Image src={backgroundImage} maxH="100px" objectFit="cover" borderRadius="md" />
          )}
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Background Animation</FormLabel>
            <Select
              value={backgroundAnimation}
              onChange={(e) => setBackgroundAnimation(e.target.value)}
              size="sm"
            >
              <option value="none">None</option>
              <option value="continuousMoveUp">Continuous Move Up</option>
            </Select>
          </FormControl>
        </VStack>
      ))}

      {renderSettingsCard("Logo", <FiImage />, (
        <VStack spacing={4} align="stretch">
          <HStack>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoImageUpload}
              style={{ display: 'none' }}
              id="logo-image-upload"
            />
            <label htmlFor="logo-image-upload">
              <Button as="span" leftIcon={<FiUpload />} size="sm">
                {logoImage ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </label>
            {logoImage && (
              <IconButton
                icon={<FiX />}
                size="sm"
                aria-label="Remove logo"
                onClick={handleLogoImageRemove}
              />
            )}
          </HStack>
          {logoImage && (
            <Image src={logoImage} maxH="100px" objectFit="contain" borderRadius="md" />
          )}
        </VStack>
      ))}

      {renderSettingsCard("Effects", null, (
        <SimpleGrid columns={2} spacing={4}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="show-confetti" mb="0" fontSize="sm" color={textColor}>
              Show Confetti
            </FormLabel>
            <Switch
              id="show-confetti"
              isChecked={showConfetti}
              onChange={(e) => setShowConfetti(e.target.checked)}
              colorScheme="purple"
            />
          </FormControl>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="show-bg-animation" mb="0" fontSize="sm" color={textColor}>
              Show Background Animation
            </FormLabel>
            <Switch
              id="show-bg-animation"
              isChecked={showBackgroundAnimation}
              onChange={(e) => setShowBackgroundAnimation(e.target.checked)}
              colorScheme="purple"
            />
          </FormControl>
        </SimpleGrid>
      ))}
    </VStack>
  );
}

export default WouldYouRatherSettings;
