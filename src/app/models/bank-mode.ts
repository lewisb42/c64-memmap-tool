

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
        return BankMode.modes.filter(
            (m) => m.x8000to9fff==bank8 && m.xA000toBfff===bankA && m.xD000toDfff===bankD && m.xE000toFfff===bankE);
    }
    
    public static allModes(): BankMode[] {
        return BankMode.modes;
    }
    
    asBits(): number {
        return this.charen * 4
            + this.hiram * 2
            + this.loram * 1;
    } 
    
        private static modes = [
            new BankMode(31, 
                Bit.ONE, Bit.ONE, Bit.ONE, Bit.ONE, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.BASIC_ROM, BankState.RAM, BankState.IO, BankState.KERNAL_ROM),
                
            new BankMode(30,
                Bit.ONE, Bit.ONE, Bit.ONE, Bit.ONE, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.IO, BankState.KERNAL_ROM),
                
            new BankMode(29,
                Bit.ONE, Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.IO, BankState.RAM),
                
            new BankMode(28,
                Bit.ONE, Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM),
                
            new BankMode(27,
                Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.BASIC_ROM, BankState.RAM, BankState.CHAR_ROM, BankState.KERNAL_ROM),
                
            new BankMode(26,
                Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.CHAR_ROM, BankState.KERNAL_ROM),
                
            new BankMode(25,
                Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.CHAR_ROM, BankState.RAM),
                
            new BankMode(24,
                Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM),
                
            new BankMode(23,
                Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ONE, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(22,
                Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ZERO, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(21,
                Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ONE, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(20,
                Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ZERO, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(19,
                Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ONE, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(18,
                Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ZERO, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(17,
                Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ONE, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(16,
                Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ZERO, 
                BankState.UNAVAILABLE, BankState.CART_ROM_LO, BankState.UNAVAILABLE, BankState.UNAVAILABLE, BankState.IO, BankState.CART_ROM_HI),
                
            new BankMode(15,
                Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ONE, Bit.ONE, 
                BankState.RAM, BankState.CART_ROM_LO, BankState.BASIC_ROM, BankState.RAM, BankState.IO, BankState.KERNAL_ROM),
                
            new BankMode(14,
                Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ONE, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.IO, BankState.KERNAL_ROM),
                
            new BankMode(13,
                Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.IO, BankState.RAM),
                
            new BankMode(12,
                Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ZERO, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM),
                
            new BankMode(11,
                Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ONE, 
                BankState.RAM, BankState.CART_ROM_LO, BankState.BASIC_ROM, BankState.RAM, BankState.CHAR_ROM, BankState.KERNAL_ROM),
                
            new BankMode(10,
                Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ONE, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.CHAR_ROM, BankState.KERNAL_ROM),
                
            new BankMode(9,
                Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.CHAR_ROM, BankState.RAM),
                
            new BankMode(8,
                Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ZERO, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM),
                
            new BankMode(7,
                Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ONE, 
                BankState.RAM, BankState.CART_ROM_LO, BankState.CART_ROM_HI, BankState.RAM, BankState.IO, BankState.KERNAL_ROM),
                
            new BankMode(6,
                Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ONE, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.CART_ROM_HI, BankState.RAM, BankState.IO, BankState.KERNAL_ROM),
                
            new BankMode(5,
                Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.IO, BankState.RAM),
                
            new BankMode(4,
                Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ZERO, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM),
                
            new BankMode(3,
                Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ONE, 
                BankState.RAM, BankState.CART_ROM_LO, BankState.CART_ROM_HI, BankState.RAM, BankState.CHAR_ROM, BankState.KERNAL_ROM),
                
            new BankMode(2,
                Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ONE, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.CART_ROM_HI, BankState.RAM, BankState.CHAR_ROM, BankState.KERNAL_ROM),
                
            new BankMode(1,
                Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ONE, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM),
                
            new BankMode(0,
                Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ZERO, Bit.ZERO, 
                BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM, BankState.RAM) 
        ];
}

