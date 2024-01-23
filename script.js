let currentPokemon;
let pokemonList = [];
let limit = 25;
let offset = 0;
// let types = [
//     "Electric",
//     "Poison",
//     "Psychic",
//     "Ground",
//     "Ice",
//     "Fighting",
//     "Grass",
//     "Rock",
//     "Dark",
//     "Steel",
//     "Water",
//     "Fairy",
//     "Fire",
//     "Flying",
//     "Bug",
//     "Normal"
//   ];

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

async function changePage(start, end) {
    await init(start, end)
}
// Die beiden Funktionen funktionieren noch nicht!
async function showNextPage() {
    let nextPageButton = document.getElementById('nextPage');
    let previousPageButton = document.getElementById('previousPage');
    if (limit < 125) {
        previousPageButton.classList.remove('d-none');
        offset += 25;
        limit += 25;
        await init();
    } else {
        offset = 125;
        limit = 151;
        await init();
        nextPageButton.classList.add('d-none');
    }
}

async function showPreviousPage() {
    let previousPageButton = document.getElementById('previousPage');
    if (limit > 50) {
        previousPageButton.classList.remove('d-none');
        offset-= 25;
        limit -= 25;
        await init();
    } else {
        offset -= 25;
        limit -= 25;
        await init();
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