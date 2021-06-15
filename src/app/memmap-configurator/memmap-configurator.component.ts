import { Component, OnInit } from '@angular/core';

enum ProgrammingLanguage {
    ASM,
    BASIC
}

@Component({
  selector: 'app-memmap-configurator',
  templateUrl: './memmap-configurator.component.html',
  styleUrls: ['./memmap-configurator.component.scss']
})
export class MemmapConfiguratorComponent implements OnInit {

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

}
