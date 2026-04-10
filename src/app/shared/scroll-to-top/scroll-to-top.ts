import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
})
export class ScrollToTop {
  protected isVisible = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible = window.pageYOffset > 300;
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
