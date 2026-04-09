import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { experience } from '../../data/portfolio-data';
import { SectionTitle } from '../../shared/section-title/section-title';

@Component({
  selector: 'app-qualification',
  imports: [CommonModule, SectionTitle],
  standalone: true,
  templateUrl: './qualification.html',
  styleUrl: './qualification.css',
})
export class Qualification {
  protected readonly experience = experience;
}
