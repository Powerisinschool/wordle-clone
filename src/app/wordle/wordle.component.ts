import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import dictionary from '../dictionary.json';
import targetWords from '../targetWords.json';

@Component({
  selector: 'wordle-game',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss'],
})
export class WordleComponent implements OnInit {
  gameRows = [1, 2, 3, 4, 5, 6];
  letters = 'qwertyuiop,asdfghjkl,zxcvbnm';
  @Input() dayOffset = 0;

  @ViewChild('guessgrid') guessGrid?: ElementRef<HTMLDivElement>;
  @ViewChild('keyboard') keyboard?: ElementRef<HTMLDivElement>;

  constructor(private _snackBar: MatSnackBar) {}

  ngAfterViewInit() {
    const _snackBar = this._snackBar;
    const keyboard = this.keyboard?.nativeElement;
    const WORD_LENGTH = 5;
    const FLIP_ANIMATION_DURATION = 500;
    const DANCE_ANIMATION_DURATION = 500;
    const targetWord = targetWords[Math.floor(this.dayOffset)];
    const guessGridElement = this.guessGrid!.nativeElement;

    startInteraction();
    function startInteraction() {
      document.addEventListener('click', handleMouseClick);
      document.addEventListener('keydown', handleKeyPress);
    }

    function stopInteraction() {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleMouseClick);
    }

    function handleMouseClick(e: MouseEvent) {
      let target = e.target as HTMLElement;
      if (target.matches('[data-key]')) {
        pressKey(target.dataset['key']!);
        return;
      }

      if (target.matches('[data-enter]')) {
        submitGuess();
        return;
      }

      if (target.matches('[data-delete]')) {
        deleteKey();
        return;
      }
    }

    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        submitGuess();
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        deleteKey();
        return;
      }

      if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key);
        return;
      }
    }

    function getActiveTiles(): HTMLElement[] {
      return Array.from(
        guessGridElement.querySelectorAll('[data-state="active"]')
      );
    }

    function showAlert(message: string) {
      _snackBar.open(message, undefined, {
        duration: 3000,
      });
    }

    function shakeTiles(tiles: HTMLElement[]) {
      tiles.forEach((tile: HTMLElement) => {
        tile.classList.add('shake');
        tile.addEventListener(
          'animationend',
          () => {
            tile.classList.remove('shake');
          },
          { once: true }
        );
      });
    }

    function pressKey(key: string) {
      const activeTiles = getActiveTiles();
      if (activeTiles.length >= WORD_LENGTH) return;
      const nextTile = guessGridElement.querySelector(
        ':not([data-letter])'
      ) as HTMLElement;
      nextTile.dataset['letter'] = key.toLowerCase();
      nextTile.textContent = key;
      nextTile.dataset['state'] = 'active';
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
      const activeTiles = getActiveTiles();
      if (activeTiles.length !== WORD_LENGTH) {
        showAlert('Not enough letters');
        shakeTiles(activeTiles);
        return;
      }

      const guess = activeTiles.reduce((word, tile) => {
        return word + tile.dataset['letter'];
      }, '');

      if (!dictionary.includes(guess)) {
        showAlert('Not in word list!');
        shakeTiles(activeTiles);
        return;
      }

      stopInteraction();
      const states = getGuessStates(guess);
      activeTiles.forEach((tile, index) =>
        flipTile(tile, index, guess[index], states[index])
      );
      if (guess === targetWord) {
        showAlert("You've won!");
        // Wait for all tiles to finish flipping before dancing
        const lastTileFlipDelay =
          ((WORD_LENGTH - 1) * FLIP_ANIMATION_DURATION) / 2;
        const transitionDuration = 250;
        setTimeout(() => {
          danceTiles(activeTiles);
        }, lastTileFlipDelay + transitionDuration);
        return;
      }

      const remainingTiles = guessGridElement.querySelectorAll(
        ':not([data-letter])'
      );
      if (remainingTiles.length === 0) {
        showAlert(`The word was: ${targetWord.toUpperCase()}`);
      } else {
        startInteraction();
      }
    }

    function getGuessStates(guess: string): string[] {
      const targetLetters = targetWord.split('');
      const guessLetters = guess.split('');
      const states: string[] = Array(WORD_LENGTH).fill('');

      // Find correct letters
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          states[i] = 'correct';
          targetLetters[i] = ''; // Mark as used
        }
      }

      // Find wrong-location letters
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (states[i] === '') {
          const letterIndex = targetLetters.indexOf(guessLetters[i]);
          if (letterIndex !== -1) {
            states[i] = 'wrong-location';
            targetLetters[letterIndex] = ''; // Mark as used
          }
        }
      }

      // Fill in wrong letters
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (states[i] === '') {
          states[i] = 'wrong';
        }
      }
      return states;
    }

    function flipTile(
      tile: HTMLElement,
      index: number,
      letter: string,
      state: string
    ) {
      const key = keyboard!.querySelector(
        `[data-key='${letter}']`
      ) as HTMLElement;
      setTimeout(() => {
        tile.classList.add('flip');
      }, (index * FLIP_ANIMATION_DURATION) / 2);

      tile.addEventListener(
        'transitionend',
        () => {
          tile.classList.remove('flip');
          tile.dataset['state'] = state;
          updateKeyColor(key, state);
        },
        { once: true }
      );
    }

    function updateKeyColor(key: HTMLElement, state: string) {
      if (state === 'correct') {
        key.classList.add('correct');
        key.classList.remove('wrong-location');
      } else if (state === 'wrong-location') {
        if (!key.classList.contains('correct')) {
          key.classList.add('wrong-location');
        }
      } else {
        // wrong
        if (
          !key.classList.contains('correct') &&
          !key.classList.contains('wrong-location')
        ) {
          key.classList.add('wrong');
        }
      }
    }

    function danceTiles(tiles: HTMLElement[]) {
      tiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add('dance');
          tile.addEventListener(
            'animationend',
            () => {
              tile.classList.remove('dance');
            },
            { once: true }
          );
        }, (index * DANCE_ANIMATION_DURATION) / 5);
      });
    }
  }

  ngOnInit(): void {}
}
