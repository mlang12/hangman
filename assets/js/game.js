//Initialize the word libary and user input variables
var wordLib = ['excited', 'happy', 'sad', 'confused', 'tired'];
var userInput = '';
var i = 0;

//Initialize the game object
var hangmanGame = {
	livesLeft: 10,
	lifeLimit: 10,
	currentWord: 'default',
	guessStatus: [],
	guessed: [],
	playedWords: [],
	validChar: [
		'A','B','C','D','E',
		'F','G','H','I','J',
		'K','L','M','N','O',
		'P','Q','R','S','T',
		'U','V','W','X','Y',
		'Z'],
	gameStatus: false,
	message: 'Type any letter to get started.',
	message2: '-',
	hangmanSize: 50,
	explodeSize: 0,
	explodeColor: 'yellow',
	hangmanSizeDefault: 50,
	explodeSizeDefault: 0,
	explode: false,
	growthRate: 15,
	worldVisible: 'visible',
	explodeVisible: 'hidden',
	scoreboard: {
		wins:0,
		losses:0,
	},

	// function creates the current guess status display text i.e. 'ex__mple'
	buildGuessStatus: function (input){
		var curStat = this.guessStatus;
		for(var i = 0; i < this.currentWord.length; i++){
			if(this.currentWord[i] === input){
				curStat[i] = input;
			}
		}
		return curStat;
	},

	//When user resets game it calls this function which resets values and selects new word
	reset: function (){
		this.playedWords.push(this.currentWord);
		this.livesLeft = this.lifeLimit;
		this.currentWord = this.getNewWord(wordLib,this.playedWords);
		this.guessed = [];
		this.gameStatus = true;
		this.message = 'Type any letter to get started.';
		this.message2 = '-'
		this.hangmanSize = this.hangmanSizeDefault;
		this.explodeSize = this.explodeSizeDefault;
		this.explodeVisible = 'hidden';
		this.worldVisible = 'visible';
		this.explode = false;
		this.clearBoard();
		this.renderGameState();
		console.log('Game was reset' + Date());
	},

	// Function will randomly select a word from the word library and return it excluding played words
	getNewWord: function (wordLibrary, played){
		var rdmWord = wordLibrary[Math.floor((Math.random() * wordLibrary.length))].toUpperCase();
		if(played.indexOf(rdmWord) > -1){
			this.getNewWord(wordLib, this.playedWords);
		}
		return rdmWord;
	},

	// Main gameplay function called when user enters input
	play: function(input){

		// If the game is over or not active then message the game must be reset 
		if(this.gameStatus === false){
			this.message = 'Must Reset the Game.';

		//If the input is valid (lowercase letter) and hasn't been guessed and te game is active proceed with gameplay
		} else if (this.validChar.indexOf(input) > -1 && this.guessed.indexOf(input) === -1 && this.gameStatus === true){

			//check if the guessed letter is in the current word
			if (this.currentWord.indexOf(input) > -1){
				this.guessStatus = this.buildGuessStatus(input);
				
				//check if the user won the game on this guess and execute end of game calls
				if (this.checkWin()){
					this.scoreboard.wins++;
					this.gameStatus = false;
					this.hangmanSize = this.hangmanSizeDefault
					this.message = 'You won the game! The world has cooled off and shrunk to normal size.';
					this.message2 = 'Push the \'New Game \' button to play again.'
				} 

			} else {
				//Wrong guess - grows size of the world, lowers life, and stores guess to 'guessed'
				this.guessed.push(input);
				this.growHangman();
				this.livesLeft--;

				//When life is 0 then end the game with a loss and execute end of game calls
				if (this.livesLeft === 0){
					this.scoreboard.losses++;
					this.gameStatus = false;
					this.worldVisible = 'hidden';
					this.hangmanSize = 0;
					this.explodeVisible = 'visible';
					this.message = 'Sorry, you lost and the world exploded!';
					this.message2 = 'Push the \'New Game \' button to play again.';	
					this.glow();				
				} 
			}
		}
		this.renderGameState();
	},
	
	// This function renders game info to the DOM
	renderGameState: function () {
		document.getElementById('currentwordstatus').innerHTML = this.guessStatus.join(' ');
		document.getElementById('pastguesses').innerHTML = this.guessed.join(', ');
		document.getElementById('livesleft').innerHTML = this.livesLeft;
		document.getElementById('msg').innerHTML = this.message;
		document.getElementById('msg2').innerHTML = this.message2;
		document.getElementById('wincount').innerHTML = this.scoreboard.wins;
		document.getElementById('losscount').innerHTML = this.scoreboard.losses;
		document.getElementById('world').style.visibility = this.worldVisible;
		document.getElementById('world').style.fontSize = this.hangmanSize + 'px';
		document.getElementById('explode').style.fontSize = this.explodeSize + 'px'
		document.getElementById('explode').style.visibility = this.explodeVisible;
		document.getElementById('explode').style.color = this.explodeColor;
	},

	// This function will put blank space for each letter in the current word being guessed
	clearBoard: function() {
		this.guessStatus = [];
		for(var i = 0; i < this.currentWord.length; i++){
			this.guessStatus.push(" _ ");
		};
	},

	//checks if the state of the game is won or not
	checkWin: function() {
		if(this.currentWord === this.guessStatus.join('')){
			return true;
		}
		return false;
	},

	//Increases the globe size by defined growth rate
	growHangman: function (){
		this.hangmanSize += this.growthRate;
	},

	//this function animates the explosion
	glow: function () {
		var myVar = setInterval(makeBoom.bind(this), 100);

		function makeBoom() {
			this.explodeSize += this.growthRate;
			if (this.explodeColor === 'yellow'){
				this.explodeColor = 'red';
			} else {
				this.explodeColor = 'yellow';
			};
			if(this.explodeSize > 200) {
				//this.explodeSize = this.explodeSizeDefault;
				clearInterval(myVar)
			};
			this.renderGameState();
		};
	}
}

//Loads game on page load
document.onload = hangmanGame.reset()

//Listens for users input and passes to the game object for handling
document.addEventListener('keydown', function(){
	userInput = event.key.toUpperCase();
	hangmanGame.play(userInput);
});

//Listens for the user to reset the game
document.getElementById("reset").addEventListener("click", function(){
	hangmanGame.reset();
});

// Prints various values to console for debug
/*
function gameLog() {
	console.log('*************************************')
	console.log(Date())
	console.log("Lives Left: " + hangmanGame.livesLeft);
	console.log("Word Status: " + hangmanGame.guessStatus.join(" "));
	console.log("Guessed Letters: " + hangmanGame.guessed.join(','));
	console.log("Current Word: " + hangmanGame.currentWord);
	console.log("Game Status: " + hangmanGame.gameStatus);
	console.log("Scoreboard: "+ hangmanGame.scoreboard.wins + " " + hangmanGame.scoreboard.losses);
	console.log("Earth Size: " + hangmanGame.hangmanSize);
	console.log("Guessed Words: " + hangmanGame.playedWords.join(','))
}*/



