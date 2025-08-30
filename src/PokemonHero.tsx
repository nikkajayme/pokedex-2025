/// <reference types="vite-plugin-svgr/client" />
import Wave from './assets/wave.svg?react';
import { useRef, useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
// import wave from "./assets/wave.svg"

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      ['official-artwork']: {
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

interface PokemonHeroProps {
  selected: boolean;
  currentPokemon: Pokemon;
}

const PokemonHero: React.FC<PokemonHeroProps> = ({
  selected,
  currentPokemon,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const fac = new FastAverageColor();

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const handleLoad = async () => {
      try {
        const color = await fac.getColorAsync(imgElement, {algorithm: 'dominant'});
        const match = color.rgb.match(/\d+/g);
        const rgbArray = match ? match.map(Number) : [0, 0, 0];
        const darkened = rgbArray.map((channel) => (channel * 35));
        const darkenedColor = `rgb(${darkened.join(', ')})`;
        // const darkenedColor = color.rgb

        setDominantColor(darkenedColor);
      } catch (error) {
        console.error('Color extraction failed', error);
        setDominantColor(null);
      }
    };

    if (imgElement.complete && imgElement.naturalHeight !== 0) {
      handleLoad();
    } else {
      imgElement.addEventListener('load', handleLoad);
      return () => {
        imgElement.removeEventListener('load', handleLoad);
      };
    }
  }, [currentPokemon, fac]);

  return (
    <div className="relative w-screen h-150 sm:h-96">
      <Wave
        style={{ color: dominantColor ?? 'blue' }}
        className="w-screen min-h-150 sm:min-h-96 object-cover"
      />
      {selected && (
        <div className="mx-5 sm:mx-20 lg:mx-40 grid sm:grid-cols-2 h-full items-center relative z-10 text-white justify-center my-5">
          <img
            ref={imgRef}
            src={currentPokemon.sprites.other['official-artwork'].front_default}
            alt={currentPokemon.name}
            width={200}
            height={200}
            className="-mt-16 sm:mt-0 lg:ml-10"
            crossOrigin="anonymous"
          />
          <div className="text-xl leading-9 -mt-30 sm:mt-0">
            <h2 className="text-5xl lg:text-6xl font-bold mb-5">
              {currentPokemon.name}
            </h2>
            <p>
              Type:{' '}
              {currentPokemon.types
                .map((typeInfo: any) => typeInfo.type.name)
                .join(', ')}
            </p>
            <p>Height: {currentPokemon.height}</p>
            <p>Weight: {currentPokemon.weight}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonHero;
