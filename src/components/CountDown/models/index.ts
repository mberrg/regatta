export interface CounterState extends Object {
  startTimeMs: number;
  delayMinutesBetweenHeats: number;
  numHeats: number;
  currentHeat: number;
  started: boolean;
  finnished: boolean;
  intervalFunc?: NodeJS.Timeout;
  isNegative: boolean;
  secondsLeft: number;
  minutesLeft: number;
  hoursLeft: number;
}

export interface SetState {
  startTimeMs: number;
  delayMinutesBetweenHeats: number;

  numHeats: number;

  started: boolean;
}
