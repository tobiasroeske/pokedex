let currentPokemon;
let pokemonList = [];
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
    for (let i = 1; i <= 20; i++) {
        let response = await fetch(`${url}${i}`);
        if (response.ok) {
            currentPokemon = await response.json();
            pokemonList.push(currentPokemon);
        } else {
            alert('It seems like something went wrong, could not find the pokemon')
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemon() {
    let content = document.getElementById('content');
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