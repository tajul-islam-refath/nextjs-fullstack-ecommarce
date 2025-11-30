import { Package } from "lucide-react";

interface TopProductsProps {
  products: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

export function TopProducts({ products }: TopProductsProps) {
  if (products.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product, index) => (
        <div key={product.id} className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {product.name}
            </p>
            <p className="text-xs text-slate-500">
              {product.quantity} units sold
            </p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
            Top {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
