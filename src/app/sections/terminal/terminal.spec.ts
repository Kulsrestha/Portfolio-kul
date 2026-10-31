import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Terminal } from './terminal';

describe('Terminal', () => {
  let fixture: ComponentFixture<Terminal>;
  let host: HTMLElement;

  const field = () => host.querySelector('input') as HTMLInputElement;
  const output = () => host.querySelector('[role="log"]')?.textContent ?? '';

  const press = async (key: string) => {
    field().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };

  const type = async (text: string) => {
    field().value = text;
    field().dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const run = async (text: string) => {
    await type(text);
    await press('Enter');
  };

  beforeEach(async () => {
    window.matchMedia = (() => ({ matches: false })) as unknown as typeof window.matchMedia;

    await TestBed.configureTestingModule({
      imports: [Terminal],
    }).compileComponents();

    fixture = TestBed.createComponent(Terminal);
    host = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should run a typed command and empty the field', async () => {
    await run('skills');

    expect(output()).toContain('PostgreSQL');
    expect(field().value).toBe('');
  });

  it('should ignore case and extra words', async () => {
    await run('  SKILLS now please');

    expect(output()).toContain('PostgreSQL');
  });

  it('should report unknown commands', async () => {
    await run('rm');

    expect(output()).toContain('command not found: rm');
  });

  it('should clear regardless of case', async () => {
    await run('skills');
    await run('CLEAR');

    expect(output()).not.toContain('PostgreSQL');
  });

  it('should run a command when its hint is clicked', async () => {
    const hint = Array.from(host.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'education',
    );

    hint?.click();
    await fixture.whenStable();

    expect(output()).toContain('Graphic Era Hill University');
  });

  it('should complete a unique prefix with Tab and list several', async () => {
    await type('pro');
    await press('Tab');
    expect(field().value).toBe('projects');

    await type('e');
    await press('Tab');
    expect(output()).toContain('experience  education');
  });

  it('should browse history with the arrow keys', async () => {
    await run('about');
    await run('skills');

    await press('ArrowUp');
    expect(field().value).toBe('skills');
    await press('ArrowUp');
    expect(field().value).toBe('about');
    await press('ArrowDown');
    await press('ArrowDown');
    expect(field().value).toBe('');
  });
});
