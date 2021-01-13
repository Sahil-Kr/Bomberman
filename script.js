const grid = document.querySelector(".grid");

for (let i = 0; i < 81; i++) {
  const tile = document.createElement("div");
  tile.classList.add("grid__tile");
  grid.appendChild(tile);
}

const tiles = document.querySelectorAll(".grid__tile");
