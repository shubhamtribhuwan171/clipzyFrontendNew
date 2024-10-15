import React from 'react';
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';

const Timeline = ({ duration, currentTime, onChange }) => {
    return (
        <Box>
            <Slider
                aria-label="timeline-slider"
                value={currentTime}
                min={0}
                max={duration}
                onChange={onChange}
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Box>
    );
};

export default Timeline;