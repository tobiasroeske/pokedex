
let pokemonList = [];
let currentPokedexList = [];
let listOfAllPokemon = [];
let currentPokedex;
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
    generatePageButtons();
}

async function getAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0';
    let response = await fetch(url);
    if (response.ok) {
        let completeList = await response.json();
        for (let i = 0; i < completeList['results'].length; i++) {
            const result = completeList['results'][i];
            listOfAllPokemon.push(result);
        }
    } else {
        alert('It seems like something went wrong, could not find the pokemon')
    }
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

async function loadPokedex(number) {
    let url = `https://pokeapi.co/api/v2/pokedex/${number}`;
    let response = await fetch(url);
    currentPokedexList = [];
    if (response.ok) {
        currentPokedex = await response.json();
        for (let i = 0; i < currentPokedex['pokemon_entries'].length; i++) {
            const pokemon = currentPokedex['pokemon_entries'][i];
            currentPokedexList.push(pokemon);
        }
    } else {
        alert('It seems like something went wrong, could not find the pokemon')
    }
}

async function renderPokemon() {
    let index = 0;
    let htmlText = '';
    let url = `https://pokeapi.co/api/v2/pokemon/`
    pokemonList = [];
    for (let i = offset; i < limit; i++) {
        let response = await fetch(`${url}${currentPokedexList[i]['pokemon_species']['name']}`);
        if (response.ok) {
            let pokemon = await response.json();
            pokemonList.push(pokemon);
            htmlText += generateOverviewHTML(pokemon, index);
            index++;
        }
    }
    document.getElementById('content').innerHTML = htmlText;
}

function renderNewPokedex(id) {
    let headlineContent = document.getElementById(id).innerHTML;
    document.getElementById('pokedexRegion').innerHTML = `Pokedex of ${headlineContent}-region`
    resetOffsetAndLimit();
    toggleVisibility('sidebar', 'd-none');
    changeActiveTag(id, 'list-group-item');
}

function resetOffsetAndLimit() {
    offset = 0;
    limit = 25;
}

function showNextPage() {
    currentPage++;
    changePage(currentPage);
}

function showPreviousPage() {
    currentPage--
    changePage(currentPage);
}

async function changePage(page) {
    currentPage = page;
    offset = (page - 1) * 25;
    limit = page * 25;
    if (limit > currentPokedexList.length) {
        limit = currentPokedexList.length;
    }
    let currentPokedexId = currentPokedex['id'];
    await init(currentPokedexId);
    updatePageButtons();
}

function updatePageButtons() {
    let previousPageButton = document.getElementById('previousPage');
    let nextPageButton = document.getElementById('nextPage');
    previousPageButton.classList.remove('d-none');
    nextPageButton.classList.remove('d-none');
    let numberOfPages = Math.ceil(currentPokedexList.length / 25)
    for (let i = 1; i <= numberOfPages; i++) {
        document.getElementById(`pageButton${i}`).classList.remove('active-page');
    }
    document.getElementById(`pageButton${currentPage}`).classList.add('active-page');
    if (currentPage == numberOfPages) {
        nextPageButton.classList.add('d-none');
    } else if (currentPage == 1) {
        previousPageButton.classList.add('d-none');
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleVisibility(id, className) {
    document.getElementById(id).classList.toggle(className);
}

function hideFromView(id) {
    document.getElementById(id).classList.add('d-none');
}


function changeHeartIcon() {
    toggleVisibility('heart', 'd-none');
    toggleVisibility('heartFilled', 'd-none');
}

function stopDefaultAction(event) {
    event.stopPropagation();
    event.preventDefault();
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

async function getPokemonImage(name) {
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    let response = await fetch(url);
    if (response.ok) {
        let pokemon= await response.json();
        let primaryImagePath = pokemon['sprites']['other']['dream_world']['front_default'];
        let secondaryImagePath = pokemon['sprites']['other']['home']['front_default'];
        return primaryImagePath == null ? secondaryImagePath : primaryImagePath;
    } else {
        alert('It seems like something went wrong, could not find the pokemon')
        return null;
    }
}

function changeActiveTag(id, tab) {
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

async function showInfo(htmlFunc) {
    let pokeInfo = document.getElementById('pokemonInfo');
    pokeInfo.innerHTML = '';
    pokeInfo.innerHTML = await htmlFunc;
}

function sortMoves() {
    let moves = currentPokemon['moves'];
    moves.sort((a, b) => {
        let levelA = a['version_group_details'][0]['level_learned_at'];
        let levelB = b['version_group_details'][0]['level_learned_at'];
        return levelA - levelB; // Falls negativer Wert rauskommt, wird b vor a sortiert, falls
    });                           // positiver Wert, wird b nach a sortiert
    return moves;
}

function sortTextEntries() {
    let entries = currentInfo['flavor_text_entries'];
    entries.sort((a, b) => {
        if (a['language']['name'] == 'en') {
            return -1;
        } else if (b['language']['name'] == 'en') {
            return 1;
        }
        return 0;
    });
    return entries;
}

async function filterPokemon() {
    generateLoadingScreen('content');
    htmlText = '';
    pokemonList = [];
    index = 0
    let search = document.getElementById('pokemonSearch').value;
    search = search.toLowerCase();
    for (let i = 0; i < listOfAllPokemon.length; i++) {
        const pokemon = listOfAllPokemon[i];
        if (pokemon['name'].includes(search)) {
            let response = await fetch(pokemon['url']);
            if (response.ok) {
                let pokemon = await response.json();
                pokemonList.push(pokemon);
                htmlText += generateOverviewHTML(pokemon, index);
                index++;
            }
        }
    }
    document.getElementById('content').innerHTML = htmlText;
    hideFromView('pages');
    document.getElementById('pokemonSearch').value = '';
}
