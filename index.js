
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
            
            break;
        case 2:
            
            break;
        case 3:
            window.open("https://youtube.com/playlist?list=PLxXFNUhHS1NbBZUXNdyckqSDoHJ8Z4DIX&si=39qwd19hNOn6q2qR");
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
let gameDivScreenshotBig = null;

if (window.innerWidth > 1250) {
    gameDivRight.style.marginLeft = `0px`;
    gameDivLeft.style.width = `45%`;
    gameDivRight.style.width = `40%`;
}

gameCatalogueUpdate();
gameRestrictionsSetup();
gameDivUpdate();

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
    const inputs = document.getElementsByClassName("gamesCatalogueTableInput");
    for (let i = 0; i < inputs.length; i++) {
        const textContent = inputs[i].textContent.slice(2,-1);
        switch (inputs[i].id.slice(0,-1)) {
            case ("genre"): gameDivRestrictionsGenres[textContent] = false; break;
            case ("players"): gameDivRestrictionsPlayers[textContent] = false; break;
            case ("platform"): gameDivRestrictionsPlatforms[textContent] = false; break;
        }
         
        inputs[i].addEventListener('change', function() { gameRestrictionsUpdate(this, event); }, false);
    }
}

function gameRestrictionsUpdate() {    
    switch (arguments[0].id.slice(0,-1)) {
        case ("genre"): 
            gameDivRestrictionsGenres[arguments[0].textContent.trim()] = !gameDivRestrictionsGenres[arguments[0].textContent.trim()]; 
            if (gameDivRestrictionsGenres[arguments[0].textContent.trim()]) { gameDivRestrictionsGenresCount += 1; }
            else { gameDivRestrictionsGenresCount -= 1; }
            break;
        case ("players"): 
            gameDivRestrictionsPlayers[arguments[0].textContent.trim()] = !gameDivRestrictionsPlayers[arguments[0].textContent.trim()]; 
            if (gameDivRestrictionsPlayers[arguments[0].textContent.trim()]) { gameDivRestrictionsPlayersCount += 1; }
            else { gameDivRestrictionsPlayersCount -= 1; }
            break;        
        case ("platform"): 
        gameDivRestrictionsPlatforms[arguments[0].textContent.trim()] = !gameDivRestrictionsPlatforms[arguments[0].textContent.trim()]; 
            if (gameDivRestrictionsPlatforms[arguments[0].textContent.trim()]) { gameDivRestrictionsPlatformsCount += 1; }
            else { gameDivRestrictionsPlatformsCount -= 1; }
            break;
    }
    gameCatalogueUpdate();
}

function gameCatalogueButton(gameName) { 
    gameDivScrollPoint.scrollIntoView({ behavior: 'smooth' }); 

    gameDivUpdate(gameName);
}

function gameDivUpdate(gameName) {
    if (gameName == undefined) {
        // gameDivTitle.style.display = "none";
        // gameDivLeft.style.display = "none";
        // gameDivRight.style.display = "none";
    }
    else {
        gameDivTitle.style.display = "";
        gameDivLeft.style.display = "";
        gameDivRight.style.display = "";

        gameDivTitle.innerHTML = ``;
        gameDivLeft.innerHTML = ``;
        gameDivRight.innerHTML = ``;

        gameDivTitle.append(getTitle(gameName));
        
        gameDivLeft.append(getTags(gameName));        
        gameDivLeft.append(getDate(gameName));        
        gameDivLeft.append(getDescription(gameName));
        gameDivLeft.append(getTeamMembers(gameName));
                
        gameDivRight.append(getScreenshots(gameName));        
        gameDivRight.append(getPlatformIcons(gameName));

        let h3Font = '';
        let h3Size = 1.15;
        
        switch (gameName) {
            case ("xeno_duel"): 
                gameDiv.style.backgroundImage = `url("images/game_bgs/xeno_duel_bg.png")`;  
                h3Font = 'VenusRising';
                h3Size = 1.15;
                break;
            case ("soleil_survivor"): 
                gameDiv.style.backgroundImage = `url("images/game_bgs/soleil_survivor_bg.png")`; 
                h3Font = 'Cryptik';
                h3Size = 1.5;
                break;
            case ("descendant"): 
                gameDiv.style.backgroundImage = `url("images/game_bgs/descendant_bg.png")`; 
                h3Font = 'Mordred';
                h3Size = 1.25;
                break;
            case ("scrabbleman"): 
                gameDiv.style.backgroundImage = `url("images/game_bgs/scrabbleman_bg.png")`; 
                h3Font = 'Arial';
                h3Size = 1.15;
                break;
        }

        const h3s = document.querySelectorAll('#gameDiv h3');
        h3s.forEach(h3 => {
            h3.style.fontFamily = h3Font;
            h3.style.fontSize = h3Size + `em`;
        });
    }
}

