function getMiniCard(name, imgUrl, id, type) {
  const div = document.createElement("div");
  div.classList.add("mini-card", type);
  div.setAttribute("data-id", `Nr.${id}`);
  div.onclick = function () {
    showOverview(id);
  };
  createMiniCardProperties(imgUrl, div, name, id);

  return div;
}

function createMiniCardProperties(imgUrl, div, name, id) {
  const textBoxDiv = document.createElement("div");
  const topMiniCard = document.createElement("div");
  const bottomMiniCard = document.createElement("div");
  const nameElement = document.createElement("b");
  const idElement = document.createElement("i");
  const pokeBallDiv = document.createElement("div")
  const img = document.createElement("img");
  const textBoxSpan = document.createElement("span");
  createPokeImg(imgUrl, img, pokeBallDiv, textBoxDiv, div, textBoxSpan, topMiniCard, bottomMiniCard)
  createName(textBoxDiv, nameElement, idElement, name, id);
  // createBottomImg(idElement);
}

function createPokeImg(imgUrl, img, pokeBallDiv, textBoxDiv, div, textBoxSpan, topMiniCard, bottomMiniCard) {
  pokeBallDiv.classList.add("poke-ball-div");
  div.appendChild(topMiniCard);
  div.appendChild(bottomMiniCard);
  topMiniCard.appendChild(pokeBallDiv);
  topMiniCard.appendChild(textBoxDiv);
  topMiniCard.classList.add("top-mini-card");
  bottomMiniCard.classList.add("bottom-mini-card");
  checkIfImageExists(imgUrl, img, pokeBallDiv, textBoxDiv, div, textBoxSpan)
}

// function createTopPokeImg(pokeBallDiv) {
//   const img = document.createElement("img");
//   img.src = "./img/top-pokeball.png";
//   img.alt = "pokemon-top-ball";
//   img.classList.add("top-pokemon-img");
//   pokeBallDiv.appendChild(img);
// }

// function createBottomImg(idElement) {
//   const img = document.createElement("img");
//   img.src = "./img/bottom-pokeball.png";
//   img.alt = "pokemon-bottom-ball";
//   img.classList.add("bottom-pokemon-img");
//   idElement.appendChild(img);
// }

function checkIfImageExists(imgUrl, img, pokeBallDiv, textBoxSpan) {
  if (imgUrl) {
    img.src = imgUrl;
    img.alt = "pokemon img";
    pokeBallDiv.appendChild(img);
    img.classList.add("poke-img");
  } else {
    textBoxSpan.classList.add("not-found-notification");
    textBoxSpan.textContent = "Pokemon Image not Found";
    pokeBallDiv.appendChild(textBoxSpan);
  }
}

function createName(textBoxDiv, nameElement, idElement, name, id) {
  textBoxDiv.classList.add("mini-card-text-box");
  nameElement.textContent = name;
  idElement.classList.add("pokemon-id");
  idElement.textContent = `Nr.${id}`;
  textBoxDiv.appendChild(nameElement);
  textBoxDiv.appendChild(idElement);
}

function getDetailCard(pokemon) {
  let imageElement;

  if (pokemon.sprites.other.dream_world.front_default) {
    imageElement = `<img id="card-img" src="${pokemon.sprites.other.dream_world.front_default}" alt="pokemon-img" />`;
  } else {
    imageElement = `<span id="card-img">Pokemon Image not Found</span>`;
  }

  return /*html*/ `
      <div  onclick="doNotClose(event)" id="detailes-card" class="${pokemon.types[0].type.name}">
          <img onclick="closeOverlay()" id="close-button" class="d-none "src="./img/x-mark.png" alt="">
          <div class="uppper-card">
              <h3 id="card-header">${pokemon.name}</h3>
              <div class="img-type-box">
                  <div id="card-types"></div>
                  ${imageElement}
              </div>
          </div>
          <div class="lower-card">
              <div class="lower-card-header" ><span onclick="renderBars(${pokemon.id})">Stats</span><span onclick="renderMoves(${pokemon.id})">Moves</span></div>
              <div id="info-box"></div>   
              <div class="arrow-box">
                  <img id="previous-button" onclick="previousPokemon(${pokemon.id})" src="./img/arrow-left.png" alt="left">
                  <img id="next-button" onclick="nextPokemon(${pokemon.id})" src="./img/arrow-right.png" alt="right">
              </div>     
          </div>
      </div>
  `;
}

function getBar(statName, statValue) {
  return /*html*/ `
    <div><span> ${statName}:</span>
    <div class="myProgress">
      <div id="${statName}-bar" class="myBar" style="width: ${getPercent(
    statValue
  )}%">${statValue}</div>
    </div>
    </div>
  `;
}

function getMove(move) {
  return /*html*/ `
     <div class="move">${move}</div> 
    `;
}
