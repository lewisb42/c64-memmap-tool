

export enum BankState {
    RAM,
    CART_ROM_LO,
    CART_ROM_HI,
    BASIC_ROM,
    KERNAL_ROM,
    IO,
    CHAR_ROM,
    UNAVAILABLE
};

export enum Bit {
    ZERO = 0,
    ONE = 1
};

export class BankMode {
    
    constructor(
        readonly id: number,
        // these are the expansion port lines; only 0 or 1 are valid
        readonly exrom: Bit,
        readonly game: Bit,
        
        // these correspond to the 3 least-significant PLA latch bits; only 0 or 1 are valid
        // bit 2: CHAREN
        // bit 1: HIRAM
        // bit 0: LORAM
        readonly charen: Bit,
        readonly hiram: Bit,
        readonly loram: Bit,
        
        // configuration in this mode
        readonly x1000to7fff: BankState,
        readonly x8000to9fff: BankState,
        readonly xA000toBfff: BankState,
        readonly xC000toCfff: BankState,
        readonly xD000toDfff: BankState,
        readonly xE000toFfff: BankState    
    ) {}
  
    public static fromMemoryMap(
        bank8: BankState, 
        bankA: BankState,
        bankD: BankState,
        bankE: BankState
    ): BankMode[] {
        let modes = [
            new BankMode(   31, 
                Bit.ONE, Bit.ONE, Bit.ONE, Bit.ONE, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.BASIC_ROM, BankState.RAM, BankState.IO, BankState.KERNAL_ROM)
        ];
        return modes.filter(
            (m) => m.x8000to9fff==bank8 && m.xA000toBfff===bankA && m.xD000toDfff===bankD && m.xE000toFfff===bankE);
    }
    
    asBits(): number {
        return this.charen * 4
            + this.hiram * 2
            + this.loram * 1;
    } 
}

