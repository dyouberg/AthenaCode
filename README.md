# Daniel Youberg
# Morse Code Test Problem

Morse Code Test Problem.

> Execution Instructions:

```
If you do not have NPM installed...
Download and Install NodeJS Package Manager here: https://nodejs.org/en/download/

git clone https://github.com/dyouberg/MorseCode
npm install
node app.js {ORIGINAL_STRING} {REMOVE_STRING}
```

> Sample usage:

### AB / R example
```
node app.js '* - _ - * * *' '* - *'
```

### Output
```
Original String: *-_-***
String to Remove:*-*

Initialized map:
[ { symbol: '*', occurence: 1 },
  { symbol: '-', occurence: 1 },
  { symbol: '*', occurence: 2 } ]

Paths Found:
[ '0_1_4', '0_1_5', '0_1_6', '0_3_4', '0_3_5', '0_3_6' ]

Unique Paths:
[ '_-**', '-_**' ]

Result: 2
```

### HELLO WORLD / HELP example
```
node app.js '* * * * _ * _ * - * * _ * - * * _ - - - _ _ _ * - - _ - - - _ * - * _ * - * * _ - * *' '* * * * _ * _ * - * * _ * - - *'
```
