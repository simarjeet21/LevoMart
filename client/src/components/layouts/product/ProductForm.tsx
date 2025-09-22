"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { ProductFormData } from "@/types/product";
import defaultForm from "@/constants/ProductForm";

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
}
export default function ProductForm({
  initialData,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData || defaultForm);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!form.name) {
      toast.error("Please fill all fields correctly");
      return;
    }
    setLoading(true);
    try {
      onSubmit(form);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border border-olive/30 rounded-xl shadow-lg p-6 bg-white">
      {/* Product Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Product Name
        </label>
        <Input
          placeholder="Enter product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Price */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Price (in ₹)
        </label>
        <Input
          type="number"
          placeholder="Enter price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: +e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Description</label>
        <Textarea
          placeholder="Enter product description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Stock */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Stock Quantity
        </label>
        <Input
          type="number"
          placeholder="Enter stock count"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: +e.target.value })}
        />
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Category</label>
        <Input
          placeholder="Enter category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>

      {/* Image URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">
          Product Image URL
        </label>
        <Input
          placeholder="https://example.com/image.jpg"
          value={form.imageUrl || ""}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="mt-2 w-48 h-auto rounded border border-gray-300"
          />
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Submitting..."
            : initialData
            ? "Update Product"
            : "Add Product"}
        </Button>
      </div>
    </div>
  );
}
