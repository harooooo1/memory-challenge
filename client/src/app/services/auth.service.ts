import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedIn = false;
  private apiEndpoint = "http://localhost:8080/";

  private token = null;
  private userId = null;
  private userName = null;

  constructor(private http: HttpClient) {
    const activeUser = localStorage.getItem("activeUser");
    if (activeUser) {
      const { userName, userId, token } = JSON.parse(activeUser);
      this.userId = userId;
      this.userName = userName;
      this.token = token;
      this.isLoggedIn = true;
    }
  }

  login(credentials) {
    return this.http.post(this.apiEndpoint + "login", credentials).pipe(
      tap((res: any) => {
        const { userName, userId, token } = res && res.data;
        this.userId = userId;
        this.userName = userName;
        this.token = token;
        this.isLoggedIn = true;

        // save to local storage
        const activeUser = JSON.stringify({ userName, userId, token });
        localStorage.setItem("activeUser", activeUser);
      }),
      map((res) => true)
    );
  }

  logOut() {
    this.userId = null;
    this.userName = null;
    this.token = null;
    this.isLoggedIn = false;
    localStorage.clear();
  }

  isUserAuthenticated() {
    return this.isLoggedIn;
  }

  getToken() {
    return this.token;
  }

}
