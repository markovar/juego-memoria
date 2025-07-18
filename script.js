// Game sentences - each will appear twice
const sentences = [
    { id: 1, text: "🙏 Comenzar el día con Dios" },
    { id: 2, text: "📖 Leer y meditar diariamente en la Palabra de Dios" },
    { id: 3, text: "🤔 Involucrar a Dios en tus decisiones diarias" },
    { id: 4, text: "✨ Glorificar a Dios en todo lo que hagas" },
    { id: 5, text: "💬 Cultivar una conversación constante con Dios" },
    { id: 6, text: "🔍 Examinar tu corazón al final del día" },
    { id: 7, text: "🪞 Refleja el carácter de Cristo en cada relación" },
    { id: 8, text: "🧠 Llenar tu mente con lo que agrada a Dios" },
    { id: 9, text: "🤲 Servir con intención y amor" },
    { id: 10, text: "⏳ Redime tu tiempo" }
];

// Game state
let gameBoard = [];
let flippedCards = [];
let matchedPairs = 0;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let isProcessing = false;

// Initialize the game
function initGame() {
    gameBoard = createGameBoard();
    matchedPairs = 0;
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    flippedCards = [];
    isProcessing = false;
    
    // Clear any winner animations
    const body = document.body;
    body.classList.remove('winner-player1', 'winner-player2', 'winner-tie', 'winner-frozen-player1', 'winner-frozen-player2', 'winner-frozen-tie');
    
    // Clear any phrases list and reset grid
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    
    // Reset current turn indicator
    const currentTurnElement = document.querySelector('.current-turn');
    if (currentTurnElement) {
        currentTurnElement.classList.remove('falling');
    }
    
    // Reset all UI elements that might have fallen
    const uiElements = [
        document.querySelector('h1'),
        document.querySelector('.game-info'),
        document.querySelector('.win-message')
    ];
    
    uiElements.forEach(element => {
        if (element) {
            element.classList.remove('falling');
        }
    });
    
    updateScore();
    updateCurrentPlayer();
    renderBoard();
    document.getElementById('winMessage').style.display = 'none';
    
    // Reset win message color
    document.getElementById('winMessage').style.color = '#27ae60';
}

// Create the game board with sentences placed randomly
function createGameBoard() {
    const sentencePairs = [];
    
    // Create pairs of sentences
    sentences.forEach(sentence => {
        sentencePairs.push(sentence, sentence);
    });
    
    // Shuffle the sentence pairs and return as board
    return shuffle(sentencePairs);
}

// Shuffle array function
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render the game board
function renderBoard() {
    const grid = document.getElementById('gameGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;
        
        // Card with sentence
        card.textContent = i + 1; // Show position number
        card.onclick = () => flipCard(i);
        
        // Check if card is already matched or flipped
        if (isCardMatched(i)) {
            card.classList.add(`matched-player${gameBoard[i].matchedBy}`);
            card.textContent = gameBoard[i].text;
        } else if (flippedCards.includes(i)) {
            card.classList.add(`flipped-player${currentPlayer}`);
            card.textContent = gameBoard[i].text;
        }
        
        grid.appendChild(card);
    }
}

// Check if a card is already matched
function isCardMatched(index) {
    return gameBoard[index] && gameBoard[index].matched;
}

