$(function(){

    $.ajax({
        url: './inputDay9.csv',
    }).done(function(response){

        // Prepare data
        let data = $.csv.toArrays(response);
        data.forEach((element, index, arr) => {
            arr[index]= element[0].split('').map(Number);
        });

        let maxI = data.length-1;
        let maxJ = data[0].length-1;
      
        // Find horizontal minimums
        let horizontalPoints = findHorizontalPoints(data, maxI, maxJ);

        // Find vertical minimums
        let verticalPoints = findVerticalPoints(data, maxI, maxJ);

        // Find commonPoints, that are both horizontal and vertical minimums
        let commonPoints = findCommonPoints(horizontalPoints, verticalPoints);

        // Calculate sum of risk values for minimums
        let riskSum = calculateRiskSum(commonPoints, data);
        console.log('risk sum: '+riskSum);

        // Find basin sizes 
        checkBasinSizes(commonPoints, data, maxI, maxJ);

    }).fail(function(error){
        console.log(error);
    })

    // Function definition: Horizontal minimum point selection
    function findHorizontalPoints(arr, maxI, maxJ){
        let horizontalPoints = [];

        for(let i=0; i<=maxI; i++){
            for(let j=0; j<=maxJ; j++){
                if(i-1<0){
                    if(+arr[i][j]<+arr[i+1][j]){
                        horizontalPoints.push([i, j]);
                    }
                }else if(i==maxI){
                    if(+arr[i][j]<+arr[i-1][j]){
                        horizontalPoints.push([i, j]);
                    }
                }else if((+arr[i][j]<+arr[i-1][j]) && (+arr[i][j]<+arr[i+1][j])){
                    horizontalPoints.push([i, j]);
                }
            }
        }
        return horizontalPoints;
    }

    // Function definition: Vertical minimum point selection
    function findVerticalPoints(arr, maxI, maxJ){
        let verticalPoints = [];
        for(let i=0; i<=maxI; i++){
            for(let j=0; j<=maxJ; j++){
                if(j-1<0){
                    if(+arr[i][j]<+arr[i][j+1]){
                        verticalPoints.push([i, j]);
                    }
                }else if(j==maxJ){
                    if(+arr[i][j]<+arr[i][j-1]){
                        verticalPoints.push([i, j]);
                    }
                }else if((+arr[i][j]<+arr[i][j-1]) && (+arr[i][j]<+arr[i][j+1])){
                    verticalPoints.push([i, j]);
                }
            }
        }
        return verticalPoints;
    }

    // Function definition: Selection of points that are both vertical and horizontal minimum
    function findCommonPoints(arr1, arr2){
        let commonPointsArr = [];
        for(let i=0; i<arr1.length; i++){
            for(let j=0; j<arr2.length; j++){
                if(_.isEqual(arr1[i], arr2[j]) && commonPointsArr.indexOf(arr1[i]<0)){
                    commonPointsArr.push(arr1[i]);
                }
            }
        }
        return commonPointsArr;
    }

    // Function declaration: calculate sum of risk factors
    function calculateRiskSum(commonPoints, data){
        let riskSum=0;
        commonPoints.forEach(element => {
            let pointHeight = data[element[0]][element[1]];
            let riskLevel = +pointHeight +1;
            riskSum += riskLevel;
        });
        return riskSum;
    }

    // Function declaration: determine size of each basin
    function checkBasinSizes(minArr, arr, maxI, maxJ){
        let basinObject = {};

        checkSeed();

        function checkSeed(){
            minArr.forEach((element, index) => {
                // Declare variables for each minimum point
                basinObject['basin_'+index] = {};
                basinObject['basin_'+index]['min'] = element;
                basinObject['basin_'+index]['seed'] = [];
                basinObject['basin_'+index]['numberOfNewSeeds'] = 0;
                basinObject['basin_'+index]['shadowBoard'] = generateShadowBoard(maxI, maxJ);
                basinObject['basin_'+index]['basinSize'] = 1;

                // Map minimum point on the shadowboard
                basinObject['basin_'+index]['shadowBoard'][element[0]][element[1]]=1;

                // Check basin area up, down, to the right and to the left from minimum point. If given point belongs to the basin, map it on the shadowboard and make it a new seed
                checkDown(arr, element);
                checkUp(arr, element);
                checkRight(arr, element);
                checkLeft(arr, element);
    
                // Check if there are new seeds, then repeat checking basin area until there are no more new seeds. 
                while(basinObject['basin_'+index]['numberOfNewSeeds']>0){
                    basinObject['basin_'+index]['numberOfNewSeeds'] = 0;

                    basinObject['basin_'+index]['seed'].forEach((element) => {
                        checkDown(arr, element);
                        checkUp(arr, element);
                        checkRight(arr, element);
                        checkLeft(arr, element);
                    });
                }

                // Function declaration: Check down
                function checkDown(arr, element){
                    if(typeof arr[element[0]+1] !== 'undefined'){
                        if(arr[element[0]+1][element[1]]<9 && basinObject['basin_'+index]['shadowBoard'][element[0]+1][element[1]]==0){
                            basinObject['basin_'+index]['shadowBoard'][element[0]+1][element[1]]=1;
                            basinObject['basin_'+index]['basinSize']+=1;
                            basinObject['basin_'+index]['seed'].push([element[0]+1, element[1]]);
                            basinObject['basin_'+index]['numberOfNewSeeds']+=1;
                        };
                    }
                }
    
                // Function declaration: Ckeck up
                function checkUp(arr, element){
                    if(typeof arr[element[0]-1] !== 'undefined'){
                        if(arr[element[0]-1][element[1]]<9 && basinObject['basin_'+index]['shadowBoard'][element[0]-1][element[1]]==0){
                            basinObject['basin_'+index]['shadowBoard'][element[0]-1][element[1]]=1;
                            basinObject['basin_'+index]['basinSize']+=1;
                            basinObject['basin_'+index]['seed'].push([element[0]-1, element[1]]);
                            basinObject['basin_'+index]['numberOfNewSeeds']+=1;
                        };
                    }
                };
    
                // Function declaration: check right
                function checkRight(arr, element){
                    if(typeof arr[0][element[1]+1] !== 'undefined'){
                        if(arr[element[0]][element[1]+1]<9 && basinObject['basin_'+index]['shadowBoard'][element[0]][element[1]+1]==0){
                            basinObject['basin_'+index]['shadowBoard'][element[0]][element[1]+1]=1;
                            basinObject['basin_'+index]['basinSize']+=1;
                            basinObject['basin_'+index]['seed'].push([element[0], element[1]+1]);
                            basinObject['basin_'+index]['numberOfNewSeeds']+=1;
                        }
                    }
                }
    
                // Function declaration: Check left
                function checkLeft(arr, element){
                    if(typeof arr[0][element[1]-1] !== 'undefined'){
                        if(arr[element[0]][element[1]-1]<9 && basinObject['basin_'+index]['shadowBoard'][element[0]][element[1]-1]==0){
                            basinObject['basin_'+index]['shadowBoard'][element[0]][element[1]-1]=1;
                            basinObject['basin_'+index]['basinSize']+=1;
                            basinObject['basin_'+index]['seed'].push([element[0], element[1]-1]);
                            basinObject['basin_'+index]['numberOfNewSeeds']+=1;
                        }
                    }
                }
            });
        }

        // Find top 3 biggest basins and return product of their sizes
        let top3BasinsProduct = findMaxBasins(basinObject);
        console.log('product of top 3 basin sizes: '+top3BasinsProduct);

        // Function definition: find top 3 basins, multiply their sizes and return the result
        function findMaxBasins(object){
            let basinSizeArr = [];
            for(const prop in object){
                basinSizeArr.push(object[prop]['basinSize']);
            }
            basinSizeArr.sort((a,b)=> b - a);
            let top1Basin = basinSizeArr[0];
            let top2Basin = basinSizeArr[1];
            let top3Basin = basinSizeArr[2];

            let result = top1Basin * top2Basin * top3Basin;

            return result;
        }
    }

    // Function declaration: generate shadowboard of zeros, of given size
    function generateShadowBoard(dimensionX, dimensionY){
        let emptyBoard = new Array;
        let clonedEmptyBoard = Object.assign([], emptyBoard);
        for(let i=0; i<dimensionX+1; i++){
            clonedEmptyBoard.push(new Array(dimensionY+1).fill(0));
        }
        return clonedEmptyBoard;
    }

});
