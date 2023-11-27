// Helper functions

import { globals } from "./play.js";

const dealtCard = $('#dealt-card');
const attackButton = $('.attack');
const holdButton = $('.hold');

// MISC HELPERS

function invertColor(color){
    if(color == 'black'){
        return 'white';
    }
    return 'black';
}

function setDeckTopDiv(card) {
    const cardNumber = card.getNumber();
    const cardColor = card.getColor();

    if(cardNumber !== null) {
        dealtCard.html(cardNumber);
    } else {
        dealtCard.html("");
    }

    dealtCard.removeClass(invertColor(cardColor));
    dealtCard.addClass(cardColor);
}


// EVENT LISTENER HELPERS

function addReadyButtonEventListener() {
    $('#ready-button').click(() => {
        if(!globals.ready) {
            globals.ready = true;
        } else {
            globals.ready = false;
        }
        globals.socket.emit('readyConfirmation', { ready: globals.ready });
    });
}

function addButtonEventListeners() {
    const buttons = $('.guess-button');

    for(let i = 0; i < 12; i++) {
        $(buttons[i]).click(() => {
            if(globals.myTurn) {
                $(buttons[globals.myGuessValue]).removeClass('guess-button-selected');
                globals.myGuessValue = i;
                $(buttons[globals.myGuessValue]).addClass('guess-button-selected');

                globals.socket.emit('buttonClicked', { buttonValue: globals.myGuessValue });
            }
        });
    }
}

function addDecisionsEventListener() {
    attackButton.click(() => {
        if(globals.myTurn) {
            globals.socket.emit('attackMove', { guessTarget: globals.selectedCard, guessValue: globals.myGuessValue });
        }
    });

    holdButton.click(() => {
        if(globals.myTurn) {
            globals.socket.emit('holdMove');
        }
    });
}


// DATA SETTINGS HELPERS

function setEnemyUsername(usernames) {
    let enemyUser = usernames[0];
    if(enemyUser === globals.username) {
        enemyUser = usernames[1];
    }

    if(enemyUser === null) {
        $('#enemy').html('...');
        return;
    }
    
    $('#enemy').html(enemyUser);
    $('#enemy-username').html(enemyUser);
}


// CSS CLASS MANAGING HELPERS

function applyGameStartTransition() {
    $("header").addClass("header-out");
    $("footer").addClass("footer-out");
    $(".lobby").addClass("fade-out");

    setInterval(() => {
        $("header").addClass("display-none");
        $("footer").addClass("display-none");
        $(".lobby").addClass("display-none");

        $(".desk-wrapper").addClass("fade-in");
            
        globals.ready = false;
        $('#enemy').removeClass('player-ready');
        $('#me').removeClass('player-ready');
    }, 1400);
}

const myUsername = $('#my-username');
const enemyUsername = $('#enemy-username');
const enemyHandCont = $('.enemy-hand-container');
const guessArray = $('.guess-array');
const decisionWrapper = $('.decision-wrapper');

function applyTransitionToEnemyTurn() {
    myUsername.removeClass('player-turn');
    enemyUsername.addClass('player-turn');
    enemyHandCont.addClass('no-pointer-events');
    guessArray.addClass('guess-array-inactive');
    dealtCard.removeClass('highlight-dealt-card');
    decisionWrapper.addClass('decision-fade-away');
    attackButton.addClass('decision-inactive');
    holdButton.addClass('decision-inactive');
}

function applyTransitionToMyTurn() {
    myUsername.addClass('player-turn');
    enemyUsername.removeClass('player-turn');
    enemyHandCont.removeClass('no-pointer-events');
    guessArray.removeClass('guess-array-inactive');
    dealtCard.addClass('highlight-dealt-card');
    decisionWrapper.removeClass('decision-fade-away');
}

function closeCardWithDelay(index, delay) {
    const cardToClose = $($('.my-card')[index]);
    setTimeout(() => {
        cardToClose.addClass('closed');
        cardToClose.removeClass('open');
    }, delay);
}

function addHighlightTo(index) {
    let myCardDivs = $('.my-card');

    $(myCardDivs[globals.selectedCard]).removeClass('selected');
    globals.selectedCard = index;
    $(myCardDivs[globals.selectedCard]).addClass('selected');
}

function removeHighlightFrom(cardDiv) {
    $(cardDiv).removeClass('selected');
}

export {
    invertColor,
    setDeckTopDiv,

    addReadyButtonEventListener,
    addButtonEventListeners,
    addDecisionsEventListener,

    setEnemyUsername,

    applyGameStartTransition,
    applyTransitionToEnemyTurn,
    applyTransitionToMyTurn,

    closeCardWithDelay,
    addHighlightTo,
    removeHighlightFrom,
}