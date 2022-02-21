import { Component, ElementRef, ViewChild } from '@angular/core';
import dictionary from './dictionary.json';
import targetWords from './targetWords.json';

@Component({
  selector: 'wordle-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wordle';
  @ViewChild('settings') settingsElement?: ElementRef<HTMLDivElement>;
  openSettings = () => {
    this.settingsElement!.nativeElement.style.display = "flex";
  }
  closeSettings = () => {
    this.settingsElement!.nativeElement.style.display = "none";
  }
  constructor() {
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
      // const nextTile = guessGrid.querySelector()
    }

    function submitGuess() {
      //
    }

    function deleteKey() {
      //
    }
  }

  ngAfterViewInit() {
    this.settingsElement!.nativeElement.style.display = "none";
  }
}
