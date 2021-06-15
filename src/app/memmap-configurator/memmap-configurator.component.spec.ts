import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemmapConfiguratorComponent } from './memmap-configurator.component';

describe('MemmapConfiguratorComponent', () => {
  let component: MemmapConfiguratorComponent;
  let fixture: ComponentFixture<MemmapConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemmapConfiguratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemmapConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
