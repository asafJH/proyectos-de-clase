// Referencias a los elementos del DOM
const buttons = document.querySelectorAll('.choice-button');
const resultMessage = document.getElementById('result-message');
const playerChoiceIcon = document.getElementById('player-choice-icon');
const computerChoiceIcon = document.getElementById('computer-choice-icon');
const playerScoreSpan = document.getElementById('player-score');
const computerScoreSpan = document.getElementById('computer-score');
const resetButton = document.getElementById('reset-button');

// Inicializar contadores
let playerScore = 0;
let computerScore = 0;

// Mapeo de opciones a sus íconos de Font Awesome
const choiceIcons = {
    'Piedra': 'fa-hand-rock',
    'Papel': 'fa-hand-paper',
    'Tijera': 'fa-hand-scissors'
};

// Array de opciones
const choices = ['Piedra', 'Papel', 'Tijera'];

// Evento de click para cada botón de elección
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.dataset.choice;
        playGame(playerChoice);
    });
});

// Evento para el botón de reinicio
resetButton.addEventListener('click', resetGame);

/**
 * Función principal para jugar una ronda.
 * @param {string} playerChoice - La elección del jugador.
 */
function playGame(playerChoice) {
    // Generar la elección de la computadora de forma aleatoria
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    // Mostrar los íconos de las elecciones con animación
    displayChoices(playerChoice, computerChoice);

    // Determinar el resultado de la ronda
    const result = getResult(playerChoice, computerChoice);
    updateScoreAndMessage(result);
    
    // Mostrar el botón de reiniciar si el juego no está en progreso
    if (playerScore >= 5 || computerScore >= 5) {
        endGame();
    }
}

/**
 * Muestra los íconos de las elecciones con una animación.
 * @param {string} pChoice - La elección del jugador.
 * @param {string} cChoice - La elección de la computadora.
 */
function displayChoices(pChoice, cChoice) {
    // Resetear las clases para animar la aparición de los íconos
    playerChoiceIcon.classList.remove(...Object.values(choiceIcons), 'invisible');
    computerChoiceIcon.classList.remove(...Object.values(choiceIcons), 'invisible');
    
    // Agregar las clases de los íconos correctos
    playerChoiceIcon.classList.add(choiceIcons[pChoice]);
    computerChoiceIcon.classList.add(choiceIcons[cChoice]);
}

/**
 * Determina el resultado de la ronda.
 * @param {string} pChoice - Elección del jugador.
 * @param {string} cChoice - Elección de la computadora.
 * @returns {string} El resultado de la ronda.
 */
function getResult(pChoice, cChoice) {
    if (pChoice === cChoice) {
        return "¡Empate!";
    }
    
    if (
        (pChoice === 'Piedra' && cChoice === 'Tijera') ||
        (pChoice === 'Papel' && cChoice === 'Piedra') ||
        (pChoice === 'Tijera' && cChoice === 'Papel')
    ) {
        return "¡Ganaste!";
    } else {
        return "¡Perdiste!";
    }
}

/**
 * Actualiza la puntuación y el mensaje del resultado.
 * @param {string} result - El resultado de la ronda.
 */
function updateScoreAndMessage(result) {
    resultMessage.textContent = result;
    resultMessage.classList.remove('win', 'lose', 'draw');

    if (result === "¡Ganaste!") {
        playerScore++;
        resultMessage.classList.add('win');
    } else if (result === "¡Perdiste!") {
        computerScore++;
        resultMessage.classList.add('lose');
    } else {
        resultMessage.classList.add('draw');
    }
    
    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
}

/**
 * Muestra el botón de reinicio y desactiva los botones de juego.
 */
function endGame() {
    buttons.forEach(button => button.style.pointerEvents = 'none');
    resetButton.style.opacity = '1';
    resetButton.style.visibility = 'visible';
}

/**
 * Reinicia el juego a su estado inicial.
 */
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreSpan.textContent = '0';
    computerScoreSpan.textContent = '0';
    resultMessage.textContent = '¡Elige tu movimiento!';
    resultMessage.classList.remove('win', 'lose', 'draw');
    
    playerChoiceIcon.classList.add('invisible');
    computerChoiceIcon.classList.add('invisible');
    
    buttons.forEach(button => button.style.pointerEvents = 'auto');
    resetButton.style.opacity = '0';
    resetButton.style.visibility = 'hidden';
}