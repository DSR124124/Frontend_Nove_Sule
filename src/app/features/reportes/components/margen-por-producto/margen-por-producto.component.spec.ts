import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MargenPorProductoComponent } from './margen-por-producto.component';

describe('MargenPorProductoComponent', () => {
  let component: MargenPorProductoComponent;
  let fixture: ComponentFixture<MargenPorProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MargenPorProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MargenPorProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
