import React from "react";
import "./Caixa.css"

export const Caixa = ({value, onClick}) => {
    const style = value === "X" ? "box x" : "box o"
    console.log(style);
    return(
        <button className={style} onClick={onClick}>{value}</button>
    )
}