export const alias = 'observatory.monthlyOccupation';
export const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['year', 'month', 'type'],
  properties: {
    year: {
      type: 'integer',
      minimum: 2020,
    },
    month: {
      type: 'integer',
      minimum: 1,
      maximum: 12,
    },
    type: {
      type: 'string',
      enum: ['com', 'epci', 'aom', 'dep', 'reg', 'country'],
    },
    observe: {
      type: 'string',
      enum: ['com', 'epci', 'aom', 'dep', 'reg', 'country'],
    },
    code: {
      type: 'string',
      minLength: 2,
      maxLength: 9,
    },
  },
};

export const binding = [alias, schema];
