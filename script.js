let currentPokemon;
let pokemonList = [];

async function init() {
    await loadAllPokemon();
    renderPokemon();
}


async function loadAllPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/'
    for (let i = 1; i <= 150; i++) {
        let response = await fetch(`${url}${i}`);
        if (response.ok) {
            currentPokemon = await response.json();
            getRelevantPokemonData();
        } else {
            alert('It seems like something went wrong, could not find the pokemon')
        }
    }
}

function getRelevantPokemonData() {
    let pokemon = {
        name: capitalizeFirstLetter(currentPokemon['name']),
        types: [],
        image: currentPokemon['sprites']['other']['dream_world']['front_default']
    };

    for (let i = 0; i < currentPokemon['types'].length; i++) {
        let type = currentPokemon['types'][i]['type']['name'];
        pokemon['types'].push(capitalizeFirstLetter(type));
    }
    pokemonList.push(pokemon);
    return pokemon;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderPokemon() {
    let content = document.getElementById('content');
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        content.innerHTML += generateOverviewHTML(pokemon);
        let typeContainer = document.getElementById(`${pokemon['name']}Types`);
        for (let j = 0; j < pokemon['types'].length; j++) {
        let type = pokemon['types'][j];
        typeContainer.innerHTML += /*html*/`
            <span>${type}</span>
        `;
    }
    }
}

function generateOverviewHTML(pokemon) {
    return /*html*/`
    <div class="poke-container-small" id="${pokemon}Overview">
        <h2>${pokemon['name']}</h2>
        <div class="poke-details" id="pokeDetails">
            <div class="types" id="${pokemon['name']}Types">

            </div>
            <img src="${pokemon['image']}" alt="${pokemon['image']}" class="poke-image">
        </div>
    </div>
`;
}


