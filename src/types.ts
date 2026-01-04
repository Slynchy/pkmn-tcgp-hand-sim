export enum CardType {
  Basic,
  Stage1,
  Stage2,
  MEGA,
  Trainer,
  Item,
  UNKNOWN,
}

export interface ICLIArguments {
  iterations?: number;
  deck?: string;
  update?: boolean;
  verbose?: boolean;
}
