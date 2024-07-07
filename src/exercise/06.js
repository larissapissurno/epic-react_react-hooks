// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import {PokemonForm} from '../pokemon'

function PokemonInfo({pokemonName, onError}) {
  const [pokemon, setPokemon] = React.useState(null)

  React.useEffect(() => {
    if (!pokemonName) return;

    setPokemon(null);

    fetchPokemon(pokemonName)
      .then(setPokemon)
      .catch(onError)
  }, [pokemonName])

  if (!pokemonName) return 'Submit a pokemon';

  if (!pokemon) return <PokemonInfoFallback name={pokemonName} />

  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [error, setError] = React.useState(null)

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} onError={setError}/>
      </div>
      <br/>
      {error && (
        <div role="alert">
          There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )}
    </div>
  )
}

export default App
