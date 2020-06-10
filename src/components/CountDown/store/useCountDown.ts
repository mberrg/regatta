import { Store } from 'src/useStore';
import { CounterState, SetState } from '../models';
import { computed } from '@vue/composition-api';

class CountDownStore extends Store<CounterState> {
  private socket?: WebSocket;
  private connected = false;
  protected data(): CounterState {
    return {
      startTimeMs: Date.now() + 60 * 60 * 1000,
      delayMinutesBetweenHeats: 15,
      numHeats: 3,
      currentHeat: 0,
      started: false,
      finnished: false,
      intervalFunc: undefined,
      isNegative: false,
      secondsLeft: 99,
      minutesLeft: 99,
      hoursLeft: 99
    };
  }
  constructor() {
    super();

    setInterval(() => this._getTimeleft(), 100);

    this.connectWS();
  }
  closeWS() {
    if (this.socket) this.socket.close();
    this.connected = false;
  }
  connectWS() {
    if (this.socket) this.socket.close();
    // Create WebSocket connection.
    this.socket = new WebSocket('wss://regattastart.herokuapp.com/ws');
    this.connected = true;
    // Listen for message
    this.socket.addEventListener('message', event => {
      console.log('Message from server ', event.data);
      try {
        const newState = JSON.parse(event.data) as SetState; // TODO check for correct data
        this.setState(newState);
      } catch (err) {
        console.error(err);
      }
    });
    this.socket.onclose = e => {
      if (this.connected) {
        console.error(
          'Socket is closed. Reconnect will be attempted in 1 second.',
          e.reason
        );
        setTimeout(() => {
          this.connectWS();
        }, 1000);
      }
    };

    this.socket.onerror = err => {
      console.error('Socket encountered error: ', err, 'Closing socket');
      if (this.socket) this.socket.close();
    };
  }

  setState(newState: SetState) {
    const {
      startTimeMs,
      delayMinutesBetweenHeats,
      numHeats,
      started
    } = newState;

    this.state.startTimeMs = startTimeMs;
    this.state.delayMinutesBetweenHeats = delayMinutesBetweenHeats;
    this.state.numHeats = numHeats;
    this.state.started = started;
    if (started) {
      this.state.finnished = false;
      const msSinceStart = Date.now() - startTimeMs;

      if (msSinceStart < 0) {
        // Not started heat 1

        this.state.currentHeat = 0;
      } else {
        let currentHeat = Math.ceil(
          msSinceStart / (delayMinutesBetweenHeats * 60 * 1000)
        );
        console.log(`Current heat raw ${currentHeat}`);

        if (currentHeat >= numHeats || numHeats <= 1) {
          this.state.finnished = true;
          currentHeat = numHeats;
          console.log(`Current heat raw2 ${currentHeat}`);
        }
        this.state.currentHeat = currentHeat;

        console.log(`next heat heat  ${new Date(this.state.startTimeMs)}`);
      }

      if (!this.state.finnished) {
        this.startTimer();
      }
    } else {
      this.stopTimer();
    }
  }

  nextStartTime() {
    return computed(() => {
      return new Date(this.state.started ? this.nextStartTimeMs() : 0);
    });
  }

  nextStartTimeMs() {
    const currentHeat = this.state.finnished
      ? this.state.currentHeat - 1
      : this.state.currentHeat;
    return (
      this.state.startTimeMs +
      currentHeat * this.state.delayMinutesBetweenHeats * 60 * 1000
    );
  }

  startTimer() {
    if (!this.state.started) return;

    if (this.state.intervalFunc) this.stopTimer();
    console.log('Starting timer');
    this.state.intervalFunc = setInterval(() => {
      const newtime = this.nextStartTimeMs() - new Date().valueOf();

      if (newtime < 0) {
        this.state.currentHeat++;
        if (this.state.currentHeat > this.state.numHeats - 1) {
          this.state.finnished = true;
          this.stopTimer();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.state.intervalFunc) {
      console.log('Stopping timer');
      clearInterval(this.state.intervalFunc);
      this.state.intervalFunc = undefined;
    } else {
      console.log('Timer does not exists timer');
    }
  }
  _getTimeleft() {
    if (!this.state.started) return;

    const now = Date.now();

    let timeDif = this.nextStartTimeMs() - now;

    let isNegative = false;
    if (timeDif < 0) {
      if (this.state.finnished) {
        timeDif = Math.abs(timeDif);
        isNegative = true;
      } else {
        // to stop clock "flickering"
        timeDif = 0;
      }
    }

    timeDif = Math.ceil(timeDif / 1000); // Now in whole seconds left
    let seconds = timeDif % 60;
    timeDif = (timeDif - seconds) / 60; // Now in whole minutes left
    let minutes = timeDif % 60;
    timeDif = (timeDif - minutes) / 60; // Now in whole hours left
    let hours = timeDif;

    if (hours > 99) {
      seconds = 99;
      minutes = 99;
      hours = 99;
    }

    if (this.state.isNegative != isNegative) this.state.isNegative = isNegative;
    if (this.state.secondsLeft != seconds) this.state.secondsLeft = seconds;
    if (this.state.minutesLeft != minutes) this.state.minutesLeft = minutes;
    if (this.state.hoursLeft != hours) this.state.hoursLeft = hours;
  }
}

export const useCountDown: CountDownStore = new CountDownStore();
