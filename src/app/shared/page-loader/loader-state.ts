import { Injectable, signal } from '@angular/core';

// Lets the rest of the site hold its entrance animations until the loader lifts.
@Injectable({ providedIn: 'root' })
export class LoaderState {
  readonly finished = signal(false);

  finish(): void {
    this.finished.set(true);
  }
}
