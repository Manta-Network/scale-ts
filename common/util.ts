import type { DecodeBuffer } from "./buffer.ts"
import type { AnyCodec } from "./codec.ts"

export abstract class ScaleError extends Error {
  constructor(readonly codec: AnyCodec, message: string) {
    super(message)
  }
}

export class ScaleAssertError extends ScaleError {
  override readonly name = "ScaleAssertError"
  constructor(codec: AnyCodec, readonly value: unknown, message: string) {
    super(codec, message)
  }
}

export class ScaleEncodeError extends ScaleError {
  override readonly name = "ScaleEncodeError"
  constructor(codec: AnyCodec, readonly value: unknown, message: string) {
    super(codec, message)
  }
}

export class ScaleDecodeError extends ScaleError {
  override readonly name = "ScaleDecodeError"
  constructor(codec: AnyCodec, readonly buffer: DecodeBuffer, message: string) {
    super(codec, message)
  }
}

export type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never
export type U2I<U> = (U extends U ? (u: U) => 0 : never) extends (i: infer I) => 0 ? Extract<I, U> : never

type _Narrow<T, U> = [U] extends [T] ? U : Extract<T, U>
export type Narrow<T = unknown> =
  | _Narrow<T, 0 | number & {}>
  | _Narrow<T, 0n | bigint & {}>
  | _Narrow<T, "" | string & {}>
  | _Narrow<T, boolean>
  | _Narrow<T, symbol>
  | _Narrow<T, []>
  | _Narrow<T, { [_: PropertyKey]: Narrow }>
  | (T extends object ? { [K in keyof T]: Narrow<T[K]> } : never)
  | Extract<{} | null | undefined, T>
