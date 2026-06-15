'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Card, CardContent } from '@components/ui/card';
import { Marquee } from '@components/ui/3d-testimonials';

// Unique reviews data
const testimonials = [
  {
    name: 'Khánh An',
    username: '@khanhan',
    body: 'Thức ăn hạt hữu cơ ở đây rất thơm, cún nhà mình cực kỳ thích!',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 Hà Nội'
  },
  {
    name: 'Minh Thư',
    username: '@minhthu',
    body: 'Dịch vụ spa tắm cắt tỉa siêu cẩn thận, bé mèo nhà mình không hề sợ hãi.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 TP.HCM'
  },
  {
    name: 'Hoàng Long',
    username: '@hoanglong',
    body: 'Khách sạn thú cưng sạch sẽ, các bạn nhân viên chụp ảnh gửi báo cáo hàng ngày rất tận tâm.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 Đà Nẵng'
  },
  {
    name: 'Thu Trang',
    username: '@thutrang',
    body: 'Đồ chơi ở đây rất bền và an toàn, mèo nhà mình chơi cả ngày không chán.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 Hải Phòng'
  },
  {
    name: 'Quốc Bảo',
    username: '@quocbao',
    body: 'Đội ngũ bác sĩ tư vấn dinh dưỡng rất chu đáo, giúp bé cún nhà mình tăng cân khỏe mạnh.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 Cần Thơ'
  },
  {
    name: 'Thanh Vân',
    username: '@thanhvan',
    body: 'Giao hàng siêu tốc đúng 2 giờ trong nội thành, sản phẩm đóng gói cực kỳ cẩn thận.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 TP.HCM'
  },
  {
    name: 'Đức Huy',
    username: '@duchuy',
    body: 'Balo phi hành gia chất lượng tốt, thông thoáng, bế mèo đi dạo rất tiện lợi.',
    img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 Hà Nội'
  },
  {
    name: 'Mai Chi',
    username: '@maichi',
    body: 'Giá cả phải chăng, nguồn gốc xuất xứ rõ ràng, luôn tin tưởng mua sắm ở Petpal.',
    img: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 Nha Trang'
  },
  {
    name: 'Tấn Phát',
    username: '@tanphat',
    body: 'Hỗ trợ đổi trả rất nhanh chóng khi mình mua nhầm size đai yếm. Rất hài lòng!',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    country: '🇻🇳 Bình Dương'
  }
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-secondary-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function DemoOne() {
  return (
    <div className="border border-border rounded-lg relative flex h-96 w-full max-w-[800px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px] bg-black/40 backdrop-blur-md">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)'
        }}
      >
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        {/* Gradient overlays for vertical marquee */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
      </div>
    </div>
  );
}
