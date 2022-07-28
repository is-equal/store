import './main.css';
import { createRoot } from 'react-dom/client';
import {
  createStore,
  useStore,
  useStoreMutations,
  useStoreSubscriber,
  useStoreValue,
} from '@equal/react-store';
import { useEffect } from 'react';

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);

root.render(<App />);

const user = createStore('equal').useMiddleware((store) => (next) => (command) => {
  if (command.type === 'write') {
    const value = ((Math.random() * 10) | 0).toString();

    if (typeof command.payload === 'function') {
      return next({ type: 'write', payload: command.payload(store.read()) + value });
    }

    return next({ type: 'write', payload: command.payload + value });
  }

  return next(command);
});

function App() {
  return (
    <>
      <h1>Today</h1>
      <Today />
      <hr />
      <h1>User</h1>
      <User />
      <hr />
      <h1>Counter</h1>
      <CounterDisplay />
      <CounterController />
    </>
  );
}

function User() {
  useStoreSubscriber(user);

  return (
    <>
      <p>{user.read()}</p>
      <button onClick={() => user.write('xyz')}>Change</button>
    </>
  );
}

const counter = createStore(0)
  .withMutations({
    decrement(value) {
      return value - 1;
    },
    increment(value, payload: { num: number; text: string }) {
      return value + payload.num;
    },
  })
  .useMiddleware((store) => (next) => (command) => {
    if (command.type === 'write') {
      const multiplier = 10;

      if (typeof command.payload === 'function') {
        return next({ type: 'write', payload: command.payload(store.read()) * multiplier });
      }

      return next({ type: 'write', payload: command.payload * multiplier });
    }

    if (command.type === 'increment') {
      const { num, text } = command.payload;

      return next({ type: 'increment', payload: { num: num * 2, text } });
    }

    next({ type: 'decrement', payload: undefined });
  });

const useCounterData = () => useStoreValue(counter);

function CounterDisplay() {
  const data = useCounterData();

  return (
    <>
      <p>{data}</p>
    </>
  );
}

const useCounterMutations = () => useStoreMutations(counter);

function CounterController() {
  const mutations = useCounterMutations();

  return (
    <>
      <button onClick={() => mutations.write(() => 4)}>Set (40)</button>
      <button onClick={() => counter.decrement()}>-</button>
      <button onClick={() => mutations.increment({ num: 2, text: 'equal' })}>+</button>
    </>
  );
}

const getTimeData = () => ({
  day: new Date().getDay(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  hour: new Date().getHours(),
  minutes: new Date().getMinutes(),
  seconds: new Date().getSeconds(),
});

const today = createStore(getTimeData);

function Today() {
  const [data, mutations] = useStore(today);

  useEffect(() => {
    const id = setInterval(() => mutations.write(getTimeData), 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <p>
        {data.year}/{data.month}/{data.day}T{data.hour}:{data.minutes}:{data.seconds}
      </p>
    </>
  );
}
