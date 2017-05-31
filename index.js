$(document).ready(function(){
	game.start();
});
	
const game = {
	player: "",
	AI: "",
	winner: "",
	board: ["","","","","","","","",""],
	board_DOM: [$("#cell0"),$("#cell1"),$("#cell2"),$("#cell3"),$("#cell4"),$("#cell5"),$("#cell6"),$("#cell7"),$("#cell8")],
	start: function(){
		// Handle initial startup logic.
		this.handlers();
		this.player = prompt("X or O?");
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
				game.AIMove();
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
		// Update board_DOM with contents of board.
		for (var i=0; i<9; i++){
			this.board_DOM[i].text(this.board[i]);
		}
		if (!this.gameState()){
			alert(this.winner);
		}
	}
}
