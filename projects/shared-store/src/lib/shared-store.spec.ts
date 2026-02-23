import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedStore } from './shared-store';

describe('SharedStore', () => {
  let component: SharedStore;
  let fixture: ComponentFixture<SharedStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedStore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
