export interface Point {
  readonly x: number
  readonly y: number
}

export type Axis = 'x' | 'y'

export interface Sample {
  readonly count: number
  readonly burnin: boolean
  readonly current: Point
  readonly next: Point
  readonly result: SampleResult
}

export type SampleResult = 'accepted' | 'rejected'
