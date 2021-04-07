import { Component, OnInit } from "@angular/core";
import { RestService } from "../../services/rest.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-games-list",
  templateUrl: "./games-list.component.html",
  styleUrls: ["./games-list.component.css"],
})
export class GamesListComponent implements OnInit {
  public games = [];

  constructor(private restService: RestService, private router: Router) { }

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
        this.router.navigate(["games/" + gameId]);
      },
      (err) => {
        console.error("Failed to join game", err);
      }
    );
  }

  createGame() {

    console.log("creating game ");
    const gameTitle = "Game" + new Date();
    this.restService.createGame(gameTitle).subscribe(
      (res: any) => {
        console.log("Success", res.data.id);
        this.router.navigate(["games/" + res.data.id]);
      },
      (err) => {
        console.error("Failed to join game", err);
      }
    );

  }
} 
