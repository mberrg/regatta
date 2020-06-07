import { CounterState } from './state';

export function getHeatNum(state: CounterState) {
  return state.currentHeat;
}
export function getTotHeats(state: CounterState) {
  return state.numHeats;
}
export function getStartTime(state: CounterState) {
  return state.startTime;
}
export function getTimeleft(state: CounterState) {
  function pad(num: number, size: number) {
    let s = String(num);
    while (s.length < (size || 2)) {
      s = '0' + s;
    }
    return s;
  }

  let timeDif = state.nextHeat;
  let isNegative = false;
  if (timeDif < 0) {
    timeDif = Math.abs(timeDif);
    isNegative = true;
  }
  const milliseconds = timeDif % 1000;
  timeDif = (timeDif - milliseconds) / 1000; // Now in whole seconds left
  const seconds = timeDif % 60;
  timeDif = (timeDif - seconds) / 60; // Now in whole minutes left
  const minutes = timeDif % 60;
  timeDif = (timeDif - minutes) / 60; // Now in whole hours left
  const hours = timeDif;

  return {
    isNegative,
    milliseconds: pad(milliseconds, 2),
    seconds: pad(seconds, 2),
    minutes: pad(minutes, 2),
    hours: pad(hours, 2)
  };
}
