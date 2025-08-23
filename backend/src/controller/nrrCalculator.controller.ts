import { ResponseType } from "@/types/responseType";

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
      return {
        message: "NRR",
        statusCode: 200,
        success: true,
        data: 1,
      };
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }
}
