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
        return loader.getHarness(MatRadioButtonHarness.with({selector: '#' + id}));
    }
    
    function findSlideToggleById(id:string): Promise<MatSlideToggleHarness> {
        return loader.getHarness(MatSlideToggleHarness.with({selector: '#' + id}));
    }
    
    function findRadioGroupById(id:string): Promise<MatRadioGroupHarness> {
        return loader.getHarness(MatRadioGroupHarness.with({selector: '#'+id}));
    }
    
    async function selectAssemblyLanguage(): Promise<void> {
        const useAsmRadioButton = await findRadioButtonById('useAsmOption');
        await useAsmRadioButton.check();
    }
    
    async function selectBasicLanguage(): Promise<void> {
        const useBasicRadioButton = await findRadioButtonById('useBasicOption');
        await useBasicRadioButton.check();
    }
    
    async function findBasicRomSlideToggle(): Promise<MatSlideToggleHarness> {
        return findSlideToggleById('useBasicRomToggle');
        
    }
    
    async function findCartRomHiRadioGroup(): Promise<MatRadioGroupHarness> {
        return findRadioGroupById('cartRomHiRadioGroup');
        
    }
    
    async function findKernelRomSlideToggle(): Promise<MatSlideToggleHarness> {
        return findSlideToggleById('useKernelRomToggle');
        
    }
    
    async function findBankARadioButton(): Promise<MatRadioButtonHarness> {
        return findRadioButtonById('bankARadioButton');
    }
    
    async function findBankERadioButton(): Promise<MatRadioButtonHarness> {
        return findRadioButtonById('bankERadioButton');
    }
    
    async function findUnmappedRomHiRadioButton(): Promise<MatRadioButtonHarness> {
        return findRadioButtonById('unmappedRadioButton');
    }
    
    async function selectBasicRom(): Promise<void> {
        const basicRomSlideToggle = await findBasicRomSlideToggle();
        await basicRomSlideToggle.check();
    }
    
    async function selectKernelRom(): Promise<void> {
        const kernelRomSlideToggle = await findKernelRomSlideToggle();
        await kernelRomSlideToggle.check();
    }
    
    async function selectBankE(): Promise<void> {
        const bankERadioButton = await findBankERadioButton();
        await bankERadioButton.check();
    }
    
    async function selectBankA(): Promise<void> {
        const bankARadioButton = await findBankARadioButton();
        await bankARadioButton.check();
    }

    it('should change to ASM mode', async () => {
        await selectBasicLanguage();
        await selectAssemblyLanguage();
        expect(component["basicMode"]).toBeFalsy();
        
    });
    
    it('should change to BASIC mode', async () => {
        await selectBasicLanguage();
   
        const basicRomSlideToggle = await findBasicRomSlideToggle();
        expect(await basicRomSlideToggle.isChecked()).toBeTruthy();
        expect(await basicRomSlideToggle.isDisabled()).toBeDefined();
        
        const kernelRomSlideToggle = await findKernelRomSlideToggle();
        expect(await kernelRomSlideToggle.isChecked()).toBeTruthy();
        expect(await kernelRomSlideToggle.isDisabled()).toBeDefined();
        
        const cartRomHiRadioGroup = await findCartRomHiRadioGroup();
        expect(await cartRomHiRadioGroup.getCheckedValue()).not.toBe('bankA');
        
        const bankARadioButton = await findBankARadioButton();
        expect(await bankARadioButton.isChecked()).toBeFalsy();
        expect(await bankARadioButton.isDisabled()).toBeTrue();
    });
    
    it('should use BASIC ROM', async () => {
        await selectBasicRom();
        
        const kernelRomToggle = await findKernelRomSlideToggle()
        expect(await kernelRomToggle.isChecked()).toBeTruthy();
        expect(await kernelRomToggle.isDisabled()).toBeDefined();
        
        const bankARadioButton = await findBankARadioButton();
        expect(await bankARadioButton.isChecked()).toBeFalsy();
        expect(await bankARadioButton.isDisabled()).toBeTrue();
        
        const bankERadioButton = await findBankERadioButton();
        expect(await bankERadioButton.isChecked()).toBeFalsy();
        expect(await bankERadioButton.isDisabled()).toBeTrue();
    });

    it('should not affect bank A when only kernel ROM is selected', async () => {
        await selectBankA();
        await selectKernelRom();
        
        const bankARadioButton = await findBankARadioButton();
        expect(await bankARadioButton.isChecked()).toBeTruthy();
        expect(await bankARadioButton.isDisabled()).toBeFalsy();
        
        const bankERadioButton = await findBankERadioButton();
        expect(await bankERadioButton.isChecked()).toBeFalsy();
        expect(await bankERadioButton.isDisabled()).toBeTrue();
    });
    
    it('should switch from bank E to unmapped when kernel ROM is selected', async () => {
        await selectBankE();
        await selectKernelRom();
        
        const unmappedRomHiRadioButton = await findUnmappedRomHiRadioButton();
        expect(await unmappedRomHiRadioButton.isChecked()).toBeTruthy();
        expect(await unmappedRomHiRadioButton.isDisabled()).toBeFalsy();
        
        const bankERadioButton = await findBankERadioButton();
        expect(await bankERadioButton.isChecked()).toBeFalsy();
        expect(await bankERadioButton.isDisabled()).toBeTrue();
    });
});


