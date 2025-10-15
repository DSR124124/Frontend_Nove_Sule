import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoResumenComponent } from './carrito-resumen.component';

describe('CarritoResumenComponent', () => {
  let component: CarritoResumenComponent;
  let fixture: ComponentFixture<CarritoResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarritoResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
