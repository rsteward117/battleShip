function Shipstatus(coordsArray, isRotated){
    const coords = coordsArray;
    const rotated = isRotated;
    let health = coordsArray.length;
    
    function shipHit(){
        health--;
    }
    
    function shipSunk(){
        if(health === 0){
            return true;
        }
    }
    
    function shipRotate(){
        return rotated;
    }
    return {coords, shipHit, shipSunk, shipRotate}
}
export default Shipstatus;