import { NotFoundException, provider } from '@ilos/common';
import { PostgresConnection } from '@ilos/connection-postgres';
import { TerritoryCodeEnum, TerritoryCodesInterface } from '../../../../../shared/territory/common/interfaces/TerritoryCodeInterface';
import { TerritoryRepositoryProviderInterface, TerritoryRepositoryProviderInterfaceResolver } from '../interfaces';

@provider({
  identifier: TerritoryRepositoryProviderInterfaceResolver,
})
export class TerritoryRepositoryProvider implements TerritoryRepositoryProviderInterface {
  protected readonly getByPointFunction = 'geo.get_latest_by_point';
  protected readonly getBySelectorFunction = 'policy.get_territory_id_by_selector';
  protected readonly territoryGroupTable = 'territory.territory_group';
  protected readonly companyTable = 'company.companies';
  constructor(protected connection: PostgresConnection) {}

  async findByPoint({ lon, lat }: { lon: number; lat: number }): Promise<TerritoryCodesInterface> {
    try {
      const result = await this.connection.getClient().query({
        text: `
          SELECT * FROM ${this.getByPointFunction}($1::float, $2::float)
        `,
        values: [lon, lat],
      });

      if(result.rowCount < 1) {
        throw new NotFoundException();
      }
      return result.rows[0];
    } catch (e) {
      console.error(e.message, e);
      return null;
    }
  }

  async findSiretById(_id: number | number[]): Promise<{ _id: number; siret: string }[]> {
    const query = {
      text: `
        SELECT
          t._id, c.siret
        FROM ${this.territoryGroupTable} AS t
        LEFT JOIN ${this.companyTable} AS c
          ON c._id = t.company_id
        WHERE t._id = ${Array.isArray(_id) ? 'ANY($1)' : '$1'}
      `,
      values: [_id],
    };
    const result = await this.connection.getClient().query(query);
    return result.rows;
  }

  async findBySelector(data: Partial<TerritoryCodesInterface>): Promise<number[]> {
    const result = await this.connection.getClient().query({
      text: `SELECT _id FROM ${this.getBySelectorFunction}($1::varchar, $2::varchar)`,
      values: [
        data[TerritoryCodeEnum.Arr] || data[TerritoryCodeEnum.City],
        data[TerritoryCodeEnum.Mobility],
      ],
    });
    return result.rows.map(r => r._id);
  }
}
