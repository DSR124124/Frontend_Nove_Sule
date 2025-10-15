import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusteFormComponent } from './ajuste-form.component';

describe('AjusteFormComponent', () => {
  let component: AjusteFormComponent;
  let fixture: ComponentFixture<AjusteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjusteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjusteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
