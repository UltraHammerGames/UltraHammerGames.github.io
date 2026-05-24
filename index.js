
////////////////////////////////////////////////////////////////
// BANNER //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

let bannerImageIndex = 0;
let bannerAutomatic = true;

const bannerWrapper = document.querySelector('.bannerImagesWrapper');
const bannerWrapperImages = document.querySelectorAll('.bannerImage');
for (let i = 0; i < bannerWrapperImages.length; i++) { bannerWrapperImages[i].onclick = function() {bannerButton(i)}; }

document.getElementById("bannerLeft").onclick = function() { bannerUpdate(-1); bannerAutomatic = false; };
document.getElementById("bannerRight").onclick = function() { bannerUpdate(1); bannerAutomatic = false; };

const bannerDivDots = document.getElementsByClassName("bannerDivDot");
bannerUpdate(1);

function bannerButton(index = 0) {
    switch (index) {
        case 1:
            window.open("https://ultrahammergames.itch.io/all-blight-long");
            break;
        case 2:
            window.open("https://youtube.com/playlist?list=PLxXFNUhHS1NbBZUXNdyckqSDoHJ8Z4DIX&si=39qwd19hNOn6q2qR");
            break;
        case 3:
            window.open("https://discord.gg/yUeUxNrTTu");
            break;
    }
}

function bannerUpdate(direction = 0) {
    bannerImageIndex += direction;
    if (bannerImageIndex > 3) { bannerImageIndex = 1; }
    else if (bannerImageIndex < 1) { bannerImageIndex = 3; }
    
    bannerWrapper.style.transform = `translateX(${bannerImageIndex * -100}%)`;

    for (let i = 0; i < bannerDivDots.length; i++) {
        if (i == (bannerImageIndex - 1)) {
            bannerDivDots[i].style.backgroundColor = "rgba(255, 255, 255, 0.75)";
        }
        else {
            bannerDivDots[i].style.backgroundColor = "rgba(255, 255, 255, 0.25)";
        }
    }

    if (bannerAutomatic) {
        setTimeout(() => { if (bannerAutomatic) { bannerUpdate(1); } }, 2500);
    }
}

////////////////////////////////////////////////////////////////
// GAME SELECTION //////////////////////////////////////////////
////////////////////////////////////////////////////////////////

let gameData = {};
loadGameData();

let gameCatalogueIndex = 0;

const gamesCatalogueWrapper = document.querySelector('.gamesCatalogueWrapper');
const gamesCatalogueViewport = document.querySelector('.gamesCatalogueViewport');
const gamesCatalogueItemWidth = document.querySelectorAll('.gamesCatalogueItem')[0].offsetWidth + parseFloat(getComputedStyle(document.querySelectorAll('.gamesCatalogueItem')[0]).marginRight) + parseFloat(getComputedStyle(document.querySelectorAll('.gamesCatalogueItem')[0]).marginLeft);

const allItems = document.querySelectorAll('.gamesCatalogueItem');
var currentItems = []

const gameCatalogueLeft = document.getElementById("gameCatalogueLeft");
gameCatalogueLeft.onclick = function() {gameCatalogueUpdate(-1)};
const gameCatalogueRight = document.getElementById("gameCatalogueRight")
gameCatalogueRight.onclick = function() {gameCatalogueUpdate(1)};

const gameDivRestrictionsGenres = {};
var gameDivRestrictionsGenresCount = 0;
const gameDivRestrictionsPlayers = [];
var gameDivRestrictionsPlayersCount = 0;
const gameDivRestrictionsPlatforms = [];
var gameDivRestrictionsPlatformsCount = 0;

const gameDivScrollPoint = document.getElementById('gameDivScrollPoint');

const gameDiv = document.getElementById('gameDiv');
const gameDivTitle = document.getElementById('gameDivTitle');
const gameDivLeft = document.getElementById('gameDivLeft');
const gameDivRight = document.getElementById('gameDivRight');

let gameDivArtCaption = null;
let gameDivScreenshotBig = null;

