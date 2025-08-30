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
      // Q-1a: Check restrict runs range and NRR range
      expect(res.result.restrictRunsRange).toEqual([69, 119]);
      expect(res.result.revisedNRRRange).not.toBeNull();
      if (res.result.revisedNRRRange) {
        expect(res.result.revisedNRRRange[0]).toBeCloseTo(0.278, 2);
        expect(res.result.revisedNRRRange[1]).toBeCloseTo(0.596, 2);
      }
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
      // Q-1b: Check chase overs range and NRR range
      expect(res.result.chaseOversRange).toEqual(["14.2", "20"]);
      expect(res.result.revisedNRRRange).not.toBeNull();
      if (res.result.revisedNRRRange) {
        expect(res.result.revisedNRRRange[0]).toBeCloseTo(0.278, 2);
        expect(res.result.revisedNRRRange[1]).toBeCloseTo(0.595, 2);
      }
    });
    test("Q-2c: Batting first vs RCB", async () => {
      const res = await nrrService.computeScenario({
        your_team: "Rajasthan Royals",
        opp_team: "Royal Challengers Bangalore",
        match_overs: 20,
        desired_position: 3,
        toss_result: "batting_first",
        runs_scored_chase: 80
      });
      expect(res.result.restrictRunsRange).toEqual([57, 70]);
      expect(res.result.revisedNRRRange).not.toBeNull();
      if (res.result.revisedNRRRange) {
        expect(res.result.revisedNRRRange[0]).toBeCloseTo(0.32, 2);
        expect(res.result.revisedNRRRange[1]).toBeCloseTo(0.402, 2);
      }
    });
    test("Q-2d: Bowling first vs RCB", async () => {
      const res = await nrrService.computeScenario({
        your_team: "Rajasthan Royals",
        opp_team: "Royal Challengers Bangalore",
        match_overs: 20,
        desired_position: 3,
        toss_result: "bowling_first",
        runs_scored_chase: 79
      });
      expect(res.result.chaseOversRange).toEqual(["17.2", "18.5"]);
      expect(res.result.revisedNRRRange).not.toBeNull();
      if (res.result.revisedNRRRange) {
        expect(res.result.revisedNRRRange[0]).toBeCloseTo(0.324, 2);
        expect(res.result.revisedNRRRange[1]).toBeCloseTo(0.404, 2);
      }
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
