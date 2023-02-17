export interface ParamsInterface {
  campaign_id: number;
  operator_id?: number;
}

export type EnrichedApdfType = {
  signed_url: string;
  key: string;
  size: number;
  operator_id: number;
  campaign_id: number;
  datetime: Date;
  name: string;
};

export type ResultsInterface = EnrichedApdfType[];

export const handlerConfig = {
  service: 'apdf',
  method: 'list',
};

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;