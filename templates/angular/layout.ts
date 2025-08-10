import { Component } from '@angular/core';

@Component({
  selector: 'app-__NAME_LOWER__-layout',
  template: `
    <div class="__NAME_LOWER__-layout">
      <header>Header</header>
      <main><ng-content></ng-content></main>
      <footer>Footer</footer>
    </div>
  `
})
export class __NAME__LayoutComponent {}
