import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface PokemonContextType {
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<boolean>>;
  currentPokemon: any;
  setCurrentPokemon: React.Dispatch<React.SetStateAction<any>>;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [currentPokemon, setCurrentPokemon] = useState<any>(null);

  return (
    <PokemonContext.Provider value={{ selected, setSelected, currentPokemon, setCurrentPokemon }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = (): PokemonContextType => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
};
