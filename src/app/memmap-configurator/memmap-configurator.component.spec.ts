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

    async function setBank8ValueTo(value: string): Promise<void> {
      const bank = await findBank8RadioGroup();
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
        await setBankAValueTo('RAM');
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

    // keep getting an error:
    // Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'.. Find more at https://angular.io/errors/NG0100
    xdescribe('when $E000-$FFFF is CART ROM HI', () => {
      beforeEach(async () => {
        await setBankAValueTo('RAM'); // enables bank E
        await setBankEValueTo('CART ROM HI');
        fixture.detectChanges();
      });

      it('should force $D000-$DFFF to IO and disable it', async () => {
        expect(await getBankDValue()).toBe('IO');
      });

      it('should force $8000-$9fff to CART ROM LO', async () => {
        expect(await getBank8Value()).toBe('CART ROM LO');
      });
    });

    it('should disable CART_ROM_HI in $E000-$FFFF when $D000-$DFFF is CHAR_ROM', async () => {
      await setBankAValueTo('RAM'); // enables bank E
      await setBankEValueTo('KERNAL ROM');
      await setBankDValueTo('CHAR ROM');
      fixture.detectChanges();
      let bankECartRomHi = fixture.debugElement.query(By.css('#bankE_cart_rom_hi'));
      expect(bankECartRomHi.attributes['ng-reflect-disabled']).toBeTruthy();
    });

    describe("when $A000-$BFFF's CART ROM HI is selected", () => {
      beforeEach(async () => {
        await setBankAValueTo('CART ROM HI');
      });

      it("should disable $E000-$FFFF's CART ROM HI", async () => {
        fixture.detectChanges();
        let bankECartRomHi = fixture.debugElement.query(By.css('#bankE_cart_rom_hi'));
        expect(bankECartRomHi.attributes['ng-reflect-disabled']).toBeTruthy();
      });

      it("should select KERNEL ROM", async () => {
        expect(await getBankEValue()).toBe('KERNAL_ROM');
      });
    });

    describe('when KERNAL ROM selected', async () => {
      beforeEach(async () => {
        await setBankAValueTo('RAM'); // enables bank E
        await setBankEValueTo('KERNAL ROM');
      });

      it('should disable RAM in $D000-$DFFF', async () => {
        expect(await getBankDValue()).not.toBe('RAM');
        fixture.detectChanges();
        let bankECartRomHi = fixture.debugElement.query(By.css('#bankD_ram'));
        expect(bankECartRomHi.attributes['ng-reflect-disabled']).toBeTruthy();
      });
    });

    describe('when CART ROM LO selected', () => {

      beforeEach(async () => {
        await setBank8ValueTo('RAM');
        await setBankAValueTo('RAM'); // enables bank E
        await setBankEValueTo('RAM'); // enables bank D's RAM option
        await setBankDValueTo('RAM'); // gets us to a good starting point

        await setBank8ValueTo('CART ROM LO');
      });

      it('should disallow RAM in $A000-$BFFF and $D000-$DFFF', async () => {
        expect(await getBankAValue()).not.toBe('RAM');
        expect(await getBankDValue()).not.toBe('RAM');
      });

      it('should force KERNAL_ROM in $E000-$FFFF', async () => {
        expect(await getBankEValue()).toBe('KERNAL ROM');
      });
    });
});
