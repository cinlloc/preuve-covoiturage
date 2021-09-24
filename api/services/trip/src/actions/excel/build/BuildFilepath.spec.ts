import test from 'ava';
import { BuildFilepath } from './BuildFilepath';

let buildFilepath: BuildFilepath;

test.before((t) => {
  buildFilepath = new BuildFilepath();
});

test('BuildFilepath: should build filename from parameters', async (t) => {
  // Arrange
  const start_date: Date = new Date('2021-09-24');

  // Act
  const filepath: string = buildFilepath.call('IDFM normal', 4, start_date);

  // Assert
  t.true(filepath.startsWith('/tmp/apdf-idfm_nor-4-sept-'));
  t.true(filepath.endsWith('.xlsx'));
});
