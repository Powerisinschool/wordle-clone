import { Component, ElementRef, ViewChild } from '@angular/core';
import wordage from '../../package.json';

@Component({
  selector: 'wordle-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wordle';
  public version: string = wordage.version;
  @ViewChild('settings') settingsElement?: ElementRef<HTMLDivElement>;
  offsetFromDate = new Date(2022, 1, 1).valueOf();
  msOffset = Date.now() - this.offsetFromDate;
  dayOffset = this.msOffset / 1000 / 60 / 60 / 24;
  dayOffsetRounded = Math.floor(this.dayOffset);
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
