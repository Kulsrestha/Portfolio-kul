import { CommonModule } from '@angular/common';
import { afterNextRender, Component, ElementRef, inject, Injector, ViewChild } from '@angular/core';
import { education, experience, personalInfo, projects, skills } from '../../data/portfolio-data';
import { ElectricSparks } from '../../shared/electric-sparks/electric-sparks';
import { FlowingWaves } from '../../shared/flowing-waves/flowing-waves';
import { SectionTitle } from '../../shared/section-title/section-title';

interface TerminalLink {
  label: string;
  href: string;
}

interface TerminalLine {
  kind: 'command' | 'output' | 'error';
  text: string;
  link?: TerminalLink;
}

interface TerminalCommand {
  name: string;
  description: string;
  run: () => TerminalLine[];
}

const output = (text: string, href?: string): TerminalLine => ({
  kind: 'output',
  text,
  link: href ? { label: linkLabel(href), href } : undefined,
});

const linkLabel = (href: string): string => {
  if (href.startsWith('mailto:')) {
    return href.replace('mailto:', '');
  }

  const url = new URL(href);
  return (url.hostname + url.pathname).replace(/^www\./, '').replace(/\/$/, '');
};

const skillNames = (items: { name: string }[]): string => items.map((item) => item.name).join(', ');

@Component({
  selector: 'app-terminal',
  imports: [CommonModule, ElectricSparks, FlowingWaves, SectionTitle],
  standalone: true,
  templateUrl: './terminal.html',
})
export class Terminal {
  @ViewChild('body') private body!: ElementRef<HTMLElement>;
  @ViewChild('field') private field!: ElementRef<HTMLInputElement>;
  @ViewChild(ElectricSparks) private sparks!: ElectricSparks;

  private readonly injector = inject(Injector);
  private readonly history: string[] = [];
  private historyIndex = -1;

  protected readonly prompt = 'guest@kj:~$';
  protected readonly hints = ['help', 'about', 'skills', 'projects', 'experience', 'education', 'contact', 'resume'];
  protected input = '';
  protected lines: TerminalLine[] = [
    output('Welcome! Type a command below, or click one of the hints.'),
  ];

  private readonly commands: TerminalCommand[] = [
    { name: 'help', description: 'list all commands', run: () => this.helpLines() },
    {
      name: 'about',
      description: 'who I am',
      run: () => [
        output(`${personalInfo.name} · ${personalInfo.title}`),
        output(personalInfo.summary),
      ],
    },
    {
      name: 'skills',
      description: 'my tech stack',
      run: () => [
        output(`languages  · ${skillNames(skills.languages)}`),
        output(`frameworks · ${skillNames(skills.frameworksAndLibraries)}`),
        output(`tools      · ${skillNames(skills.toolsAndPlatforms)}`),
      ],
    },
    {
      name: 'projects',
      description: 'things I have built',
      run: () =>
        projects.flatMap((project) => [
          output(`${project.title} (${project.date}) · ${project.category}`),
          ...(project.liveLink ? [output('  live   · ', project.liveLink)] : []),
          ...(project.githubLink ? [output('  source · ', project.githubLink)] : []),
        ]),
    },
    {
      name: 'experience',
      description: 'where I have worked',
      run: () =>
        experience.flatMap((job) => [
          output(`${job.role} @ ${job.organization} · ${job.duration}`),
          ...job.points.map((point) => output(`  - ${point}`)),
        ]),
    },
    {
      name: 'education',
      description: 'where I studied',
      run: () =>
        education.map((item) =>
          output(`${item.degree} · ${item.institution} · ${item.duration} · ${item.score}`),
        ),
    },
    {
      name: 'contact',
      description: 'how to reach me',
      run: () => [
        output('email    · ', `mailto:${personalInfo.email}`),
        output('github   · ', personalInfo.github),
        output('linkedin · ', personalInfo.linkedin),
      ],
    },
    {
      name: 'resume',
      description: 'view my resume',
      run: () =>
        personalInfo.resumeLink
          ? [output('resume · ', personalInfo.resumeLink)]
          : [output('My resume is available on request. Run `contact` to reach me.')],
    },
    { name: 'clear', description: 'clear the terminal', run: () => [] },
  ];

  protected onInput(event: Event): void {
    this.input = (event.target as HTMLInputElement).value;
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.execute(this.input);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.browseHistory(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.browseHistory(-1);
    } else if (event.key === 'Tab') {
      this.complete(event);
    }
  }

  protected runHint(command: string): void {
    this.execute(command);

    // Skip this on touch screens, where focusing the field would pop up the keyboard after every tap.
    if (window.matchMedia('(hover: hover)').matches) {
      this.focusField();
    }
  }

  protected onBodyClick(event: MouseEvent): void {
    const clickedLink = (event.target as Element).closest('a');
    const selectingText = !!window.getSelection()?.toString();

    if (!clickedLink && !selectingText) {
      this.focusField();
    }
  }

  private execute(raw: string): void {
    const entered = raw.trim();
    this.input = '';
    this.historyIndex = -1;

    if (!entered) {
      this.append([{ kind: 'command', text: '' }]);
      return;
    }

    this.history.unshift(entered);
    this.sparks.burstFrom(this.field.nativeElement);
    const name = entered.toLowerCase().split(/\s+/)[0];

    if (name === 'clear') {
      this.lines = [];
      return;
    }

    this.append([{ kind: 'command', text: entered }, ...this.resolve(name)]);
  }

  private resolve(name: string): TerminalLine[] {
    const command = this.commands.find((item) => item.name === (name === 'whoami' ? 'about' : name));

    if (command) {
      return command.run();
    }

    return [{ kind: 'error', text: `command not found: ${name}. Type \`help\` or click a hint below.` }];
  }

  private helpLines(): TerminalLine[] {
    return this.commands.map((command) => output(`${command.name.padEnd(11)}· ${command.description}`));
  }

  private browseHistory(step: number): void {
    if (this.history.length === 0) {
      return;
    }

    this.historyIndex = Math.min(Math.max(this.historyIndex + step, -1), this.history.length - 1);
    this.input = this.historyIndex === -1 ? '' : this.history[this.historyIndex];
  }

  private complete(event: KeyboardEvent): void {
    const partial = this.input.trim().toLowerCase();
    const matches = this.commands
      .map((command) => command.name)
      .filter((name) => name.startsWith(partial));

    // With nothing to complete, leave Tab alone so keyboard users can reach the hints.
    if (!partial || matches.length === 0) {
      return;
    }

    event.preventDefault();

    if (matches.length === 1) {
      this.input = matches[0];
    } else {
      this.append([output(matches.join('  '))]);
    }
  }

  private append(lines: TerminalLine[]): void {
    this.lines = [...this.lines, ...lines];

    afterNextRender(
      () => {
        const body = this.body.nativeElement;
        body.scrollTop = body.scrollHeight;
      },
      { injector: this.injector },
    );
  }

  private focusField(): void {
    this.field.nativeElement.focus({ preventScroll: true });
  }
}
