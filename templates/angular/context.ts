import { InjectionToken, inject } from '@angular/core';

export const __NAME__Context = new InjectionToken('__NAME__Context');

export function use__NAME__() {
  return inject(__NAME__Context);
}
