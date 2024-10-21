import { z } from "zod";

const projectCreateSchema = z.object({
  body: z.object({
    language: z.enum(["node", "python"], {
      required_error: "language is required",
    }),
  }),
});

const orchestratorStartSchema = z.object({
  body: z.object({
    projectId: z.string({
      required_error: "projectId is required",
      invalid_type_error: "projectId must be a string",
    }),
  }),
});

export { projectCreateSchema, orchestratorStartSchema };
