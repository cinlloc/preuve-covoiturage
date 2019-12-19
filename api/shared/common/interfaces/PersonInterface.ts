import { PositionInterface } from './PositionInterface';
import { IdentityInterface } from './IdentityInterface';
import { PaymentInterface } from './PaymentInterface';
import { IncentiveInterface } from './IncentiveInterface';

export interface PersonInterface {
  is_driver?: boolean;
  identity: IdentityInterface;
  operator_class?: string;
  journey_id?: string;
  operator_id?: number;

  start: PositionInterface;
  end: PositionInterface;
  distance?: number;
  duration?: number;

  seats?: number;
  contribution?: number;
  revenue?: number;
  expense: number;
  incentives?: IncentiveInterface[];

  payments?: PaymentInterface[];

  calc_distance?: number;
  calc_duration?: number;
}