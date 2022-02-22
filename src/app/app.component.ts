import { Component, ElementRef, ViewChild } from '@angular/core';

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
  constructor() { }

  ngAfterViewInit() {
    this.settingsElement!.nativeElement.style.display = "none";
  }
}
