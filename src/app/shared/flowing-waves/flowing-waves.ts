import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type Side = -1 | 1;

interface Wave {
  // Distance from the middle at the edge of the screen, as a share of the section's height.
  base: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
  // Trips from the edge of the screen to the terminal per second.
  currentSpeed: number;
}

// Each wave is drawn once from the left and once from the right.
const WAVES: Wave[] = [
  { base: -0.3, amplitude: 0.11, frequency: 1.8, speed: 0.18, phase: 0, currentSpeed: 0.62 },
  { base: -0.2, amplitude: 0.14, frequency: 1.4, speed: -0.14, phase: 1.9, currentSpeed: 0.47 },
  { base: -0.1, amplitude: 0.12, frequency: 2.1, speed: 0.2, phase: 4.2, currentSpeed: 0.71 },
  { base: 0, amplitude: 0.16, frequency: 2.2, speed: 0.15, phase: 3.4, currentSpeed: 0.8 },
  { base: 0.1, amplitude: 0.12, frequency: 1.6, speed: -0.17, phase: 0.8, currentSpeed: 0.55 },
  { base: 0.2, amplitude: 0.13, frequency: 1.6, speed: -0.2, phase: 5.1, currentSpeed: 0.68 },
  { base: 0.3, amplitude: 0.1, frequency: 2.4, speed: 0.12, phase: 2.6, currentSpeed: 0.53 },
];

export const LIGHTNING_COLOR = '#38a8ff';
export const SPARK_COLOR = '#e6f7ff';

const RIGHT_SIDE_PHASE_SHIFT = 2.1;
const POINT_SPACING = 6;
const MAX_PIXEL_RATIO = 2;
const PULSE_LENGTH = 220;
// Narrow screens show part of a wave rather than squeezing the whole curve in.
const MIN_WAVE_WIDTH = 900;

const fraction = (value: number): number => value - Math.floor(value);

@Component({
  selector: 'app-flowing-waves',
  standalone: true,
  templateUrl: './flowing-waves.html',
  host: {
    class: 'absolute inset-0 block pointer-events-none',
    'aria-hidden': 'true',
  },
})
export class FlowingWaves implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D | null = null;
  private frame: number | null = null;
  private time = 0;
  private width = 0;
  private height = 0;
  private reducedMotion = false;
  private observers: { disconnect(): void }[] = [];

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');

    if (!this.context) {
      return;
    }

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = new ResizeObserver(() => this.resize());
    resize.observe(canvas);

    // Only animate while the section is on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.start();
      } else {
        this.stop();
      }
    });
    visibility.observe(canvas);

    this.observers = [resize, visibility];
  }

  ngOnDestroy(): void {
    this.stop();
    this.observers.forEach((observer) => observer.disconnect());
  }

  private start(): void {
    if (this.frame === null && !this.reducedMotion) {
      this.frame = requestAnimationFrame((now) => this.tick(now));
    }
  }

  private stop(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  private tick(now: number): void {
    this.time = now / 1000;
    this.draw();
    this.frame = requestAnimationFrame((next) => this.tick(next));
  }

  private resize(): void {
    const canvas = this.canvas.nativeElement;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    canvas.width = this.width * pixelRatio;
    canvas.height = this.height * pixelRatio;
    this.context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    this.draw();
  }

  private draw(): void {
    const context = this.context;
    if (!context || this.width === 0) {
      return;
    }

    context.clearRect(0, 0, this.width, this.height);
    context.lineCap = 'round';

    for (const wave of WAVES) {
      for (const side of [-1, 1] as Side[]) {
        this.drawWire(context, wave, side);
        this.drawPulse(context, wave, side);
      }
    }
  }

  private drawWire(context: CanvasRenderingContext2D, wave: Wave, side: Side): void {
    context.globalAlpha = 0.3;
    context.lineWidth = 1;
    context.strokeStyle = LIGHTNING_COLOR;
    context.stroke(this.wavePath(wave, side, 0, 1));
  }

  // The current always runs inward, so the waves feel like they feed into the terminal.
  private drawPulse(context: CanvasRenderingContext2D, wave: Wave, side: Side): void {
    const length = PULSE_LENGTH / (this.width / 2);
    const progress = this.time * wave.currentSpeed + this.phaseFor(wave, side);
    const head = fraction(progress) * (1 + length);
    const tail = Math.max(head - length, 0);
    const end = Math.min(head, 1);

    if (tail >= end) {
      return;
    }

    const path = this.wavePath(wave, side, tail, end);

    // The tail fades to the same colour at zero alpha, so it never darkens on the way out.
    const gradient = context.createLinearGradient(this.waveX(side, tail), 0, this.waveX(side, end), 0);
    gradient.addColorStop(0, `${LIGHTNING_COLOR}00`);
    gradient.addColorStop(0.8, LIGHTNING_COLOR);
    gradient.addColorStop(1, SPARK_COLOR);
    context.strokeStyle = gradient;

    // A wide faint stroke under a thin bright one gives the glow.
    context.globalAlpha = 0.25;
    context.lineWidth = 6;
    context.stroke(path);

    context.globalAlpha = 1;
    context.lineWidth = 1.6;
    context.stroke(path);

    if (head <= 1) {
      this.drawHead(context, this.waveX(side, head), this.waveY(wave, side, head));
    }
  }

  private drawHead(context: CanvasRenderingContext2D, x: number, y: number): void {
    context.fillStyle = LIGHTNING_COLOR;
    context.globalAlpha = 0.3;
    context.beginPath();
    context.arc(x, y, 7, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = SPARK_COLOR;
    context.globalAlpha = 1;
    context.beginPath();
    context.arc(x, y, 2, 0, Math.PI * 2);
    context.fill();
  }

  private wavePath(wave: Wave, side: Side, from: number, to: number): Path2D {
    const path = new Path2D();
    const step = POINT_SPACING / (this.width / 2);

    for (let along = from; along < to; along += step) {
      path.lineTo(this.waveX(side, along), this.waveY(wave, side, along));
    }
    path.lineTo(this.waveX(side, to), this.waveY(wave, side, to));

    return path;
  }

  private phaseFor(wave: Wave, side: Side): number {
    return wave.phase + (side === 1 ? RIGHT_SIDE_PHASE_SHIFT : 0);
  }

  // "along" runs from 0 at the edge of the screen to 1 at the centre, behind the terminal.
  private waveX(side: Side, along: number): number {
    const distance = (along * this.width) / 2;
    return side === -1 ? distance : this.width - distance;
  }

  private waveY(wave: Wave, side: Side, along: number): number {
    const position = (((along * this.width) / 2) / Math.max(this.width, MIN_WAVE_WIDTH)) * Math.PI * 2;
    const offset = wave.speed * this.time + this.phaseFor(wave, side);
    const curve =
      wave.amplitude * Math.sin(position * wave.frequency + offset) +
      wave.amplitude * 0.35 * Math.sin(position * wave.frequency * 2.3 - offset * 0.6);

    // Everything narrows towards the middle, so the waves gather behind the terminal.
    return this.height * (0.5 + (wave.base + curve) * (1 - along));
  }
}
