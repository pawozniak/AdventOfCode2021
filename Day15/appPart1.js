$(function(){
    $.ajax({
        url: './inputDay15.csv'
    }).done(function(response){
        
        // Prepare data
        let data = $.csv.toArrays(response);
        console.log(data);
        
        data.forEach((element, index, arr) => {
            arr[index]= element[0].split('').map(Number);
        });

        let dimension = data.length;

        // Prepare result object
        let object = {};
        object.shortestDistance = {};
        object.previousVertex = {};
        object.unvisited = {};

        // Assign distance to nodes (0 to start nodes, infinity to all other nodes)
        for(let i=0; i<dimension; i++){
            for(let j=0; j<dimension; j++){
                object.unvisited[[i,j]]='';
                object.shortestDistance[[i,j]]={};
                object.previousVertex[[i,j]] = '';

                if(i==0 && j==0){
                    object.shortestDistance[[i,j]] = 0;
                    object.unvisited[[i,j]]=0;

                }else{
                    object.shortestDistance[[i,j]] = Infinity;
                    object.unvisited[[i,j]]=Infinity;
                }
            }
        }

        // Repeat while there are unvisited nodes left
        while(Object.keys(object.unvisited).length>0){
        // Visit unvisited vertex with smalles distance from the start
        let currentVertex = Object.keys(object.unvisited).reduce((key, v) => object.unvisited[v] < object.unvisited[key] ? v : key);
        currentVertex = currentVertex.split(',').map(Number);

        // For current vertex examine unvisited neighbours
        let currentVertexNeighbours = [];
        for(let i=-1; i<2; i++){
            for(let j=-1; j<2; j++){
                if(data[currentVertex[0]+i] !== undefined && data[currentVertex[0]+i][currentVertex[1]+j] !== undefined && Math.abs(i)!==Math.abs(j)){
                    currentVertexNeighbours.push([currentVertex[0]+i,currentVertex[1]+j]);
                }
            }
        }

        // For the current vertex calculate the distance of each neighbour from the start
        currentVertexNeighbours.forEach(element => {
            let calculatedDistance = object.shortestDistance[currentVertex]+data[element[0]][element[1]];
            
            if(calculatedDistance<object.unvisited[element]){
                object.unvisited[element] = calculatedDistance;
                object.shortestDistance[element] = calculatedDistance;
                object.previousVertex[element] = currentVertex;
            }
        });

        // Remove current vertex from the list of unvisited nodes
        delete object.unvisited[currentVertex];
        }

        console.log(object.shortestDistance[[dimension-1,dimension-1]])

    }).fail(function(error){
        console.log(error);
    })
})
