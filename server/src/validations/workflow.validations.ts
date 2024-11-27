import Joi from "joi";

export const userIdSchema = Joi.string().required().label("User ID");
