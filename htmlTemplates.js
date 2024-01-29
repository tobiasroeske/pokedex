function showPokedexRegion(id) {
    let headlineContent = document.getElementById(id).innerHTML;
    document.getElementById('pokedexRegion').innerHTML = `Pokedex der ${headlineContent} Region`
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
    let primaryImagePath = pokemon['sprites']['other']['dream_world']['front_default'];
    let secondaryImagePath = pokemon['sprites']['other']['home']['front_default'];
    return /*html*/`
    <div class="poke-container-small ${pokemon['types'][0]['type']['name']}" id="${pokemon['name']}Overview" onclick="openPokemonCard(${i})">
        <span class="pokeNumber">#${pokemon['id']}</span>
        <h2>${capitalizeFirstLetter(pokemon['name'])}</h2>
        <div class="poke-details" id="pokeDetails">
            <div class="types">
                ${typeHTML(pokemon)}
            </div>
            <img src="${primaryImagePath == null ? secondaryImagePath : primaryImagePath}" class="poke-image">
        </div>
    </div>
`;
}

function generatePokemonCardHTML(pokemon) {
    let primaryImagePath = pokemon['sprites']['other']['dream_world']['front_default'];
    let secondaryImagePath = pokemon['sprites']['other']['home']['front_default'];
    return /*html*/`
        <div class="popup-card" id="${pokemon['name']}Card" onclick="doNotClose(event)">
            <div class="${pokemon['types'][0]['type']['name']} popup-card-top">
                <div class="d-flex justify-content-between px-5 pt-5 w-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon bi bi-arrow-left" viewBox="0 0 16 16" onclick="toggleVisibility('popup', 'd-none'">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon bi bi-heart" viewBox="0 0 16 16" onclick="changeHeartIcon()" id="heart">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="d-none icon bi bi-heart-fill" viewBox="0 0 16 16" onclick="changeHeartIcon()" id="heartFilled">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                    </svg>
                </div>
                <div class="pokemon-overview">
                    <div class="name-type">
                     <h2>${capitalizeFirstLetter(pokemon['name'])}</h2>
                        <div class="d-flex gap-2">
                            ${typeHTML(pokemon)}
                        </div>
                    </div>
                    <span>#${pokemon['id']}</span>
                </div>
                <img src="${primaryImagePath == null ? secondaryImagePath : primaryImagePath}" class="pokemon-card-img">
                <img src="img/pokeball_white_100.png" alt="" class="pokeball-img">
            </div>
            <div class="pokemon-card-bottom d-flex flex-column" onclick="doNotClose(event)">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a id="aboutTab" class="nav-link active" aria-current="page" href="#" onclick="showInfo(generateAboutHTML()); changeTag('aboutTab', 'nav-link')">About</a>
                        </li>
                        <li class="nav-item" onclick="showInfo(generateBaseStatsHTML()); changeTag('statsTab', 'nav-link')">
                            <a id="statsTab" class="nav-link" href="#">Stats</a>
                        </li>
                        <li class="nav-item" onclick="showInfo(generateEvolutionHTML());changeTag('evolutionTab', 'nav-link')">
                            <a id="evolutionTab" class="nav-link" href="#">Evolution</a>
                        </li>
                        <li class="nav-item" onclick="showInfo(generateMovesHtml()); changeTag('movesTab', 'nav-link')">
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
                ${renderMovesHTML()}
            </ul>
        </div>
    `;
    return htmlText;
}

function renderMovesHTML() {
    let moves = sortMoves();
    let htmlText = '';
    for (let i = 0; i < moves.length; i++) {
        let move = moves[i];
        let moveName = move['move']['name'];
        let levelLearnedAt = move['version_group_details'][0]['level_learned_at'];

        if (move['version_group_details'][0]['move_learn_method']['name'] === 'level-up') {
            htmlText += /*html*/`
                <li><b>${capitalizeFirstLetter(moveName)}</b> learned at <b>Lvl ${levelLearnedAt}</b></li>
            `;
        }
    }
    return htmlText;
}