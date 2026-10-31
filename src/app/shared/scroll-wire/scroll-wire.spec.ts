import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollWire } from './scroll-wire';

describe('ScrollWire', () => {
  let component: ScrollWire;
  let fixture: ComponentFixture<ScrollWire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollWire],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollWire);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the spark at the top of the page', () => {
    const spark = (fixture.nativeElement as HTMLElement).querySelector('.wire-spark') as HTMLElement;

    expect(spark.style.opacity).toBe('0');
  });
});
