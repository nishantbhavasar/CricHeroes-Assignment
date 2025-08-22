export interface Team {
  team: string
  matches:number
  won:number
  lost:number
  nrr: number
  forRuns:number
  forOvers: number|string;
  againstRuns:number
  againstOvers: number|string;
  points:number
}
