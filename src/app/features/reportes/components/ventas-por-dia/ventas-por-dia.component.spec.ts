import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPorDiaComponent } from './ventas-por-dia.component';

describe('VentasPorDiaComponent', () => {
  let component: VentasPorDiaComponent;
  let fixture: ComponentFixture<VentasPorDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasPorDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasPorDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
