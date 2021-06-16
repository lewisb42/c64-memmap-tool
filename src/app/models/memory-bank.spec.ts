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
    
    it('should insert in the interior of the bank', () => {
        let bank = new MemoryBank('joe', 0);
        let chunk = new MemoryChunk('', 100, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunk);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunks = bank.chunks;
        expect(chunks.length).toBe(3);
        
        let chunk1 = chunks[0];
        expect(chunk1.startAddr).toBe(0);
        expect(chunk1.sizeInBytes).toBe(100);
        
        let chunk2 = chunks[1];
        expect(chunk2.startAddr).toBe(100);
        expect(chunk2.sizeInBytes).toBe(10);
        
        let chunk3 = chunks[2];
        expect(chunk3.startAddr).toBe(110);
        expect(chunk3.sizeInBytes).toBe(16426);
    });
    
    it('should insert contiguous chunks', () => {
        let bank = new MemoryBank('joe', 0);
        
        let chunkA = new MemoryChunk('', 100, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunkA);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunkB = new MemoryChunk('', 110, 10, MemoryStatus.UNAVAILABLE);
        result = bank.insertChunk(chunkB);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunks = bank.chunks;
        expect(chunks.length).toBe(4);
        
        let chunk1 = chunks[0];
        expect(chunk1.startAddr).toBe(0);
        expect(chunk1.sizeInBytes).toBe(100);
        
        let chunk2 = chunks[1];
        expect(chunk2.startAddr).toBe(100);
        expect(chunk2.sizeInBytes).toBe(10);
        
        let chunk3 = chunks[2];
        expect(chunk3.startAddr).toBe(110);
        expect(chunk3.sizeInBytes).toBe(10);
        
        let chunk4 = chunks[3];
        expect(chunk4.startAddr).toBe(120);
        expect(chunk4.sizeInBytes).toBe(16416);
    });
    
    it('should insert several chunks', () => {
        let bank = new MemoryBank('joe', 0);
        
        let chunkA = new MemoryChunk('', 100, 10, MemoryStatus.UNAVAILABLE);
        let result = bank.insertChunk(chunkA);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunkB = new MemoryChunk('', 120, 10, MemoryStatus.UNAVAILABLE);
        result = bank.insertChunk(chunkB);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunkC = new MemoryChunk('', 140, 10, MemoryStatus.UNAVAILABLE);
        result = bank.insertChunk(chunkC);
        expect(result.success).toBeTruthy(result.reason);
        
        let chunks = bank.chunks;
        expect(chunks.length).toBe(7);
        
        let chunk1 = chunks[0];
        expect(chunk1.startAddr).toBe(0);
        expect(chunk1.sizeInBytes).toBe(100);
        
        let chunk2 = chunks[1];
        expect(chunk2.startAddr).toBe(100);
        expect(chunk2.sizeInBytes).toBe(10);
        
        let chunk3 = chunks[2];
        expect(chunk3.startAddr).toBe(110);
        expect(chunk3.sizeInBytes).toBe(10);
        
        let chunk4 = chunks[3];
        expect(chunk4.startAddr).toBe(120);
        expect(chunk4.sizeInBytes).toBe(10);
        
        let chunk5 = chunks[4];
        expect(chunk5.startAddr).toBe(130);
        expect(chunk5.sizeInBytes).toBe(10);
        
        let chunk6 = chunks[5];
        expect(chunk6.startAddr).toBe(140);
        expect(chunk6.sizeInBytes).toBe(10);
        
        let chunk7 = chunks[6];
        expect(chunk7.startAddr).toBe(150);
        expect(chunk7.sizeInBytes).toBe(16386);
    });
});
