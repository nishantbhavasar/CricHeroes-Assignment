import { NRRCalculatorController } from "@/controller/nrrCalculator.controller";
import { generateResponse } from "@/helpers/generateResponse";
import { Router } from "express";
const nrrRouter = Router();
const nrrController = new NRRCalculatorController();

nrrRouter.get("/point-table", async (req, res, next) => {
  try {
    const response = await nrrController.getPointTable();
    generateResponse({
      res,
      ...response,
    });
  } catch (e: any) {
    next(e);
  }
});

nrrRouter.post("/calculate-nrr", async (req, res, next) => {
  try {
    const response = await nrrController.calculateNrr(req.body);
    generateResponse({
      res,
      ...response,
    });
  } catch (e: any) {
    next(e);
  }
});

export default nrrRouter;
