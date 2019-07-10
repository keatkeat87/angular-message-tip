import { InjectionToken, TemplateRef } from '@angular/core';

export const S_MAT_MESSAGE_TIP_DATA =
    new InjectionToken<() => TemplateRef<any>>('s-mat-message-tip-data');
