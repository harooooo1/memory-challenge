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

class GameModel {
  constructor(config) {
    console.log("creating a game model");
    this.gameState = GameState.NotStarted;
    this.cards = config.cards;
    this.currentPlayer = 0;
    this.userId2PlayerNumber = config.players;
    this.numberOfPlayers = Object.keys(this.userId2PlayerNumber).length;
    this.firstRevealedCard = null;
  }

  startGame() {
    console.log("starting a game");
    this.printCards();
    this.gameState = GameState.WaitingForInput;
  }

  async revealCard(cardIndex, userId) {
    console.log("revealing a card", { cardIndex, userId });
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
    this.printCards();

    if (!this.firstRevealedCard) {
      this.firstRevealedCard = card;
      return;
    }

    const matchingCards = this.firstRevealedCard.identifier === card.identifier;

    // NO MATCH: reveal, and wait a bit, then hide cards, and give turn to next player
    if (!matchingCards) {
      console.log("no match, next player gets a turn in 3 seconds");
      this.firstRevealedCard = null;

      this.gameState = GameState.Waiting;

      setTimeout(() => {
        console.log("... 3 seconds passed, next turn");
        this.gameState = GameState.WaitingForInput;
        this.hideRevealedCards();
        this.nextPlayer();
        this.printCards();
      }, 3000);

      return;
    }

    // match found
    this.firstRevealedCard.state = CardState.Matched;
    this.firstRevealedCard.revealedBy = userId;
    card.state = CardState.Matched;
    card.revealedBy = userId;
    this.firstRevealedCard = null;
    console.log("Match found, current continues their turn");
    // this.printCards();
    if (this.checkIfGameIsDone()) {
      this.printScore();
    }
  }

  getGameState() {
    return this.gameState;
  }

  printScore() {
    const scoreTable = this.cards.reduce((scoresPerUserId, card) => {
      if (scoresPerUserId[card.revealedBy]) {
        scoresPerUserId[card.revealedBy] =
          scoresPerUserId[card.revealedBy] + 0.5;
      } else {
        scoresPerUserId[card.revealedBy] = 0.5;
      }
      return scoresPerUserId;
    }, {});
    console.log({ scoreTable });
  }

  checkIfGameIsDone() {
    const gameIsDone = this.cards.every((c) => c.state === CardState.Matched);
    if (gameIsDone) {
      console.log("Huzzah! Game is finished!");
      this.gameState = GameState.Finished;
    }
    return gameIsDone;
  }

  nextPlayer() {
    const nextPlayerIndex = (this.currentPlayer + 1) % this.numberOfPlayers;
    console.log("next player", { nextPlayerIndex });
    this.currentPlayer = nextPlayerIndex;
  }

  hideRevealedCards() {
    this.cards = this.cards.map((c) => {
      if (c.state === CardState.Revealed) {
        c.state = CardState.Hidden;
      }
      return c;
    });
  }

  // utility function for debugging
  printCards() {
    const cardsView = this.cards.map((c) => {
      return c.state === CardState.Hidden ? "***" : c.identifier;
    });
    console.log("Game grid: [" + cardsView.join(" ") + "]");
  }
}

module.exports.GameModel = GameModel;
module.exports.CardState = CardState;
module.exports.GameState = GameState;
