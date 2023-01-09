import { serviceProvider, NewableType, ExtensionInterface } from '@ilos/common';
import { ServiceProvider as AbstractServiceProvider } from '@ilos/core';
import { PostgresConnection } from '@ilos/connection-postgres';
import { RedisConnection } from '@ilos/connection-redis';
import { ValidatorMiddleware, ValidatorExtension } from '@pdc/provider-validator';
import { defaultMiddlewareBindings } from '@pdc/provider-middleware';
import { GeoProvider } from '@pdc/provider-geo';

import { config } from './config';
import { FraudCheckRepositoryProvider } from './providers/FraudCheckRepositoryProvider';

import { CheckAction } from './actions/CheckAction';
import { CheckEngine } from './engine/CheckEngine';

@serviceProvider({
  config,
  commands: [],
  providers: [FraudCheckRepositoryProvider, GeoProvider, CheckEngine],
  validator: [],
  middlewares: [...defaultMiddlewareBindings, ['validate', ValidatorMiddleware]],
  connections: [
    [RedisConnection, 'connections.redis'],
    [PostgresConnection, 'connections.postgres'],
  ],
  handlers: [CheckAction],
  queues: ['fraudcheck'],
})
export class ServiceProvider extends AbstractServiceProvider {
  readonly extensions: NewableType<ExtensionInterface>[] = [ValidatorExtension];
}
