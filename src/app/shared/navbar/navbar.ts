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
  angle: number;
  spiral: number;
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
      setTimeout(() => {
        this.isLightTheme = !this.isLightTheme;
        document.body.classList.add('theme-transitioning');
        this.setBodyTheme();
        window.setTimeout(() => {
          document.body.classList.remove('theme-transitioning');
        }, 900);
        this.isTransitioning = false;
      }, 120);
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

  // ── BAT TRANSITION ──────────────────────────────────────────────

  private createBatEl(size: number, color: string): HTMLElement {
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      opacity: 0;
      will-change: transform, opacity, left, top;
      width: ${size}px;
      height: ${size * 0.67}px;
      filter: drop-shadow(0 0 6px ${color}88);
    `;
    div.innerHTML = `
      <svg viewBox="0 0 36 24" width="${size}" height="${size * 0.67}"
           xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" d="M18 10 C14 4, 4 2, 0 8
          C3 8, 6 10, 8 12 C6 13, 4 15, 2 16
          C6 15, 10 14, 13 16 C14 18, 15 20, 18 21
          C21 20, 22 18, 23 16 C26 14, 30 15, 34 16
          C32 15, 30 13, 28 12 C30 10, 33 8, 36 8
          C32 2, 22 4, 18 10Z"/>
      </svg>`;
    return div;
  }

  private spawnBats(onComplete: () => void, originX = window.innerWidth / 2, originY = 40): void {
    this.cleanupBats();

    const COUNT = 500;
    const DURATION = 2600; // ms — slower overall movement
    const colors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9', '#5b21b6'];
    const bats: BatInstance[] = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    for (let i = 0; i < COUNT; i++) {
      const size = 14 + Math.random() * 18;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const el = this.createBatEl(size, color);

      const startX = originX + (Math.random() - 0.5) * 42;
      const startY = originY + (Math.random() - 0.5) * 22;
      el.style.left = startX + 'px';
      el.style.top = startY + 'px';

      document.body.appendChild(el);
      this.activeBats.push(el);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.max(vw, vh) * (0.5 + Math.random() * 0.4);
      const tx = originX + Math.cos(angle) * distance;
      const ty = originY + Math.sin(angle) * distance;

      bats.push({
        el,
        sx: startX,
        sy: startY,
        tx,
        ty,
        angle,
        spiral: 20 + Math.random() * 22,
        rotDir: Math.random() > 0.5 ? 1 : -1,
        delay: Math.random() * 0.18,
      });
    }

    const start = performance.now();

    const tick = (now: number) => {
      const raw = (now - start) / DURATION;
      const t = Math.min(raw, 1);

      bats.forEach((b, i) => {
        const bt = Math.min(Math.max((t - b.delay) / (1 - b.delay), 0), 1);
        if (bt <= 0) return;

        const travelProgress = Math.min(bt / 0.75, 1);
        const driftProgress = Math.max((bt - 0.75) / 0.25, 0);
        const ease = travelProgress < 0.5 ? 4 * travelProgress * travelProgress * travelProgress : 1 - Math.pow(-2 * travelProgress + 2, 3) / 2;
        const drift = driftProgress * 0.6;

        const nx = b.sx + (b.tx - b.sx) * ease
          + Math.cos(b.angle + bt * Math.PI * 2) * b.spiral * (1 - travelProgress) * 0.45
          + Math.cos(b.angle) * drift * 120;
        const ny = b.sy + (b.ty - b.sy) * ease
          + Math.sin(b.angle + bt * Math.PI * 2) * b.spiral * (1 - travelProgress) * 0.45
          + Math.sin(b.angle) * drift * 120;

        const flap = Math.sin(now / 140 + i * 1.2) * 0.25;
        const rot = b.rotDir * (12 + ease * 10) + Math.sin(now / 220 + i) * 6;
        const fade = bt < 0.75 ? 1 : Math.max(0, 1 - (bt - 0.75) / 0.5);

        b.el.style.opacity = String(fade);
        b.el.style.left = nx + 'px';
        b.el.style.top = ny + 'px';
        b.el.style.transform = `rotate(${rot}deg) scaleY(${0.72 + flap})`;
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
    this.activeBats.forEach(b => b.remove());
    this.activeBats = [];
  }
}