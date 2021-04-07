import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from "../../services/rest.service";
import { flatMap } from 'rxjs/operators';


@Component({
  selector: 'app-game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.css']
})




export class GameContainerComponent implements OnInit {

  private gameId;
  public game;

  constructor(private restService: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .pipe(
        flatMap((params) => {
          this.gameId = params['id'];
          return this.restService.getGameById(this.gameId);
        })
      )
      .subscribe((res: any) => {
        this.game = res.data;
        console.log(this.gameId);
      })
  }

  handleGameStart() {

    this.restService.startGameWithId(this.gameId).subscribe(
      (res) => {

        this.restService.getGameById(this.gameId).subscribe((res: any) => {
          this.game = res.data;
          this.game.cards = res.cards;

        });
      },
      (err) => {
        console.error("Failed to start", err);
      }
    );
  }

  handleGameFinish() {

    this.restService.getGameById(this.gameId).subscribe((res: any) => {
      this.game = res.data;
      this.game.cards = res.cards;

    });

  }

}

