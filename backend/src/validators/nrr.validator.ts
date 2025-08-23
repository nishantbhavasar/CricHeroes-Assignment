import joi from "joi";

export const calculateNrrSchemaValidate = joi.object({
  your_team: joi.string().trim(true).required(),
  opp_team: joi.string().trim(true).required(),
  match_overs: joi.number().required(),
  desired_position: joi.number().required(),
  toss_result: joi.string().trim(true).required(),
  runs_scored_chase: joi.number().required(),
});
