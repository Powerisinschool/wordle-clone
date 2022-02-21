import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'wordle-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {
  toggleState = false;
  @ViewChild('switch') switchElement?: ElementRef<HTMLDivElement>;
  @ViewChild('knob') knob?: ElementRef<HTMLSpanElement>;
  toggle = () => {
    if (!this.toggleState) {
      this.switchElement!.nativeElement.style.background = '#538d4e';
      this.knob!.nativeElement.style.transform = 'translateX(calc(100% - 4px))';
      this.toggleState = !this.toggleState;
    } else {
      this.switchElement!.nativeElement.style.background = '#878a8c';
      this.knob!.nativeElement.style.transform = 'none';
      this.toggleState = !this.toggleState;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
