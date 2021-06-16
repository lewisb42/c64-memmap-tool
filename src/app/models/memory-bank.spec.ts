import { MemoryBank } from './memory-bank';
import { MemoryStatus, MemoryChunk } from './memory-chunk'

describe('MemoryBank', () => {
  it('should create an instance', () => {
    expect(new MemoryBank('', 0)).toBeTruthy();
  });
});

describe('Inserting chunks into a bank', () => {

    it('should have a single chunk covering the entire bank', () => {
        let bank = new MemoryBank('joe', 0);
        let chunks = bank.chunks;
        expect(chunks.length).toBe(1);
        let chunk = chunks[0];
        expect(chunk.startAddr).toBe(0);
        expect(chunk.sizeInBytes).toBe(MemoryBank.SIZE);
    });
    
    it('should not allow a chunk with starting address less than that of the bank', () => {
        let bank = new MemoryBank('joe', 16536);
        let chunk = new MemoryChunk('', 16535, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunk);
        expect(result.success).toBeFalsy();
    });

});
