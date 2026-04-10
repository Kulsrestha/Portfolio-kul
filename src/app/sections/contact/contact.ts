import { Component } from '@angular/core';
import { personalInfo } from '../../data/portfolio-data';

@Component({
  selector: 'app-contact',
  imports: [],
  standalone: true,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly personalInfo = personalInfo;
}
