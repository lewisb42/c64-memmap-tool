import { Component, OnInit, SimpleChanges } from '@angular/core';
import { GoogleChartInterface, GoogleChartWrapper } from 'ng2-google-charts';
import { MemoryChunk, MemoryStatus } from '../models/memory-chunk';
import { MemoryBank } from '../models/memory-bank';
import { BankMode, BankState } from '../models/bank-mode'
import { MatTableDataSource } from '@angular/material/table';

function toAddress(x: number, offset:number): string {
  let baseHex = (x + offset).toString(16).toUpperCase();
  let numZeroes = 4 - baseHex.length;
  switch (numZeroes) {
    case 1: return "$0" + baseHex;
    case 2: return "$00" + baseHex;
    case 3: return "$000" + baseHex;
    default: return "$" + baseHex;
  }
}

@Component({
  selector: 'app-memmap-configurator',
  templateUrl: './memmap-configurator.component.html',
  styleUrls: ['./memmap-configurator.component.scss']
})
export class MemmapConfiguratorComponent implements OnInit {

  private createMemChart(): GoogleChartInterface{
    return {
      chartType: 'BarChart',

      options: {
        height: 100,
        legend: 'none',
        isStacked: true,
        options: {
          hAxis: {
            viewWindowMode: 'maximized'
          }
        }
      }
    }
  };

  public vicBank0Chart: GoogleChartInterface = this.createMemChart();
  public vicBank1Chart: GoogleChartInterface = this.createMemChart();
  public vicBank2Chart: GoogleChartInterface = this.createMemChart();
  public vicBank3Chart: GoogleChartInterface = this.createMemChart();

