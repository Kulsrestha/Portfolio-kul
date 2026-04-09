import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { heroTypewriterLines, personalInfo } from '../../data/portfolio-data';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  protected readonly personalInfo = personalInfo;
  protected typedText = '';

  private phraseIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timerId: number | undefined;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
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
