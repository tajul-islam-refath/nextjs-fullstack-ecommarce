import { z } from "zod";
import { deliveryZoneSchema } from "./delivery";

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerMobile: z
    .string()
    .min(11, "Mobile number must be at least 11 characters"),
  customerAddress: z.string().min(10, "Address must be at least 10 characters"),
  deliveryZone: deliveryZoneSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const getOrdersSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  status: z
    .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
});

export type GetOrdersInput = z.infer<typeof getOrdersSchema>;
