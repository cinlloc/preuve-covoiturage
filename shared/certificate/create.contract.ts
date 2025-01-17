import { IdentityIdentifiersInterface } from './common/interfaces/IdentityIdentifiersInterface';
import { PointInterface } from '../common/interfaces/PointInterface';
import { CertificateMetaInterface } from './common/interfaces/CertificateMetaInterface';

export interface ParamsInterface {
  tz: string;
  identity: IdentityIdentifiersInterface;
  operator_id: number;
  positions?: PointInterface[];
  start_at?: Date;
  end_at?: Date;
}

export interface ResultInterface {
  uuid: string;
  created_at: Date;
  meta: Omit<CertificateMetaInterface, 'identity' | 'operator'>;
}

export type RepositoryInterface = Required<ParamsInterface>;

export const handlerConfig = {
  service: 'certificate',
  method: 'create',
} as const;

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;
