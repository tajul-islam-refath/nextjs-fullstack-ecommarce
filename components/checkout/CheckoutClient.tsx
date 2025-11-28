"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema, CreateOrderInput } from "@/lib/validations/order";
import { placeOrder } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { DeliveryZone } from "@/lib/validations/delivery";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    salePrice: number | null;
    basePrice: number;
    images: { url: string }[];
  };
  variant?: {
    name: string;
    price: number;
  } | null;
}

interface DeliveryCost {
  zone: DeliveryZone;
  cost: number;
}

interface CheckoutClientProps {
  cartItems: CartItem[];
  deliveryCosts: DeliveryCost[];
}

export default function CheckoutClient({
  cartItems,
  deliveryCosts,
}: CheckoutClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | undefined>(
    undefined
  );

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      customerMobile: "",
      customerAddress: "",
    },
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant
      ? Number(item.variant.price)
      : Number(item.product.salePrice || item.product.basePrice);
    return sum + price * item.quantity;
  }, 0);

  const deliveryCost = selectedZone
    ? deliveryCosts.find((d) => d.zone === selectedZone)?.cost || 0
    : 0;

  const total = subtotal + deliveryCost;

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
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Checkout
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete your order details below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Shipping Details */}
              <div className="lg:col-span-7 space-y-6">
                <Card className="border-none shadow-md overflow-hidden">
                  <CardHeader className="bg-white border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Shipping Information
                        </CardTitle>
                        <CardDescription>
                          Enter your delivery details
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 bg-white">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="Enter your full name"
                                className="pl-10 h-11"
                                {...field}
                              />
                            </div>
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
                            <div className="relative">
                              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="Enter your mobile number"
                                className="pl-10 h-11"
                                {...field}
                              />
                            </div>
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
                            <div className="relative">
                              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              <Input
                                placeholder="Enter your full address"
                                className="pl-10 h-11"
                                {...field}
                              />
                            </div>
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
                              setSelectedZone(value as DeliveryZone);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="Select delivery zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deliveryCosts.map((dc) => (
                                <SelectItem key={dc.zone} value={dc.zone}>
                                  <div className="flex items-center justify-between w-full min-w-[200px]">
                                    <span>{dc.zone.replace(/_/g, " ")}</span>
                                    <span className="font-medium text-primary">
                                      ৳{dc.cost}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-md sticky top-8">
                  <CardHeader className="bg-gray-50/50 border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {cartItems.map((item) => {
                        const price = item.variant
                          ? Number(item.variant.price)
                          : Number(
                              item.product.salePrice || item.product.basePrice
                            );
                        return (
                          <div key={item.id} className="flex gap-4 py-2">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-white">
                              {item.product.images[0]?.url ? (
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                  <ShoppingBag className="h-6 w-6 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col justify-center">
                              <h3 className="font-medium text-sm line-clamp-1">
                                {item.product.name}
                              </h3>
                              {item.variant && (
                                <p className="text-xs text-muted-foreground">
                                  Variant: {item.variant.name}
                                </p>
                              )}
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                                <p className="font-medium text-sm">
                                  ৳{(price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          ৳{subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium">
                          {selectedZone
                            ? `৳${deliveryCost.toFixed(2)}`
                            : "Calculated at next step"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-base font-bold">Total</span>
                        <span className="text-xl font-bold text-primary">
                          ৳{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 bg-gray-50/50 border-t px-6 py-4">
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Place Order
                          <CheckCircle2 className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
