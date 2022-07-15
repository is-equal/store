# React-Store

## Installation

```bash
yarn add -D @equal/react-store
```

## Usage

### `useStore`

Returns the store data and writer function, and triggers re-render when it receives a change.

```typescript jsx
import { createStore, useStore } from '@equal/react-store';

const UserStore = createStore({ name: 'Equal', country: 'unknown' });

function Component(): JSX.Element {
  const [user, setUser] = useStore(UserStore);

  useEffect(() => {
    setUser({ name: 'Equal', country: 'BR' });
    // or
    setUser((user) => ({ ...user, country: 'BR' }));
  }, []);

  return <h1>Hello, {user.name}!</h1>;
}
```

### `useStoreValue`

Returns the store data, and triggers re-render when it receives a change.

```typescript jsx
import { createStore, useStore } from '@equal/react-store';

const UserStore = createStore({ name: 'Equal', country: 'BR' });

function Component(): JSX.Element {
  const user = useStoreValue(UserStore);

  return <h1>Hello, {user.name}!</h1>;
}
```

### `useStoreMutation`

Returns a writer function of the store, and doesn't apply any re-render.

```typescript jsx
import { createStore, useStore } from '@equal/react-store';
import { useEffect } from 'react';

const UserStore = createStore<{ name: string; country: string } | undefined>();

function Component(): JSX.Element {
  const setUser = useStoreMutation(UserStore);

  useEffect(() => {
    setUser({ name: 'Equal', country: 'BR' });
    // or
    setUser((user) => ({ ...user, name: 'Equal' }));
  }, []);

  return null;
}
```
