import React from  "react"
import boom from "./images/boom.jpg"

//this is right
function GameGridPostions ({
    board,
    coords,
    placeShip,
    switchPlayer,
    currentPlayer,
    gameStart,
    handleHover,
    isHovering =[],
    aiIsHovering =[],
    aiShips,
    setText,
    aiBoard,
    setAiBoard,
    gameOver,
    gameWon
}){
    
    const alert = document.getElementById("alert")
    
    let classname = 'square';
    //this if statement checks if a ship is hovering on a cell in the grid
    if(isHovering){
        classname += isHovering.includes(coords) ? 'hover-ship' : '';
    }
    
    if(aiIsHovering){
        classname += aiIsHovering.includes(coords) ? 'hover-aim' : '';
    }
    //this function handels all the player's click foe when the player  is placeing their ships on the board if the game hasn't started, or when the player clicks clicks on the ai's board to attack
    function handlePlayerClicks(e){
        if(gameWon) return
        if(currentPlayer === "Ai") return
        if(!gameStart && board === "Player"){
            e.preventDefault()
            placeShip(coords)
        }
        if(board === "Ai"){
            e.preventDefault()
            playerShotOutcomes()
        }
    }
    
    //this function handels all the player shot outcome
    function playerShotOutcomes(){
        //if the board is the ai's board
        if(board === "Ai"){
            if(aiBoard.includes(coords)) return
            setAiBoard((currentBoard) => [currentBoard, coords])
            for(let i = 0; i < aiShips.length; i++){
                for(let j = 0; j < aiShips[i].shipcoords.length; j++){
                    //if the player clicks on the ai's ship the ai's ship take damage
                    if(aiShips[i].coords[j] === coords){
                        document.getElementById(`${board}-${coords}`).style.backgroundImage = `url(${boom})`
                        aiShips[i].shipHealth --;
                        setText(`Attacking: You've Hit! [${coords}]`)
                        alert.style.background = "green"
                        if(aiShips[i].shipHealth === 0){
                            aiShips[i].shipStatus = "sunk"
                            setText(`Attacking: You've sunk just sunk the enemy's [${aiShips[i].shipId}]!`)
                            alert.style.color = "green"
                            for(let k = 0; k < aiShips[i].shipSize; k++){
                                document.getElementById(`${board}-${aiShips[i].shipCoords[k]}`).style.backgroundColor = "red"
                            }
                        }
                        if(aiShips.every(ship => ship.shipStatus === "sunk")){
                            gameOver("Player")
                        }
                        switchPlayer()
                        return
                    }
                }
            }
            setText(`Attacking: You Miss! [${coords}]`)
            alert.style.color = "grey"
            document.getElementById(`${board}-${coords}`).style.backgroundColor = "grey"
            switchPlayer()
        }
    }
    
    //this function plays the functions that allows the user to to see what what cell thay are are currently hovering over either on their board when placing their ships, or on the ai's board when the user is launching an attack.
    function hoverPositions(){
        if(board === "Player"){
            if(!handleHover) return
            handleHover(coords)
        } else if(board === "Ai"){
            if(!handleHover) return
            handleHover(coords)
        }
    }
    return(
        <div   
            className={`grid-square ${board} ${classname}`} 
            onClick={(e) => handlePlayerClicks(e)}
            onMouseEnter={hoverPositions}
            id={`${board}-${coords}`}
        />
    )
}

export default GameGridPostions;