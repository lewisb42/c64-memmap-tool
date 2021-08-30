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
  
  it('should select multiple all-RAM modes', () => {
  // expect this one to fail as more modes are added
    let modes = BankMode.fromMemoryMap(
        BankState.RAM,
        BankState.RAM,
        BankState.RAM,
        BankState.RAM
    ); 
 
    expect(modes.length).toEqual(7);
    let ids = modes.map(m => m.id).sort();
    expect(ids).toEqual([0, 1, 12, 24, 28, 4, 8]); // remember that JS sort() is stupid and defaults to sorting by toString()
  });
});