export interface Point {
  x: number
  y: number
}

export interface Sample {
  count: number
  burnin: boolean
  current: Point
  next: Point
  result: SampleResult
}

export type SampleResult = 'accepted' | 'rejected'
