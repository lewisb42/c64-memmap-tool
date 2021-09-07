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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatGridListModule,
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

    function findRadioGroupById(id:string): Promise<MatRadioGroupHarness> {
        return loader.getHarness(MatRadioGroupHarness.with({selector: '#'+id}));
    }

    async function findD000toDfffOptionsRadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('bankD-options');
    }

    async function findUseCartridgeRomRadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('cartRomSelector');
    }

    async function findCartRomHiOptionsRadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('cart-rom-config');
    }

    async function findBasicKernalOptionsRadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('basic-and-kernal-selection');
    }

    async function getD000toDfffOptions(): Promise<string|null> {
      const bank = await findD000toDfffOptionsRadioGroup();
      return await bank.getCheckedValue();
    }

    async function getUseCartridgeRom(): Promise<string|null> {
      const bank = await findUseCartridgeRomRadioGroup();
      return await bank.getCheckedValue();
    }

    async function getBasicAndKernalOptions(): Promise<string|null> {
      const bank = await findBasicKernalOptionsRadioGroup();
      return await bank.getCheckedValue();
    }

    async function selectUseCartridgeRom(): Promise<void> {
      const group = await findUseCartridgeRomRadioGroup();
      await group.checkRadioButton({ label: 'Use Cartridge ROM' });
    }

    async function selectCartRomHiAtE000toFFFF(): Promise<void> {
      const group = await findCartRomHiOptionsRadioGroup();
      await group.checkRadioButton({ label: 'CART ROM HI: $E000-$FFFF' });
    }

    async function selectIO(): Promise<void> {
      const group = await findD000toDfffOptionsRadioGroup();
      await group.checkRadioButton({ label: 'IO' });
    }

    async function selectCharRom(): Promise<void> {
      const group = await findD000toDfffOptionsRadioGroup();
      await group.checkRadioButton({ label: 'Character ROM' });
    }

    it('should default to mode 31', async () => {
      expect(await getUseCartridgeRom()).toBeTruthy();
      expect(await getBasicAndKernalOptions()).toBe('BASIC_AND_KERNAL');
      expect(await getD000toDfffOptions()).toBe('IO');
    });


    it('should force IO when CART ROM HI is $E000=$FFFF', async () => {
      await selectUseCartridgeRom();
      await selectCharRom(); // move it off the default of IO
      await selectCartRomHiAtE000toFFFF();
      expect(await getD000toDfffOptions()).toBe('IO');
    });
});
