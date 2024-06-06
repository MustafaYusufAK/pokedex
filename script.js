let loadedPokemon = 0;
let loadPokemon = 45;
let results;
let infiniteScrollActive = "notActive";

let pokeTypes = [];
let filteredPokemonTypes = [];
let loadedPokes = [];
let pokemonFound = false;

async function getData() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
    const response = await fetch(url);
    const responseAsJson = await response.json();
    results = responseAsJson.results;
    console.log('loaded Results', results);
    renderPokemon();
    getAllPokeTypes();
}

async function fetchPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const pokemon = await response.json();
    console.log('loaded PokeData', pokemon.types);
    return pokemon;
}

async function getAllPokeTypes() {
    loadedPokes = [];
    for (let i = 1; i <= loadPokemon; i++) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
        const pokemonData = await response.json();
        const types = pokemonData.types;
        pokeTypes.push({ id: i, types: types });
        loadedPokes.push(pokemonData);
    }
}

async function filterByType() {
    const typeSelector = document.getElementById("type-selector");
    const selectedType = typeSelector.value;
    if (selectedType === "all") {
        reloadPage();
        return;
    }

    const matchingPokemon = loadedPokes.filter((pokemon) => {
        return pokemon.types.some(type => type.type.name === selectedType);
    });

    renderFilteredPokemon(matchingPokemon);
    removeScrollListener();
}

function renderFilteredPokemon(filteredPokemon) {
    const main = document.getElementById("main");
    main.innerHTML = "";

    for (const pokemon of filteredPokemon) {
        const imgUrl = pokemon.sprites.other.showdown.front_default;
        const name = pokemon.name;
        const id = pokemon.id;
        const type = pokemon.types[0].type.name;
        const card = getMiniCard(name, imgUrl, id, type);
        main.appendChild(card);
    }
}

async function renderPokemon() {
    const main = document.getElementById("main");
    const loadedPokemonsContainer = document.getElementById("loaded-Pokemons");

    for (let i = loadedPokemon; i < loadPokemon; i++) {
        const pokemon = results[i];
        loadedPokemon++;
        loadedPokemonsContainer.innerHTML = loadedPokemon;
        let card = await getPokemonData(pokemon.url);
        main.appendChild(card);
    }
    infiniteScrollActive = "active";
}

async function loadMorePokemon() {
    loadPokemon = loadPokemon + 45;
    getAllPokeTypes();
    await renderPokemon();
}

async function getPokemonData(url) {
    const response = await fetch(url);
    const responseAsJson = await response.json();
    const imgUrl = responseAsJson.sprites.other.showdown.front_default;
    const name = responseAsJson.name;
    const id = responseAsJson.id;
    const type = responseAsJson.types[0].type.name;
    const card = getMiniCard(name, imgUrl, id, type);
    return card;
}

async function searchPokemon() {
    const searchInput = getSearchInput();
    resetSearchInput();
    showBackButton();
    setupSearch();
    filterTheSearch(searchInput);

    if (pokemonFound === false) {
        noPokemonFound();
    }
}

async function filterTheSearch(searchInput) {
    const filteredResults = results.filter((pokemon) => {
        const pokemonName = pokemon.name.toLowerCase();
        return pokemonName.startsWith(searchInput);
    });

    for (let i = 0; i < filteredResults.length; i++) {
        const pokemon = filteredResults[i];
        loadedPokemon++;
        pokemonFound = true;
        await renderSearchedPokemon(pokemon);
    }
}

function resetSearchInput() {
    const inputField = document.getElementById("search-input");
    inputField.value = "";
}

function getSearchInput() {
    return document.getElementById("search-input").value.toLowerCase();
}

function showBackButton() {
    const backButton = document.getElementById("back-button");
    backButton.classList.remove("d-none");
}

function setupSearch() {
    infiniteScrollActive = "notactive";
    main.innerHTML = ``;
    loadedPokemon = 0;
}

async function renderSearchedPokemon(pokemon) {
    const main = document.getElementById("main");
    const loadedPokemonsContainer = document.getElementById("loaded-Pokemons");
    loadedPokemonsContainer.innerHTML = loadedPokemon;
    const card = await getPokemonData(pokemon.url);
    main.appendChild(card);
    console.log('rendering', pokemon);
}

function noPokemonFound() {
    const main = document.getElementById("main");
    main.innerHTML = "leider keine Pokemon gefunden";
}

async function showOverview(id) {
    const pokemon = await fetchPokemonData(id);
    const overlayBg = document.getElementById("overlay-bg");
    overlayBg.classList.remove("d-none");
    document.body.style = "overflow: hidden;";
    fillCard(pokemon);
    getTypes(pokemon);

    renderBars(id);
    setTimeout(showCard, 1);
}

