"use client";

import { useState } from "react";
import api from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Loader2,
  PackagePlus,
  ImageIcon,
  IndianRupee,
  Boxes,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductDialog({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function resetForm() {
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setImage("");
    setDescription("");
    setErrorMessage("");
  }

  function handleClose() {
    if (loading) return;

    resetForm();
    onClose();
  }

  async function handleSubmit() {
    setErrorMessage("");

    // Validation
    if (!name.trim()) {
      setErrorMessage("Product name is required.");
      return;
    }

    if (!category.trim()) {
      setErrorMessage("Category is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setErrorMessage("Please enter a valid price.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      setErrorMessage("Please enter a valid stock quantity.");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        stock: Number(stock),
        image: image.trim(),
        description: description.trim(),
      };

      console.log("ADDING PRODUCT:", productData);

      await api.post("/products", productData);

      // Reset form
      resetForm();

      // Close dialog
      onClose();

      // Tell parent to refresh products
      onSuccess();

    } catch (error: any) {
      console.error("ADD PRODUCT ERROR:", error);

      console.error(
        "BACKEND RESPONSE:",
        error?.response?.data
      );

      const backendMessage =
        error?.response?.data?.message;

      if (Array.isArray(backendMessage)) {
        setErrorMessage(backendMessage.join(", "));
      } else {
        setErrorMessage(
          backendMessage ||
            "Failed to add product. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <PackagePlus className="h-5 w-5 text-primary" />
            </div>

            <div>
              <DialogTitle className="text-xl">
                Add Product
              </DialogTitle>

              <DialogDescription>
                Add a new product to your store.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Error */}
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <div className="space-y-5 py-4">

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="product-name">
              Product Name
              <span className="ml-1 text-red-500">*</span>
            </Label>

            <Input
              id="product-name"
              placeholder="e.g. L'Oréal Revitalift Face Serum"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="product-category">
              Category
              <span className="ml-1 text-red-500">*</span>
            </Label>

            <Input
              id="product-category"
              placeholder="e.g. Beauty"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            />

            <p className="text-xs text-muted-foreground">
              Use the same category name used by your existing
              products.
            </p>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="product-price">
                Price
                <span className="ml-1 text-red-500">*</span>
              </Label>

              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  placeholder="1299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={loading}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="product-stock">
                Stock
                <span className="ml-1 text-red-500">*</span>
              </Label>

              <div className="relative">
                <Boxes className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  placeholder="20"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={loading}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="product-image">
              Image URL
            </Label>

            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="product-image"
                type="url"
                placeholder="https://example.com/product.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={loading}
                className="pl-9"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Add a public image URL for the product.
            </p>
          </div>

          {/* Image Preview */}
          {image.trim() && (
            <div className="overflow-hidden rounded-lg border bg-muted/30">
              <div className="border-b px-4 py-2">
                <p className="text-sm font-medium">
                  Image Preview
                </p>
              </div>

              <div className="flex justify-center p-4">
                <img
                  src={image}
                  alt="Product preview"
                  className="h-40 w-40 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="product-description">
              Description
            </Label>

            <Textarea
              id="product-description"
              placeholder="Write a short description about this product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="min-h-[120px] resize-none"
            />

            <p className="text-xs text-muted-foreground">
              Give customers a short description of the product.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="gap-2 sm:gap-2">

          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <PackagePlus className="mr-2 h-4 w-4" />
                Add Product
              </>
            )}
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}