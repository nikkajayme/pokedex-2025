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
  const [allPokemonList, setAllPokemonList] = useState<any[]>([]);
  const [pokemonData, setPokemonData] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const { selected, currentPokemon } = usePokemon();

  // 🧠 Fetch full list of Pokémon (names + URLs)
  useEffect(() => {
    const fetchAllPokemonList = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
        );
        setAllPokemonList(response.data.results);
      } catch (error) {
        console.error("Failed to load Pokémon list:", error);
      }
    };

    fetchAllPokemonList();
  }, []);

  // 🧠 Fetch all available Pokémon types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/type");
        const typeNames = response.data.results.map((type: any) => type.name);
        setTypes(typeNames);
      } catch (error) {
        console.error("Failed to load types:", error);
      }
    };

    fetchTypes();
  }, []);

  // 🧠 Fetch Pokémon details based on search/type/page
  useEffect(() => {
    const fetchVisiblePokemon = async () => {
      try {
        let filteredList = allPokemonList;

        // 🐉 If type is selected, fetch Pokémon by type from API
        if (selectedType) {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/type/${selectedType}`
          );
          const typePokemon = response.data.pokemon.map((p: any) => p.pokemon);

          // Optional: filter by name too
          filteredList = typePokemon.filter((pokemon: any) =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          // No type selected: filter the full list by name
          filteredList = allPokemonList.filter((pokemon: any) =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Paginate filtered list
        const start = (currentPage - 1) * itemsPerPage;
        const visible = filteredList.slice(start, start + itemsPerPage);

        // Fetch details
        const details = await Promise.all(
          visible.map((pokemon: any) => axios.get(pokemon.url))
        );

        setPokemonData(details.map((res) => res.data));
      } catch (error) {
        console.error("Failed to load Pokémon details:", error);
      }
    };

    if (allPokemonList.length > 0 || selectedType) {
      fetchVisiblePokemon();
    }
  }, [searchQuery, selectedType, currentPage, allPokemonList]);

  // 🧠 Total results for pagination
  const totalFiltered = (() => {
    if (selectedType) {
      return pokemonData.length < itemsPerPage
        ? pokemonData.length
        : currentPage * itemsPerPage + 1;
    }

    return allPokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).length;
  })();

  // 🔁 Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <PokemonHero selected={selected} currentPokemon={currentPokemon} />

      {/* 🔍 Search + Filter Form */}
      <div className="flex justify-center mt-20 mb-10 gap-4 flex-wrap">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="px-4 py-2 border border-gray-300 rounded w-64"
        />

        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* 🧩 Pokémon Cards */}
      <PokemonCards pokemon={pokemonData} />

      {/* 📄 Pagination */}
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
          disabled={currentPage * itemsPerPage >= totalFiltered}
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default Pokedex;
