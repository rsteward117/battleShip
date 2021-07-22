//code this code is reverse engineered from KFig21's code soultions from the odin project there are comments that explain what each function is doing i've add on to the code to allow an image to display when a ship is hit.
import './App.css';
import React, {useState, useEffect} from "react"
import playerShipData from './playersDatas/PlayerShip'
import AiShipData from './playersDatas/AIShip'
import TheGameBoard from "./components/theGameBoard"
import Alerts from './components/alerts'
import boom from "./components/images/boom.jpg"

function App() {
    const [turn, setTurn] = useState(0)
    const [currentPlayer, setCurrentPlayer] = useState("Player")
    const [boardReady, setBoardReady] = useState(false)
    const [gameWon, setGameWon] = useState(false)
    const [gameStart, setGameStart] = useState(false)
    const [ships, setShips] = useState([])
    const [shipToPlaceIndex, setShipToPlaceIndex] = useState(0)
    const [shipToPlace, setShipToPlace] = useState(playerShipData[shipToPlaceIndex])
    const [isHovering, setIsHovering] = useState([])
    const [playerBoard, setPlayerBoard] = useState([])
    const [aiReady, setAiReady] = useState(false)
    const [aiShips, SetAiShips] = useState([])
    const [aiShipToPlaceIndex, setAiShipToPlaceIndex] = useState(0)
    const [aiShipToPlace, setAiShipToPlace] = useState (AiShipData[aiShipToPlaceIndex])
    const [aiIsHovering, setAiIsHovering] = useState([]);
    const [aiBoard, setAiBoard] = useState([]);
    const [onTarget, setOnTarget] = useState(false)
    const [targetValue, setTargetValue] = useState([])
    const [text, setText] = useState(`Place your ${shipToPlace.shipId}!`);
    const [isVertical, setIsVertical] = useState(false);
    const [axis, setAxis] = useState("Vertical")
    const alert = document.getElementById("alert")
    
    //function that switch players and keep track of turns
    
    function switchPlayer () {
    setCurrentPlayer(currentPlayer === "Player" ? "Ai" : "Player");
    setTurn((previous) => previous + 1);
  }
  
    //if its the ai turn it havs  seconds to make a move
    useEffect(() => {
        if(gameWon) return
        if (currentPlayer === "Ai"){
          setTimeout(() => aiTurn(), 1000);
        }
  }, [currentPlayer])
    
    
    function aiTurn (){
        if(gameWon) return
        let attack = ""
        // checks if the ai hit any ship
        if(!onTarget){
            attack = findRandomTarget() 
        }else if(onTarget){
            //checks for a preferred target for the ai to hit next.
            let preferredTargets = getPreferredTarget()
            if(preferredTargets.length > 0){
                let preferredIndex = Math.floor(Math.random() * preferredTargets.length)
                attack = preferredTargets[preferredIndex]
                // a while loop that checks if any of the preferred targets are vaild
                while(playerBoard.includes(attack) && preferredTargets.length > 0){
                    //if the selected preffred target fails to be vaild it is removed from the array and selects another to be a preffred target
                    preferredTargets.splice(preferredIndex, 1)
                    preferredIndex = Math.floor(Math.random() * preferredTargets.length)
                    attack = preferredTargets[preferredIndex]
                    //if there are no preferred targets in the array than it will attack at random until another target gets add to the preffred target array and redo the while loop condition
                    if(preferredTargets.length === 0) attack = findRandomTarget() //note you don't have to put brackets around the execution of an if statement if it's on one line.
                }
            } else {
                //if there is no prefrred targets it will attack any cell next to the cell that was last hit
                let targets = getTargets(targetValue)
                let index = Math.floor(Math.random() * targets.length)
                attack = targets[index]
                while(playerBoard.includes(attack)){
                    index = Math.floor(Math.random() * targets.length)
                    attack = targets[index];
                }
            }
        }
        //this section returns messages for when the ai attack the player and when the player's ships are attacked or is sunked.
        setPlayerBoard((currentBoard) => [... currentBoard, attack])
        //a for loop that keeps track and loops through each ship the player has
            for(let i = 0; i < ships.length; i++){
                //another for loop that keeps track and loop over each coordinates or cell each ship is in
                for(let j = 0; j < ships[i].shipCoords.length; j++){
                    //an if statement that has conditions for each time the ai hit one of ships the player has on his/her board and returns a notifction of the results
                    if(ships[i].shipCoords[j] === attack){
                        document.getElementById(`Player-${attack}`).style.backgroundImage = `url(${boom})`
                        ships[i].shipHealth --;
                        setText(`Alert: you've been hit! at cell[${attack}]`);
                        alert.style.color = "red"
                        setTargetValue(previous => [... previous, attack])
                        setOnTarget(true)
                        if(ships[i].shipHealth === 0){
                            ships[i].shipStatus = "sunk";
                            setText(`Alert: your ${ships[i].shipId} has been sunked!`)
                            alert.style.color = "red"
                            checkIfOnTarget(ships[i])
                            for(let k = 0; k < ships[i].shipSize; k++){
                             document.getElementById(`Player-${ships[i].shipCoords[k]}`).style.backgroundColor = "darkred"
                            }
                        }
                        //if ai sinks every ship the player has on their board the game is over and the ai wins
                        if(ships.every(ship => ship.shipStatus === 'sunk')){
                            gameOver("Ai");
                        }
                        switchPlayer();
                        return
                    }
                }
            }
        //this plays when the ai miss a target
        setText(`Attacking: AI miss![${attack}]`)
        alert.style.color = "white"
        document.getElementById(`Player-${attack}`).style.backgroundColor = "lightblue"
        switchPlayer();
        return
    }
    
    
    
    //this function is checking to see if the ai is hitting all the correct ships on the player's board by compareing what targets it hit with the target value useState
    function checkIfOnTarget (ship) {
        let leftoverTargets = targetValue
        for (let i = 0; i < ship.shipCoords.length; i++){
            if(leftoverTargets.includes(ship.shipCoords[i])){
                const index = targetValue.indexOf(ship.shipCoords[i])
                leftoverTargets.splice(index, 1);
            }
        }
        setTargetValue(leftoverTargets)
        if(targetValue.length === 0){
            setOnTarget(false)
            setTargetValue([])
        }
        return
    }

    
    //function that selects a random number or cell from the player's 
    function findRandomTarget(){
        let target = Math.floor(Math.random() * 100)
        while(playerBoard.includes(target)){
            target = Math.floor(Math.random() * 100)
        }
        return target
    }
      
    
    function aiHoverEffects(coords){
        if(!aiReady) return
        const target = [coords]
        setAiIsHovering(target)
    }
    
    //this function will list any cell that next to the last cell that was marked as a successful hit so if cell 0 was a hit than any cell between 1 and 10 will be pushed in an array for the next possiable target
    function getTargets(targs){
        let targets = []
        for(let i = 0; i < targs.length; i++){
            // top left cornor = 0 
            if(targs[i] === 0){
                targets.push(1)
                targets.push(10)
            }
            //bottom right cornor = 99
            else if(targs[i] === 99){
                targets.push(89)
                targets.push(98)
            }
            // top right cornor = 9
            else if(targs[i] === 9){
                targets.push(8)
                targets.push(19)
            }
            // bottom left cornor = 90
            else if(targs[i] === 90){
                targets.push(80)
                targets.push(91)
            }
            //top row not including 0 and 9
            else if(targs[i] < 9){
                targets.push(targs[i]-1)
                targets.push(targs[i]+1)
                targets.push(targs[i]+10)
            }
            //bottom row not including 90 or 99
            else if(targs[i] > 90){
                targets.push(targs[i]-1)
                targets.push(targs[i]+1)
                targets.push(targs[i]-10)
            }
            // left side not including 0 or 90
            else if(targs % 10 === 0){
                targets.push(targs[i]+1)
                targets.push(targs[i]-10)
                targets.push(targs[i]+10)
            }
            //right side not including 9 or 99
            else if(targs[i]+1 % 10 === 0){
                targets.push(targs[i]-1)
                targets.push(targs[i]-10)
                targets.push(targs[i]+10)
            }
            // remaining cells
            else {
                targets.push(targs[i]-1)
                targets.push(targs[i]+1)
                targets.push(targs[i]-10)
                targets.push(targs[i]+10)
            }
        }
        //this get a random target that is currently inside the targets array
        if(targets.every(target => playerBoard.includes(target))){
            targets = findRandomTarget();
        }
        return targets
    }
    
    function getPreferredTarget (){
        if (targetValue.length < 2) return [];
        const preferredTargets = []
        for(let i = 0; i < targetValue.length; i++){
            for(let j = 0; j < targetValue.length; j++){
                //if 2 hits horizontally next to each other
                if(targetValue[i] === targetValue[j] + 1){
                    //check if targetValue is a right side edge case
                    if(targetValue[i] + (1 % 10) !== 0){
                        preferredTargets.push(targetValue[i] + 1)
                    }
                    //check if targetValue i a left side edge case
                    if(targetValue[j] % 10 !== 0){
                        preferredTargets.push(targetValue[j] - 1)
                    }
                }
                //if 2 hits vertically next to each other
                if(targetValue[i] === targetValue[j] + 10){
                    //check if targetValue is a bottom side edge case
                    if(targetValue[i] + 10 < 100){
                        preferredTargets.push(targetValue[i] + 10)
                    }
                    if(targetValue[j] - 10 >= 0){
                        preferredTargets.push(targetValue[j] - 10)
                    }
                }
            }
        }
        return preferredTargets
    }
    
    
    //starts the game
    function startGame (){
        if(boardReady && !gameWon){
            setGameStart(true)
        } else if(gameWon){
            restartGame();
        }
    }
    
    
    //this function shows the highlights of the ships that the player is setting on their board by checking if the ship is vertical or not, and it is also looping for for each ship based on it's size, and it is pushing the coordinates of each cell in an array to return the number of the cell that the ship is currently hovering over. 
    function hoverEffects (coords){
        if(gameStart) return;
        const ship = shipToPlace;
        const coordinates = [coords]
        const movement = isVertical ? 10 : 1
        if(isVertical){
            for(let i = 1; i < ship.shipSize; i++){
                coordinates.push(parseInt(coords) + parseInt(i * movement))
            }
        } else {
        for (let i = 1; i < ship.shipSize && (coords + i) % 10 !== 0; i++){
            coordinates.push(parseInt(coords) + parseInt(i * movement))
            }
        }
        setIsHovering(coordinates)
    }
    
    
    //this function allows the player to place each one of his/her ships on the board and returns the coordinates of each cell on the  play's board
    function placeShip (coords){
        const ship = shipToPlace
        const movement = isVertical ? 10 : 1
        const coordinates = [coords]
        for(let i = 1; i < ship.shipSize; i++){
            coordinates.push(parseInt(coords) + parseInt(i * movement))
        }
        if(validateShip(coordinates, "Player")){
            setShips((currentShips) => {
                return [... currentShips, ship]
            })
            ship.shipCoords = coordinates
            for(let i = 0; i < coordinates.length; i++){
                let coordId = coordinates[i]
                document.getElementById(`Player-${coordId}`).style.backgroundColor = "lightgreen"
            }
            setShipToPlaceIndex(prev => parseInt(prev + 1))
        } else {
            return
        } 
    }
    
    
    // this function keeps track of what cell each ship is being placed in, and which cell a ship can't be placed in
    function validateShip (coords, player){
        let start = coords[0]
        let end = coords[coords.length-1]
        //checks for edges
        if(end >= 100 || start % 10 > end % 10 ) return false
        let checkShips = player === "Player" ? ships : AiShipData;
        for(let i = 0; i < coords.length; i++){
            if(checkShips.some((ship) => ship.shipCoords.includes(coords[i]))){
                return false;
            }
        }
        return true;
    }
    
    //a use effect that used as a pregame setup to allow the player to place all their ships on the board and start the game
    
    useEffect(() => {
        if(!gameStart){
          if(shipToPlaceIndex < 5){
            setShipToPlace(playerShipData[shipToPlaceIndex]);
            setText(`Place your ${shipToPlace.shipId}!`)
          } else {
            setGameStart(true);
            setIsHovering([]);
            setText("Launch an attack!")
          }
        }
    }, )
    
    
    //this use effect sets all the ai ships on the ai board as so as the player is ready to start the game
    useEffect(() => {
          if(gameStart && !aiReady){
              if(aiShips.length <= 5){ setAiShipToPlace(AiShipData[aiShipToPlaceIndex])
              placeAiship();
              }else{
                setAiReady(true)
              }
          }
      })
    
    
    function tryAgain() {
        placeAiship();
  }
    
//this function place all the ai ships on the ai board at any cell randomly from cell 0 to 98, and also returns what cell each ship is in to the validateShip function
    function placeAiship () {
      let ship = aiShipToPlace;
      let coordinate = Math.floor(Math.random() * 98);
      const axisArr = [1, 10];
      const increment = axisArr[Math.floor(Math.random() * 2)];
      const coordinates = [coordinate];
      for (let j = 1; j < aiShipToPlace.shipSize; j++) {
        coordinates.push(coordinate + (j * increment));
      }
      if(validateShip(coordinates, "Ai")){
        SetAiShips((currentShips) => {
            return [...currentShips, ship]
        });
        ship.shipCoords = coordinates;
      } else {
        tryAgain();
        return
      }
      setAiShipToPlaceIndex(prev => parseInt(prev + 1));
  }
  
    
    function gameOver(player){
        setText(`Game over! ${player} wins!`);
        if (player === "Ai") {
          alert.style.color = "red"
        }
        setGameWon(true)
    }
    
    
    function aiHandleHoverEffects(coords) {
        if (!aiReady) return;
        const target = [coords];
        setAiIsHovering(target);
  };
    
    
    //changes the axis of the ships
    function changeAxis(){
        setAxis(axis === "Vertical" ? "Horizontal" : "Vertical");
        setIsVertical(isVertical === false ? true : false)
    }
    
    
    //restarts the game
    function restartGame(){
        window.location.reload()
        alert.style.color = "white"
    }
      
    
      return(
          
        <div className="App">
            <Alerts
                turn={turn}
                startGame={startGame}
                text={text}
                shipToPlace={shipToPlace}
              />
              
            
            <div className="boards-container">
                <TheGameBoard
                    player="Player"
                    switchPlayer={switchPlayer}
                    currentPlayer={currentPlayer}
                    gameStart={gameStart}
                    setBoardReady={setBoardReady}
                    setGameWon={setGameWon}
                    shipToPlace={shipToPlace}
                    setShipToPlace={setShipToPlace}
                    onHover={hoverEffects}
                    isHovering={isHovering}
                    placeShip={placeShip}
                />
                
                
                {gameStart && (
                <TheGameBoard
                    player="Ai"
                    switchPlayer={switchPlayer}
                    currentPlayer={currentPlayer}
                    gameStart={gameStart}
                    setBoardReady={setBoardReady}
                    setGameWon={setGameWon}
                    aiIsHovering={isHovering}
                    onHover={aiHandleHoverEffects}
                    aiShips={aiShips}
                    setText={setText}
                    setAiBoard={setAiBoard}
                    aiBoard={aiBoard}
                    gameOver={gameOver}
                    gameWon={gameWon}        
                />
                )}
                
            </div>    
            <div className="lower-container">
                {!gameStart && (
                    <button className="lower-button" onClick={changeAxis}>Set {axis}</button>
                    )}
                    {gameWon && (
                    <button className="lower-button" onClick={startGame}>Play Again?</button>
                )}
            </div> 
        </div>
    );
    
}
export default App;
