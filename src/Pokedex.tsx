import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";

const Pokedex = () => {
  const [pokemonData, setPokemonData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=51"
        );
        const results = response.data.results;

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
  }, []);

  console.log(pokemonData);

  return (
    <Layout>
    <div>
      pokemon color
    </div>
    <div>
      <form action="submit">search</form>
      <p>type</p>
    </div>
    <ul className="w-full lg:w-9/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pokemonData.map((pokemon) => (
        <li className="border" key={pokemon.id}>
          <h2>{pokemon.name}</h2>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={100}
            height={100}
          />
          <p>Type: {pokemon.types.map((typeInfo: any) => typeInfo.type.name).join(", ")}</p>
          <p>Height: {pokemon.height}</p>
          <p>Weight: {pokemon.weight}</p>
        </li>
      ))}
    </ul>
    <div>page</div>
    </Layout>
  );
};

export default Pokedex;
