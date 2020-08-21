import { Component, OnInit, Input } from '@angular/core';
import { RestService } from "../../services/rest.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  private game;
  public cards = [];
  @Input() gameId;
  constructor(private restService: RestService) { }

  ngOnInit(): void {

    setInterval(() => {

      this.restService.getGameById(this.gameId).subscribe((res: any) => {
        this.game = res.data;
        this.cards = res.cards;
        console.log("cards", this.cards);
        console.log("game", this.game);


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
