import axios from 'axios';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ koc_username: string; product_id: string }>;
}

// SEO Best Practices: Tạo metadata động cho trang chi tiết sản phẩm pass đồ
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.product_id;
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';

  try {
    const res = await axios.get(`${API_ENDPOINT}/products/${productId}`);
    const product = res.data?.data;
    if (product) {
      return {
        title: `${product.name} - Đồ Pass Giá Tốt`,
        description: `Mua ngay ${product.name} thanh lý từ tủ đồ hiệu của KOC. Độ mới ${product.condition}% NEW, giá chỉ ${product.price?.toLocaleString()}đ. Số lượng chỉ có 1 chiếc duy nhất!`,
        openGraph: {
          title: `${product.name} - Đồ Pass độc bản`,
          description: 'Săn đồ hiệu thanh lý cực mới từ KOC',
          images: product.images && product.images[0] ? [product.images[0]] : []
        }
      };
    }
  } catch (err) {
    /* noop */
  }

  return {
    title: 'Chi Tiết Đồ Pass Độc Bản',
    description: 'Nền tảng thanh lý ký gửi đồ hiệu của KOC/KOL'
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.koc_username;
  const productId = resolvedParams.product_id;
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';

  let product = null;
  let koc = null;
  let otherProducts = [];

  try {
    // Tải thông tin chi tiết sản phẩm
    const resProduct = await axios.get(`${API_ENDPOINT}/products/${productId}`);
    product = resProduct.data?.data;

    // Tải thông tin KOC shop và các sản phẩm khác của KOC đó để gợi ý
    const resShop = await axios.get(`${API_ENDPOINT}/products/koc/${username}`);
    if (resShop.data?.data) {
      koc = resShop.data.data.koc;
      otherProducts = (resShop.data.data.products || []).filter((p: any) => p._id !== productId);
    }
  } catch (error) {
    console.error('Lỗi khi fetch chi tiết sản phẩm:', error.message);
  }

  if (!product || !koc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-brandPurple animate-pulse">404</h1>
          <p className="text-gray-500 font-medium">Sản phẩm hoặc Cửa hàng không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailClient
      product={product}
      koc={koc}
      otherProducts={otherProducts}
      username={username}
    />
  );
}
