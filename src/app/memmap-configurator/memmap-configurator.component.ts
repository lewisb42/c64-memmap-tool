import { Component, OnInit, SimpleChanges } from '@angular/core';
import { GoogleChartInterface, GoogleChartWrapper } from 'ng2-google-charts';
import { MemoryChunk, MemoryStatus } from '../models/memory-chunk';
import { MemoryBank } from '../models/memory-bank';

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


  private chartOptionsPrototype = {
      //width: 600,
      height: 100,
      legend: 'none',
      isStacked: true,
      options: {}
    };

  public vicBank0Chart: GoogleChartInterface = this.createMemChart();
  public vicBank1Chart: GoogleChartInterface = this.createMemChart();
  public vicBank2Chart: GoogleChartInterface = this.createMemChart();
  public vicBank3Chart: GoogleChartInterface = this.createMemChart();


  vicBank: number = 0;
  programmingLanguage: string = 'ASM';
  useKernelRom: boolean = false;
  useBasicRom: boolean = false;
  useCartRomLo: boolean = false;
  cartRomHi: string = "unmapped";
  dBankMap: string = "IO";

  basicMode: boolean = false;

  private static UNAVAILABLE_COLOR = 'red';
  private static AVAILABLE_FOR_CODE_COLOR = 'green';
  private static AVAILABLE_FOR_DATA_COLOR = 'orange';
  private static RESERVED_FOR_GRAPHICS_COLOR = 'blue';

  private zeroPageChunk: MemoryChunk = new MemoryChunk('zero page', 0x000, 256, MemoryStatus.UNAVAILABLE);
  private stackChunk: MemoryChunk = new MemoryChunk('stack page', 0x0100, 256, MemoryStatus.UNAVAILABLE);

  private basicRomChunk: MemoryChunk = new MemoryChunk('BASIC ROM', 0xA000, 8192, MemoryStatus.UNAVAILABLE);
  private kernelRomChunk: MemoryChunk = new MemoryChunk('KERNEL ROM', 0xE000, 8192, MemoryStatus.UNAVAILABLE);


  constructor() {
    this.configureChart(this.vicBank0Chart, 0);
    this.configureChart(this.vicBank1Chart, 1);
    this.configureChart(this.vicBank2Chart, 2);
    this.configureChart(this.vicBank3Chart, 3);


  }

  ngOnInit(): void {
    this.configureVicBank0();
    this.configureVicBank1();
    this.configureVicBank2();
    this.configureVicBank3();
  }

  private configureChart(chart:GoogleChartInterface, bankNumber:number): void {
    let startAddr = bankNumber * MemoryBank.SIZE;
    chart.options['hAxis'] = {};
    //chart.options.hAxis['minValue'] = startAddr;
    //chart.options.hAxis['maxValue'] = startAddr + MemoryBank.SIZE - 1;
    chart.options.hAxis['viewWindowMode'] = 'maximized';
    chart.options.hAxis['ticks'] = [...Array(17).keys()].map(
      function (i) {
        let x = (i * 1024);
        return { v:x, f:toAddress(x, startAddr) };
      }
    );
    chart.dataTable = [
      [ 'desc', 'free space', { role: 'annotation' } ],
      [ 'VIC Bank ' + bankNumber.toString(), MemoryBank.SIZE, '' ]
    ];
  }

  private configureVicBank0(): void {
    var bank = new MemoryBank('VIC Bank 0', 0);

    // kernel & basic use the zero page for stuff
    if (this.useBasicRom || this.useKernelRom) {
      bank.insertChunk(this.zeroPageChunk);
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

    if (this.useBasicRom) {
      bank.insertChunk(this.basicRomChunk);
    }

    this.updateChart(this.vicBank2Chart, bank);
  }

  private configureVicBank3(): void {
    var bank = new MemoryBank('VIC Bank 3', 0xC000);

    if (this.useKernelRom) {
      bank.insertChunk(this.kernelRomChunk);
    }

    this.updateChart(this.vicBank3Chart, bank);
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

  onBasicModeSelected(): void {

    this.useBasicRom = true;
    this.useKernelRom = true;
    this.basicMode = true;

    this.disableCartHiWhenBasicRomInUse();

    this.configureVicBank0();
    this.configureVicBank2();
    this.configureVicBank3();
  }

  onAssemblyModeSelected(): void {
    this.basicMode = false;

    this.configureVicBank0();
    this.configureVicBank2();
  }

  onUseKernelRomSelectionChanged(): void {
    this.excludeBankAFromCartRomHi();
    this.configureVicBank0();
    this.configureVicBank3();
  }

  onUseBasicRomSelectionChanged(): void {

    this.disableCartHiWhenBasicRomInUse();

    this.configureVicBank0();
    this.configureVicBank2();
  }

  disableCartHiWhenBasicRomInUse(): void {
    if (this.useBasicRom && this.cartRomHi == 'bankA') {
      this.cartRomHi = 'unmapped';
    }
  }
  
  private excludeBankAFromCartRomHi(): void {
    if (this.cartRomHi == 'bankA') {
      this.cartRomHi = 'unmapped';
    }
  }
}
