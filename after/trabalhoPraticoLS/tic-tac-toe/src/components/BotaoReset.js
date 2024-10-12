import React from "react";
import "./BotaoReset.css"

export const BotaoReset = ({resetBoard}) => {
    return(
        <button className="reset-btn" onClick={resetBoard}>Resetar</button>
    )
}