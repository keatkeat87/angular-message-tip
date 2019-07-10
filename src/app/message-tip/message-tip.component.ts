import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AnimationEvent, trigger, state, transition, style, animate, keyframes } from '@angular/animations';

const delay = 1000;

@Component({
  templateUrl: './message-tip.component.html',
  styleUrls: ['./message-tip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('state', [
    state('initial, void, hidden', style({opacity: 0, transform: 'scale(0)'})),
    state('visible', style({transform: 'scale(1)'})),
    transition('* => visible', animate('200ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
      style({opacity: 0, transform: 'scale(0)', offset: 0}),
      style({opacity: 0.5, transform: 'scale(0.99)', offset: 0.5}),
      style({opacity: 1, transform: 'scale(1)', offset: 1})
    ]))),
    transition('* => hidden', animate('100ms cubic-bezier(0, 0, 0.2, 1)', style({opacity: 0}))),
  ])],
})
export class SMatMessageTipComponent implements OnInit, OnDestroy {

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  private onHide = new Subject<void>();
  private showTimeoutId: number | null = null;
  private hideTimeoutId: number | null = null;

  visibility: 'initial' | 'visible' | 'hidden' = 'initial';

  public template: TemplateRef<any>;

  ngOnInit() {
  }

  public show() {
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }

    this.showTimeoutId = window.setTimeout(() => {
      this.visibility = 'visible';
      this.showTimeoutId = null;
      this.cdr.markForCheck();
    }, delay);
  }

  public hide() {
    if (this.showTimeoutId) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
    this.hideTimeoutId = window.setTimeout(() => {
      this.visibility = 'hidden';
      this.hideTimeoutId = null;
      this.cdr.markForCheck();
    }, delay);
  }

  animationDone(event: AnimationEvent): void {
    const toState = event.toState as SMatMessageTipComponent['visibility'];
    if (toState === 'hidden') {
      this.onHide.next();
    }
  }

  public afterHidden(): Observable<void> {
    return this.onHide.asObservable();
  }

  ngOnDestroy() {
    this.onHide.complete();
  }

}
