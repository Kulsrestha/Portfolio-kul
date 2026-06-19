import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { personalInfo } from '../../data/portfolio-data';

interface NavLink {
  name: string;
  to: string;
}

interface BatInstance {
  el: HTMLElement;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  cx: number;
  cy: number;
  lift: number;
  wobble: number;
  depth: number;
  rotDir: number;
  delay: number;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnDestroy {
  protected readonly personalInfo = personalInfo;
  protected isOpen = false;
  protected scrolled = false;
  protected isLightTheme = true;
  protected isTransitioning = false;

  private animFrame: number | null = null;
  private activeBats: HTMLElement[] = [];
  private transitionLayer: HTMLElement | null = null;
  private themeFlipTimer: number | null = null;

  constructor() {
    this.setBodyTheme();
  }

  ngOnDestroy(): void {
    this.cleanupBats();
  }

  protected toggleTheme(event: MouseEvent): void {
    if (this.isTransitioning) {
      return;
    }

    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    this.isTransitioning = true;
    this.spawnBats(() => {
      this.isTransitioning = false;
    }, originX, originY);
  }

  private setBodyTheme(): void {
    document.body.classList.toggle('light-theme', this.isLightTheme);
    document.body.classList.toggle('default-theme', !this.isLightTheme);
  }

  protected readonly navLinks: NavLink[] = [
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Experience', to: 'experience' },
    { name: 'Contact', to: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  protected toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  protected closeMenu(): void {
    this.isOpen = false;
  }

  protected scrollTo(sectionId: string): void {
    this.closeMenu();

    if (this.isTransitioning) return;

    const element = document.getElementById(sectionId);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  private createBatEl(size: number, shade: string, flapSpeed: number): HTMLElement {
    const div = document.createElement('div');
    div.style.cssText = `
      position: absolute;
      pointer-events: none;
      opacity: 0;
      will-change: transform, opacity, filter;
      width: ${size}px;
      height: ${size * 0.56}px;
      transform-origin: 50% 52%;
      filter: drop-shadow(0 ${Math.max(2, size * 0.08)}px ${Math.max(5, size * 0.18)}px rgba(0, 0, 0, 0.48));
    `;
    div.innerHTML = `
      <svg viewBox="0 0 120 68" width="${size}" height="${size * 0.56}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <style>
          .bat-wing-left { transform-origin: 58px 33px; animation: bat-flap-left ${flapSpeed}ms ease-in-out infinite alternate; }
          .bat-wing-right { transform-origin: 62px 33px; animation: bat-flap-right ${flapSpeed}ms ease-in-out infinite alternate; }
          @keyframes bat-flap-left { from { transform: rotate(11deg) scaleY(0.72); } to { transform: rotate(-16deg) scaleY(1.08); } }
          @keyframes bat-flap-right { from { transform: rotate(-11deg) scaleY(0.72); } to { transform: rotate(16deg) scaleY(1.08); } }
        </style>
        <g fill="${shade}">
          <path class="bat-wing-left" d="M60 31C50 12 31 3 10 8C16 13 18 18 16 24C10 24 5 27 1 33C12 32 20 34 26 40C25 47 28 53 34 59C39 49 47 43 58 40Z"/>
          <path class="bat-wing-right" d="M60 31C70 12 89 3 110 8C104 13 102 18 104 24C110 24 115 27 119 33C108 32 100 34 94 40C95 47 92 53 86 59C81 49 73 43 62 40Z"/>
          <path d="M48 27C52 19 56 15 60 15C64 15 68 19 72 27C70 39 66 48 60 57C54 48 50 39 48 27Z"/>
          <path d="M54 16L49 6L59 12L60 15L61 12L71 6L66 16C64 14 62 13 60 13C58 13 56 14 54 16Z"/>
        </g>
      </svg>`;
    return div;
  }

  private createTransitionLayer(): HTMLElement {
    const layer = document.createElement('div');
    layer.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99990;
      pointer-events: none;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 42%, rgba(255,255,255,0.08), transparent 28%),
        radial-gradient(circle at 50% 50%, transparent 26%, rgba(0,0,0,0.34) 68%, rgba(0,0,0,0.7) 100%);
      opacity: 0;
      will-change: opacity;
    `;
    document.body.appendChild(layer);
    return layer;
  }

  private spawnBats(onComplete: () => void, originX = window.innerWidth / 2, originY = 40): void {
    this.cleanupBats();

    const count = Math.min(120, Math.max(76, Math.round(window.innerWidth / 13)));
    const duration = 1850;
    const flipAt = 0.58;
    const shades = ['#030303', '#08080b', '#101016', '#17151d'];
    const bats: BatInstance[] = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const diagonal = Math.hypot(vw, vh);
    const layer = this.createTransitionLayer();
    this.transitionLayer = layer;

    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      const size = 18 + depth * 58 + Math.random() * 24;
      const shade = shades[Math.floor(Math.random() * shades.length)];
      const el = this.createBatEl(size, shade, 88 + Math.random() * 92);
      const startX = originX + (Math.random() - 0.5) * 42;
      const startY = originY + (Math.random() - 0.5) * 22;
      const angle = -Math.PI * 0.96 + (i / Math.max(1, count - 1)) * Math.PI * 1.92 + (Math.random() - 0.5) * 0.35;
      const distance = diagonal * (0.56 + depth * 0.48);
      const tx = originX + Math.cos(angle) * distance;
      const ty = originY + Math.sin(angle) * distance + vh * (0.1 + Math.random() * 0.52);

      layer.appendChild(el);
      this.activeBats.push(el);
      bats.push({
        el,
        sx: startX,
        sy: startY,
        tx,
        ty,
        cx: (originX + tx) / 2 + (Math.random() - 0.5) * vw * 0.6,
        cy: Math.min(originY, ty) - vh * (0.15 + Math.random() * 0.45),
        lift: 22 + Math.random() * 64,
        wobble: 12 + Math.random() * 44,
        depth,
        rotDir: Math.random() > 0.5 ? 1 : -1,
        delay: Math.random() * 0.28,
      });
    }

    this.themeFlipTimer = window.setTimeout(() => {
      this.isLightTheme = !this.isLightTheme;
      document.body.classList.add('theme-transitioning');
      this.setBodyTheme();
      window.setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 900);
    }, duration * flipAt);

    const start = performance.now();

    const tick = (now: number) => {
      const raw = (now - start) / duration;
      const t = Math.min(raw, 1);
      const cover = Math.sin(Math.min(t, 0.92) * Math.PI);
      layer.style.opacity = String(Math.min(0.86, cover * 1.18));

      bats.forEach((b, i) => {
        const bt = Math.min(Math.max((t - b.delay) / (1 - b.delay), 0), 1);
        if (bt <= 0) return;

        const ease = bt < 0.5 ? 4 * bt * bt * bt : 1 - Math.pow(-2 * bt + 2, 3) / 2;
        const inv = 1 - ease;
        const nx = inv * inv * b.sx + 2 * inv * ease * b.cx + ease * ease * b.tx
          + Math.sin(now / 90 + i) * b.wobble * (0.45 + b.depth);
        const ny = inv * inv * b.sy + 2 * inv * ease * b.cy + ease * ease * b.ty
          + Math.cos(now / 120 + i * 0.7) * b.lift * (1 - Math.abs(0.5 - ease));
        const rot = Math.atan2(b.ty - b.sy, b.tx - b.sx) * 180 / Math.PI
          + b.rotDir * (6 + b.depth * 14)
          + Math.sin(now / 110 + i) * 9;
        const scale = 0.74 + b.depth * 1.08 + Math.sin(now / 130 + i) * 0.05;
        const fadeIn = Math.min(bt / 0.16, 1);
        const fadeOut = bt < 0.78 ? 1 : Math.max(0, 1 - (bt - 0.78) / 0.22);
        const fade = fadeIn * fadeOut * (0.72 + b.depth * 0.28);

        b.el.style.opacity = String(fade);
        b.el.style.transform = `translate3d(${nx - 60}px, ${ny - 34}px, 0) rotate(${rot}deg) scale(${scale})`;
      });

      if (t < 1) {
        this.animFrame = requestAnimationFrame(tick);
      } else {
        this.cleanupBats();
        onComplete();
      }
    };

    this.animFrame = requestAnimationFrame(tick);
  }

  private cleanupBats(): void {
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    if (this.themeFlipTimer !== null) {
      clearTimeout(this.themeFlipTimer);
      this.themeFlipTimer = null;
    }
    this.activeBats.forEach(b => b.remove());
    this.activeBats = [];
    this.transitionLayer?.remove();
    this.transitionLayer = null;
  }
}
