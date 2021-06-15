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
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*
    if (changes.programmingLanguage.currentValue == 'BASIC') {
        this.useBasicRom = true;
    }
    */
  }
}
