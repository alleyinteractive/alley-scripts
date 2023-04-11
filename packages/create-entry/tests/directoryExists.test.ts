import fs from 'fs';
import directoryExists  from '../src/directoryExists';

describe('directoryExists', () => {
  it('should return true if directory exists', async () => {
    // create a test directory
    const testDir = './testDirectory';
    await fs.promises.mkdir(testDir);

    // call directoryExists and check if it returns true
    const exists = await directoryExists(testDir);
    expect(exists).toBe(true);

    // remove the test directory
    await fs.promises.rmdir(testDir);
  });

  it('should return false if directory does not exist', async () => {
    // call directoryExists with a non-existent directory
    const exists = await directoryExists('./nonExistentDirectory');
    expect(exists).toBe(false);
  });
});
