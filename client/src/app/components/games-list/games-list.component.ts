import { Component, OnInit } from "@angular/core";
import { RestService } from "../../services/rest.service";

@Component({
  selector: "app-games-list",
  templateUrl: "./games-list.component.html",
  styleUrls: ["./games-list.component.css"],
})
export class GamesListComponent implements OnInit {
  public games = [];

  constructor(private restService: RestService) {}

  ngOnInit(): void {
    this.restService.getAllGames().subscribe((res: any) => {
      console.log({ games: res.data });
      this.games = res.data;
    });
  }

  resolveState(gameState) {
    return {
      0: "Not Started",
      1: "In Progress",
      2: "Finished",
    }[gameState];
  }

  joinGame(gameId) {
    console.log("attempting to join gameID " + gameId);
    this.restService.joinGameWithId(gameId).subscribe(
      (res) => {
        console.log("Success", res);
      },
      (err) => {
        console.error("Failed to join game", err);
      }
    );
  }
}