async function nextPokemon(id) {
    id = id + 1;
    hideCard();
    setTimeout(showOverview.bind(null, id), 600);
}

async function previousPokemon(id) {
    id = id - 1;
    hideCard();
    setTimeout(showOverview.bind(null, id), 600);
}

function showCloseButton() {
    const closeButton = document.getElementById("close-button");
    closeButton.classList.remove("d-none");
}

function showCard() {
    const card = document.getElementById("detailes-card");
    card.classList.add("show");
    setTimeout(showCloseButton, 500);
}

function hideCard() {
    const card = document.getElementById("detailes-card");
    const closeButton = document.getElementById("close-button");
    card.classList.remove("show");
    closeButton.classList.add("d-none");
}

function fillCard(pokemon) {
    const container = document.getElementById("overlay-bg");
    container.innerHTML = getDetailCard(pokemon);
    if (pokemon.id === 1) {
        let button = document.getElementById("previous-button");
        button.style = "opacity: 0; pointer-events: none;";
    }
    if (pokemon.id === 10271) {
        let button = document.getElementById("next-button");
        button.style = "opacity: 0; pointer-events: none;";
    }
}

async function renderBars(id) {
    const barContainer = document.getElementById("info-box");
    const pokemon = await fetchPokemonData(id);
    barContainer.innerHTML = "";

    for (let i = 0; i < pokemon.stats.length; i++) {
        const statName = pokemon.stats[i].stat.name;
        const statValue = pokemon.stats[i].base_stat;
        barContainer.innerHTML += getBar(statName, statValue);
    }
}

async function renderMoves(id) {
    const moveContainer = document.getElementById("info-box");
    const pokemon = await fetchPokemonData(id);
    moveContainer.innerHTML = "";

    for (let i = 0; i < pokemon.moves.length; i++) {
        let move = pokemon.moves[i];
        move = move.move.name;
        moveContainer.innerHTML += getMove(move);
    }
}

function getPercent(statValue) {
    const maxStat = 200;
    const percent = (statValue / maxStat) * 100;
    return percent;
}

function getTypes(pokemon) {
    const types = pokemon.types;
    const typeBox = document.getElementById("card-types");
    getEveryType(types, pokemon, typeBox);
}

function getEveryType(types, pokemon, typeBox) {
    for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const typeName = type.type.name;
        let typediv = document.createElement("span");
        typediv.textContent = typeName;
        showRightTypeIcon(typeName, typediv);
        typediv.addEventListener("click", function () {
            showThisType(typeName, pokemon.id);
        });

        typeBox.appendChild(typediv);
    }
}

function showThisType(typeName, pokemonId) {
    filterByCardType(typeName)
    closeOverlay();
    glowUpCard(pokemonId);
}

function glowUpCard(pokemonId) {
    const matchingCards = document.querySelectorAll(`.mini-card[data-id="Nr.${pokemonId}"]`);
    matchingCards.forEach(card => {
        card.classList.add("glowUp");
    });

    setTimeout(() => {
        matchingCards.forEach(card => {
            card.classList.remove("glowUp");
        });
    }, 3000);
}

async function filterByCardType(typeName) {
    const selectedType = typeName;

    if (selectedType === "all") {
        reloadPage();
        return;
    }

    const matchingPokemon = loadedPokes.filter((pokemon) => {
        return pokemon.types.some(type => type.type.name === selectedType);
    });

    renderFilteredPokemon(matchingPokemon);
    removeScrollListener();
}

function filteredPokeTypes() {

    for (let i = 0; i < pokeTypes.length; i++) {
        const pokemon = pokeTypes[i];
        const typesArray = pokemon.types;

        for (let j = 0; j < typesArray.length; j++) {
            const type = typesArray[j].type;
            const typeName = type.name;
            filteredPokemonTypes.push(typeName);
            console.log(typeName);
        }
    }
}

function closeOverlay() {
    const overlayBg = document.getElementById("overlay-bg");
    document.body.style = "";
    overlayBg.classList.add("d-none");
}

function doNotClose(event) {
    event.stopPropagation();
}

function reloadPage() {
    location.reload();
}

async function infiniteScroll() {
    if (
        window.scrollY + window.innerHeight + 50 >=
        document.documentElement.scrollHeight &&
        infiniteScrollActive == "active") {
        infiniteScrollActive = "notactive";
        await loadMorePokemon();
    }
}

function toggleScrollUpButton() {
    const scrollUpButton = document.getElementById("scroll-up-button");
    if (window.scrollY > 500) {
        scrollUpButton.classList.remove("d-none");
    } else {
        scrollUpButton.classList.add("d-none");
    }
}

window.addEventListener("scroll", infiniteScroll);
window.addEventListener("scroll", toggleScrollUpButton);
function removeScrollListener() {
    window.removeEventListener("scroll", infiniteScroll);
}