import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit {

  @Input() game;
  @Output() gameStarted = new EventEmitter();
  constructor() { }

  ngOnInit(): void {

  }

  startGame() {
    this.gameStarted.next(true);
  }
}