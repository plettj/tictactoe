// Game logic and such

let board = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 1=O 2=X
let player = 1; // 1=X 0=O -1=anyone else
let turn = 1;
let gameOn = false;

// ONLY gets called once both players are active.
function startGame() {
    gameOn = true;
    DOM.modal.style.display = "none";
    db.board.set([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    if (player == 1) {
        DOM.message.innerHTML = "Your turn!";
        DOM.info1.innerHTML = "<br><br><br><br><br><br><br><br><br>Player:<br><strong>X</strong>";
    } else if (player == 0) {
        DOM.message.innerHTML = "Waiting for your opponent...";
        DOM.info1.innerHTML = "<br><br><br><br><br><br><br><br><br>Player:<br><strong>O</strong>";
    }
}

db.board.on("value", function (d) {
    let data = d.val();
    board = data;
    for (let i = 0; i < 9; i++) {
        if (board[i] && document.getElementById(i + "").innerHTML.length < 1) fill(i, board[i] - 1);
    }
    if (board.reduce((a, b) => a + b, 0) % 3) turn = 0;
    else turn = 1;
    console.log(player, turn);
    if (turn == player) DOM.message.innerHTML = "Your turn!";
    else DOM.message.innerHTML = "Waiting for your opponent...";
    if (result() > -1) gameOn = false;
});

function choice(i) {
    if (board.reduce((a, b) => a + b, 0) % 3) turn = 0;
    else turn = 1;
    if (gameOn) {
        if (turn == player) {
            if (!board[i]) {
                fill(i);
                board[i] = player + 1;
                db.board.set(board);
                if (result() == -1) {
                    if (turn == player) DOM.message.innerHTML = "Your turn!";
                    else DOM.message.innerHTML = "Waiting for your opponent...";
                } else gameOn = false;
            } else DOM.newWarning("That space is already occupied.");
        } else DOM.newWarning("It's not your turn; wait for the opponent to move.");
    } else DOM.newWarning("The game is over.");
}

function fill(i, shape=player) {
    if (shape) document.getElementById(i + "").innerHTML = "<strong>X</strong>";
    else document.getElementById(i + "").innerHTML = "<strong>O</strong>";
}

function result() { // 0=tie 1=O 2=X
    let end = -1;
    const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < 8; i++) {
        if (board[wins[i][0]] == board[wins[i][1]] && board[wins[i][0]] == board[wins[i][2]] && board[wins[i][0]]) {
            console.log(board[wins[i][0]]);
            end = board[wins[i][0]];
        }
    }
    if (board.reduce((a, b) => a + b, 0) >= 14) end = 0;
    if (!end) DOM.message.innerHTML = "Tie Game!";
    else if (end - 1 == player) DOM.message.innerHTML = "You Win!";
    else if (end != -1) DOM.message.innerHTML = "You Lose.";
    return end;
}
