import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

enum ProgrammingLanguage {
    ASM,
    BASIC
}

@Component({
  selector: 'app-memmap-configurator',
  templateUrl: './memmap-configurator.component.html',
  styleUrls: ['./memmap-configurator.component.scss']
})
export class MemmapConfiguratorComponent implements OnInit, OnChanges {

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
  
  basicLanguageMode(): boolean {
    return this.programmingLanguage == 'BASIC';
  }
  
  validCartRomHi(): boolean {
    if (this.basicLanguageMode() && this.cartRomHi == 'bankA') return false;
    return true;
  }
}
