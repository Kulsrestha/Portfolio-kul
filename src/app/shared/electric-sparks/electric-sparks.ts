import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LIGHTNING_COLOR, SPARK_COLOR } from '../flowing-waves/flowing-waves';

interface Ember {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
}

interface Arc {
  x: number;
  y: number;
  points: { x: number; y: number }[];
  life: number;
}

const MAX_PIXEL_RATIO = 2;
const GRAVITY = 420;
const ARC_LIFE = 0.22;

const random = (min: number, max: number): number => min + Math.random() * (max - min);

@Component({
  selector: 'app-electric-sparks',
  standalone: true,
  templateUrl: './electric-sparks.html',
  host: {
    class: 'absolute -inset-10 block pointer-events-none z-20',
    'aria-hidden': 'true',
  },
})
export class ElectricSparks implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvas!: ElementRef<HTMLCanvasElement>;

  private context: CanvasRenderingContext2D | null = null;
  private embers: Ember[] = [];
  private arcs: Arc[] = [];
  private frame: number | null = null;
  private lastTime = 0;
  private width = 0;
  private height = 0;
  private reducedMotion = false;
  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    this.context = canvas.getContext('2d');

    if (!this.context) {
      return;
    }

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
  }

  ngOnDestroy(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
    }
    this.resizeObserver?.disconnect();
  }

  burstFrom(element: HTMLElement): void {
    if (!this.context || this.reducedMotion) {
      return;
    }

    const origin = element.getBoundingClientRect();
    const bounds = this.canvas.nativeElement.getBoundingClientRect();
    const x = origin.left - bounds.left + 8;
    const y = origin.top - bounds.top + origin.height / 2;
    const emberCount = Math.round(random(22, 34));

    for (let i = 0; i < emberCount; i++) {
      const maxLife = random(0.35, 0.8);

      this.embers.push({
        x,
        y,
        velocityX: random(-240, 240),
        velocityY: random(-300, -40),
        life: maxLife,
        maxLife,
      });
    }

    this.arcs.push({ x, y, points: this.arcPoints(x, y), life: ARC_LIFE });

    if (this.frame === null) {
      this.lastTime = performance.now();
      this.frame = requestAnimationFrame((now) => this.tick(now));
    }
  }

  private arcPoints(x: number, y: number): { x: number; y: number }[] {
    const points = [{ x, y }];
    let currentX = x;
    let currentY = y;

    for (let i = 0; i < 5; i++) {
      currentX += random(-12, 12);
      currentY -= random(6, 14);
      points.push({ x: currentX, y: currentY });
    }

    return points;
  }

  private tick(now: number): void {
    const elapsed = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.update(elapsed);
    this.draw();

    const active = this.embers.length > 0 || this.arcs.length > 0;
    this.frame = active ? requestAnimationFrame((next) => this.tick(next)) : null;
  }

  private update(elapsed: number): void {
    for (const ember of this.embers) {
      ember.x += ember.velocityX * elapsed;
      ember.y += ember.velocityY * elapsed;
      ember.velocityY += GRAVITY * elapsed;
      ember.life -= elapsed;
    }
    for (const arc of this.arcs) {
      arc.life -= elapsed;
    }

    this.embers = this.embers.filter((ember) => ember.life > 0);
    this.arcs = this.arcs.filter((arc) => arc.life > 0);
  }

  private draw(): void {
    const context = this.context;
    if (!context) {
      return;
    }

    context.clearRect(0, 0, this.width, this.height);
    context.globalCompositeOperation = 'lighter';
    context.lineCap = 'round';

    this.arcs.forEach((arc) => this.drawArc(context, arc));
    this.embers.forEach((ember) => this.drawEmber(context, ember));
  }

  private drawArc(context: CanvasRenderingContext2D, arc: Arc): void {
    const strength = arc.life / ARC_LIFE;
    const glow = context.createRadialGradient(arc.x, arc.y, 0, arc.x, arc.y, 30);
    glow.addColorStop(0, LIGHTNING_COLOR);
    glow.addColorStop(1, `${LIGHTNING_COLOR}00`);

    context.globalAlpha = strength * 0.7;
    context.fillStyle = glow;
    context.beginPath();
    context.arc(arc.x, arc.y, 30, 0, Math.PI * 2);
    context.fill();

    // Skipping the odd frame makes the arc flicker like a real spark.
    if (Math.random() < 0.25) {
      return;
    }

    const path = new Path2D();
    arc.points.forEach((point) => path.lineTo(point.x, point.y));

    context.globalAlpha = strength * 0.5;
    context.strokeStyle = LIGHTNING_COLOR;
    context.lineWidth = 4;
    context.stroke(path);

    context.globalAlpha = strength;
    context.strokeStyle = SPARK_COLOR;
    context.lineWidth = 1.4;
    context.stroke(path);
  }

  private drawEmber(context: CanvasRenderingContext2D, ember: Ember): void {
    const strength = ember.life / ember.maxLife;

    context.globalAlpha = strength;
    context.strokeStyle = strength > 0.45 ? SPARK_COLOR : LIGHTNING_COLOR;
    context.lineWidth = 1.8;
    context.beginPath();
    context.moveTo(ember.x, ember.y);
    context.lineTo(ember.x - ember.velocityX * 0.028, ember.y - ember.velocityY * 0.028);
    context.stroke();
  }

  private resize(): void {
    const canvas = this.canvas.nativeElement;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    canvas.width = this.width * pixelRatio;
    canvas.height = this.height * pixelRatio;
    this.context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }
}
