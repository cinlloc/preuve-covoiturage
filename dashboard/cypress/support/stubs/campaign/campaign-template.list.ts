import { JsonRPCResponse } from '~/core/entities/api/jsonRPCResponse';
import {
  DistanceRangeGlobalRetributionRule,
  RankRetributionRule,
  TimeRetributionRule,
  WeekdayRetributionRule,
} from '~/core/interfaces/campaign/api-format/campaign-global-rules.interface';
import { TemplateInterface } from '~/core/interfaces/campaign/templateInterface';
import { CampaignStatusEnum } from '~/core/enums/campaign/campaign-status.enum';
import { IncentiveUnitEnum } from '~/core/enums/campaign/incentive-unit.enum';
import { TripRankEnum } from '~/core/enums/trip/trip-rank.enum';
import {
  AmountRetributionRule,
  ForDriverRetributionRule,
  ForPassengerRetributionRule,
  FreeRetributionRule,
  PerKmRetributionRule,
  PerPassengerRetributionRule,
  RangeRetributionRule,
} from '~/core/interfaces/campaign/api-format/campaign-rules.interface';

export const campaignTemplateStubs: TemplateInterface[] = [
  {
    _id: '5d6930724f56e6e1d0654543',
    parent_id: null,
    status: CampaignStatusEnum.TEMPLATE,
    name: 'Encourager financièrement le covoiturage',
    description: "Campagne d'incitation financière au covoiturage à destination des conducteurs et des passagers.",
    global_rules: [
      new RankRetributionRule([TripRankEnum.A, TripRankEnum.B, TripRankEnum.C]),
      new DistanceRangeGlobalRetributionRule({
        min: 2000,
        max: 150000,
      }),
      new WeekdayRetributionRule([0, 1, 2, 3, 4, 5, 6]),
    ],
    rules: [
      [
        new RangeRetributionRule({
          min: 0,
          max: 50000,
        }),
        new ForPassengerRetributionRule(),
        new AmountRetributionRule(10),
        new PerKmRetributionRule(),
      ],
      [
        new RangeRetributionRule({
          min: 0,
          max: 50000,
        }),
        new ForDriverRetributionRule(),
        new AmountRetributionRule(10),
        new PerPassengerRetributionRule(),
        new PerKmRetributionRule(),
      ],
      [
        new RangeRetributionRule({
          min: 50000,
          max: 150000,
        }),
        new ForPassengerRetributionRule(),
        new AmountRetributionRule(500),
      ],
      [
        new RangeRetributionRule({
          min: 50000,
          max: 150000,
        }),
        new ForDriverRetributionRule(),
        new AmountRetributionRule(10),
        new PerPassengerRetributionRule(),
      ],
    ],
    ui_status: {
      for_driver: true,
      for_passenger: true,
      for_trip: false,
      staggered: false,
    },
    start_date: null,
    end_date: null,
    unit: IncentiveUnitEnum.EUR,
  },
  {
    _id: '5d69319a9763dc801ea78de6',
    parent_id: null,
    status: CampaignStatusEnum.TEMPLATE,
    name: 'Récompenser le covoiturage',
    description:
      "Campagne d'incitation basée sur un système de gratification par points donnant accès à un catalogue de récompenses (place de parking, place de piscine, composteur, etc.)",
    global_rules: [
      new RankRetributionRule([TripRankEnum.A, TripRankEnum.B, TripRankEnum.C]),
      new WeekdayRetributionRule([0, 1, 2, 3, 4, 5, 6]),
      new DistanceRangeGlobalRetributionRule({
        min: 2000,
        max: 150000,
      }),
    ],
    rules: [
      [
        new RangeRetributionRule({
          min: 0,
          max: 50000,
        }),
        new ForPassengerRetributionRule(),
        new AmountRetributionRule(1),
        new PerKmRetributionRule(),
      ],
      [
        new RangeRetributionRule({
          min: 0,
          max: 50000,
        }),
        new ForDriverRetributionRule(),
        new AmountRetributionRule(1),
        new PerPassengerRetributionRule(),
        new PerKmRetributionRule(),
      ],
      [
        new RangeRetributionRule({
          min: 50000,
          max: 150000,
        }),
        new ForPassengerRetributionRule(),
        new AmountRetributionRule(50),
      ],
      [
        new RangeRetributionRule({
          min: 50000,
          max: 150000,
        }),
        new ForDriverRetributionRule(),
        new AmountRetributionRule(50),
        new PerPassengerRetributionRule(),
      ],
    ],
    ui_status: {
      for_driver: true,
      for_passenger: true,
      for_trip: false,
      staggered: false,
    },
    start_date: null,
    end_date: null,
    unit: IncentiveUnitEnum.POINT,
  },
  {
    _id: '5d69319a9763dc801ea78de4',
    parent_id: null,
    status: CampaignStatusEnum.TEMPLATE,
    name: 'Limiter le trafic en semaine',
    description: "Campagne d'incitation pour limiter le trafic en semaine.",
    global_rules: [
      new WeekdayRetributionRule([0, 1, 2, 3, 4]),
      new RankRetributionRule([TripRankEnum.A, TripRankEnum.B, TripRankEnum.C]),
      new TimeRetributionRule([
        {
          start: 6,
          end: 20,
        },
      ]),
      new DistanceRangeGlobalRetributionRule({
        min: 2000,
        max: 150000,
      }),
    ],
    rules: [
      [new ForPassengerRetributionRule(), new AmountRetributionRule(10), new PerKmRetributionRule()],
      [
        new ForDriverRetributionRule(),
        new AmountRetributionRule(10),
        new PerPassengerRetributionRule(),
        new PerKmRetributionRule(),
      ],
    ],
    ui_status: {
      for_driver: true,
      for_passenger: true,
      for_trip: false,
      staggered: false,
    },
    start_date: null,
    end_date: null,
    unit: IncentiveUnitEnum.EUR,
  },
  {
    _id: '5d69319a9763dc801ea78iou',
    parent_id: null,
    status: CampaignStatusEnum.TEMPLATE,
    name: 'Limiter la pollution',
    description:
      "Campagne d'incitation financière activable en cas de pic de pollution pour encourager le covoiturage.",
    global_rules: [
      new WeekdayRetributionRule([0, 1, 2, 3, 4, 5, 6]),
      new RankRetributionRule([TripRankEnum.A, TripRankEnum.B, TripRankEnum.C]),
      new DistanceRangeGlobalRetributionRule({
        min: 2000,
        max: 150000,
      }),
    ],
    rules: [
      [new ForPassengerRetributionRule(), new FreeRetributionRule()],
      [
        new ForDriverRetributionRule(),
        new AmountRetributionRule(10),
        new PerPassengerRetributionRule(),
        new PerKmRetributionRule(),
      ],
    ],
    ui_status: {
      for_driver: true,
      for_passenger: true,
      for_trip: false,
      staggered: false,
    },
    start_date: null,
    end_date: null,
    unit: IncentiveUnitEnum.EUR,
  },
  {
    _id: '5d69319a9763dc801ea78pl9',
    parent_id: null,
    status: CampaignStatusEnum.TEMPLATE,
    name: 'Limiter les embouteillages du week-end',
    description:
      "Campagne d'incitation financière pour limiter les embouteillages les week-end notamment en cas de chassé croisé. ",
    global_rules: [
      new WeekdayRetributionRule([4, 6]),
      new RankRetributionRule([TripRankEnum.A, TripRankEnum.B, TripRankEnum.C]),
      new DistanceRangeGlobalRetributionRule({
        min: 2000,
        max: 150000,
      }),
      new TimeRetributionRule([
        {
          start: 12,
          end: 23,
        },
      ]),
    ],
    rules: [
      [
        new ForDriverRetributionRule(),
        new AmountRetributionRule(10),
        new PerPassengerRetributionRule(),
        new PerKmRetributionRule(),
      ],
    ],
    ui_status: {
      for_driver: true,
      for_passenger: false,
      for_trip: false,
      staggered: false,
    },
    start_date: null,
    end_date: null,
    unit: IncentiveUnitEnum.EUR,
  },
  {
    _id: '5d69319a9763dc801ea78fr6',
    parent_id: null,
    status: CampaignStatusEnum.TEMPLATE,
    name: "Limiter le trafic lors d'un évènement ponctuel",
    description: "Campagne d'incitation financière au covoiturage pour un événement ponctuel.",
    global_rules: [
      new WeekdayRetributionRule([0, 1, 2, 3, 4, 5, 6]),
      new RankRetributionRule([TripRankEnum.A, TripRankEnum.B, TripRankEnum.C]),
      new DistanceRangeGlobalRetributionRule({
        min: 2000,
        max: 150000,
      }),
    ],
    rules: [
      [new ForPassengerRetributionRule(), new AmountRetributionRule(10), new PerKmRetributionRule()],
      [
        new ForDriverRetributionRule(),
        new AmountRetributionRule(10),
        new PerPassengerRetributionRule(),
        new PerKmRetributionRule(),
      ],
    ],
    ui_status: {
      for_driver: true,
      for_passenger: true,
      for_trip: false,
      staggered: false,
    },
    start_date: null,
    end_date: null,
    unit: IncentiveUnitEnum.EUR,
  },
  {
    _id: '5d69319a9763dc801ea78ty6',
    parent_id: null,
    status: CampaignStatusEnum.TEMPLATE,
    name: 'Gratuité du covoiturage pour les passagers',
    description:
      "Campagne d'incitation ou la participation financière du passager est pris en charge par la collectivité.",
    global_rules: [
      new RankRetributionRule([TripRankEnum.A, TripRankEnum.B, TripRankEnum.C]),
      new WeekdayRetributionRule([0, 1, 2, 3, 4, 5, 6]),
      new DistanceRangeGlobalRetributionRule({
        min: 2000,
        max: 150000,
      }),
    ],
    rules: [[new ForPassengerRetributionRule(), new FreeRetributionRule()]],
    ui_status: {
      for_driver: false,
      for_passenger: true,
      for_trip: false,
      staggered: false,
    },
    start_date: null,
    end_date: null,
    unit: IncentiveUnitEnum.EUR,
  },
];

export function stubCampaignTemplateList() {
  cy.route({
    method: 'POST',
    url: '/rpc?methods=campaign:listTemplate',
    response: (data) =>
      <JsonRPCResponse[]>[
        {
          id: 1568215196898,
          jsonrpc: '2.0',
          result: {
            data: campaignTemplateStubs,
          },
        },
      ],
  });
}
