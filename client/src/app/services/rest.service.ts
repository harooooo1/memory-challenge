import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class RestService {
  private apiEndpoint = "http://localhost:8080/";

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllGames() {
    return this.http.get(this.apiEndpoint + "games", {
      headers: { "x-auth-token": this.authService.getToken() },
    });
  }

  getGameById(id) {
    return this.http.get(this.apiEndpoint + "games/" + id, {
      headers: { "x-auth-token": this.authService.getToken() },
    });
  }

  startGameWithId(id) {
    return this.http.post(this.apiEndpoint + "games/" + id + "/start", null, {
      headers: { "x-auth-token": this.authService.getToken() },
    });
  }

  joinGameWithId(id) {
    return this.http.post(this.apiEndpoint + "games/" + id + "/join", null, {
      headers: { "x-auth-token": this.authService.getToken() },
    });
  }

  leaveGameWithId(id) {
    return this.http.post(this.apiEndpoint + "games/" + id + "/leave", null, {
      headers: { "x-auth-token": this.authService.getToken() },
    });
  }

  revealCard(gameId, cardIndex) {
    return this.http.post(
      this.apiEndpoint + "games/" + gameId + "/reveal-card",
      {
        card: cardIndex,
      },
      {
        headers: { "x-auth-token": this.authService.getToken() },
      }
    );
  }
}
