import { Component } from '@angular/core';
import { Projects } from './sections/projects/projects';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Footer } from './sections/footer/footer';
import { Hero } from './sections/hero/hero';
import { Qualification } from './sections/qualification/qualification';
import { Skills } from './sections/skills/skills';
import { Navbar } from './shared/navbar/navbar';
import { ScrollToTop } from './shared/scroll-to-top/scroll-to-top';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Navbar,
    Hero,
    About,
    Skills,
    Projects,
    Qualification,
    Contact,
    Footer,
    ScrollToTop,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}