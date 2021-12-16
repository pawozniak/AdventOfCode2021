$(function(){

    $.ajax({
        url: './inputDay7.csv',
    }).done(function(response){

        // Prepare data
        let data = $.csv.toArray(response);
        let dataArray = data.map(Number);
        let max = Math.max.apply(null, dataArray);

        findMinFuelPath(dataArray, max);
    })

    function findMinFuelPath(data, max){
        let deltaObject = {};

        for(let i=0; i<=max; i++){
            deltaObject['deltaAt'+i]=0;
            
            data.forEach(element => {
                let delta = calculateDelta(element,i);
                let temporaryDeltaAt = deltaObject['deltaAt'+i];
                deltaObject['deltaAt'+i] = temporaryDeltaAt + delta;
            });
        }

        console.log(minDelta(deltaObject));
    }

    function calculateDelta(currentPosition, destinationPosition){
        let delta = Math.abs(destinationPosition-currentPosition);
        let deltaCorrected = 0;
        for(let i=1; i<=delta; i++){
            deltaCorrected += i;
        }
        return deltaCorrected;
    }

    function minDelta(object){
        let arr = Object.values(object);
        let min = Math.min(...arr);
        return min;
    }
});
