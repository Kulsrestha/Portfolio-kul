import { Component } from '@angular/core';
import { Projects } from './sections/projects/projects';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Footer } from './sections/footer/footer';
import { Hero } from './sections/hero/hero';
import { Qualification } from './sections/qualification/qualification';
import { Skills } from './sections/skills/skills';
import { Terminal } from './sections/terminal/terminal';
import { Navbar } from './shared/navbar/navbar';
import { PageLoader } from './shared/page-loader/page-loader';
import { ScrollToTop } from './shared/scroll-to-top/scroll-to-top';
import { ScrollWire } from './shared/scroll-wire/scroll-wire';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PageLoader,
    ScrollWire,
    Navbar,
    Hero,
    About,
    Skills,
    Projects,
    Qualification,
    Contact,
    Terminal,
    Footer,
    ScrollToTop,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {}