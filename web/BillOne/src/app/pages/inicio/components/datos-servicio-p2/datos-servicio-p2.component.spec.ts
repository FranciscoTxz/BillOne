import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosServicioP2Component } from './datos-servicio-p2.component';

describe('DatosServicioP2Component', () => {
  let component: DatosServicioP2Component;
  let fixture: ComponentFixture<DatosServicioP2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosServicioP2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosServicioP2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