if (window.innerWidth > 1250) {
    gameDivRight.style.marginLeft = `0px`;
    gameDivLeft.style.width = `45%`;
    gameDivRight.style.width = `40%`;
}

gameCatalogueUpdate();
gameRestrictionsSetup();
gameDivUpdate();

async function loadGameData() {
    const response = await fetch('./gameData.json');
    gameData = await response.json();
}

function gameCatalogueUpdate(direction = 0) {
    gameCatalogueIndex += direction;
    gameCatalogueIndex = Math.max(0, Math.min(gameCatalogueIndex, allItems.length - 1 - Math.floor(gamesCatalogueViewport.offsetWidth / gamesCatalogueItemWidth)));

    gamesCatalogueWrapper.style.transform = `translateX(-${gameCatalogueIndex * gamesCatalogueItemWidth + 1}px)`;

    currentItems = [];
    for (let i = 0; i < allItems.length - 1; i++) {
        const currentGenres = allItems[i].dataset.genres.split(', ');
        const currentPlayers = allItems[i].dataset.players.split(', ');
        const currentPlatforms = allItems[i].dataset.platforms.split(', ');

        var failsaves1 = currentGenres.length - gameDivRestrictionsGenresCount; 
        var failsaves2 = currentPlayers.length - gameDivRestrictionsPlayersCount; 
        var failsaves3 = currentPlatforms.length - gameDivRestrictionsPlatformsCount; 
        var check1 = failsaves1 >= 0; var check2 = failsaves2 >= 0; var check3 = failsaves3 >= 0;

        for (let i = 0; i < currentGenres.length; i++) { 
            check1 = check1 && gameDivRestrictionsGenres[currentGenres[i]]; 
            if (!check1 && failsaves1 > 0) { failsaves1 -= 1; check1 = true; }
        }
        for (let i = 0; i < currentPlayers.length; i++) { 
            check2 = check2 && gameDivRestrictionsPlayers[currentPlayers[i]]; 
            if (!check2 && failsaves2 > 0) { failsaves2 -= 1; check2 = true; }
        }
        for (let i = 0; i < currentPlatforms.length; i++) { 
            check3 = check3 && gameDivRestrictionsPlatforms[currentPlatforms[i]]; 
            if (!check3 && failsaves3 > 0) { failsaves3 -= 1; check3 = true; }
        }
        
        check1 = check1 || gameDivRestrictionsGenresCount == 0;
        check2 = check2 || gameDivRestrictionsPlayersCount == 0;
        check3 = check3 || gameDivRestrictionsPlatformsCount == 0;

        if (check1 && check2 && check3) {
            allItems[i].style.display = "";
            requestAnimationFrame(() => { allItems[i].classList.remove("shrink"); });
        
            currentItems.push(allItems[i]);
        } 
        else {
            allItems[i].classList.add("shrink");        
            setTimeout(() => { allItems[i].style.display = "none"; }, 500);
        }
    }

    if (currentItems.length == 0) {
        allItems[allItems.length - 1].style.border = "3px dashed white";
    }
    else {
        allItems[allItems.length - 1].style.border = "0px";
    }

    if (gameCatalogueIndex == 0) {
        gameCatalogueLeft.style.display = "none";
    }
    else{
        gameCatalogueLeft.style.display = "";
    }
    
    if (gameCatalogueIndex >= (currentItems.length - 3)) {
        gameCatalogueRight.style.display = "none";
    }
    else {
        gameCatalogueRight.style.display = "";
    }

    if (gameCatalogueIndex > 0 && currentItems.length <= 3) {
        gameCatalogueIndex = 0;
        gamesCatalogueWrapper.style.transform = `translateX(0px)`;
        gameCatalogueLeft.style.display = "none";
        gameCatalogueRight.style.display = "none";
    }
}

