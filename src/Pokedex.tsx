import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import PokemonHero from "./PokemonHero";
import PokemonCards from "./PokemonCards";
import { usePokemon } from "./contexts/PokemonContext";

// selected boolean - done
// currentpokemon - done
// pagination - done
// search bar
// type dropdown
// card randomizer per day
// account

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState<any[]>([]);
  // const [selected, setSelected] = useState<boolean>(false);
  // const [currentPokemon, setCurrentPokemon] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Adjust as needed
  const [totalCount, setTotalCount] = useState(0);
  const { selected, currentPokemon } = usePokemon();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await axios.get(
          `/api/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`
        );
        const results = response.data.results;
        setTotalCount(response.data.count); // Total Pokémon in API

        const detailedPromises = results.map((pokemon: { url: string }) =>
          axios.get(pokemon.url)
        );
        const detailedResponses = await Promise.all(detailedPromises);
        const detailedData = detailedResponses.map(
          (res: { data: any }) => res.data
        );

        setPokemonData(detailedData);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  return (
    <Layout>
      <PokemonHero selected={selected} currentPokemon={currentPokemon} />
      <PokemonCards
        pokemon={pokemonData}
      />
      <div className="flex justify-center items-center gap-4 py-10">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-lg font-medium">Page {currentPage}</span>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage * itemsPerPage >= totalCount}
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default Pokedex;
