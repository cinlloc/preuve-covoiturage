import { ContextType, handler, InitHookInterface, KernelInterfaceResolver } from '@ilos/common';
import { Action } from '@ilos/core';
import { BucketName, S3StorageProvider } from '@pdc/provider-file';
import { internalOnlyMiddlewares } from '@pdc/provider-middleware';
import AdmZip from 'adm-zip';
import { get } from 'lodash';
import os from 'os';
import path from 'path';
import { getDefaultEndDate } from '../helpers/getDefaultDates';
import { ExportTripInterface } from '../interfaces';
import { PgCursorHandler } from '../interfaces/PromisifiedPgCursor';
import { TerritoryTripsInterface } from '../interfaces/TerritoryTripsInterface';
import { TripRepositoryProvider } from '../providers/TripRepositoryProvider';
import { handlerConfig, ParamsInterface, ResultInterface, signature } from '../shared/trip/buildExport.contract';
import { alias } from '../shared/trip/buildExport.schema';
import { TripSearchInterface } from '../shared/trip/common/interfaces/TripSearchInterface';
import {
  ParamsInterface as PublishOpenDataParamsInterface,
  signature as publishOpenDataSignature,
} from '../shared/trip/publishOpenData.contract';
import { BuildFile } from './file/BuildFile';
import fs from 'fs';

export interface FlattenTripInterface extends ExportTripInterface<string> {
  journey_start_date: string;
  journey_start_time: string;
  journey_end_date: string;
  journey_end_time: string;
  passenger_incentive_1_siret?: string;
  passenger_incentive_1_amount?: number;
  passenger_incentive_2_siret?: string;
  passenger_incentive_2_amount?: number;
  passenger_incentive_3_siret?: string;
  passenger_incentive_3_amount?: number;
  passenger_incentive_4_siret?: string;
  passenger_incentive_4_amount?: number;
  passenger_incentive_rpc_1_siret?: string;
  passenger_incentive_rpc_1_name?: string;
  passenger_incentive_rpc_1_amount?: number;
  passenger_incentive_rpc_2_siret?: string;
  passenger_incentive_rpc_2_name?: string;
  passenger_incentive_rpc_2_amount?: number;
  passenger_incentive_rpc_3_siret?: string;
  passenger_incentive_rpc_3_name?: string;
  passenger_incentive_rpc_3_amount?: number;
  passenger_incentive_rpc_4_siret?: string;
  passenger_incentive_rpc_4_name?: string;
  passenger_incentive_rpc_4_amount?: number;
  driver_incentive_1_siret?: string;
  driver_incentive_1_amount?: number;
  driver_incentive_2_siret?: string;
  driver_incentive_2_amount?: number;
  driver_incentive_3_siret?: string;
  driver_incentive_3_amount?: number;
  driver_incentive_4_siret?: string;
  driver_incentive_4_amount?: number;
  driver_incentive_rpc_1_siret?: string;
  driver_incentive_rpc_1_name?: string;
  driver_incentive_rpc_1_amount?: number;
  driver_incentive_rpc_2_siret?: string;
  driver_incentive_rpc_2_name?: string;
  driver_incentive_rpc_2_amount?: number;
  driver_incentive_rpc_3_siret?: string;
  driver_incentive_rpc_3_name?: string;
  driver_incentive_rpc_3_amount?: number;
  driver_incentive_rpc_4_siret?: string;
  driver_incentive_rpc_4_name?: string;
  driver_incentive_rpc_4_amount?: number;
}
@handler({
  ...handlerConfig,
  middlewares: [...internalOnlyMiddlewares(handlerConfig.service), ['validate', alias]],
})
export class BuildExportAction extends Action implements InitHookInterface {
  constructor(
    private tripRepository: TripRepositoryProvider,
    private fileProvider: S3StorageProvider,
    private kernel: KernelInterfaceResolver,
    private buildFile: BuildFile,
  ) {
    super();
  }

  public static readonly baseFields = [
    'journey_id',
    'trip_id',
    'journey_start_datetime',
    'journey_start_date',
    'journey_start_time',
    'journey_start_lon',
    'journey_start_lat',
    'journey_start_insee',
    'journey_start_postalcode',
    'journey_start_department',
    'journey_start_town',
    'journey_start_towngroup',
    'journey_start_country',
    'journey_end_datetime',
    'journey_end_date',
    'journey_end_time',
    'journey_end_lon',
    'journey_end_lat',
    'journey_end_insee',
    'journey_end_postalcode',
    'journey_end_department',
    'journey_end_town',
    'journey_end_towngroup',
    'journey_end_country',
    'driver_card',
    'passenger_card',
    'passenger_over_18',
    'passenger_seats',
    'operator_class',
  ];

  public static readonly financialFields = [
    'passenger_id',
    'passenger_contribution',
    'passenger_incentive_1_siret',
    'passenger_incentive_1_amount',
    'passenger_incentive_2_siret',
    'passenger_incentive_2_amount',
    'passenger_incentive_3_siret',
    'passenger_incentive_3_amount',
    'passenger_incentive_4_siret',
    'passenger_incentive_4_amount',
    'passenger_incentive_rpc_1_siret',
    'passenger_incentive_rpc_1_name',
    'passenger_incentive_rpc_1_amount',
    'passenger_incentive_rpc_2_siret',
    'passenger_incentive_rpc_2_name',
    'passenger_incentive_rpc_2_amount',
    'passenger_incentive_rpc_3_siret',
    'passenger_incentive_rpc_3_name',
    'passenger_incentive_rpc_3_amount',
    'passenger_incentive_rpc_4_siret',
    'passenger_incentive_rpc_4_name',
    'passenger_incentive_rpc_4_amount',
    'driver_id',
    'driver_revenue',
    'driver_incentive_1_siret',
    'driver_incentive_1_amount',
    'driver_incentive_2_siret',
    'driver_incentive_2_amount',
    'driver_incentive_3_siret',
    'driver_incentive_3_amount',
    'driver_incentive_4_siret',
    'driver_incentive_4_amount',
    'driver_incentive_rpc_1_siret',
    'driver_incentive_rpc_1_name',
    'driver_incentive_rpc_1_amount',
    'driver_incentive_rpc_2_siret',
    'driver_incentive_rpc_2_name',
    'driver_incentive_rpc_2_amount',
    'driver_incentive_rpc_3_siret',
    'driver_incentive_rpc_3_name',
    'driver_incentive_rpc_3_amount',
    'driver_incentive_rpc_4_siret',
    'driver_incentive_rpc_4_name',
    'driver_incentive_rpc_4_amount',
  ];

