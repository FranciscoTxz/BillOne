import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarCfdiComponent } from './recuperar-cfdi.component';

describe('RecuperarCfdiComponent', () => {
  let component: RecuperarCfdiComponent;
  let fixture: ComponentFixture<RecuperarCfdiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarCfdiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperarCfdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
