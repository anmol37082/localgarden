'use client';

export const CART_STORAGE_KEY = "localgarden_cart_v1";
export const CART_UPDATED_EVENT = "localgarden:cart-updated";

function safeParseCart(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParseCart(window.localStorage.getItem(CART_STORAGE_KEY));
}

export function saveCartItems(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function parsePriceValue(priceText) {
  const normalized = String(priceText ?? "").replace(/[^0-9.-]/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function createCartItem(product, { quantity = 1, color, image } = {}) {
  return {
    id: `${product.slug ?? product.title}-${color?.name ?? "default"}`,
    slug: product.slug ?? "",
    title: product.title ?? "Product",
    priceLabel: product.price ?? "",
    compareAtLabel: product.compareAt ?? "",
    unitPrice: parsePriceValue(product.price),
    quantity,
    colorName: color?.name ?? "Default",
    colorHex: color?.hex ?? "#d8d8d8",
    imageSrc: image?.src ?? product.images?.[0]?.src ?? "",
    imageAlt: image?.alt ?? product.images?.[0]?.alt ?? product.title ?? "Product image",
  };
}

export function addCartItem(product, options = {}) {
  if (typeof window === "undefined") {
    return [];
  }

  const nextItem = createCartItem(product, options);
  const currentItems = getCartItems();
  const existingIndex = currentItems.findIndex(
    (item) => item.slug === nextItem.slug && item.colorName === nextItem.colorName,
  );

  let nextItems;

  if (existingIndex >= 0) {
    nextItems = currentItems.map((item, index) =>
      index === existingIndex ? { ...item, quantity: (item.quantity ?? 1) + nextItem.quantity } : item,
    );
  } else {
    nextItems = [...currentItems, nextItem];
  }

  saveCartItems(nextItems);
  return nextItems;
}

export function removeCartItem(itemId) {
  if (typeof window === "undefined") {
    return [];
  }

  const nextItems = getCartItems().filter((item) => item.id !== itemId);
  saveCartItems(nextItems);
  return nextItems;
}

export function updateCartItemQuantity(itemId, quantity) {
  if (typeof window === "undefined") {
    return [];
  }

  const normalizedQuantity = Math.max(1, Number(quantity) || 1);
  const nextItems = getCartItems().map((item) =>
    item.id === itemId ? { ...item, quantity: normalizedQuantity } : item,
  );

  saveCartItems(nextItems);
  return nextItems;
}

export function clearCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  saveCartItems([]);
  return [];
}

export function dispatchCartUpdated(detail = {}) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail }));
}

export function getCartTotals(items) {
  return items.reduce(
    (accumulator, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      accumulator.count += quantity;
      accumulator.total += unitPrice * quantity;
      return accumulator;
    },
    { count: 0, total: 0 },
  );
}

export function formatMoney(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}
