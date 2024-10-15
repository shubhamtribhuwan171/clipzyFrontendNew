// WouldYouRatherQuestions.js

import React from 'react';
import {
  VStack, HStack, Button, Text, Card, CardBody, Input, SimpleGrid, Box, Checkbox,
  Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb, IconButton,
  useColorModeValue, FormControl, FormLabel, Image,
} from '@chakra-ui/react';
import { FiPlus, FiArrowLeft, FiArrowRight, FiTrash2, FiHelpCircle, FiUpload, FiX } from 'react-icons/fi';

function WouldYouRatherQuestions({
  questions,
  setQuestions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  addNewQuestion,
  deleteQuestion,
  updateQuestionField,
  handleImageUpload,
  handleImageRemove
}) {
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('purple.500', 'purple.300');

  const renderQuestionCard = (questionData, index) => (
    <Card borderColor={borderColor} borderWidth={1} bg={cardBgColor}>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>
              <HStack>
                <FiHelpCircle color={accentColor} />
                <Text>Question</Text>
              </HStack>
            </FormLabel>
            <Input
              placeholder="Enter your 'Would You Rather' question"
              value={questionData.question}
              onChange={(e) => updateQuestionField(index, 'question', e.target.value)}
              color={textColor}
            />
          </FormControl>
          
          <SimpleGrid columns={2} spacing={4}>
            {['option1', 'option2'].map((opt, optIndex) => (
              <Box key={opt}>
                <FormControl>
                  <FormLabel fontSize="sm" color={textColor}>Option {optIndex + 1}</FormLabel>
                  <Input
                    placeholder={`Enter option ${optIndex + 1}`}
                    value={questionData[opt]}
                    onChange={(e) => updateQuestionField(index, opt, e.target.value)}
                    color={textColor}
                  />
                </FormControl>
                
                <FormControl mt={2}>
                  <FormLabel fontSize="sm" color={textColor}>Option {optIndex + 1} Image</FormLabel>
                  <HStack>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index, opt)}
                      style={{ display: 'none' }}
                      id={`image-upload-${index}-${opt}`}
                    />
                    <label htmlFor={`image-upload-${index}-${opt}`}>
                      <Button as="span" leftIcon={<FiUpload />} size="sm" colorScheme="purple">
                        {questionData[`${opt}Image`] ? 'Change Image' : 'Upload Image'}
                      </Button>
                    </label>
                    {questionData[`${opt}Image`] && (
                      <IconButton
                        icon={<FiX />}
                        size="sm"
                        colorScheme="red"
                        aria-label={`Remove option ${optIndex + 1} image`}
                        onClick={() => handleImageRemove(index, opt)}
                      />
                    )}
                  </HStack>
                  {questionData[`${opt}Image`] && (
                    <Image
                      src={questionData[`${opt}Image`]}
                      maxH="100px"
                      objectFit="cover"
                      borderRadius="md"
                      mt={2}
                    />
                  )}
                </FormControl>
                
                <Checkbox
                  isChecked={questionData[`${opt}Frame`]}
                  onChange={(e) => updateQuestionField(index, `${opt}Frame`, e.target.checked)}
                  mt={2}
                  color={textColor}
                >
                  Add white frame to image
                </Checkbox>
                
                <FormControl mt={2}>
                  <FormLabel fontSize="sm" color={textColor}>Transition Effect</FormLabel>
                  <Select
                    value={questionData[`${opt}Transition`]}
                    onChange={(e) => updateQuestionField(index, `${opt}Transition`, e.target.value)}
                    color={textColor}
                  >
                    <option value="fade">Fade</option>
                    <option value="slideLeft">Slide Left</option>
                    <option value="slideRight">Slide Right</option>
                    <option value="slideUp">Slide Up</option>
                    <option value="slideDown">Slide Down</option>
                  </Select>
                </FormControl>
                
                <FormControl mt={2}>
                  <FormLabel fontSize="sm" color={textColor}>Statistic for Option {optIndex + 1} (%)</FormLabel>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={questionData[`stat${optIndex + 1}`]}
                    onChange={(value) => updateQuestionField(index, `stat${optIndex + 1}`, value)}
                    colorScheme={opt === 'option1' ? 'red' : 'blue'}
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                  <Text fontSize="xs" textAlign="right" color={textColor}>
                    {questionData[`stat${optIndex + 1}`]}%
                  </Text>
                </FormControl>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Button leftIcon={<FiPlus />} onClick={addNewQuestion} colorScheme="purple" size="sm">
          Add New Question
        </Button>
        <HStack>
          <IconButton
            icon={<FiArrowLeft />}
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            isDisabled={currentQuestionIndex === 0}
            aria-label="Previous Question"
            size="sm"
            colorScheme="purple"
          />
          <Text color={textColor} fontWeight="bold">
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
          <IconButton
            icon={<FiArrowRight />}
            onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            isDisabled={currentQuestionIndex === questions.length - 1}
            aria-label="Next Question"
            size="sm"
            colorScheme="purple"
          />
          {questions.length > 1 && (
            <IconButton
              icon={<FiTrash2 />}
              onClick={() => deleteQuestion(currentQuestionIndex)}
              aria-label="Delete Question"
              size="sm"
              colorScheme="red"
              variant="ghost"
            />
          )}
        </HStack>
      </HStack>
      
      {renderQuestionCard(questions[currentQuestionIndex], currentQuestionIndex)}
    </VStack>
  );
}

export default WouldYouRatherQuestions;
