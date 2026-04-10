import { Component } from '@angular/core';
import { personalInfo } from '../../data/portfolio-data';

@Component({
  selector: 'app-footer',
  imports: [],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly personalInfo = personalInfo;
  protected readonly year = new Date().getFullYear();
}
