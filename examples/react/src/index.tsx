/* eslint-disable @typescript-eslint/no-unused-vars */

import './main.css';
import { createRoot } from 'react-dom/client';
import { createStore, useStoreValue } from '@equal/react-store';

const user = createStore('equal');

const counter = createStore(0)
  .useMutations({
    decrement(value) {
      return value - 1;
    },
    increment(value, payload: { n: number; s: string }) {
      return value + payload.n;
    },
  })
  .useMiddleware((store) => (next) => (command) => {
    if (command.type === 'increment') {
      const { n, s } = command.payload;

      next({
        type: 'increment',
        payload: {
          n: n * 2,
          s,
        },
      });
    } else {
      next({
        type: 'decrement',
        payload: undefined,
      });
    }
  });

function App() {
  const data = useStoreValue(counter);

  return (
    <>
      <p>User: {user.read()}</p>
      <p>Hook: {data}</p>
      <p>Store: {counter.read()}</p>
      <button onClick={() => counter.decrement()}>-</button>
      <button
        onClick={() =>
          counter.increment({
            n: 2,
            s: 'equal',
          })
        }
      >
        +
      </button>
    </>
  );
}

const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);

root.render(<App />);
