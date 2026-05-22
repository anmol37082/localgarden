import ProductDetailPage from "../../../features/products/components/ProductDetailPage";
import { getProductPageData } from "../../../features/products/data";

export default function FlowerFruitBoosterPage() {
  return <ProductDetailPage product={getProductPageData("flower-fruit-booster")} productSlug="flower-fruit-booster" />;
}
