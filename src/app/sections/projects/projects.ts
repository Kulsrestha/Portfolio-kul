import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { projects } from '../../data/portfolio-data';
import { PowerCard } from '../../shared/power-card/power-card';
import { SectionTitle } from '../../shared/section-title/section-title';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, PowerCard, SectionTitle],
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly projects = projects;
}
