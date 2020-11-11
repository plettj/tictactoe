// Database handling and such

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgDnJqTz9C7BOl4ugYqwni2MVxp0SNymc",
    authDomain: "tictactoe-89c08.firebaseapp.com",
    databaseURL: "https://tictactoe-89c08.firebaseio.com",
    projectId: "tictactoe-89c08",
    storageBucket: "tictactoe-89c08.appspot.com",
    messagingSenderId: "730010690668",
    appId: "1:730010690668:web:932df8527e233f1bf6a449"
};

const DOM = {
    board: document.getElementById("Board"),
    modal: document.getElementById("Modal"),
    info1: document.getElementById("Info1"),
    message: document.getElementById("Message"),
    warning: document.getElementById("Warning"),
    mBody: document.getElementById("ModalBody"),
    mTitle: document.getElementById("ModalTitle"),
    mLoader: document.getElementById("Loading"),
    init: function () {
        // initialize the board
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 3; j++) {
                let square = document.createElement("td");
                square.id = j + i * 3;
                square.onclick = function () {choice(j + i * 3);}
                row.appendChild(square);
            }
            this.board.appendChild(row);
        }
    },
    newModal: function (title, body) {
        // info: [title, body info]
        this.mLoader.style.display = "none";
        this.mTitle.innerHTML = title;
        this.mBody.innerHTML = body;
        this.modal.style.display = "block";
    },
    newWarning: function (text, close=false) {
        if (!close) {
            this.warning.innerHTML = text;
            setTimeout(function () {DOM.newWarning("", true)}, 1500);
        } else this.warning.innerHTML = text;
    }
};

firebase.initializeApp(firebaseConfig);
//try {firebase.initializeApp(firebaseConfig);}
//finally {DOM.newModal("Sorry", "Looks like you don't have internet.<br><br>You can't play Tic-Tac-Toe.");}

// database access points
const db = {
    players: firebase.database().ref('Players'),
    board: firebase.database().ref('Board')
};

db.players.once("value", function (data) {
    if (!data.val().p1) {
        db.players.child("p1").set(1);
    } else if (!data.val().p2) {
        db.players.child("p2").set(1);
        player = 0;
    } else player = -1;
    initialize();
});

db.players.on("value", function (d) {
    const data = d.val();
    if (data.p1 && data.p2 && player >= 0) {
        startGame();
    } else if (player >= 0) {
        if (data.p1) DOM.message.innerHTML = "Waiting for a second player...";
        else DOM.message.innerHTML = "Waiting for the first player...";
    }
});

window.onunload = function () {
    if (player == 1) db.players.child("p1").set(0);
    else if (player == 0) db.players.child("p2").set(0);
    db.board.set([0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

function initialize() {
    if (player == 1) { // first player
        DOM.newModal("You're First", "Waiting for another player.<br><br>Please be patient.");
        db.players.child("p2").once("value", function (data) {
            if (data.val()) startGame();
        });
    } else if (!player) { // second player
        startGame();
    } else { // everyone else
        DOM.newModal("Sorry", "You're too late.<br><br>Other people are already playing.<br><br>Try again later.");
        DOM.info1.innerHTML = "";
        return;
    }
}

DOM.init();
