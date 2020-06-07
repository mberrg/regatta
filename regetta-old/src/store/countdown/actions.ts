import { CounterState } from './state';

export function setStarttime(
  { state, commit }: { state: CounterState; commit: any },
  newStartTime: Date
) {
  const millsToNext = newStartTime.valueOf() - new Date().valueOf();

  commit('mutateStartTime', newStartTime);
  commit('mutateNextHeat', millsToNext);
  commit('mutateStarted', true);
  commit('mutateFinnished', false);
  commit('mutateCurrentHeat', 1);

  if (state.intervalFunc) clearInterval(state.intervalFunc);
  const interval = setInterval(() => {
    let newtime = state.nextHeat - 1000;
    if (newtime < 0 && state.currentHeat < state.numHeats) {
      newtime = newtime + state.delayMinutesBetweenHeats * 60 * 1000;
      commit(
        'mutateStartTime',
        new Date(
          state.startTime.valueOf() + state.delayMinutesBetweenHeats * 60 * 1000
        )
      );
      commit('mutateCurrentHeat', state.currentHeat + 1);
    }
    if (!state.finnished && newtime < 0) commit('mutateFinnished', true);

    commit('mutateNextHeat', newtime);
  }, 1000);
  commit('mutateInterval', interval);
}
