"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

// Types (mirrored from ProductInfo for now, but should ideally be shared)
interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
  options: any; // JSON value
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  salePrice: number | null;
  stock: number;
  hasVariants: boolean;
  variants: Variant[];
  variantOptions: any[];
}

interface ProductContextType {
  product: Product;
  selectedVariant: Variant | null;
  selectedOptions: Record<string, string>;
  quantity: number;
  currentPrice: number;
  originalPrice: number;
  currentStock: number;
  isOutOfStock: boolean;
  setQuantity: (qty: number) => void;
  handleOptionChange: (optionName: string, value: string) => void;
  addToCart: () => void;
  buyNow: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: React.ReactNode;
  product: Product;
}

export function ProductProvider({ children, product }: ProductProviderProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Initialize selected variant if product has variants
  useEffect(() => {
    if (product.hasVariants && product.variants.length > 0) {
      if (Object.keys(selectedOptions).length === 0) {
        const firstVariant = product.variants[0];
        if (firstVariant && typeof firstVariant.options === "object") {
          setSelectedOptions(firstVariant.options);
          setSelectedVariant(firstVariant);
        }
      }
    }
  }, [product.hasVariants, product.variants, selectedOptions]);

  // Determine current price and stock
  const currentPrice = useMemo(() => {
    return selectedVariant
      ? Number(selectedVariant.salePrice || selectedVariant.price)
      : Number(product.salePrice || product.basePrice);
  }, [selectedVariant, product]);

  const originalPrice = useMemo(() => {
    return selectedVariant
      ? Number(selectedVariant.price)
      : Number(product.basePrice);
  }, [selectedVariant, product]);

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);

    console.log("🔍 Debugging variant matching:");
    console.log("Selected options:", newOptions);
    console.log("All variants:", product.variants);

    // Find matching variant
    if (product.hasVariants) {
      const variant = product.variants.find((v) => {
        // Parse options if it's a string (from JSON field in database)
        let vOptions: Record<string, string>;
        if (typeof v.options === "string") {
          try {
            vOptions = JSON.parse(v.options);
          } catch (e) {
            console.error("Failed to parse variant options:", v.options);
            return false;
          }
        } else {
          vOptions = v.options as Record<string, string>;
        }

        console.log("Checking variant:", v.name, "with options:", vOptions);

        // Check if both objects have the same keys
        const vOptionKeys = Object.keys(vOptions).sort();
        const newOptionKeys = Object.keys(newOptions).sort();

        console.log("Variant keys:", vOptionKeys);
        console.log("Selected keys:", newOptionKeys);

        if (vOptionKeys.length !== newOptionKeys.length) {
          console.log("❌ Key length mismatch");
          return false;
        }

        if (!vOptionKeys.every((key, index) => key === newOptionKeys[index])) {
          console.log("❌ Keys don't match");
          return false;
        }

        // Check if all values match
        const valuesMatch = Object.entries(newOptions).every(
          ([key, val]) => vOptions[key] === val
        );

        console.log("Values match:", valuesMatch);

        return valuesMatch;
      });

      console.log("✅ Found variant:", variant);
      setSelectedVariant(variant || null);
    }
  };

  console.log("Selected variant", selectedVariant);

  const addToCart = () => {
    console.log("Add to cart", {
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
    // Implement actual cart logic here
  };

  const buyNow = () => {
    console.log("Buy now", {
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
    // Implement checkout redirect here
  };

  const value = {
    product,
    selectedVariant,
    selectedOptions,
    quantity,
    currentPrice,
    originalPrice,
    currentStock,
    isOutOfStock,
    setQuantity,
    handleOptionChange,
    addToCart,
    buyNow,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}
