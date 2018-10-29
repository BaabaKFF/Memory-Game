/*
 * PROJECT INSTRUCTIONS
 * Create a list that holds all of your cards
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// CREATING A LIST THAT HOLDS ALL THE PLAYING CARDS
const deck = document.querySelector('.deck');

//SETTING UP AN EVENT LISTENER FOR A CARD CLICK. It shows what happens on the deck with every card click
 
deck.addEventListener('click', event => {// This is the event listener(handler) for the  determine the outcome of clicking a card
    const clickTarget = event.target;
    if (isClickValid(clickTarget)) {
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (clockOff) { // activates the timer when the first card is clicked
            startClock();
            clockOff = false;
        }
        if (toggledCards.length === 2) {  
            addMove();
            checkForMatch(clickTarget);
            checkScore();
        }
    }
});

    /*
    * Validating a click 
    * The conditions stated in the function are to check that;
    *  - the clicked target has a 'card' class 
    *  - a 'match' class(after being checked for a match with a previously clicked and open card)
    *  - the toggle card array contains two or less cards
    *  - and whether or not the tarket being clicked has not already being click in this event.
    */

    function isClickValid(clickTarget) {
        return(
            clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)
            );
    }

    function toggleCard(card){ //This is the function to toggle cards on and off
        card.classList.toggle('open');
        card.classList.toggle('show');
    }

    // Storing the cards in an array
    let toggledCards = [];

    function addToggleCard(clickTarget){ // This is the card storing function. It pushes a card into the toggledCards array when a card is clicked
        toggledCards.push(clickTarget);
        console.log(toggledCards);
    }

    function checkForMatch() { // This is the matching function. It checks to see if cards from the deck that we click on, which go into the array, match or not
        const total_pairs = 8;
        if (toggledCards[0].innerHTML === toggledCards[1].innerHTML) {
            toggledCards[0].classList.toggle('match');
            toggledCards[1].classList.toggle('match');
            toggledCards = [];
            matched++;
            console.log(matched);
            if (matched === total_pairs) {
                gameOver();
                console.log("Game Over!");
            }
        } else {
            setTimeout(() => {
                toggleCard(toggledCards[0]);
                toggleCard(toggledCards[1]);
                toggledCards = [];
                }, 1000);
            }
    }

/*
 * SHUFFLING THE DECK
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) { //function will randomly change the positions of any list of items, in this case, the cards in the deck
    var currentIndex = array.length, temporaryValue, randomIndex;
   
    while (currentIndex !== 0) { // While there remain elements to shuffle...
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function shuffleDeck() { // Shuffling the list of cards using the provided "shuffle" method above
    const cardsToShuffle =Array.from(document.querySelectorAll('.deck li')); //By using the Array.from() method, we create a new copied array from the array-like object, in this case, the NodeList we make.
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards){ // Looping through each card and create its HTML 
        deck.appendChild(card);
    }
}
shuffleDeck();

// TRACKING NUMBER OF MOVES MADE IN A GAME. The number of moves is set to increase by one when two cards are clicked
 // Showing the number of moves made in a game
 let moves = 0;

function addMove(){
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function checkScore() { // Removing stars after a number of moves made in a game
    if ( moves === 12 || moves === 16 ) {
        hideStar();
    }
}

    function hideStar() {
        const starList = document.querySelectorAll('.stars li');
        for (star of starList) {
            if (star.style.display !== 'none') {
                star.style.display = 'none';
                break;
            }
        }
    }

// TRACKING TIME USED TO PLAY A GAME
 let clockOff = true;
 let time = 0;
 let clockId;

function startClock() { // This function starts the timer
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
}

    function displayTime() { // This function displays the timer on the game board in a desired format
        const clock = document.querySelector('.clock');
        clock.innerHTML = time;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        if (seconds < 10){
            clock.innerHTML = `${minutes} : 0${seconds}`;
        }
        else {
            clock.innerHTML = `${minutes} : ${seconds}`;
        }
    }

function stopClock() { // This function stops the timer
    clearInterval(clockId);
}

//CREATING THE MODAL 
function toggleModal() { // Toggling the modal on and off
    const modal = document.querySelector('.modal_background');
    modal.classList.toggle('hide');
}
 
function writeModalStats() { //Showing the game stats in the modal
    const timeStat = document.querySelector('.modal_time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal_moves');
    const starsStat = document.querySelector('.modal_stars');
    const stars = getStars();
    //Local variables that grab the data associated with the game's time, moves, and stars.

    timeStat.innerHTML = `Time = ${clockTime}`;
    movesStat.innerHTML = `Moves = ${moves}`;
    starsStat.innerHTML = `Stars = ${stars}`;
    //These three lines of code are manipulating the DOM to insert and display the times, moves, and stars that is counted as you played in the game.
    
}

    function getStars() { // This function grabs the number of stars from its current state at the end of the gameplay
        stars = document.querySelectorAll('.stars li');
        starCount = 0;
        for (star of stars) {
            if (star.style.display !== 'none') {
                starCount++;
            }
        }
        return starCount;
    }

  // Making the buttons work
document.querySelector('.modal_cancel').addEventListener('click', () => {toggleModal()}); // This closes the modal when you click on the cancel button.
document.querySelector('.restart').addEventListener('click', resetGame); // Event listener for the restart/refresh button on the game board
document.querySelector('.modal_replay').addEventListener('click', replayGame); // Event listener for the replay button on the modal after the game is over. 


 // Adding a Reset function
function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    resetCards();
    toggledCards = [];
    shuffleDeck();
    matched = 0;
} 

    function resetClockAndTime() { // This function resets timer to 0 & sets display of timer to 0
        stopClock();
        clockOff = true;
        time = 0;
        displayTime();
    } 

    function resetMoves() { // This function resets moves = 0 & sets display of moves to 0
        moves = 0;
        document.querySelector('.moves').innerHTML = moves;
    }

    function resetStars() {
        stars = 0;
        const starList = document.querySelectorAll('.stars li');
        for (star of starList) {
            star.style.display = 'inLine';
        }
    }

 // Adding replaying functionality at game over
function replayGame() {
    resetGame();
    toggleModal();
}

 // Resetting the cards when the replay button is clicked
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for  (let card of cards) {
        card.className = 'card'
    }
}

 // Calling the modal at game over
 let matched = 0;
 
 function gameOver() {
      stopClock();
      writeModalStats();
      toggleModal();
 }