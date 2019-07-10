import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ChangeDetectionStrategy, Inject, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AnimationEvent, trigger, state, transition, style, animate, keyframes } from '@angular/animations';
import { S_MAT_MESSAGE_TIP_DATA } from './data-token';
import { SMatMessageTipDirective } from './message-tip.directive';


// const delay = 1000;

@Component({
  templateUrl: './message-tip.component.html',
  styleUrls: ['./message-tip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('state', [
    state('initial, void, hidden', style({transform: 'scale(0)'})),
    state('visible', style({transform: 'scale(1)'})),
    transition('* => visible', animate('500ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
      style({transform: 'scale(0)', offset: 0}),
      style({transform: 'scale(0.99)', offset: 0.5}),
      style({transform: 'scale(1)', offset: 1})
    ]))),
    transition('* => hidden', animate('500ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
      style({transform: 'scale(1)', offset: 0}),
      style({transform: 'scale(0.01)', offset: 0.5}),
      style({transform: 'scale(0)', offset: 1})
    ])))
  ])]
})
export class SMatMessageTipComponent implements OnInit, OnDestroy {

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(S_MAT_MESSAGE_TIP_DATA) public template: TemplateRef<any>,
    private messageTipDirective: SMatMessageTipDirective
  ) { }

  private onHide = new Subject<void>();
  // private showTimeoutId: number | null = null;
  // private hideTimeoutId: number | null = null;

  visibility: 'initial' | 'visible' | 'hidden' = 'initial';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.messageTipDirective.clearHideTimeout();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.messageTipDirective.hide();
  }


  ngOnInit() {
  }

  public show() {
    // if (this.hideTimeoutId !== null) {
    //   clearTimeout(this.hideTimeoutId);
    //   this.hideTimeoutId = null;
    // }

    // this.showTimeoutId = window.setTimeout(() => {
      console.log('show ~~ animation');
      this.visibility = 'visible';
      // this.showTimeoutId = null;
      this.cdr.markForCheck();
    // }, delay);
  }

  public hide() {
    // if (this.showTimeoutId) {
    //   clearTimeout(this.showTimeoutId);
    //   this.showTimeoutId = null;
    // }
    // this.hideTimeoutId = window.setTimeout(() => {
      console.log('hidden animation');
      this.visibility = 'hidden';
      // this.hideTimeoutId = null;
      this.cdr.markForCheck();
    // }, delay);
  }

  animationDone(event: AnimationEvent): void {
    const toState = event.toState as SMatMessageTipComponent['visibility'];
    if (toState === 'hidden' && this.visibility !== 'visible' ) {
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
