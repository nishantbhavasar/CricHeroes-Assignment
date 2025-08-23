export interface NrrFormData {
  your_team:string,
  opp_team:string,
  match_overs:number,
  desired_position:number,
  toss_result:string,
  runs_scored_chase:number
}
export interface NrrResponseType {
  mode: "batting-first" | "bowling-first";
  inputs: {
    your_team: string;
    opp_team: string;
    match_overs: string;
    desired_position: string;
    runs_scored_chase: string;
  };
  result: {
    statement: string;
    restrictRunsRange: number[];
    chaseOversRange: number[];
    revisedNRRRange: number[];
  };
}
