
// Gameboard Module. Stores the board as an array, displays the array, checks for win states
// Public methods: updateBoard, clearBoard
let gameBoard = (function(){
    
    let board = [
        0, 0, 0, 
        0, 0, 0,
        0, 0, 0
    ];


    // CSS value strings
    const x = 'no-repeat center/contain url("./img/x.svg"), #e1e6fb'
    const o = 'no-repeat center/contain url("./img/o.svg"), #e1e6fb'

    function displayBoard() {
        for ([index, square] of board.entries()) {
            targetSquare = document.querySelector(`[data-square="${index + 1}"]`);
            if (square == 1) {
                targetSquare.style.background = x;
            } else if (square == 2) {
                targetSquare.style.background = o;
            } else {
                targetSquare.style.background = '';
            }
        }
    }

    function clearBoard() {
        for ([index, value] of board.entries()) {
            board[index] = 0;
        }
        displayBoard();
        updateClickableSquares();
    }

    function updateClickableSquares() {
        availableMoves = [];
        for ([index, square] of board.entries()) {
            targetSquare = document.querySelector(`[data-square="${index + 1}"]`);
            if (square !== 0) {
                targetSquare.style.pointerEvents = 'none';
            } else {
                targetSquare.style.pointerEvents = 'initial';
            }
        }
    }

    function updateBoard(mark, position) {
        board[position - 1] = mark;
        displayBoard();
        updateClickableSquares();
        checkForGameEnd();
    }

    function checkForGameEnd() {
        winString = checkWin();
        tie = checkTie();
        if (winString) {
            game.endGame(winString);
        } else if (tie) {
            game.endGame('tie');
        }
    }
        
    function checkWin() {
        // row wins
        for (let i = 0; i < 9; i += 3) {
            if (board[i] !== 0 &&
                board[i] == board[i + 1] &&
                board[i] == board[i + 2]) {
                return winString = `[${i + 1}, ${i + 3}]`;
            }
        }
        // column wins
        for (let i = 0; i < 3; i++) {
            if (board[i] !== 0 &&
                board[i] == board[i + 3] && 
                board[i] == board[i + 6]) {
                return winString = `[${i + 1}, ${i + 7}]`;
            }
        }

        // diagonal wins
        if (board[0] !== 0 &&
            board[0] == board[4] &&
            board[0] == board[8]) {
                return winString = '[1, 9]';
        }

        if (board[2] !== 0 &&
            board[2] == board[4] &&
            board[2] == board[6]) {
                return winString = '[3, 7]';
        }

        return false;
    }

    function checkTie() {
        if (board.includes(0)) {
            return false
        }
        return true
    }
    
    return {
        updateBoard,
        clearBoard,
        board, // wasn't planning to expose, but AI!
    }
    
})();

// Game module. Event listeners for board, currentPlayer control, updating hover preview according to current player.
// Public methods: addEventListeners, endGame
let game = (function() {
    
    let AIPlayer = true;
    let currentPlayer = 1;
    let position; // For win check that works with AI

    let hoverTiles = document.querySelectorAll('main div');
    let resetButton = document.querySelector('button');
    let root = document.querySelector(':root');
    let winLine = document.querySelector('.win-line');
    let resultsCard = document.querySelector('.result-card')
    let board = document.querySelector('main');

    function addEventListeners() {
        for (tile of hoverTiles) {
            tile.addEventListener('click', placeMark);
        }
        resetButton.addEventListener('click', () => {
            gameBoard.clearBoard();
            if (currentPlayer == 2) {
                changePlayer();
            }
            hideWinLine();
            hideResults();
        });
    }

    function changePlayer() {
        if (currentPlayer == 1) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
        }
        root.classList.toggle('player2');
    }

    function placeMark() {
        
        if (AIPlayer) {
            gameBoard.updateBoard(1, this.dataset.square);
            AI.randomMove();

            return;
        }

        // Two player implementation
        if (currentPlayer == 1) {
            gameBoard.updateBoard(1, this.dataset.square);
        } else if (currentPlayer == 2) {
            gameBoard.updateBoard(2, this.dataset.square);
        }
        changePlayer();

    }

    function showWinLine(type) {
        moveWinLine(type)
        winLine.classList.add('visible');
    }

    function moveWinLine(coordinates) { // as string '[start, end]'
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

    function hideWinLine() {
        winLine.classList.remove('visible');
    }

    function endGame(type) {
        for (tile of hoverTiles) {
            tile.style.pointerEvents = 'none';
        }

        if (type === 'tie') {
            showResults("It's a tie!");
            return
        }

        showWinLine(type);

        // This version works with AI as well (vs. checking currentPlayer)
        position = type.slice(1, 2);
        playerAtWinPosition = gameBoard.board[position - 1];

        if (playerAtWinPosition == 1) {
            winner = player1.returnName();
        } else {
            winner = player2.returnName();
        }

        showResults(`${winner} wins!`);
    }

    function showResults(message) {
        resultsCard.textContent = message;
        resultsCard.classList.add("bring-front");
        board.classList.add("blur");
        winLine.classList.add("blur");
    }

    function hideResults() {
        resultsCard.classList.remove("bring-front");
        board.classList.remove("blur");
        winLine.classList.remove("blur");
    }

    function toggleAIPlayer() {
        if (AIPlayer == false) {
            AIPlayer = true;
        } else {
            AIPlayer = false;
        }

        // This necessary for the name module to call this this
        this.AIPlayer = AIPlayer;
        resetButton.click();
    }

    return {
        addEventListeners,
        endGame,
        AIPlayer,
        toggleAIPlayer,
    }
})();


// The players objects

// Not so sure why I would use these
// Currently they only store and display their names.
// But I need to practice making a factory function, so...

function createPlayer(playerNumber) {

    let playerSpans = document.querySelectorAll('span');
    let playerSpan = playerSpans[playerNumber - 1];
    let playerName;

    playerSpan.addEventListener('blur', updateName);
    
    // This part was very strange. Please take another look. It was not updating without the this
    function updateName() {
        playerName = playerSpan.textContent;
        this.playerName = playerName;
    }

    function returnName() {
        if (game.AIPlayer) {
            // Currently loads as Human vs. Computer
            playerName = playerSpan.textContent;
        } else {
            // Defaults to Player 1, Player 2 if not changed
            playerName = '';
        }

        if (playerName) {
            return playerName;
        } else {
            return `Player ${playerNumber}`;
        } 
    }

    return {
        returnName
    }
}


let AI = (function() {

    let currentBoard;
    let allowedMoves;

    function randomMove() {
        currentBoard = [];
        currentBoard = gameBoard.board;
        allowedMoves = [];
        for ([index, square] of currentBoard.entries()) {
            if (square === 0) {
                allowedMoves.push(index);
            }
        }
        moveIndex = Math.floor(Math.random() * allowedMoves.length);
        move = allowedMoves[moveIndex];
        gameBoard.updateBoard(2, (move + 1))

        // +1 due to awkward discrepancy between array numbering (from zero) and square numbering (from 1)... sorry
    }

    return {
        randomMove,
    }

})();


let player1 = createPlayer(1);
let player2 = createPlayer(2);

game.addEventListeners();