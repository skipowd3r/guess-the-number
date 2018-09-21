// ~~~~~ PROJECT: GUESS THE NUMBER ~~~~~
const readline = require('readline');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// ~~~~~ VARIABLE DECLARATIONS ~~~~~
// declare maximum range, default range is 1-100
let maxNumber;
if (!process.argv[2]){
    maxNumber = 100;
} else {
    maxNumber = +process.argv[2];
}
// declare variables for highest and lowest available guesses and guess count
let lowest = 1;
let highest = maxNumber;
let count = 0;

// ~~~~~ FUNCTION DECLARATIONS ~~~~~
// narrow window of available numbers to guess, returns next guess
function findNextGuess(lowNum, highNum) {
    let nextGuess = lowNum + Math.floor((highNum-lowNum)/2);
    return nextGuess;
};
// manipulates (narrows) range of possible guesses 
// detects if range is one number, and if range is negative, detects cheaters!
async function narrow(lastGuess, answerHL){
    if(answerHL[0].toUpperCase() === "H"){
        lowest = lastGuess + 1;
    } else if(answerHL[0].toUpperCase() === "L"){
        highest = lastGuess - 1;
    } else { 
        secondAttemptHL = await ask("Try again. Is it higher (H) or lower (L) than " + lastGuess + "? ");
        narrow(lastGuess, secondAttemptHL);
    }
    if (onlyOneOption()){
        console.log("Aha!");
        gotItRight(lowest);
    }
    if(highest-lowest <= 0){
        cheatDetector(answerHL, highest);
    }
    start();
};
// determines if computer input is acceptable
// only for H or L question for now
function isInputValid(answer) {
    if(answer[0].toUpperCase() === "H" || "L"){
        return true;
    }
};
// function for the grammar nazis, if first guess is miraculously right
function tryOrTries(num) {
    if(num === 1){
        word = 'try';
    } else {
        word = 'tries';
    }
    return word;
};
function cheatDetector(answerHL, highnum) {
    if(answerHL.toUpperCase().startsWith('H') === true){
        console.log(`But you said it was lower than ${highnum}, so it can't also be higher than ${highnum+1}! You cheated! I'm done playing.`);
    } else if(answerHL.toUpperCase().startsWith('L') === true){
        console.log(`But you said it was higher than ${highnum}, so it can't also be lower than ${highnum+1}! You cheated! I'm done playing.`);
    }
    process.exit();
};
function onlyOneOption() {
    return highest===lowest;
};
function gotItRight(num) {
    console.log("Your number is " + num + "!");
    let tries = tryOrTries(count);
    console.log(`I guessed it in ${ count } ${ tries}! I must be a wizard!`);
    process.exit();
};
// ~~~~~ START GAME HERE ~~~~~
console.log(`Please think of a number between 1 and ${maxNumber} (inclusive). I will try to guess it.`);
start();
// ~~~~~ LOOP FUNCTION ~~~~~
async function start() {
    // Make a guess:
    let guess = findNextGuess(lowest, highest);
    let answerYorN = await ask("Is it... " + guess + "? ")  
    count++;
    
    // If guess is right: Case Y
    if(answerYorN[0].toUpperCase() === "Y"){
        gotItRight(guess);
    } 
    // If guess is wrong: Case N
    else if(answerYorN[0].toUpperCase() === "N"){
        let answerHorL = await ask("Is it higher(H) or lower(L) than " + guess + "? ");
            if (isInputValid(answerHorL)){
                await narrow(guess, answerHorL);
            }
    // If computer input is neither Y nor N: Case X
    // give second attempt to answer the guess with Y or N
    } else {
        console.log("Try again. Answer Y or N, please. ");
        count--;
        start();
    }
};