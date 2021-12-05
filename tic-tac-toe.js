



/* "Build the functions that allow players to add marks to 
specific spot on the board (function: allowed marks), letting
players click on the gameboard to place their marker. Don't
forget the logic that keeps players from playing in spots already
taken"

- "Each piece of functionality should fit in the game, player,
or gameboard objects"

- "build logic that checks for when the game is over. Should check
for 3-in-a-row and a tie"
- Clean up interface to allow players to put in their names
- Include a button to start/restart
- Add a display element that congratulates the winning player

AI instructions
- Start by getting the computer to make a random legal move
- You can make an unbeatable AI using minimax

*/

// Gameboard module

// The Gameboard module will have rules for adjusting the array
// For rendering the current array onto the page
// For making sure that the preview corresponds to the player whose choice it is (X or 0)

let gameBoard = (function(){
    
    let board = [
        0, 0, 0, 
        0, 0, 0,
        0, 0, 0];
    
    function printBoard() { // just for testing
        console.log(board);
    }

    function updateBoard(mark, position) {
        board[position-1] = mark;
    }

    function displayBoard() {
        for ([index, square] of board.entries()) {
            targetSquare = document.querySelector(`main div:nth-child(${index + 1})`);
            if (square == 1) {
                targetSquare.style.background = 
                    'no-repeat center/contain url("./img/x.svg"), #e1e6fb';
            } else if (square == 2) {
                targetSquare.style.background = 
                    'no-repeat center/contain url("./img/o.svg"), #e1e6fb';
            }
        }
    }
    
    return {
        printBoard,
        updateBoard,
        displayBoard,
    }
    
})();


// Game
// Should check for the win state
// Should display the correct win line
// Should give the win message

// I think I'll put the functionality for deciding who can play where
// And which mark gets updated with each click here as well?

// A little less than ideal because both gameBoard and game would end up with
// a representation of the board... and should't the event listeners for the
// board go into the gameBoard object? Something to think about...


// The players objects???
// Honestly I don't know yet why I would use these. But I 
// need to practice making a factory function, so...

function createPlayer(name) {
    
    let score = 0;

    function incrementScore() {
        score++;
    }

    function printScore() {
        console.log(`${name} has ${score} points`)
    }

    return {
        incrementScore,
        printScore,
    }
}

human = createPlayer('Human');
computer = createPlayer('Computer');



// Just for testing CSS
grid = document.querySelector('main');
grid.addEventListener('click', showHideWinLine);


// This will go into the game object later
winLine = document.querySelector('.win-line');
function showHideWinLine() {
    winLine.classList.toggle('visible');
}
moveWinLine('[1, 9]');
function moveWinLine(coordinates) {
    switch (coordinates) {
        case '[1, 9]': // diagonal
            lineTransform = 'rotate(45deg) translate(-148px, -148px)';
            break;
        case '[4, 6]': // middle row
            lineTransform = 'translateY(-210px)';
            break;
        case '[1, 3]': // top row
            lineTransform = 'translateY(-315px)';
            break;
        case '[7, 9]': // bottom row
            lineTransform = 'translateY(-105px)';
            break;
        case '[3, 7]': // diagonal
            lineTransform = 'rotate(135deg) translate(-148px, 148px)';
            break;
        case '[1, 7]': // first column
            lineTransform = 'translate(-105px, -205px) rotate(90deg)';
            break;
        case '[2, 8]': // second column
            lineTransform = 'translate(0, -205px) rotate(90deg)';
            break;
        case '[3, 9]': // third column
            /* X and Y transform switch if you rotate first*/
            lineTransform = 'rotate(90deg) translate(-205px, -105px)';
            break;
    }
    winLine.style.transform = `${lineTransform}`;

}