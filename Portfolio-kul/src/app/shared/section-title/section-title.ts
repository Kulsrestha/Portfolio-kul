import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  templateUrl: './section-title.html',
  styleUrl: './section-title.css',
})
export class SectionTitle {
  @Input() text = '';
  @Input() id = '';
}
