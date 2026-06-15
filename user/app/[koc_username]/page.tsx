import axios from 'axios';
import KocShopClient from './components/KocShopClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ koc_username: string }>;
}

// SEO Best Practices: Tạo dynamic metadata cho từng KOC Shop
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.koc_username;
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';
  
  try {
    const res = await axios.get(`${API_ENDPOINT}/products/koc/${username}`);
    const koc = res.data?.data?.koc;
    if (koc) {
      return {
        title: `${koc.name} - Pass Đồ Hiệu Giá Hời`,
        description: `Ghé thăm cửa hàng pass đồ của ${koc.name}. Săn đồ hiệu độc bản chính hãng mới 95-99% giá cực rẻ ngay hôm nay!`,
        openGraph: {
          title: `${koc.name} Shop Pass Đồ`,
          description: `Shop pass đồ hiệu của KOC ${koc.name}`
        }
      };
    }
  } catch (err) {
    /* noop */
  }

  return {
    title: 'KOC PassDo Shop',
    description: 'Nền tảng thanh lý đồ hiệu độc bản của KOC/KOL'
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.koc_username;
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5001';

  let initialData = { koc: null, products: [] };
  let categories = [];

  try {
    // Fetch dữ liệu Landing Page
    const resShop = await axios.get(`${API_ENDPOINT}/products/koc/${username}`);
    if (resShop.data?.data) {
      initialData = resShop.data.data;
    }

    // Fetch danh sách danh mục
    const resCat = await axios.get(`${API_ENDPOINT}/products/categories`);
    if (resCat.data?.data) {
      categories = resCat.data.data;
    }
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu KOC Shop:', error.message);
  }

  if (!initialData.koc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-brandPurple">404</h1>
          <p className="text-gray-500">Cửa hàng KOC không tồn tại hoặc đã bị ẩn.</p>
        </div>
      </div>
    );
  }

  return (
    <KocShopClient 
      initialKoc={initialData.koc} 
      initialProducts={initialData.products} 
      categories={categories}
      username={username}
    />
  );
}
