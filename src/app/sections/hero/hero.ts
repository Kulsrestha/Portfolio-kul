import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NgParticlesService, NgxParticlesModule } from '@tsparticles/angular';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { heroTypewriterLines, personalInfo } from '../../data/portfolio-data';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, NgxParticlesModule],
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  protected readonly personalInfo = personalInfo;
  protected readonly particlesId = 'hero-particles';
  protected readonly particlesOptions: ISourceOptions = {
    fullScreen: {
      enable: false,
    },
    background: {
      color: {
        value: 'transparent',
      },
    },
    detectRetina: true,
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: 150,
          links: {
            opacity: 0.4,
          },
        },
      },
    },
    particles: {
      color: {
        value: '#8c8c8c',
      },
      links: {
        color: '#777777',
        distance: 160,
        enable: true,
        opacity: 0.24,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: false,
        speed: 0.45,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 62,
      },
      opacity: {
        value: {
          min: 0.25,
          max: 0.75,
        },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: {
          min: 1,
          max: 4,
        },
      },
    },
  };
  protected typedText = '';

  private phraseIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timerId: number | undefined;

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private readonly ngParticlesService: NgParticlesService,
  ) {}

  ngOnInit(): void {
    void this.ngParticlesService.init(async (engine) => {
      await loadSlim(engine);
    });

    this.zone.runOutsideAngular(() => {
      this.timerId = window.setTimeout(() => this.zone.run(() => this.runTypewriter()), 200);
    });
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
  }

  protected scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }

    const top = element.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  private runTypewriter(): void {
    this.zone.run(() => {
      const current = heroTypewriterLines[this.phraseIndex];

      if (this.deleting) {
        this.charIndex -= 1;
        this.typedText = current.substring(0, this.charIndex);

        if (this.charIndex === 0) {
          this.deleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % heroTypewriterLines.length;
        }

        this.cdr.markForCheck();
        this.timerId = window.setTimeout(() => this.runTypewriter(), 75);
        return;
      }

      this.charIndex += 1;
      this.typedText = current.substring(0, this.charIndex);
      this.cdr.markForCheck();

      if (this.charIndex === current.length) {
        this.timerId = window.setTimeout(() => {
          this.deleting = true;
          this.runTypewriter();
        }, 1400);
        return;
      }

      this.timerId = window.setTimeout(() => this.runTypewriter(), 140);
    });
  }
}
