// ~~~~~ PROJECT: GUESS THE NUMBER ~~~~~
const readline = require('readline');
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
function humanGuess(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}
// determines range
let range;
if (!process.argv[2]){
    range = 100;
} else {
    range = +process.argv[2];
};
function pickRandomNumber () {
    let number = Math.ceil(Math.random()*range);
    return number;
};
function guessedRight(number) {
    if(parseInt(number) === secretNumber){
        return true;
    }
};
function hintHigherOrLower(guess) {
    if(parseInt(guess) > secretNumber){
        console.log(`Not correct. Try again. Hint: my number is lower than ${guess}`);
    } else if(guess < secretNumber){
        console.log(`Not correct. Try again. Hint: my number is higher than ${guess}`);
    } else {
        console.log("Please enter a number");
        count--;
    }
};
// ~~~~~ START GAME HERE ~~~~~
let count = 0;
secretNumber = pickRandomNumber();
console.log(`I have picked a number between 1 and ${range}. Try to guess it if you can!`);
console.log(secretNumber);
start();

async function start() {
   let guess = await humanGuess("Guess a number: ");
   count++;
   if (guessedRight(guess)){
       console.log(`You're a wizard! My number was indeed ${guess}. You got it in ${count} tries!`);
       process.exit();
   } else if(!guessedRight(guess)){
        hintHigherOrLower(guess);
        start();
   };
};