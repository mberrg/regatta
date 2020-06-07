import { CounterState } from './state';

export const mutateStartTime = (state: CounterState, starttime: Date) => {
  state.startTime = starttime;
};

export const mutateNextHeat = (state: CounterState, nextheat: number) => {
  state.nextHeat = nextheat;
};

export const mutateNumHeats = (state: CounterState, numheats: number) => {
  state.numHeats = numheats;
};

export const mutateHeatDelay = (state: CounterState, delay: number) => {
  state.delayMinutesBetweenHeats = delay;
};

export const mutateStarted = (state: CounterState, started: boolean) => {
  state.started = started;
};

export const mutateFinnished = (state: CounterState, finnished: boolean) => {
  state.finnished = finnished;
};

export const mutateCurrentHeat = (state: CounterState, heat: number) => {
  state.currentHeat = heat;
};

export const mutateInterval = (state: CounterState, interval: number) => {
  state.intervalFunc = interval;
};