  readonly SCREEN_RAM_LOCATIONS: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                              11, 12, 13, 14, 15 ];

  readonly CHAR_RAM_LOCATIONS: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7 ];
  readonly SPRITE_NUMBERS: number[] = [ 0, 1, 2, 3, 4, 5, 6, 7 ];

  readonly BASIC_ROM: string = 'BASIC_ROM';

  readonly KERNAL_ROM: string = 'KERNAL_ROM';
  readonly UNAVAILABLE: string = 'UNAVAILABLE';
  readonly CART_ROM_HI: string = 'CART_ROM_HI';
  readonly CART_ROM_LO: string = 'CART_ROM_LO';


  vicBank: number = 0;

  readonly CHAR_ROM: string = 'CHAR_ROM';
  readonly IO: string = 'IO';
  readonly RAM: string = 'RAM';
  readonly BASIC_AND_KERNAL: string = 'BASIC_AND_KERNAL';
  readonly KERNAL_ONLY: string = 'KERNAL_ONLY';
  readonly NO_BASIC_OR_KERNAL: string = 'NO_BASIC_OR_KERNAL';
  readonly NO_CART_ROM_HI: string = "NO_CART_ROM_HI";
  readonly CART_ROM_HI_BANK_A: string = "CART_ROM_HI_BANK_A";
  readonly CART_ROM_HI_BANK_E: string = "CART_ROM_HI_BANK_E";

  useCartRom: boolean = false;
  kernalConfig: string = this.BASIC_AND_KERNAL;
  cartRomConfig: string = this.NO_CART_ROM_HI;
  bankDConfig: string = this.IO;
  screenRamLocation: number = 1;
  charsetRamLocation: number = 2; // default for vic bank 0

  private static UNAVAILABLE_COLOR = 'red';
  private static AVAILABLE_FOR_CODE_COLOR = 'green';
  private static AVAILABLE_FOR_DATA_COLOR = 'orange';
  private static RESERVED_FOR_GRAPHICS_COLOR = 'blue';
  private static OS_COLOR = 'yellow'; // used for both basic and kernal roms (incl. zero page)
  private static CART_ROM_COLOR = 'gray';
  private static IO_COLOR = 'purple';
  private static CHAR_ROM_COLOR = 'DarkKhaki';

  constructor() {
    this.bankModesDataSource.data = BankMode.allModes().slice(-1);
  }

  ngOnInit(): void {
    this.configureChart(this.vicBank0Chart, 0);
    this.configureChart(this.vicBank1Chart, 1);
    this.configureChart(this.vicBank2Chart, 2);
    this.configureChart(this.vicBank3Chart, 3);

    this.configureVicBank0();
    this.configureVicBank1();
    this.configureVicBank2();
    this.configureVicBank3();
  }

  calcSpritePointerAsHex(spriteNumber: number): string {
    let address = (this.vicBank * MemoryBank.SIZE + this.screenRamLocation * 1024) + 1016 + spriteNumber;
    return toAddress(address, 0);
  }

  // charRamLocation: the location value see by the VIC-II, i.e.,
  // the number given by bits 1-3 of register 53272
  // (see: https://www.c64-wiki.com/wiki/53272)
  calcCharacterRamLocationAsHex(charRamLocation: number): string {
    let address = this.vicBank * MemoryBank.SIZE + charRamLocation * 2048;
    return toAddress(address, 0);
  }

  // screenRamLocation: the location value seen by the VIC-II, i.e.,
  // the number given by bits 4-7 of register 53272
  // (see: https://www.c64-wiki.com/wiki/53272)
  calcScreenRamLocationAsHex(screenRamLocation: number): string {
    let address = this.vicBank * MemoryBank.SIZE + screenRamLocation * 1024;
    return toAddress(address, 0);
  }

  private configureChart(chart:GoogleChartInterface, bankNumber:number): void {
    let startAddr = bankNumber * MemoryBank.SIZE;
    chart.options['hAxis'] = {
        textPosition: 'out',
        viewWindowMode: 'maximized',
        ticks: [...Array(17).keys()].map(
          i => {
            let x = (i * 1024);
            return { v:x, f:toAddress(x, startAddr) };
          }
        ),
        textStyle: { fontSize: 15 },
    };

    chart.dataTable = [
      [ 'desc', 'free space', { role: 'annotation' } ],
      [ 'VIC Bank ' + bankNumber.toString(), MemoryBank.SIZE, '' ]
    ];
  }


  // chunks relevant to Vic Bank 0
  private zeroPageChunk: MemoryChunk = new MemoryChunk('zero page', 0x0000, 256, MemoryStatus.OS_CODE);
  private stackChunk: MemoryChunk = new MemoryChunk('stack page', 0x0100, 256, MemoryStatus.UNAVAILABLE);
  private ultimaxVicBank0Chunk: MemoryChunk = new MemoryChunk("Unavailable - Ultimax Mode", 0x1000, 0x3000, MemoryStatus.UNAVAILABLE);
  private configureVicBank0(): void {
    var bank = new MemoryBank('VIC Bank 0', 0);

    // reserve the zero page if kernal in use
    if (this.kernalConfig == this.BASIC_AND_KERNAL ||
        this.kernalConfig == this.KERNAL_ONLY) {
        bank.insertChunk(this.zeroPageChunk);
    }

    if (this.cartRomConfig == this.CART_ROM_HI_BANK_E &&
        this.useCartRom) {
      bank.insertChunk(this.ultimaxVicBank0Chunk);
    }

    // always leave the stack alone
    bank.insertChunk(this.stackChunk);

    this.updateChart(this.vicBank0Chart, bank);
  }


  // chunks relevant to vic bank 1
  private ultimaxVicBank1Chunk: MemoryChunk = new MemoryChunk("Unavailable - Ultimax Mode", 0x4000, 0x4000, MemoryStatus.UNAVAILABLE);
  private configureVicBank1(): void {
    var bank = new MemoryBank('VIC Bank 1', 0x4000);

    if (this.cartRomConfig == this.CART_ROM_HI_BANK_E &&
        this.useCartRom) {
      bank.insertChunk(this.ultimaxVicBank1Chunk);
    }

    this.updateChart(this.vicBank1Chart, bank);
  }

  //chunks relevant to vic bank 2
  private basicRomChunk: MemoryChunk = new MemoryChunk('BASIC ROM', 0xA000, 8192, MemoryStatus.OS_CODE);
  private cartRomLoChunk: MemoryChunk = new MemoryChunk("CART ROM LO", 0x8000, 0x2000, MemoryStatus.CART_ROM);
  private bankACartRomHiChunk: MemoryChunk = new MemoryChunk("CART ROM HI", 0xA000, 0x2000, MemoryStatus.CART_ROM);
  private ultimaxVicBank2Chunk: MemoryChunk = new MemoryChunk("Unavailable - Ultimax Mode", 0xA000, 0x2000, MemoryStatus.UNAVAILABLE);

  private configureVicBank2(): void {
    var bank = new MemoryBank('VIC Bank 2', 0x8000);
    if (this.kernalConfig == this.BASIC_AND_KERNAL) {
      bank.insertChunk(this.basicRomChunk);
    }

    if (this.cartRomConfig == this.CART_ROM_HI_BANK_E &&
        this.useCartRom) {
      bank.insertChunk(this.ultimaxVicBank2Chunk);
    }

    if (this.useCartRom) {
      bank.insertChunk(this.cartRomLoChunk);
    }

    if (this.useCartRom && this.cartRomConfig == this.CART_ROM_HI_BANK_A) {
      bank.insertChunk(this.bankACartRomHiChunk);
    }

    this.updateChart(this.vicBank2Chart, bank);
  }

  // chunks relevant to vic bank 3
  private ultimaxVicBank3Chunk: MemoryChunk = new MemoryChunk("Unavailable - Ultimax Mode", 0xC000, 0x1000, MemoryStatus.UNAVAILABLE);
  private kernalRomChunk: MemoryChunk = new MemoryChunk('KERNAL ROM', 0xE000, 8192, MemoryStatus.OS_CODE);
  private bankECartRomHiChunk: MemoryChunk = new MemoryChunk("CART ROM HI", 0xE000, 0x2000, MemoryStatus.CART_ROM);
  private ioChunk: MemoryChunk = new MemoryChunk("I/O", 0xD000, 0x1000, MemoryStatus.IO);
  private charRomChunk: MemoryChunk = new MemoryChunk("CHAR ROM", 0xD000, 0x1000, MemoryStatus.CHAR_ROM);

  private configureVicBank3(): void {
    var bank = new MemoryBank('VIC Bank 3', 0xC000);

    if (this.cartRomConfig == this.CART_ROM_HI_BANK_E &&
        this.useCartRom) {
      bank.insertChunk(this.ultimaxVicBank3Chunk);
    }

    if (this.kernalConfig == this.BASIC_AND_KERNAL ||
        this.kernalConfig == this.KERNAL_ONLY) {
      bank.insertChunk(this.kernalRomChunk);
    }

    if (this.cartRomConfig == this.CART_ROM_HI_BANK_E &&
        this.useCartRom) {
      bank.insertChunk(this.bankECartRomHiChunk);
    }

    if (this.bankDConfig == this.IO) {
      bank.insertChunk(this.ioChunk);
    }

    if (this.bankDConfig == this.CHAR_ROM) {
      bank.insertChunk(this.charRomChunk);
    }

    this.updateChart(this.vicBank3Chart, bank);
  }

  private configureAllVicBanks() {
    this.configureVicBank0();
    this.configureVicBank1();
    this.configureVicBank2();
    this.configureVicBank3();
  }

  private updateChart(chart:GoogleChartInterface, bank:MemoryBank) {
    var dataTable = this.formatAsDataTable(bank);
    var seriesOptions = this.formatSeries(bank);
    chart.options.series = seriesOptions;
    chart.dataTable = dataTable;
    if (chart.component) {
      chart.component.draw();
    }
  }

  private formatSeries(bank:MemoryBank): Object[] {
    let chunks: MemoryChunk[] = bank.chunks;
    let seriesOptions = new Array(chunks.length);
    for (let i = 0; i < chunks.length; i++) {
      seriesOptions[i] = {
          color: this.getColorOf(chunks[i].memStatus)
      };
    }
    return seriesOptions;
  }

  private getColorOf(memStatus:MemoryStatus): string {
    switch (memStatus) {
      case MemoryStatus.AVAILABLE_FOR_PROGRAM_CODE: return MemmapConfiguratorComponent.AVAILABLE_FOR_CODE_COLOR;
      case MemoryStatus.AVAILABLE_FOR_PROGRAM_DATA: return MemmapConfiguratorComponent.AVAILABLE_FOR_DATA_COLOR;
      case MemoryStatus.GRAPHICS_DATA: return MemmapConfiguratorComponent.RESERVED_FOR_GRAPHICS_COLOR;
      case MemoryStatus.IO: return MemmapConfiguratorComponent.IO_COLOR;
      case MemoryStatus.OS_CODE: return MemmapConfiguratorComponent.OS_COLOR;
      case MemoryStatus.CART_ROM: return MemmapConfiguratorComponent.CART_ROM_COLOR;
      case MemoryStatus.CHAR_ROM: return MemmapConfiguratorComponent.CHAR_ROM_COLOR;
      default: return MemmapConfiguratorComponent.UNAVAILABLE_COLOR;
    }
  }

  private formatAsDataTable(bank: MemoryBank): Object[] {
    var labels: Object[] = [ 'desc' ];
    var values: Object[] = [ bank.name ];
    var chunks = bank.chunks;

    for (let chunk of chunks) {
      values.push(chunk.sizeInBytes);
      labels.push(chunk.desc);
    }

    labels.push( {role: 'annotation' } );
    values.push('');

    return [ labels, values ];
  }

  onCartRomChanged() {
    // puts it in a good default state no matter
    // whether cart rom is used or not
    this.cartRomConfig = this.NO_CART_ROM_HI;
    this.kernalConfig = this.BASIC_AND_KERNAL;
    this.bankDConfig = this.IO;

    this.configureAllVicBanks();
    this.filterBankModes();
  }

  onCartRomHiOptionsChanged() {
    if (this.useCartRom) {
      if (this.cartRomConfig == this.CART_ROM_HI_BANK_A) {
        this.kernalConfig = this.KERNAL_ONLY;
      } else if (this.cartRomConfig == this.NO_CART_ROM_HI) {
        this.kernalConfig = this.BASIC_AND_KERNAL;
      } else {
        this.kernalConfig = this.NO_BASIC_OR_KERNAL;
      }
    }

    if (this.cartRomConfig == this.CART_ROM_HI_BANK_E) {
      this.bankDConfig = this.IO;
    }
    this.configureAllVicBanks();
    this.filterBankModes();
  }

  onBasicKernalOptionsChanged() {
    this.configureAllVicBanks();
    this.filterBankModes();
  }

  onD000ToDfffOptionsChanged() {
    this.configureAllVicBanks();
    this.filterBankModes();
  }

  private findBankDState(): BankState {
    if (this.bankDConfig == this.IO) {
      return BankState.IO;
    } else if (this.bankDConfig == this.CHAR_ROM) {
      return  BankState.CHAR_ROM;
    } else {
      return BankState.RAM;
    }
  }

  private filterBankModes() {
      let bank8: BankState;
      let bankA: BankState;
      let bankD: BankState;
      let bankE: BankState;

      if (this.useCartRom) {
        bank8 = BankState.CART_ROM_LO;
        if (this.cartRomConfig == this.CART_ROM_HI_BANK_A) {
          bankA = BankState.CART_ROM_HI;
          bankE = BankState.KERNAL_ROM;
          bankD = this.findBankDState();
        } else if (this.cartRomConfig == this.NO_CART_ROM_HI) {
          bankA = BankState.BASIC_ROM;
          bankE = BankState.KERNAL_ROM;
          bankD = this.findBankDState();
        } else { // CART_ROM_HI_BANK_E
          bankA = BankState.UNAVAILABLE;
          bankE = BankState.CART_ROM_HI;
          bankD = BankState.IO;
        }
      } else {
        bank8 = BankState.RAM;
        bankD = this.findBankDState();
        if (this.kernalConfig == this.BASIC_AND_KERNAL) {
          bankA = BankState.BASIC_ROM;
          bankE = BankState.KERNAL_ROM;
        } else if (this.kernalConfig == this.KERNAL_ONLY) {
          bankA = BankState.RAM;
          bankE = BankState.KERNAL_ROM;
        } else { // NO_BASIC_OR_KERNAL
          bankA = BankState.RAM;
          bankE = BankState.RAM;
        }
      }

      this.bankModesDataSource.data = BankMode.fromMemoryMap(bank8, bankA, bankD, bankE);
  }

  bankModesDataSource = new MatTableDataSource<BankMode>();
  displayedColumns: string[] = ['modeNumber', 'charem', 'hiram', 'loram', 'asInt' ];

  private dumpUndefinedModeInfo(): void {
    console.log("If you get this message, please include the following info in any issue ticket:")
    console.log("--- begin debug info ---");
    console.log("--- end debug info ---");
  }
}
