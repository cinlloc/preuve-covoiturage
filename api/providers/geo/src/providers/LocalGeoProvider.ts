import { PostgresConnection } from '@ilos/connection-postgres';
import { NotFoundException, provider } from '@ilos/common';

import { PointInterface, InseeCoderInterface } from '../interfaces';

@provider()
export class LocalGeoProvider implements InseeCoderInterface {
  protected fn = 'geo.get_latest_by_point';

  constructor(protected connection: PostgresConnection) {}

  async positionToInsee(geo: PointInterface): Promise<string> {
    const { lat, lon } = geo;

    const comResult = await this.connection.getClient().query({
      text: `
        SELECT
          com, arr
        FROM ${this.fn}($1::float, $2::float)
      `,
      values: [lon, lat],
    });

    if (comResult.rowCount === 0) {
      throw new NotFoundException();
    }

    if (!comResult.rows[0].com) {
      return comResult.rows[0].arr;
    }
    return comResult.rows[0].com;
  }
}
