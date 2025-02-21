import Joi from "joi";

export const webhookSchema = Joi.object({
    repo: Joi.string().required(),
    owner: Joi.string().required(),
    access_token: Joi.string().required(),
    repo_url: Joi.string().uri().required(),
    user_id: Joi.string().required(),
    additional_email: Joi.string().email().optional(),
  });

export const repositoriesSchema = Joi.object({
    access_token: Joi.string().required(),
    user_name: Joi.string().required(),
  });