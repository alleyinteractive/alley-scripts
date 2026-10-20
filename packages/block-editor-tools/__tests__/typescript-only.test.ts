import { readdirSync } from 'fs';
import { join, relative } from 'path';

const SRC = join(__dirname, '..', 'src');

const listFiles = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });

test('src contains no JavaScript files', () => {
  const jsFiles = listFiles(SRC)
    .filter((file) => /\.jsx?$/.test(file))
    .map((file) => relative(SRC, file));

  expect(jsFiles).toEqual([]);
});
