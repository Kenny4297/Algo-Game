// Helper functions

import { globals } from "./play.js";

function invertColor(color){
    if(color == 'black'){
        return 'white';
    }
    return 'black';
}

function setDeckTopDiv(card) {
    let dealer = $('#dealer');
    if(card.getNumber() !== null) {
        dealer.html(card.getNumber());
    } else {
        dealer.html("");
    }

    dealer.css({
        "background-color": card.getColor(),
        "color": invertColor(card.getColor()),
    });
}

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
    const buttons = $('.pick-button');

    for(let i = 0; i < 12; i++) {
        $(buttons[i]).click(() => {
            if(globals.myTurn) {
                $(buttons[globals.myGuessValue]).removeClass('button-selected');
                globals.myGuessValue = i;
                $(buttons[globals.myGuessValue]).addClass('button-selected');

                globals.socket.emit('buttonClicked', { buttonValue: globals.myGuessValue });
            }
        });
    }
}

function addDealerEventListener() {
    const dealer = $('#dealer');

    // SEE A MORE ELEGANT SOLUTION TO THIS PLS IM TOO LAZY
    dealer.css({
        'z-index': '10',
    })

    dealer.click(() => {
        if(globals.myTurn) {
            globals.socket.emit('playMove', { guessTarget: globals.selectedCard, guessValue: globals.myGuessValue });
        }
    });
}

export {
    invertColor,
    setDeckTopDiv,
    addReadyButtonEventListener,
    addButtonEventListeners,
    addDealerEventListener,
}