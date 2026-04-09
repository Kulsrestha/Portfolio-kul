import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { skills } from '../../data/portfolio-data';
import { SectionTitle } from '../../shared/section-title/section-title';

@Component({
  selector: 'app-skills',
  imports: [CommonModule, SectionTitle],
  standalone: true,
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  private lastSoundTime = 0;
  private readonly soundFiles = [
    '/sounds/freesound_community-b6-82017.mp3',
    '/sounds/freesound_community-c6-102822.mp3',
    '/sounds/freesound_community-d6-82018.mp3',
    '/sounds/freesound_community-d6-82020.mp3',
    '/sounds/freesound_community-e6-82016.mp3',
    '/sounds/freesound_community-f6-102819.mp3',
    '/sounds/freesound_community-g6-82013.mp3',
    '/sounds/freesound_community-sol-101774.mp3',
    '/sounds/u_df365hdxp7-cinematic-piano-note-362716.mp3',
  ];

  protected readonly skills = skills;

  protected readonly categories = [
    { title: 'Languages', items: this.skills.languages },
    { title: 'Frameworks and Libraries', items: this.skills.frameworksAndLibraries },
    { title: 'Tools and Platforms', items: this.skills.toolsAndPlatforms },
  ];

  protected playHoverSound(): void {
    const now = performance.now();
    if (now - this.lastSoundTime < 80) {
      return;
    }
    this.lastSoundTime = now;

    if (this.soundFiles.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.soundFiles.length);
    const audio = new Audio(this.soundFiles[randomIndex]);
    audio.volume = 0.22;
    audio.play().catch(() => {
      // Audio playback may fail if the browser blocks autoplay before user interaction.
    });
  }
}
