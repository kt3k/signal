// Copyright 2024 Yoshiya Hinosawa. All rights reserved. MIT license.

import mitt, { type Emitter } from "./mitt.ts";

/**
 * Signal class.
 *
 * @experimental
 */
export class Signal<T> {
  #e: Emitter<T>;
  #val: T;
  constructor(val: T) {
    this.#e = mitt<T>();
    this.#val = val;
  }

  /**
   * Get the current value of the signal.
   *
   * @returns The current value of the signal
   */
  get(): T {
    return this.#val;
  }

  /**
   * Update the signal value.
   *
   * @param val The new value of the signal
   */
  update(val: T) {
    if (this.#val !== val) {
      this.#val = val;
      this.#e.emit(val);
    }
  }

  /**
   * Subscribe to the signal.
   *
   * @param cb The callback function to be called when the signal is updated
   * @returns A function to stop the subscription
   */
  onChange(cb: (val: T) => void): () => void {
    this.#e.on(cb);
    return () => {
      this.#e.off(cb);
    };
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
 * const stop = a.onChange((val) => {
 *   console.log(val);
 * });
 *
 * a.update(2); // 2
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
  return new Signal(value);
}
