var hangmanGame = {
	livesLeft: 10,
	lifeLimit: 10,
	currentWord: 'default',
	guessStatus: [],
	guessed: [],
	playedWords: [],
	validChar: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
	gameStatus: false,
	message: 'Type a letter to play it.',
	hangmanSize: 50,
	hangmanSizeDefault: 50,
	growthRate: 18,
	scoreboard: {
		wins:0,
		losses:0,
		resets:0
	},

	// function creates the current guess status display text i.e. 'ex__mple'
	buildGuessStatus: function (input){
		var curStat = this.guessStatus;
		for(var i = 0; i < this.currentWord.length; i++){
			if(this.currentWord[i] === input){
				curStat[i] = input;
			}
		}
		return curStat
	},

	//When user resets game it calls this function which resets values and selects new word
	reset: function (){
		this.playedWords.push(this.currentWord);
		this.livesLeft = this.lifeLimit;
		this.currentWord = this.getNewWord(wordLib,this.playedWords);
		this.guessed = [];
		this.gameStatus = true;
		this.message = 'Type a letter to play it.'
		this.hangmanSize = this.hangmanSizeDefault
		this.clearBoard();
		this.renderGameState();
		console.log('Game was reset' + Date())
	},

	// Function will randomly select a word from the word library and return it excluding played words
	getNewWord: function (wordLibrary, played){
		var rdmWord = wordLibrary[Math.floor((Math.random() * wordLibrary.length))];
		if(played.indexOf(rdmWord) > -1){
			this.getNewWord(wordLib, this.playedWords);
		}
		return rdmWord;
	},

	// Main gameplay function called when user enters input
	play: function(input){

		// If the game is over or not active then message the game must be reset 
		if(this.gameStatus === false){
			this.message = 'Must Reset the Game.'
			this.renderGameState();
		} else if(this.validChar.indexOf(input) > -1 && this.guessed.indexOf(input) === -1 && this.gameStatus === true){
			//If the input is valid (lowercase letter) and hasn't been guessed and te game is active proceed with gameplay
			this.guessed.push(input);

			//check if the guessed letter is in the current word
			if (this.currentWord.indexOf(input) > -1){
				this.guessStatus = this.buildGuessStatus(input);
				
				//check if the user won the game on this guess and execute end of game calls
				if(this.checkWin()){
					this.scoreboard.wins++
					this.gameStatus = false
					this.message = 'You won the game! The world has cooled off and shrunk to normal size.'
				} 

				this.renderGameState();

			} else {
				//Wrong guess - grows size of the world, lowers life
				this.growHangman()
				this.livesLeft--;

				//When life is 0 then end the game with a loss
				if(this.livesLeft === 0){
					this.scoreboard.losses++
					this.gameStatus = false
					this.message = 'Sorry, you lost and the world exploded!'
				} 

				this.renderGameState();
			}
			
		}

	},
	
	// This function renders game info to the DOM
	renderGameState: function () {
		document.getElementById('currentwordstatus').innerHTML = this.guessStatus.join(' ');
		document.getElementById('pastguesses').innerHTML = this.guessed.join(',');
		document.getElementById('livesleft').innerHTML = this.livesLeft;
		document.getElementById('msg').innerHTML = this.message;
		document.getElementById('wincount').innerHTML = this.scoreboard.wins;
		document.getElementById('losscount').innerHTML = this.scoreboard.losses;
		document.getElementById('resetcount').innerHTML = this.scoreboard.resets;
		document.getElementById('world').style.fontSize = this.hangmanSize + 'px';
	},

	// This function will put blank space for each letter in the current word being guessed
	clearBoard: function() {
		this.guessStatus = []
		for(var i = 0; i < this.currentWord.length; i++){
			this.guessStatus.push(" ___ ");
		};
	},

	//checks if the state of the game is won or not
	checkWin: function() {
		if(this.currentWord === this.guessStatus.join('')){
			return true
		}
		return false
	},

	//Increases the globe size by defined growth rate
	growHangman: function (){
		this.hangmanSize += this.growthRate;
	}
}

//Initialize the word libary and user input variables
var wordLib = ['excited', 'happy', 'sad', 'confused', 'tired'];
var userInput = '';

//Listens for users input and passes to the game object for handling
document.addEventListener('keydown', function(){
	userInput = event.key.toLowerCase();
	hangmanGame.play(userInput);
});

//Listens for the user to reset the game
document.getElementById("reset").addEventListener("click", function(){
	hangmanGame.reset()
});

// Prints various values to console for debug
/*function gameLog() {
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



