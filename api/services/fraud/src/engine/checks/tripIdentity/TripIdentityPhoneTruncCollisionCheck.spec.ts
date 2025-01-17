import { tripIdentityCheckMacro } from './tripIdentityCheckMacro';
import { TripIdentityPhoneTruncCollisionCheck } from './TripIdentityPhoneTruncCollisionCheck';

const { test, range } = tripIdentityCheckMacro(TripIdentityPhoneTruncCollisionCheck);

test('max', range, [{ phone_trunc: '+338366565' }, { phone_trunc: '+338366565' }], 1, 1);
test('min', range, [{ phone_trunc: '+338366564' }, { phone_trunc: '+338366565' }], 0, 0);
test(
  'between',
  range,
  [{ phone_trunc: '+338366565' }, { phone_trunc: '+338366565' }, { phone_trunc: '+338366564' }],
  0.6,
  0.7,
);
