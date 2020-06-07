import { Store } from 'src/useStore';
import { Clock } from '../models';

class ClockStore extends Store<Clock> {
  protected data(): Clock {
    return {
      now: Date.now()
    };
  }

  interval: NodeJS.Timeout | undefined = undefined;

  startClock() {
    if (!this.isStarted())
      this.interval = setInterval(() => {
        this.state.now = Date.now();
      }, 1000);
  }

  stopClock() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  isStarted() {
    return this.interval != undefined;
  }
}

export const useClock: ClockStore = new ClockStore();
