import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'wordle-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {
  toggleState = false;
  @Input() disabled = false;
  @ViewChild('switch') switchElement?: ElementRef<HTMLDivElement>;
  @ViewChild('knob') knob?: ElementRef<HTMLSpanElement>;
  toggle = () => {
    if (!this.disabled) {
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
  }

  constructor() {
    if (this.disabled) { }
  }

  ngAfterViewInit() {
    if (this.disabled) {
      this.switchElement!.nativeElement.style.opacity = '0.5';
    } else {
      this.switchElement!.nativeElement.style.cursor = 'pointer';
    }
  }

  ngOnInit(): void { }

}
