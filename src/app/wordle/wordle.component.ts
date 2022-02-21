import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'wordle-game',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit {
  gameRows = [1, 2, 3, 4, 5, 6]

  letters = 'qwertyuiop,asdfghjkl,zxcvbnm';

  @ViewChild('guessgrid') guessGrid?: ElementRef<HTMLDivElement>;

  constructor() { }

  ngAfterViewInit() {
    let guessGridElement = this.guessGrid!.nativeElement;
    startInteraction();
    function startInteraction() {
      document.addEventListener("click", handleMouseClick);
      document.addEventListener("keydown", handleKeyPress);
    }

    function stopInteraction() {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("click", handleMouseClick);
    }

    function handleMouseClick(e: MouseEvent) {
      let target = e.target as HTMLElement;
      if(target.matches("[data-key]")) {
        pressKey(target.dataset['key']!);
        return;
      }

      if(target.matches("[data-enter]")) {
        submitGuess();
        return;
      }

      if(target.matches("[data-delete]")) {
        deleteKey();
        return;
      }
    }

    function handleKeyPress(e: KeyboardEvent) {
      if(e.key === 'Enter') {
        submitGuess();
        return;
      }

      if(e.key === 'Backspace' || e.key === 'Delete') {
        deleteKey();
        return;
      }

      if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key);
        return;
      }
    }

    function pressKey(key: string) {
      const activeTiles = getActiveTiles();
      if (activeTiles.length >= 5) return;
      const nextTile = guessGridElement.querySelector(':not([data-letter])') as HTMLElement;
      nextTile.dataset['letter'] = key.toLowerCase();
      nextTile.textContent = key;
      nextTile.dataset['state'] = "active";
    }

    function getActiveTiles(): any {
      return guessGridElement.querySelectorAll('[data-state="active"]');
    }

    function submitGuess() {
      //
    }

    function deleteKey() {
      //
    }
  }

  ngOnInit(): void {
  }

}
