# @equal/react-store

## Requirements

- React@18

## Installation

```bash
npm i @equal/react-store
```

## Usage

### Create Instance

```typescript
import { createStore } from '@equal/store';

const counter = createStore(0);
```

### Using the Store

#### Read & Write

This hook causes a re-render on the component, and the store changes will be watched.

```typescript
import { useStore } from '@equal/react-store';

function Component() {
  // ...
  const [value, mutations] = useStore(counter);

  console.log(value); // 0
  mutations.write(1);
  console.log(value); // 1
  mutations.write((n) => n + 1);
  console.log(value); // 2
  // ...
}
```

#### Only Read

This hook causes a re-render on the component, and the store changes will be watched.

```typescript
import { useStoreValue } from '@equal/react-store';

function Component() {
  // ...
  const value = useStoreValue(counter);
  // ...
}
```

#### Only Read with Selector

This hook causes a re-render on the component, and the selector changes will be watched.

```typescript
import { useStoreSelector } from '@equal/react-store';

function Component() {
  // ...
  const value = useStoreSelector(counter, (value) => value * 2);
  // ...
}
```

#### Only Write

This hook doesn't cause a re-render on the component, the store changes doesn't will be watched.

```typescript
import { useStoreMutations } from '@equal/react-store';

function Component() {
  // ...
  const mutations = useStoreMutations(counter);

  mutations.read(); // 0
  mutations.write((n) => n + 1);
  mutations.read(); // 1
  // ...
}
```

### Creating an Alias

```typescript
import type { StoreValue, StoreMutations } from '@equal/store';
import { useStoreValue, useStoreMutations } from '@equal/react-store';

const useCounterMutations = (): StoreMutations<typeof counter> => useStoreMutations(counter);

const useCounterValue = (): StoreValue<typeof counter> => useStoreValue(counter);
```

### Add Mutations to the Store

```typescript
import { createStore } from '@equal/store';
import { useStoreMutations } from '@equal/react-store';

const counter = createStore(0)
  .withMutations({
    increment(value, payload: { value: number; }) {
      return value + payload.value;
    },
    decrement(value) {
      return value - 1;
    },
  });

function Component() {
  // ...
  const mutations = useStoreMutations(counter);

  mutations.increment({ value: 2 }); // 2
  mutations.decrement(); // 1
  // ...
}
```
