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

    expect(mode[0].asInt()).toEqual(7);
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

  describe('sanity checks on all BankModes', () => {
      let modes = BankMode.allModes();

      it("should have all id's equal to the selection bits", () => {
        for (let m of modes) {
            let id = m.exrom * 16 + m.game * 8 + m.asInt();
            expect(m.id).toEqual(id);
        }
      });

      it("should only allow RAM or UNAVAILABLE for bank $1000-$7fff", () => {
        for (let m of modes) {
            expect([BankState.RAM, BankState.UNAVAILABLE].includes(m.x1000to7fff)).toBeTruthy();
        }
      });

      it("should only allow RAM or CART_ROM_LO for bank $8000-$9fff", () => {
        for (let m of modes) {
            expect([BankState.RAM, BankState.CART_ROM_LO].includes(m.x8000to9fff)).toBeTruthy();
        }
      });

      it("should only allow BASIC_ROM, RAM, UNAVAILABLE, or CART_ROM_HI for bank $A000-$Bfff", () => {
        for (let m of modes) {
            expect([BankState.RAM, BankState.CART_ROM_HI, BankState.UNAVAILABLE, BankState.BASIC_ROM].includes(m.xA000toBfff)).toBeTruthy();
        }
      });

      it("should only allow RAM or UNAVAILABLE for bank $C000-$Cfff", () => {
        for (let m of modes) {
            expect([BankState.RAM, BankState.UNAVAILABLE].includes(m.xC000toCfff)).toBeTruthy();
        }
      });

      it("should only allow RAM, IO, or CHAR_ROM for bank $D000-$Dfff", () => {
        for (let m of modes) {
            expect([BankState.RAM, BankState.IO, BankState.CHAR_ROM].includes(m.xD000toDfff)).toBeTruthy();
        }
      });

      it("should only allow KERNAL_ROM, RAM, or CART_ROM_HI for bank $E000-$Ffff", () => {
        for (let m of modes) {
            expect([BankState.RAM, BankState.CART_ROM_HI, BankState.KERNAL_ROM].includes(m.xE000toFfff)).toBeTruthy();
        }
      });
  });
});
