let currentPokemon;
let pokemonList = [];
let types = [
    "Electric",
    "Poison",
    "Psychic",
    "Ground",
    "Ice",
    "Fighting",
    "Grass",
    "Rock",
    "Dark",
    "Steel",
    "Water",
    "Fairy",
    "Fire",
    "Flying",
    "Bug",
    "Normal"
  ];

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
        setTypeColor(pokemon);
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
    <div class="poke-container-small" id="${pokemon['name']}Overview">
        <h2>${pokemon['name']}</h2>
        <div class="poke-details" id="pokeDetails">
            <div class="types" id="${pokemon['name']}Types">

            </div>
            <img src="${pokemon['image']}" alt="${pokemon['image']}" class="poke-image">
        </div>
    </div>
`;
}


function setTypeColor(pokemon) {
    let type = pokemon['types'][0];
    let pokemonOverview = document.getElementById(`${pokemon['name']}Overview`);
    let pokemonTypes = document.getElementById(`${pokemon['name']}Types`).querySelectorAll('span');

    switch (type) {
        case 'Grass':
        case 'Poison':
        case 'Bug':
            pokemonOverview.style.backgroundColor = '#61cf0ce5';
            break;
        case 'Ice':
        case 'Water':
            pokemonOverview.style.backgroundColor = 'rgba(69, 166, 245)';
            break;
        case 'Fire':
            pokemonOverview.style.backgroundColor = '#f54545';
            pokemonTypes.style.backgroundColor = ''
            break;
        case 'Electric':
            pokemonOverview.style.backgroundColor = '#f0dd32';
            pokemonTypes.style.backgroundColor = ''
        case 'Psychic' :
        case 'Fighting':
            pokemonOverview.style.backgroundColor = '#9622a3';
            pokemonTypes.style.backgroundColor = ''
            break;
        case 'Rock':
        case 'Dark':
        case 'Steel':
            pokemonOverview.style.backgroundColor = '#737073';
            pokemonTypes.style.backgroundColor = ''
            break;
        case 'Flying':
        case 'Fairy':
        case 'Normal':
            pokemonOverview.style.backgroundColor = '#ebcd9d';
            pokemonTypes.style.backgroundColor = ''
            break;
        // Füge hier weitere Cases für andere Typen hinzu
        default:
            // Fallback für unbekannte Typen
            pokemonOverview.style.backgroundColor = '#000000';
            break;
    }
}