// Flip a card
function flipCard(index) {
    if (isProcessing || flippedCards.includes(index) || isCardMatched(index)) {
        return;
    }
    
    flippedCards.push(index);
    renderBoard();
    
    if (flippedCards.length === 2) {
        isProcessing = true;
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [first, second] = flippedCards;
    const firstCard = gameBoard[first];
    const secondCard = gameBoard[second];
    
    if (firstCard.id === secondCard.id) {
        // Match found - current player gets a point and continues
        firstCard.matched = true;
        secondCard.matched = true;
        firstCard.matchedBy = currentPlayer;
        secondCard.matchedBy = currentPlayer;
        matchedPairs++;
        
        // Award point to current player
        if (currentPlayer === 1) {
            player1Score++;
        } else {
            player2Score++;
        }
        
        updateScore();
        
        if (matchedPairs === 10) {
            showWinner();
        }
    } else {
        // No match - switch to other player
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateCurrentPlayer();
    }
    
    flippedCards = [];
    isProcessing = false;
    renderBoard();
    
    // If there was a match, make unmatched cards shake with fear
    if (firstCard.id === secondCard.id && matchedPairs < 10) {
        setTimeout(() => {
            shakeUnmatchedCards();
        }, 200); // Give time for the board to re-render
    }
}

// Update score display
function updateScore() {
    document.getElementById('matches').textContent = matchedPairs;
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
}

// Update current player display
function updateCurrentPlayer() {
    const currentPlayerElement = document.getElementById('current-player');
    const playerName = currentPlayer === 1 ? '👩 Mujeres' : '👨 Hombres';
    currentPlayerElement.textContent = playerName;
    
    // Update current player text color
    const playerColor = currentPlayer === 1 ? '#c2185b' : '#1976d2';
    currentPlayerElement.style.color = playerColor;
    
    // Update "Encontrados" text color
    const scoreElement = document.querySelector('.score');
    scoreElement.style.color = playerColor;
    
    // Update title color
    const titleElement = document.querySelector('h1');
    titleElement.style.color = playerColor;
    
    // Update background color
    const body = document.body;
    body.classList.remove('player1-turn', 'player2-turn');
    body.classList.add(`player${currentPlayer}-turn`);
    
    // Update player highlighting
    const player1Element = document.getElementById('player1');
    const player2Element = document.getElementById('player2');
    
    if (currentPlayer === 1) {
        player1Element.classList.add('active');
        player2Element.classList.remove('active');
    } else {
        player2Element.classList.add('active');
        player1Element.classList.remove('active');
    }
}

// Make cards fall based on game result
function animateCardsFalling(result) {
    const cards = document.querySelectorAll('.card');
    let cardsToFall = [];
    let winnerCards = [];
    
    // Always make the current turn indicator fall when game ends
    const currentTurnElement = document.querySelector('.current-turn');
    setTimeout(() => {
        currentTurnElement.classList.add('falling');
    }, 500); // Slight delay before current turn indicator falls
    
    if (result === 'tie') {
        // All cards fall if tied
        cardsToFall = Array.from(cards);
    } else if (result === 'player1-wins') {
        // Player 2's cards fall (blue cards) + any unmatched cards
        cardsToFall = Array.from(cards).filter(card => 
            card.classList.contains('matched-player2') || 
            (!card.classList.contains('matched-player1') && !card.classList.contains('matched-player2'))
        );
        // Player 1's cards (winners) fall later
        winnerCards = Array.from(cards).filter(card => card.classList.contains('matched-player1'));
    } else if (result === 'player2-wins') {
        // Player 1's cards fall (pink cards) + any unmatched cards
        cardsToFall = Array.from(cards).filter(card => 
            card.classList.contains('matched-player1') || 
            (!card.classList.contains('matched-player1') && !card.classList.contains('matched-player2'))
        );
        // Player 2's cards (winners) fall later
        winnerCards = Array.from(cards).filter(card => card.classList.contains('matched-player2'));
    }
    
    // Add staggered falling animation with random delays for more natural effect
    cardsToFall.forEach((card, index) => {
        const randomDelay = Math.random() * 200 + index * 50; // Random delay between 0-200ms + index offset
        setTimeout(() => {
            card.classList.add('falling');
        }, randomDelay);
    });
    
    // Make winner cards fall 2 seconds before phrases appear (at 6 seconds)
    if (winnerCards.length > 0) {
        setTimeout(() => {
            winnerCards.forEach((card, index) => {
                const randomDelay = Math.random() * 100 + index * 30;
                setTimeout(() => {
                    card.classList.add('falling');
                }, randomDelay);
            });
        }, 6000); // 6 seconds delay - winner cards fall at 6s, phrases appear at 8s
    }
    
    // After all cards have fallen, show phrases list (after 8 seconds)
    setTimeout(() => {
        showPhrasesList();
    }, 8000); // 8 second delay before showing phrases
}

// Show the complete list of phrases
function showPhrasesList() {
    const grid = document.getElementById('gameGrid');
    
    const phrasesListHTML = `
        <div class="phrases-list">
            <h2>📖 LAS 10 MANERAS PARA EJERCITAR LA PIEDAD</h2>
            <ul>
                ${sentences.map(sentence => `<li>${sentence.text}</li>`).join('')}
            </ul>
        </div>
    `;
    
    grid.innerHTML = phrasesListHTML;
}

// Make unmatched cards shake with fear
function shakeUnmatchedCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card) => {
        const cardIndex = parseInt(card.dataset.index);
        
        // Only shake cards that are not matched yet and are not currently flipped
        if (gameBoard[cardIndex] && 
            !gameBoard[cardIndex].matched && 
            !card.classList.contains('matched-player1') && 
            !card.classList.contains('matched-player2') &&
            !card.classList.contains('flipped-player1') &&
            !card.classList.contains('flipped-player2')) {
            
            // Add random delay to make it more natural
            const randomDelay = Math.random() * 150;
            
            setTimeout(() => {
                card.classList.add('shaking');
                
                // Remove shaking class after animation completes
                setTimeout(() => {
                    card.classList.remove('shaking');
                }, 800); // Duration of shake animation
                
            }, randomDelay);
        }
    });
}

