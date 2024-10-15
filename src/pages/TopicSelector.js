import React from 'react';
import Select from 'react-select';
import { FormControl, FormLabel, useColorModeValue } from '@chakra-ui/react';

const TopicSelector = ({ selectedTopic, onTopicChange }) => {
    const topics = [
        { value: "Custom", label: "Custom" },
        { value: "Fun Facts", label: "Fun Facts" },
        { value: "How To", label: "How To" },
        { value: "Listicle", label: "Listicle" },
        { value: "Motivational", label: "Motivational" },
        { value: "Personal", label: "Personal" },
        { value: "Horror", label: "Horror" },
        { value: "Life Hack", label: "Life Hack" },
        { value: "Fantasy", label: "Fantasy" },
        { value: "Business", label: "Business" },
        { value: "Philosophy", label: "Philosophy" }
    ];

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const selectedBgColor = useColorModeValue('blue.500', 'blue.200');
    const selectedTextColor = useColorModeValue('white', 'gray.800');
    const hoverBgColor = useColorModeValue('blue.50', 'blue.700');
    const textColor = useColorModeValue('gray.800', 'white');

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: bgColor,
            borderColor: borderColor,
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: bgColor,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? selectedBgColor
                : state.isFocused 
                    ? hoverBgColor
                    : 'transparent',
            color: state.isSelected 
                ? selectedTextColor
                : textColor,
        }),
    };

    return (
        <FormControl>
            <FormLabel>Select a Topic</FormLabel>
            <Select
                options={topics}
                value={topics.find(topic => topic.value === selectedTopic)}
                onChange={(selectedOption) => onTopicChange(selectedOption.value)}
                styles={customStyles}
                placeholder="Choose a topic"
            />
        </FormControl>
    );
};

export default TopicSelector;