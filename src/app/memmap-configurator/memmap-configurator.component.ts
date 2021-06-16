import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';

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
export class MemmapConfiguratorComponent implements OnInit, OnChanges {

public memChart: GoogleChartInterface = {
    chartType: 'BarChart',
    dataTable: [
      [ 'desc', 'Zero Page', 'Stack', 'data section', 'code section', { role: 'annotation' } ],
      ['VIC Bank 0', 256, 256, 1536, 14335, '' ]
    ],
    options: {
      //width: 600,
      //height: 400,
      legend: 'none',
      isStacked: true,
      hAxis: {
        maxValue: 16536,
        ticks: [...Array(16).keys()].map(i => ({ v:(i*1024), f:toAddress(i*1024) })),
        viewWindowMode: 'maximized',
        format: {format:'$xxxx'}
      }
    }
  };

  vicBank: number = 0;
  programmingLanguage: string = 'ASM';
  useKernelRom: boolean = true;
  useBasicRom: boolean = true;
  useCartRomLo: boolean = false;
  cartRomHi: string = "unmapped";
  dBankMap: string = "IO";
  
  basicMode: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    console.log("cartRomHi: " + this.cartRomHi);
  }
  
  onBasicModeSelected(): void {
    if (this.cartRomHi == 'bankA') {
      this.cartRomHi = 'unmapped';
    }
    this.useBasicRom = true;
    this.useKernelRom = true;
    this.basicMode = true;
    console.log("cartRomHi: " + this.cartRomHi);
  }
  
  onAssemblyModeSelected(): void {
    this.basicMode = false;
  }
}
