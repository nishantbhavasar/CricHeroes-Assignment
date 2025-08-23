export interface Team {
  team: string;
  matches: number;
  won: number;
  lost: number;
  nrr: number;
  forRuns: number;
  forOvers: string;
  againstRuns: number;
  againstOvers: string;
  points: number;
}

export interface NrrCalculatorPayloadType {
  your_team: string;
  opp_team: string;
  match_overs: number;
  desired_position: number;
  toss_result: string;
  runs_scored_chase: number;
}
