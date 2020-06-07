import { Store } from 'src/useStore';
import { CounterState } from '../models';
import { computed } from '@vue/composition-api';

class CountDownStore extends Store<CounterState> {
  protected data(): CounterState {
    return {
      startTime: new Date(0),
      nextHeat: 0,
      delayMinutesBetweenHeats: 15,
      numHeats: 3,
      currentHeat: 0,
      started: false,
      finnished: false,
      intervalFunc: undefined
    };
  }

  setStarttime(newStartTime: Date, numHeat: number, heatDelay: number) {
    const millsToNext = newStartTime.valueOf() - new Date().valueOf();
    this.state.numHeats = numHeat;
    this.state.delayMinutesBetweenHeats = heatDelay;

    this.state.startTime = newStartTime;
    this.state.nextHeat = millsToNext;
    this.state.started = true;
    this.state.finnished = false;
    this.state.currentHeat = 1;

    if (this.state.intervalFunc) clearInterval(this.state.intervalFunc);
    const interval = setInterval(() => {
      let newtime = this.state.nextHeat - 1000;
      if (newtime < 0 && this.state.currentHeat < this.state.numHeats) {
        newtime = newtime + this.state.delayMinutesBetweenHeats * 60 * 1000;
        this.state.startTime = new Date(
          this.state.startTime.valueOf() +
            this.state.delayMinutesBetweenHeats * 60 * 1000
        );
        this.state.currentHeat++;
      }
      if (!this.state.finnished && newtime < 0) this.state.finnished = true;
      this.state.nextHeat = newtime;
    }, 1000);
    this.state.intervalFunc = interval;
  }

  getTimeleft() {
    return computed(() => {
      function pad(num: number, size: number) {
        let s = String(num);
        while (s.length < (size || 2)) {
          s = '0' + s;
        }
        return s;
      }

      let timeDif = this.state.nextHeat;

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
    });
  }
}

export const useCountDown: CountDownStore = new CountDownStore();
