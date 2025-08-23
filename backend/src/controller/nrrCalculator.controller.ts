import { NRRCalculatorService } from "@/services/nrr.service";
import { ResponseType } from "@/types/responseType";
const nrrService = new NRRCalculatorService();
export class NRRCalculatorController {
  async getPointTable(): Promise<ResponseType> {
    const pointTable = await import("../data/PointTable2022.json");
    try {
      return {
        message: "Point Table Fetched Successfully",
        statusCode: 200,
        success: true,
        data: pointTable?.default,
      };
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }

  async calculateNrr(data: any): Promise<ResponseType> {
    try {
      const scenario = await nrrService.computeScenario(data);
      return {
        message: "NRR",
        statusCode: 200,
        success: true,
        data: scenario,
      };
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }
}
