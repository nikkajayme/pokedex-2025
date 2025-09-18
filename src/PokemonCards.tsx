import React, { useState } from "react";
import { usePokemon } from "./contexts/PokemonContext";
import { FastAverageColor } from "fast-average-color";
import { Link } from "react-router-dom";

interface PokemonItemProps {
  id: number;
  name: string;
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
}

interface PokemonCardsProps {
  pokemon: PokemonItemProps[];
}

const PokemonCards: React.FC<PokemonCardsProps> = ({ pokemon }) => {
  const { setSelected, setCurrentPokemon } = usePokemon();

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

  const handleClick = (pokemon: any) => {
    setSelected(true);
    setCurrentPokemon(pokemon);
  };

  return (
    <ul className="text-white font-sans font-medium grid xl:grid-cols-5 sm:grid-cols-3 md:grid-cols-4 grid-cols-1 items-center justify-center align-middle justify-items-center gap-6 max-w-250 lg:py-20 sm:py-40 py-20 relative z-30">
      {pokemon.map((poke) => {
        const bgColor = colors[poke.id] || "#f0f0f0";
        const formatNum = (num: number) => {
          return num.toString().padStart(3, "0");
        };
        const style: React.CSSProperties = {
          background: `linear-gradient(to bottom, #ffffff00 0%, #ffffff00 60%,${bgColor} 100%)`,
        };
        return (
          <Link
            to={`/pokemon/${poke.name.toLowerCase()}`}
            key={poke.id}
            onClick={() => handleClick(poke)}
            className="relative z-60"
          >
            <li
              className="relative z-60 cursor-pointer hover:scale-105 transform transition duration-200 h-55 w-45 rounded-2xl flex items-center justify-center border-1 border-gray-300/50 backdrop-blur-md"
              style={style}
            >
              <div className="relative items-center text-center flex flex-col">
                <div className="flex text-sm absolute -top-10 w-full justify-between">
                  <h2>{poke.name}</h2>
                  <p className="font-light">{formatNum(poke.id)}</p>
                </div>

                <img
                  src={poke.sprites.other["official-artwork"].front_default}
                  alt={poke.name}
                  width={120}
                  height={120}
                  onLoad={handleImgLoad(poke)}
                  crossOrigin="anonymous"
                />
              </div>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default PokemonCards;
