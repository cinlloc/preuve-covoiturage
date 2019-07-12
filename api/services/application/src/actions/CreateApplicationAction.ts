import { Parents, Container } from '@ilos/core';

import {
  ApplicationInterface,
  ApplicationRepositoryProviderInterfaceResolver,
  CreateApplicationParamsInterface,
} from '../interfaces';

@Container.handler({
  service: 'application',
  method: 'create',
})
export class CreateApplicationAction extends Parents.Action {
  public readonly middlewares: (string | [string, any])[] = [
    ['validate', 'application.create'],
    [
      'scopeIt',
      [
        ['application.create'],
        [
          (params, context) => {
            // make sure the operator_id in the params matches the one of the user
            // if this is an operator to scope an operator to its own data
            if (
              context.call.user.operator &&
              'operator_id' in params &&
              params.operator_id === context.call.user.operator
            ) {
              return 'operator.application.create';
            }
          },
        ],
      ],
    ],
  ];

  constructor(private applicationRepository: ApplicationRepositoryProviderInterfaceResolver) {
    super();
  }

  public async handle(params: CreateApplicationParamsInterface): Promise<ApplicationInterface> {
    return this.applicationRepository.create(params);
  }
}