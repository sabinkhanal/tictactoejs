//fetch common ui elements
let buttons = document.querySelectorAll(".gamebox button");
let turnText = document.getElementById("turnText");
let restartBtn = document.getElementById("restartBtn");
let p1_score = document.getElementById("p1_score");
let p2_score = document.getElementById("p2_score");
let draw_score = document.getElementById("draw_score");
//declare variables

let players = ["X", "O"];

let winningCondition = [
  ["00", "01", "02"],
  ["00", "11", "22"],
  ["00", "10", "20"],
  ["02", "11", "20"],
  ["10", "11", "12"],
  ["02", "12", "22"],
  ["01", "11", "21"],
  ["20", "21", "22"]
];

let currentTurn = players[0];
let player1_hit = [];
let player2_hit = [];
var player1_combinations = [];
var player2_combinations = [];
let p1score = 0;
let p2score = 0;
let drawScore = 0;

turnText.innerHTML = getTurnText();
//reset event handle
restartBtn.addEventListener("click", function() {
  resetGame();
});
//for each buttons add click event
[...buttons].forEach(btn => {
  btn.addEventListener("click", e => {
    if (btn.innerHTML.length > 0) {
      alert("already filled");
      return;
    }
    //if clicked,fill with current sign
    btn.innerHTML = currentTurn;
    //change current turn
    currentTurn = currentTurn == players[0] ? players[1] : players[0];
    //display turn text
    turnText.innerHTML = getTurnText();
    //check winner with some delay(rendering time)
    setTimeout(() => checkWinner(btn), 10);
    e.preventDefault();
  });
});

function resetGame() {
  //reset game to initial state
  currentTurn = players[0];
  player1_hit = [];
  player2_hit = [];
  player1_combinations = [];
  player2_combinations = [];

  [...buttons].forEach(btn => {
    btn.innerHTML = "";
    currentTurn = players[0];
  });
}

function getTurnText() {
  //turn text string
  return "TURN OF :" + currentTurn;
}

//get (mxn) combination of array
function getCombination(input, len, start) {
  const result = new Array(3);
  let combinations = new Array();
  combine(input, len, start);

  function combine(input, len, start) {
    if (len === 0) {
      combinations.push(result.join(","));
      return;
    }
    for (var i = start; i <= input.length - len; i++) {
      result[result.length - len] = input[i];
      combine(input, len - 1, i + 1);
    }
  }
  return combinations;
}
//check winner
function checkWinner(btn) {
  //insert into players hit list
  if (btn.innerHTML == players[0]) {
    player1_hit.push(btn.id);
  } else {
    player2_hit.push(btn.id);
  }
  //sort hitlist
  player1_hit.sort();
  player2_hit.sort();
  //create string version of hit array and split to make array
  let player1_pos = player1_hit.join(",").split(",");
  let player2_pos = player2_hit.join(",").split(",");
  //winning condition matching pos array
  let _winningConditions = winningCondition.map(x => x.join(","));
  //once hit more than 2 times , check for winner
  if (player1_hit.length > 2 || player2_hit.length > 2) {
    let player1_combinations = getCombination(player1_pos, 3, 0);
    let player2_combinations = getCombination(player2_pos, 3, 0);

    //find p1,p2 common with winning conditions
    let player1_common = _winningConditions.filter(value =>
      player1_combinations.includes(value)
    );
    let player2_common = _winningConditions.filter(value =>
      player2_combinations.includes(value)
    );

    let isGameEnded = false;
    //if winning condition matches , show who is winner
    if (player1_common > player2_common) {
      isGameEnded = true;
      p1score += 1;
      alert("Player One Won");
    } else if (player2_common > player1_common) {
      isGameEnded = true;
      p2score += 1;
      alert("Player Two Won");
    } else if (player1_hit.length > 4 || player2_hit.length > 4) {
      isGameEnded = true;
      drawScore += 1;
      alert("Draw");
    }
    if (isGameEnded) {
      displayScore();
      resetGame();
    }
  }
}

function displayScore() {
  p1_score.innerHTML = "Player 1:" + p1score;
  p2_score.innerHTML = "Player 2:" + p2score;
  draw_score.innerHTML = "Draw :" + drawScore;
}
