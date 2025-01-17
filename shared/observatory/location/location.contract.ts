export interface SingleSqlResultInterface {
  lon: number;
  lat: number;
}

export type SqlResultInterface = SingleSqlResultInterface[];

export interface SingleResultInterface {
  hex: string;
  count: number;
}

export type ResultInterface = SingleResultInterface[];

export interface ParamsInterface {
  start_date: Date;
  end_date: Date;
  zoom: number;
  type?: string; //type de territoire observé
  code?: string; //code insee du territoire observé
}

export const handlerConfig = {
  service: 'observatory',
  method: 'getLocation',
};

export const signature = `${handlerConfig.service}:${handlerConfig.method}`;