  public static readonly extraFields = {
    opendata: ['journey_distance', 'journey_duration', 'operator_class'],
    operator: [
      'journey_distance_anounced',
      'journey_distance_calculated',
      'journey_duration_anounced',
      'journey_duration_calculated',
      'operator_journey_id',
      'operator_passenger_id',
      'operator_driver_id',
    ],
    territory: [
      'journey_distance',
      'journey_duration',
      'operator',
      'operator_journey_id',
      'operator_passenger_id',
      'operator_driver_id',
    ],
    registry: [
      'operator',
      'journey_distance_anounced',
      'journey_distance_calculated',
      'journey_duration_anounced',
      'journey_duration_calculated',
      'operator_journey_id',
      'operator_passenger_id',
      'operator_driver_id',
    ],
  };

  async init(): Promise<void> {
    await this.kernel.notify<ParamsInterface>(
      signature,
      {
        type: 'opendata',
      },
      {
        call: {
          user: {},
        },
        channel: {
          service: handlerConfig.service,
          metadata: {
            repeat: {
              cron: '0 5 6 * *',
            },
            jobId: 'trip.open_data_export',
          },
        },
      },
    );
  }

  public async handle(params: ParamsInterface, context: ContextType): Promise<ResultInterface> {
    const type = get(params, 'type', 'export');
    const queryParams: TripSearchInterface = this.getDefaultQueryParams(params);
    let excluded_territories: TerritoryTripsInterface[];

    if (this.isOpendata(type)) {
      excluded_territories = await this.tripRepository.getOpenDataExcludedTerritories(queryParams);
      this.addExcludedTerritoriesToQueryParams(excluded_territories, queryParams);
    }

    const cursor: PgCursorHandler = await this.tripRepository.searchWithCursor(queryParams, type);
    const filepath: string = await this.buildFile.buildCsvFromCursor(cursor, params, queryParams.date.end);
    const filename: string = path.parse(filepath).base;

    if (this.isOpendata(type)) {
      await this.publishOpendataExport(queryParams, excluded_territories, filepath);
      this.removeFromFs(filepath);
    } else {
      const { zippath, zipname } = this.zip(filename, filepath);
      await this.fileProvider.upload(BucketName.Export, zippath, zipname);
    }

    return filename;
  }

  private zip(filename: string, filepath: string) {
    const zipname = `${filename.replace('.csv', '')}.zip`;
    const zippath = path.join(os.tmpdir(), zipname);
    const zip = new AdmZip();
    zip.addLocalFile(filepath);
    zip.writeZip(zippath);
    return { zippath, zipname };
  }

  private removeFromFs(filepath: string) {
    fs.unlinkSync(filepath);
  }

  private addExcludedTerritoriesToQueryParams(
    excluded_territories: TerritoryTripsInterface[],
    queryParam: TripSearchInterface,
  ) {
    if (excluded_territories.length !== 0) {
      queryParam.excluded_start_territory_id = excluded_territories
        .filter((t) => t.start_territory_id)
        .map((t) => t.start_territory_id);
      queryParam.excluded_end_territory_id = excluded_territories
        .filter((t) => t.end_territory_id)
        .map((t) => t.end_territory_id);
    }
  }

  private isOpendata(type: any): boolean {
    return type === 'opendata';
  }

  private publishOpendataExport(
    queryParam: TripSearchInterface,
    excluded_territories: TerritoryTripsInterface[],
    filepath: string,
  ) {
    return this.kernel.call<PublishOpenDataParamsInterface>(
      publishOpenDataSignature,
      {
        filepath,
      },
      {
        call: {
          user: {},
          metadata: { queryParam: queryParam, excludedTerritories: excluded_territories },
        },
        channel: {
          service: handlerConfig.service,
        },
      },
    );
  }

  private getDefaultQueryParams(params: ParamsInterface): TripSearchInterface {
    const endDate = getDefaultEndDate();
    const startDate = new Date(endDate.valueOf());
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    return {
      date: {
        start: startDate,
        end: endDate,
        ...params.query?.date,
      },
      ...params.query,
      status: 'ok',
    };
  }

  public static getColumns(type = 'opendata'): string[] {
    switch (type) {
      case 'territory':
        return [
          ...BuildExportAction.baseFields,
          ...BuildExportAction.extraFields.territory,
          ...BuildExportAction.financialFields,
        ];
      case 'operator':
        return [
          ...BuildExportAction.baseFields,
          ...BuildExportAction.extraFields.operator,
          ...BuildExportAction.financialFields,
        ];
      case 'registry':
        return [
          ...BuildExportAction.baseFields,
          ...BuildExportAction.extraFields.registry,
          ...BuildExportAction.financialFields,
        ];
      default:
        return [...BuildExportAction.baseFields, ...BuildExportAction.extraFields.opendata];
    }
  }
}
