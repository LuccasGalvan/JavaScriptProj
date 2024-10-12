import React, { useState } from "react";
import "./App.css";

import { Placar } from "./components/Placar";
import { BotaoReset } from "./components/BotaoReset";
import { JogoVelha } from "./components/JogoVelha";

function App() {
  const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const initialTabuleiros = Array(9).fill(Array(9).fill(null));
  const [tabuleiro, setTabuleiro] = useState(initialTabuleiros);
  const [xJogando, setXJogando] = useState(null);
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [fimDeJogo, setFimDeJogo] = useState(false);
  const [tabuleirosVencedores, setTabuleirosVencedores] = useState(
    Array(9).fill(null)
  );
  const [vencedor, setVencedor] = useState(null);
  const [nomeJogadorX, setNomeJogadorX] = useState("");
  const [nomeJogadorO, setNomeJogadorO] = useState("");
  const [jogoIniciado, setJogoIniciado] = useState(false);
  const [usarTimer, setUsarTimer] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(7 * 60);

  const handleBoxClick = (tabuleiroIdx, boxIdx) => {
    if (fimDeJogo || tabuleiro[tabuleiroIdx][boxIdx] != null) {
      return;
    }

    const novoTabuleiro = tabuleiro.map((tabuleiro, idx) => {
      if (idx === tabuleiroIdx) {
        return tabuleiro.map((value, idx) => {
          if (idx === boxIdx) {
            return xJogando ? "X" : "O";
          } else {
            return value;
          }
        });
      } else {
        return tabuleiro;
      }
    });

    const winner = checkWinner(novoTabuleiro[tabuleiroIdx], tabuleiroIdx);

    let updatedTabuleirosVencedores = [...tabuleirosVencedores];

    if (winner) {
      updatedTabuleirosVencedores[tabuleiroIdx] = winner;
      setTabuleirosVencedores(updatedTabuleirosVencedores);

      const updatedScores = { ...scores };
      updatedScores[winner.toLowerCase() + "Score"] += 1;
      setScores(updatedScores);

      if (checkThreeInARow(updatedTabuleirosVencedores, winner)) {
        setFimDeJogo(true);
        setVencedor(winner);
      }
    } else if (checkTie(updatedTabuleirosVencedores)) {
      const winnerByScore = getWinnerByScore();
      if (winnerByScore) {
        setFimDeJogo(true);
        setVencedor(winnerByScore);
      } else {
        setFimDeJogo(true);
        setVencedor("Empate");
      }
    }

    setTabuleiro(novoTabuleiro);
    setXJogando(!xJogando);
  };

  const handleNomeChange = (jogador, event) => {
    const nome = event.target.value;
    if (jogador === "X") {
      setNomeJogadorX(nome);
    } else if (jogador === "O") {
      setNomeJogadorO(nome);
    }
  };

  const iniciarJogo = () => {
    if (!nomeJogadorX || !nomeJogadorO) {
      alert("Por favor, insira os nomes dos jogadores primeiro.");
      return;
    }
    setJogoIniciado(true);
    setXJogando(Math.random() < 0.5);
    setTempoRestante(7 * 60);
    if (usarTimer) {
      const intervalId = setInterval(() => {
        setTempoRestante((prevTempo) => prevTempo - 1);
      }, 1000);
    
      setTimeout(() => {
        clearInterval(intervalId);
        const winnerByScore = getWinnerByScore();
        if (winnerByScore) {
          setFimDeJogo(true);
          setVencedor(winnerByScore);
        } else {
          setFimDeJogo(true);
          setVencedor("Empate");
        }
      }, 7 * 60 * 1000);
    }
  };

  const formatarTempo = () => {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const checkWinner = (tabuleiro) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x, y, z] = WIN_CONDITIONS[i];

      if (
        tabuleiro[x] &&
        tabuleiro[x] === tabuleiro[y] &&
        tabuleiro[y] === tabuleiro[z]
      ) {
        return tabuleiro[x];
      }
    }
    return null;
  };

  const checkThreeInARow = (tabuleirosVencedores, player) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [x, y, z] = WIN_CONDITIONS[i];

      if (
        tabuleirosVencedores[x] === player &&
        tabuleirosVencedores[y] === player &&
        tabuleirosVencedores[z] === player
      ) {
        return true;
      }
    }
    return false;
  };

  const checkTie = (tabuleirosVencedores) => {
    return !tabuleirosVencedores.some((tabuleiro) => tabuleiro === null);
  };

  const getWinnerByScore = () => {
    const { xScore, oScore } = scores;
    const xTabuleirosVencidos = tabuleirosVencedores.filter(
      (vencedor) => vencedor === "X"
    ).length;
    const oTabuleirosVencidos = tabuleirosVencedores.filter(
      (vencedor) => vencedor === "O"
    ).length;

    if (xScore + xTabuleirosVencidos > oScore + oTabuleirosVencidos) {
      return "X";
    } else if (oScore + oTabuleirosVencidos > xScore + xTabuleirosVencidos) {
      return "O";
    } else {
      return "Empate";
    }
  };

  const resetBoard = () => {
    setTabuleiro(initialTabuleiros);
    setXJogando(null);
    setScores({ xScore: 0, oScore: 0 });
    setFimDeJogo(false);
    setTabuleirosVencedores(Array(9).fill(null));
    setVencedor(null);
    setNomeJogadorX("");
    setNomeJogadorO("");
    setJogoIniciado(false);

    if (usarTimer) {
      clearTimeout();
      setTempoRestante(7*60);
    }
  };

  return (
    <div className="App">
      <Placar scores={scores} xJogando={xJogando} />
      <div className="tempo-restante">{formatarTempo()}</div>
      <div className="nomes-jogadores">
        <label>
          Jogador X:
          <input
            type="text"
            value={nomeJogadorX}
            onChange={(e) => handleNomeChange("X", e)}
          />
        </label>
        <label>
          Jogador O:
          <input
            type="text"
            value={nomeJogadorO}
            onChange={(e) => handleNomeChange("O", e)}
          />
        </label>
      </div>
      <div className="checkbox-timer">
        <label>
          Usar Timer:
          <input
            type="checkbox"
            checked={usarTimer}
            onChange={() => setUsarTimer(!usarTimer)}
          />
        </label>
      </div>
      <div className="btn-div">
        <button
          className="button"
          onClick={iniciarJogo}
          disabled={jogoIniciado}
        >
          Play
        </button>
      </div>
      {fimDeJogo && (
        <div className="mensagem-vitoria">
          {vencedor === "Empate"
            ? "O jogo terminou em empate!"
            : `${
                vencedor === "X" ? nomeJogadorX : nomeJogadorO
              } venceu o ultimate tic-tac-toe!`}
        </div>
      )}
      <div className="tabuleiros-grid">
        {tabuleiro.map((tabuleiro, idx) => {
          return (
            <JogoVelha
              key={idx}
              tabuleiro={tabuleiro}
              onClick={(boxIdx) => handleBoxClick(idx, boxIdx)}
              fimDeJogo={fimDeJogo}
              winnerSymbol={tabuleirosVencedores[idx]}
              jogoIniciado={jogoIniciado}
            />
          );
        })}
      </div>
      <BotaoReset resetBoard={resetBoard} />
    </div>
  );
}

export default App;