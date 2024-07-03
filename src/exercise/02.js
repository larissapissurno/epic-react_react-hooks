// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(localStorageKey, initialValue = '') {
  const [state, setState] = React.useState(() => initialNameFromLocalStorage())

  React.useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(state))
  }, [state])

  function initialNameFromLocalStorage() {
    const name = window.localStorage.getItem(localStorageKey)
    return name ? JSON.parse(name) : initialValue
  }

  return [state, setState];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
