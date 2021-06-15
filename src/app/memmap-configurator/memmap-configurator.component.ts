import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memmap-configurator',
  templateUrl: './memmap-configurator.component.html',
  styleUrls: ['./memmap-configurator.component.scss']
})
export class MemmapConfiguratorComponent implements OnInit {

  vicBank: number = 0;
  programmingLanguage: string = "ASM";
  
  constructor() { }

  ngOnInit(): void {
  }

}
