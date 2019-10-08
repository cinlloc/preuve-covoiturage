import { statDataNameType } from '~/core/types/stat/statDataNameType';

export const petrolFactor = 0.0000636;
export const co2Factor = 0.000195;

export const TERRITORY_STATS = {
  names: <statDataNameType[]>['trips', 'distance', 'carpoolers', 'petrol', 'co2', 'carpoolersPerVehicule', 'operators'],
  defaultGraphName: <statDataNameType>'trips',
};

export const OPERATOR_STATS = {
  names: <statDataNameType[]>['trips', 'distance', 'carpoolers', 'petrol', 'co2', 'carpoolersPerVehicule'],
  defaultGraphName: <statDataNameType>'trips',
};
