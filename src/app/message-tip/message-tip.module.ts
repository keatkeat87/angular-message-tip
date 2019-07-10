import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SMatMessageTipDirective } from './message-tip.directive';
import { SMatMessageTipComponent } from './message-tip.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [SMatMessageTipDirective, SMatMessageTipComponent],
  imports: [
    CommonModule,
    OverlayModule
  ],
  exports: [
    SMatMessageTipDirective
  ],
  entryComponents: [
    SMatMessageTipComponent
  ]
})
export class SMatMessageTipModule { }
