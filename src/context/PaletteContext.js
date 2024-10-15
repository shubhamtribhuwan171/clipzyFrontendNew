import React, { createContext, useState, useContext } from 'react';

const PaletteContext = createContext();

export const PaletteProvider = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState('light');

  return (
    <PaletteContext.Provider value={{ currentPalette, setCurrentPalette }}>
      {children}
    </PaletteContext.Provider>
  );
};

export const usePalette = () => useContext(PaletteContext);