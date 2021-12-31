$(function(){

    let inputData = [
        [1,3,2,6,2,5,3,3,1,5],
        [3,4,2,7,7,2,8,1,1,3],
        [5,7,5,1,6,1,2,5,4,2],
        [6,5,4,3,8,6,8,3,2,2],
        [4,4,2,2,5,2,6,2,2,1],
        [2,2,3,4,3,2,5,6,4,7],
        [1,7,7,3,1,7,4,8,8,7],
        [7,2,8,1,3,2,1,6,7,4],
        [6,5,6,2,5,1,3,1,1,8],
        [4,8,2,4,5,4,1,5,2,2],
    ]

    let maxI = inputData.length;
    let maxJ = inputData[0].length;

    let resultObject = {
        flashCounter: 0,
        cummulatedFlashes: 0,
    };

    // Perform steps
    performSteps();

    // Function definition: for given number of steps, proceed with the process
    function performSteps(){
        for(let i=0; i<300; i++){

            // Reset number of cummulated flashes for each step
            resultObject.cummulatedFlashes = 0;
    
            // Basic incrementation of energy levels at each point (without charging adjacent points)
            let flashedArr = loadEnergy(maxI, maxJ);
    
            // Charge points adjacent to explosions from loadEnergy funcion
            chargeAdjacentPoints(flashedArr);

            // If all points flash at the same time, console.log step number and break
            if(resultObject.cummulatedFlashes==100){
                console.log('synchronyous flash at step: '+(i+1));
                return;
            }
         }
    }

    // Function declaration: Increment energy for every dumbo octopus. If energy is greater than 9, set it to 0, push the point to flashedArr and increment flashCounter
    function loadEnergy(maxI, maxJ){
        // Explosion points array
        let flashedArr=[];
        for(let i=0; i<maxI; i++){
            for(let j=0; j<maxJ; j++){
                inputData[i][j]+=1;
                if(inputData[i][j]==10){
                    inputData[i][j]=0;
                    flashedArr.push([i, j]);
                    resultObject.flashCounter+=1;
                    resultObject.cummulatedFlashes +=1;
                }
            }
        }
        return flashedArr;
    } 

    // Function definition: repeatedly charge points adjacent to explosions until there are no more explosions
    function chargeAdjacentPoints(flashedArr){
            let tempFlashArr;

            // Repeat as long as there are new flashes
            while(flashedArr.length>0){
                // Reset temporary flash array
                tempFlashArr = [];
                // For each explosion adjacent point 
                flashedArr.forEach(element => {
                    for(let i=-1; i<=1; i++){
                        for(let j=-1; j<=1; j++){
                            // Skip if the point is explosion point itself or when the adjacent point does not exist (would be outside of array)
                            if((i==0 && j==0) || element[0]+i < 0 || element[1]+j < 0 || element[0]+i >= maxI || element[1]+j >= maxJ){
                                continue;
                            }else{
                                // Proceed if point energy is greater than 0
                                if(inputData[+element[0]+i][+element[1]+j]!=0){
                                    // Simply increment energy level unless the point reaches explosion level
                                    inputData[+element[0]+i][+element[1]+j]+=1;
                                    if(inputData[+element[0]+i][+element[1]+j]==10){
                                        // Reset the energy level to 0
                                        inputData[+element[0]+i][+element[1]+j]=0;
                                        // Add point to the temporary flash array
                                        tempFlashArr.push([+element[0]+i, +element[1]+j]);
                                        resultObject.flashCounter+=1;
                                        resultObject.cummulatedFlashes +=1;
                                    }
                                }
                            }
                        }
                    }
                });
                // Update explosion points array
                flashedArr = tempFlashArr;
            }
        }

    console.log('flash counter: '+resultObject.flashCounter);
});
