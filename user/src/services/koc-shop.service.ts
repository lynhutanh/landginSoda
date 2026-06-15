import { apiRequest } from './api-request';

export const kocShopService = {
  // Lấy thông tin KOC và sản phẩm pass đồ của shop KOC đó
  async getKocShopData(username: string, categorySlug?: string) {
    const query = categorySlug ? `?category=${categorySlug}` : '';
    const res = await apiRequest.get(`/products/koc/${username}${query}`);
    return res.data; // Trả về { koc, products }
  },

  // Xem chi tiết sản phẩm pass đồ
  async getProductDetail(productId: string) {
    const res = await apiRequest.get(`/products/${productId}`);
    return res.data;
  },

  // Lấy danh sách danh mục
  async getCategories() {
    const res = await apiRequest.get('/products/categories');
    return res.data;
  },

  // Tạo đơn hàng giữ sản phẩm (Lock Inventory)
  async createOrder(orderData: {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    shippingDetail: {
      province: string;
      district: string;
      ward: string;
      provinceId: number;
      districtId: number;
      wardCode: string;
    };
    shippingFee: number;
  }) {
    const res = await apiRequest.post('/orders', orderData);
    return res.data;
  },

  // Kết nối chat - Lấy hoặc tạo cuộc trò chuyện
  async getOrCreateChatConversation(payload: {
    kocId: string;
    guestSessionId: string;
    guestName: string;
  }) {
    const res = await apiRequest.post('/chat/conversation', payload);
    return res.data;
  },

  // Lấy tin nhắn cũ
  async getMessages(conversationId: string) {
    const res = await apiRequest.get(`/chat/conversation/${conversationId}/messages`);
    return res.data;
  },

  // Lấy toàn bộ sản phẩm trên hệ thống
  async getAllProducts(status?: string, categoryId?: string) {
    const params: any = {};
    if (status) params.status = status;
    if (categoryId) params.categoryId = categoryId;
    const res = await apiRequest.get('/products', { params });
    return res.data;
  }
};
