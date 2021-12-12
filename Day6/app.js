$(function(){

    // let exampleData = [3,4,3,1,2];

    $.ajax({
        url: './inputDay6.csv'
    }).done(function(response){
        console.log(response);
        let data = $.csv.toArray(response);
        let dataArray = data.map(Number);
        console.log(dataArray);
        countFishNumber(dataArray);
        console.log('RESULT: '+dataArray.length);
    })
    
    function countFishNumber(data){

        let numberEachAge = countEachAge(data);

        for(let i=0; i<256; i++){
            numberEachAge = countFishEachAge(numberEachAge);
        }

        console.log(numberEachAge);

        let sumOfFish=0;
        for(let prop in numberEachAge){
            sumOfFish+=numberEachAge[prop];
        }

        console.log(sumOfFish);

    }

    function countEachAge(data){
        let temporaryObj = {};

        for(let i=0; i<=8; i++){
            temporaryObj['counter'+i] = 0;
            data.forEach(element => {
                if(element==i){
                    temporaryObj['counter'+i]++;
                }
            });
        }   
        return temporaryObj;
    } 

    function countFishEachAge(data){
        let newNumberEachAge = {};
        let numberEachAge = data;

            newNumberEachAge['counter0']=numberEachAge['counter1'];
            newNumberEachAge['counter1']=numberEachAge['counter2'];
            newNumberEachAge['counter2']=numberEachAge['counter3'];
            newNumberEachAge['counter3']=numberEachAge['counter4'];
            newNumberEachAge['counter4']=numberEachAge['counter5'];
            newNumberEachAge['counter5']=numberEachAge['counter6'];
            newNumberEachAge['counter6']=numberEachAge['counter7']+numberEachAge['counter0'];
            newNumberEachAge['counter7']=numberEachAge['counter8'];
            newNumberEachAge['counter8']=numberEachAge['counter0'];

        return newNumberEachAge;
    }

})
