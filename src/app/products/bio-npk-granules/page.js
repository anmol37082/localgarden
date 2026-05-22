import ProductDetailPage from "../../../features/products/components/ProductDetailPage";
import { getProductPageData } from "../../../features/products/data";

export default function BioNpkGranulesPage() {
  return <ProductDetailPage product={getProductPageData("bio-npk-granules")} productSlug="bio-npk-granules" />;
}
