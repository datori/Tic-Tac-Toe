$(document).ready(function(){
	app_render.render_choice();
});

const app_render = {
	render_choice: function(){
		var app_render = this;
		$("#app").html(`
			<section id="choice-wrapper">
				<a class="symbol">X</a>
				<a class="symbol">O</a>
			</section>
		`);

		$(".symbol").click(function(){
			app_render.render_game();
			game.start($(this).text());
		});
	},
	render_game: function(){
		$("#app").html(`
			<section id="board-wrapper">
				<div class="cell" id="cell0"></div>
				<div class="cell" id="cell1"></div>
				<div class="cell" id="cell2"></div>
				<div class="cell" id="cell3"></div>
				<div class="cell" id="cell4"></div>
				<div class="cell" id="cell5"></div>
				<div class="cell" id="cell6"></div>
				<div class="cell" id="cell7"></div>
				<div class="cell" id="cell8"></div>
			</section>
		`);
	},
	render_result: function(winner){
		var win_statement;
		switch(winner){
			case "X":
				win_statement = "The winner is X";
				break;
			case "O":
				win_statement = "The winner is O";
				break;
			case "Tie":
				win_statement = "It's a tie!";
		}
		
		$("#app").html(`
			<section id="result_wrapper">
				<h1 id="result">${win_statement}</h1>
				<a id="reset">Reset</a>
			</section>
		`);

		$("#reset").click(function(){
			app_render.render_choice();
		});
	}
}

const game = {
	player: "",
	AI: "",
	winner: "",
	board: ["","","","","","","","",""],
	start: function(symbol){
		// Handle initial startup logic.
		this.handlers();
		this.player= symbol;
		switch(this.player){
			case "X":
				this.AI = "O";
				break;
			case "O":
				this.AI = "X";
		};
	},
	handlers: function(){
		// Event handlers to drive the logic.
		var game = this;
		$(".cell").click(function(){
			// Pass cell number to validation function.
			var cell = $(this).attr("id").match(/\d/)[0];
			if (game.moveValidate(cell) && game.gameState()){
				game.board[cell] = game.player;
				game.renderBoard();

				if (game.gameState()){
					game.AIMove();
				}
			}

		});
	},
	AIMove: function(){
		// Generate array of empty cells (possible moves).
		// map() to return the index instead of the item itself.
		// filter() to remove the undefined values, since map() will return undefined for filled cells.
		var moves = this.board.map(function(item, index){
			if (item == ""){
				return index;
			}
		}).filter(function(cell){
			if (cell){
				return cell;
			}
		});
		// Select cell to choose.
		this.board[moves[Math.floor(Math.random() * moves.length)]] = this.AI;
		this.renderBoard();

	},
	moveValidate: function(cell){
		// Check if cell is already taken.
		if (this.board[cell] == ""){
			return true;
		}
		else{
			return false;
		}
	},
	gameState: function(){
		// Test if either player has 3 in a row OR if the board is full.
		var game_Going = true;
		var board = this.board;
		// Either player has a win state.
		if (checkLanes("X")){
			game_Going = false;
			this.winner = "X";
		}
		if (checkLanes("O")){
			game_Going = false;
			this.winner = "O";
		}
		// Board is full
		if (board.indexOf("") == -1){
			game_Going = false;
			this.winner = "Tie";
		}
		// Return game state.
		return game_Going;

		function checkLanes(Player){
			var win = false;
			// Horizontal, Vertical, Diagonal.
			var lanes = [
				[0,1,2],[3,4,5],[6,7,8],
				[0,3,6],[1,4,7],[2,5,8],
				[0,4,8],[6,4,2]
			];

			lanes.forEach((lane) => {
				if (board[lane[0]] == Player && board[lane[1]] == Player && board[lane[2]] == Player){
					win = true;
				}
			});

			return win;
		}	
	},
	renderBoard: function(){
		board_DOM = [$("#cell0"),$("#cell1"),$("#cell2"),$("#cell3"),$("#cell4"),$("#cell5"),$("#cell6"),$("#cell7"),$("#cell8")];
		// Update board_DOM with contents of board.
		for (var i=0; i<9; i++){
			board_DOM[i].text(this.board[i]);
		}
		if (!this.gameState()){
			app_render.render_result(this.winner);
			this.resetGame();
		}
	},
	resetGame: function(){
		this.player = "";
		this.AI = "";
		this.winner = "";
		this.board = ["","","","","","","","",""];
	}
}
