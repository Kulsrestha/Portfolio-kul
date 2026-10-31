import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scroll-wire',
  standalone: true,
  templateUrl: './scroll-wire.html',
  styleUrl: './scroll-wire.css',
  host: {
    class: 'fixed top-0 left-0 w-full z-[60] pointer-events-none',
    'aria-hidden': 'true',
  },
})
export class ScrollWire implements AfterViewInit, OnDestroy {
  @ViewChild('fill') private fill!: ElementRef<HTMLElement>;
  @ViewChild('spark') private spark!: ElementRef<HTMLElement>;

  private frame: number | null = null;

  // Writes straight to the DOM, so scrolling doesn't trigger change detection on every frame.
  private readonly scheduleUpdate = () => {
    if (this.frame === null) {
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        this.update();
      });
    }
  };

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.scheduleUpdate, { passive: true });
    window.addEventListener('resize', this.scheduleUpdate);
    this.update();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scheduleUpdate);
    window.removeEventListener('resize', this.scheduleUpdate);

    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
    }
  }

  private update(): void {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
    const spark = this.spark.nativeElement;

    this.fill.nativeElement.style.transform = `scaleX(${progress})`;
    spark.style.transform = `translateX(${progress * window.innerWidth}px)`;
    spark.style.opacity = progress > 0 ? '1' : '0';
  }
}
