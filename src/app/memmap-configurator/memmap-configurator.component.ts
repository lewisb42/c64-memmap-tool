import { Component, OnInit, SimpleChanges } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { MemoryChunk, MemoryStatus } from '../models/memory-chunk';
import { MemoryBank } from '../models/memory-bank';

function toAddress(x: number): string {
  let baseHex = x.toString(16).toUpperCase();
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

private memChartPrototype: GoogleChartInterface = {
    chartType: 'BarChart'
  };
  
  private chartOptionsPrototype = {
      //width: 600,
      height: 100,
      legend: 'none',
      isStacked: true,
      hAxis: {
        maxValue: 16536,
        ticks: [...Array(17).keys()].map(i => ({ v:(i*1024), f:toAddress(i*1024) })),
        viewWindowMode: 'maximized',
      }
    };
  
  public vicBank0Chart: GoogleChartInterface = { ...this.memChartPrototype };
  public vicBank1Chart: GoogleChartInterface = { ...this.memChartPrototype };
  public vicBank2Chart: GoogleChartInterface = { ...this.memChartPrototype };
  public vicBank3Chart: GoogleChartInterface = { ...this.memChartPrototype };

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
  
  constructor() { 
    this.configureChart(this.vicBank0Chart, 'VIC Bank 0');
    this.configureChart(this.vicBank1Chart, 'VIC Bank 1');
    this.configureChart(this.vicBank2Chart, 'VIC Bank 2');
    this.configureChart(this.vicBank3Chart, 'VIC Bank 3');
  }

  ngOnInit(): void {
  }

  private configureChart(chart:GoogleChartInterface, name:string): void {
    chart.options = {...this.chartOptionsPrototype };
    chart.dataTable = [
      [ 'desc', 'free space', { role: 'annotation' } ],
      [ name, 16384, '' ]
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
  
  private updateChart(chart:GoogleChartInterface, bank:MemoryBank) {
    var dataTable = this.formatAsDataTable(bank);
    var seriesOptions = this.formatSeries(bank);
    chart.options.series = seriesOptions;
    chart.dataTable = dataTable;
    chart.component!.draw();
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
    if (this.cartRomHi == 'bankA') {
      this.cartRomHi = 'unmapped';
    }
    this.useBasicRom = true;
    this.useKernelRom = true;
    this.basicMode = true;
    
    this.configureVicBank0();
  }
  
  onAssemblyModeSelected(): void {
    this.basicMode = false;
    
    this.configureVicBank0();
  }
  
  onUseKernelRomSelectionChanged(): void {
    this.configureVicBank0();
  }
  
  onUseBasicRomSelectionChanged(): void {
    this.useKernelRom = true;
    this.configureVicBank0();
  }
}
