import * as fs from 'fs';
import path from 'path';

import { resetConfiguration } from '../configuration';

jest.mock('fs');

describe('discovery/features', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    resetConfiguration({
      sources: [
        path.resolve(__dirname, '../../../__tests__/fixtures/features'),
      ],
    }, {});
  });
});