function gameRestrictionsSetup() { 
    createGamesCatalogueTable();
    
    const inputs = document.getElementsByClassName("gamesCatalogueTableInput");
    for (let i = 0; i < inputs.length; i++) {
        const textContent = inputs[i].textContent.trim();

        switch (inputs[i].id.slice(0, -1)) {
            case "genre": gameDivRestrictionsGenres[textContent] = false; break;
            case "players": gameDivRestrictionsPlayers[textContent] = false; break;
            case "platform": gameDivRestrictionsPlatforms[textContent] = false; break;
        }

        inputs[i].addEventListener("click", function () { gameRestrictionsUpdate(this); });
    }
}

function createGamesCatalogueTable() {
    const genreNames = ['2D', '3D', 'Action', 'Platforming', 'Puzzle', 'Roguelite', 'RPG', 'Spelling', 'Strategy'];
    const playersNames = ['Singleplayer', 'Multiplayer'];
    const platformNames = ['Android', 'ios', 'itch.io', 'Steam'];
    
    const gamesCatalogueTable = document.getElementsByClassName('gamesCatalogueTable')[0];
    const gamesCatalogueTableRow = document.createElement('article');
    gamesCatalogueTableRow.classList.add('gamesCatalogueTableRow');
    
    gamesCatalogueTable.innerHTML = `<p class="gamesCatalogueTableHeader"> GENRES: </p>`;
    gamesCatalogueTable.append(createGamesCatalogueRow(gamesCatalogueTableRow, 'genre', genreNames));
    
    gamesCatalogueTable.innerHTML += `<p class="gamesCatalogueTableHeader"> PLAYERS: </p>`;
    gamesCatalogueTable.append(createGamesCatalogueRow(gamesCatalogueTableRow, 'players', playersNames));

    gamesCatalogueTable.innerHTML += `<p class="gamesCatalogueTableHeader"> PLATFORMS: </p>`;
    gamesCatalogueTable.append(createGamesCatalogueRow(gamesCatalogueTableRow, 'platform', platformNames));
}

function createGamesCatalogueRow(gamesCatalogueTableRow, categoryName, valueList) {
    gamesCatalogueTableRow.innerHTML = ``;

    for (let i = 0; i < valueList.length; i++) {
        const gamesCatalogueTableInput = document.createElement('article');
        let classList = "gamesCatalogueTableInput gamesCatalogueTableInputOff";
        if (categoryName == 'platform') { classList = "gamesCatalogueTableInput gamesCatalogueTableInputOffPlatform"; }

        gamesCatalogueTableInput.innerHTML = `
            <button type="button"
                    class="${classList}"
                    id="${categoryName}${i + 1}">
                <img src="images/game_catalogue_icons/${categoryName}_icon_${valueList[i]
                    .toLowerCase().replaceAll(" ", "_").replaceAll("-", "_")}.png">
                ${valueList[i]}
            </button>
        `; 
        gamesCatalogueTableRow.append(gamesCatalogueTableInput);
    }
    return gamesCatalogueTableRow;
}

function gameRestrictionsUpdate(element) {

    const key = element.textContent.trim();
    const type = element.id.slice(0, -1);

    element.classList.toggle("gamesCatalogueTableInputOn");
    if (type != "platform") {
        element.classList.toggle("gamesCatalogueTableInputOff");
    } else {
        element.classList.toggle("gamesCatalogueTableInputOffPlatform");
    }

    let targetObject;
    let targetCount;

    switch (type) {
        case "genre":       targetObject = gameDivRestrictionsGenres;       targetCount = "gameDivRestrictionsGenresCount";     break;
        case "players":     targetObject = gameDivRestrictionsPlayers;      targetCount = "gameDivRestrictionsPlayersCount";    break;
        case "platform":    targetObject = gameDivRestrictionsPlatforms;    targetCount = "gameDivRestrictionsPlatformsCount";  break;
    }

    targetObject[key] = !targetObject[key];

    if (targetObject[key]) { window[targetCount]++; }
    else { window[targetCount]--; }
    gameCatalogueUpdate();
}

function gameCatalogueButton(gameName) { 
    gameDivScrollPoint.scrollIntoView({ behavior: 'smooth' }); 

    gameDivUpdate(gameName);
}

