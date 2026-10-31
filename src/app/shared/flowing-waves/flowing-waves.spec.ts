import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowingWaves } from './flowing-waves';

describe('FlowingWaves', () => {
  let component: FlowingWaves;
  let fixture: ComponentFixture<FlowingWaves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowingWaves],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowingWaves);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
