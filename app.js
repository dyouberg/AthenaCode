
/**
 * @author dyouberg
 * Sample usage:
 *
 * AB / R example
 * # node app.js '* - _ - * * *' '* *'
 *
 * HELLO WORLD / HELP example
 * # node app.js '* * * * _ * _ * - * * _ * - * * _ - - - _ _ _ * - - _ - - - _ * - * _ * - * * _ - * *' '* * * * _ * _ * - * * _ * - - *'
 */

// STEP 1: Process the input, remove the empty spaces between characters
var originalString = process.argv[2].replace(/ /g,'');
var removeString = process.argv[3].replace(/ /g,'');

// Initialize our result arrays
var pathsFoundArray = [];
var uniquePathsArray = [];

// Now we want to create a map for the occurence and the symbol
/*
    [
        { symbol: *, occurence: 1 },
        { symbol: -, occurence: 1 },
        { symbol: *, occurence: 2 }
    ]
*/

// STEP 2: Initialize the data map
var initialMap = [];
var map = [];
initializeMap();

// STEP 3: Calculate the paths

// Keep track of the last result for getPosition
// this needs to be initialized to a negative number with each iteration
var lastResult = -1000000;

calculatePaths();

console.log('Original String: '+originalString);
console.log('String to Remove:' +removeString);

console.log('\nInitialized map:');
console.log(initialMap);

console.log('\nPaths Found: ');
console.log(pathsFoundArray);

// STEP 4: Get all unique values with the paths removed
getAllUniquePaths();

console.log('\nUnique Paths: ');
console.log(uniquePathsArray);
console.log('\nResult: '+uniquePathsArray.length);
/*****************************************************************************
 * PROGRAM FUNCTIONS
 *****************************************************************************/
function initializeMap() {
    var numStars = 0;
    var numHyphens = 0;
    var numUnderscores = 0;

    for (var i in removeString) {
        var symbol = removeString[i];

        var occurence;
        if (symbol === '*') {
            numStars++;
            occurence = numStars;
        } else if (symbol === '-') {
            numHyphens++;
            occurence = numHyphens;
        } else if (symbol === '_') {
            numUnderscores++;
            occurence = numUnderscores;
        }

        initialMap[i] = { "symbol": symbol, "occurence": occurence };
    }
}

function calculatePaths() {
    var removeStringLength = initialMap.length - 1;
    for (var currentIndex = removeStringLength; currentIndex >= 0; currentIndex--) {

        map = JSON.parse(JSON.stringify(initialMap));
        for (var iteratorIndex = removeStringLength; iteratorIndex >= currentIndex; iteratorIndex--) {
            if (iteratorIndex !== currentIndex) {
                map[currentIndex].occurence++;
            }
            var foundVal = getValues(map);

            while(foundVal.indexOf('-1') === -1) {
                if (pathsFoundArray.indexOf(foundVal) === -1) {
                    pathsFoundArray.push(foundVal);
                }

                map[iteratorIndex].occurence++;
                foundVal = getValues(map);
            }
        }

        if (currentIndex === 0) {
            map = JSON.parse(JSON.stringify(initialMap));
            var goAgain = true;
            map[currentIndex].occurence++;

            // NOTE: This is the section I have been fooling around with most
            // The program seems to end prematurely when running the hello world example
            //
            // The last path I am getting is:
            // 2_3_5_7_11_12_16_23_24_31_33_34_35_36_40_42
            //
            // The last path should be:
            // 5_7_9_10_11_15_22_23_29_31_33_34_35_36_40_42

            // If we find a new path, increment the occurence index to try to discover new paths
            while(goAgain) {
                goAgain = false;
                for (var iteratorIndex = removeStringLength; iteratorIndex >= currentIndex; iteratorIndex--) {
                    // console.log(iteratorIndex, currentIndex);
                    //if (iteratorIndex !== currentIndex) {
                        map[currentIndex].occurence++;
                    //}
                    var foundVal = getValues(map);

                    while(foundVal.indexOf('-1') === -1) {
                        if (pathsFoundArray.indexOf(foundVal) === -1) {
                            pathsFoundArray.push(foundVal);
                            goAgain = true;
                        }

                        map[iteratorIndex].occurence++;
                        foundVal = getValues(map);
                    }
                }
            }
        }
    }
}

function getAllUniquePaths() {
    for (var i in pathsFoundArray) {
        var xValue = pathsFoundArray[i].split('_');
        var originalStringCopy = originalString;

        // for each xValue... we want to remove that element from the originalString
        // do this backwards
        for (var i = xValue.length - 1; i >= 0; i--) {
            // Base 10 to preserve trailing zeroes
            var indexValue = parseInt(xValue[i], 10);
            originalStringCopy = removeAt(originalStringCopy, indexValue);
        }

        if (uniquePathsArray.indexOf(originalStringCopy) === -1) {
            uniquePathsArray.push(originalStringCopy);
        }
    }
}
/*****************************************************************************
 * UTILITY FUNCTIONS
 *****************************************************************************/
 /**
  * getValues - Use the map with occurence values to retrieve the next matching
  *  pattern in the original string
  * @param map The map with which to search for values matching our pattern
  * @return returnValue A sequence matching out pattern which can be added to
  *  the array if it is a new unique value.  i.e. '0_1_4'
  */
 function getValues(map) {
     var returnValue = '';
     lastResult = -1000000;

     map.forEach(function(val, i) {
         // Use _ as a delimiter for position since it can be greater than 0-9
         returnValue += getPosition(originalString, val.symbol, val.occurence, i) + '_';
     });

    // Remove last '_' for formatting
    return returnValue.substr(0, returnValue.length - 1);
 }

/**
 * getPosition - Retrieve the nth (occurence) position of the symbol in the string
 * @param  originalString The string through which to search through
 * @param  symbol The symbol we are looking for, *, -, or _
 * @param  occurence The nth occurence of the symbol to find
 * @param  index The current index of the map, used in some pattern checking
 * @return The position of the string with the index we are looking for, or return -1
 *   if it doesn't exist
 */
function getPosition(originalString, symbol, occurence, index) {
    // http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
    // I started with this idea in mind, then had to take special cases into account
    var occ = occurence;
    var result = originalString.split(symbol, occ).join(symbol).length;

    if (result >= originalString.length) {
        return '-1';
    }

    // If we returned a value less than the previous one, get the next occurrence
    // This can occur due to certain symbol patterns
    while (result <= lastResult) {
        map[index].occurence++;
        occ = map[index].occurence;
        return getPosition(originalString, symbol, occ, index);
    }

    lastResult = result;
    return result;
}

/**
 * removeAt - Helper function to remove an element from a string
 * @param  string The string in which to splice
 * @param  index The element index to remove
 * @return The string, no longer containing the value at index
 */
function removeAt(string, index) {
    return string.substr(0, index) + string.substr(index+1, string.length);
}
