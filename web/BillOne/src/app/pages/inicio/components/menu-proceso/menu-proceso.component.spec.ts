import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProcesoComponent } from './menu-proceso.component';

describe('MenuProcesoComponent', () => {
  let component: MenuProcesoComponent;
  let fixture: ComponentFixture<MenuProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuProcesoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
