$(function(){
    let dataFlat;

    $.ajax({
        type: "GET", 
        url: './inputDay2.csv',
    }).done(function(response){
        let data = $.csv.toArrays(response);
        dataFlat = data.flat();
        calculateValues(dataFlat);
    })

    let horizontalPosition = 0;
    let depth = 0;
    let aim = 0;

    let regexNumber = /\d+/g;

    function calculateValues(arr){
        let regexUpward = /up/;
        let regexDownward = /down/;
        let regexForward = /forward/;

        arr.forEach(element => {
            if(regexDownward.test(element)){
                aimChange = +element.match(regexNumber);
                aim += aimChange;
            }else if(regexForward.test(element)){
                let horizontalChange = +element.match(regexNumber);
                horizontalPosition += horizontalChange;
                depth += horizontalChange*aim;
            }else if(regexUpward.test(element)){
                aimChange = +element.match(regexNumber);
                aim -= aimChange;
            } 

        });
        console.log('horizontal: '+horizontalPosition);
        console.log('depth: '+depth);
        console.log('aim: '+aim);
    }
})
    
 
