import * as _ from 'lodash';
import { Action as AbstractAction } from '@ilos/core';
import { handler, ContextType } from '@ilos/common';
import { GeoProviderInterfaceResolver } from '@pdc/provider-geo';
import { JourneyInterface } from '@pdc/provider-schema';

import { WorkflowProvider } from '../providers/WorkflowProvider';

// Enrich position data
@handler({
  service: 'normalization',
  method: 'route',
})
export class NormalizationRouteAction extends AbstractAction {
  public readonly middlewares: (string | [string, any])[] = [['channel.transport', ['queue']]];

  constructor(protected wf: WorkflowProvider, private geoProvider: GeoProviderInterfaceResolver) {
    super();
  }

  public async handle(journey: JourneyInterface, context: ContextType): Promise<JourneyInterface> {
    this.logger.debug(`Normalization:route on ${journey._id}`);

    // calc distance and duration for passenger
    const passengerRoute = await this.geoProvider.getRoute(
      {
        lon: journey.passenger.start.lon,
        lat: journey.passenger.start.lat,
      },
      {
        lon: journey.passenger.end.lon,
        lat: journey.passenger.end.lat,
      },
    );

    _.set(journey, 'passenger.calc_distance', passengerRoute.distance);
    _.set(journey, 'passenger.calc_duration', passengerRoute.duration);

    // calc distance and duration for driver
    const driverRoute = await this.geoProvider.getRoute(
      {
        lon: journey.driver.start.lon,
        lat: journey.driver.start.lat,
      },
      {
        lon: journey.driver.end.lon,
        lat: journey.driver.end.lat,
      },
    );

    _.set(journey, 'driver.calc_distance', driverRoute.distance);
    _.set(journey, 'driver.calc_duration', driverRoute.duration);

    // Call the next step asynchronously
    await this.wf.next('normalization:route', journey);

    return journey;
  }
}