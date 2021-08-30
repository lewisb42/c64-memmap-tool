import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { 
    BankMode,
    BankState,
} from './bank-mode';

describe('BankMode', () => {
  it('should select Mode 31', () => {
    let mode = BankMode.fromMemoryMap(
        BankState.RAM,
        BankState.BASIC_ROM,
        BankState.IO,
        BankState.KERNAL_ROM
    );
    
    expect(mode[0].asBits()).toEqual(7);
  });
});