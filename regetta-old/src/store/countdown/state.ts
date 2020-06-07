export interface CounterState {
  startTime: Date;
  delayMinutesBetweenHeats: number;
  nextHeat: number;
  numHeats: number;
  currentHeat: number;
  started: boolean;
  finnished: boolean;
  intervalFunc: number;
}

const state: CounterState = {
  startTime: new Date(0),
  nextHeat: 0,
  delayMinutesBetweenHeats: 15,
  numHeats: 3,
  currentHeat: 0,
  started: false,
  finnished: false,
  intervalFunc: 0
};

export default state;
