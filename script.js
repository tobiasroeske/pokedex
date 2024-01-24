let currentPokemon;
let pokemonList = [];
let limit = 25;
let offset = 0;
let currentPage = 1;

async function init() {
    await loadAllPokemon();
    renderPokemon();
}

async function loadAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/'
    pokemonList = [];
    for (let i = offset + 1; i <= limit; i++) {
        let response = await fetch(`${url}${i}`);
        if (response.ok) {
            currentPokemon = await response.json();
            pokemonList.push(currentPokemon);
        } else {
            alert('It seems like something went wrong, could not find the pokemon')
        }
    }
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

function renderPokemon() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        content.innerHTML += generateOverviewHTML(pokemon);
    }
}

function typeHTML(pokemon) {
    htmlText = '';
    for (let j = 0; j < pokemon['types'].length; j++) {
        htmlText += /*html*/`
        <span class="${pokemon['types'][j]['type']['name']}">
            ${capitalizeFirstLetter(pokemon['types'][j]['type']['name'])}
        </span>`;
    }
    return htmlText;
}

function generateOverviewHTML(pokemon) {
    return /*html*/`
    <div class="poke-container-small ${pokemon['types'][0]['type']['name']}" id="${pokemon['name']}Overview">
        <span class="pokeNumber">#${pokemon['id']}</span>
        <h2>${capitalizeFirstLetter(pokemon['name'])}</h2>
        <div class="poke-details" id="pokeDetails">
            <div class="types">
                ${typeHTML(pokemon)}
            </div>
            <img src="${pokemon['sprites']['other']['dream_world']['front_default']}" class="poke-image">
        </div>
    </div>
`;
}