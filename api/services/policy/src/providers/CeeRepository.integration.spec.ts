import anyTest, { TestFn } from 'ava';
import { makeDbBeforeAfter, DbContext } from '@pdc/helper-test';

import { CeeRepositoryProvider, SearchCeeApplication, ShortCeeApplication } from './CeeRepositoryProvider';

interface TestContext {
  db: DbContext;
  repository: CeeRepositoryProvider;
}

const test = anyTest as TestFn<TestContext>;
const { before, after } = makeDbBeforeAfter();

test.serial.before(async (t) => {
  const db = await before();
  t.context.db = db;
  t.context.repository = new CeeRepositoryProvider(t.context.db.connection);
});

test.serial.after.always(async (t) => {
  await after(t.context.db);
});

test.serial('Should create short application', async (t) => {
  const application: ShortCeeApplication = {
    operator_id: 1,
    last_name_trunc: 'AAA',
    phone_trunc: '+3360000000000',
    datetime: new Date('2022-11-01'),
    driving_license: 'driving_license_1',
    carpool_id: 1,
  };

  await t.context.repository.registerShortApplication(application);

  const applicationResults = await t.context.db.connection.getClient().query({
    text: `SELECT ${Object.keys(application).join(',')}, journey_type FROM ${t.context.repository.table} WHERE operator_id = $1`,
    values: [1],
  });

  t.is(applicationResults.rowCount, 1);
  t.deepEqual(applicationResults.rows[0], { journey_type: 'short', ...application });
});

test.serial('Should raise error if conflict short application', async (t) => {
  const application: ShortCeeApplication = {
    operator_id: 1,
    last_name_trunc: 'AAA',
    phone_trunc: '+3360000000000',
    datetime: new Date('2022-11-02'),
    driving_license: 'driving_license_1',
    carpool_id: 1,
  };

  const error = await t.throwsAsync(async () => await t.context.repository.registerShortApplication(application));
  t.true(error instanceof Error);
});

test.serial('Should raise error if missing fields in short application', async (t) => {
  const application: any = {
    operator_id: 1,
    last_name_trunc: 'AAA',
    phone_trunc: '+3360000000000',
    datetime: new Date('2022-11-02'),
    driving_license: 'driving_license_1',
  };

  const error = await t.throwsAsync(async () => await t.context.repository.registerShortApplication(application));
  t.true(error instanceof Error);
});

test.serial('Should find short application with id if exists', async (t) => {
  const search: SearchCeeApplication = {
    last_name_trunc: 'AAA',
    phone_trunc: '+3360000000000',
  };

  const result = await t.context.repository.searchForShortApplication(search);
  t.not(result, undefined);
  t.deepEqual((result || {}).datetime, new Date('2022-11-01'));
});

test.serial('Should find short application with driver license if exists', async (t) => {
  const search: SearchCeeApplication = {
    last_name_trunc: 'BBB',
    phone_trunc: '+3360000000001',
    driving_license: 'driving_license_1'
  };

  const result = await t.context.repository.searchForShortApplication(search);
  t.not(result, undefined);
  t.deepEqual((result || {}).datetime, new Date('2022-11-01'));
});

test.serial('Should not find short application if criterias dont match', async (t) => {
  const search: SearchCeeApplication = {
    last_name_trunc: 'BBB',
    phone_trunc: '+3360000000001',
    driving_license: 'driving_license_2'
  };

  const result = await t.context.repository.searchForShortApplication(search);
  t.is(result, undefined);
});;