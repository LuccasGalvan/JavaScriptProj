'use strict';
const panelControl = document.querySelector('#panel-control');
const panelGame = document.querySelector('#game');
const btLevel = document.querySelector('#btLevel');
const btPlay = document.querySelector('#btPlay');
const labelGameTime = document.querySelector('#gameTime');
const labelPoints = document.querySelector('#points');

let cardsLogos = ['angular', 'bootstrap', 'html', 'javascript', 'vue', 'svelte', 'react', 'css', 'backbone', 'ember'];
let cards = document.querySelectorAll('.card');
let flippedCards = [];
let totalFlippedCards = 0;

let topGamers = [
     {nickname: "", points: ""}
];

const TIMEOUTGAME = 10;
let timer;
let timerId;
let totalPoints = 0;

const gameOver = () => { return totalFlippedCards === cards.length; }

const shuffleArray = array => {
     for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
     }
}

function getTop10(){
     infoTop = document.querySelector("#infoTop");
}

function updatePoints(operation = '+') {
     operation === '+'
          ? totalPoints += (timer * (cards.length / 2))
          : totalPoints < 5 ? totalPoints = 0 : totalPoints -= 5;
     labelPoints.textContent = totalPoints;
}
function updateGameTime() {
     timer--;
     if (timer < 10) labelGameTime.style.backgroundColor = 'red';
     labelGameTime.textContent = `${timer}s`;
     if (timer == 0) stopGame();
}
function flipCard(selectedCard) {
     selectedCard.classList.add('flipped');
     flippedCards.push(selectedCard);
     if (flippedCards.length === 2)
          checkPair();
}
function checkPair() {
     let [card1, card2] = flippedCards;
     const isMatch = (card1.dataset.logo === card2.dataset.logo);
     if (isMatch) {
          setTimeout(() => {
               card1.classList.add('inative'); card2.classList.add('inative');
               card1.querySelector('.card-front').classList.add('grayscale');
               card2.querySelector('.card-front').classList.add('grayscale');
               totalFlippedCards += 2;
               updatePoints('+');
               if (gameOver()) stopGame();
          }, 500);
     }
     else {
          setTimeout(() => {
               card1.classList.remove('flipped'); card2.classList.remove('flipped');
               card1.addEventListener('click', funClickCard, { once: true });
               card2.addEventListener('click', funClickCard, { once: true });
               updatePoints('-');
          }, 500);
     }
     flippedCards = [];
}
function createPanelGame() {
     const backupCards = [...cards];
     panelGame.innerHTML = '';
     backupCards.forEach(c => panelGame.appendChild(c.cloneNode(true)));
     cards = panelGame.childNodes;
}
function reset() {
     [btLevel.disabled, btLevel.value, btPlay.disabled, panelGame.style.display, message.textContent] = [true, 1, false, 'grid', ''];
     message.classList.remove('hide');
     panelControl.querySelectorAll('.list-item').forEach(elemento => elemento.classList.remove('gameStarted'));
     createPanelGame();
     [labelGameTime.textContent, labelPoints.textContent] = [`${TIMEOUTGAME}s`, 0]
}
const createAndShuffleCards = array => {
     shuffleArray(array);
     array.splice(cards.length / 2, Number.MAX_VALUE);
     array.push(...array);
     shuffleArray(array)
}

function funClickCard() { flipCard(this); }

function startGame() {
     btPlay.textContent = 'Terminar Jogo';
     panelControl.querySelectorAll('.list-item').forEach(elemento => elemento.classList.add('gameStarted'));
     message.classList.add('hide');

     let [indice, newCardLogos] = [0, [...cardsLogos]];
     createAndShuffleCards(newCardLogos);
     for (let card of cards) {
          card.querySelector('.card-front').src = `images/${newCardLogos[indice]}.png`;
          card.dataset.logo = newCardLogos[indice++];
          card.addEventListener('click', funClickCard, { once: true });
     }
     [flippedCards, totalFlippedCards, totalPoints] = [[], 0, 0];
     [timer, timerId] = [TIMEOUTGAME, setInterval(updateGameTime, 1000)];
     [labelGameTime.textContent, labelPoints.textContent] = [`${timer}s`, 0];
     labelGameTime.removeAttribute('style');
}
function stopGame() {
     [btPlay.textContent, modalGameOver.style.display, document.querySelector('#messageGameOver').textContent] = ['Iniciar Jogo', 'block', `Pontuação:${totalPoints}`];
     clearInterval(timerId);
     reset();
}
btLevel.addEventListener('change', reset);
btPlay.addEventListener('click', () => btPlay.textContent === 'Terminar Jogo' ? stopGame() : startGame());
panelGame.addEventListener('click', () => message.textContent === '' ? message.textContent = 'Clique em Iniciar o Jogo!' : message.textContent = '');

reset();

