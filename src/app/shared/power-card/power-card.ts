import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

const MAX_TILT = 6;
const VISIBLE_SHARE_TO_POWER_ON = 0.55;

// Powers a card on while it's hovered, or while it's in view on screens without a hover.
// Native listeners keep mouse moves from triggering change detection.
@Directive({
  selector: '[appPowerCard]',
  standalone: true,
})
export class PowerCard implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private surface: HTMLElement | null = null;
  private observer: IntersectionObserver | null = null;
  private reducedMotion = false;

  private readonly onEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') {
      this.host.classList.add('is-powered');
    }
  };

  private readonly onMove = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && !this.reducedMotion) {
      this.tilt(event);
    }
  };

  private readonly onLeave = () => {
    this.host.classList.remove('is-powered');

    if (this.surface) {
      this.surface.style.transform = '';
    }
  };

  ngAfterViewInit(): void {
    // The tilt moves an inner surface, so the card can't tilt out from under the cursor.
    this.surface = this.host.querySelector<HTMLElement>('.tilt-surface');
    this.reducedMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (window.matchMedia?.('(hover: none)').matches) {
      this.observer = new IntersectionObserver(
        ([entry]) => this.host.classList.toggle('is-powered', entry.isIntersecting),
        { threshold: VISIBLE_SHARE_TO_POWER_ON },
      );
      this.observer.observe(this.host);
      return;
    }

    this.host.addEventListener('pointerenter', this.onEnter);
    this.host.addEventListener('pointermove', this.onMove);
    this.host.addEventListener('pointerleave', this.onLeave);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.host.removeEventListener('pointerenter', this.onEnter);
    this.host.removeEventListener('pointermove', this.onMove);
    this.host.removeEventListener('pointerleave', this.onLeave);
  }

  private tilt(event: PointerEvent): void {
    if (!this.surface) {
      return;
    }

    const bounds = this.host.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    // The side nearest the cursor comes towards the viewer.
    const rotateX = y * 2 * MAX_TILT;
    const rotateY = -x * 2 * MAX_TILT;

    this.surface.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
  }
}
