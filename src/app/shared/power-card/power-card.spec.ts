import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerCard } from './power-card';

@Component({
  imports: [PowerCard],
  template: `<div appPowerCard class="card"><div class="tilt-surface"></div></div>`,
})
class TestHost {}

describe('PowerCard', () => {
  let fixture: ComponentFixture<TestHost>;
  let card: HTMLElement;

  const pointer = (type: string, pointerType: string) =>
    card.dispatchEvent(Object.assign(new MouseEvent(type, { clientX: 100, clientY: 0 }), { pointerType }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    card = (fixture.nativeElement as HTMLElement).querySelector('.card') as HTMLElement;
    card.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
  });

  it('should power on while a mouse is over it, and off when it leaves', () => {
    pointer('pointerenter', 'mouse');
    expect(card.classList.contains('is-powered')).toBe(true);

    pointer('pointerleave', 'mouse');
    expect(card.classList.contains('is-powered')).toBe(false);
  });

  it('should ignore touch pointers', () => {
    pointer('pointerenter', 'touch');

    expect(card.classList.contains('is-powered')).toBe(false);
  });

  it('should bring the corner under the cursor towards the viewer, and reset on leave', () => {
    const surface = card.querySelector('.tilt-surface') as HTMLElement;

    pointer('pointermove', 'mouse');
    expect(surface.style.transform).toContain('rotateX(-6deg)');
    expect(surface.style.transform).toContain('rotateY(-6deg)');

    pointer('pointerleave', 'mouse');
    expect(surface.style.transform).toBe('');
  });
});
