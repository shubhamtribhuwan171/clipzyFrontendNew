// LayoutEditor.js

import React from 'react';
import { Rnd } from 'react-rnd';
import { Box } from '@chakra-ui/react';

function LayoutEditor({
  elementPositions,
  setElementPositions,
  elements,
  aspectRatio,
  backgroundImage, // Added backgroundImage to props
  selectedElement,
  onSelectElement,
}) {
  const canvasWidth = aspectRatio === '16:9' ? 1280 : 720;
  const canvasHeight = aspectRatio === '16:9' ? 720 : 1280;

  return (
    <Box
      position="relative"
      width="100%"
      paddingTop={aspectRatio === '16:9' ? '56.25%' : '177.78%'}
      bg="black"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        overflow="hidden"
        bgImage={backgroundImage ? `url(${backgroundImage})` : 'none'} // Use backgroundImage prop
        bgSize="cover"
        bgPosition="center"
      >
        {elements.map((element) => (
          <Rnd
            key={element.name}
            size={{
              width: elementPositions[element.name].width,
              height: elementPositions[element.name].height,
            }}
            position={{
              x: elementPositions[element.name].x,
              y: elementPositions[element.name].y,
            }}
            onDragStop={(e, d) => {
              setElementPositions((prev) => ({
                ...prev,
                [element.name]: { ...prev[element.name], x: d.x, y: d.y },
              }));
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setElementPositions((prev) => ({
                ...prev,
                [element.name]: {
                  ...prev[element.name],
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...position,
                },
              }));
            }}
            bounds="parent"
            onClick={() => onSelectElement(element.name)}
            style={{
              border: selectedElement === element.name ? '2px solid blue' : 'none',
            }}
          >
            {element.content}
          </Rnd>
        ))}
      </Box>
    </Box>
  );
}

export default LayoutEditor;
