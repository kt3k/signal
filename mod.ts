// Copyright 2024 Yoshiya Hinosawa. All rights reserved. MIT license.

type Handler<T = unknown> = (event: T) => void

/**
 * Atomic signal class.
 *
 * @experimental
 */
export class Signal<T> {
  #val: T
  #handlers: Handler<T>[] = []
  constructor(value: T) {
    this.#val = value
  }

  /**
   * Get the current value of the signal.
   *
   * @returns The current value of the signal
   */
  get(): T {
    return this.#val
  }

  /**
   * Update the signal value.
   *
   * @param value The new value of the signal
   */
  update(value: T) {
    if (this.#val !== value) {
      this.#val = value
      this.#handlers.forEach((handler) => {
        handler(value)
      })
    }
  }

  /**
   * Subscribe to the signal.
   *
   * @param cb The callback function to be called when the signal is updated
   * @returns A function to stop the subscription
   */
  onChange(cb: (val: T) => void): () => void {
    this.#handlers.push(cb)
    return () => {
      this.#handlers.splice(this.#handlers.indexOf(cb) >>> 0, 1)
    }
  }

  /**
   * Subscribe to the signal.
   *
   * @param cb The callback function to be called when the signal is updated and also called immediately
   * @returns A function to stop the subscription
   */
  subscribe(cb: (val: T) => void): () => void {
    cb(this.#val)
    return this.onChange(cb)
  }

  /** Maps the signal to a different signal */
  map<U>(fn: (val: T) => U): Signal<U> {
    const signal = new Signal(fn(this.#val))
    this.onChange((val) => signal.update(fn(val)))
    return signal
  }
}

/** A signal consists of a group of values */
class GroupSignal<T> {
  #val: T
  #handlers: Handler<T>[] = []
  constructor(value: T) {
    this.#val = value
  }

  /**
   * Get the current value of the signal.
   *
   * @returns The current value of the signal
   */
  get(): T {
    return this.#val
  }

  /**
   * Update the signal value.
   * The signal event is only emitted when the fields of the new value are different from the current value.
   *
   * @param value The new value of the signal
   */
  update(value: T) {
    if (typeof value !== "object" || value === null) {
      throw new Error("value must be an object")
    }
    for (const key of Object.keys(value)) {
      // deno-lint-ignore no-explicit-any
      if ((this.#val as any)[key] !== (value as any)[key]) {
        this.#val = { ...value }
        this.#handlers.forEach((handler) => {
          handler(this.#val)
        })
        break
      }
    }
  }

  /**
   * Subscribe to the signal.
   *
   * @param cb The callback function to be called when the signal is updated
   * @returns A function to stop the subscription
   */
  onChange(cb: (val: T) => void): () => void {
    this.#handlers.push(cb)
    return () => {
      this.#handlers.splice(this.#handlers.indexOf(cb) >>> 0, 1)
    }
  }

  /**
   * Subscribe to the signal.
   *
   * @param cb The callback function to be called when the signal is updated and also called immediately
   * @returns A function to stop the subscription
   */
  subscribe(cb: (val: T) => void): () => void {
    cb(this.#val)
    return this.onChange(cb)
  }

  /** Maps the signal to a different signal */
  map<U>(fn: (val: T) => U): GroupSignal<U> {
    const signal = new GroupSignal(fn(this.#val))
    this.onChange((val) => signal.update(fn(val)))
    return signal
  }
}

/**
 * A signal is a value that can be updated and listened to.
 *
 * @example Usage
 * ```ts
 * import { signal } from "@kt3k/signal";
 *
 * const a = signal(1);
 *
 * console.log(a.get()); // 1
 *
 * const stop = a.subscribe((val) => {
 *   console.log(val);
 * }); // Logs 1
 *
 * a.update(2); // Logs 2
 *
 * stop();
 *
 * a.update(3); // No log
 * ```
 *
 * @typeParam T The type of the signal value
 * @param value The initial value of the signal
 * @returns {Signal<T>}
 *
 * @experimental
 */
export function signal<T>(value: T): Signal<T> {
  return new Signal(value)
}

/**
 * A group signal is a signal that consists of a group of values.
 * A group signal is useful when you want to listen to a group of values.
 *
 * @example Usage
 * ```ts
 * import { groupSignal } from "@kt3k/signal";
 *
 * const a = groupSignal({ x: 1, y: 2 });
 *
 * console.log(a.get()); // { x: 1, y: 2 }
 *
 * const stop = a.subscribe((val) => {
 *   console.log(val);
 * }); // Logs { x: 1, y: 2 }
 *
 * a.update({ x: 2, y: 1 }); // Logs { x: 2, y: 1 }
 *
 * a.update({ x: 2, y: 1 }); // No log
 *
 * stop();
 *
 * a.update({ x: 3, y: 1}); // No log
 * ```
 *
 * @param value
 * @returns
 */
export function groupSignal<T extends object>(value: T): GroupSignal<T> {
  return new GroupSignal(value)
}
