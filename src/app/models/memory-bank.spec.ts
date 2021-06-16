import { MemoryBank } from './memory-bank';

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

});
