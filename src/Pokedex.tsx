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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [totalCount, setTotalCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { selected, currentPokemon } = usePokemon();

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.trim() !== "") return; // prevent pagination fetch if searching

      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await axios.get(
          `/api/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`
        );

        const results = response.data.results;
        setTotalCount(response.data.count);

        const detailedResponses = await Promise.all(
          results.map((pokemon: { url: string }) => axios.get(pokemon.url))
        );

        const detailedData = detailedResponses.map((res) => res.data);
        setPokemonData(detailedData);
        setIsSearching(false);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchData();
  }, [currentPage, searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const response = await axios.get(`/api/api/v2/pokemon/${searchQuery.toLowerCase()}`);
      setPokemonData([response.data]); // wrap in array for compatibility with PokemonCards
    } catch (error) {
      console.error("Pokémon not found:", error);
      setPokemonData([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Layout>
      <PokemonHero selected={selected} currentPokemon={currentPokemon} />
      <form onSubmit={handleSearchSubmit} className="flex justify-center mt-20 mb-10">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search by name or ID"
          className="px-4 py-2 border border-gray-300 rounded w-64"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
        {isSearching && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset
          </button>
        )}
      </form>
      <PokemonCards
        pokemon={pokemonData}
      />
      {!isSearching && (
        <div className="flex justify-center items-center gap-4 py-20">
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
      )}
    </Layout>
  );
};

export default Pokedex;
