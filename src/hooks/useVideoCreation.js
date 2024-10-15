import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useVideoCreation = (onVideoGenerated, onVideoCreated) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedBackground, setSelectedBackground] = useState('');
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [selectedCaptionTemplate, setSelectedCaptionTemplate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationComplete, setGenerationComplete] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        topic: '',
        customTopic: '',
        keywords: '',
        imageStyle: '',
    });

    const handleNext = useCallback(() => {
        setActiveStep((prevStep) => prevStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevStep) => prevStep - 1);
    }, []);

    const handleSubmit = useCallback(async () => {
        setIsGenerating(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No auth token found');
            }

            const payload = {
                keyword: formData.keywords, // Use the keywords input from TopicStep
                category: formData.topic === 'Custom' ? 'custom' : formData.topic.toLowerCase(),
                style: formData.imageStyle,
                minScenes: 5,
                maxScenes: 5,
                fps: 30,
                voiceId: selectedVoice ? selectedVoice.voice_id : null, // Use the selected voice ID
                captionStyle: {
                    fontFamily: "MONTSERRAT, sans-serif",
                    fontSize: 24,
                    fontWeight: "normal",
                    fontStyle: "normal",
                    textCase: "Sentence Case",
                    textColor: "#FFFFFF",
                    highlightColor: "#FFFF00",
                    highlightStrokeColor: "#000000",
                    highlightBackgroundColor: "#00000050",
                    textAlignment: "center",
                    textEffect: "None",
                    backgroundColor: "transparent",
                    backgroundGradient: ["#000000", "#FFFFFF"],
                    backgroundBlur: 0,
                    emphasisTechnique: "Bold",
                    wordsPerLine: 5,
                    lineHeight: 1.5,
                    effectIntensity: 50,
                    textStrokeWidth: 0,
                    textStrokeColor: "#000000",
                    highlightStrokeWidth: 0,
                    highlightCornerRadius: 4,
                    renderingEffect: "All at once"
                }
            };

            const response = await axios.post(
                'https://api.clipzy.ai/ai/generateInPartStream',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setIsGenerating(false);
            setGenerationComplete(true);
            onVideoGenerated(response.data.videoId);
            if (onVideoCreated) {
                onVideoCreated();
            }
        } catch (error) {
            console.error('Error generating video:', error);
            setIsGenerating(false);
            setError(error.message || 'An error occurred while generating the video');
        }
    }, [formData, selectedVoice, onVideoGenerated, onVideoCreated]);

    const getSteps = useCallback(() => {
        const baseSteps = [
            { title: 'Topic', description: 'Choose your video topic' },
            { title: 'Background', description: 'Select background type' },
        ];

        if (selectedBackground === 'ai') {
            return [
                ...baseSteps,
                { title: 'Visual Style', description: 'Choose visual style for AI-generated background' },
                { title: 'Voice', description: 'Select voice for narration' },
                { title: 'Caption', description: 'Choose caption style' },
            ];
        } else {
            return [
                ...baseSteps,
                { title: 'Voice', description: 'Select voice for narration' },
                { title: 'Caption', description: 'Choose caption style' },
            ];
        }
    }, [selectedBackground]);

    const resetForm = useCallback(() => {
        setActiveStep(0);
        setSelectedBackground('');
        setSelectedVoice(null);
        setSelectedCaptionTemplate('');
        setIsGenerating(false);
        setGenerationComplete(false);
        setError(null);
        setFormData({
            topic: '',
            customTopic: '',
            keywords: '',
            imageStyle: '',
        });
    }, []);

    useEffect(() => {
        // Reset form when component unmounts
        return () => resetForm();
    }, [resetForm]);

    return {
        activeStep,
        selectedBackground,
        selectedVoice,
        selectedCaptionTemplate,
        isGenerating,
        generationComplete,
        error,
        formData,
        setFormData,
        handleNext,
        handleBack,
        handleSubmit,
        getSteps,
        setSelectedBackground,
        setSelectedVoice,
        setSelectedCaptionTemplate,
        resetForm,
    };
};
