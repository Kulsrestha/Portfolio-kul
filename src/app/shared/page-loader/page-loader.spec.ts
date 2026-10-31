import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLoader } from './page-loader';

describe('PageLoader', () => {
  let fixture: ComponentFixture<PageLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLoader);
    await fixture.whenStable();
  });

  it('should show the loader and lock scrolling while loading', () => {
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="status"]')).toBeTruthy();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore scrolling when destroyed', () => {
    fixture.destroy();

    expect(document.body.style.overflow).toBe('');
  });
});
