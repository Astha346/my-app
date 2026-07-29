"use client";

import { Button } from "@/components/ui/button";

interface Props {
  product: any;
  setDeleteProduct: (product: any) => void;
  deleteHandler: () => void;
}

export default function DeleteProductModal({
  product,
  setDeleteProduct,
  deleteHandler,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

        <div className="border-b p-6">
          <h2 className="text-xl font-bold text-red-600">
            Delete Product
          </h2>
        </div>

        <div className="p-6">
          <p>
            Are you sure you want to delete
            <strong> {product.name}</strong>?
          </p>

          <p className="mt-2 text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <Button
            variant="outline"
            onClick={() => setDeleteProduct(null)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={deleteHandler}
          >
            Delete
          </Button>
        </div>

      </div>
    </div>
  );
}