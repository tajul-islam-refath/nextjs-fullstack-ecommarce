"use client";

import { useState } from "react";
import { DeliveryZone } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDeliveryCostAction } from "@/lib/actions/delivery";
import { toast } from "sonner";
import { Truck, MapPin } from "lucide-react";

interface DeliveryCostData {
  id: string;
  zone: DeliveryZone;
  cost: number;
}

interface DeliveryCostManagementClientProps {
  initialCosts: DeliveryCostData[];
}

const zoneLabels: Record<DeliveryZone, string> = {
  INSIDE_DHAKA: "Inside Dhaka",
  OUTSIDE_DHAKA: "Outside Dhaka",
};

const zoneDescriptions: Record<DeliveryZone, string> = {
  INSIDE_DHAKA: "Delivery within Dhaka city area",
  OUTSIDE_DHAKA: "Delivery outside Dhaka city area",
};

export function DeliveryCostManagementClient({
  initialCosts,
}: DeliveryCostManagementClientProps) {
  const [costs, setCosts] = useState<DeliveryCostData[]>(initialCosts);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (zone: DeliveryZone, currentCost: number) => {
    setEditingZone(zone);
    setEditValue(currentCost.toString());
  };

  const handleCancel = () => {
    setEditingZone(null);
    setEditValue("");
  };

  const handleUpdate = async (zone: DeliveryZone) => {
    const cost = parseFloat(editValue);

    if (isNaN(cost) || cost <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateDeliveryCostAction(zone, { cost });

      if (result.success) {
        // Update local state
        setCosts((prev) =>
          prev.map((item) =>
            item.zone === zone ? { ...item, cost: result.data.cost } : item
          )
        );
        toast.success(`${zoneLabels[zone]} delivery cost updated successfully`);
        setEditingZone(null);
        setEditValue("");
      } else {
        toast.error(result.error || "Failed to update delivery cost");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Truck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Delivery Costs</h1>
          <p className="text-slate-600 mt-1">
            Manage delivery charges for different zones
          </p>
        </div>
      </div>

      {/* Delivery Cost Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {costs.map((item) => {
          const isEditing = editingZone === item.zone;

          return (
            <Card
              key={item.zone}
              className="border-2 hover:border-blue-200 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {zoneLabels[item.zone]}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {zoneDescriptions[item.zone]}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`cost-${item.zone}`}>
                        Delivery Cost (BDT)
                      </Label>
                      <Input
                        id={`cost-${item.zone}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Enter delivery cost"
                        className="text-lg font-semibold"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate(item.zone)}
                        disabled={isUpdating}
                        className="flex-1"
                      >
                        {isUpdating ? "Updating..." : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isUpdating}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-slate-900">
                        ৳{item.cost.toFixed(2)}
                      </span>
                      <span className="text-slate-500">BDT</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(item.zone, item.cost)}
                      className="w-full"
                    >
                      Update Cost
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="p-2 bg-blue-100 rounded-full">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900">
                About Delivery Zones
              </h3>
              <p className="text-sm text-blue-800">
                There are two fixed delivery zones:{" "}
                <strong>Inside Dhaka</strong> and <strong>Outside Dhaka</strong>
                . You can only update the delivery cost for each zone. These
                costs will be applied during checkout based on the customer's
                delivery location.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
