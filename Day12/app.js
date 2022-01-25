$(function(){

    let connections = [
        ['zi', 'end'],
        ['XR', 'start'],
        ['zk', 'zi'],
        ['TS', 'zk'],
        ['zw', 'vl'],
        ['zk', 'zw'],
        ['end', 'po'],
        ['ws', 'zw'],
        ['TS', 'ws'],
        ['po', 'TS'],
        ['po', 'YH'],
        ['po', 'xk'],
        ['zi', 'ws'],
        ['zk', 'end'],
        ['zi', 'XR'],
        ['XR', 'zk'],
        ['vl', 'TS'],
        ['start', 'zw'],
        ['vl', 'start'],
        ['XR', 'zw'],
        ['XR', 'vl'],
        ['XR', 'ws'],
    ]

    let connectionsFlat = connections.flat();

    function removeDuplicates(arr){
        return arr.filter((value, index) => arr.indexOf(value) === index);
    }

    class Graph {
        constructor(){
            this.connections = {};
        }
        addVertex(vertex){
            if(!this.connections[vertex]){
                this.connections[vertex] = [];
            }
        }
        addEdge(source, destination){
            if(!this.connections[source]){
                this.addVertex(source);
            }
            if(!this.connections[destination]){
                this.addVertex(destination);
            }
            this.connections[source].push(destination);
            this.connections[destination].push(source);
        }
    }

    let graph = new Graph();

    graph.vertices = removeDuplicates(connectionsFlat);

    graph.vertices.forEach(element => {
        graph.addVertex(element);    
    });

    connections.forEach(element => {
        graph.addEdge(element[0], element[1]);
    });

    let pathCounter = 0;
    let pathList = [];

    function findAllPaths(start, end){
        graph.wasVisited = {};
        graph.vertices.forEach(element => {
            graph.wasVisited[element]=0;
        });
     
        pathList.push(start);
        graph.wasVisited[start] = 2;

        findAllPathsUtil(start, end, graph.wasVisited, pathList);
    }

    function findAllPathsUtil(node, end, visited, localPathList){
        if(node == end){
            // console.log(localPathList);
            pathCounter ++;
            return;
        }

        if(node == node.toLowerCase()){
            visited[node] += 1;
        }

        let currentNodeConnections = graph.connections[node];

        for(let i=0; i<currentNodeConnections.length; i++){

            graph.wasVisited.AnySmallCaveVisitedTwice = false;   
            for(prop in visited){
                if(visited[prop]==2){
                    graph.wasVisited.AnySmallCaveVisitedTwice = true;
                    break;
                }
            }

            let threshold = graph.wasVisited.AnySmallCaveVisitedTwice ? 1 : 2;

            if(visited[currentNodeConnections[i]]<threshold){
                localPathList.push(currentNodeConnections[i]);
                findAllPathsUtil(currentNodeConnections[i], end, graph.wasVisited, localPathList);

                localPathList.splice(localPathList.lastIndexOf(currentNodeConnections[i]),1);
            }
        }

        if(node!='start' && node == node.toLowerCase()){
            visited[node] -= 1;
            graph.wasVisited.AnySmallCaveVisitedTwice = false;
        }
    }

    findAllPaths('start', 'end');
    console.log(pathCounter);
})
