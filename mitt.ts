// Copyright 2024 Yoshiya Hinosawa. All rights reserved. MIT license.
// Copyright 2024 Yoshiya Hinosawa. All rights reserved. MIT license.

export type EventType = string;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = unknown> = (event: T) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = unknown> = Array<Handler<T>>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
  keyof Events,
  EventHandlerList<Events[keyof Events]>
>;

export interface Emitter<Events extends Record<EventType, unknown>> {
  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;

  off<Key extends keyof Events>(
    type: Key,
    handler?: Handler<Events[Key]>,
  ): void;

  emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
export default function mitt<
  Events extends Record<EventType, unknown>,
>(): Emitter<Events> {
  const all = new Map();

  return {
    /**
     * Register an event handler for the given type.
     * @param type Type of event to listen for, or `'*'` for all events
     * @param handler Function to call in response to given event
     */
    on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
      const handlers: Array<Handler<Events[Key]>> | undefined = all.get(type);
      if (handlers) {
        handlers.push(handler);
      } else {
        all!.set(type, [handler] as EventHandlerList<Events[Key]>);
      }
    },

    /**
     * Remove an event handler for the given type.
     * If `handler` is omitted, all handlers of the given type are removed.
     * @param type Type of event to unregister `handler` from (`'*'` to remove a wildcard handler)
     * @param handler Handler function to remove
     */
    off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>) {
      const handlers: Array<Handler<Events[Key]>> | undefined = all.get(type);
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          all!.set(type, []);
        }
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `'*'` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing '*' handlers is not supported.
     *
     * @param type The event type to invoke
     * @param [evt] Any value (object is recommended and powerful), passed to each handler
     */
    emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
      const handlers = all.get(type);
      if (handlers) {
        (handlers as EventHandlerList<Events[keyof Events]>)
          .slice()
          .map((handler) => {
            handler(evt!);
          });
      }
    },
  };
}
