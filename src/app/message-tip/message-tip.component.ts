import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ChangeDetectionStrategy, Inject, HostListener } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AnimationEvent, trigger, state, transition, style, animate, keyframes } from '@angular/animations';
import { S_MAT_MESSAGE_TIP_DATA } from './data-token';
import { SMatMessageTipDirective } from './message-tip.directive';

@Component({
  templateUrl: './message-tip.component.html',
  styleUrls: ['./message-tip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('state', [
    state('initial, void, hidden', style({ transform: 'scale(0)' })),
    state('visible', style({ transform: 'scale(1)' })),
    transition('* => visible', animate('200ms', keyframes([
      style({ transform: 'scale(0)', offset: 0 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))),
    transition('* => hidden', animate('150ms', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(0)', offset: 1 })
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
    this.visibility = 'visible';
    this.cdr.markForCheck();
  }

  public hide() {
    this.visibility = 'hidden';
    this.cdr.markForCheck();
  }

  animationDone(event: AnimationEvent): void {
    const toState = event.toState as SMatMessageTipComponent['visibility'];
    // if (toState === 'hidden' && this.visibility !== 'visible') {
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
