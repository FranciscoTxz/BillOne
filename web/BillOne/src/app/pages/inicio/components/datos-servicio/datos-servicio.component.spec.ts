import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosServicioComponent } from './datos-servicio.component';

describe('DatosServicioComponent', () => {
  let component: DatosServicioComponent;
  let fixture: ComponentFixture<DatosServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosServicioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatosServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
