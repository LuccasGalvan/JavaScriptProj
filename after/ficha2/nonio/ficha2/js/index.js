"use strict";

const panelControl = document.querySelector("#panel-control");
const panelGame = document.querySelector("#game");
const btLevel = document.querySelector("#btLevel");
const btPlay = document.querySelector("#btPlay");
const TIMEOUTGAME = 20;
let labelGameTime = document.querySelector("#gameTime");
let timer;
let timerId;
let message = document.querySelector("#message");
let itemList = document.querySelectorAll(".list-item");
let cards = document.querySelectorAll(".card");
let labelPoints = document.querySelector("#points");
let messageGameOver = document.querySelector("#messageGameOver");
let totalPoints;

let cardsLogos = [
  "angular",
  "bootstrap",
  "html",
  "javascript",
  "vue",
  "svelte",
  "react",
  "css",
  "backbone",
  "ember",
];

let topGamers = [{ nickname: "filho duma puta", points: 666 }, {nickname: "corninho", points: 3}];

let numCards;
let flippedCards = [];
let totalFlippedCards;

function getTop10() {
  let infoTop = document.querySelector("#infoTop");
  //let top10String = "";

  for (let i = 0; i < topGamers.length; i++) {
    let person = topGamers[i];

    let div = document.createElement("div");
    div.setAttribute("class", "info");
    div.setAttribute("id", "infoTop");
    let player = document.createElement("p");
    player.textContent = person.nickname;
    div.appendChild(player);
    let score = document.createElement("p");
    score.textContent = person.points;
    div.appendChild(score);

    let position = div.cloneNode(true);
    infoTop.appendChild(position);

    //let player = topGamers[i];
    //top10String += player.nickname + '-' + player.points + '<br>';
    //infoTop.innerHTML = top10String;
  }
}

function reset() {
  panelGame.style.display = "none";
  message.classList.remove("hide");

  if (btLevel.value == "0") {
    btPlay.disabled = true;
    message.textContent = "Clique em iniciar o jogo!";
  } else {
    btPlay.disabled = false;
    panelGame.style.display = "grid";
    message.textContent = "";
  }

  itemList.forEach((element) => {
    element.classList.remove("gameStarted");
  });

  labelGameTime.removeAttribute("style");

  labelGameTime.textContent = 0;

  totalPoints = 0;
  labelPoints.textContent = totalPoints;

  createPanelGame();
}

function createPanelGame() {
  panelGame.innerHTML = "";
  let div = document.createElement("div");
  div.setAttribute("class", "card");
  let imgBack = document.createElement("img");
  imgBack.setAttribute("src", "images/ls.png");
  imgBack.setAttribute("class", "card-back");
  div.appendChild(imgBack);
  let imgFront = document.createElement("img");
  imgFront.setAttribute("class", "card-front");
  div.appendChild(imgFront);

  if (btLevel.value == "1") {
    numCards = 6;
    panelGame.classList.add("basico");
  } else if (btLevel.value == "2") {
    numCards = 12;
    panelGame.classList.add("intermedio");
  } else if (btLevel.value == "3") {
    numCards = 20;
    panelGame.classList.add("avancado");
  }

  for (let i = 0; i < numCards; i++) {
    let card = div.cloneNode(true);
    panelGame.appendChild(card);
  }
  cards = panelGame.childNodes;
}

