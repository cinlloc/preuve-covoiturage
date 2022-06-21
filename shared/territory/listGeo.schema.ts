import { pagination } from '../common/schemas/pagination';

export const alias = 'territory.listGeo';
export const schema = {
  $id: alias,
  type: 'object',
  additionalProperties: false,
  properties: {
    search: {
      type: 'string',
      minLength: 1,
      maxLength: 256,
    },
    type: {
      type: 'string',
      enum: ['city', 'region', 'district'],
    },
    where: {
      type: 'object',
      additionalProperties: false,
      properties: {
        insee: {
          type: 'array',
          items: { macro: 'insee' },
        },
      },
    },
    ...pagination,
  },
};
export const binding = [alias, schema];
