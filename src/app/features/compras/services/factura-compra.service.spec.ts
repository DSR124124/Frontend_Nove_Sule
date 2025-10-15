import { TestBed } from '@angular/core/testing';

import { FacturaCompraService } from './factura-compra.service';

describe('FacturaCompraService', () => {
  let service: FacturaCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
