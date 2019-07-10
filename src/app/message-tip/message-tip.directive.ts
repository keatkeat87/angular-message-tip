import { Directive, Input, TemplateRef, ElementRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { OverlayRef, Overlay, ScrollDispatcher } from '@angular/cdk/overlay';
import { SMatMessageTipComponent } from './message-tip.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[sMatMessageTip]',
})
export class SMatMessageTipDirective implements OnDestroy {

  private manualListeners = new Map<string, EventListenerOrEventListenerObject>();
  private subscription = new Subscription();

  constructor(
    private hostElementRef: ElementRef<HTMLElement>,
    private overlay: Overlay,
    private scrollDispatcher: ScrollDispatcher,
    private viewContainerRef: ViewContainerRef,
    platform: Platform,
  ) {
    if (platform.isBrowser) {
      const hostElement = hostElementRef.nativeElement;

      if (!platform.IOS && !platform.ANDROID) {
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
  private messageTipInstance: SMatMessageTipComponent | null;
  private portal: ComponentPortal<SMatMessageTipComponent>;

  show() {
    const createOverlayRef = () => {
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

    const overlayRef = createOverlayRef();
    if (overlayRef.hasAttached()) {
      console.log('hasAttached');
    } else {
      console.log('ok');
    }

    this.portal = this.portal || new ComponentPortal(SMatMessageTipComponent, this.viewContainerRef);
    this.messageTipInstance = overlayRef.attach(this.portal).instance;
    this.subscription.add(
      this.messageTipInstance.afterHidden().subscribe(() => {
        overlayRef.detach();
        console.log('afterHidden detach');
      })
    );
    this.messageTipInstance.show();
  }

  hide() {
    console.log('dir hide');
    if (this.messageTipInstance) {
      this.messageTipInstance.hide();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.messageTipInstance = null;
    }

    this.manualListeners.forEach((listener, event) => {
      this.hostElementRef.nativeElement.removeEventListener(event, listener);
    });
    this.manualListeners.clear();
  }
}
