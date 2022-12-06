export type ParamsInterface = void;

export type ResultInterface = void;

export const handlerConfig = {
  service: 'observatory',
  method: 'refreshAllOccupation',
};

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;