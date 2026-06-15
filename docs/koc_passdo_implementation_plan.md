# KẾ HOẠCH TRIỂN KHAI CHI TIẾT HỆ THỐNG KOC PASSDO PLATFORM

Tài liệu này xác định kiến trúc kỹ thuật và các bước thực hiện chi tiết cho nền tảng ký gửi, pass đồ của KOC/KOL sử dụng bộ stack Next.js, NestJS, MongoDB + Mongoose và Tailwind CSS.

---

## 1. PHÂN TÍCH KIẾN TRÚC DỮ LIỆU (MONGODB + MONGOOSE)

Nền tảng vận hành theo mô hình đa khách thuê (Multi-tenant architecture) ở mức dữ liệu. Tất cả các collection đều liên kết với tài khoản KOC sở hữu thông qua trường `kocId`.

### 1.1. Schema Sản phẩm (Product Schema)
Sản phẩm pass đồ là độc bản (số lượng mặc định là 1). Trạng thái sản phẩm quyết định khả năng hiển thị và giao dịch.

```typescript
// api/src/modules/product/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'products', timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, min: 0, max: 100 })
  condition: number; // Độ mới tính theo % (ví dụ: 95, 98)

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  kocId: Types.ObjectId; // Định danh KOC sở hữu sản phẩm

  @Prop({ required: true, type: Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Prop({ required: true, enum: ['available', 'holding', 'sold'], default: 'available' })
  status: string;

  @Prop({ default: 1 })
  stock: number; // Luôn là 1 đối với đồ pass độc bản
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ kocId: 1, status: 1 });
ProductSchema.index({ categoryId: 1 });
```

### 1.2. Schema Đơn hàng (Order Schema)
Quản lý trạng thái thanh toán, giao vận, thời gian giữ hàng (3 phút) và thời gian đóng băng tiền (48 giờ).

```typescript
// api/src/modules/order/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'orders', timestamps: true })
export class Order extends Document {
  @Prop({ required: true, unique: true })
  orderCode: string; // Mã đơn hàng định danh, ví dụ: PASSDO10245

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  kocId: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: true })
  customerAddress: string; // Địa chỉ chi tiết

  @Prop({ type: Object, required: true })
  shippingDetail: {
    province: string;
    district: string;
    ward: string;
    provinceId: number;
    districtId: number;
    wardCode: string;
  };

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  shippingFee: number;

  @Prop({ 
    required: true, 
    enum: ['pending_payment', 'paid', 'shipping', 'delivered', 'cancelled', 'refunded'], 
    default: 'pending_payment' 
  })
  status: string;

  @Prop()
  holdingExpiresAt: Date; // 3 phút đếm ngược để giữ kho

  @Prop()
  ghnTrackingCode?: string; // Mã vận đơn GHN

  @Prop()
  ghnLabelUrl?: string; // PDF nhãn in đơn hàng từ GHN

  @Prop()
  deliveredAt?: Date; // Thời gian GHN báo giao thành công

  @Prop()
  holdFundsExpiresAt?: Date; // 48 giờ đóng băng tiền

  @Prop({ default: false })
  isFundsReleased: boolean; // Trạng thái giải ngân
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ orderCode: 1 });
ProductSchema.index({ kocId: 1, status: 1 });
```

### 1.3. Schema Cấu hình & Ví KOC (KocConfig Schema)
Lưu trữ thông tin tích hợp API GHN riêng biệt và số dư tài chính của từng KOC.

```typescript
// api/src/modules/koc/schemas/koc-config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'koc_configs', timestamps: true })
export class KocConfig extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
  kocId: Types.ObjectId;

  @Prop({ required: true })
  ghnToken: string; // API Token GHN cá nhân của KOC

  @Prop({ default: 0 })
  balance: number; // Ví số dư khả dụng có thể rút

  @Prop({ default: 0 })
  holdingBalance: number; // Tiền đang bị đóng băng 48 giờ
}

export const KocConfigSchema = SchemaFactory.createForClass(KocConfig);
```

---

## 2. PHÁT TRIỂN BACKEND (NESTJS REST API)

