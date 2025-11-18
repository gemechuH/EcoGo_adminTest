export interface CommissionRates {
  default: number;
  [region: string]: number | undefined;
}

export interface SurgeConfig {
  enabled: boolean;
  multiplier?: number;
}

export interface FaresConfig {
  base: number;
  perKm: number;
  perMin: number;
}

export interface Settings {
  commissionRates: CommissionRates;
  surge: SurgeConfig;
  fares: FaresConfig;
  [key: string]: any;
}
