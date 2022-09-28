import { NotEligibleTargetException } from '../exceptions/NotEligibleTargetException';
import {
  OperatorsEnum,
  PolicyHandlerInterface,
  PolicyHandlerParamsInterface,
  PolicyHandlerStaticInterface,
  StatefulContextInterface,
  StatelessContextInterface,
} from '../../interfaces';
import {
  atDate,
  isAfter,
  isOperatorClassOrThrow,
  isOperatorOrThrow,
  onDistanceRange,
  onDistanceRangeOrThrow,
  perKm,
  perSeat,
  endsAt,
  startsAt,
  setMax,
  watchForGlobalMaxAmount,
  watchForPersonMaxAmountByMonth,
  watchForPersonMaxTripByDay,
} from '../helpers';
import { MaximumTargetEnum } from '../helpers/max';
import { description } from './Idfm.html';

// Politique d'Île-de-France Mobilité
export const Idfm: PolicyHandlerStaticInterface = class implements PolicyHandlerInterface {
  static readonly id = '460';
  protected operators = [OperatorsEnum.BlaBlaDaily, OperatorsEnum.Karos, OperatorsEnum.Klaxit];
  protected slices = [
    { start: 2_000, end: 15_000, fn: (ctx: StatelessContextInterface) => perSeat(ctx, 150) },
    {
      start: 15_000,
      end: 30_000,
      fn: (ctx: StatelessContextInterface) => perSeat(ctx, perKm(ctx, { amount: 10, offset: 15_000, limit: 30_000 })),
    },
  ];
  protected limits = [
    setMax('99911EAF-89AB-C346-DDD5-BD2C7704F935', 6_000_000_00, watchForGlobalMaxAmount),
    setMax('ECDE3CD4-96FF-C9D2-BA88-45754205A798', 150_00, watchForPersonMaxAmountByMonth, MaximumTargetEnum.Driver),
    setMax('56042464-852C-95B8-2009-8DD4808C9370', 6, watchForPersonMaxTripByDay, MaximumTargetEnum.Driver),
  ];
  protected pollutionAndStrikeDates = [
    '2022-02-18',
    '2022-03-25',
    '2022-03-26',
    '2022-03-27',
    '2022-03-28',
    '2022-06-18',
    '2022-07-06',
  ];

  protected processExclusion(ctx: StatelessContextInterface) {
    isOperatorOrThrow(ctx, this.operators);
    onDistanceRangeOrThrow(ctx, { min: 2_000, max: 150_000 });

    // Exclure les trajet Paris-Paris
    if (startsAt(ctx, { com: ['75056'] }) && endsAt(ctx, { com: ['75056'] })) {
      throw new NotEligibleTargetException();
    }

    // Exclure les trajets qui ne sont pas dans l'aom
    if (!startsAt(ctx, { aom: ['217500016'] }) || !endsAt(ctx, { aom: ['217500016'] })) {
      throw new NotEligibleTargetException();
    }

    // Classe de trajet
    isOperatorClassOrThrow(ctx, ['B', 'C']);
    // Modification de la campagne au 1er septembre
    if (isAfter(ctx, { date: new Date('2022-09-01') })) {
      isOperatorClassOrThrow(ctx, ['C']);
    }
  }

  processStateless(ctx: StatelessContextInterface): void {
    this.processExclusion(ctx);

    // Mise en place des limites
    for (const limit of this.limits) {
      const [staless] = limit;
      staless(ctx);
    }

    // Par kilomètre
    let amount = 0;
    for (const { start, end, fn } of this.slices) {
      if (onDistanceRange(ctx, { min: start })) {
        amount += fn(ctx);
      }
    }

    // Jour de pollution
    if (atDate(ctx, { dates: this.pollutionAndStrikeDates })) {
      amount *= 1.5;
    }

    ctx.incentive.set(amount);
  }

  processStateful(ctx: StatefulContextInterface): void {
    for (const limit of this.limits) {
      const [, stateful] = limit;
      stateful(ctx);
    }
  }

  params(): PolicyHandlerParamsInterface {
    return {
      slices: this.slices,
      operators: this.operators,
      limits: {
        glob: 6_000_000_00,
      },
    };
  }

  describe(): string {
    return description;
  }
};
