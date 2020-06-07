export interface CounterState extends Object {
  startTime: Date;
  delayMinutesBetweenHeats: number;
  nextHeat: number;
  numHeats: number;
  currentHeat: number;
  started: boolean;
  finnished: boolean;
  intervalFunc?: NodeJS.Timeout;
}
