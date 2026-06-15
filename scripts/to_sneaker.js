const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../user/app/components/KocBoutiqueClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { search: /Petpal/g, replace: 'SneakerX' },
  { search: /petpal/g, replace: 'sneakerx' },
  { search: /PET_CATEGORIES/g, replace: 'SNEAKER_CATEGORIES' },
  { search: /PET_BLOGS/g, replace: 'SNEAKER_BLOGS' },
  { search: /Dog Food/g, replace: 'Nike' },
  { search: /Cat Food/g, replace: 'Adidas' },
  { search: /Pet Toys/g, replace: 'Jordan' },
  { search: /Grooming/g, replace: 'New Balance' },
  { search: /Health Care/g, replace: 'Converse' },
  { search: /Accessories/g, replace: 'Vans' },
  
  // Blogs
  { search: /Cách lựa chọn thức ăn hạt dinh dưỡng phù hợp cho bé cún của bạn/g, replace: 'Cách chọn size giày Sneaker chuẩn xác nhất cho mọi thương hiệu' },
  { search: /Dinh dưỡng đóng vai trò cốt lõi trong sự phát triển thể chất của chó\. Hãy cùng SneakerX khám phá công thức hạt phù hợp nhất\.\.\./g, replace: 'Việc chọn đúng size giày không chỉ mang lại sự thoải mái mà còn giúp bảo vệ đôi chân của bạn. Hãy cùng khám phá...' },
  { search: /5 dấu hiệu cho thấy bé mèo của bạn đang cần được chăm sóc lông spa/g, replace: '5 cách bảo quản giày Sneaker luôn như mới trong mùa mưa' },
  { search: /Lông mèo bị xơ rối, rụng nhiều hay có mùi hôi\? Đó là lúc bạn cần đưa bé đến các cơ sở spa tắm chải chuyên nghiệp\.\.\./g, replace: 'Mùa mưa luôn là nỗi ám ảnh của các sneakerhead. Dưới đây là những mẹo giúp bảo quản đôi giày yêu quý của bạn...' },
  { search: /Làm thế nào để huấn luyện cún đi vệ sinh đúng chỗ trong 7 ngày/g, replace: 'Xu hướng Sneaker hot nhất năm nay bạn không thể bỏ lỡ' },
  { search: /Huấn luyện đi vệ sinh luôn là nỗi trăn trở của các sen mới nuôi\. Áp dụng ngay phương pháp 3 bước cực kỳ hiệu quả này\.\.\./g, replace: 'Những mẫu giày nào sẽ làm mưa làm gió trong năm nay? Hãy cùng chúng tôi điểm qua những xu hướng nổi bật nhất...' },

  // Hero
  { search: /BEST CARE FOR YOUR FRIEND/g, replace: 'PREMIUM AUTHENTIC SNEAKERS' },
  { search: /Taking Care/g, replace: 'Step Into' },
  { search: /Of Your Pets\./g, replace: 'The Future.' },
  { search: /Chào mừng bạn đến với SneakerX\. Chúng tôi cung cấp những dịch vụ chăm sóc toàn diện, thức ăn hạt organic chất lượng cao và môi trường tuyệt vời nhất cho thú cưng yêu quý của bạn\./g, replace: 'Chào mừng bạn đến với SneakerX. Chúng tôi cung cấp những mẫu giày sneaker chính hãng chất lượng cao, đa dạng mẫu mã và luôn cập nhật xu hướng mới nhất.' },
  { search: /DỊCH VỤ SPA/g, replace: 'BỘ SƯU TẬP' },
  { search: /100% Organic/g, replace: '100% Authentic' },
  { search: /Sản Phẩm An Toàn/g, replace: 'Cam Kết Chính Hãng' },
  { search: /Dịch vụ Spa số 1/g, replace: 'Dịch vụ hàng đầu' },

  // About
  { search: /BÉ CƯNG HÀI LÒNG/g, replace: 'KHÁCH HÀNG HÀI LÒNG' },
  { search: /Chăm sóc bé cưng như thành viên trong gia đình/g, replace: 'Mang đến trải nghiệm mua sắm Sneaker tuyệt vời nhất' },
  { search: /SneakerX tin rằng mỗi cún, mèo đều xứng đáng nhận được tình yêu thương và sự chăm sóc tốt nhất\. Chúng tôi không ngừng tìm kiếm và cung cấp các nguồn sản phẩm tự nhiên, an toàn cùng với hệ thống spa chuẩn y khoa\./g, replace: 'SneakerX tin rằng mỗi đôi giày không chỉ là phụ kiện mà còn là phong cách sống. Chúng tôi không ngừng tìm kiếm và mang đến những mẫu sneaker độc đáo, chất lượng nhất cho bạn.' },
  { search: /Cung cấp thức ăn hạt hữu cơ sạch sẽ, không hóa chất độc hại\./g, replace: 'Cung cấp giày sneaker chính hãng từ các thương hiệu hàng đầu.' },
  { search: /Dịch vụ khám dinh dưỡng và tư vấn sức khỏe bởi bác sĩ chuyên nghiệp\./g, replace: 'Dịch vụ tư vấn size và mẫu mã chuyên nghiệp, tận tâm.' },
  { search: /Khách sạn thú cưng tiện nghi, sạch sẽ, có máy lọc không khí và điều hòa\./g, replace: 'Chính sách bảo hành và đổi trả linh hoạt, đảm bảo quyền lợi khách hàng.' },
  { search: /Hỗ trợ khách hàng nhiệt tình, giao hàng siêu tốc tận nơi\./g, replace: 'Hỗ trợ khách hàng 24/7, giao hàng siêu tốc tận nơi trên toàn quốc.' },

  // Services
  { search: /DỊCH VỤ SPA CHĂM SÓC/g, replace: 'DỊCH VỤ CỦA CHÚNG TÔI' },
  { search: /Pet Grooming & Spa/g, replace: 'Sneaker Spa & Clean' },
  { search: /Tắm massage chuyên sâu, cắt tỉa tạo kiểu lông nghệ thuật, cắt tỉa móng và vệ sinh tai\./g, replace: 'Làm sạch chuyên sâu, phục hồi màu sắc và bảo dưỡng giày sneaker chuyên nghiệp.' },
  { search: /Pet Boarding \(Khách Sạn\)/g, replace: 'Authentic Check' },
  { search: /Không gian phòng riêng biệt, vệ sinh kháng khuẩn định kỳ, có sân chơi vận động tự do\./g, replace: 'Kiểm tra và xác thực hàng chính hãng với đội ngũ chuyên gia giàu kinh nghiệm.' },
  { search: /Veterinary \(Y Tế Thú Y\)/g, replace: 'Custom Sneaker' },
  { search: /Khám kiểm tra sức khỏe tổng quát, tiêm ngừa vaccine định kỳ và hỗ trợ chăm sóc da lông\./g, replace: 'Thiết kế và cá nhân hóa đôi giày của bạn theo phong cách độc nhất vô nhị.' },
  { search: /Dog Training \(Huấn Luyện\)/g, replace: 'Pre-order Limited' },
  { search: /Các bài học cơ bản giúp cún nghe lời, đi vệ sinh đúng chỗ và giảm thiểu sủa bậy phá phách\./g, replace: 'Nhận đặt trước các mẫu giày giới hạn, phiên bản đặc biệt từ các thương hiệu.' },

  // Testimonial
  { search: /Những chia sẻ đầy chân thật từ ba mẹ cún mèo sau khi trải nghiệm các dịch vụ spa cắt tỉa lông, phòng trọ lưu trú đẳng cấp và mua sắm thức ăn hạt hữu cơ tại SneakerX\./g, replace: 'Những chia sẻ đầy chân thật từ khách hàng sau khi trải nghiệm các dịch vụ chăm sóc giày, xác thực hàng chính hãng và mua sắm sneaker tại SneakerX.' }
];

replacements.forEach(({ search, replace }) => {
  content = content.replace(search, replace);
});

// Update images
content = content.replace('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&w=800&q=80');
content = content.replace('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=80');
content = content.replace('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80');
content = content.replace('https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?auto=format&fit=crop&w=1200&q=80');

// category images
content = content.replace('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80');
content = content.replace('https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=150&q=80');
content = content.replace('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1550399504-8953e1a6ac87?auto=format&fit=crop&w=150&q=80');
content = content.replace('https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=150&q=80');
content = content.replace('https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=150&q=80');
content = content.replace('https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=150&q=80', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=150&q=80');

// Fix theme colors to be more Sneaker-like (Darker and more urban)
content = content.replace(/#894B8D/g, '#111111'); // purple to black
content = content.replace(/#F7F4F7/g, '#F9FAFB'); // light pink to light gray
content = content.replace(/#FFBE17/g, '#FF4500'); // yellow to orange red
content = content.replace(/#002169/g, '#1A1A1A'); // blue to dark gray
content = content.replace(/#F9EADC/g, '#E5E7EB'); // beige to gray border
content = content.replace(/paw-print/g, 'sneaker-print'); // remove paw

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done replacing to Sneaker content');
