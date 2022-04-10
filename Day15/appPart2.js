$(function(){
    $.ajax({
        url: './inputDay15.csv'
    }).done(function(response){

        // Prepare data
        let data = $.csv.toArrays(response);
        
        data.forEach((element, index, arr) => {
            arr[index]= element[0].split('').map(Number);
        });

        // console.log(data);
        let caveDimension = data.length;
        let caveExtensionFactor = 5;
        let extendedDimension = caveDimension*caveExtensionFactor;

        let counter = 0;
        let startX = 0;
        let startY = 0;

        let endX = extendedDimension-1;
        let endY = extendedDimension-1;

        let currentVertexX = startX;
        let currentVertexY = startY;
        let currentVertex = `${currentVertexX},${currentVertexY}`;
        // console.log(currentVertex);

        let object = {};
        object.visited = {};
        object.priorityList = [];

        object.priorityList.push(currentVertex);

        object.cumulativeDistances = {};

        object.visited[`${currentVertexX},${currentVertexY}`] = 0;

        // let sortedPriorityList = [];
        while(Object.keys(object.priorityList).length>0){
            if(currentVertexX == endX && currentVertexY == endY){
                console.log('end');

                console.log(object.cumulativeDistances[`${currentVertexX},${currentVertexY}`]);
                break;
            }

        for(let i=-1; i<2; i++){
            for(let j=-1; j<2; j++){

                let neighbourCoordinateX = currentVertexX+i;
                let neighbourCoordinateY = currentVertexY+j;

                // console.log(neighbourCoordinateX,neighbourCoordinateY);

                // Point must fit in data array dimension
                let condition1 = neighbourCoordinateX > -1 && neighbourCoordinateX < extendedDimension && neighbourCoordinateY > -1 && neighbourCoordinateY < extendedDimension;
                // console.log(condition1);
                // Exclude diagonals
                let condition2 = Math.abs(i)!==Math.abs(j);
                // Investigate only unvisited nodes
                let condition3 = object.visited[`${neighbourCoordinateX},${neighbourCoordinateY}`] === undefined;

                if(condition1 && condition2 && condition3){
                    // console.log(neighbourCoordinateX,neighbourCoordinateY);

                    let factorX = Math.floor(neighbourCoordinateX/caveDimension);
                    let factorY = Math.floor(neighbourCoordinateY/caveDimension);

                    // console.log('factorX: '+factorX);
                    // console.log('factorY: '+factorY);

                    let temporaryNeighbourCoordinateX = neighbourCoordinateX-caveDimension*factorX;
                    let temporaryNeighbourCoordinateY = neighbourCoordinateY-caveDimension*factorY;

                    let currentVertexDistance = data[temporaryNeighbourCoordinateX][temporaryNeighbourCoordinateY];
                    // console.log('currVerDist: '+currentVertexDistance);
                    
                    for(let i=0; i<(factorX+factorY); i++){
                            currentVertexDistance = currentVertexDistance == 9 
                            ? 1
                            : currentVertexDistance+1;
                     }

                    let previousDistance = object.visited[`${currentVertexX},${currentVertexY}`] ? object.visited[`${currentVertexX},${currentVertexY}`] : 0;

                    let cumulativeDistance = previousDistance + currentVertexDistance;

                    if(object.cumulativeDistances[`${neighbourCoordinateX},${neighbourCoordinateY}`] === undefined || object.cumulativeDistances[`${neighbourCoordinateX},${neighbourCoordinateY}`] > cumulativeDistance){
                        object.cumulativeDistances[`${neighbourCoordinateX},${neighbourCoordinateY}`] = cumulativeDistance;
                    }

                    if(object.priorityList.indexOf(`${neighbourCoordinateX},${neighbourCoordinateY}`)<0){
                        object.priorityList.push(`${neighbourCoordinateX},${neighbourCoordinateY}`);
                    }
                }
            }
        }

        object.priorityList.shift();

        object.priorityList.sort(function(a,b){
            object.cumulativeDistances[a] < object.cumulativeDistances[b];
        })     

        if(Object.keys(object.priorityList).length>0){
            // console.log('true');

            currentVertex = object.priorityList[0];
            // console.log(currentVertex);
            object.visited[currentVertex]=true;

            currentVertexX = currentVertex.split(',').map(Number)[0];
            currentVertexY = currentVertex.split(',').map(Number)[1];

            object.visited[`${currentVertexX},${currentVertexY}`] = object.cumulativeDistances[`${currentVertexX},${currentVertexY}`];
        }
    }
    console.log(object);

    }).fail(function(error){
        console.log(error);
    })
})
