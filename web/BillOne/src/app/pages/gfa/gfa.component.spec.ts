import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GfaComponent } from './gfa.component';

describe('GfaComponent', () => {
  let component: GfaComponent;
  let fixture: ComponentFixture<GfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
