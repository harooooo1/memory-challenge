console.log("*****************************");

const CardState = {
    Hidden: "HIDDEN",
    Revealed: "REVEALED",
    Matched: "MATCHED",
};

const GameState = {
    NotStarted: 0,
    WaitingForInput: 1,
    Waiting: 2,
    Finished: 3,
};

var dd = { 15: 22, 13: "ffo" };
console.log(dd[155]);

class GameModel {
    constructor() {
        this.gameState = GameState.NotStarted;
        this.cards = getCards();
        this.currentPlayer = 0;
        this.userId2PlayerNumber = {
            15: 0, // Harun
            18: 1, // Vlado
        };
    }

    startGame() {
        this.gameState = GameState.WaitingForInput;
    }

    revealCard(cardIndex, userId) {
        if (this.gameState !== GameState.WaitingForInput) {
            throw new Error("Game is not available for input at this time");
        }

        const isPlayerInGame =
            !this.userId2PlayerNumber[userId] &&
            this.userId2PlayerNumber[userId] !== 0;

        if (isPlayerInGame) {
            throw new Error("User is not a player in this game");
        }

        if (this.currentPlayer !== this.userId2PlayerNumber[userId]) {
            throw new Error("Not your turn");
        }

        const card = this.cards[cardIndex];
        if (!card) {
            throw new Error("Invalid card index");
        }
        if (card.state !== CardState.Hidden) {
            throw new Error("This card is not in a valid state to be revealed");
        }
        // card is revealed... now what
        card.state = CardState.Revealed;
        //maybe change game state to Waiting
        //end revealcard function?
    }
}


function getCards() {
    const cards = [
        {
            identifier: "ace-of-spades",
            state: CardState.Hidden,
        },
        {
            identifier: "ace-of-spades",
            state: CardState.Hidden,
        },
        {
            identifier: "queen",
            state: CardState.Hidden,
        },
        {
            identifier: "queen",
            state: CardState.Hidden,
        },
    ];
    return cards;
}