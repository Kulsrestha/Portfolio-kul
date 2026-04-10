import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { education, personalInfo } from '../../data/portfolio-data';
import { SectionTitle } from '../../shared/section-title/section-title';

@Component({
  selector: 'app-about',
  imports: [CommonModule, SectionTitle],
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly personalInfo = personalInfo;
  protected readonly education = education;
}
