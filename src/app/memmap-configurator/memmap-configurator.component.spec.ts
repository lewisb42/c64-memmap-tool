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

    async function findBank8RadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('bank8');
    }

    async function findBankARadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('bankA');
    }

    async function findBankDRadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('bankD');
    }

    async function findBankERadioGroup(): Promise<MatRadioGroupHarness> {
      return findRadioGroupById('bankE');
    }

    async function getBank8Value(): Promise<string|null> {
      const bank = await findBank8RadioGroup();
      return await bank.getCheckedValue();
    }

    async function getBankAValue(): Promise<string|null> {
      const bank = await findBankARadioGroup();
      return await bank.getCheckedValue();
    }

    async function getBankDValue(): Promise<string|null> {
      const bank = await findBankDRadioGroup();
      return await bank.getCheckedValue();
    }

    async function getBankEValue(): Promise<string|null> {
      const bank = await findBankERadioGroup();
      return await bank.getCheckedValue();
    }

    async function setBankAValueTo(value: string): Promise<void> {
      const bank = await findBankARadioGroup();
      await bank.checkRadioButton({ label: value });
    }

    async function setBankEValueTo(value: string): Promise<void> {
      const bank = await findBankERadioGroup();
      await bank.checkRadioButton({ label: value });
    }

    async function setBankDValueTo(value: string): Promise<void> {
      const bank = await findBankDRadioGroup();
      await bank.checkRadioButton({ label: value });
    }

    it('should default to mode 31', async () => {
      expect(await getBank8Value()).toBe('RAM');
      expect(await getBankAValue()).toBe('BASIC_ROM');
      expect(await getBankDValue()).toBe('IO');
      expect(await getBankEValue()).toBe('KERNAL_ROM');
    });

    describe('when basic rom selected', () => {

      beforeEach(async () => {
        await setBankEValueTo('RAM');
        await setBankDValueTo('RAM');
        await setBankAValueTo('BASIC ROM');
      });

      it('should select kernal rom alongside basic rom', async () => {
        expect(await getBankEValue()).toBe('KERNAL_ROM');
      });

      it('should disallow RAM in $D000-$DFFF', async () => {
        expect(await getBankDValue()).not.toBe('RAM');
      });
    });



    it('should make $A000-$BFFF unvailable when $E000-$FFFF is CART ROM HI', async () => {
      await setBankAValueTo('RAM'); // enables bank E
      await setBankEValueTo('CART ROM HI');
      fixture.detectChanges();
      let bankAGroup = fixture.debugElement.query(By.css('#bankA'));
      expect(bankAGroup).toBeNull();
    });
});
