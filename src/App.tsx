import Pokedex from "./Pokedex";
import { PokemonProvider } from "./contexts/PokemonContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PokemonDetail from "./PokemonDetail";

function App() {
  return (
    <PokemonProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
        </Routes>
      </Router>
    </PokemonProvider>
  );
}

export default App;
