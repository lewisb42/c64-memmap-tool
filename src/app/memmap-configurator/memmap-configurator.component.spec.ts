import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemmapConfiguratorComponent } from './memmap-configurator.component';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';

import { GoogleChartComponent } from 'ng2-google-charts';


describe('MemmapConfiguratorComponent', () => {
  let component: MemmapConfiguratorComponent;
  let fixture: ComponentFixture<MemmapConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        MemmapConfiguratorComponent,
        GoogleChartComponent
      ],
      imports: [ 
        MatGridListModule,
        MatCardModule,
        MatFormFieldModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatDividerModule,
        ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemmapConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
