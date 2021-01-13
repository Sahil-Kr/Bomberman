const grid = document.querySelector(".grid");
const scoreBoard = document.querySelector(".game-score");
let bombTilesNo = new Array();
let score = 0;
let gameOn = true;

const init = () => {
  for (let i = 0; i < 81; i++) {
    const tile = document.createElement("div");
    tile.classList.add("grid__tile");
    tile.setAttribute("tile-no", i);
    grid.appendChild(tile);
  }

  while (bombTilesNo.length < 10) {
    let randIndex = Math.trunc(Math.random() * 81);
    if (!bombTilesNo.includes(randIndex)) bombTilesNo.push(randIndex);
    //   tiles[randIndex].classList.add("bomb");
  }

  const tiles = document.querySelectorAll(".grid__tile");
  let selectedIndex = new Array();
  tiles.forEach(function (tile, index) {
    tile.addEventListener("click", (e) => {
      if (!gameOn) return;
      let tileNo = Number(tile.getAttribute("tile-no"));
      // console.log(tileNo);
      if (bombTilesNo.includes(tileNo)) {
        gameOn = false;
        bombTilesNo.forEach((num) => {
          tiles[num].classList.add("bomb");
        });
      } else {
        if (selectedIndex.length > 0 && selectedIndex.includes(index)) return;
        tiles[index].classList.add("safe");
        selectedIndex.push(index);
        tiles[index].textContent = ++score;
        scoreBoard.children[0].textContent = `Score : ${score}`;
      }
    });
  });
};

init();

document.querySelector(".new-game").addEventListener("click", function () {
  gameOn = true;
  document.querySelectorAll(".grid__tile").forEach((tile) => tile.remove());
  scoreBoard.children[0].textContent = `Score : 0`;
  score = 0;
  bombTilesNo = new Array();
  init();
});
