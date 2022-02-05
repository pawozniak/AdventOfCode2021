$(function(){

    $.ajax({
        url: './inputDay13.csv'
    }).done(function(response){
        let points = $.csv.toArrays(response);
        let pointsX = [];
        let pointsY = [];
        points.forEach(element => {
            pointsX.push(element[0]);
            pointsY.push(element[1]);
        });

        let maxX = Math.max.apply(null, pointsX);
        let maxY = Math.max.apply(null, pointsY);

        // Generate array of the size of maximum coordinates
        let mapArray = generateMapArray(maxX, maxY);
        // Plot points on the generated array
        plotPointsOnMap(mapArray, points);

        mapArray = foldAlongX(mapArray, 655);
        mapArray = foldAlongY(mapArray, 447);
        mapArray = foldAlongX(mapArray, 327);
        mapArray = foldAlongY(mapArray, 223);
        mapArray = foldAlongX(mapArray, 163);
        mapArray = foldAlongY(mapArray, 111);
        mapArray = foldAlongX(mapArray, 81);
        mapArray = foldAlongY(mapArray, 55);
        mapArray = foldAlongX(mapArray, 40);
        mapArray = foldAlongY(mapArray, 27);
        mapArray = foldAlongY(mapArray, 13);
        mapArray = foldAlongY(mapArray, 6);
    }).fail(function(error){
        console.log(error);
    })

    // Function definition: Generate array of the size of maximum coordinates
    function generateMapArray(dimensionX, dimensionY){
        let mapArray = [];
        for(let i=0; i<dimensionY+1; i++){
            mapArray.push(new Array(dimensionX+1).fill(0));
        }
        return mapArray;
    }

    // Plot points on the generated array
    function plotPointsOnMap(mapArray, points){
        points.forEach(element => {
            mapArray[element[1]][element[0]] = 1;
        });
    }

    // Function definition: Fold array along Y axis 
    function foldAlongY(array, row){
        let firstArray = array;
        let secondArray = firstArray.splice(row, array.length-row);
        secondArray.shift();
        secondArray.reverse();

        completeShorterArrayWithZeros(firstArray, secondArray);
        
        return resultArray = prepareResultArray(firstArray);
    }
    
    // Function definition: Fold array along X axis 
    function foldAlongX(array, column){
        let firstArray = [];
        let secondArray = [];
        array.forEach(element => {
            let firstArrayRow = element;
            let secondArrayRow = firstArrayRow.splice(column, element.length-column);
            secondArrayRow.shift();
            secondArrayRow.reverse();
            completeShorterRowWithZeros(firstArrayRow, secondArrayRow);
            firstArray.push(firstArrayRow);
            secondArray.push(secondArrayRow);
        });

        return resultArray = prepareResultArray(firstArray);
    }

    function completeShorterArrayWithZeros(firstArray, secondArray){
        let longerArray = firstArray.length>=secondArray.length ? firstArray : secondArray;
        let shorterArray = firstArray.length<secondArray.length ? firstArray : secondArray;
        
        while(shorterArray.length<longerArray.length){
            let complementaryRow = new Array(shorterArray[0].length).fill(0);
            shorterArray.unshift(complementaryRow);
        }
    }

    function completeShorterRowWithZeros(firstRow, secondRow){
        let longerRow = firstRow.length>=secondRow.length ? firstRow : secondRow;
        let shorterRow = firstRow.length<secondRow.length ? firstRow : secondRow;

        while(shorterRow.length<longerRow.length){
            shorterRow.unshift(0);
        }
    }

    function prepareResultArray(firstArray){
        let resultArray = [];
        let resultCounter = 0;

        for(let i=0; i<firstArray.length; i++){
            resultArray.push([]);
            for(let j=0; j<firstArray[0].length; j++){
                let result = firstArray[i][j] + secondArray [i][j];
                if(result>0){
                    resultArray[i][j] = 1;
                    resultCounter++;
                }else{
                    resultArray[i][j] = 0;
                }
            }
        }
        console.log(resultCounter);
        console.log(resultArray);
        return resultArray;
    }
})
