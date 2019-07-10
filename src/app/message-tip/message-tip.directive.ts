import { Directive, Input, TemplateRef, ElementRef, OnDestroy, ViewContainerRef, Injector, HostListener } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { OverlayRef, Overlay, ScrollDispatcher } from '@angular/cdk/overlay';
import { SMatMessageTipComponent } from './message-tip.component';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { S_MAT_MESSAGE_TIP_DATA } from './data-token';

const delay = 400;

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[sMatMessageTip]',
})
export class SMatMessageTipDirective implements OnDestroy {

  private subscription = new Subscription();

  constructor(
    private hostElementRef: ElementRef<HTMLElement>,
    private overlay: Overlay,
    private scrollDispatcher: ScrollDispatcher,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) {}

  @Input('sMatMessageTip')
  template: TemplateRef<any>; // note: 只能 set 一次哦, 不支持换的

  private overlayRef: OverlayRef;
  private messageTipInstance: SMatMessageTipComponent | null;
  private portal: ComponentPortal<SMatMessageTipComponent>;

  private showTimeoutId: number | null = null;
  private hideTimeoutId: number | null = null;

  private showed = false;

  @HostListener('mouseenter')
  onHostMouseEnter() {
    this.show();
  }

  @HostListener('mouseleave')
  onHostMouseLeave() {
    this.hide();
  }

  show() {
    const createOverlayRef = () => {
      if (this.overlayRef) {
        return this.overlayRef;
      }
      const scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(this.hostElementRef);
      const strategy = this.overlay.position()
        .flexibleConnectedTo(this.hostElementRef)
        .withTransformOriginOn('.transformOrigin')
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
            offsetX: 5,
            offsetY: 5,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
            offsetX: -5,
            offsetY: -5,
          }
        ]);

      this.overlayRef = this.overlay.create({
        positionStrategy: strategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        minWidth: 100,
        maxWidth: 448
      });
      return this.overlayRef;
    };
    this.clearHideTimeout();
    if (!this.showed && this.showTimeoutId === null) {
      this.showTimeoutId = window.setTimeout(() => {
        this.showTimeoutId = null;
        const overlayRef = createOverlayRef();
        const injectionTokens = new WeakMap();
        injectionTokens.set(S_MAT_MESSAGE_TIP_DATA, this.template);
        injectionTokens.set(SMatMessageTipDirective, this);
        const portalInjector = new PortalInjector(this.injector, injectionTokens);
        this.portal = this.portal || new ComponentPortal(SMatMessageTipComponent, this.viewContainerRef, portalInjector);
        this.messageTipInstance = overlayRef.attach(this.portal).instance;
        this.subscription.add(
          this.messageTipInstance.afterHidden().subscribe(() => {
            overlayRef.detach();
            this.showed = false;
          })
        );
        this.messageTipInstance.show();
        this.showed = true;
      }, delay);
    }
  }

  public clearHideTimeout() {
    if (this.hideTimeoutId !== null) {
      window.clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }
  public hide() {
    if (this.showTimeoutId) {
      window.clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
    if (this.showed) {
      this.hideTimeoutId = window.setTimeout(() => {
        this.hideTimeoutId = null;
        this.messageTipInstance.hide();
      }, delay);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.messageTipInstance = null;
    } 
  }
}