function gameDivUpdate(gameName) {
    if (gameName != undefined) {
        gameDivTitle.style.display = "";
        gameDivLeft.style.display = "";
        gameDivRight.style.display = "";

        gameDivTitle.innerHTML = ``;
        gameDivLeft.innerHTML = ``;
        gameDivRight.innerHTML = ``;

        gameDivTitle.append(getTitle(gameName));        
        gameDivLeft.append(getWebsite(gameName));        
        gameDivLeft.append(getTags(gameName));        
        gameDivLeft.append(getDate(gameName));        
        gameDivLeft.append(getDescription(gameName));
        gameDivLeft.append(getTeamMembers(gameName));
        
        const gameArtSection = getGameArt(gameName);
        if (gameArtSection) {
            gameDivRight.append(getGameArt(gameName));    
        }  
        gameDivRight.append(getScreenshots(gameName));        
        gameDivRight.append(getPlatformIcons(gameName));

        gameDiv.style.backgroundImage = `url("images/game_bgs/${gameName}_bg.png")`;
        const h3Size = gameData[gameName].h3_size ?? 1.15;

        const h3s = document.querySelectorAll('#gameDiv h3');
        h3s.forEach(h3 => {
            h3.style.fontFamily = gameData[gameName].font ?? '';
            h3.style.fontSize = h3Size + `em`;
        });

        gameDivArtCaption.style.fontSize = (h3Size - 0.5) + `em`;
    }
}

function getTitle(gameName) {    
    const title = document.createElement('article');

    title.innerHTML = `<h2>${gameData[gameName].title}</h2>`;
    title.style.fontFamily = `${gameData[gameName].font}`;    
    title.querySelector("h2").style.fontSize = `${gameData[gameName].h2_font_size}`;
    return title;
}

function getWebsite(gameName) {
    const section = document.createElement('article');
    
    if (!gameData[gameName].website) {
        return section;
    }

    section.innerHTML += `<h3> 
        <a href = "${gameData[gameName].website.url}" target="_blank" style="color: ${gameData[gameName].website.color};"> 
            ${gameData[gameName].website.text} 
        </a>
    </h3><br>`;

    return section;
}

function getTags(gameName) {    
    const tags = document.createElement('article');
    
    const row = document.createElement('div');
    row.className = "gameDivHalfRow";
    row.innerHTML = `<h3>GENRE:</h3>`;

    const genreList = document.createElement('h4');
    for (let i = 0; i < gameData[gameName].genres.length; i++) {
        if (i > 0) {
            genreList.innerHTML += `, `;
        }
        genreList.innerHTML += `${gameData[gameName].genres[i]}`;
    }
    row.appendChild(genreList);

    tags.appendChild(row);
    return tags;
}

function getDate(gameName) {    
    const date = document.createElement('article');
    
    const row = document.createElement('div');
    row.className = "gameDivHalfRow";

    if (!gameData[gameName].published) {
        row.innerHTML = `<h4>COMING SOON</h4>`;
    } else {
        row.innerHTML = `<h3>PUBLISHED:</h3>`;
        row.innerHTML += `<h4>${gameData[gameName].published}</h4>`;
    }

    date.appendChild(row);
    return date;
}

function getDescription(gameName) {    
    const date = document.createElement('article');
    date.innerHTML = `<p>${gameData[gameName].description ?? ''}</p>`;
    return date;
}

function getTeamMembers(gameName) {    
    const teamMembers = document.createElement('article');

    if (!gameData[gameName].team_members) {
        return teamMembers;
    }
    
    teamMembers.innerHTML = `<h3>TEAM MEMBERS:</h3>`;
    const membersList = document.createElement('ul');
    for (let i = 0; i < gameData[gameName].team_members.length; i++) {
        membersList.innerHTML += `<li> ${gameData[gameName].team_members[i]} </li>`;
    }
    teamMembers.append(membersList);
    return teamMembers;
}

