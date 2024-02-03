
let pokemonList = [];
let currentPokedexList = [];
let listOfAllPokemon = [];
let listOfLikedPokemon = [];
let currentPokedex;
let currentPokemon;
let currentInfo;
let currentEvolutionChain;
let limit = 25;
let offset = 0;
let currentPage = 1;

async function init(pokedexNumber) {
    generateLoadingScreenHTML('content');
    await getPokedex(pokedexNumber);
    generateHeadlineHTML();
    await renderPokemon();
    generatePageButtons();
    resetOffsetAndLimit();
}

async function getAllPokemon() {
    listOfAllPokemon = [];
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

async function getPokedex(number) {
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

async function showPokedex(pokedexNumber, id, tab) {
    await init(pokedexNumber);
    resetCurrentPage();
    hideFromView('sidebar');
    changeToActiveTab(id, tab)
}

function resetOffsetAndLimit() {
    offset = 0;
    limit = 25;
}

function resetCurrentPage() {
    currentPage = 1;
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

function checkIfLikedPageIsActive() {
    let likedTab = document.getElementById('likedPokemon');
    if (likedTab.classList.contains('active')) {
        let heartIcon = document.getElementById('heartFilled');
        heartIcon.setAttribute('onclick', 'removeFromLikedPage()');
    }
}

function removeFromLikedPage() {
    changeHeartIcon();
    renderLikedPokemon();
    hideFromView('popup');
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

function checkIfLiked() {
    let isLiked = listOfLikedPokemon.some(element => element['name'] == currentPokemon['name'])
    return isLiked;
}

function changeHeartIcon() {
    if (!checkIfLiked()) {
        listOfLikedPokemon.push(currentPokemon);
    } else {
        removeFromLikedList();
    }
    toggleVisibility('heart', 'd-none');
    toggleVisibility('heartFilled', 'd-none');
}

function removeFromLikedList() {
    let index = listOfLikedPokemon.findIndex(element => element['name'] == currentPokemon['name']);
    listOfLikedPokemon.splice(index, 1);
}

function stopDefaultAction(event) {
    event.stopPropagation();
    event.preventDefault();
}


async function openPokemonCard(index) {
    generateLoadingScreenHTML('popup');
    currentPokemon = pokemonList[index];
    toggleVisibility('popup', 'd-none')
    await renderPokemonCard(currentPokemon);
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

async function getPokemonImage(url) {
    url = modifyUrl(url);
    let response = await fetch(url);
    if (response.ok) {
        let pokemon = await response.json();
        let primaryImagePath = pokemon['sprites']['other']['dream_world']['front_default'];
        let secondaryImagePath = pokemon['sprites']['other']['home']['front_default'];
        return primaryImagePath == null ? secondaryImagePath : primaryImagePath;
    } else {
        alert('It seems like something went wrong, could not find the pokemon')
        return null;
    }
}

function changeToActiveTab(id, tab) {
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

async function showInfoTab(htmlFunc) {
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

function sortArrayByLanguage(array) {
    array.sort((a, b) => {
        if (a['language']['name'] == 'en') {
            return -1;
        } else if (b['language']['name'] == 'en') {
            return 1;
        }
        return 0;
    });
    return array;
}

function sortPokedexLanguages() {
    let languages = currentPokedex['names'];

}

async function getSearchedPokemon() {
    let search = document.getElementById('pokemonSearch').value.toLowerCase();
    pokemonList = [];
    for (let i = 0; i < listOfAllPokemon.length; i++) {
        const pokemon = listOfAllPokemon[i];
        if (pokemon['name'].includes(search)) {
            let response = await fetch(pokemon['url']);
            if (response.ok) {
                let pokemon = await response.json();
                pokemonList.push(pokemon);
            }
        }
    }
}

async function getLikedPokemon() {
    pokemonList = [];
    for (let i = 0; i < listOfLikedPokemon.length; i++) {
        let likedPokemon = listOfLikedPokemon[i];  
        let response = await fetch(likedPokemon['url']);
        if (response.ok) {
            let pokemon = await response.json();
            pokemonList.push(pokemon);
        }
        
    }
}

function displaySearchValue () {
    let headline = document.getElementById('pokedexRegion');
    let searchValue = document.getElementById('pokemonSearch').value;
    headline.innerHTML = /*html*/`Search results of  "${searchValue}"`;
}

function searchPokemon() {
    let searchValue = document.getElementById('pokemonSearch').value;
    let searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    searchValue = searchValue.toLowerCase();
    let regex = new RegExp(searchValue, 'i'); // Erstellt einen case-insensitiven Ausdruck mit dem Inhalt von value
    listOfAllPokemon.forEach(pokemon => {
        if (pokemon['name'].match(regex)) { // Untersucht, ob regex einen Namen matched
            const listItem = document.createElement('li');
            let resultName = capitalizeFirstLetter(pokemon['name']);
            listItem.innerHTML = resultName.replace(regex, match => `<b>${match}</b>`);
            listItem.onclick = () => selectPokemon(pokemon['name']);
            searchResults.appendChild(listItem);
        }
    });
    displaySearchResults(searchValue);
}

function displaySearchResults(value) {
    let resultContainer = document.getElementById('resultContainer');
    let searchResults = document.getElementById('searchResults');
    if (searchResults.innerHTML != '') {
        resultContainer.classList.remove('d-none');
    } 
    if (value.trim() === '') { //löscht alle Leerzeichen in Value
        resultContainer.classList.add('d-none');
    }
}

function selectPokemon(name) {
    document.getElementById('pokemonSearch').value = name;
    document.getElementById('resultContainer').classList.add('d-none');
    }