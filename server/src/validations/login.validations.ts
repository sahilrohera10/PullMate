import Joi from "joi";

export const codeSchema = Joi.object({
    code: Joi.string().required().label("Authorization Code"),
  });