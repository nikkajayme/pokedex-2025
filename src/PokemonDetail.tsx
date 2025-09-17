import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FastAverageColor } from "fast-average-color";
import Layout from "./Layout";

interface PokemonData {
  name: string;
  id: number;
  sprites: {
    other: {
      ["official-artwork"]: {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

const PokemonDetail = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [colors, setColors] = useState<Record<number, string>>({});

  const handleImgLoad = (pokemon: any) => (event: any) => {
    const fac = new FastAverageColor();
    const img = event.target;

    if (!colors[pokemon.id]) {
      fac
        .getColorAsync(img)
        .then((color) => {
          setColors((prev) => ({
            ...prev,
            [pokemon.id]: color.hex,
          }));
        })
        .catch((e) => {
          console.error("Error extracting color:", e);
        });
    }
  };

  useEffect(() => {
    if (!name) return;

    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
        );
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) return <div className="text-black">Loading...</div>;
  if (error || !pokemon)
    return <div className="text-red-500">Pokémon not found!</div>;

  const bgColor = colors[pokemon.id] || "#f0f0f0";

  const formatNum = (num: number) => {
    return num.toString().padStart(3, "0");
  };

  return (
    <Layout>
      <div
        className="border-white/20 rounded-4xl border flex lg:grid lg:grid-cols-2 flex-col relative z-100 max-w-250 xl:min-w-250 lg:min-w-200 md:min-w-150 sm:min-w-100 min-w-80 h-full sm:p-10 p-6 text-white shadow-lg backdrop-blur-xl"
        style={{
          background: `linear-gradient(to bottom, #ffffff00 0%, #ffffff00 50%,${bgColor} 100%)`,
        }}
      >
        <div>
          <h2>{formatNum(pokemon.id)}</h2>
          <h1 className="text-4xl font-bold mb-4 capitalize">{pokemon.name}</h1>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            width={200}
            height={200}
            className="my-5 md:my-10 mx-auto"
            onLoad={handleImgLoad(pokemon)}
            crossOrigin="anonymous"
          />
          <div className="mb-4">
            <ul className="flex gap-4 mt-2">
              {pokemon.types.map((typeInfo) => (
                <li
                  key={typeInfo.type.name}
                  className="bg-[#b59110] rounded-4xl p-2 shadow-md"
                >
                  <img
                      src={`/types/${typeInfo.type.name.toLowerCase()}.svg`}
                      alt={typeInfo.type.name}
                      className="w-5 h-5 object-contain"
                    />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-xl font-semibold mb-2">Stats:</h2>
          <ul className="py-10 space-y-1">
            {pokemon.stats.map((stat) => (
              <li key={stat.stat.name} className="flex justify-between">
                <span className="capitalize">{stat.stat.name}</span>
                <span>{stat.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
        <button className="font-medium mx-auto col-start-1 col-end-3 text-white border border-[#f2f2f2] bg-gray-700/30 rounded-3xl px-7 py-2 shadow-lg" onClick={() => navigate(-1)}>Go Back</button>
      </div>
      
    </Layout>
  );
};

export default PokemonDetail;
