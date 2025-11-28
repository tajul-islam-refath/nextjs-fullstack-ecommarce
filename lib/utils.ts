import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { currencyConfig } from "@/lib/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Prisma Decimal object to a plain JavaScript number
 * @param value - The value to convert (can be Decimal, number, or other types)
 * @returns A number (0 if null/undefined)
 */
export function toNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "object" && "toNumber" in value
    ? value.toNumber()
    : Number(value);
}

/**
 * Converts a Prisma Decimal object to a plain JavaScript number or null
 * @param value - The value to convert (can be Decimal, number, null, or other types)
 * @returns A number or null
 */
export function toOptionalNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
  return typeof value === "object" && "toNumber" in value
    ? value.toNumber()
    : Number(value);
}

/**
 * Formats a number as a price string with the configured currency
 * @param price - The price to format
 * @returns Formatted price string (e.g. "BDT 1,200.00")
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return "";

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat(currencyConfig.locale, {
    style: "currency",
    currency: currencyConfig.code,
    minimumFractionDigits: 2,
  }).format(numericPrice);
}
