import React from "react";
import "./Placar.css"

export const Placar = ({scores, xJogando}) => {
    const {xScore, oScore} = scores;
    return(
        <div className="placar">
            <span className={`score x-score ${!xJogando && "inativo"}`}>X - {xScore}</span>
            <span className={`score o-score ${xJogando && "inativo"}`}>O - {oScore}</span>
        </div>
    )
}