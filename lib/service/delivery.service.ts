import {
  PrismaClient,
  Prisma,
  DeliveryZone,
} from "@/app/generated/prisma/client";

export class DeliveryService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get all delivery costs
   */
  async getAllDeliveryCosts() {
    return this.prisma.deliveryCost.findMany({
      orderBy: { zone: "asc" },
    });
  }

  /**
   * Get delivery cost by zone
   */
  async getDeliveryCostByZone(zone: DeliveryZone) {
    return this.prisma.deliveryCost.findUnique({
      where: { zone },
    });
  }

  /**
   * Update delivery cost for a zone
   */
  async updateDeliveryCost(zone: DeliveryZone, cost: number) {
    // Use upsert to create if not exists, update if exists
    return this.prisma.deliveryCost.upsert({
      where: { zone },
      update: { cost },
      create: {
        zone,
        cost,
      },
    });
  }

  /**
   * Initialize delivery costs with default values if they don't exist
   */
  async initializeDeliveryCosts() {
    const zones: DeliveryZone[] = ["INSIDE_DHAKA", "OUTSIDE_DHAKA"];
    const defaultCosts = {
      INSIDE_DHAKA: 60,
      OUTSIDE_DHAKA: 120,
    };

    const results = [];
    for (const zone of zones) {
      const existing = await this.getDeliveryCostByZone(zone);
      if (!existing) {
        const created = await this.prisma.deliveryCost.create({
          data: {
            zone,
            cost: defaultCosts[zone],
          },
        });
        results.push(created);
      } else {
        results.push(existing);
      }
    }

    return results;
  }
}
