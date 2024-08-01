// Copyright 2024 Yoshiya Hinosawa. All rights reserved. MIT license.
// Copyright 2021 Json Miller. All rights reserved. MIT license.

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = unknown> = (event: T) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = unknown> = Array<Handler<T>>;

export interface Emitter<Event extends unknown> {
  on(handler: Handler<Event>): void;
  off(handler?: Handler<Event>): void;
  emit(event: Event): void;
}

/**
 * Creates event emitter.
 * @returns {Mitt}
 */
export default function mitt<Event extends unknown>(): Emitter<Event> {
  const handlers: Handler<Event>[] = [];

  return {
    /**
     * Register an event handler.
     *
     * @param handler Function to call in response to given event
     */
    on(handler: Handler<Event>) {
      handlers.push(handler);
    },

    /**
     * Remove an event handler.
     * If `handler` is omitted, all handlers of the given type are removed.
     *
     * @param handler Handler function to remove
     */
    off<Key extends keyof Event>(handler?: Handler<Event>) {
      if (handler) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      } else {
        handlers.length = 0;
      }
    },

    /**
     * Invoke all handlers for the given type.
     *
     * @param evt Any value (object is recommended and powerful), passed to each handler
     */
    emit(evt: Event) {
      handlers
        .slice()
        .map((handler) => {
          handler(evt);
        });
    },
  };
}
