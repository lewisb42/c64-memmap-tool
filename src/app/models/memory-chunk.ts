export enum MemoryStatus {
  AVAILABLE_FOR_PROGRAM_CODE,
  AVAILABLE_FOR_PROGRAM_DATA,
  GRAPHICS_DATA,
  UNAVAILABLE
}

export class MemoryChunk {
    constructor(
    readonly desc:string, 
    readonly startAddr:number, 
    readonly sizeInBytes:number,
    readonly memStatus:MemoryStatus) {}
    
    static compareAscendingByStartAddr(mb1:MemoryChunk, mb2:MemoryChunk) {
        if (mb1.startAddr < mb2.startAddr) return 0;
        return +1;
    }
    
    get endAddr(): number {
        return this.startAddr + this.sizeInBytes - 1;
    }
}
