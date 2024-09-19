// Copyright 2024 Yoshiya Hinosawa. All rights reserved. MIT license.

import { assertSpyCall, assertSpyCalls, spy } from "@std/testing/mock"
import { assertEquals } from "@std/assert/equals"
import { GroupSignal, Signal } from "./mod.ts"

Deno.test("new Signal() creates Signal", () => {
  const s = new Signal(1)

  assertEquals(s.get(), 1)

  const cb = spy()

  const stop = s.onChange(cb)

  assertSpyCalls(cb, 0)

  s.update(2)
  assertSpyCalls(cb, 1)
  assertSpyCall(cb, 0, { args: [2] })

  s.update(3)
  assertSpyCalls(cb, 2)
  assertSpyCall(cb, 1, { args: [3] })

  s.update(3)
  assertSpyCalls(cb, 2)

  s.update(4)
  assertSpyCalls(cb, 3)
  assertSpyCall(cb, 2, { args: [4] })

  stop()

  s.update(5)
  assertSpyCalls(cb, 3)
})

Deno.test("new GroupSignal() creates Signal with object", () => {
  const s = new GroupSignal({ x: 0, y: 0 })

  assertEquals(s.get(), { x: 0, y: 0 })

  const cb = spy()

  const stop = s.onChange(cb)

  assertSpyCalls(cb, 0)

  s.update({ x: 1, y: 0 })

  assertSpyCalls(cb, 1)
  assertSpyCall(cb, 0, { args: [{ x: 1, y: 0 }] })

  s.update({ x: 1, y: 0 })

  assertSpyCalls(cb, 1)

  stop()
})

Deno.test("signal().subscribe()", () => {
  const s = new Signal(1)
  const cb = spy()

  const stop = s.subscribe(cb)

  assertSpyCalls(cb, 1)
  assertSpyCall(cb, 0, { args: [1] })

  s.update(2)

  assertSpyCalls(cb, 2)
  assertSpyCall(cb, 1, { args: [2] })

  s.update(3)

  assertSpyCalls(cb, 3)
  assertSpyCall(cb, 2, { args: [3] })

  stop()

  s.update(4)

  assertSpyCalls(cb, 3)
})

Deno.test("new Signal().map() maps signal into another signal", () => {
  const s = new Signal(1)
  const t = s.map((x) => x + 1)

  const cb = spy()

  const stop = t.onChange(cb)

  assertSpyCalls(cb, 0)

  s.update(2)

  assertSpyCalls(cb, 1)
  assertSpyCall(cb, 0, { args: [3] })

  s.update(3)

  assertSpyCalls(cb, 2)
  assertSpyCall(cb, 1, { args: [4] })

  stop()
})
Deno.test("new GroupSignal().map() maps signal into another signal", () => {
  const s = new GroupSignal({ x: 1, y: 2 })
  const t = s.map((x) => ({ x: x.x + 1, y: x.y + 1 }))

  const cb = spy()

  const stop = t.onChange(cb)

  assertSpyCalls(cb, 0)

  s.update({ x: 2, y: 3 })

  assertSpyCalls(cb, 1)
  assertSpyCall(cb, 0, { args: [{ x: 3, y: 4 }] })

  s.update({ x: 3, y: 4 })

  assertSpyCalls(cb, 2)
  assertSpyCall(cb, 1, { args: [{ x: 4, y: 5 }] })

  stop()
})
