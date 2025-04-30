const state = {
    score:{
        playerScore:0,
        computerScore:0,
        scroreBox: document.getElementById('score_points')   
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards:{
        player:document.getElementById('player-field-card'),
        computer:document.getElementById('computer-field-card'),
    },
    playerSide: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    
    },
}

 
const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id:0,
        name:"Blue-Eyes White Dragon",
        type:"Paper",
        img: `${pathImages}whiteDragon.png`,
        WinOf:[],
        LoseOf:[2, 3],
    
    },
    {
        id:1,
        name:"Palladium Oracle Mahad",
        type:"Rock",
        img: `${pathImages}paladdium.png`,
        WinOf:[2, 3],
        LoseOf:[0],
        
    },
    {
        id:2,
        name:"Slifer the Sky Dragon",
        type:"Scissors",
        img: `${pathImages}slifer.jpeg`,
        WinOf:[0],
        LoseOf:[1,3],
    },
    {
        id:3,
        name:"Magician of Black Chaos",
        type:"Water",
        img: `${pathImages}magician.png`,
        WinOf:[0, 2],
        LoseOf:[1],
    }
]


async function getIdAleatorioCarta() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, quemRecebe){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(quemRecebe === state.playerSide.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard)
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });    
    }

    return cardImage;
}
    
async function setCardsField(cardId){
    cardId = parseInt(cardId);
    await removeAllCardsImages();

    let computerCardId = await getIdAleatorioCarta();

    await showHiddenCardFieldsImages(true)
    
    await hiddenCardDetails();

    await drawCardsInFields(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Card Name";
    state.cardSprites.type.innerText = "Attribute: ";
    
}


async function drawCardsInFields(cardId, computerCardId){ 
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {

    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }else{
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function updateScore() {
    state.score.scroreBox.innerText = `Win : ${state.score.playerScore} 
    | Lose: ${state.score.computerScore}`;
}

async function drawButton(texto) {
    state.actions.button.innerText = texto.toUpperCase();
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResult = "draw";
    const playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResult = "win";
        state.score.playerScore++;
        await playAudio(duelResult);
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        duelResult = "lose";
        state.score.computerScore++;
        await playAudio(duelResult);
    }

    // Verifica se algum jogador atingiu 11 pontos
    if (state.score.playerScore >= 10 || state.score.computerScore >= 10) {
        state.actions.button.disabled = true;
        alert("🏁 Fim de jogo! " + 
              (state.score.playerScore >= 11 ? "Você venceu!" : "O computador venceu!"));
    }

    return duelResult;
}

async function removeAllCardsImages(){
    let cards = state.playerSide.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
 
    cards = state.playerSide.player1Box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}


async function drawCards(qtdCartas, quemRecebe){
    for(let i = 0; i < qtdCartas; i++){
        const randomIdCard = await getIdAleatorioCarta();
        const cardImage = await createCardImage(randomIdCard, quemRecebe);

        document.getElementById(quemRecebe).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}


async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
    audio.volume = 0.2; 
    
}

function init(){
    showHiddenCardFieldsImages(false)

    drawCards(5, state.playerSide.player1);
    drawCards(5, state.playerSide.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
    bgm.volume = 0.3;   
}

init();