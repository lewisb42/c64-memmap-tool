import { MemoryChunk, MemoryStatus } from './memory-chunk';

describe('MemoryChunk', () => {
  it('should create an instance', () => {
    expect(new MemoryChunk('hello', 0, 256, MemoryStatus.UNAVAILABLE)).toBeTruthy();
  });
});
