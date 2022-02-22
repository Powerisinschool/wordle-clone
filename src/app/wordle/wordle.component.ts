import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import dictionary from '../dictionary.json';
import targetWords from '../targetWords.json';

@Component({
  selector: 'wordle-game',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit {
  gameRows = [1, 2, 3, 4, 5, 6];
  letters = 'qwertyuiop,asdfghjkl,zxcvbnm';

  @ViewChild('guessgrid') guessGrid?: ElementRef<HTMLDivElement>;
  @ViewChild('keyboard') keyboard?: ElementRef<HTMLDivElement>;

  constructor(private _snackBar: MatSnackBar) {
  }

  ngAfterViewInit() {
    const _snackBar = this._snackBar;
    const keyboard = this.keyboard?.nativeElement;
    const WORD_LENGTH = 5;
    const FLIP_ANIMATION_DURATION = 500;
    const offsetFromDate = new Date(2022, 1, 1).valueOf();
    const msOffset = Date.now() - offsetFromDate;
    const dayOffset = msOffset / 1000 / 60 / 60 / 24;
    const targetWord = targetWords[Math.floor(dayOffset)];
    console.log(targetWord);
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

    function getActiveTiles(): any {
      return guessGridElement.querySelectorAll('[data-state="active"]');
    }

    function showAlert(message: string) {
      _snackBar.open(message, undefined, {
        duration: 3000
      })
    }

    function shakeTiles(tiles: any[]) {
      tiles.forEach((tile: HTMLElement) => {
        tile.classList.add('shake');
        tile.addEventListener("animationend", () => {
          tile.classList.remove('shake');
        });
      })
    }

    function pressKey(key: string) {
      const activeTiles = getActiveTiles();
      if (activeTiles.length >= WORD_LENGTH) return;
      const nextTile = guessGridElement.querySelector(':not([data-letter])') as HTMLElement;
      nextTile.dataset['letter'] = key.toLowerCase();
      nextTile.textContent = key;
      nextTile.dataset['state'] = "active";
    }

    function deleteKey() {
      const activeTiles = getActiveTiles();
      const lastTile = activeTiles[activeTiles.length - 1] as HTMLElement;
      if (lastTile == null) return;
      lastTile.textContent = '';
      delete lastTile.dataset['letter'];
      delete lastTile.dataset['state'];
    }

    function submitGuess() {
      const activeTiles = [...getActiveTiles()];
      if (activeTiles.length !== WORD_LENGTH) {
        console.log('Word length not long enough');
        showAlert('Not enough letters');
        shakeTiles(activeTiles);
        return;
      }

      const guess = activeTiles.reduce((word, tile: HTMLElement) => {
        return word + tile.dataset['letter'];
      }, "");

      if (!dictionary.includes(guess)) {
        showAlert("Not in word list!");
        shakeTiles(activeTiles);
        return;
      }

      activeTiles.forEach((...params) => flipTile(...params, guess));
      if (targetWord === guess) {
        showAlert("You've won!");
        stopInteraction();
        return
      }
    }

    function flipTile(tile: HTMLElement, index: number, array: any[], guess: string) {
      console.log(array)
      const letter = tile.dataset['letter'];
      const key = keyboard!.querySelector(`[data-key='${letter}']`);
      setTimeout(() => {
        tile.classList.add('flip');
      }, index * FLIP_ANIMATION_DURATION / 2);

      tile.addEventListener("transitionend", () => {
        if (targetWord[index] === letter) {
          tile.dataset['state'] = 'correct';
          key?.classList.add('correct');
        } else if (targetWord.includes(letter!)) {
          if (guess.substring(0, index).includes(letter!)) {
            console.log('more')
            tile.dataset['state'] = 'wrong';
            key?.classList.add('wrong');
          } else {
            tile.dataset['state'] = 'wrong-location';
            key?.classList.add('wrong-location');
          }
        } else {
          tile.dataset['state'] = 'wrong';
          key?.classList.add('wrong');
        }
        tile.classList.remove('flip');
      })
    }
  }

  ngOnInit(): void {
  }

}
