import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartCount, selectCartTotal } from 'shared-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('host');
   private store = inject(Store);
  
  // Access global cart state using signals
  cartCount = this.store.selectSignal(selectCartCount);
  cartTotal = this.store.selectSignal(selectCartTotal);
}