### 2.1. Logic Khóa Sản Phẩm & Tránh Tranh Mua (Lock Inventory)
Khi nhận yêu cầu tạo đơn hàng, hệ thống thực hiện một transaction để chuyển trạng thái sản phẩm từ `available` sang `holding` và giảm `stock` từ 1 về 0. Nếu thành công, đơn hàng mới được tạo.

```typescript
// api/src/modules/order/services/order.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { Product } from '../../product/schemas/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createOrderWithLock(createOrderDto: any): Promise<Order> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // Tìm và cập nhật trạng thái sản phẩm đồng thời để tránh race condition
      const product = await this.productModel.findOneAndUpdate(
        { 
          _id: createOrderDto.productId, 
          status: 'available', 
          stock: 1 
        },
        { 
          status: 'holding', 
          stock: 0 
        },
        { session, new: true }
      );

      if (!product) {
        throw new BadRequestException('Sản phẩm đã được mua hoặc đang được người khác giữ.');
      }

      const orderCode = `PASSDO${Date.now()}`;
      const holdingExpiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 phút

      const order = await this.orderModel.create(
        [
          {
            ...createOrderDto,
            orderCode,
            amount: product.price,
            status: 'pending_payment',
            holdingExpiresAt,
          }
        ],
        { session }
      );

      await session.commitTransaction();
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
```

### 2.2. Scheduler Tự Động Hủy Đơn Giữ Chỗ
Sử dụng `@nestjs/schedule` để quét định kỳ các đơn hàng quá hạn 3 phút chưa thanh toán nhằm giải phóng kho.

```typescript
// api/src/modules/order/services/order-scheduler.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { Product } from '../../product/schemas/product.schema';

@Injectable()
export class OrderSchedulerService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReleaseExpiredOrders() {
    const now = new Date();
    const expiredOrders = await this.orderModel.find({
      status: 'pending_payment',
      holdingExpiresAt: { $lt: now }
    });

    for (const order of expiredOrders) {
      const session = await this.connection.startSession();
      session.startTransaction();
      try {
        // Cập nhật trạng thái đơn hàng thành cancelled
        await this.orderModel.updateOne(
          { _id: order._id },
          { status: 'cancelled' },
          { session }
        );

        // Trả kho sản phẩm về trạng thái available
        await this.productModel.updateOne(
          { _id: order.productId },
          { status: 'available', stock: 1 },
          { session }
        );

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
      } finally {
        session.endSession();
      }
    }
  }
}
```

### 2.3. Tích Hợp Webhook SePay & Hoàn Tiền Tự Động (Automatic Refund)
Bộ điều khiển tiếp nhận thông tin chuyển khoản từ SePay. Trong trường hợp giao dịch lỗi (thanh toán muộn khi đơn hàng đã hủy hoặc sản phẩm đã bán), hệ thống gọi API Payout hoàn tiền ngay lập tức.

```typescript
// api/src/modules/payment/controllers/sepay.controller.ts
import { Controller, Post, Body, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../order/schemas/order.schema';
import { Product } from '../../product/schemas/product.schema';

@Controller('sepay')
export class SepayController {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly httpService: HttpService,
  ) {}

  @Post('webhook')
  async handlePaymentWebhook(@Body() body: any) {
    const { code, transferAmount, content } = body;
    // Lọc lấy mã đơn hàng từ nội dung chuyển khoản, ví dụ: "PASSDO10245"
    const orderCodeMatch = content.match(/PASSDO\d+/);
    if (!orderCodeMatch) return { status: 'ignored' };

    const orderCode = orderCodeMatch[0];
    const order = await this.orderModel.findOne({ orderCode });
    if (!order) return { status: 'not_found' };

    // Trường hợp 1: Đơn hàng hợp lệ và còn trong trạng thái pending_payment
    if (order.status === 'pending_payment' && order.amount === transferAmount) {
      order.status = 'paid';
      await order.save();
      await this.productModel.updateOne({ _id: order.productId }, { status: 'sold' });
      
      // Kích hoạt tiến trình tạo vận đơn GHN tự động
      await this.triggerGhnShipping(order);
      return { status: 'success' };
    }

    // Trường hợp 2: Chuyển khoản sai số tiền hoặc đơn hàng đã bị hủy do quá hạn 3 phút
    if (order.status === 'cancelled' || order.amount !== transferAmount) {
      await this.processAutoRefund(body, order);
      return { status: 'refunded' };
    }
  }

  private async processAutoRefund(webhookData: any, order: Order) {
    const refundPayload = {
      accountNumber: webhookData.senderAccountNumber,
      bankCode: webhookData.senderBankCode,
      amount: webhookData.transferAmount,
      description: `Hoan tien don hang ${order.orderCode} do het san pham`,
    };

    // Gọi API Payout của SePay để hoàn tiền trực tiếp
    await this.httpService.axiosRef.post(
      'https://api.sepay.vn/v1/payout',
      refundPayload,
      {
        headers: { Authorization: `Bearer ${process.env.SEPAY_API_KEY}` }
      }
    );
  }

  private async triggerGhnShipping(order: Order) {
    // Logic gọi API Giao Hàng Nhanh
  }
}
```

