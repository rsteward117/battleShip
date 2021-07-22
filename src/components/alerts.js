import React from "react"
//this is right
const Alerts = ({turn, text}) => {
    return(
        <div className="alert-Container">
            <span className="alert" id="alert">
                {text}
            </span>
            <span className="header-turn-count">Turn: {turn}</span>
        </div>   
    )
}
export default Alerts