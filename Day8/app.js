$(function(){

    $.ajax({
        type: 'GET',
        url: './inputDay8.csv'
    }).done(function(response){

        // Prepare data
        let data = response.replace(/\n/g, '"]],[["');
        data = data.replace(/ \| /g, '"],["');
        data = '[[["' + data + '"]]]';
        data = data.replace(/ /g, '", "');
        let dataArr = JSON.parse(data);
        let dataObject = prepareObject(dataArr);

        // Part 1
        // let uniqueCodeCounter = countUniqueCodes(dataObject);
        // console.log(uniqueCodeCounter);

        // Part 2
        decodeInput(dataObject);
        decodeOutput(dataObject);
        let result = sumAllResults(dataObject);
        console.log(result);

    }).fail(function(error){
        console.log(error);
    })

    // Prepare object from array
    function prepareObject(data){
        let dataObject={};

        data.forEach((element, index) => {
            dataObject['element'+index] = {};
            dataObject['element'+index]['input'] = element[0];
            dataObject['element'+index]['output'] = element[1];
            dataObject['element'+index]['keys'] = {};
        });

        return dataObject;
    }

    // Part 1 - count simple codes in output
    function countUniqueCodes(object){
        let uniqueSimpleCounter = 0;
        for(let prop in object){
            let code = object[prop].output;
            code.forEach(element => {
                if(element.length==2 || element.length == 3 || element.length == 4 || element.length == 7){
                    uniqueSimpleCounter++;
                }
            });
        }
        return uniqueSimpleCounter;
    }

    // Assign numbers to codes - in input
    function decodeInput(object){
        for(let prop in object){
            let codedInput = object[prop].input;
            codedInput.sort((a, b) => a.length - b.length)
            codedInput.forEach((element, index) => {
                let sortedCode = element.split('').sort().join('');
                if(element.length==2){
                    object[prop]['keys'][1]=sortedCode;
                }else if(element.length==3){
                    object[prop]['keys'][7]=sortedCode;
                }else if(element.length==4){
                    object[prop]['keys'][4]=sortedCode;
                }else if(element.length==5){
                    if(scramble(object[prop]['keys'][7],element)){
                        object[prop]['keys'][3]=sortedCode;
                    }else if(!element.includes(findMostRepeatingCharacter(codedInput))){
                        object[prop]['keys'][2]=sortedCode;
                    }else{
                        object[prop]['keys'][5]=sortedCode;
                    }
                }else if(element.length==6){
                    if(scramble(object[prop]['keys'][4],element)){
                        object[prop]['keys'][9]=sortedCode;
                    }else if(scramble(object[prop]['keys'][1],element)){
                        object[prop]['keys'][0]=sortedCode;
                    }else{
                        object[prop]['keys'][6]=sortedCode;
                    }
                }else if(element.length==7){
                    object[prop]['keys'][8]=sortedCode;
                }
            });
        }
    }

    // Check if str contains all characters from originalStr
    function scramble(originalStr, str){
        counter=0;
        for(let i=0; i<=originalStr.length; i++){
            if(str.includes(originalStr[i])){
                counter++;
            }
        }
        return (counter==originalStr.length) ? true : false;
    }

    // Find the most common character in all codes
    function findMostRepeatingCharacter(arr){
        let tempStr = '';
        arr.forEach(element => {
           tempStr+=element;
        });

        var max = 0,
        maxChar = '';
        tempStr.split('').forEach(function(char){
            if(tempStr.split(char).length > max) {
                max = tempStr.split(char).length;
                maxChar = char;
            }
        });
        return maxChar;
    }

    // Based on numbers assigned to input, decode output 
    function decodeOutput(object){
        for(let prop in object){
            let output = object[prop].output;
            let result="";

            output.forEach(element => {
                let sortedElement = element.split('').sort().join('');
                result+=getKeyByValue(object[prop]['keys'], sortedElement);
            });
            console.log(result);
            object[prop]['result'] = result;

        }

        // Find value and return corresponding property
        function getKeyByValue(object, value) {
            return Object.keys(object).find(key => object[key] === value);
        }
    }

    // RESULT: Sum all decoded output values 
    function sumAllResults(object){
        let sum=0;
        for(let prop in object){
            sum += +object[prop]['result'];
        }
        return sum;
    }
})
