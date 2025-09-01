/// <reference types="vite-plugin-svgr/client" />
import Wave from './assets/wave.svg?react';
import { useRef, useState, useEffect } from 'react';
import { FastAverageColor } from 'fast-average-color';
import clsx from 'clsx';
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
        const color = await fac.getColorAsync(imgElement, {
          algorithm: 'sqrt',
          mode: 'speed',
          step: 5,
        });
        const match = color.rgb.match(/\d+/g);
        const rgbArray = match ? match.map(Number) : [0, 0, 0];
        const darkened = rgbArray.map((channel) => (channel * 70) / 100);
        const opacity = 0.7;
        const darkenedColor = `rgba(${darkened.join(', ')}, ${opacity})`;

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

  console.log('Dominant Color:', dominantColor);

  return (
    <div className="relative w-screen md:py-5 xl:py-10">
      <Wave
        style={{ color: dominantColor ?? '#ffffff' }}
        className={clsx(
          "w-screen absolute z-10 object-cover min-w-180",
          selected ? "-bottom-20" : "-bottom-10",
        )}
      />
      {selected && (
        <div className="relative z-20 grid grid-cols-2 text-white gap-6">
          <img
            ref={imgRef}
            src={currentPokemon.sprites.other['official-artwork'].front_default}
            alt={currentPokemon.name}
            width={200}
            height={200}
            className="-mt-16 sm:mt-0 lg:ml-10 justify-self-center"
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
