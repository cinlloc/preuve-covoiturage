import { CertificateInterface } from './common/interfaces/CertificateInterface';

export interface ParamsInterface {
  operator_user_id: string;
  start_at: Date;
  end_at: Date;
}

export type ResultInterface = string;

export type RepositoryInterface = Required<ParamsInterface>;

export const handlerConfig = {
  service: 'certificate',
  method: 'generate',
};

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;
