async function renderPokemon() {
    let index = 0;
    let htmlText = '';
    pokemonList = [];
    for (let i = offset; i < limit; i++) {
        let url = modifyUrl(currentPokedexList[i]['pokemon_species']['url']);
        let response = await fetch(url);
        if (response.ok) {
            let pokemon = await response.json();
            pokemonList.push(pokemon);
            htmlText += generateOverviewHTML(pokemon, index);
            index++;
        }
    }
    document.getElementById('content').innerHTML = htmlText;
}

function modifyUrl(string) {
    if (string.includes('-species')) {
        return string.replace('-species', '');
    } else {
        return string;
    }
}
    

async function renderPokemonCard(pokemon) {
    let popup = document.getElementById('popup');
    let htmlText = ''
    await getPokemonDetails();
    htmlText += generatePokemonCardHTML(pokemon);
    popup.innerHTML = '';
    popup.innerHTML = htmlText;
    renderHeartIcon();
    checkIfLikedPageIsActive();
    await getEvolutionData();

}

async function renderSearchedPokemon() {
    generateLoadingScreenHTML('content');
    let htmlText= '';
    let index = 0;
    await getSearchedPokemon();
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemon = pokemonList[i];
        htmlText += generateOverviewHTML(pokemon, index);
        index++;
    }
    displaySearchValue();
    document.getElementById('content').innerHTML = htmlText;
    hideFromView('pages');
    document.getElementById('pokemonSearch').value = '';
}

async function renderLikedPokemon() {
    generateLoadingScreenHTML('content');
    let htmlText = '';
    let index = 0;
    pokemonList = [];
    for (let i = 0; i < listOfLikedPokemon.length; i++) {
        const pokemon = listOfLikedPokemon[i];
        pokemonList.push(pokemon);
        htmlText += generateOverviewHTML(pokemon, index);
        index++;
    }
    document.getElementById('pokedexRegion').innerHTML = 'Your liked Pokemon';
    document.getElementById('content').innerHTML = htmlText;
}

function renderPageButtonsHTML() {
    let numberOfPages = Math.ceil(currentPokedexList.length / 25);
    let htmlText = '';
    for (let i = 1; i <= numberOfPages; i++) {
        htmlText += /*html*/`
            <button id="pageButton${i}" class="btn btn-light" onclick="changePage(${i})">${i}</button>
        `;
    }
    return htmlText;
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
                <div class="progress w-100 bg-grey">
                <div class="progress-bar progress-bar-animated ${currentPokemon['types'][0]['type']['name']}" role="progressbar" style="width: 0%;">
                        </div>
                </div>

                </td>
            </tr>  
        `;
    }
    return htmlText;
}

function renderHeartIcon() {
    if (checkIfLiked()) {
        document.getElementById('heart').classList.add('d-none');
        document.getElementById('heartFilled').classList.remove('d-none');
    }
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
                <tr>
                    <td>${capitalizeFirstLetter(moveName)}</td>
                    <td>${levelLearnedAt}</td>
                </tr>
            `;
        }
    }
    return htmlText;
}

function renderTextEntries() {
    let textEntries = sortArrayByLanguage(currentInfo['flavor_text_entries']);
    let htmlText = textEntries[0]['flavor_text'];
    return htmlText;
}