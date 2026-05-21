import ProductDetailPage from "../../../features/products/components/ProductDetailPage";
import { getProductPageData } from "../../../features/products/data";

export default function PlantGrowthEnhancerPage() {
  return <ProductDetailPage product={getProductPageData("plant-growth-enhancer")} />;
}
