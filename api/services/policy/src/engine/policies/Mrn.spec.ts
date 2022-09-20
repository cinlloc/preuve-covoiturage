import test from 'ava';
import { v4 } from 'uuid';
import { OperatorsEnum } from '../../interfaces';
import { makeProcessHelper } from '../tests/macro';
import { Mrn as Handler } from './Mrn';

const defaultPosition = {
  arr: '76540',
  com: '76540',
  aom: '200023414',
  epci: '200023414',
  dep: '76',
  reg: '28',
  country: 'XXXXX',
  reseau: '83',
};

const defaultCarpool = {
  _id: 1,
  trip_id: v4(),
  passenger_identity_uuid: v4(),
  driver_identity_uuid: v4(),
  operator_siret: OperatorsEnum.Klaxit,
  operator_class: 'C',
  passenger_is_over_18: true,
  passenger_has_travel_pass: true,
  driver_has_travel_pass: true,
  datetime: new Date('2019-01-15'),
  seats: 1,
  duration: 600,
  distance: 5_000,
  cost: 20,
  start: { ...defaultPosition },
  end: { ...defaultPosition },
};

const process = makeProcessHelper(defaultCarpool);

test(
  'should works with exclusion',
  process,
  {
    policy: { handler: Handler.id },
    carpool: [{ operator_siret: 'not in list' }, { distance: 100 }, { distance: 200_000 }, { operator_class: 'A' }],
    meta: [],
  },
  { incentive: [0, 0, 0, 0], meta: [] },
);

test(
  'should works basic',
  process,
  {
    policy: { handler: Handler.id },
    carpool: [
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, seats: 2, driver_identity_uuid: 'one' },
      { distance: 25_000, driver_identity_uuid: 'two' },
      { distance: 25_000, driver_identity_uuid: 'two', datetime: new Date('2022-03-28') },
    ],
    meta: [],
  },
  {
    incentive: [200, 400, 250, 250],
    meta: [
      {
        key: 'max_amount_restriction.global.campaign.global',
        value: 1100,
      },
    ],
  },
);

test(
  'should works with global limits',
  process,
  {
    policy: { handler: Handler.id },
    carpool: [{ distance: 5_000, driver_identity_uuid: 'one' }],
    meta: [
      {
        key: 'max_amount_restriction.global.campaign.global',
        value: 799_999_50,
      },
    ],
  },
  {
    incentive: [50],
    meta: [
      {
        key: 'max_amount_restriction.global.campaign.global',
        value: 800_000_00,
      },
    ],
  },
);

test(
  'should works with day limits',
  process,
  {
    policy: { handler: Handler.id },
    carpool: [
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, driver_identity_uuid: 'one' },
    ],
    meta: [],
  },
  {
    incentive: [200, 200, 200, 200, 200, 200, 0],
    meta: [
      {
        key: 'max_amount_restriction.global.campaign.global',
        value: 12_00,
      },
    ],
  },
);
