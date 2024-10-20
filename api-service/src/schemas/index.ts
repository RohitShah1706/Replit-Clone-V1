import { z } from "zod";

const projectCreateSchema = z.object({
  body: z.object({
    language: z.enum(["node", "python"], {
      required_error: "language is required",
    }),
  }),
});

export { projectCreateSchema };
