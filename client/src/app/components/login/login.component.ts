import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  message: string;
  loginForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.message = this.authService.isUserAuthenticated()
      ? "User is logged in"
      : "User is signed out";
  }

  doLogin() {
    if (this.loginForm.invalid) {
      alert("Form is invalid!");
      return;
    }
    const credentials = this.loginForm.value;
    this.authService.login(credentials).subscribe(
      (res) => {
        this.router.navigate(["/"]);
      },
      (err) => {
        alert("Login failed, try again");
      }
    );
  }
}
