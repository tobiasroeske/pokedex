
let pokemonList = [];
let currentPokemon;
let currentInfo;
let currentEvolutionChain;
let limit = 25;
let offset = 0;
let currentPage = 1;

async function init() {
    await loadPokemon();
    renderPokemon();
}

async function loadPokemon() {
    let url = `https://pokeapi.co/api/v2/pokemon/`
    pokemonList = [];
    for (let i = offset + 1; i <= limit; i++) {
        let response = await fetch(`${url}${i}`);
        if (response.ok) {
            let currentPokemon = await response.json();
            pokemonList.push(currentPokemon);
        } else {
            alert('It seems like something went wrong, could not find the pokemon')
        }
    }
}

function renderPokemon() {
    let content = document.getElementById('content');
    content.innerHTML = '';
    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        content.innerHTML += generateOverviewHTML(pokemon, i);
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

function closeCard() {
    document.getElementById('popup').classList.add('d-none');
}

function doNotClose(event) {
    event.stopPropagation();
}

async function openPokemonCard(index) {
    let popup = document.getElementById('popup');
    currentPokemon = pokemonList[index];
    popup.classList.remove('d-none');
    await renderPokemonCard(currentPokemon, index);
}

async function renderPokemonCard(pokemon, index) {
    let popup = document.getElementById('popup');
    popup.innerHTML = '';
    await getPokemonDetails(index);
    await getEvolutionData();
    
    popup.innerHTML += generatePokemonCardHTML(pokemon);
}

async function getPokemonDetails(index) {
    let id = index + 1
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
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

function changeInfoTag(id) {
    let specificTab = document.getElementById(id);
    let tabs = document.getElementsByClassName('nav-link');
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

function generateOverviewHTML(pokemon, i) {
    return /*html*/`
    <div class="poke-container-small ${pokemon['types'][0]['type']['name']}" id="${pokemon['name']}Overview" onclick="openPokemonCard(${i})">
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

function generatePokemonCardHTML(pokemon) {
    return /*html*/`
        <div class="popup-card" id="${pokemon['name']}Card" onclick="doNotClose(event)">
            <div class="${pokemon['types'][0]['type']['name']} popup-card-top">
                <div class="pokemon-overview">
                    <div class="name-type">
                     <h2>${capitalizeFirstLetter(pokemon['name'])}</h2>
                        <div>
                            ${typeHTML(pokemon)}
                        </div>
                    </div>
                    <span>#${pokemon['id']}</span>
                </div>
                <img src="${pokemon['sprites']['other']['dream_world']['front_default']}" class="pokemon-card-img">
                <img src="img/pokeball_white_100.png" alt="" class="pokeball-img">
            </div>
            <div class="pokemon-card-bottom d-flex flex-column">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a id="aboutTab" class="nav-link active" aria-current="page" href="#" onclick="showInfo(generateAboutHTML()); changeInfoTag('aboutTab')">About</a>
                        </li>
                        <li class="nav-item" onclick="showInfo(generateBaseStatsHTML()); changeInfoTag('statsTab')">
                            <a id="statsTab" class="nav-link" href="#">Stats</a>
                        </li>
                        <li class="nav-item" onclick="showInfo(generateEvolutionHTML());changeInfoTag('evolutionTab')">
                            <a id="evolutionTab" class="nav-link" href="#">Evolution</a>
                        </li>
                        <li class="nav-item" onclick="showInfo(generateMovesHtml()); changeInfoTag('movesTab')">
                            <a id="movesTab" class="nav-link">Moves</a>
                        </li>
                    </ul>
                    <div class="d-flex flex-column p-3 gap-2" id="pokemonInfo">
                        ${generateAboutHTML()}
                    </div>
            </div>
            
        </div>
    `
}

function generateBaseStatsHTML() {
    return /*html*/`
        <table class="table">
            ${renderStatsHTML()}
        </table>
        
    `
}

function renderStatsHTML() {
    let htmlText = '';
    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        let stat = currentPokemon['stats'][i];
        htmlText += /*html*/`
            <tr>
                <td><b>${stat['stat']['name']}</b></td>
                <td>${stat['base_stat']}</td>
                <td>
                <div class="progress w-100 bg-secondary">
                <div class="progress-bar progress-bar-animated ${currentPokemon['types'][0]['type']['name']}" role="progressbar" style="width: 0%;">
                        </div>
                </div>

                </td>
            </tr>  
        `;
    }
    return htmlText;
}

function generateAboutHTML() {
    return /*html*/`
        <div class="d-flex flex-column py-2 px-5 gap-3">
            <h4>Pokedex Entry</h4>
            <i>"${currentInfo['flavor_text_entries'][1]['flavor_text']}"</i>
            <div class="d-flex flex-column fs-6 w-75">
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <b>Base happiness: </b>${currentInfo['base_happiness']}
                </div>
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <b>Base experience: </b>${currentPokemon['base_experience']}
                </div>
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <b>Capture rate: </b>${currentInfo['capture_rate']}
                </div>
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <b>Height: </b>${currentPokemon['height'] / 10}m
                </div>
                <div class="d-flex justify-content-between align-items-center gap-3">
                    <b>Weight: </b>${currentPokemon['weight'] / 10}kg
                </div>
            </div>
        </div>
    `
}
// Funktioniert noch nicht, weil sie im Falle von 2 Evolutionen keinen thirdKey deklarieren kann
// Vielleicht kann man es über einen Array lösen
function generateEvolutionHTML() {
    let chain = currentEvolutionChain['chain'];
    let firstKey = chain['species']['name'];
    let evolvesTo = chain['evolves_to'];
    let htmlText = /*html*/`
        <div class="d-flex flex-column py-2 px-5">
            <h4>Evolution Chain</h4>
            <ul>
                <li>${capitalizeFirstLetter(firstKey)}</li>
    `;
    if (evolvesTo.length > 0) {
        let secondKey = evolvesTo[0]['species']['name'];
        let firstLevelChange = evolvesTo[0]['evolution_details'][0]['min_level'];
        htmlText += /*html*/`
            <li>${capitalizeFirstLetter(secondKey)} at Level ${firstLevelChange}</li>
        `;
        if (evolvesTo[0]['evolves_to'].length > 0) {
            let thirdKey = evolvesTo[0]['evolves_to'][0]['species']['name'];
            let secondLevelChange = evolvesTo[0]['evolves_to'][0]['evolution_details'][0]['min_level'];
            htmlText += /*html*/`
                <li>${capitalizeFirstLetter(thirdKey)} at Level ${secondLevelChange}</li>
            `;
        }
    }
    htmlText += /*html*/`
            </ul>
            <h5>Evolution Infos</h5>
            <ul>
                <li>Growth rate: ${currentInfo['growth_rate']['name']}</li>
                <li>Gender difference: ${currentInfo['has_gender_difference'] ? 'Yes' : 'No'}</li>
                <li>Legendary: ${currentInfo['is_legendary']? 'Yes' : 'No'}</li>
                <li>Mythical: ${currentInfo['is_mythical']? 'Yes':'No'}</li>
            </ul>
        </div>
    `;
    return htmlText;
}

function generateMovesHtml() {
    let htmlText = '';
    htmlText = /*html*/`
        <div class="d-flex flex-column py-2 px-5">
            <ul>
                ${renderMoves()}
            </ul>
        </div>
    `;
    return htmlText;
}

function renderMoves() {
    let moves = currentPokemon['moves'];
    let htmlText = ''
    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        let moveName = move['move']['name'];
        let levelLearnedAt = move['version_group_details'][0]['level_learned_at']
        if (move['version_group_details'][0]['move_learn_method']['name'] == 'level-up'){
            htmlText += /*html*/`
                <li><b>${capitalizeFirstLetter(moveName)}</b> learned at <b>Lvl ${levelLearnedAt}</b></li>
            `;
        }
    }
    return htmlText;
}