import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import PokemonHero from "./PokemonHero";

// selected boolean - done
// currentpokemon - done
// pagination - done
// search bar
// type dropdown
// card randomizer per day
// account

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState<any[]>([]);
  const [selected, setSelected] = useState<boolean>(false);
  const [currentPokemon, setCurrentPokemon] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Adjust as needed
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`
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

  const handleClick = (pokemon: any) => {
    setSelected(true);
    setCurrentPokemon(pokemon);
  };

  // console.log(pokemonData);
  console.log(currentPokemon);

  return (
    <Layout>
      <PokemonHero selected={selected} currentPokemon={currentPokemon} />
      <ul className="pt-20 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pokemonData.map((pokemon) => (
          <button onClick={() => handleClick(pokemon)} key={pokemon.id}>
            <li className="border" key={pokemon.id}>
              <h2>{pokemon.name}</h2>
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                width={100}
                height={100}
              />
              <p>
                Type:{" "}
                {pokemon.types
                  .map((typeInfo: any) => typeInfo.type.name)
                  .join(", ")}
              </p>
              <p>Height: {pokemon.height}</p>
              <p>Weight: {pokemon.weight}</p>
            </li>
          </button>
        ))}
      </ul>
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
