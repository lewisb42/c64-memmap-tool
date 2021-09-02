import { Component, OnInit, SimpleChanges } from '@angular/core';
import { GoogleChartInterface, GoogleChartWrapper } from 'ng2-google-charts';
import { MemoryChunk, MemoryStatus } from '../models/memory-chunk';
import { MemoryBank } from '../models/memory-bank';
import { BankMode, BankState } from '../models/bank-mode'

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

  readonly RAM: string = 'RAM';
  readonly BASIC_ROM: string = 'BASIC_ROM';
  readonly IO: string = 'IO';
  readonly KERNAL_ROM: string = 'KERNAL_ROM';
  readonly UNAVAILABLE: string = 'UNAVAILABLE';
  readonly CART_ROM_HI: string = 'CART_ROM_HI';
  readonly CART_ROM_LO: string = 'CART_ROM_LO';
  readonly CHAR_ROM: string = 'CHAR_ROM';

  vicBank: number = 0;

  bank8: string = this.RAM;
  bankA: string = this.BASIC_ROM;
  bankD: string = this.IO;
  bankE: string = this.KERNAL_ROM;

  bankMode: BankMode = this.calculateBankMode();

  private static UNAVAILABLE_COLOR = 'red';
  private static AVAILABLE_FOR_CODE_COLOR = 'green';
  private static AVAILABLE_FOR_DATA_COLOR = 'orange';
  private static RESERVED_FOR_GRAPHICS_COLOR = 'blue';

  private zeroPageChunk: MemoryChunk = new MemoryChunk('zero page', 0x000, 256, MemoryStatus.UNAVAILABLE);
  private stackChunk: MemoryChunk = new MemoryChunk('stack page', 0x0100, 256, MemoryStatus.UNAVAILABLE);

  private basicRomChunk: MemoryChunk = new MemoryChunk('BASIC ROM', 0xA000, 8192, MemoryStatus.UNAVAILABLE);
  private kernelRomChunk: MemoryChunk = new MemoryChunk('KERNEL ROM', 0xE000, 8192, MemoryStatus.UNAVAILABLE);

  private cartRomLoChunk: MemoryChunk = new MemoryChunk("CART ROM LO", 0x8000, 0x2000, MemoryStatus.UNAVAILABLE);

  private bankACartRomHiChunk: MemoryChunk = new MemoryChunk("CART ROM HI", 0xA000, 0x2000, MemoryStatus.UNAVAILABLE);

  private bankECartRomHiChunk: MemoryChunk = new MemoryChunk("CART ROM HI", 0xE000, 0x2000, MemoryStatus.UNAVAILABLE);

  private ioChunk: MemoryChunk = new MemoryChunk("I/O", 0xD000, 0x1000, MemoryStatus.UNAVAILABLE);

  private charRomChunk: MemoryChunk = new MemoryChunk("CHAR ROM", 0xD000, 0x1000, MemoryStatus.UNAVAILABLE);

  private ultimaxLoChunk: MemoryChunk = new MemoryChunk("Unavailable - Ultimax Mode", 0x1000, 0x7000, MemoryStatus.UNAVAILABLE);
  private ultimaxHiChunk: MemoryChunk = new MemoryChunk("Unavailable - Ultimax Mode", 0xA000, 0x3000, MemoryStatus.UNAVAILABLE);

  constructor() {
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

  private configureVicBank0(): void {
    var bank = new MemoryBank('VIC Bank 0', 0);

    // reserve the zero page if kernal in use
    // note that using basic rom implies the kernel
    if (this.bankE == this.KERNAL_ROM) {
      bank.insertChunk(this.zeroPageChunk);
    }

    if (this.bankE == this.CART_ROM_HI) {
      bank.insertChunk(this.ultimaxLoChunk);
    }

    // always leave the stack alone
    bank.insertChunk(this.stackChunk);

    this.updateChart(this.vicBank0Chart, bank);
  }

  private configureVicBank1(): void {
    var bank = new MemoryBank('VIC Bank 1', 0x4000);
    this.updateChart(this.vicBank1Chart, bank);
  }

  private configureVicBank2(): void {
    var bank = new MemoryBank('VIC Bank 2', 0x8000);

    if (this.bank8 == this.CART_ROM_LO) {
      bank.insertChunk(this.cartRomLoChunk);
    }

    if (this.bankA == this.BASIC_ROM) {
      bank.insertChunk(this.basicRomChunk);
    } else if (this.bankA == this.CART_ROM_HI) {
      bank.insertChunk(this.bankACartRomHiChunk);
    }

    if (this.bankE == this.CART_ROM_HI) {
      bank.insertChunk(this.ultimaxHiChunk);
    }

    this.updateChart(this.vicBank2Chart, bank);
  }

  private configureVicBank3(): void {
    var bank = new MemoryBank('VIC Bank 3', 0xC000);

    if (this.bankD == this.IO) {
      bank.insertChunk(this.ioChunk);
    } else if (this.bankD == this.CHAR_ROM) {
      bank.insertChunk(this.charRomChunk);
    }

    if (this.bankE == this.KERNAL_ROM) {
      bank.insertChunk(this.kernelRomChunk);
    } else if (this.bankE == this.CART_ROM_HI) {
      bank.insertChunk(this.bankECartRomHiChunk);
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

  onBank8Changed() {
    this.configureAllVicBanks();
    this.recalculatePlaBits();
  }

  onBankAChanged() {
    if (this.bankA == this.BASIC_ROM) {
      this.bankE = this.KERNAL_ROM;

      if (this.bankD == this.RAM) {
        this.bankD = this.IO; // not specifically required, but safe value
      }
    }

    if (this.bankA == this.CART_ROM_HI) {
      this.bankE = this.KERNAL_ROM;
    }
    this.configureAllVicBanks();
    this.recalculatePlaBits();
  }

  onBankDChanged() {
    this.configureAllVicBanks();
    this.recalculatePlaBits();
  }

  onBankEChanged() {
    if (this.bankE == this.CART_ROM_HI) {
      this.bankA = this.UNAVAILABLE;
      this.bankD = this.IO;
    }
    this.configureAllVicBanks();
    this.recalculatePlaBits();
  }

  private recalculatePlaBits(): void {
    let mode = this.calculateBankMode();
    if (mode == undefined) {
      // this *shouldn't* happen, but has been known
      // to do so. I think I got it debugged, but
      // submit a ticket if this happens
      this.dumpUndefinedModeInfo();
      return;
    }
    this.bankMode = mode;
  }

  private calculateBankMode(): BankMode {
      return BankMode.fromMemoryMap(
        BankState[this.bank8 as keyof typeof BankState],
        BankState[this.bankA as keyof typeof BankState],
        BankState[this.bankD as keyof typeof BankState],
        BankState[this.bankE as keyof typeof BankState]
      )[0];
  }

  private dumpUndefinedModeInfo(): void {
    console.log("If you get this message, please include the following info in any issue ticket:")
    console.log("--- begin debug info ---");
    console.log("--- end debug info ---");
  }
}
