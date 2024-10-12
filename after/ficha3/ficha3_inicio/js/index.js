'use strict';
const panelControl = document.querySelector('#panel-control');
const panelGame = document.querySelector('#game');
const btLevel = document.querySelector('#btLevel');
const btPlay = document.querySelector('#btPlay');


// ------------------------
// Funções Genéricas
// ------------------------
function reset() {

     message.classList.remove('hide');
     if (btLevel.value === '0')
          btPlay.disabled = true
     else {
          btPlay.disabled = false;
          panelGame.style.display = 'grid';
     }
     const elementos = panelControl.querySelectorAll('.list-item');
     elementos.forEach(elemento => {
          elemento.classList.remove('gameStarted');
     });
}

function startGame() {
     message.classList.add('hide');
     btLevel.disabled = true;
     btPlay.textContent = 'Terminar Jogo';
     const elementos = panelControl.querySelectorAll('.list-item');
     elementos.forEach(elemento => {
          elemento.classList.add('gameStarted')
     });

}
function stopGame() {
     btPlay.textContent = 'Iniciar Jogo'
     btLevel.disabled = false;
     reset();
}

// ------------------------
// Event Listeners
// ------------------------
btLevel.addEventListener('change', reset);
btPlay.addEventListener('click', () => (btPlay.textContent == 'Terminar Jogo') ? stopGame() : startGame());


reset();