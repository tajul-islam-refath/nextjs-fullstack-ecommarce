import { DeliveryCostManagementClient } from "@/components/delivery/DeliveryCostManagementClient";
import { getDeliveryCostsAction } from "@/lib/actions/delivery";
import { cookies } from "next/headers";

export const metadata = {
  title: "Delivery Costs | Admin Dashboard",
  description: "Manage delivery costs for different zones",
};

export default async function DeliveryPage() {
  // Access cookies to make this route dynamic.
  // This is required because the database interaction (Prisma) accesses system time
  // (e.g. for connection pooling or default timestamps), which Next.js detects
  // and throws an error if the page is statically rendered.
  await cookies();

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <DeliveryContent />
    </div>
  );
}

async function DeliveryContent() {
  const result = await getDeliveryCostsAction();

  const deliveryCosts = result.success ? result.data : [];

  return <DeliveryCostManagementClient initialCosts={deliveryCosts} />;
}
