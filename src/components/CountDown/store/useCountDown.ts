import { Store } from 'src/useStore';
import { CounterState, SetState } from '../models';
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
  constructor() {
    super();

    this.connectWS();
  }

  connectWS() {
    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:80/ws');
    // Listen for messages
    socket.addEventListener('message', event => {
      console.log('Message from server ', event.data);
      try {
        const newState = JSON.parse(event.data) as SetState; // TODO check for correct data
        this.setState(newState);
      } catch (err) {
        console.error(err);
      }
    });
    socket.onclose = e => {
      console.log(
        'Socket is closed. Reconnect will be attempted in 1 second.',
        e.reason
      );
      setTimeout(() => {
        this.connectWS();
      }, 1000);
    };

    socket.onerror = function(err) {
      console.error('Socket encountered error: ', err, 'Closing socket');
      socket.close();
    };
  }

  setState(newState: SetState) {
    const {
      startTimeMs,
      delayMinutesBetweenHeats,
      numHeats,
      started
    } = newState;
    const now = new Date().valueOf();
    this.state.startTime = new Date(startTimeMs);
    this.state.delayMinutesBetweenHeats = delayMinutesBetweenHeats;
    this.state.numHeats = numHeats;
    if (started) {
      this.state.started = true;
      const msSinceStart = now - startTimeMs;

      if (msSinceStart < 0) {
        // Not started heat 1
        this.state.nextHeat = -msSinceStart;
        this.state.currentHeat = 1;
        this.state.finnished = false;
      } else {
        let currentHeat =
          Math.ceil(msSinceStart / (delayMinutesBetweenHeats * 60 * 1000)) + 1;
        console.log(`Current heat raw ${currentHeat}`);

        if (currentHeat > numHeats) {
          this.state.finnished = true;
          currentHeat = numHeats;
        }
        console.log(`Current heat  ${currentHeat}`);
        this.state.currentHeat = currentHeat;

        this.state.nextHeat =
          startTimeMs +
          delayMinutesBetweenHeats * 60 * 1000 * (currentHeat - 1) -
          now;
        console.log(`next heat heat  ${this.state.nextHeat}`);
      }
    }

    this.startTimer();
  }

  nextStartTime() {
    return computed(() => {
      if (!this.state.started) return new Date();

      return new Date(
        this.state.startTime.valueOf() +
          this.state.delayMinutesBetweenHeats *
            60 *
            1000 *
            (this.state.currentHeat - 1)
      );
    });
  }

  startTimer() {
    if (!this.state.started) return;

    if (this.state.intervalFunc) clearInterval(this.state.intervalFunc);

    const interval = setInterval(() => {
      let newtime = this.state.nextHeat - 1000;

      if (newtime < 0 && this.state.currentHeat < this.state.numHeats) {
        newtime = newtime + this.state.delayMinutesBetweenHeats * 60 * 1000;

        this.state.currentHeat++;
      }
      if (!this.state.finnished && newtime < 0) this.state.finnished = true;
      this.state.nextHeat = newtime;
    }, 1000);
    this.state.intervalFunc = interval;
  }

  stopTimer() {
    if (this.state.intervalFunc) {
      clearInterval(this.state.intervalFunc);
      this.state.intervalFunc = undefined;
    }
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
