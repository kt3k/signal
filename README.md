# @kt3k/signal

## Install

```
npx jsr add @kt3k/signal
```

Or

```
deno add @kt3k/signal
```

## Usage

```ts
import { signal } from "@kt3k/signal";

const a = signal(1);

console.log(a.get()); // prints 1

const stop = a.onChange((val) => {
  console.log(val);
});

a.update(2); // prints 2

a.update(2); // No log because of no value change

stop();

a.update(3); // No log because subscription is stopped
```

### `updateByFields`

```ts
import { signal } from "@kt3k/signal";

const a = signal({ x: 0, y: 0 });

console.log(a.get()); // prints { x: 0, y: 0 }

const stop = a.onChange((val) => {
  console.log(val);
});

a.update({ x: 0, y: 0 }); // this prints { x: 0, y: 0 } because the value equality is checked by ===

a.updateByFields({ x: 0, y: 0 }); // this doesn't print because the value equality is checked on each field
```

## License

MIT
