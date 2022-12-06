import { Action as AbstractAction } from '@ilos/core';
import { handler } from '@ilos/common';
import { hasPermissionMiddleware } from '@pdc/provider-middleware';

import { alias } from '../shared/observatory/occupation/monthlyOccupation.schema';
import { handlerConfig, ResultInterface, ParamsInterface } from '../shared/observatory/occupation/monthlyOccupation.contract';
import { OccupationRepositoryInterfaceResolver } from '../interfaces/OccupationRepositoryProviderInterface';

@handler({
  ...handlerConfig,
  middlewares: [
    hasPermissionMiddleware('common.observatory.stats'),
    ['validate', alias],
  ],
})
export class MonthlyOccupationAction extends AbstractAction {
  constructor(private fluxRepository: OccupationRepositoryInterfaceResolver) {
    super();
  }

  public async handle(params: ParamsInterface): Promise<ResultInterface> {
    return this.fluxRepository.monthlyOccupation(params);
  }
}
