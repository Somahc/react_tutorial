import { useState, useEffect } from 'react';  

function Square({ value, onSquareClick, isHighlighted }) {

  return <button 
            className={isHighlighted ? "highlighted-square" : "square"}
            onClick={onSquareClick}
          >
            {value}
          </button>;
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const [winnerLine, setWinnerLine] = useState(null);

  useEffect(() => { // squaresを監視し、変更された時実行
    const winner = calculateWinner(squares);
    if (winner) {
      const lines = calculateWinnerLines(squares);
      setWinnerLine(lines);
    } else {
      setWinnerLine(null); // 勝者がいない場合はnullをセット
    }
  }, [squares]);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((square) => square !== null)){ // squaresにnullが無い(=全てのマスが埋まっている)
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice(); // squaresをコピー
    if(xIsNext){
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  function renderSquare(i) {
    const isHighlighted = winnerLine && winnerLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isHighlighted={isHighlighted}
      />
    );
  }

  const boardRows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      row.push(renderSquare(i * 3 + j));
    }
    boardRows.push(<div key={i} className="board-row">{row}</div>);
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinnerLines(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // setHistory([...history, nextSquares]);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortMode() {
    setIsAscending(!isAscending);
  }

  let sortedMoves = [...history.keys()].slice();
  if(!isAscending){
    sortedMoves = sortedMoves.reverse();
  }

  const moves = sortedMoves.map((move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol><button onClick={toggleSortMode}>Toggle Sort Mode</button></ol>
        <ol>{moves}</ol>
        <ol>You are at move # {history.length}</ol>
      </div>
    </div>
  )
}
