import Joi from "joi";
import { get_user_workflows } from "../services/workflow";
import { Request, Response } from "express";
import { userIdSchema } from "../validations/workflow.validations";

export async function get_workflows(req: Request, res: Response): Promise<any> {
  const { user_id } = req.params;
  const { error } = userIdSchema.validate(user_id);

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      error: error.details.map((err) => err.message),
    });
  }
  try {
    const workflows = await get_user_workflows(user_id); //[@TODO] Add interface for workflows

    return res.status(200).json({
      message: "Workflows fetched successfully",
      data: workflows,
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return res.status(500).json({ error: "Failed to fetch workflows" });
  }
}
