$(function(){

	var state = ["","","","","","","","",""],	// State Board.
		game = true,							// Game running.
		player = false,							// This makes it easier. Who's playing.
		computer = true,
		playerCount = 0,						// Keep the track of the scoreboard.
		computerCount = 0,
		playerVal, computerVal,					// It will be "X" or "O".
		winBoard = [
					[0,1,2],
					[3,4,5],
					[6,7,8],
					[0,3,6],
					[1,4,7],
					[2,5,8],
					[0,4,8],
					[2,4,6]
					];							// Different options to win the game.
		// Player choose:
		$("#X").click(function(){
			playerVal="X";
			computerVal = "O";
			$("#intro, #chosen").hide();
			$("#board, #score").show();
		});

		$("#O").click(function(){
			playerVal="O";
			computerVal = "X";
			$("#intro, #chosen").hide();
			$("#board, #score").show();
		});
		// Reset button
		$("#reset").click(function() {
			reset();
			$("#board, #score").hide();
			$("#intro, #chosen").show();
			playerCount=0;
			$("span").eq(0).text(playerCount);
			computerCount=0;
			$("span").eq(1).text(computerCount);
		});
		// Reset function, especially when the player keep trying.
		function reset(){
			$("#board").children().html("");
			state = ["","","","","","","","",""];
			game = true;
		}
		// When the player tick.
		$(".tic").click(function(){
			var index = $(this).index();
			// Just available if it's empty. Also ask the computer to play.
			if($(this).html()===""){
				set(index, player);
				callComputer();
			}
		});
		// Set function:
		// Update values both in the state board and the display board.
		// Outputs for the winner or for a draw.
		function set(index, playing){
			if(playing === player){
				// $(...)[index]      	gives you the DOM element at index.
				// $(...).get(index)   	gives you the DOM element at index.
				// $(...).eq(index)   	gives you the jQuery object of element at index.
				$(".tic").eq(index).html(playerVal);
				$(".tic").eq(index).css("color","#34a853");
				state[index] = playerVal;
			} else{
				$(".tic").eq(index).html(computerVal);
				// **Trying to delay the game but a misbehavior detected**.
				// $(".tic").eq(index).delay(900).queue(function(n) {
				//     $(this).html(computerVal);
				//     n();
				// });
				$(".tic").eq(index).css("color","#fbbc05");
				state[index] = computerVal;
			}
			// Results depending on who wins.
			if(checkWin(state, playing)){
				if(playing === player){
					alert("Congrats!! You won!");
					playerCount+=1
					$("span").eq(0).text(playerCount);
				} else{
					alert("Ops, you lost");
					computerCount+=1
					$("span").eq(1).text(computerCount);
				}
				game = false;
				reset();
			// When the board is full and nobody wins. 
			} else if(checkFull(state)){
				alert("It was a draw");
				game = false;
				reset();
			}
			// console.log(state); //In case you want to know the state board every turn.
		}
		// CheckWin Function: Who wins?
		function checkWin(board, playing){
			// If the player wins, we get the value of the player (X or O).
			var value = playing === player ? playerVal : computerVal;
			// 8 different ways of winning.
			for (var i=0; i<8; i++){
				// Each line we assume it's true.
				var win = true;
				// 3 in a row. i, the number way of winning we're on; j, the value we're testing.
				for (var j=0; j<3; j++){
					if(board[winBoard[i][j]] != value ){
						win = false;
						// Break the loop if it's already false.
						break;
					}
				}
				//  If the loop went through, we got a winner.
				if(win){
					return true;
				}
			}
			// If not, nobody wins.
			return false;
		}
		// Function for the draw - board is full.
		function checkFull(board){
			for (var i=0; i<9; i++){
				// If any tile is empty means the board is not full. So return false.
				if(board[i] === ""){
					return false;
				}
			}
			// Otherwise returns true.
			return true;
		}
		// Function for the computer (its turn!).
		function callComputer(){
			// Pass the state of the board, the depth, and of course, the computer.
			computerTurn(state, 0, computer);
		}
		// Function for the Negamax algorithm. https://en.wikipedia.org/wiki/Negamax.
		// It's a variant form of minimax search that relies on the zero-sum property of a two-player game.
		// A function instead of 2, passing the player into it.
		function computerTurn(board, depth, playing){
			// If there is a win.
			if(checkWin(board, !playing)){
				// 10 is the value of the board.
				return -10+depth;
			}
			// No values in the board because nobody won.
			if(checkFull(board)){
				// Value 0 when there is a draw.
				return 0;
			}
			var value = playing === player ? playerVal : computerVal, 	// Same value than before.
				max = -Infinity,										// Track the biggest possible move.
				index = 0;												// Index to start with.
			// Checking all the possible solutions, so 9 times for the loop.
			for(var i=0; i<9; i++){
				// Checking for those empty tiles.
				if(board[i] === ""){
					// Create a new board using slice function for a copy of it.
					var newBoard = board.slice();
					// If we can place that, we're gonna set it to the value whoever is playing.
					newBoard[i] = value;
					// The computer is gonna call itself (!playing). It started with depth=0. So we add 1.
					var moveVal = -computerTurn(newBoard, depth+1, !playing);
					// If this recursion is bigger than the max, we update the maximum value and index.
					if(moveVal>max){
						max = moveVal;
						index = i;
					}
				}
			}
			// Every time the computer is called (depth is set to 0 in the callComputer function).
			if(depth === 0){
				set(index, computer);
			}
			// Max updated every time because of the loop just before.
			return max;
		}

});


// A bit longer explanation for the Minimax/Negamax

/* 
It checks every single solution for a game to go. So you can place in the first tile, 2nd, ...
Maybe not in the 3rd tile because it's already taken.
Every time you check one tile that is empty it will make a temporary board, and it will set that
value to whoever is playing that move, and then recursively go to there.
After the 9 tiles has been checked, it will go to the end and if the computer loses, it will be a
high value for opposite playing. That's why the minus sign for the recursion (-computerTurn).
[If it's a big value for the player, it's a small and negative value for the computer].
Once it's at the end, it will check what's the best move that a player could make in the end state.
It's probably the one that gets to win, that means a turn back, and this will take the most optimal route.
This makes the game unbeatable.
*/