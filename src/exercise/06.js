// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import {PokemonForm} from '../pokemon'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: null, error: null}
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, error}
  }

  componentDidCatch(error, info) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          There was an error: <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({pokemon: null, status: 'idle', error: null})

  React.useEffect(() => {
    if (!pokemonName) return;

    setState({pokemon: null, status: 'pending', error: null});

    fetchPokemon(pokemonName)
      .then((data) => {
        setState({pokemon: data, status: 'resolved', error: null});   
      })
      .catch(error => {
        setState({pokemon: null, status: 'rejected', error});
      })
      
  }, [pokemonName])

  switch (state.status) {
    case 'idle':
      return 'Submit a pokemon';
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />;
    case 'rejected':
      throw new Error(state.error.message)
    default:
      throw new Error('This should be impossible');
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName}/>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
