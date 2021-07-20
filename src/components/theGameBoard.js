import React from "react"
import GameGridPostions from "./gameGridPositions"
import '../App.css'; 

//this is right
function TheGameBoard ({
    player,
    switchPlayer,
    currentPlayer,
    gameStart,
    shipToPlace,
    onHover,
    isHovering,
    placeShip,
    aiIsHovering,
    aiShips,
    setText,
    aiBoard,
    setAiBoard,
    gameOver,
    gameWon

}){
    function gird (){
        let board = []
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                if(player === "Player"){
                    board.push(
                        <GameGridPostions
                            board={player}
                            coords={(j+(i*10))}
                            placeShip={placeShip}
                            switchPlayer={switchPlayer}
                            currentPlayer={currentPlayer}
                            gameStart={gameStart}
                            shipToPlace={shipToPlace}
                            key={`${j} ${i}`}
                            handleHover={onHover}
                            isHovering={isHovering}
                            gameWon={gameWon}
                            />)
                    } else if(player === "Ai"){
                        board.push(
                            <GameGridPostions
                                board={player}
                                coords={(j+(i*10))}
                                placeShip={placeShip}
                                switchPlayer={switchPlayer}
                                currentPlayer={currentPlayer}
                                gameStart={gameStart}
                                shipToPlace={shipToPlace}
                                key={`${j} ${i}`}
                                handleHover={onHover}
                                aiIsHovering={aiIsHovering}
                                aiShips={aiShips}
                                setText={setText}
                                aiBoard={aiBoard}
                                gameOver={gameOver}
                                gameWon={gameWon}
                            />)   
                        }   
                    }
                }
                return board
            }
    return(
        <div>
            <span className="board-name">{player}'s board</span>
            <div className={`game-board ${player}-board`}>{gird()}
            </div>
        </div>
    )
}
export default TheGameBoard;