function getTitle(gameName) {    
    const title = document.createElement('article');
    switch (gameName) {
        case ("xeno_duel"):
            title.innerHTML = `<h2>XENO DUEL</h2>`;
            title.style.fontFamily = `VenusRising`;
            // title.style.fontSize = `5vw`;
            // title.style.color = `#ff0000`;
            break;
        case ("soleil_survivor"):
            title.innerHTML = `<h2>SOLEIL SURVIVOR</h2>`;
            title.style.fontFamily = `Cryptik`;
            title.style.fontSize = `2.5vh`;
            break;
        case ("descendant"):
            title.innerHTML = `<h2>DESCENDANT</h2>`;
            title.style.fontFamily = `Mordred`;
            title.style.fontSize = `2.5vh`;
            break;
        case ("scrabbleman"):
            title.innerHTML = `<h2>SCRABBLEMAN</h2>`;
            title.style.fontFamily = `Arial`;
            title.style.fontSize = `2.5vh`;
            break;
    }
    return title;
}

function getTags(gameName) {    
    const tags = document.createElement('article');
    
    const row = document.createElement('div');
    row.className = "gameDivHalfRow";
    row.innerHTML = `<h3>GENRE:</h3>`;

    switch (gameName) {
        case ("xeno_duel"):
            row.innerHTML += `<h4>Strategy</h4>`;
            // tags.style.fontFamily = `VenusRising`;
            break;
        case ("soleil_survivor"):
            row.innerHTML += `<h4>3D, Action</h4>`;
            // tags.style.fontFamily = `Cryptik`;
            break;
        case ("descendant"):
            row.innerHTML += `<h4>RPG, Rougelite</h4>`;
            // tags.style.fontFamily = `Mordred`;
            break;
        case ("scrabbleman"):
            row.innerHTML += `<h4>Puzzle, Spelling</h4>`;
            // tags.style.fontFamily = `Arial`;
            break;
    }

    tags.appendChild(row);
    return tags;
}

function getDate(gameName) {    
    const date = document.createElement('article');
    
    const row = document.createElement('div');
    row.className = "gameDivHalfRow";

    row.innerHTML = `<h3>PUBLISHED:</h3>`;
    switch (gameName) {
        case ("xeno_duel"):
            row.innerHTML += `<h4>June 2025</h4>`;
            // date.style.fontFamily = `VenusRising`;
            // date.style.fontSize = `1.5vw`;
            break;
        case ("soleil_survivor"):
            row.innerHTML += `<h4>Oct 2024</h4>`;
            // date.style.fontFamily = `Cryptik`;
            // date.style.fontSize = `2.5vw`;
            break;
        case ("descendant"):
            row.innerHTML += `<h4>Jul 2024 (Demo)</h4>`;
            // date.style.fontFamily = `Mordred`;
            // date.style.fontSize = `2.5vw`;
            break;
        case ("scrabbleman"):
            row.innerHTML += `<h4>Jun 2024</h4>`;
            // date.style.fontFamily = `Arial`;
            // date.style.fontSize = `2.5vw`;
            break;
    }

    date.appendChild(row);
    return date;
}

function getDescription(gameName) {    
    const date = document.createElement('article');
    switch (gameName) {
        case ("xeno_duel"):
            date.innerHTML = `<p>
                At some point someone must have asked: “What if chess had aliens with rocket launchers?”<br><br>
                Two players command opposing factions of colorful aliens, fighting for dominance of an unknown planet. 
				Armies are comprised of disposable yet numerous Soldiers, powerful Tanks, and supportive UFOs, each with unique attack methods and ranges. 
				To claim victory, each army maneuvers around the battlefield to take control of the central area for a specified number of turns. 
				But if that fails, they can just blow up all of their opponents.
            </p>`;
            break;
        case ("soleil_survivor"):
            date.innerHTML = `<p>
                Control a lost shadow creature that is being hunted by a gang of solar-powered skulls in a gloomy forest. 
                The sun rays are harmful to the creature's shadowy body, so aim to avoid them for as long as possible! 
                Features a leaderboard and records to save players' top performances and controller support.
            </p>`;
            break;
        case ("descendant"):
            date.innerHTML = `<p>Descendant is a 2D dungeon exploration game with roguelite elements and turn-based RPG combat. 
            Controlling a team of 4 characters, the player explores a mysterious cave filled with dangerous enemies, mystical locations and unclaimed treasure. 
            Go as deep into the cave as you can to discover the true its origin and true nature.</p>`;
            break;
        case ("scrabbleman"):
            date.innerHTML = `<p>
                A word puzzle game that combines elements of Hangman and Scrabble. 
                The objective is to solve a series of word-guessing puzzles while strategically choosing uncommon letters. 
                Players are awarded points based on their speed and ability to select low-value letters.
            </p>`;
            break;
    }
    return date;
}

function getTeamMembers(gameName) {    
    const teamMembers = document.createElement('article');
    teamMembers.innerHTML = `<h3>TEAM MEMBERS:</h3>`;
    switch (gameName) {
        case ("xeno_duel"):            
            teamMembers.innerHTML += `<ul>
                <li> Daniel Madan - Gameplay programmer, Menu programmer, Main menu & drafting music) </li>
                <li> Roberto Meznaric (<a href = "https://maxgamestudio.com" target="_blank">MAX Game Studio</a>) - Gameplay programmer, Scenario designer, Lead artist & 3D modeler, Battle & victory music) </li>
            </ul>`;
            break;
        default:
            teamMembers.innerHTML = ``;
            break;
    }
    return teamMembers;
}

