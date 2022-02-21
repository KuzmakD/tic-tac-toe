const statusDisplay = document.querySelector('.game-status');
const score = {
   ties: 0,
   X_player: 0,
   O_player: 0
};
let countTurn = 1;
let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningMessage = () => `${currentPlayer} won in ${countTurn} steps!`;
const drawMessage = () => `FINISH!  TIE!`;
const currentPlayerTurn = () => `${currentPlayer} step`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]  ];

function handleCellPlayed (clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    countTurn ++;
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') continue;
        
        if (a === b && b === c) { roundWon = true; break }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        (currentPlayer === "X") ? score.X_player ++ : score.O_player ++;
        document.getElementById("X_score").innerHTML = score.X_player;
        document.getElementById("tie_score").innerHTML = score.ties;
        document.getElementById("O_score").innerHTML = score.O_player;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        score.ties ++;
        document.getElementById("tie_score").innerHTML = score.ties;
        gameActive = false;
        return;
    }
    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
   const clickedCell = clickedCellEvent.target;
   const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

   if (gameState[clickedCellIndex] !== "" || !gameActive) return;

   handleCellPlayed(clickedCell, clickedCellIndex);
   handleResultValidation();
}

function handleRestartGame() {
   gameActive = true;
   currentPlayer = "X";
   countTurn = 1;
   gameState = ["", "", "", "", "", "", "", "", ""];
   statusDisplay.innerHTML = currentPlayerTurn();
   document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));

document.querySelector('.btn-game-restart').addEventListener('click', handleRestartGame);


function setLocalStorage() {
   localStorage.setItem("X_score", score.X_player );
   localStorage.setItem("tie_score", score.ties );
   localStorage.setItem("O_score", score.O_player );
 }
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
    score.X_player = (localStorage.getItem("X_score")) ? localStorage.getItem("X_score") : 0;
   // score.X_player = 0;
    score.ties = (localStorage.getItem("tie_score")) ? localStorage.getItem("tie_score") : 0;
    score.O_player = (localStorage.getItem("O_score") != 0) ? localStorage.getItem("O_score") : 0;
    document.getElementById("X_score").innerHTML = score.X_player;
    document.getElementById("tie_score").innerHTML = score.ties;
    document.getElementById("O_score").innerHTML = score.O_player;
}
window.addEventListener("load", getLocalStorage);