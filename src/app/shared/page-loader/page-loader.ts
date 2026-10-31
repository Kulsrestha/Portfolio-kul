import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ElectricSparks } from '../electric-sparks/electric-sparks';
import { FlowingWaves } from '../flowing-waves/flowing-waves';

// Long enough to see the logo charge up, even when the page loads instantly.
const MIN_DURATION = 1800;
// Never keep visitors out if something on the page refuses to finish loading.
const MAX_WAIT = 6000;
const EXIT_DURATION = 600;
const BURST_COUNT = 3;
const SMOOTHING = 0.12;

const STATUS_STEPS = [
  { upTo: 30, text: 'waking the circuits' },
  { upTo: 65, text: 'routing the current' },
  { upTo: 95, text: 'charging up' },
  { upTo: 100, text: 'going live' },
];

@Component({
  selector: 'app-page-loader',
  imports: [CommonModule, ElectricSparks, FlowingWaves],
  standalone: true,
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.css',
})
export class PageLoader implements OnInit, OnDestroy {
  @ViewChild(ElectricSparks) private sparks!: ElectricSparks;
  @ViewChild('center') private center!: ElementRef<HTMLElement>;

  protected readonly progress = signal(0);
  protected readonly visible = signal(true);
  protected readonly leaving = signal(false);
  protected readonly percent = computed(() => Math.round(this.progress()));
  protected readonly status = computed(
    () => STATUS_STEPS.find((step) => this.progress() <= step.upTo)?.text ?? '',
  );

  private readonly markLoaded = () => {
    this.loaded = true;
  };

  private loaded = false;
  private startTime = 0;
  private frame: number | null = null;
  private fallbackTimer: number | undefined;
  private exitTimer: number | undefined;

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.startTime = performance.now();

    if (document.readyState === 'complete') {
      this.loaded = true;
    } else {
      window.addEventListener('load', this.markLoaded);
      this.fallbackTimer = window.setTimeout(this.markLoaded, MAX_WAIT);
    }

    this.frame = requestAnimationFrame((now) => this.tick(now));
  }

  ngOnDestroy(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
    }
    window.clearTimeout(this.fallbackTimer);
    window.clearTimeout(this.exitTimer);
    window.removeEventListener('load', this.markLoaded);
    document.body.style.overflow = '';
  }

  private tick(now: number): void {
    const elapsed = now - this.startTime;
    const timeLimit = Math.min(elapsed / MIN_DURATION, 1) * 100;
    // While the page is still loading, keep creeping forward so it never looks stuck.
    const loadLimit = this.loaded ? 100 : 90 + 8 * (1 - Math.exp(-elapsed / 4000));
    const target = Math.min(timeLimit, loadLimit);
    const next = this.progress() + (target - this.progress()) * SMOOTHING;

    if (this.loaded && next > 99.5) {
      this.finish();
      return;
    }

    this.progress.set(next);
    this.frame = requestAnimationFrame((later) => this.tick(later));
  }

  private finish(): void {
    this.frame = null;
    this.progress.set(100);
    this.leaving.set(true);

    for (let i = 0; i < BURST_COUNT; i++) {
      this.sparks.burstFrom(this.center.nativeElement);
    }

    this.exitTimer = window.setTimeout(() => {
      this.visible.set(false);
      document.body.style.overflow = '';
    }, EXIT_DURATION);
  }
}
