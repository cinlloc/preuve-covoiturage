import { IncentiveInterface } from '../common/interfaces/IncentiveInterface';
import { FinalizedPersonInterface } from '../common/interfaces/PersonInterface';

export interface ParamsInterface {
  operator_trip_id?: string;
  acquisition_id: number;
  operator_id: number;
  operator_journey_id: string;
  created_at: Date;
  operator_class: string;
  people: FinalizedPersonInterface[];
  incentives: IncentiveInterface[];
}

export type ResultInterface = void;

export const handlerConfig = {
  service: 'carpool',
  method: 'crosscheck',
} as const;

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;
