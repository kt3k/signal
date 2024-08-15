# @kt3k/signal

> A data container which emits the event when the value is changed

Lightweight framework agnostic implementation of signal
[*1](https://preactjs.com/blog/introducing-signals/)
[*2](https://www.solidjs.com/tutorial/introduction_signals).

## Install

```
npx jsr add @kt3k/signal
```

Or

```
deno add @kt3k/signal
```

## Usage

Create a signal with `signal` function. Subscribe the value change with
`onChange` method. Update the value with `update` method.

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

When you call`.update()`, the value is compared with the previous value with
`===` equality. If you prefer to compare them with the equality of each field,
use `.updateByFields()` method.

```ts
import { signal } from "@kt3k/signal";

const a = signal({ x: 0, y: 0 });

console.log(a.get()); // prints { x: 0, y: 0 }

const stop = a.onChange((val) => {
  console.log(val);
});

a.update({ x: 0, y: 0 }); // this prints { x: 0, y: 0 } because the value equality
                          // is checked by ===

a.updateByFields({ x: 0, y: 0 }); // this doesn't print because the value equality
                                  // is checked on each field
```

## License

MIT