function getGameArt(gameName) {
    const section = document.createElement('article');
    section.className = "gameDivArtSection";

    if (!gameData[gameName].art) {
        return;
    }

    const newGameDivArt = document.createElement('article');
    newGameDivArt.innerHTML = `<a href = "images/game_art/${gameName}_art.png"> <img src="images/game_art/${gameName}_art.png"> </a>`;            
    section.append(newGameDivArt);

    const newGameDivArtCaption = document.createElement('article');
    newGameDivArtCaption.innerHTML = `<h3> ${gameData[gameName].art.caption} </h3>`;
    
    gameDivArtCaption = newGameDivArtCaption;
    section.append(newGameDivArtCaption);

    return section;
}

function getScreenshots(gameName) {    
    const section = document.createElement('article');
    section.className = "gameDivScreenshotSection";
    
    const screenshotCount = gameData[gameName].screenshot_count ?? 4;

    const newGameDivScreenshotBig = document.createElement('article');
    newGameDivScreenshotBig.className = "gameDivHalfScreenshotBig";
    newGameDivScreenshotBig.id = "gameDivHalfScreenshotBig";
    gameDivScreenshotBig = newGameDivScreenshotBig;
    
    gameDivScreenshotBig.innerHTML = `<img src="images/game_screenshots/${gameName}${1}.png>`;

    updateScreenshotBig(gameName);
    
    section.append(gameDivScreenshotBig);

    for (let i = 0; i < screenshotCount; i++) { 
        const parent = document.createElement('article');
        parent.className = "gameDivScreenshotParent";
    
        const screenshot = document.createElement('article');
        screenshot.innerHTML = `<img class="gameDivHalfScreenshot" src="images/game_screenshots/${gameName}${i + 1}.png">`;
        screenshot.onclick = function() {updateScreenshotBig(gameName, i)};
        parent.append(screenshot);
        section.append(parent);
    }

    return section;
}

function updateScreenshotBig(gameName = "", index = 0) {
    gameDivScreenshotBig.innerHTML = `<img src="images/game_screenshots/${gameName}${index + 1}.png">`;
}

function getPlatformIcons(gameName) {    
    const platforms = document.createElement('article');
    platforms.className = "gameDivPlatformParent";
    
    platforms.innerHTML = ``;
    if (gameData[gameName].canPlay == false) { 
        return platforms; 
    } 

    platforms.innerHTML += `<h3 style="margin-bottom: 1vw;">PLAY IT NOW!</h3>`; 
    for (let i = 0; i < gameData[gameName].platforms.length; i++) { 
        platforms.innerHTML += `<a href = ${gameData[gameName].platforms[i].url} target="_blank" title=${gameData[gameName].platforms[i].name}> <img class="gameDivPlatform" src="images/social_icons/${gameData[gameName].platforms[i].icon}"> </a>`;
    }

    return platforms;
}

////////////////////////////////////////////////////////////////
// EMAIL ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const headerEmail = document.querySelector('.headerEmail');
headerEmail.onclick = function() {toggleEmailDiv("")};

const emailDiv = document.querySelector('.emailDiv');
document.getElementById("emailDivSend").onclick = function() { 
    
    let body = document.getElementById("emailBody").value;
    if (document.getElementById("emailSender").value != "") {
        body = body + `\n\nSincerely,\n - ${document.getElementById("emailSender").value}`;
    }

    window.location.href = `mailto:ultrahammergames@gmail.com
    ?subject=${document.getElementById("emailTopic").value + document.getElementById("emailGame").value}
    &body=${encodeURIComponent(body)}
    `;
};
document.getElementById("emailDivExit").onclick = function() { toggleEmailDiv("none"); };

const emailTopic = document.getElementById("emailTopic");
document.getElementById("emailTopic").onchange = function() { toggleEmailDivSend("none"); };

const emailDivSend = document.getElementById("emailDivSend");

toggleEmailDiv("none");
toggleEmailDivSend();

function toggleEmailDiv(value) {
    emailDiv.style.display = value;
}

function toggleEmailDivSend() {
    emailDivSend.disabled = emailTopic.value == "";
}