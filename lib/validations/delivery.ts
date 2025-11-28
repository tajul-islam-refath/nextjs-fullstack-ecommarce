import { z } from "zod";

/**
 * Delivery Cost Validation Schemas
 */

// Delivery zone enum
export const deliveryZoneSchema = z.enum(["INSIDE_DHAKA", "OUTSIDE_DHAKA"]);

export type DeliveryZone = z.infer<typeof deliveryZoneSchema>;

// Update delivery cost schema (admin can only update the cost)
export const updateDeliveryCostSchema = z.object({
  cost: z.coerce.number().positive("Cost must be a positive number"),
});

export type UpdateDeliveryCostInput = z.infer<typeof updateDeliveryCostSchema>;

// Get delivery costs query schema
export const getDeliveryCostsQuerySchema = z.object({
  zone: deliveryZoneSchema.optional(),
});

export type GetDeliveryCostsQuery = z.infer<typeof getDeliveryCostsQuerySchema>;
