import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

// ! generic middleware to verify the schema of the request body
export const validateSchema =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      res.status(400).json(error);
    }
  };
