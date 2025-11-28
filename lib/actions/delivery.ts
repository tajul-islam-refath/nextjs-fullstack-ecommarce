"use server";

import { DeliveryZone } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { DeliveryService } from "@/lib/service/delivery.service";
import {
  updateDeliveryCostSchema,
  deliveryZoneSchema,
} from "@/lib/validations/delivery";
import { ActionResult, withAdmin } from "@/lib/auth-utils";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";

/**
 * Get all delivery costs
 * Public action - anyone can view delivery costs
 */
export async function getDeliveryCostsAction(): Promise<
  ActionResult<Array<{ zone: DeliveryZone; cost: number; id: string }>>
> {
  try {
    const deliveryService = new DeliveryService(prisma);

    // Initialize if not exists
    await deliveryService.initializeDeliveryCosts();

    const costs = await deliveryService.getAllDeliveryCosts();

    // Convert Decimal to number for serialization
    const serializedCosts = costs.map((cost) => ({
      id: cost.id,
      zone: cost.zone,
      cost: Number(cost.cost),
    }));

    return {
      success: true,
      data: serializedCosts,
    };
  } catch (error) {
    console.error("Error fetching delivery costs:", error);
    return { success: false, error: "Failed to fetch delivery costs" };
  }
}

/**
 * Get delivery cost by zone
 * Public action
 */
export async function getDeliveryCostByZoneAction(
  zone: string
): Promise<ActionResult<{ zone: DeliveryZone; cost: number } | null>> {
  try {
    const validatedZone = deliveryZoneSchema.parse(zone);
    const deliveryService = new DeliveryService(prisma);
    const cost = await deliveryService.getDeliveryCostByZone(validatedZone);

    if (!cost) {
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: {
        zone: cost.zone,
        cost: Number(cost.cost),
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error fetching delivery cost:", error);
    return { success: false, error: "Failed to fetch delivery cost" };
  }
}

/**
 * Update delivery cost
 * Protected: Admin only
 */
export const updateDeliveryCostAction = withAdmin(
  async (
    zone: string,
    data: unknown
  ): Promise<ActionResult<{ zone: DeliveryZone; cost: number }>> => {
    try {
      const validatedZone = deliveryZoneSchema.parse(zone);
      const validated = updateDeliveryCostSchema.parse(data);
      const deliveryService = new DeliveryService(prisma);

      const updated = await deliveryService.updateDeliveryCost(
        validatedZone,
        validated.cost
      );

      revalidatePath("/admin/delivery");
      revalidatePath("/api/delivery");

      return {
        success: true,
        data: {
          zone: updated.zone,
          cost: Number(updated.cost),
        },
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      console.error("Error updating delivery cost:", error);
      return { success: false, error: "Failed to update delivery cost" };
    }
  }
);

/**
 * Initialize delivery costs with default values
 * Protected: Admin only
 */
export const initializeDeliveryCostsAction = withAdmin(
  async (): Promise<
    ActionResult<Array<{ zone: DeliveryZone; cost: number }>>
  > => {
    try {
      const deliveryService = new DeliveryService(prisma);
      const initialized = await deliveryService.initializeDeliveryCosts();

      const serialized = initialized.map((cost) => ({
        zone: cost.zone,
        cost: Number(cost.cost),
      }));

      revalidatePath("/admin/delivery");

      return {
        success: true,
        data: serialized,
      };
    } catch (error) {
      console.error("Error initializing delivery costs:", error);
      return { success: false, error: "Failed to initialize delivery costs" };
    }
  }
);
