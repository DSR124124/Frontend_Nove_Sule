import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RotacionInventarioComponent } from './rotacion-inventario.component';

describe('RotacionInventarioComponent', () => {
  let component: RotacionInventarioComponent;
  let fixture: ComponentFixture<RotacionInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RotacionInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RotacionInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
