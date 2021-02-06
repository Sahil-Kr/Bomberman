const grid = document.querySelector(".grid");
const scoreBoard = document.querySelector("#score");
const flagCount = document.querySelector("#flagsLeft");
const result = document.querySelector("#result");

let rowNbr = [-1, -1, -1, 0, 0, 1, 1, 1];
let colNbr = [-1, 0, 1, -1, 1, -1, 0, 1];

let gridBoard = new Array(10).fill(0).map(() => new Array(10).fill(0));
let bombTiles = new Array(10).fill(0).map(() => new Array(2).fill(0));

let remFlag = 10;
let score = 0;
let gameOn = true;
let correctFlagCount = 0;

const countNeighbourBombs = () => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      let count = 0;
      for (let k = 0; k < 8; k++) {
        let x = i + rowNbr[k];
        let y = j + colNbr[k];

        if (x >= 0 && x < 10 && y >= 0 && y < 10 && gridBoard[x][y] == 1)
          count++;
      }
      grid.children[i * 10 + j].setAttribute("data", count);
    }
  }
};

const placeBombs = () => {
  let count = 0;

  while (true) {
    let ri = Math.trunc(Math.random() * 10);
    let rj = Math.trunc(Math.random() * 10);

    if (gridBoard[ri][rj] != 1) {
      bombTiles[count][0] = ri;
      bombTiles[count][1] = rj;
      count++;
      gridBoard[ri][rj] = 1;
    }

    if (count == 10) break;
  }
};

const setupTiles = () => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const tile = document.createElement("div");
      tile.classList.add("grid__tile");
      tile.setAttribute("id", `${i * 10 + j}`);
      tile.setAttribute("i", i);
      tile.setAttribute("j", j);
      grid.appendChild(tile);

      if (gridBoard[i][j] == 0) tile.classList.add("valid");
      else tile.classList.add("bomb");
    }
  }
};

const revealBombTiles = () => {
  for (let k = 0; k < 10; k++) {
    let tileNo = bombTiles[k][0] * 10 + bombTiles[k][1];
    grid.children[tileNo].classList.add("bomb_tile");
    grid.children[tileNo].classList.add("checked");
    grid.children[tileNo].textContent = "💣";
  }
};

const renderResult = (isWinner) => {
  if (isWinner) {
    result.textContent = "YOU WIN!";
  } else {
    result.textContent = "YOU LOSE!";
  }
};

const gameLogic = () => {
  grid.addEventListener("click", function (e) {
    const tile = e.target.closest(".grid__tile");
    if (!tile || !gameOn || tile.classList.contains("checked")) return;

    let i = +tile.getAttribute("i");
    let j = +tile.getAttribute("j");

    if (gridBoard[i][j] == 1) {
      gameOn = false;
      revealBombTiles();
      renderResult(false);
    } else {
      tile.classList.add("safe_tile");
      tile.classList.add("checked");
      tile.textContent = tile.getAttribute("data");
      scoreBoard.textContent = ++score;

      if (score == 90) renderResult(true);
    }
  });
};

const init = () => {
  flagCount.textContent = remFlag;

  placeBombs();

  setupTiles();

  countNeighbourBombs();

  gameLogic();
};

init();

const resetArrays = () => {
  gridBoard = new Array(10).fill(0).map(() => new Array(10).fill(0));
  bombTiles = new Array(10).fill(0).map(() => new Array(2).fill(0));
};

const resetGame = () => {
  gameOn = true;
  document.querySelectorAll(".grid__tile").forEach((tile) => tile.remove());
  resetArrays();
  scoreBoard.textContent = 0;
  result.textContent = "";
  score = 0;
  remFlag = 10;
  init();
};

document.querySelector(".reset").addEventListener("click", resetGame);

const renderFlag = (event) => {
  event.preventDefault();

  const tile = event.target.closest(".grid__tile");

  if (!tile || +remFlag < 1 || !gameOn || tile.classList.contains("checked"))
    return;

  //If already flagged then remove flag
  if (tile.classList.contains("flag")) {
    flagCount.textContent = ++remFlag;
    tile.classList.remove("flag");
    tile.textContent = "";
    return;
  }

  flagCount.textContent = --remFlag;

  let i = +tile.getAttribute("i");
  let j = +tile.getAttribute("j");
  if (gridBoard[i][j] == 1) correctFlagCount++;

  if (correctFlagCount == 10) {
    gameOn = false;
    renderResult(true);
  }

  tile.textContent = "🚩";
  tile.classList.add("flag");
};

grid.addEventListener("contextmenu", renderFlag);
