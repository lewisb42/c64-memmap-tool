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

    function findRadioButtonById(id:string): Promise<MatRadioButtonHarness> {
        return loader.getHarness(MatRadioButtonHarness.with({selector: id}));
    }
    
    function findSlideToggleById(id:string): Promise<MatSlideToggleHarness> {
        return loader.getHarness(MatSlideToggleHarness.with({selector: id}));
    }
    
    function findRadioGroupById(id:string): Promise<MatRadioGroupHarness> {
        return loader.getHarness(MatRadioGroupHarness.with({selector: id}));
    }

    it('should change to ASM mode', async () => {
        const useBasicRadioButton = await findRadioButtonById('#useBasicOption');
        await useBasicRadioButton.check();
    
        const useAsmRadioButton = await findRadioButtonById('#useAsmOption');
        await useAsmRadioButton.check();
        expect(component["basicMode"]).toBeFalsy();
        
    });
    
    it('should change to BASIC mode', async () => {
        
        const useBasicRadioButton = await findRadioButtonById('#useBasicOption');
        await useBasicRadioButton.check();
        
        const basicRomToggle = await findSlideToggleById('#useBasicRomToggle');
        expect(await basicRomToggle.isChecked()).toBeTruthy();
        expect(await basicRomToggle.isDisabled()).toBeDefined();
        
        const kernelRomToggle = await findSlideToggleById('#useKernelRomToggle');
        expect(await kernelRomToggle.isChecked()).toBeTruthy();
        expect(await kernelRomToggle.isDisabled()).toBeDefined();
        
        const romHiRadioGroup = await findRadioGroupById('#cartRomHiRadioGroup');
        expect(await romHiRadioGroup.getCheckedValue()).not.toBe('bankA');
    });

});


