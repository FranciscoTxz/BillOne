import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasEmitidasComponent } from './facturas-emitidas.component';

describe('FacturasEmitidasComponent', () => {
  let component: FacturasEmitidasComponent;
  let fixture: ComponentFixture<FacturasEmitidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturasEmitidasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturasEmitidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
