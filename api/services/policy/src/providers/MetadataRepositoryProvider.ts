import { PostgresConnection } from '@ilos/connection-postgres';
import { provider } from '@ilos/common';

import {
  MetadataWrapperInterface,
  MetadataRepositoryProviderInterface,
  MetadataRepositoryProviderInterfaceResolver,
} from '../interfaces';
import { MetadataWrapper } from './MetadataWrapper';

@provider({
  identifier: MetadataRepositoryProviderInterfaceResolver,
})
export class MetadataRepositoryProvider implements MetadataRepositoryProviderInterface {
  public readonly table = 'policy.policy_metas';

  constructor(protected connection: PostgresConnection) {}

  async get(id: number, keys: string[] = [], datetime?: Date): Promise<MetadataWrapperInterface> {
    const whereClauses: {
      text: string;
      value: any;
    }[] = [
      {
        text: 'policy_id = $1',
        value: id,
      },
    ];

    if (keys.length > 0) {
      whereClauses.push({
        text: 'key = ANY($2::varchar[])',
        value: keys,
      });
    }

    if (datetime) {
      whereClauses.push({
        text: `datetime <= ${keys.length ? '$3' : '$2'}::timestamp`,
        value: datetime,
      });
    }

    // get the latest value for a key
    const query: {
      rowMode: string;
      text: string;
      values: any[];
    } = {
      rowMode: 'array',
      text: `
        SELECT
          key,
          (max(array[extract('epoch' from datetime), value::int]))[2] as value
        FROM ${this.table}
        WHERE ${whereClauses.map((w) => w.text).join(' AND ')}
        GROUP BY key
      `,
      values: [...whereClauses.map((w) => w.value)],
    };

    const result = await this.connection.getClient().query(query);

    return new MetadataWrapper(id, result.rows);
  }

  async set(policyId: number, metadata: MetadataWrapperInterface, date: Date): Promise<void> {
    const keys = metadata.keys();
    const values = metadata.values();
    const policyIds = new Array(keys.length).fill(policyId);
    const dates = new Array(keys.length).fill(date);
    const query = {
      text: `
        INSERT INTO ${this.table} (policy_id, key, value, datetime)
          SELECT * FROM UNNEST($1::int[], $2::varchar[], $3::int[], $4::timestamp[])
      `,
      values: [policyIds, keys, values, dates],
    };

    await this.connection.getClient().query(query);
    return;
  }

  async delete(policyId: number, from?: Date): Promise<void> {
    const query = {
      text: `
        DELETE FROM ${this.table}
          WHERE policy_id = $1::int
          ${from ? 'AND datetime >= $2::timestamp' : ''}
      `,
      values: [policyId, ...(from ? [from] : [])],
    };

    await this.connection.getClient().query(query);
    return;
  }
}
