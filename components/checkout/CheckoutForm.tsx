"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema, CreateOrderInput } from "@/lib/validations/order";
import { placeOrder } from "@/lib/actions/order";
import { DeliveryZone } from "@/app/generated/prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DeliveryCost {
  zone: DeliveryZone;
  cost: number;
}

interface CheckoutFormProps {
  deliveryCosts: DeliveryCost[];
  onZoneChange: (zone: DeliveryZone | undefined) => void;
}

export function CheckoutForm({
  deliveryCosts,
  onZoneChange,
}: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      customerMobile: "",
      customerAddress: "",
    },
  });

  async function onSubmit(data: CreateOrderInput) {
    setIsSubmitting(true);
    try {
      const result = await placeOrder(data);
      if (result.success) {
        toast.success("Order placed successfully!");
        router.push(`/checkout/success/${result.data.orderId}`);
      } else {
        toast.error(result.error || "Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Zone</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      onZoneChange(value as DeliveryZone);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deliveryCosts.map((dc) => (
                        <SelectItem key={dc.zone} value={dc.zone}>
                          {dc.zone.replace("_", " ")} - ৳{dc.cost}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
