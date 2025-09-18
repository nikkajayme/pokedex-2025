import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import PokemonCards from "./PokemonCards";
import clsx from "clsx";

const Pokedex = () => {
  const [allPokemonList, setAllPokemonList] = useState<any[]>([]);
  const [pokemonData, setPokemonData] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [filterMenu, setFilterMenu] = useState(false);

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

  useEffect(() => {
    const fetchVisiblePokemon = async () => {
      try {
        let filteredList = allPokemonList;

        if (selectedType) {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/type/${selectedType}`
          );
          const typePokemon = response.data.pokemon.map((p: any) => p.pokemon);

          filteredList = typePokemon.filter((pokemon: any) =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          filteredList = allPokemonList.filter((pokemon: any) =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        const start = (currentPage - 1) * itemsPerPage;
        const visible = filteredList.slice(start, start + itemsPerPage);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const filteredTypes = types.filter(
    (type) => type !== "unknown" && type !== "stellar"
  );

  console.log(pokemonData)
  return (
    <Layout>
      <div className="absolute z-40 w-full xl:min-w-250 flex lg:flex-row sm:flex-col flex-row xl:h-12 top-0 gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="px-6 py-3 w-50 sm:w-70 bg-gray-300 rounded-4xl placeholder-gray-700/50 text-gray-900 active:outline-none focus:outline-none h-12"
          name="search"
        />
        <div className="relative cursor-pointer">
          <div className="relative w-full">
            <div
              className={clsx(
                "transition-all duration-300 rounded-[50px] transform bg-[#20427A]",
                filterMenu ? "h-160 w-12 sm:h-12 sm:w-175" : "h-12 w-12",
                selectedType && !filterMenu && "w-23"
              )}
            ></div>
            {selectedType ? (
              <div
                className="absolute top-4 left-4.5 flex flex-col justify-center space-y-1 z-50"
                onClick={() => setSelectedType("")}
              >
                <span className="w-4 h-[2px] bg-white/70 block rotate-45 origin-left absolute top-0" />
                <span className="w-4 h-[2px] bg-white/70 block -rotate-45 origin-right absolute top-0 -left-1" />
              </div>
            ) : (
              <div
                className=" absolute top-4 left-4 flex flex-col justify-center space-y-1"
                onClick={() => setFilterMenu(!filterMenu)}
              >
                <span className="w-4 h-[2px] bg-white/70 block"></span>
                <span className="w-3 h-[2px] bg-white/70 block"></span>
                <span className="w-2 h-[2px] bg-white/70 block"></span>
              </div>
            )}

            {selectedType && !filterMenu && (
              <div className="bg-[#b59110] rounded-full p-2 absolute top-1.5 left-12 shadow-lg hover">
                <img
                  src={`/types/${selectedType.toLowerCase()}.svg`}
                  alt={selectedType}
                  className="w-5 h-5 object-contain"
                  onClick={() => setFilterMenu(true)}
                />
              </div>
            )}
          </div>
          {filterMenu && (
            <div
              className="absolute top-9 sm:top-0 sm:left-9 p-2 rounded 
            flex sm:flex-row flex-col space-x-1 z-50"
            >
              {filteredTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    handleTypeChange(type);
                    setFilterMenu(false);
                  }}
                  className={clsx(
                    selectedType === type ? "bg-[#b59110] shadow-md" : "",
                    "rounded-full w-8 h-8 flex items-center justify-center"
                  )}
                >
                  {
                    <img
                      src={`/types/${type.toLowerCase()}.svg`}
                      alt={type}
                      className="w-5 h-5 object-contain"
                    />
                  }
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {pokemonData.length > 1 ? <PokemonCards pokemon={pokemonData} /> : (
        <p className="text-white font-mono font-medium flex items-center justify-center align-middle justify-items-center gap-6 max-w-250 lg:py-20 sm:py-40 py-20 relative z-30 h-130">oops there are no pokemons here</p>
      )}
      <div className="z-20 flex justify-center items-center gap-4">
        <button
          className="px-6 py-2 bg-[#20427A] text-white rounded-3xl disabled:bg-[#142747] disabled:text-white/50 hover:scale-105 transform transition duration-200 disabled:scale-100"
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-lg font-medium text-white">
          Page {currentPage}
        </span>

        <button
          className="px-6 py-2 bg-[#20427A] text-white disabled:opacity-30 rounded-3xl hover:scale-105 transform transition duration-200 disabled:scale-100"
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
