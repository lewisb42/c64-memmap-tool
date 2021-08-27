import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';

import { MemmapConfiguratorComponent } from './memmap-configurator.component';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { GoogleChartComponent } from 'ng2-google-charts';

import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatRadioButtonHarness, MatRadioGroupHarness} from '@angular/material/radio/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import {MatRadioModule} from '@angular/material/radio';
import {ReactiveFormsModule} from '@angular/forms';



describe('MemmapConfiguratorComponent', () => {
  let fixture: ComponentFixture<MemmapConfiguratorComponent>;
  let loader: HarnessLoader;
  let rootLoader: HarnessLoader;
  let component: MemmapConfiguratorComponent;

  beforeAll(() => {
    //TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatGridListModule,
        MatSlideToggleModule,
        MatRadioModule,
        ReactiveFormsModule,
        FormsModule,
        
      ],
      declarations: [
        MemmapConfiguratorComponent,
        GoogleChartComponent
       ]
    }).compileComponents();
    fixture = TestBed.createComponent(MemmapConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeDefined();
  });


    it('should change from ASM to BASIC', () => {
        //component.ngOnInit();
        //component.onAssemblyModeSelected();
        //expect(component["basicMode"]).toBeFalsy();
        
        const debugElement: DebugElement = fixture.debugElement;
        debugElement.query(By.css('#useAsmOption'))!.triggerEventHandler('click', null);
        expect(component["basicMode"]).toBeFalsy();
    });

});
