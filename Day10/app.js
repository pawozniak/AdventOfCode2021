$(function(){
    
    $.ajax({
        url: './inputDay10.csv'
    }).done(function(response){

        // Prepare data
        let data = $.csv.toArrays(response);

        // Check mistakes
        checkMistakes(data);

    }).fail(function(error){
        console.log(error);
    })

    // Function declaration: check mistakes
    function checkMistakes(data){

    // Regex finding legit pairs
    let regexCheckImeediatePairs = /{}|<>|\[\]|\(\)/g;

    // Regex finding wrong closing
    let regexFindWrongClosing = /[{|\(|\[|<][^{|^\(|^\[|^<]/g;

    // Array to store strings with invalid closing
    let wrongClosingsArr = [];
    // Array to store incomplete strings 
    let incompleteArr = [];

    data.forEach((element, index) => {

        // Remove all immediate pairs
        while(element[0].match(regexCheckImeediatePairs)){
            if(regexCheckImeediatePairs){
                element[0] = element[0].replace(regexCheckImeediatePairs, '');
            };
        }
    
        // // Push first wrong closing instance to array storing invalid closings or push not incomplete closing strings to incomplete strings array 
        if(element[0].match(regexFindWrongClosing)){
            let wrongClosing = element[0].match(regexFindWrongClosing)[0][1];
            wrongClosingsArr.push(wrongClosing);
        }else{
            incompleteArr.push(element[0]);
        }
    });

    // Process and console log results
    // Sum of mistake points
    console.log('mistake points: '+ calculateMistakePointsSum());

    // Incomplete closing points
    let complementaryArr = closePairs(incompleteArr);
    let points = assignPoints(complementaryArr);
    console.log('incomplete closing points: '+points);

    // Function declatarion: assign points to wrong closings and calculate their sum
    function calculateMistakePointsSum(){
        // Mistake points map
        let mistakePoints = {
            ')': 3,
            ']': 57,
            '}': 1197,
            '>': 25137 
        }
    
        let points=0;
        for(let i=0; i<wrongClosingsArr.length; i++){
            points+=mistakePoints[wrongClosingsArr[i]];
        }
        return points;
    }

    function closePairs(arr){
        // Complementary closings map
        let pairClosings = {
            '(': ')',
            '[': ']',
            '{': '}',
            '<': '>'
        };

        let complementaryArr = [];

        arr.forEach(element => {
            let tempArr = '';
                tempArr='';
                for(let i=element.length-1; i>=0; i--){
                    tempArr += pairClosings[element[i]];
                }
            complementaryArr.push(tempArr);
        });

        return complementaryArr;
    }

        function assignPoints(arr){
            // pair closing points
            let pairClosingsPoints = {
                ')': 1,
                ']': 2,
                '}': 3,
                '>': 4
            };
            
            let resultArr = [];

            arr.forEach(element => {
                let result = 0;
                for(let i=0; i<element.length; i++){
                    result *=5;
                    result += pairClosingsPoints[element[i]];
                }
                resultArr.push(result);
            });

            resultArr.sort((a,b)=> a - b);

            let resultNumber = resultArr[Math.floor(resultArr.length/2)]

            return resultNumber;
        }
    }
});
