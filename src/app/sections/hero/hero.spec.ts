import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderState } from '../../shared/page-loader/loader-state';
import { Hero } from './hero';

describe('Hero', () => {
  let component: Hero;
  let fixture: ComponentFixture<Hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
    }).compileComponents();

    fixture = TestBed.createComponent(Hero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hold its entrance until the loader finishes', async () => {
    const section = (fixture.nativeElement as HTMLElement).querySelector('#hero');
    expect(section?.classList.contains('hero-waiting')).toBe(true);

    TestBed.inject(LoaderState).finish();
    await fixture.whenStable();

    expect(section?.classList.contains('hero-waiting')).toBe(false);
  });
});
