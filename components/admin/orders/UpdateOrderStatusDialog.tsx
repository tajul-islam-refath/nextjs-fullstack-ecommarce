"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/app/generated/prisma/enums";
import { Loader2 } from "lucide-react";
import { orderConfig } from "@/lib/config";

interface UpdateOrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: OrderStatus;
  orderId: string;
  onConfirm: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  isUpdating: boolean;
}

export function UpdateOrderStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  orderId,
  onConfirm,
  isUpdating,
}: UpdateOrderStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);

  const handleConfirm = async () => {
    if (selectedStatus !== currentStatus) {
      await onConfirm(orderId, selectedStatus);
    }
  };

  const currentConfig = orderConfig.statusDisplay[currentStatus];
  const selectedConfig = orderConfig.statusDisplay[selectedStatus];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the status of this order. This will update the order tracking
            information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Current Status
            </label>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-medium text-slate-900">
                {currentConfig?.label}
              </div>
              <div className="text-xs text-slate-500">
                {currentConfig?.description}
              </div>
            </div>
          </div>

          {/* New Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              New Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(orderConfig.statusDisplay).map(
                  ([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex flex-col">
                        <span className="font-medium">{config.label}</span>
                        <span className="text-xs text-slate-500">
                          {config.description}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {selectedStatus !== currentStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-900">
                <span className="font-medium">Status will change:</span>
                <div className="mt-1">
                  {currentConfig?.label} → {selectedConfig?.label}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isUpdating || selectedStatus === currentStatus}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
