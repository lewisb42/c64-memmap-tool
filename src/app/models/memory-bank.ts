import { MemoryChunk, MemoryStatus } from './memory-chunk';

export class MemoryBank {
    static SIZE: number = 16536;
    readonly startAddr: number;
    readonly endAddr: number; 
    private _chunks: MemoryChunk[] = [];
    
    constructor(readonly name: string, startAddr: number) {
        if (startAddr % MemoryBank.SIZE != 0) {
            throw new Error('startAddr must be a multiple of 16536');
        }
        this.startAddr = startAddr;
        this.endAddr = this.startAddr + MemoryBank.SIZE - 1; 
    }
    
    /*
        Returns an array of chunks such that every address in the bank is contained
        in exactly one chunk. The array is ordered ascending by the starting addresses
        of the chunks.
    */
    get chunks(): MemoryChunk[] {
        // note this method "fills in the gaps" that are unallocated by this._chunks
        
        let results: MemoryChunk[] = [];
        this._chunks.sort(MemoryChunk.compareAscendingByStartAddr);
        let currentAddr = this.startAddr;
        
        for (let currentChunk of this._chunks) {
            if (currentChunk.startAddr > currentAddr) {
                let size = currentChunk.startAddr - currentAddr;
                results.push(new MemoryChunk(
                    'free memory', currentAddr, size, MemoryStatus.AVAILABLE_FOR_PROGRAM_CODE
                ));
            } 
            results.push(currentChunk);
            currentAddr = currentChunk.endAddr + 1;
        }
        
        if (currentAddr <= this.endAddr) {
            let size = (this.endAddr + 1) - currentAddr;
            results.push(new MemoryChunk(
                'free memory', currentAddr, size, MemoryStatus.AVAILABLE_FOR_PROGRAM_CODE
            ));
        }
        
        return results.sort(MemoryChunk.compareAscendingByStartAddr);
    }
    
    
    // returns { success: true } if insertion was a success,
    // { success: false, reason: 'message' } if it did not
    insertChunk(chunk: MemoryChunk): Object {
        if (chunk.startAddr < this.startAddr) {
            return {
                success: false,
                reason: "chunk begins before the bank's start address"
            };
        }
        
        if (chunk.endAddr > this.endAddr) {
            return {
                success: false,
                reason: "chunk flows past the bank's end address"
            };
        }
        
        if (this.collidesWithExistingChunks(chunk)) {
            return {
                success: false,
                reason: "chunk overlaps existing chunk(s) in the bank"
            };
        }
        
        this._chunks.push(chunk);
        return { success: true };
    }
    
    private collidesWithExistingChunks(chunk: MemoryChunk): boolean {
        let startAddr = chunk.startAddr;
        let endAddr = chunk.endAddr;
        
        for (let currentChunk of this._chunks) {
            let currentStartAddr = currentChunk.startAddr;
            let currentEndAddr = currentChunk.endAddr;
            
            // starting address falls within an existing chunk
            if (currentStartAddr <= startAddr && startAddr <= currentEndAddr) {
                return false;
            }
            
            // ending address falls within an exiting chunk
            if (currentStartAddr <= endAddr && endAddr <= currentEndAddr) {
                return false;
            }
        }
        
        return true;
    }
}