function startGame() {
  if (btPlay.textContent == "Terminar Jogo") {
    stopGame();
  } else {
    btLevel.disabled = true;
    btPlay.textContent = "Terminar Jogo";
    message.classList.add("hide");

    itemList.forEach((element) => {
      element.classList.add("gameStarted");
    });
    cards.forEach((element) => {
      element.addEventListener("click", funcClickCard, { once: true });
    });
    flippedCards = [];
    totalFlippedCards = 0;
    //showCards();

    if (btLevel.value == "1") {
      timer = TIMEOUTGAME;
    } else if (btLevel.value == "2") {
      timer = TIMEOUTGAME * 3;
    } else if (btLevel.value == "3") {
      timer = TIMEOUTGAME * 6;
    }

    timerId = setInterval(updateGameTime, 1000);

    totalPoints = 0;

    getTopPoints();
  }

  shuffleArray(cardsLogos);

  let [indice, newCardLogos] = [0, cardsLogos.slice(0, cards.length / 2)];
  newCardLogos = [...newCardLogos, ...newCardLogos];
  shuffleArray(newCardLogos);

  for (let card of cards) {
    card.querySelector(
      ".card-front"
    ).src = `images/${newCardLogos[indice]}.png`;
    card.dataset.logo = newCardLogos[indice++];
  }
}

function getTopPoints(){
  let pointsTop = document.querySelector("#pointsTop");
  let highest = 0;

  for(let i = 0; i<=topGamers.length; i++){
    if(topGamers[i].points > highest){
      highest = topGamers[i].points;
      pointsTop.textContent = highest;
    }
  }
}

function updatePoints(operation = "+") {
  operation === "+"
    ? (totalPoints += timer * (cards.length / 2))
    : totalPoints < 5
    ? (totalPoints = 0)
    : (totalPoints -= 5);
  labelPoints.textContent = totalPoints;
}

function updateGameTime() {
  timer--;
  labelGameTime.textContent = timer;

  if (timer <= 10) labelGameTime.style.backgroundColor = "red";

  if (timer == 0) stopGame();
}

function flipCard(selectedCard) {
  selectedCard.classList.add("flipped");
  flippedCards.push(selectedCard);
  if (flippedCards.length === 2) checkPair();
}

function stopGame() {
  btPlay.textContent = "Iniciar Jogo";
  btLevel.disabled = false;
  //hideCards();
  messageGameOver.textContent = `Pontuação: ${labelPoints.textContent}`;
  modalGameOver.style.display = "block";

  cards.forEach((element) => {
    element.classList.remove("flipped");
    element.classList.remove("inative");
    element.classList.remove("grayscale");
    element.removeEventListener("click", funcClickCard);
  });

  clearInterval(timerId);
  checkTop10();
  reset();
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

function showCards() {
  cards.forEach((element) => {
    element.classList.add("flipped");
  });
}

function hideCards() {
  cards.forEach((element) => {
    element.classList.remove("flipped");
  });
}

function checkPair() {
  let [card1, card2] = flippedCards;

  if (card1.dataset.logo == card2.dataset.logo) {
    console.log("São Iguais!");

    setTimeout(() => {
      flippedCards.forEach((element) => {
        element.classList.add("inative");
        element.querySelector(".card-front").classList.add("grayscale");
      });

      flippedCards = [];
      updatePoints("+");
    }, 500);

    totalFlippedCards += 2;
    if (gameOver()) {
      stopGame();
    }
  } else {
    console.log("Não são iguais!");

    setTimeout(() => {
      flippedCards.forEach((element) => {
        element.classList.remove("flipped");
        element.addEventListener("click", funcClickCard);
      });
      flippedCards = [];
      updatePoints("-");
    }, 500);
  }
}

function checkTop10(){
  let currentScore = parseInt(labelPoints.textContent);
  let nick = document.querySelector("#nickname");

  if(topGamers.length < 10 || currentScore > getLastPoints()){
    nick.display = 'block';
    messageGameOver.innerHTML = "<br>Parabéns, você é um cornasso!";
  }
}

function getLastPoints(){
  return topGamers[topGamers.length - 1].points;
}

function saveTop10(){
  const nickname = document.querySelector("#inputNick");
  let currentScore = parseInt(labelPoints.textContent);
  const player = {nickname, currentScore};

}

function funcClickCard(e) {
  flipCard(this);
}

function gameOver() {
  return totalFlippedCards === cards.length;
}

btLevel.addEventListener("change", reset);
btPlay.addEventListener("click", startGame);
btTop.addEventListener("click", getTop10);

reset();
