
let pokemonList = [];
let currentPokedexList = [];
let currentPokemon;
let currentInfo;
let currentEvolutionChain;
let limit = 25;
let offset = 0;
let currentPage = 1;

async function init(pokedexNumber) {
    generateLoadingScreen('content');
    await loadPokedex(pokedexNumber);
    await renderPokemon();
}

function generateLoadingScreen(id) {
    let element = document.getElementById(id);
    element.innerHTML = '';
    element.innerHTML = /*html*/`
        <div class="d-flex align-items-center gap-3">
            <h2 class="text-light">Loading ... </h2>
            <div class="spinner-border spinner-border-md text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `
}

async function loadPokedex (number) {
    let url = `https://pokeapi.co/api/v2/pokedex/${number}`;
    let response = await fetch(url);
    currentPokedexList = [];
    if (response.ok) {
        let currentPokedex = await response.json();
        for (let i = 0; i < currentPokedex['pokemon_entries'].length; i++) {
            const pokemon = currentPokedex['pokemon_entries'][i];
            currentPokedexList.push(pokemon);
        }
    } else {
        alert('It seems like something went wrong, could not find the pokemon')
    }
}

async function renderPokemon() {
    let content = document.getElementById('content');
    let htmlText = '';
    let url = `https://pokeapi.co/api/v2/pokemon/`
    pokemonList = [];
    for (let i = offset; i < limit; i++) {
        let response = await fetch(`${url}${currentPokedexList[i]['pokemon_species']['name']}`);
        if (response.ok) {
            let pokemon = await response.json();
            pokemonList.push(pokemon);
            let index = i + 1;
            htmlText += generateOverviewHTML(pokemon, index);
        }
    }
    content.innerHTML = '';
    content.innerHTML = htmlText;
}


async function showNextPage() {
    if (limit < 125) {
        offset += 25;
        limit += 25;
        await init();
    } else {
        offset = 125;
        limit = 151;
        await init();
        limit = 150;
    }
    updatePageButton(limit)
}

async function showPreviousPage() {
    if (limit > 50) {
        offset -= 25;
        limit -= 25;
        await init();
    } else {
        offset -= 25;
        limit -= 25;
        await init();
    }
    updatePageButton(limit);
}

async function changePage(start, end) {
    offset = start;
    limit = end;
    updatePageButton(end);
    await init();
}

function updatePageButton(end) {
    let previousPageButton = document.getElementById('previousPage');
    let nextPageButton = document.getElementById('nextPage');
    previousPageButton.classList.remove('d-none');
    nextPageButton.classList.remove('d-none');
    for (let i = 1; i <= 6; i++) {
        let button = document.getElementById(`pageButton${i}`);
        button.classList.remove('active-page');
    }
    currentPage = Math.round(end / 25);
    let selectedButton = document.getElementById(`pageButton${currentPage}`);
    selectedButton.classList.add('active-page');
    if (currentPage == 6) {
        nextPageButton.classList.add('d-none');
    } else if (currentPage == 1) {
        previousPageButton.classList.add('d-none');
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleVisibility (id, className) {
    document.getElementById(id).classList.toggle(className);
}


function changeHeartIcon () {
    toggleVisibility('heart', 'd-none');
    toggleVisibility('heartFilled', 'd-none');
}

function doNotClose(event) {
    event.stopPropagation();
}

async function openPokemonCard(index) {
    generateLoadingScreen('popup');
    currentPokemon = pokemonList[index];
    toggleVisibility('popup', 'd-none')
    await renderPokemonCard(currentPokemon);
}

async function renderPokemonCard(pokemon) {
    let popup = document.getElementById('popup');
    let htmlText = ''
    await getPokemonDetails();
    htmlText += generatePokemonCardHTML(pokemon);
    popup.innerHTML = '';
    popup.innerHTML = htmlText;
    await getEvolutionData();
    
}

async function getPokemonDetails() {
    let url = currentPokemon['species']['url'];
    
    let response = await fetch(url);
    if (response.ok) {
        let pokemonInfo = await response.json();
        currentInfo = pokemonInfo;
        return pokemonInfo;
    } else {
        alert('It seems like something went wrong, could not find the pokemon')
        return null;
    }
}

async function getEvolutionData() {
    let url = currentInfo['evolution_chain']['url'];
    let response = await fetch(url);
    if (response.ok) {
        let evolutionInfo = await response.json();
        currentEvolutionChain = evolutionInfo;
        return evolutionInfo;
    } else {
        alert('It seems like something went wrong, could not find the pokemon')
        return null;
    }
}

function changeTag(id, tab) {
    let specificTab = document.getElementById(id);
    let tabs = document.getElementsByClassName(tab);
    for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        tab.classList.remove('active');
        tab.removeAttribute('aria-current');
    }
    specificTab.classList.add('active');
    specificTab.setAttribute('aria-current', 'page');

    if (id == 'statsTab') {
        startProgressBarAnimation()
    }
}

function startProgressBarAnimation() {
    setTimeout(() => {
        let progressBars = document.querySelectorAll('.progress-bar-animated');
        for (let i = 0; i < progressBars.length; i++) {
            const progressBar = progressBars[i];
            progressBar.style.width = `${currentPokemon['stats'][i]['base_stat']}%`;
        }
    }, 100);
}

function showInfo(htmlFunc) {
    let pokeInfo = document.getElementById('pokemonInfo');
    pokeInfo.innerHTML = '';
    pokeInfo.innerHTML = htmlFunc;
}

function sortMoves(){
    let moves = currentPokemon['moves'];
    moves.sort((a, b) => {
        let levelA = a['version_group_details'][0]['level_learned_at'];
        let levelB = b['version_group_details'][0]['level_learned_at'];
        return levelA - levelB; // Falls negativer Wert rauskommt, wird b vor a sortiert, falls
    });                           // positiver Wert, wird b nach a sortiert
    return moves;    
}
