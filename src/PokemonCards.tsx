import { usePokemon } from "./contexts/PokemonContext";

interface PokemonItemProps {
  id: number;
  name: string;
  sprites: {
    front_default: string;
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

  const handleClick = (pokemon: any) => {
    setSelected(true);
    setCurrentPokemon(pokemon);
  };

  return (
    <ul className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {pokemon.map((poke) => (
        <button key={poke.id} onClick={() => handleClick(poke)}>
          <li>
          <div className="border p-4 rounded">
            <h2 className="text-xl font-bold">{poke.name}</h2>
            <img
              src={poke.sprites.front_default}
              alt={poke.name}
              width={100}
              height={100}
            />
            <p>
              Type:{' '}
              {poke.types.map((typeInfo) => typeInfo.type.name).join(', ')}
            </p>
            <p>ID:{' '}{poke.id}</p>
          </div>
        </li>
        </button>
      ))}
    </ul>
  );
};

export default PokemonCards;
