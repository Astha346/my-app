import { ProductCard } from "@/types/types";

const WISHLIST_KEY = "wishlist";

export const getWishlist = (): ProductCard[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(WISHLIST_KEY);

    if (!saved) {
      return [];
    }

    return JSON.parse(saved);
  } catch (error) {
    console.log("Wishlist read error:", error);
    return [];
  }
};

export const addToWishlist = (product: ProductCard): ProductCard[] => {
  const wishlist = getWishlist();

  const alreadyExists = wishlist.some(
    (item) => item.id === product.id
  );

  if (alreadyExists) {
    return wishlist;
  }

  const updatedWishlist = [...wishlist, product];

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updatedWishlist)
  );

  window.dispatchEvent(new Event("wishlistUpdated"));

  return updatedWishlist;
};

export const removeFromWishlist = (
  productId: string
): ProductCard[] => {
  const wishlist = getWishlist();

  const updatedWishlist = wishlist.filter(
    (item) => item.id !== productId
  );

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(updatedWishlist)
  );

  window.dispatchEvent(new Event("wishlistUpdated"));

  return updatedWishlist;
};

export const toggleWishlist = (
  product: ProductCard
): ProductCard[] => {
  const wishlist = getWishlist();

  const alreadyExists = wishlist.some(
    (item) => item.id === product.id
  );

  if (alreadyExists) {
    return removeFromWishlist(product.id);
  }

  return addToWishlist(product);
};

export const isInWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();

  return wishlist.some(
    (item) => item.id === productId
  );
};

export const clearWishlist = (): void => {
  localStorage.removeItem(WISHLIST_KEY);

  window.dispatchEvent(new Event("wishlistUpdated"));
};