
function generateLoadingScreenHTML(id) {
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

function generateHeadlineHTML() {
    let headlineContent = currentPokedex['names'][2]['name'];
    document.getElementById('pokedexRegion').innerHTML = `Pokedex of ${headlineContent}-region`;
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

function generatePageButtons() {
    let pagesContainer = document.getElementById('pages');
    pagesContainer.classList.remove('d-none');
    pagesContainer.innerHTML = /*html*/`
        <div class="pages-container" id="pages mb-5">
            <button id="previousPage" class="btn btn-light d-none" onclick="showPreviousPage()">
                <img src="img/arrow-left.svg" alt="" class="icon">
            </button>
            <div class="page-btns">
                ${renderPageButtonsHTML()}
            </div>      
            <button id="nextPage" class="btn btn-light focus-ring focus-ring-secondary" onclick="showNextPage()">
                <img src="img/arrow-right.svg" alt="" class="icon">
            </button>
        </div>
    `;
}

function generatePokemonCardHTML(pokemon) {
    let primaryImagePath = pokemon['sprites']['other']['dream_world']['front_default'];
    let secondaryImagePath = pokemon['sprites']['other']['home']['front_default'];
    return /*html*/`
        <div class="popup-card" id="${pokemon['name']}Card" onclick="stopDefaultAction(event)">
            <div class="${pokemon['types'][0]['type']['name']} popup-card-top">
                <div class="d-flex justify-content-between px-5 pt-5 w-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon bi bi-arrow-left" viewBox="0 0 16 16" onclick="toggleVisibility('popup', 'd-none')">
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
            <div class="pokemon-card-bottom d-flex flex-column" onclick="stopDefaultAction(event)">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a id="aboutTab" class="nav-link active" aria-current="page" href="#" onclick="showInfoTab(generateAboutHTML()); changeToActiveTab('aboutTab', 'nav-link')">About</a>
                        </li>
                        <li class="nav-item" onclick="showInfoTab(generateBaseStatsHTML()); changeToActiveTab('statsTab', 'nav-link')">
                            <a id="statsTab" class="nav-link" href="#">Stats</a>
                        </li>
                        <li class="nav-item" onclick="showInfoTab(generateEvolutionHTML());changeToActiveTab('evolutionTab', 'nav-link')">
                            <a id="evolutionTab" class="nav-link" href="#">Evolution</a>
                        </li>
                        <li class="nav-item" onclick="showInfoTab(generateMovesHtml()); changeToActiveTab('movesTab', 'nav-link')">
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

function generateAboutHTML() {
    return /*html*/`
        <div class="d-flex flex-column py-2 px-5 gap-3">
            <h4>Pokedex Entry</h4>
            <i>"${renderTextEntries()}"</i>
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

async function generateEvolutionHTML() {
    let nameFirstPokemon = currentEvolutionChain['chain']['species']['name'];
    let nameSecondPokemon = currentEvolutionChain['chain']['evolves_to'][0]['species']['name'];
    let htmlText = /*html*/`
        <div class="d-flex flex-column py-2 px-5 gap-3">
            <h4>Evolution Chain</h4>
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex flex-column gap-2">
                    <img src="${await getPokemonImage(nameFirstPokemon)}" class="evolution-img">
                    <h6>${capitalizeFirstLetter(nameFirstPokemon)}</h6>
                </div>
                <img src="img/arrow-right.svg" alt="" class="icon">
                <div class="d-flex flex-column gap-2">
                    <img src="${await getPokemonImage(nameSecondPokemon)}" class="evolution-img">
                    <h6>${capitalizeFirstLetter(nameSecondPokemon)}</h6>
                </div>
            </div>
    `;
    if (currentEvolutionChain['chain']['evolves_to'][0]['evolves_to'].length > 0) {
        let nameThirdPokemon = currentEvolutionChain['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];
        htmlText += /*html*/`
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex flex-column gap-2">
                        <img src="${await getPokemonImage(nameSecondPokemon)}" class="evolution-img">
                        <h6>${capitalizeFirstLetter(nameSecondPokemon)}</h6>
                    </div>
                    <img src="img/arrow-right.svg" alt="" class="icon">
                    <div class="d-flex flex-column gap-2">
                        <img src="${await getPokemonImage(nameThirdPokemon)}" class="evolution-img">
                        <h6>${capitalizeFirstLetter(nameThirdPokemon)}</h6>
                    </div>
                </div>
            </div>
        `;
    } else {
        htmlText += /*html*/`
            </div>
        `
    }
    return htmlText;
}

function generateMovesHtml() {
    let htmlText = '';
    htmlText = /*html*/`
        <div class="d-flex flex-column py-2 px-5">
            <table class="custom-table ${currentPokemon['types'][0]['type']['name']}">
                <thead>
                    <tr>
                        <th scope="col">Move</th>
                        <th scope="col">Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderMovesHTML()}           
                </tbody>
            </table>
        </div>
    `;
    return htmlText;
}