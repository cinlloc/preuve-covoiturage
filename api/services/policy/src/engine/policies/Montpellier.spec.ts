import test from 'ava';
import { v4 } from 'uuid';
import { CarpoolInterface, OperatorsEnum } from '../../interfaces';
import { makeProcessHelper } from '../tests/macro';
import { Montpellier as Handler } from './Montpellier';

const defaultPosition = {
  arr: '34088',
  com: '34088',
  aom: '243400017',
  epci: '243400017',
  dep: '34',
  reg: '76',
  country: 'XXXXX',
  reseau: '76',
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
  datetime: new Date('2022-01-01'),
  seats: 1,
  duration: 600,
  distance: 5_000,
  cost: 20,
  driver_payment: 20,
  passenger_payment: 20,
  start: { ...defaultPosition },
  end: { ...defaultPosition },
};

const process = makeProcessHelper(defaultCarpool);

test(
  'should work basic',
  process,
  {
    policy: { handler: Handler.id },
    carpool: [
      { distance: 5_000, driver_identity_uuid: 'one' },
      { distance: 5_000, seats: 2, driver_identity_uuid: 'one' },
      { distance: 25_000, driver_identity_uuid: 'one' },
      { distance: 25_000, seats: 2, driver_identity_uuid: 'one' },
      {
        distance: 25_000,
        driver_identity_uuid: 'one',
        start: { aom: '200096956', com: '47091', arr: '47091', epci: '200096956', reg: '75' },
      },
    ],
    meta: [],
  },
  {
    incentive: [100, 200, 200, 400, 200],
    meta: [
      {
        key: 'max_amount_restriction.0-one.month.0-2022',
        value: 1100,
      },
      {
        key: 'max_amount_restriction.global.campaign.global',
        value: 1100,
      },
    ],
  },
);

test(
  'should work with day limits',
  process,
  {
    policy: { handler: Handler.id },
    carpool: [
      { distance: 25_000, driver_identity_uuid: 'two' },
      { distance: 25_000, driver_identity_uuid: 'two' },
      { distance: 25_000, driver_identity_uuid: 'two' },
      { distance: 25_000, driver_identity_uuid: 'two' },
      { distance: 25_000, driver_identity_uuid: 'two' },
      { distance: 25_000, driver_identity_uuid: 'two' },
      { distance: 25_000, driver_identity_uuid: 'two' },
    ],
    meta: [],
  },
  {
    incentive: [200, 200, 200, 200, 200, 200, 0],
    meta: [
      {
        key: 'max_amount_restriction.0-two.month.0-2022',
        value: 12_00,
      },
      {
        key: 'max_amount_restriction.global.campaign.global',
        value: 12_00,
      },
    ],
  },
);

const generateCarpool = (): Partial<CarpoolInterface>[] => {
  const date: Date = new Date('2022-01-01');
  return [
    ...Array(75 + 1 + 1)
      .slice(1)
      .keys(),
  ].map((x) => ({
    datetime: x % 3 == 0 ? date.setDate(date.getDate() + 1) && new Date(date) : new Date(date),
    distance: 25_000,
    driver_identity_uuid: 'three',
  }));
};

test(
  'should work with driver month limits',
  process,
  {
    policy: { handler: Handler.id },
    carpool: generateCarpool(),
    meta: [],
  },
  {
    incentive: [...[...Array(75).keys()].map(() => 200), 0],
    meta: [
      {
        key: 'max_amount_restriction.0-three.month.0-2022',
        value: 150_00,
      },
      {
        key: 'max_amount_restriction.global.campaign.global',
        value: 15000,
      },
    ],
  },
);