// Make all UI elements fall down
function makeUIElementsFall() {
    const elementsToFall = [
        document.querySelector('h1'),              // Title
        document.querySelector('.game-info'),     // Player scores and "Encontrados"
        document.querySelector('.win-message')    // Winning message
    ];
    
    // Add staggered falling animation to each element
    elementsToFall.forEach((element, index) => {
        if (element) {
            setTimeout(() => {
                element.classList.add('falling');
            }, index * 300); // 300ms delay between each element
        }
    });
}

// Show winner
function showWinner() {
    const winMessage = document.getElementById('winMessage');
    const body = document.body;
    const titleElement = document.querySelector('h1');
    const scoreElement = document.querySelector('.score');
    
    // Remove current turn classes
    body.classList.remove('player1-turn', 'player2-turn');
    
    // Set all text to white when game ends
    winMessage.style.color = 'white';
    titleElement.style.color = 'white';
    scoreElement.style.color = 'white';
    
    let result;
    if (player1Score > player2Score) {
        winMessage.textContent = `🎉 ¡👩 Mujeres Ganan! (${player1Score} - ${player2Score}) 🎉`;
        body.classList.add('winner-player1');
        result = 'player1-wins';
    } else if (player2Score > player1Score) {
        winMessage.textContent = `🎉 ¡👨 Hombres Ganan! (${player2Score} - ${player1Score}) 🎉`;
        body.classList.add('winner-player2');
        result = 'player2-wins';
    } else {
        winMessage.textContent = `🎉 ¡Empate! (${player1Score} - ${player2Score}) 🎉`;
        body.classList.add('winner-tie');
        result = 'tie';
    }
    
    winMessage.style.display = 'block';
    
    // Start the falling animation after a short delay
    setTimeout(() => {
        animateCardsFalling(result);
    }, 500);
    
    // After 10 seconds, stop blinking and freeze in winning color
    setTimeout(() => {
        body.classList.remove('winner-player1', 'winner-player2', 'winner-tie');
        
        let frozenClass;
        if (result === 'player1-wins') {
            frozenClass = 'winner-frozen-player1';
        } else if (result === 'player2-wins') {
            frozenClass = 'winner-frozen-player2';
        } else {
            frozenClass = 'winner-frozen-tie';
        }
        
        body.classList.add(frozenClass);
    }, 10000);
    
    // After 20 seconds, make all remaining UI elements fall down
    setTimeout(() => {
        makeUIElementsFall();
    }, 20000);
}

// Reset the game
function resetGame() {
    initGame();
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame); 