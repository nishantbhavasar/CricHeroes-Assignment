import { deepClone } from "@/helpers/helper";
import { ballsToOvers, oversToBalls } from "@/helpers/OverBallConvertor";
import { NrrCalculatorPayloadType, Team } from "@/types/TeamType";

export class NRRCalculatorService {
  computeNRR(
    forRuns: number,
    forOversStr: string,
    againstRuns: number,
    againstOversStr: string
  ) {
    const forBalls = oversToBalls(forOversStr);
    const againstBalls = oversToBalls(againstOversStr);
    const forOversDec = forBalls / 6;
    const againstOversDec = againstBalls / 6;
    const forRate = forOversDec > 0 ? forRuns / forOversDec : 0;
    const againstRate = againstOversDec > 0 ? againstRuns / againstOversDec : 0;
    return +(forRate - againstRate).toFixed(3);
  }

  sortStandings(table: Team[]) {
    // Sorting table based on nrr or points
    const enriched = table.map((t) => ({
      ...t,
      nrr: this.computeNRR(
        t.forRuns,
        t.forOvers,
        t.againstRuns,
        t.againstOvers
      ),
    }));
    enriched.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.nrr - a.nrr;
    });
    return enriched;
  }

  addOvers(existing: number, add: string) {
    const total = oversToBalls(existing) + oversToBalls(add);
    return ballsToOvers(total);
  }

  applyMatch(
    table: Team[],
    {
      teamA,
      teamB,
      match_overs,
      aRuns,
      aBalls,
      bRuns,
      bBalls,
    }: {
      teamA: string;
      teamB: string;
      match_overs: number;
      aRuns: number;
      aBalls: number;
      bRuns: number;
      bBalls: number;
    }
  ) {
    const t = deepClone(table);
    const A = t.find((x: Team) => x.team === teamA);
    const B = t.find((x: Team) => x.team === teamB);
    if (!A || !B) throw new Error("Team not found in table");

    // Update matches
    A.matches += 1;
    B.matches += 1;

    const aOversStr = ballsToOvers(aBalls);
    const bOversStr = ballsToOvers(bBalls);

    // A team
    A.forRuns += aRuns;
    A.forOvers = this.addOvers(A.forOvers, aOversStr);
    A.againstRuns += bRuns;
    A.againstOvers = this.addOvers(A.againstOvers, bOversStr);

    // B team
    B.forRuns += bRuns;
    B.forOvers = this.addOvers(B.forOvers, bOversStr);
    B.againstRuns += aRuns;
    B.againstOvers = this.addOvers(B.againstOvers, aOversStr);

    // Decide winner and give them point (win point = 2) (tie point = 1)
    if (aRuns > bRuns) {
      A.won += 1;
      B.lost += 1;
      A.points += 2;
    } else if (bRuns > aRuns) {
      B.won += 1;
      A.lost += 1;
      B.points += 2;
    } else {
      // tie
      A.points += 1;
      B.points += 1;
    }

    return this.sortStandings(t);
  }

  findPosition(table: Team[], teamName: string) {
    const pos = table.findIndex((x: Team) => x.team === teamName);
    return pos >= 0 ? pos + 1 : -1;
  }

  boundarySearch(low: number, high: number, condition: Function, dir = "max") {
    if (dir === "max") {
      // Find the maximum value where condition is true
      for (let i = high; i >= low; i--) {
        if (condition(i)) {
          return i;
        }
      }
    } else {
      // Find the minimum value where condition is true
      for (let i = low; i <= high; i++) {
        if (condition(i)) {
          return i;
        }
      }
    }
    return null;
  }

  async computeScenario({
    your_team,
    opp_team,
    match_overs,
    desired_position,
    toss_result,
    runs_scored_chase,
  }: NrrCalculatorPayloadType) {
    const BASE_TABLE = await import("../data/PointTable2022.json");
    const base = this.sortStandings(deepClone(BASE_TABLE?.default));
    match_overs = Number(match_overs);
    desired_position = Number(desired_position);
    runs_scored_chase = Number(runs_scored_chase);
    const ballsPerInnings = match_overs * 6;

    if (toss_result === "batting_first") {
      const aRuns = runs_scored_chase;
      const aBalls = ballsPerInnings;

      const minOppRuns = 0; // best case
      const maxOppRuns = aRuns - 1; // only for win case (tie not)
      const bBalls = ballsPerInnings;

      const condition = (oppR: number) => {
        const table = this.applyMatch(base, {
          teamA: your_team,
          teamB: opp_team,
          match_overs,
          aRuns,
          aBalls,
          bRuns: oppR,
          bBalls,
        });
        const position = this.findPosition(table, your_team);
        return position === desired_position;
      };

      const maxAllowed = this.boundarySearch(
        minOppRuns,
        Math.max(maxOppRuns, 0),
        condition,
        "max"
      );
      let range = null,
        nrrRange = null;
      if (maxAllowed !== null) {
        const minAllowed = this.boundarySearch(
          minOppRuns,
          maxAllowed,
          condition,
          "min"
        );
        range = { minOppRuns: minAllowed, maxOppRuns: maxAllowed };

        const lowTbl = this.applyMatch(base, {
          teamA: your_team,
          teamB: opp_team,
          match_overs,
          aRuns,
          aBalls,
          bRuns: maxAllowed,
          bBalls,
        });
        const highTbl = this.applyMatch(base, {
          teamA: your_team,
          teamB: opp_team,
          match_overs,
          aRuns,
          aBalls,
          bRuns: minAllowed!,
          bBalls,
        });
        const lowNrr = lowTbl?.find?.((t) => t.team === your_team)?.nrr;
        const highNrr = highTbl?.find?.((t) => t.team === your_team)?.nrr;
        nrrRange = {
          min: Math.min(lowNrr!, highNrr!),
          max: Math.max(lowNrr!, highNrr!),
        };
      }

      return {
        mode: "batting-first",
        inputs: {
          your_team,
          opp_team,
          match_overs,
          desired_position,
          runs_scored_chase,
        },
        result: range
          ? {
              statement: `If ${your_team} score ${aRuns} in ${match_overs} overs, they must restrict ${opp_team} between ${range.minOppRuns} and ${range.maxOppRuns} in ${match_overs} overs.`,
              restrictRunsRange: [range.minOppRuns, range.maxOppRuns],
              revisedNRRRange: [nrrRange?.min, nrrRange?.max],
            }
          : {
              statement: `Even if ${your_team} bowl ${opp_team} out for 0, the desired position ${desired_position} is not reachable with ${aRuns} in ${match_overs} overs.`,
              restrictRunsRange: null,
              revisedNRRRange: null,
            },
      };
    }

    if (toss_result === "bowling_first") {
      if (typeof runs_scored_chase !== "number")
        throw new Error("Provide runs when bowling first");
      const bRuns = runs_scored_chase;
      const bBalls = ballsPerInnings;

      const aTargetRuns = bRuns;
      const aRunsWin = bRuns + 1;
      const minBalls = 1;
      const maxBalls = ballsPerInnings;

      const condition = (aBalls: number) => {
        const table = this.applyMatch(base, {
          teamA: your_team,
          teamB: opp_team,
          match_overs,
          aRuns: aRunsWin,
          aBalls,
          bRuns,
          bBalls,
        });
        const position = this.findPosition(table, your_team);
        return position === desired_position;
      };

      const minBallsToAchieve = this.boundarySearch(
        minBalls,
        maxBalls,
        condition,
        "min"
      );
      const maxBallsToStillAchieve =
        minBallsToAchieve !== null
          ? this.boundarySearch(minBallsToAchieve, maxBalls, condition, "max")
          : null;

      let nrrRange = null;
      if (minBallsToAchieve !== null && maxBallsToStillAchieve !== null) {
        const tblFast = this.applyMatch(base, {
          teamA: your_team,
          teamB: opp_team,
          match_overs,
          aRuns: aRunsWin,
          aBalls: minBallsToAchieve,
          bRuns,
          bBalls,
        });
        const tblSlow = this.applyMatch(base, {
          teamA: your_team,
          teamB: opp_team,
          match_overs,
          aRuns: aRunsWin,
          aBalls: maxBallsToStillAchieve,
          bRuns,
          bBalls,
        });
        const nrrFast = tblFast?.find?.((t) => t.team === your_team)?.nrr;
        const nrrSlow = tblSlow?.find?.((t) => t.team === your_team)?.nrr;
        nrrRange = [Math.min(nrrFast!, nrrSlow!), Math.max(nrrFast!, nrrSlow!)];
      }

      return {
        mode: "bowling-first",
        inputs: {
          your_team,
          opp_team,
          match_overs,
          desired_position,
          runs_scored_chase,
        },
        result:
          minBallsToAchieve !== null && maxBallsToStillAchieve !== null
            ? {
                statement: `${your_team} should chase ${aTargetRuns} between ${ballsToOvers(
                  minBallsToAchieve
                )} and ${ballsToOvers(maxBallsToStillAchieve)} overs.`,
                chaseOversRange: [
                  ballsToOvers(minBallsToAchieve),
                  ballsToOvers(maxBallsToStillAchieve),
                ],
                revisedNRRRange: nrrRange,
              }
            : {
                statement: `Even with a fastest possible chase, desired position ${desired_position} is not reachable.`,
                chaseOversRange: null,
                revisedNRRRange: null,
              },
      };
    }

    throw new Error('toss must be "Batting First" or "Bowling First"');
  }
}
