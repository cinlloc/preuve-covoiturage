import { TripSearchInterfaceWithPagination } from './common/interfaces/TripSearchInterface';

export interface ParamsInterface extends TripSearchInterfaceWithPagination {}
export type ResultInterface = any;

export const handlerConfig = {
  service: 'trip',
  method: 'list',
};

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;
