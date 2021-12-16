$(function(){
    let dataFlat;

    $.ajax({
        type: "GET", 
        url: './input.csv',
    }).done(function(response){
        let data = $.csv.toArrays(response);
        dataFlat = data.flat();
        console.log(dataFlat);
        console.log(countIncreases(aggregateNumbers()));
    })

    let sumsOfThree=[];
    function aggregateNumbers(){
        for(let i=0; i<dataFlat.length; i++){                                                           
            let sumOfThree = +dataFlat[i] + +dataFlat[i+1] + +dataFlat[i+2];
            sumsOfThree.push(sumOfThree);
        }
        return sumsOfThree;
    }

    let counter=0;
    let secondCounter=0;
    function countIncreases(data){
        console.log(data);
        for(let i=0; i<data.length-1; i++){
            if(data[i+1]-data[i]>0){
                counter++;
            }else{
                secondCounter++;
            }
        }
        return counter;
    }
})
    
 
