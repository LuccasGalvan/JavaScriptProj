import React from 'react';
import { Tabuleiro } from './Tabuleiro';

export const JogoVelha = ({ tabuleiro, onClick, fimDeJogo, winnerSymbol, jogoIniciado }) => {
  const isTabuleiroVencedor = winnerSymbol !== null;

  return (
    <div className="jogo-velha">
      <Tabuleiro
        tabuleiro={tabuleiro}
        onClick={onClick}
        winnerSymbol={winnerSymbol}
        disabled={isTabuleiroVencedor || !jogoIniciado}
      />
    </div>
  );
};