### 2.4. Tự Động Xử Lý & Nén Hình Ảnh (Sharp Interceptor)
Tất cả hình ảnh đồ pass khi tải lên thông qua trang Admin của KOC sẽ được chuẩn hóa: chuyển sang định dạng `.webp`, giới hạn kích thước tối đa và nén chất lượng.

```typescript
// api/src/modules/file/interceptors/image-compress.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as sharp from 'sharp';

@Injectable()
export class ImageCompressInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (file && file.mimetype.startsWith('image/')) {
      const compressedBuffer = await sharp(file.buffer)
        .resize({ width: 1080, withoutEnlargement: true }) // Rộng tối đa 1080px
        .webp({ quality: 80 }) // Đổi đuôi sang .webp, nén chất lượng 80%
        .toBuffer();

      // Thay thế thông tin file gốc bằng file đã nén
      file.buffer = compressedBuffer;
      file.originalname = file.originalname.replace(/\.[^/.]+$/, ".webp");
      file.mimetype = 'image/webp';
    }

    return next.handle();
  }
}
```

### 2.5. Tích Hợp API Giao Hàng Nhanh (GHN) Của Riêng KOC
Để tách biệt trách nhiệm tài chính và đối soát, mỗi KOC sẽ cấu hình API Token GHN riêng của họ.

```typescript
// api/src/modules/shipping/services/ghn.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KocConfig } from '../../koc/schemas/koc-config.schema';

@Injectable()
export class GhnService {
  constructor(
    @InjectModel(KocConfig.name) private kocConfigModel: Model<KocConfig>,
    private readonly httpService: HttpService,
  ) {}

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.httpService.axiosRef.get(
        'https://online-gateway.ghn.vn/shiip/public-api/v2/shop/all',
        { headers: { Token: token } }
      );
      return response.data.code === 200;
    } catch {
      throw new BadRequestException('Token API GHN không hợp lệ.');
    }
  }

  async createShippingOrder(order: any, kocId: string) {
    const config = await this.kocConfigModel.findOne({ kocId });
    if (!config || !config.ghnToken) {
      throw new Error('KOC chưa thiết lập Token GHN');
    }

    const payload = {
      payment_type_id: 1, // Shop chịu ship (mặc định)
      required_note: 'KHONGCHOXEMHANG',
      to_name: order.customerName,
      to_phone: order.customerPhone,
      to_address: order.customerAddress,
      to_ward_code: order.shippingDetail.wardCode,
      to_district_id: order.shippingDetail.districtId,
      weight: 500, // Ước lượng 500g cho mỗi sản phẩm
      service_type_id: 2, // Giao hàng chuẩn
      items: [{ name: 'Đồ pass', quantity: 1 }],
    };

    const response = await this.httpService.axiosRef.post(
      'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create',
      payload,
      { headers: { Token: config.ghnToken } }
    );

    return {
      trackingCode: response.data.data.order_code,
      labelUrl: `https://dev-online-gateway.ghn.vn/media/bill/print?order_code=${response.data.data.order_code}`,
    };
  }
}
```

### 2.6. Quy Trình Hold Tiền 48 Giờ Khi Đơn Hàng Thành Công
Khi nhận được webhook từ GHN thông báo trạng thái `Giao hàng thành công`, hệ thống tiến hành đóng băng dòng tiền trong 48 giờ để chờ phản hồi khiếu nại của khách hàng.

```typescript
// api/src/modules/shipping/controllers/ghn-webhook.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../order/schemas/order.schema';
import { KocConfig } from '../../koc/schemas/koc-config.schema';

