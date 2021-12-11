$(function(){

    $.ajax({
        type: 'GET',
        url: './inputDay5.txt'
    }).done(function(response){
        // Prepare data
        let data = response.replace(/\n/g, ']], [[');
        data = data.replace(/ -/g, '], ');
        data = data.replace(/> /g, '[');
        data = '[[[' + data + ']]]';
        let dataArr = JSON.parse(data);
        let arrayMax = 999;

        let temporaryObject = {};
        let mapObject = dataToObject(dataArr, temporaryObject);
        console.log(mapObject);
        generateShadowBoard(arrayMax);
        let shadowBoard = generateShadowBoard(arrayMax);
        generateLinesForObject(mapObject, shadowBoard);
        console.log(countOverlays(shadowBoard, arrayMax));

    }).fail(function(error){
        console.log(error);
    })

    // Convert data from input to object
    function dataToObject(data, mapObject){
        data.forEach((element, index) => {
            mapObject['setOfCoordinates: '+index] = {};
            mapObject['setOfCoordinates: '+index]['start X'] = element[0][0];
            mapObject['setOfCoordinates: '+index]['start Y'] = element[0][1];
            mapObject['setOfCoordinates: '+index]['end X'] = element[1][0];
            mapObject['setOfCoordinates: '+index]['end Y'] = element[1][1];
        });
        return mapObject;
    }

    // Function definition: generate board of zeros, to put coordinates on 
    function generateShadowBoard(dimension){
        let emptyBoard = new Array;
        let clonedEmptyBoard = Object.assign([], emptyBoard);
        for(let i=0; i<dimension+1; i++){
            clonedEmptyBoard.push(new Array(dimension+1).fill(0));
        }
        return clonedEmptyBoard;
    }

    // Function definition: based on coordinates, draw lines
    function generateLineFromCoordinates(startX, endX, startY, endY, shadowBoard){
        let changeX = startX<=endX;
        let changeY = startY<=endY;

        if(changeX && changeY){
            for(let i=startX; i<=endX; i++){
                if(startX==endX || startY==endY){
                    for(let j=startY; j<=endY; j++){
                        shadowBoard[i][j]+=1;}
                }else if(Math.abs(startY-endY)==Math.abs(startX-endX)){
                    shadowBoard[startX++][startY++]+=1;
                }
            }
        }else if(!changeX && changeY){
            for(let i=startX; i>=endX; i--){
                if(startX==endX || startY==endY){
                    for(let j=startY; j<=endY; j++){
                        shadowBoard[i][j]+=1;}
                }else if(Math.abs(startY-endY)==Math.abs(startX-endX)){
                    shadowBoard[startX--][startY++]+=1;
                }
            }
        }else if(changeX && !changeY){
            for(let i=startX; i<=endX; i++){
                if(startX==endX || startY==endY){
                    for(let j=startY; j>=endY; j--){
                        shadowBoard[i][j]+=1;
                    }
                }else if(Math.abs(startY-endY)==Math.abs(startX-endX)){
                    shadowBoard[startX++][startY--]+=1;
                }
            }
        }else if(!changeX && !changeY){
            for(let i=startX; i>=endX; i--){
                if(startX==endX || startY==endY){
                    for(let j=startY; j>=endY; j--){
                        shadowBoard[i][j]+=1;
                    }
                }else if(Math.abs(startY-endY)==Math.abs(startX-endX)){
                    shadowBoard[startX--][startY--]+=1;
                }
            }
        }
    }

    // Generate lines for all coordinates
    function generateLinesForObject(object, shadowBoard){
        for(let prop in object){
            let startX = object[prop]['start X'];
            let endX = object[prop]['end X'];
            let startY = object[prop]['start Y']; 
            let endY = object[prop]['end Y'];
    
            generateLineFromCoordinates(startX, endX, startY, endY, shadowBoard);
        }
    }

    function countOverlays(board, arrayMax){
        let overlaysCounter=0;
        for(let i=0; i<=arrayMax; i++){
            for(let j=0; j<=arrayMax; j++){
                if(board[i][j]>1){
                    overlaysCounter++;
                }
            }
        }
        return overlaysCounter;
    }
})
