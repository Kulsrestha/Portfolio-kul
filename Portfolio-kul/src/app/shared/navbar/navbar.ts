import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { personalInfo } from '../../data/portfolio-data';

interface NavLink {
  name: string;
  to: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly personalInfo = personalInfo;
  protected isOpen = false;
  protected scrolled = false;

  protected readonly navLinks: NavLink[] = [
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Experience', to: 'experience' },
    { name: 'Contact', to: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  protected toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  protected closeMenu(): void {
    this.isOpen = false;
  }

  protected scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) {
      this.closeMenu();
      return;
    }

    const top = element.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
    this.closeMenu();
  }
}
