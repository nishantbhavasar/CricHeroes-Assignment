import { NRRCalculatorService } from '@/services/nrr.service';
import { expect, test, describe, beforeEach } from '@jest/globals';

describe('NRRCalculatorService', () => {
  let nrrService: NRRCalculatorService;

  beforeEach(() => {
    nrrService = new NRRCalculatorService();
  });

  // describe('computeNRR', () => {
  //   test("basic math calculation", () => {
  //     expect(nrrService.computeNRR(300, "50", 250, "50")).toBe(1.0);
  //   });

  //   test("handles overs with balls parsing", () => {
  //     expect(nrrService.computeNRR(120, "20", 120, "20")).toBe(0);
  //     const v = nrrService.computeNRR(1130, "133.1", 1071, "138.5");
  //     expect(Number.isFinite(v)).toBe(true);
  //   });
  // });

  describe('computeScenario', () => {
    test("handles batting first scenario", async () => {
      const res = await nrrService.computeScenario({
        your_team: "Rajasthan Royals",
        opp_team: "Delhi Capitals",
        match_overs: 20,
        desired_position: 3,
        toss_result: "batting_first",
        runs_scored_chase: 120
      });
      
      expect(res.mode).toBe("batting-first");
      expect(res.inputs.your_team).toBe("Rajasthan Royals");
      expect(res.inputs.runs_scored_chase).toBe(120);
    });

    test("handles bowling first scenario", async () => {
      const res = await nrrService.computeScenario({
        your_team: "Rajasthan Royals",
        opp_team: "Delhi Capitals",
        match_overs: 20,
        desired_position: 3,
        toss_result: "bowling_first",
        runs_scored_chase: 119
      });
      
      expect(res.mode).toBe("bowling-first");
      expect(res.inputs.your_team).toBe("Rajasthan Royals");
      expect(res.inputs.runs_scored_chase).toBe(119);
    });

    test("throws error for invalid toss result", async () => {
      await expect(nrrService.computeScenario({
        your_team: "Rajasthan Royals",
        opp_team: "Delhi Capitals",
        match_overs: 20,
        desired_position: 3,
        toss_result: "invalid_toss",
        runs_scored_chase: 119
      } as any)).rejects.toThrow('toss must be "Batting First" or "Bowling First"');
    });
  });
});
