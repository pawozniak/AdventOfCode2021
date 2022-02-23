$(function(){

    $.ajax({
        url: './inputDay14.csv',
    }).done(function(response){
        let data = response.replace(/ -> /g, ',');
        data = $.csv.toArrays(data);
        let templatePolymer = 'KFFNFNNBCNOBCNPFVKCP';
        let numberOfIterations = 40;

        let instructionsObject = prepareInstructionsObject(data);
        instructionsObject.frequencies = {};
        instructionsObject.frequencies[0] = {};

        // Translate templatePolymer into array of pairs
        let arrayOfPairs = [];
        for(let i=0; i<templatePolymer.length-1; i++){
            arrayOfPairs.push(templatePolymer[i]+templatePolymer[i+1]);
        }

        // Count frequencies of pairs in template polymer
        getElementsFrequencies(arrayOfPairs, instructionsObject.frequencies[0]);

        // Inject particle into each pair, count number of newly created particles, repeat given number times   
        for(let i=0; i<numberOfIterations; i++){
            instructionsObject.frequencies[i+1] = {};

            for(let prop in instructionsObject.frequencies[i]){
                particleToInject = instructionsObject.dictionary[prop];
                let pairOne = prop[0]+particleToInject;
                let pairTwo = particleToInject+prop[1]
                let pairsArr = [];
                pairsArr.push(pairOne, pairTwo);
                pairsArr.forEach(element => {
                    if(instructionsObject.frequencies[i+1][element]){
                        instructionsObject.frequencies[i+1][element]+=instructionsObject.frequencies[i][prop];
                    }else{
                        instructionsObject.frequencies[i+1][element]=instructionsObject.frequencies[i][prop];
                    }
                });
            }
        }

        // For last iteration calculate occurence of each particle
        instructionsObject.result = {};
        for(let prop in instructionsObject.frequencies[numberOfIterations]){
            for(let i=0; i<prop.length; i++){
                if(instructionsObject.result[prop[i]]){
                    instructionsObject.result[prop[i]]+=instructionsObject.frequencies[numberOfIterations][prop];
                }else{
                    instructionsObject.result[prop[i]] = instructionsObject.frequencies[numberOfIterations][prop];
                }
            }
        }

        // Correct count of particles considering double counting
        for(let prop in  instructionsObject.result){
            instructionsObject.result[prop] = Math.round(instructionsObject.result[prop]/2);
        }

        // Find the most and least common particle, subtract, print result
        findMinMaxValue(instructionsObject.result);

    }).fail(function(error){
        console.log(error);
    })

    function prepareInstructionsObject(array){
        let instructionsObject = {};
        instructionsObject.dictionary = {};
        array.forEach(element => {  
            instructionsObject.dictionary[element[0]] = element[1];
        });
        return instructionsObject;
    }

    function getElementsFrequencies(array, instructionsObject){
        array.forEach(element => {
            if(instructionsObject[element]){
                instructionsObject[element]++;
            }else{
                instructionsObject[element]=1;
            }
        });
        return instructionsObject;
    }

    function findMinMaxValue(object){
        let arr = Object.values(object);
        let min = Math.min(...arr);
        let max = Math.max(...arr);
        let result = max - min;
        console.log(object);
        console.log(result);
    }

    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }
})
