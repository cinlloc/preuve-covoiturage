import { ContextType, handler } from '@ilos/common';
import { Action } from '@ilos/core';
import { S3StorageProvider } from '@pdc/provider-file';
import { copyGroupIdAndApplyGroupPermissionMiddlewares } from '@pdc/provider-middleware/dist';
import { handlerConfig, ParamsInterface, ResultInterface, S3Object } from '../shared/trip/listCapitalcalls.contract';

@handler({
  ...handlerConfig,
  middlewares: [
    ...copyGroupIdAndApplyGroupPermissionMiddlewares({
      territory: 'territory.capitalcall.list',
      operator: 'operator.capitalcall.list',
      registry: 'registry.capitalcall.list',
    }),
  ],
})
export class ListCapitalCallAction extends Action {
  constructor(private s3StorageProvider: S3StorageProvider) {
    super();
  }

  public async handle(params: ParamsInterface, context: ContextType): Promise<ResultInterface> {
    if (params.operator_id) {
      return this.s3StorageProvider.findByOperator(params.operator_id) as unknown as Promise<S3Object[]>;
    } else if (params.territory_id) {
      return this.s3StorageProvider.findByTerritory(params.territory_id) as unknown as Promise<S3Object[]>;
    }
    return this.s3StorageProvider.findForRegistry() as unknown as Promise<S3Object[]>;
  }
}
