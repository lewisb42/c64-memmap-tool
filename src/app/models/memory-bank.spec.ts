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

    it('should not allow a chunk with starting address beyond the end of the bank', () => {
        let bank = new MemoryBank('joe', 0);
        let chunk = new MemoryChunk('', 16537, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunk);
        expect(result.success).toBeFalsy();
    });
    
    it('should not allow a chunk with starting address inside the bank but ending address outside', () => {
        let bank = new MemoryBank('joe', 0);
        let chunk = new MemoryChunk('', 16535, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunk);
        expect(result.success).toBeFalsy();
    });
    
    it('should insert at the beginning of the bank', () => {
        let bank = new MemoryBank('joe', 16536);
        let chunk = new MemoryChunk('', 16536, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunk);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunks = bank.chunks;
        expect(chunks.length).toBe(2);
        
        let chunk1 = chunks[0];
        expect(chunk1.startAddr).toBe(16536);
        expect(chunk1.sizeInBytes).toBe(10);
        
        let chunk2 = chunks[1];
        expect(chunk2.startAddr).toBe(16536 + 10);
        expect(chunk2.sizeInBytes).toBe(16536 - 10);
    });
    
    it('should insert at the end of the bank', () => {
        let bank = new MemoryBank('joe', 0);
        let chunk = new MemoryChunk('', 16526, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunk);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunks = bank.chunks;
        expect(chunks.length).toBe(2);
        
        let chunk1 = chunks[0];
        expect(chunk1.startAddr).toBe(0);
        expect(chunk1.sizeInBytes).toBe(16526);
        
        let chunk2 = chunks[1];
        expect(chunk2.startAddr).toBe(16526);
        expect(chunk2.sizeInBytes).toBe(10);
    });
});
