import { Directive, Input, TemplateRef, ElementRef, OnDestroy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { OverlayRef, Overlay, ScrollDispatcher } from '@angular/cdk/overlay';
import { SMatMessageTipComponent } from './message-tip.component';


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[sMatMessageTip]'
})
export class SMatMessageTipDirective implements OnDestroy {

  private manualListeners = new Map<string, EventListenerOrEventListenerObject>();

  constructor(
    private hostElementRef: ElementRef<HTMLElement>,
    private overlay: Overlay,
    private scrollDispatcher: ScrollDispatcher,
    platform: Platform,
  ) {
    console.log('in', platform);
    if (platform.isBrowser) {
      const hostElement = hostElementRef.nativeElement;

      if (!platform.IOS && !platform.ANDROID) {
        console.log('here');
        this.manualListeners
          .set('mouseenter', () => this.show())
          .set('mouseleave', () => this.hide());

        this.manualListeners.set('click', () => this.show());
        this.manualListeners.forEach((listener, event) => hostElement.addEventListener(event, listener));
      }
    }
  }

  @Input('sMatMessageTip')
  template: TemplateRef<any>;

  private overlayRef: OverlayRef;
  private messagetipInstance: SMatMessageTipComponent | null;

  show() {
    const createOverlay = () => {
      if (this.overlayRef) {
        return this.overlayRef;
      }
      const scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(this.hostElementRef);
      const strategy = this.overlay.position()
        .flexibleConnectedTo(this.hostElementRef)
        .withTransformOriginOn('.mat-tooltip')
        .withFlexibleDimensions(false)
        .withViewportMargin(8)
        .withScrollableContainers(scrollableAncestors)
        .withPush(false)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: 10,
            offsetY: 10,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -10,
            offsetY: -10,
          }
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy: strategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      });

      return this.overlayRef;
    };
  }



  hide() {
    console.log('hide');
  }

  ngOnDestroy() {

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.messagetipInstance = null;
    }


    this.manualListeners.forEach((listener, event) => {
      this.hostElementRef.nativeElement.removeEventListener(event, listener);
    });
    this.manualListeners.clear();
  }
}
