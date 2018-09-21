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
// determines range
let maxNumber;
if (!process.argv[2]){
    maxNumber = 100;
} else {
    maxNumber = +process.argv[2];
};
async function pickGame(){
    let gameChoice = await ask("Let's play a game! Type [1] if you want to guess my number, or type [2] if you want me to guess your number: ");
    if (gameChoice == 1){
        console.log("Okay, you guess! Good luck!");
        initializeGameOne();
    } else if (gameChoice == 2) {
        console.log("Okay, I'll guess!");
        initializeGameTwo();
    } else {
        console.log("Please enter 1 or 2: ");
    }
};
async function playAgain() {
    let yesOrNo = await ask("Would you like to play again? ");
    if (firstLetterOf(yesOrNo) === "Y"){
        pickGame();
    }else if (firstLetterOf(yesOrNo) === "N"){
        console.log("Okay, thanks for playing! See you later!")
        process.exit();
    }else{
        console.log("I didn't understand. ")
        playAgain();
    }
};

pickGame();

// ~~~~~ GAME 1: USER GUESSES COMPUTER'S NUMBER ~~~~~
function initializeGameOne(){
    console.log("Game 1 initializing...");
    let count = 0;
    let secretNumber = pickRandomNumber();
    console.log(`I have picked a number between 1 and ${maxNumber}. Try to guess it if you can!`);
    //console.log(secretNumber);
    startGameOne(secretNumber, count);
};
function pickRandomNumber() {
    let number = Math.ceil(Math.random()*maxNumber);
    return number;
};
function guessedRight(guess, number) {
    if(parseInt(guess) === number){
        return true;
    }
};
function hintHigherOrLower(guess, number, count) {
    if(parseInt(guess) > number){
        console.log(`Not correct. Try again. Hint: my number is lower than ${guess}`);
    } else if(guess < number){
        console.log(`Not correct. Try again. Hint: my number is higher than ${guess}`);
    } else {
        console.log("Please enter a number");
        count--;
    }
    startGameOne(number, count);
};

// ~~~~~ START GAME 1 HERE ~~~~~
async function startGameOne(number, count) {
   let guess = await ask("Guess a number: ");
   count++;
   if (guessedRight(guess, secretNumber)){
       console.log(`You're a wizard! My number was indeed ${guess}. You got it in ${count} tries!`);
       playAgain();
   } else if(!guessedRight(guess, secretNumber)){
        hintHigherOrLower(guess, secretNumber, count);
   }
};

// ~~~~~ GAME 2: COMPUTER GUESSES USER'S NUMBER ~~~~~
function initializeGameTwo(){
    console.log("Game 2 initializing...")
    let lowest = 1;
    let highest = maxNumber;
    let count = 0;
    console.log(`Please think of a number between 1 and ${maxNumber} (inclusive). I will try to guess it.`);
    startGameTwo(lowest, highest, count);
};  
function findNextGuess(lowNum, highNum) {
    let nextGuess = lowNum + Math.floor((highNum-lowNum)/2);
    return nextGuess;
};
function firstLetterOf(word){
    let output = word[0].toUpperCase();
    return output;
};
function gotItRight(num, count) {
    console.log("Your number is " + num + "!");
    let tries = tryOrTries(count);
    console.log(`I guessed it in ${ count } ${ tries}! I must be a wizard!`);
    playAgain();
};
// manipulates (narrows) range of possible guesses 
// detects if range is one number, and if range is negative, detects cheaters!
async function narrow(lastGuess, answerHL, lowest, highest, count){
    if(firstLetterOf(answerHL) === "H"){
        lowest = lastGuess + 1;
    } else if(firstLetterOf(answerHL) === "L"){
        highest = lastGuess - 1;
    } else { 
        secondAttemptHL = await ask("Try again. Is it higher (H) or lower (L) than " + lastGuess + "? ");
        narrow(lastGuess, secondAttemptHL, lowest, highest, count);
    }
    if (onlyOneOption(lowest, highest)){
        console.log("Aha!");
        gotItRight(lowest, count);
    }
    if(highest-lowest < 0){
        cheatDetector(answerHL, highest);
    }
    startGameTwo(lowest, highest, count);
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
    if(firstLetterOf(answerHL).startsWith('H') === true){
        console.log(`But you said it was lower than ${highnum}, so it can't also be higher than ${highnum+1}! You cheated! I'm done playing.`);
    } else if(firstLetterOf(answerHL).startsWith('L') === true){
        console.log(`But you said it was higher than ${highnum}, so it can't also be lower than ${highnum+1}! You cheated! I'm done playing.`);
    }
    process.exit();
};
function onlyOneOption(lowest, highest) {
    return highest===lowest;
};

// ~~~~~ START GAME TWO:  ~~~~~
async function startGameTwo(lowest, highest, count) {
    let guess = findNextGuess(lowest, highest);
    let answerYorN = await ask("Is it... " + guess + "? ")  
    count++;
    if(firstLetterOf(answerYorN) === "Y"){
        gotItRight(guess, count);
    } 
    else if(firstLetterOf(answerYorN) === "N"){
        let answerHorL = await ask("Is it higher(H) or lower(L) than " + guess + "? ");
            if (isInputValid(answerHorL)){
                await narrow(guess, answerHorL, lowest, highest, count);
            }
    } else {
        console.log("Try again. Answer Y or N, please. ");
        count--;
        startGameTwo(lowest, highest, count);
    }
};