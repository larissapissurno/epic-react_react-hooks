// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const initialSquares = Array(9).fill(null)


function Board({onSelectSquare, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSelectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [squares, setSquares] = useLocalStorageState('squares', initialSquares);
  const [history, setHistory] = useLocalStorageState('history', [initialSquares]);
  const [currentStep, setCurrentStep] = useLocalStorageState('step', 0);

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  const moves = history.map((stepSquares, step) => {
    const isCurrentStep = step === currentStep;
    const currentFlag = isCurrentStep ? ' (current)' : '';
    return (<li key={step}>
      <button onClick={() => handleGoToStep(step)} disabled={isCurrentStep}>
        {step === 0 ? 'Go to game start' : `Go to move #${step} ${currentFlag}`}
      </button>
    </li>)
  })

  function handleGoToStep(step) {
    setCurrentStep(step);
    setSquares(history[step]);
  }

  function selectSquare(square) {
    if (!!winner || squares[square]) return;

    setSquares((prev) => {
      const newSquares = [...prev];
      newSquares[square] = nextValue;

      setHistory([...history, newSquares]);
      setCurrentStep(history.length);

      return newSquares;
    });
  }

  function restart() {
    setSquares(initialSquares);
    setHistory([initialSquares]);
  }


  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onSelectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  /**
   * get all filled squares and check if the length is even or odd
   * if even return 'X' else return 'O'
   */
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // horizontal
    [3, 4, 5], // horizontal
    [6, 7, 8], // horizontal
    [0, 3, 6], // vertical
    [1, 4, 7], // vertical
    [2, 5, 8], // vertical
    [0, 4, 8], // diagonal
    [2, 4, 6], // diagonal
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
