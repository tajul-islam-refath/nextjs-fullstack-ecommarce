"use client";

import { useState, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateProductInput } from "@/lib/validations/product";

export function ProductVariants() {
  const { control, watch, setValue } = useFormContext<CreateProductInput>();

  // Manage Variant Options (e.g. Color, Size)
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "variantOptions",
  });

  // Manage Generated Variants
  const { fields: variantFields, replace: replaceVariants } = useFieldArray({
    control,
    name: "variants",
  });

  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(
    null
  );

  // Helper to add a value to an option
  const addValueToOption = (index: number, value: string) => {
    if (!value) return;
    const currentValues = watch(`variantOptions.${index}.values`) || [];
    if (!currentValues.includes(value)) {
      setValue(`variantOptions.${index}.values`, [...currentValues, value]);
    }
  };

  // Helper to remove a value from an option
  const removeValueFromOption = (index: number, valueToRemove: string) => {
    const currentValues = watch(`variantOptions.${index}.values`) || [];
    setValue(
      `variantOptions.${index}.values`,
      currentValues.filter((v) => v !== valueToRemove)
    );
  };

  // Generate Variants based on Options
  const generateVariants = () => {
    const options = watch("variantOptions") || [];
    if (options.length === 0) return;

    // Cartesian product helper
    const cartesian = (...a: string[][]) =>
      a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())), [
        [],
      ] as string[][]);

    const valueArrays = options.map((opt) => opt.values);
    // If any option has no values, we can't generate variants properly
    if (valueArrays.some((arr) => arr.length === 0)) {
      return;
    }

    const combinations = cartesian(...valueArrays);

    const newVariants = combinations.map((combination) => {
      const name = combination.join(" / ");
      const optionsMap = options.reduce((acc, opt, idx) => {
        acc[opt.name] = combination[idx];
        return acc;
      }, {} as Record<string, string>);

      // Check if variant already exists to preserve values
      const existingVariant = (watch("variants") || []).find(
        (v) => v.name === name
      );

      return {
        name,
        options: JSON.stringify(optionsMap),
        sku:
          existingVariant?.sku ||
          `${watch("sku") || "SKU"}-${combination.join("-").toUpperCase()}`,
        price: existingVariant?.price || watch("basePrice") || 0,
        salePrice: existingVariant?.salePrice,
        costPrice: existingVariant?.costPrice,
        stock: existingVariant?.stock || 0,
        isActive: true,
        imageUrl: existingVariant?.imageUrl || "",
      };
    });

    replaceVariants(newVariants);
  };

  return (
    <div className="space-y-8">
      {/* 1. Define Options */}
      <Card>
        <CardHeader>
          <CardTitle>Variant Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Option Name (e.g. Color, Size)"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => {
                if (newOptionName) {
                  appendOption({ name: newOptionName, values: [] });
                  setNewOptionName("");
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Option
            </Button>
          </div>

          <div className="space-y-4">
            {optionFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">
                    {watch(`variantOptions.${index}.name`)}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add value (e.g. Red, Small)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addValueToOption(index, e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {watch(`variantOptions.${index}.values`)?.map((value) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="px-2 py-1"
                    >
                      {value}
                      <button
                        type="button"
                        className="ml-2 hover:text-destructive"
                        onClick={() => removeValueFromOption(index, value)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button type="button" onClick={generateVariants} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Variants
          </Button>
        </CardContent>
      </Card>

      {/* 2. Edit Variants */}
      {variantFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variant</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variantFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">
                        {watch(`variants.${index}.name`)}
                        <input
                          type="hidden"
                          {...control.register(`variants.${index}.name`)}
                        />
                        <input
                          type="hidden"
                          {...control.register(`variants.${index}.options`)}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`variants.${index}.sku`}
                          render={({ field }) => (
                            <Input {...field} className="h-8 w-[150px]" />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`variants.${index}.price`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                              className="h-8 w-[100px]"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={control}
                          name={`variants.${index}.stock`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              className="h-8 w-[80px]"
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        {/* Add delete individual variant if needed, but usually we regenerate */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
