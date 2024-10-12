import React from 'react';
import { Caixa } from './Caixa';
import './Tabuleiro.css';

export const Tabuleiro = ({ tabuleiro, onClick, winnerSymbol, disabled }) => {
  return (
    <div className={`tabuleiro ${winnerSymbol ? winnerSymbol.toLowerCase() : ''}`}>
      {tabuleiro.map((value, idx) => {
        return (
          <Caixa
            key={idx}
            value={value}
            onClick={() => !disabled && value === null && onClick(idx)} // Desabilita o clique se o tabuleiro já foi vencido
          />
        );
      })}
    </div>
  );
};