@Controller('ghn-webhook')
export class GhnWebhookController {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(KocConfig.name) private kocConfigModel: Model<KocConfig>,
  ) {}

  @Post()
  async handleGhnStatusChange(@Body() body: any) {
    const { order_code, status } = body;

    // Trạng thái GHN giao hàng thành công
    if (status === 'delivered') {
      const order = await this.orderModel.findOne({ ghnTrackingCode: order_code });
      if (order && order.status === 'shipping') {
        order.status = 'delivered';
        order.deliveredAt = new Date();
        // Cấu hình đóng băng tiền 48 giờ tiếp theo
        order.holdFundsExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        await order.save();

        // Cộng dồn vào ví đóng băng của KOC
        await this.kocConfigModel.updateOne(
          { kocId: order.kocId },
          { $inc: { holdingBalance: order.amount } }
        );
      }
    }
  }
}
```

Hệ thống Scheduler tự động giải phóng tiền sau 48 giờ nếu không có khiếu nại từ người mua:

```typescript
// api/src/modules/koc/services/funds-release.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../order/schemas/order.schema';
import { KocConfig } from '../schemas/koc-config.schema';

@Injectable()
export class FundsReleaseService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(KocConfig.name) private kocConfigModel: Model<KocConfig>,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async releaseHoldFunds() {
    const now = new Date();
    const claimableOrders = await this.orderModel.find({
      status: 'delivered',
      isFundsReleased: false,
      holdFundsExpiresAt: { $lt: now }
    });

    for (const order of claimableOrders) {
      order.isFundsReleased = true;
      await order.save();

      // Khấu trừ số dư đóng băng và giải ngân trực tiếp vào ví khả dụng
      await this.kocConfigModel.updateOne(
        { kocId: order.kocId },
        { 
          $inc: { 
            holdingBalance: -order.amount,
            balance: order.amount // Số tiền nhận về sau khi trừ hoa hồng (nếu áp dụng)
          } 
        }
      );
    }
  }
}
```

### 2.7. Module Chat Real-time Sử Dụng WebSockets
Sử dụng thư viện `@nestjs/websockets` để liên lạc giữa Fan (vô danh) và KOC (Admin).

```typescript
// api/src/modules/websocket/chat.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { conversationId: string; text: string; sender: 'koc' | 'guest' },
    @ConnectedSocket() client: Socket
  ) {
    // Gửi tin nhắn đến phòng chat tương ứng
    this.server.to(data.conversationId).emit('newMessage', data);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(data.conversationId);
  }
}
```

---

## 3. PHÁT TRIỂN FRONTEND SHOP CỦA KOC (NEXT.JS USER APP)

Phần giao diện người dùng hiển thị Landing Page cá nhân của KOC qua Dynamic Route `app/[koc_username]/page.tsx`. Sử dụng bảng màu rực rỡ và các hiệu ứng chuyển động mượt mà.

### 3.1. Cấu Hình Bảng Màu Tailwind (user/tailwind.config.js)
```javascript
// user/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brandPink: '#FF477E',    // CTA chính, Nút thanh toán
        brandPurple: '#7209B7',  // Tiêu đề, Header
        brandCyan: '#4CC9F0',    // Tích xanh, Điểm nhấn
        brandBg: '#FFF0F5',      // Màu nền nhẹ nhàng
      }
    }
  }
}
```

### 3.2. Hiệu ứng Parallax cho Avatar KOC & Cuộn Trang
Sử dụng chuyển động CSS thuần kết hợp kiểm soát trạng thái cuộn trang để thay đổi kích thước Avatar trên thanh Header.

```typescript
// user/app/[koc_username]/components/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header({ kocName, avatarUrl }: { kocName: string; avatarUrl: string }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isScrolled && (
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brandCyan animate-fade-in">
              <Image 
                src={avatarUrl} 
                alt={kocName} 
                fill 
                placeholder="blur" 
                blurDataURL="data:image/png;base64,..."
              />
            </div>
          )}
          <span className="font-bold text-brandPurple text-lg">{kocName} Shop</span>
        </div>
        
        {/* Giỏ hàng & Chat */}
        <div className="flex items-center gap-4">
          <button className="relative p-2">
            <i className="icon-cart text-brandPurple text-2xl"></i>
            <span className="absolute top-0 right-0 bg-brandPink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">1</span>
          </button>
          <button className="bg-brandCyan hover:scale-105 transition-transform text-white font-bold px-3 py-1.5 rounded-full text-sm">
            Chat ngay
          </button>
        </div>
      </div>
    </header>
  );
}
```

### 3.3. Thẻ Sản Phẩm Tự Động Trượt Nhẹ Lên (Fade-In & Slide-Up)
Cấu hình hiệu ứng chuyển động CSS dựa trên PRD: `transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)`.

```typescript
// user/app/[koc_username]/components/ProductCard.tsx
'use client';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

