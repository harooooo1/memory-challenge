import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestService } from "../../services/rest.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
  private gameRefreshInterval;
  private game;
  public cards = [];
  @Input() gameId;
  @Output() gameFinished = new EventEmitter;
  constructor(private restService: RestService) { }

  ngOnInit(): void {

    this.gameRefreshInterval = setInterval(() => {

      this.restService.getGameById(this.gameId).subscribe((res: any) => {
        this.game = res.data;
        this.cards = res.cards;
        console.log("cards", this.cards);
        console.log("game", this.game);
        if (this.game.gameState === 2) {
          clearInterval(this.gameRefreshInterval);
          this.gameFinished.next(true);

        }

      });

    }, 1000);

  }

  doRevealCard(gameId, cardIndex) {
    console.log("attempting to reveal card");
    this.restService.revealCard(gameId, cardIndex).subscribe(
      (res) => {
        console.log("Success revealed", res);
      },
      (err) => {
        console.error("Failed to reveal", err);
      }
    );
  }

}
