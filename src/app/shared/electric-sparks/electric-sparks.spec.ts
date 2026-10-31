import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricSparks } from './electric-sparks';

describe('ElectricSparks', () => {
  let component: ElectricSparks;
  let fixture: ComponentFixture<ElectricSparks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricSparks],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectricSparks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