function getScreenshots(gameName) {    
    const section = document.createElement('article');
    section.className = "gameDivScreenshotSection";
    
    let j = 4;

    switch (gameName) {
        case ("soleil_survivor"): j = 2; break;
        case ("scrabbleman"): j = 3; break;
    }

    const newGameDivScreenshotBig = document.createElement('article');
    newGameDivScreenshotBig.className = "gameDivHalfScreenshotBig";
    newGameDivScreenshotBig.id = "gameDivHalfScreenshotBig";
    gameDivScreenshotBig = newGameDivScreenshotBig;
    
    gameDivScreenshotBig.innerHTML = `<img src="images/game_screenshots/${gameName}${1}.png>`;

    updateScreenshotBig(gameName);
    
    section.append(gameDivScreenshotBig);

    for (let i = 0; i < j; i++) { 
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
    
    platforms.innerHTML = `<h3 style="margin-bottom: 1vw;">PLAY IT NOW!</h3>`;

    switch (gameName) {
        case ("xeno_duel"):
            platforms.innerHTML += `
                <a href = "https://play.google.com/store/apps/details?id=com.maxgamestudio.xenoduel" target="_blank" title="Play on Android"> <img class="gameDivPlatform" src="images/social_icons/logo_android.png"> </a>
                <a href = "https://apps.apple.com/us/app/xeno-duel/id6746754543" target="_blank" title="Play on Apple"> <img class="gameDivPlatform" src="images/social_icons/logo_apple.png"> </a>
                <a href = "https://ultrahammergames.itch.io/xeno-duel" target="_blank" title="itch.io"> <img class="gameDivPlatform" src="images/social_icons/logo_itchio.png"> </a>
            `
            break;
        case ("soleil_survivor"):
            platforms.innerHTML += `
                <a href = "https://store.steampowered.com/app/3222430/Soleil_Survivor/" target="_blank" title="Play on Steam"> <img class="gameDivPlatform"  src="images/social_icons/logo_steam.png"> </a>
                <a href = "https://ultrahammergames.itch.io/soleil-survivor" target="_blank" title="Steam"> <img class="gameDivPlatform"  src="images/social_icons/logo_itchio.png"> </a>
            `
            break;
        case ("descendant"):
            platforms.innerHTML += `
                <a href = "https://store.steampowered.com/app/3024520/Descendant/?beta=0" target="_blank" title="Play on Steam"> <img class="gameDivPlatform"  src="images/social_icons/logo_steam.png"> </a>
                <a href = "https://ultrahammergames.itch.io/descendant" target="_blank" title="Steam"> <img class="gameDivPlatform"  src="images/social_icons/logo_itchio.png"> </a>
            `
            break;
        case ("scrabbleman"):
            platforms.innerHTML += `
                <a href = "https://store.steampowered.com/app/3000990/Scrabbleman/" target="_blank" title="Play on Steam"> <img class="gameDivPlatform"  src="images/social_icons/logo_steam.png"> </a>
                <a href = "https://ultrahammergames.itch.io/scrabbleman" target="_blank" title="Steam"> <img class="gameDivPlatform"  src="images/social_icons/logo_itchio.png"> </a>
            `
            break;
    }

    `<table class="footerTable">
                    <tr>
                        <th> <a href = "https://store.steampowered.com/search/?developer=Ultra%20Hammer%20Games" target="_blank" title="Steam"> <img src="images/social_icons/logo_steam.png"> </a> </th>
                        <th> <a href = "https://ultrahammergames.itch.io/" target="_blank" title="itch.io"> <img src="images/social_icons/logo_itchio.png"> </a> </th>
                        <th> <a href = "https://www.linkedin.com/company/ultrahammergames" target="_blank" title="LinkedIn"> <img src="images/social_icons/logo_linkedin.png"> </a> </th>
                        <th> <a href = "https://discord.gg/yUeUxNrTTu" target="_blank" title="Discord server"> <img src="images/social_icons/logo_discord.png"> </a> </th>
                        <th> <a href = "https://www.youtube.com/@UltraHammerGames" target="_blank" title="YouTube"> <img src="images/social_icons/logo_youtube.png"> </a> </th>
                        <th> <a href = "https://www.instagram.com/ultrahammergames/" target="_blank" title="Instagram"> <img src="images/social_icons/logo_instagram.png"> </a> </th>
                        <th> <a href = "https://x.com/UltraHammerGame" target="_blank" title="Twitter/X"> <img src="images/social_icons/logo_twitter.png"> </a> </th>
                        <th> <a href = "https://www.reddit.com/r/UltraHammerGames/" target="_blank" title="Reddit"> <img src="images/social_icons/logo_reddit.png"> </a> </th>
                    </tr>
                </table>`
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