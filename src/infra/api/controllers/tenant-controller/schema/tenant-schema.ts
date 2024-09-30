import { z } from "zod";

export const tenantCreate = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const tenantUpdate = z.object({
  body: z.object({
    name: z.string(),
  }),
  params: z.object({
    id: z.string(),
  }),
});