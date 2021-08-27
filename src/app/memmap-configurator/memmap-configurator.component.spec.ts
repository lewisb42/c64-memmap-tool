import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';

import { MemmapConfiguratorComponent } from './memmap-configurator.component';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { GoogleChartComponent } from 'ng2-google-charts';

import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import { 
    MatRadioButtonHarness, 
    MatRadioGroupHarness,
    } from '@angular/material/radio/testing';
import {MatSlideToggleHarness} from '@angular/material/slide-toggle/testing';
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


    it('should change from ASM to BASIC', async () => {
      
        const useAsmRadioButton = await loader.getHarness(MatRadioButtonHarness.with({selector: '#useAsmOption'}));
        await useAsmRadioButton.check();
        expect(component["basicMode"]).toBeFalsy();
        
    });
    
    it('should change to BASIC mode', async () => {
        
        const useBasicRadioButton = await loader.getHarness(MatRadioButtonHarness.with({selector: '#useBasicOption'}));
        await useBasicRadioButton.check();
        
        const kernelRomToggle = await loader.getHarness(MatSlideToggleHarness.with({ selector: "#useKernelRomToggle" }));
        expect(await kernelRomToggle.isChecked()).toBeTruthy();
        expect(await kernelRomToggle.isDisabled()).toBeDefined();
    });

});
