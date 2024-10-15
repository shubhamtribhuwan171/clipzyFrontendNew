import React, { useState, useEffect } from 'react';
import {
    Box, Flex, VStack, Text, Input, Button, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
    Textarea, useColorModeValue, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Popover, PopoverTrigger, PopoverContent, PopoverBody, Grid, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
    Switch, Tooltip, Icon, InputGroup, InputLeftAddon, InputRightAddon
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { SketchPicker } from 'react-color';
import { FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FONT_FAMILIES = [
    { name: 'MONTSERRAT', fallback: 'sans-serif' },
    { name: 'THE BOLD FONT', fallback: 'sans-serif' },
    { name: 'ADDISON', fallback: 'cursive' },
    { name: 'DEUTSCH', fallback: 'fantasy' },
    { name: 'HOLTWOOD ONE', fallback: 'serif' },
    { name: 'JARO', fallback: 'sans-serif' },
    { name: 'KOMIKAX', fallback: 'cursive' },
    { name: 'LEMON', fallback: 'cursive' },
    { name: 'LT WAVE', fallback: 'sans-serif' },
    { name: 'LUCKIEST GUY', fallback: 'cursive' },
    { name: 'NEPOBOY', fallback: 'sans-serif' },
    { name: 'REBUCKED', fallback: 'fantasy' },
    { name: 'RUBIK GLITCH', fallback: 'sans-serif' },
    { name: 'PERMANENT MARKER', fallback: 'cursive' }
];
const FONT_WEIGHTS = ['normal', 'bold', 'light'];
const FONT_STYLES = ['normal', 'italic'];
const TEXT_CASES = ['Uppercase', 'Lowercase', 'Title Case', 'Sentence Case'];
const TEXT_ALIGNMENTS = ['left', 'center', 'right', 'justify'];
const TEXT_EFFECTS = ['None', 'Shadow', 'Outline', 'Glow'];
const BACKGROUND_TYPES = ['Transparent', 'Solid Color', 'Gradient', 'Blurred'];
const EMPHASIS_TECHNIQUES = ['Bold', 'Color', 'Size', 'Font'];
const STYLE_PRESETS = ['Minimalist', 'Bold and Dynamic', 'Professional', 'Energetic'];
const EMOJIS = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
const RENDERING_EFFECTS = ['All at once', 'One word at a time', 'One line at a time'];

function CaptionStylesGenerator({ selectedStyle }) {
    const [captionStyle, setCaptionStyle] = useState(selectedStyle || {
        fontFamily: 'MONTSERRAT, sans-serif',
        fontSize: 24,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textCase: 'Sentence Case',
        textColor: '#FFFFFF',
        highlightColor: '#FFFF00',
        highlightStrokeColor: '#000000',
        highlightBackgroundColor: '#00000050',
        textAlignment: 'center',
        textEffect: 'None',
        backgroundColor: 'transparent',
        backgroundGradient: ['#000000', '#FFFFFF'],
        backgroundBlur: 0,
        emphasisTechnique: 'Bold',
        wordsPerLine: 5,
        lineHeight: 1.5,
        effectIntensity: 50,
        textStrokeWidth: 0,
        textStrokeColor: '#000000',
        highlightStrokeWidth: 0,
        highlightStrokeColor: '#000000',
        textWidth: 'normal',
        highlightCornerRadius: 4,
        renderingEffect: 'All at once',
    });

    const [sampleText, setSampleText] = useState('Your amazing caption text here');
    const [previewStyle, setPreviewStyle] = useState({});
    const [customSymbols, setCustomSymbols] = useState([' ', ' ', ' ']);
    const [savedStyles, setSavedStyles] = useState([]);
    const [contentType, setContentType] = useState('General');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [highlightBackgroundEnabled, setHighlightBackgroundEnabled] = useState(true);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [highlightLogic, setHighlightLogic] = useState('Random');
    const [highlightEnabled, setHighlightEnabled] = useState(true);
    const [lastChangedProperty, setLastChangedProperty] = useState(null);

    useEffect(() => {
        const newPreviewStyle = {
            fontFamily: `"${captionStyle.fontFamily.split(',')[0]}", ${FONT_FAMILIES.find(f => f.name === captionStyle.fontFamily.split(',')[0]).fallback}`,
            fontSize: `${captionStyle.fontSize}px`,
            fontWeight: captionStyle.fontWeight,
            fontStyle: captionStyle.fontStyle,
            textTransform: captionStyle.textCase.toLowerCase(),
            color: captionStyle.textColor,
            textAlign: captionStyle.textAlignment,
            lineHeight: captionStyle.lineHeight,
            padding: '20px',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        };

        if (captionStyle.backgroundColor === 'Solid Color') {
            newPreviewStyle.backgroundColor = captionStyle.backgroundGradient[0];
        } else if (captionStyle.backgroundColor === 'Gradient') {
            newPreviewStyle.backgroundImage = `linear-gradient(to right, ${captionStyle.backgroundGradient[0]}, ${captionStyle.backgroundGradient[1]})`;
        } else if (captionStyle.backgroundColor === 'Blurred') {
            newPreviewStyle.backdropFilter = `blur(${captionStyle.backgroundBlur}px)`;
        }

        if (captionStyle.textEffect === 'Shadow') {
            newPreviewStyle.textShadow = `2px 2px ${captionStyle.effectIntensity / 25}px rgba(0,0,0,0.5)`;
        } else if (captionStyle.textEffect === 'Outline') {
            newPreviewStyle.WebkitTextStroke = `${captionStyle.effectIntensity / 50}px black`;
            newPreviewStyle.textStroke = `${captionStyle.effectIntensity / 50}px black`;
        } else if (captionStyle.textEffect === 'Glow') {
            newPreviewStyle.textShadow = `0 0 ${captionStyle.effectIntensity / 5}px rgba(255,255,255,0.8)`;
        }

        setPreviewStyle(newPreviewStyle);
    }, [captionStyle]);

    const wrapText = (text) => {
        const words = text.split(/(\s+)/);
        const lines = [];
        let currentLine = [];
        let wordCount = 0;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.trim().length > 0) {
                wordCount++;
            }
            currentLine.push(word);

            if (wordCount === captionStyle.wordsPerLine || i === words.length - 1) {
                lines.push(currentLine.join(''));
                currentLine = [];
                wordCount = 0;
            }
        }

        return lines;
    };

    const getStrokeStyle = (width, color) => {
        const shadow = [];
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < 360; j += 10) {
                const angle = j * Math.PI / 180;
                const x = Math.round(i * Math.cos(angle) * 100) / 100;
                const y = Math.round(i * Math.sin(angle) * 100) / 100;
                shadow.push(`${x}px ${y}px 0 ${color}`);
            }
        }
        return shadow.join(', ');
    };

    const getHighlightedWord = (words) => {
        if (!highlightEnabled) return null;

        switch (highlightLogic) {
            case 'First':
                return words[0];
            case 'Middle':
                return words[Math.floor(words.length / 2)];
            case 'Last':
                return words[words.length - 1];
            case 'Random':
            default:
                return words[Math.floor(Math.random() * words.length)];
        }
    };

    const renderPreview = () => {
        const lines = wrapText(sampleText);
        const allWords = sampleText.split(/\s+/);
        const highlightedWord = getHighlightedWord(allWords);

        const getTextEffect = (isHighlighted) => {
            if (isHighlighted) return {}; // No additional effects for highlighted words

            switch (captionStyle.textEffect) {
                case 'Shadow':
                    return {
                        textShadow: `2px 2px ${captionStyle.effectIntensity / 10}px rgba(0,0,0,0.5)`
                    };
                case 'Outline':
                    return {
                        WebkitTextStroke: `${captionStyle.effectIntensity / 50}px ${captionStyle.textStrokeColor}`,
                        textStroke: `${captionStyle.effectIntensity / 50}px ${captionStyle.textStrokeColor}`
                    };
                case 'Glow':
                    return {
                        textShadow: `0 0 ${captionStyle.effectIntensity / 10}px ${captionStyle.textColor}`
                    };
                default:
                    return {};
            }
        };

        return (
            <motion.div style={{
                ...previewStyle,
                letterSpacing: captionStyle.textWidth === 'wide' ? '0.05em' : captionStyle.textWidth === 'narrow' ? '-0.05em' : 'normal',
            }}>
                {lines.map((line, lineIndex) => (
                    <motion.div
                        key={lineIndex}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isPlaying ? 1 : 1 }}
                        transition={{
                            duration: 0.5,
                            delay: captionStyle.renderingEffect === 'One line at a time'
                                ? (isPlaying ? lineIndex * 0.5 : 0)
                                : 0
                        }}
                    >
                        {line.split(/(\s+)/).map((segment, segmentIndex) => {
                            const isWord = segment.trim().length > 0;
                            const isHighlighted = isWord && segment.trim() === highlightedWord;
                            const segmentStyle = isHighlighted && highlightEnabled
                                ? {
                                    color: captionStyle.highlightColor,
                                    textShadow: getStrokeStyle(captionStyle.highlightStrokeWidth, captionStyle.highlightStrokeColor),
                                    ...(highlightBackgroundEnabled && {
                                        backgroundColor: captionStyle.highlightBackgroundColor,
                                        padding: '0 4px',
                                        borderRadius: `${captionStyle.highlightCornerRadius}px`,
                                    }),
                                }
                                : {
                                    color: captionStyle.textColor,
                                    textShadow: getStrokeStyle(captionStyle.textStrokeWidth, captionStyle.textStrokeColor),
                                    ...getTextEffect(false),
                                };

                            const wordIndex = line.split(/\s+/).findIndex((word, idx) =>
                                idx === segmentIndex / 2 && word === segment.trim()
                            );
                            const totalWords = lines.reduce((sum, l) => sum + l.split(/\s+/).length, 0);
                            const wordPosition = lines.slice(0, lineIndex).reduce((sum, l) => sum + l.split(/\s+/).length, 0) + wordIndex;

                            return (
                                <motion.span
                                    key={`${lineIndex}-${segmentIndex}`}
                                    style={{
                                        ...segmentStyle,
                                        display: 'inline-block',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                    initial={{ opacity: 1 }}
                                    animate={{
                                        opacity: isPlaying
                                            ? (captionStyle.renderingEffect === 'All at once' ? 1
                                                : captionStyle.renderingEffect === 'One word at a time'
                                                    ? (animationProgress > wordPosition / totalWords ? 1 : 0)
                                                    : captionStyle.renderingEffect === 'One line at a time'
                                                        ? (animationProgress > lineIndex / lines.length ? 1 : 0)
                                                        : 1)
                                            : 1
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {segment}
                                </motion.span>
                            );
                        })}
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    const updateCaptionStyle = (key, value) => {
        setCaptionStyle(prevStyle => ({ ...prevStyle, [key]: value }));
        setLastChangedProperty(key);
    };

    const addEmoji = (emoji) => {
        setSampleText(prevText => prevText + emoji.native);
    };

    const addCustomSymbol = (symbol) => {
        setSampleText(prevText => prevText + symbol);
    };

    const saveCurrentStyle = () => {
        setSavedStyles(prevStyles => [...prevStyles, { ...captionStyle, name: `Style ${prevStyles.length + 1}` }]);
    };

    const loadSavedStyle = (style) => {
        setCaptionStyle(style);
    };

    const adaptStyleToContentType = (type) => {
        setContentType(type);
        if (type === 'Educational') {
            updateCaptionStyle('fontFamily', 'Arial');
            updateCaptionStyle('fontSize', 20);
            updateCaptionStyle('textColor', '#000000');
            updateCaptionStyle('backgroundColor', 'Solid Color');
            updateCaptionStyle('backgroundGradient', ['#FFFFFF', '#FFFFFF']);
        } else if (type === 'Energetic') {
            updateCaptionStyle('fontFamily', 'Impact');
            updateCaptionStyle('fontSize', 28);
            updateCaptionStyle('textColor', '#FF0000');
            updateCaptionStyle('backgroundColor', 'Gradient');
            updateCaptionStyle('backgroundGradient', ['#FFD700', '#FFA500']);
        } else if (type === 'Professional') {
            updateCaptionStyle('fontFamily', 'Times New Roman');
            updateCaptionStyle('fontSize', 22);
            updateCaptionStyle('textColor', '#333333');
            updateCaptionStyle('backgroundColor', 'Solid Color');
            updateCaptionStyle('backgroundGradient', ['#F0F0F0', '#F0F0F0']);
        }
    };

    const playAnimation = () => {
        setIsPlaying(true);
        setAnimationProgress(0);

        if (captionStyle.renderingEffect === 'One word at a time') {
            const words = sampleText.split(/\s+/);
            const animationDuration = words.length * 200; // 200ms per word
            const interval = setInterval(() => {
                setAnimationProgress(prev => {
                    if (prev >= 1) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        return 1;
                    }
                    return prev + 1 / words.length;
                });
            }, 200);
        } else if (captionStyle.renderingEffect === 'One line at a time') {
            const lines = wrapText(sampleText);
            const animationDuration = lines.length * 500; // 500ms per line
            const interval = setInterval(() => {
                setAnimationProgress(prev => {
                    if (prev >= 1) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        return 1;
                    }
                    return prev + 1 / lines.length;
                });
            }, 500);
        } else {
            // All at once
            setTimeout(() => {
                setAnimationProgress(1);
                setIsPlaying(false);
            }, 500);
        }
    };


    const generateJSONOutput = () => {
        return JSON.stringify({
            fontFamily: captionStyle.fontFamily,
            fontSize: captionStyle.fontSize,
            fontWeight: captionStyle.fontWeight,
            fontStyle: captionStyle.fontStyle,
            textCase: captionStyle.textCase,
            textColor: captionStyle.textColor,
            highlightColor: captionStyle.highlightColor,
            highlightStrokeColor: captionStyle.highlightStrokeColor,
            highlightBackgroundColor: highlightBackgroundEnabled ? captionStyle.highlightBackgroundColor : 'transparent',
            textAlignment: captionStyle.textAlignment,
            textEffect: captionStyle.textEffect,
            backgroundColor: captionStyle.backgroundColor,
            backgroundGradient: captionStyle.backgroundGradient,
            backgroundBlur: captionStyle.backgroundBlur,
            wordsPerLine: captionStyle.wordsPerLine,
            lineHeight: captionStyle.lineHeight,
            effectIntensity: captionStyle.effectIntensity,
            renderingEffect: captionStyle.renderingEffect,
            textStrokeWidth: captionStyle.textStrokeWidth,
            textStrokeColor: captionStyle.textStrokeColor,
            highlightStrokeWidth: captionStyle.highlightStrokeWidth,
            highlightStrokeColor: captionStyle.highlightStrokeColor,
            textWidth: captionStyle.textWidth,
            highlightCornerRadius: captionStyle.highlightCornerRadius,
            highlightBackgroundEnabled: highlightBackgroundEnabled,
            highlightLogic: highlightLogic,
            highlightEnabled: highlightEnabled,
        }, null, 2);
    };

    // Update the caption input to reflect words per line
    const formattedCaptionInput = () => {
        const lines = wrapText(sampleText);
        return lines.join('\n');
    };

    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
            <Flex direction={["column", "column", "row"]} maxW="1400px" mx="auto" p={5} gap={6}>
                <Box flex={1} overflowY="auto" maxH={["auto", "auto", "calc(100vh - 40px)"]}>
                    <Text fontSize="2xl" fontWeight="bold" mb={5}>Caption Style Generator</Text>
                    <Accordion allowMultiple defaultIndex={[0]} allowToggle>
                        <AccordionItem>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="medium">Text Styling</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                                    <Select size="sm" value={captionStyle.fontFamily} onChange={(e) => updateCaptionStyle('fontFamily', e.target.value)}>
                                        {FONT_FAMILIES.map(font => (
                                            <option key={font.name} value={`${font.name}, ${font.fallback}`}>
                                                {font.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <NumberInput size="sm" value={captionStyle.fontSize} min={12} max={72} onChange={(v) => updateCaptionStyle('fontSize', parseInt(v))}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <Select size="sm" value={captionStyle.fontWeight} onChange={(e) => updateCaptionStyle('fontWeight', e.target.value)}>
                                        {FONT_WEIGHTS.map(weight => <option key={weight} value={weight}>{weight}</option>)}
                                    </Select>
                                    <Select size="sm" value={captionStyle.fontStyle} onChange={(e) => updateCaptionStyle('fontStyle', e.target.value)}>
                                        {FONT_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                                    </Select>
                                    <Select size="sm" value={captionStyle.textCase} onChange={(e) => updateCaptionStyle('textCase', e.target.value)}>
                                        {TEXT_CASES.map(textCase => <option key={textCase} value={textCase}>{textCase}</option>)}
                                    </Select>
                                    <Select size="sm" value={captionStyle.textWidth} onChange={(e) => updateCaptionStyle('textWidth', e.target.value)}>
                                        <option value="normal">Normal Width</option>
                                        <option value="wide">Wide</option>
                                        <option value="narrow">Narrow</option>
                                    </Select>
                                </Grid>
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="medium">Colors and Effects</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button size="sm" bg={captionStyle.textColor} w="full">Text Color</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <SketchPicker color={captionStyle.textColor} onChange={(color) => updateCaptionStyle('textColor', color.hex)} />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button size="sm" bg={captionStyle.textStrokeColor} w="full">Stroke Color</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <SketchPicker color={captionStyle.textStrokeColor} onChange={(color) => updateCaptionStyle('textStrokeColor', color.hex)} />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <Select size="sm" value={captionStyle.textEffect} onChange={(e) => updateCaptionStyle('textEffect', e.target.value)}>
                                        {TEXT_EFFECTS.map(effect => <option key={effect} value={effect}>{effect}</option>)}
                                    </Select>
                                    <NumberInput
                                        size="sm"
                                        value={captionStyle.textStrokeWidth}
                                        min={0}
                                        max={20}
                                        step={0.5}
                                        onChange={(v) => updateCaptionStyle('textStrokeWidth', parseFloat(v))}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Grid>
                                <Slider mt={2} value={captionStyle.effectIntensity} min={0} max={100} onChange={(v) => updateCaptionStyle('effectIntensity', v)}>
                                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                                    <SliderThumb />
                                </Slider>
                                <Text fontSize="xs" textAlign="center">Effect Intensity: {captionStyle.effectIntensity}%</Text>
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="medium">Highlight Styling</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button size="sm" bg={captionStyle.highlightColor} w="full">Highlight Color</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <SketchPicker color={captionStyle.highlightColor} onChange={(color) => updateCaptionStyle('highlightColor', color.hex)} />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button size="sm" bg={captionStyle.highlightStrokeColor} w="full">Highlight Stroke</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <SketchPicker color={captionStyle.highlightStrokeColor} onChange={(color) => updateCaptionStyle('highlightStrokeColor', color.hex)} />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button size="sm" bg={captionStyle.highlightBackgroundColor} w="full">Highlight BG</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <SketchPicker color={captionStyle.highlightBackgroundColor} onChange={(color) => updateCaptionStyle('highlightBackgroundColor', color.hex)} />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                    <NumberInput size="sm" value={captionStyle.highlightCornerRadius} min={0} max={20} step={1} onChange={(v) => updateCaptionStyle('highlightCornerRadius', parseInt(v))}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <NumberInput
                                        size="sm"
                                        value={captionStyle.highlightStrokeWidth}
                                        min={0}
                                        max={20}
                                        step={0.5}
                                        onChange={(v) => updateCaptionStyle('highlightStrokeWidth', parseFloat(v))}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Grid>
                                <Flex align="center" mt={2}>
                                    <Switch
                                        size="sm"
                                        isChecked={highlightBackgroundEnabled}
                                        onChange={(e) => setHighlightBackgroundEnabled(e.target.checked)}
                                        mr={2}
                                    />
                                    <Text fontSize="sm">Enable Highlight Background</Text>
                                </Flex>
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="medium">Layout and Animation</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                                    <Select size="sm" value={captionStyle.textAlignment} onChange={(e) => updateCaptionStyle('textAlignment', e.target.value)}>
                                        {TEXT_ALIGNMENTS.map(alignment => <option key={alignment} value={alignment}>{alignment}</option>)}
                                    </Select>
                                    <NumberInput size="sm" value={captionStyle.wordsPerLine} min={1} max={10} onChange={(v) => updateCaptionStyle('wordsPerLine', parseInt(v))}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                    <Select size="sm" value={captionStyle.renderingEffect} onChange={(e) => updateCaptionStyle('renderingEffect', e.target.value)}>
                                        {RENDERING_EFFECTS.map(effect => <option key={effect} value={effect}>{effect}</option>)}
                                    </Select>
                                    <NumberInput size="sm" value={captionStyle.lineHeight} min={1} max={3} step={0.1} onChange={(v) => updateCaptionStyle('lineHeight', parseFloat(v))}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </Grid>
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="medium">Background</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Select size="sm" value={captionStyle.backgroundColor} onChange={(e) => updateCaptionStyle('backgroundColor', e.target.value)}>
                                    {BACKGROUND_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </Select>
                                {captionStyle.backgroundColor === 'Solid Color' && (
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button size="sm" bg={captionStyle.backgroundGradient[0]} w="full" mt={2}>Background Color</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <SketchPicker color={captionStyle.backgroundGradient[0]} onChange={(color) => updateCaptionStyle('backgroundGradient', [color.hex, color.hex])} />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                )}
                                {captionStyle.backgroundColor === 'Gradient' && (
                                    <Flex mt={2}>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button size="sm" bg={captionStyle.backgroundGradient[0]} w="full" mr={1}>Color 1</Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverBody>
                                                    <SketchPicker color={captionStyle.backgroundGradient[0]} onChange={(color) => updateCaptionStyle('backgroundGradient', [color.hex, captionStyle.backgroundGradient[1]])} />
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button size="sm" bg={captionStyle.backgroundGradient[1]} w="full" ml={1}>Color 2</Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <PopoverBody>
                                                    <SketchPicker color={captionStyle.backgroundGradient[1]} onChange={(color) => updateCaptionStyle('backgroundGradient', [captionStyle.backgroundGradient[0], color.hex])} />
                                                </PopoverBody>
                                            </PopoverContent>
                                        </Popover>
                                    </Flex>
                                )}
                                {captionStyle.backgroundColor === 'Blurred' && (
                                    <Slider mt={2} value={captionStyle.backgroundBlur} min={0} max={20} onChange={(v) => updateCaptionStyle('backgroundBlur', v)}>
                                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                )}
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    <Text fontWeight="medium">Highlight Options</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <VStack align="stretch" spacing={2}>
                                    <Flex justify="space-between" align="center">
                                        <Text>Enable Highlight</Text>
                                        <Switch
                                            isChecked={highlightEnabled}
                                            onChange={(e) => setHighlightEnabled(e.target.checked)}
                                        />
                                    </Flex>
                                    <Select
                                        value={highlightLogic}
                                        onChange={(e) => setHighlightLogic(e.target.value)}
                                        isDisabled={!highlightEnabled}
                                    >
                                        <option value="Random">Random Word</option>
                                        <option value="First">First Word</option>
                                        <option value="Middle">Middle Word</option>
                                        <option value="Last">Last Word</option>
                                    </Select>
                                </VStack>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>

                    <VStack mt={5} align="stretch" spacing={4}>
                        <Textarea
                            size="sm"
                            value={formattedCaptionInput()}
                            onChange={(e) => setSampleText(e.target.value.replace(/\n/g, ' '))}
                            placeholder="Enter your caption text here"
                        />
                        <Flex>
                            <Popover>
                                <PopoverTrigger>
                                    <Button colorScheme="blue" size="sm">Add Emoji</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverBody>
                                        <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                                            {EMOJIS.map((emoji, index) => (
                                                <Button key={index} onClick={() => addEmoji({ native: emoji })} size="sm">
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </Grid>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Flex>
                    </VStack>
                    <Button mt={4} colorScheme="green" onClick={saveCurrentStyle} size="sm">
                        Save Current Style
                    </Button>
                    <Select mt={2} size="sm" placeholder="Load Saved Style" onChange={(e) => loadSavedStyle(JSON.parse(e.target.value))}>
                        {savedStyles.map((style, index) => (
                            <option key={index} value={JSON.stringify(style)}>
                                {style.name}
                            </option>
                        ))}
                    </Select>
                    <Select mt={2} size="sm" placeholder="Adapt to Content Type" onChange={(e) => adaptStyleToContentType(e.target.value)}>
                        {['Educational', 'Energetic', 'Professional'].map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>
                </Box>

                <Box flex={1} position="sticky" top={5} alignSelf="flex-start">
                    <Text fontSize="xl" fontWeight="bold" mb={3}>Preview</Text>
                    <AnimatePresence>
                        <motion.div
                            key={lastChangedProperty}
                            initial={{ opacity: 0.5, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Box borderWidth={1} borderRadius="md" p={4} bg={useColorModeValue('white', 'gray.800')} minHeight="200px" boxShadow="md">
                                {renderPreview()}
                            </Box>
                        </motion.div>
                    </AnimatePresence>
                    <Button mt={4} colorScheme="green" onClick={playAnimation} isDisabled={isPlaying} size="sm">
                        {isPlaying ? "Playing..." : "Play Animation"}
                    </Button>
                    <Box mt={4}>
                        <Text fontSize="xl" fontWeight="bold" mb={3}>JSON Output</Text>
                        <Textarea
                            value={generateJSONOutput()}
                            isReadOnly
                            height="200px"
                            fontFamily="monospace"
                            bg={useColorModeValue('gray.100', 'gray.700')}
                            size="sm"
                        />
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}

export default CaptionStylesGenerator;