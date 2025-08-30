import Pokedex from './Pokedex';
import { PokemonProvider } from './contexts/PokemonContext';

function App() {

  return (
    <PokemonProvider>
      <Pokedex />
    </PokemonProvider>
  )
}

export default App
