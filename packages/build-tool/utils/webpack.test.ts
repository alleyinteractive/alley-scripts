/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';
import { type PathData } from 'webpack';

import { getEntries, processFilename } from './webpack';

describe('getEntries', () => {
  const testEntryPath = path.join(process.cwd(), 'test-entries');

  beforeAll(() => {
    const testEntries = [
      'entry1',
      'entry2',
    ];

    try {
      if (!fs.existsSync(testEntryPath)) {
        fs.mkdirSync(testEntryPath);
        fs.writeFileSync(path.join(testEntryPath, 'README.md'), '');
        fs.writeFileSync(path.join(testEntryPath, '.gitkeep'), '');
      }
    } catch (error) {
      console.error(`Failed to create directory ${testEntryPath}`, error);
    }

    testEntries.forEach((entry) => {
      try {
        if (!fs.existsSync(path.join(testEntryPath, entry))) {
          fs.mkdirSync(path.join(testEntryPath, entry));
        }

        if (!fs.existsSync(path.join(testEntryPath, entry, 'index.js'))) {
          fs.writeFileSync(path.join(testEntryPath, entry, 'index.js'), '');
        }
      } catch (error) {
        console.error(`Failed to create directory ${testEntryPath}/${entry}`, error);
      }
    });
  });

  afterAll(() => {
    fs.rm(testEntryPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Failed to remove directory ${testEntryPath}`, err);
      }
    });
  });

  it('returns an empty object if the directory does not exist', () => {
    const result = getEntries('nonexistent-directory');
    expect(result).toEqual({});
  });

  it('returns an object of entries if the directory exists', () => {
    const result = getEntries('test-entries');

    expect(result).toEqual({
      'test-entries-entry1': path.join(testEntryPath, 'entry1'),
      'test-entries-entry2': path.join(testEntryPath, 'entry2'),
    });
  });

  it('ignores .gitkeep and README.md files', () => {
    const result = getEntries('test-entries');
    expect(result).not.toHaveProperty('test-entries-.gitkeep');
    expect(result).not.toHaveProperty('test-entries-README.md');
  });
});

describe('processFilename', () => {
  it('returns a filename in the format "[name].[ext]" for non-block entries', () => {
    const pathData = {
      chunk: {
        name: 'my-chunk',
      },
    };
    const result = processFilename(pathData as PathData, false, 'js');
    expect(result).toBe('[name].js');
  });

  it('constructs a filename excluding the "entries" prefix with the directory name and "/index.[ext]" for entries with setAsIndex=true', () => {
    const pathData = {
      chunk: {
        name: 'entries-my-entry',
      },
    };
    const result = processFilename(pathData as PathData, true, 'js');
    expect(result).toBe('my-entry/index.js');
  });

  it('constructs a filename excluding the "entries" prefix with the directory name and "/[name].[ext]" for entries with setAsIndex=false', () => {
    const pathData = {
      chunk: {
        name: 'entries-my-entry',
      },
    };
    const result = processFilename(pathData as PathData, false, 'js');
    expect(result).toBe('my-entry/[name].js');
  });

  it('uses the runtime as the name format source when dirnameSource="runtime"', () => {
    const pathData = {
      chunk: {
        runtime: 'entries-my-runtime',
      },
    };
    const result = processFilename(pathData as PathData, false, 'js', 'runtime');
    expect(result).toBe('my-runtime/[name].js');
  });

  it('uses the default dirname source "name" when dirnameSource is not provided', () => {
    const pathData = {
      chunk: {
        name: 'my-chunk',
      },
    };
    const result = processFilename(pathData as PathData, false, 'js');
    expect(result).toBe('[name].js');
  });
});