export default function ProductCard({ product, onBuyNow }: { product: any; onBuyNow: (p: any) => void }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      style={{
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        opacity: inView ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:scale-[1.03] transition-transform duration-300"
    >
      <div className="relative aspect-square w-full">
        <Image 
          src={product.images[0]} 
          alt={product.name} 
          fill 
          className="object-cover" 
        />
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="text-white font-black text-xl tracking-wider">SOLD OUT</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-brandPurple truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 my-1">Độ mới: <span className="text-brandPink font-bold">{product.condition}%</span></p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-extrabold text-brandPink">{product.price.toLocaleString('vi-VN')}đ</span>
          <button 
            disabled={product.status !== 'available'}
            onClick={() => onBuyNow(product)}
            className="bg-brandPink disabled:bg-gray-300 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
          >
            {product.status === 'holding' ? 'Đang giữ hàng' : 'Mua Nhanh'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3.4. Luồng "Mua Nhanh" - Countdown 3 Phút & Mã VietQR Động
Popup hiển thị chi tiết VietQR và đồng hồ đếm ngược khi giữ hàng thành công.

```typescript
// user/app/[koc_username]/components/CheckoutModal.tsx
'use client';
import { useState, useEffect } from 'react';

export default function CheckoutModal({ order, onClose }: { order: any; onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(180); // 3 phút = 180 giây

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose(); // Tự động đóng popup và hủy khi hết giờ
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Tạo URL VietQR chuẩn
  const qrCodeUrl = `https://img.vietqr.io/image/MB-0987654321-compact2.png?amount=${order.amount}&addInfo=${order.orderCode}&accountName=KOC_PASSDO_PLATFORM`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 text-center shadow-2xl">
        <h3 className="text-lg font-black text-brandPurple">QUÉT MÃ VietQR ĐỂ THANH TOÁN</h3>
        <p className="text-xs text-gray-500 mt-1">Sản phẩm đang được giữ tạm thời cho bạn</p>
        
        {/* Đồng hồ đếm ngược */}
        <div className="my-4 bg-brandBg py-2 rounded-2xl inline-block px-4">
          <span className="text-sm text-brandPurple font-medium">Thời gian giữ hàng còn lại: </span>
          <span className="text-brandPink font-black text-lg">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Ảnh mã QR */}
        <div className="relative w-64 h-64 mx-auto border-4 border-brandBg rounded-2xl overflow-hidden p-2 bg-white">
          <img src={qrCodeUrl} alt="VietQR" className="w-full h-full object-contain" />
        </div>

        <div className="mt-4 text-left bg-gray-50 p-4 rounded-2xl text-xs space-y-2">
          <div><span className="text-gray-400">Số tiền:</span> <strong className="text-brandPink text-sm">{order.amount.toLocaleString()}đ</strong></div>
          <div><span className="text-gray-400">Nội dung CK bắt buộc:</span> <strong className="text-brandPurple text-sm">{order.orderCode}</strong></div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-sm transition-colors"
        >
          Hủy giao dịch
        </button>
      </div>
    </div>
  );
}
```

---

## 4. PHÁT TRIỂN FRONTEND TRANG QUẢN TRỊ KOC (NEXT.JS ADMIN APP)

Thiết kế tối ưu hóa Mobile-first cho phép KOC vận hành toàn bộ cửa hàng trực tiếp trên điện thoại thông minh.

### 4.1. Chức Năng Đăng Sản Phẩm Tích Hợp Camera Điện Thoại
Sử dụng thuộc tính `capture="environment"` của thẻ input file để kích hoạt camera điện thoại khi KOC chụp ảnh sản phẩm đăng bán.

```typescript
// admin/app/products/create/page.tsx
'use client';
import { useState } from 'react';

export default function CreateProduct() {
  const [images, setImages] = useState<File[]>([]);

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-xl font-bold text-brandPurple">ĐĂNG ĐỒ PASS MỚI</h1>
      
      <div className="mt-6 space-y-4">
        {/* Nút chụp ảnh camera điện thoại */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-brandCyan rounded-2xl p-6 bg-brandBg/30">
          <label className="cursor-pointer flex flex-col items-center">
            <span className="bg-brandCyan text-white p-3 rounded-full shadow-lg">📸 Chụp ảnh</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" // Bắt buộc mở camera trên Mobile
              onChange={handleImageCapture}
              className="hidden" 
            />
            <span className="text-xs text-gray-500 mt-2">Chụp trực tiếp từ camera sau</span>
          </label>
        </div>
        
        {/* Preview hình ảnh đã chụp */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4.2. Quản Lý Ví Và Đối Soát Số Dư
Cung cấp màn hình hiển thị trực quan Số dư khả dụng (được rút) và Số dư đang đóng băng (chờ qua thời gian 48 giờ đối soát).

```typescript
// admin/app/wallet/page.tsx
'use client';
import { useState } from 'react';

export default function WalletDashboard({ config }: { config: any }) {
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);

  const handleWithdraw = async () => {
    // API gửi yêu cầu rút tiền về ngân hàng
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold text-brandPurple">VÍ DOANH THU KOC</h1>
      
      <div className="bg-gradient-to-tr from-brandPurple to-brandPink text-white p-6 rounded-3xl space-y-4 shadow-xl">
        <div>
          <span className="text-xs opacity-80 block">Số dư khả dụng (có thể rút)</span>
          <span className="text-3xl font-black">{config.balance.toLocaleString()}đ</span>
        </div>
        <div className="border-t border-white/20 pt-4 flex justify-between">
          <div>
            <span className="text-[10px] opacity-80 block">Đang đóng băng (Hold 48h)</span>
            <span className="font-bold">{config.holdingBalance.toLocaleString()}đ</span>
          </div>
          <button 
            disabled={config.balance <= 0}
            onClick={handleWithdraw}
            className="bg-white text-brandPurple hover:bg-brandBg px-4 py-2 rounded-2xl text-xs font-black shadow-md transition-colors"
          >
            Rút tiền ngay
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. KẾ HOẠCH KIỂM THỬ (QA & TESTING PLAN)

### 5.1. Kiểm thử Race Condition khi Tranh Mua
*   **Mục tiêu**: Đảm bảo sản phẩm độc bản (số lượng = 1) chỉ có thể được mua/giữ bởi một khách hàng duy nhất.
*   **Kịch bản**: 
    1. Sử dụng công cụ chạy kiểm thử tự động (ví dụ: Playwright hoặc autocannon) để gửi đồng thời 10 yêu cầu Mua Nhanh cho cùng một mã sản phẩm tại cùng một mili-giây.
    2. Xác nhận: Chỉ có 1 yêu cầu được chuyển sang trạng thái thành công (`201 Created` kèm theo mã đơn hàng `pending_payment`), 9 yêu cầu còn lại bị từ chối với lỗi `400 Bad Request` ("Sản phẩm đã được mua hoặc đang được giữ").

### 5.2. Kiểm thử Webhook SePay & Hoàn Tiền Trễ
*   **Mục tiêu**: Xác thực cơ chế tự động hoàn lại tiền nếu khách hàng chuyển tiền muộn sau khi đơn hàng đã bị hủy.
*   **Kịch bản**:
    1. Tạo đơn hàng và để hết hạn 3 phút (trạng thái chuyển thành `cancelled`, sản phẩm trở lại `available`).
    2. Giả lập một Webhook thanh toán từ SePay đổ về với nội dung chứa mã đơn hàng đó.
    3. Xác nhận: 
        *   Trạng thái đơn hàng giữ nguyên là `cancelled`.
        *   Mã phản hồi Webhook trả về dạng `refunded`.
        *   Một yêu cầu POST được gửi tự động đến API Payout của SePay để thực hiện giao dịch hoàn lại 100% số tiền đã nhận.
