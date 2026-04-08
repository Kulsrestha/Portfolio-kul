import { Component } from '@angular/core';
import { Projects } from './sections/projects/projects';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Footer } from './sections/footer/footer';
import { Hero } from './sections/hero/hero';
import { Qualification } from './sections/qualification/qualification';
import { Services } from './sections/services/services';
import { Skills } from './sections/skills/skills';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Hero,
    About,
    Skills,
    Qualification,
    Services,
    Projects,
    Contact,
    Footer
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}