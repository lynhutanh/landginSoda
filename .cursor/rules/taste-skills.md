---
description: Danh mục hệ thống Kỹ năng Thiết kế Giao diện Taste-Skill (Anti-Slop UI/UX)
globs: "*"
alwaysApply: true
---

# Hệ thống Kỹ năng Thiết kế Giao diện Taste-Skill (Anti-Slop UI/UX)

Dự án này đã tích hợp đầy đủ bộ kỹ năng thiết kế giao diện **Taste-Skill** từ thư viện `Leonxlnx/taste-skill`. Bộ kỹ năng này giúp AI Agent thiết kế các giao diện chất lượng cao (premium, editorial, bento grids, dark tech...), tránh xa các mẫu thiết kế mặc định kiểu AI (AI slop, AI-purple gradients, generic glassmorphism).

Toàn bộ tài liệu hướng dẫn và nguyên tắc thiết kế chi tiết đã được lưu trữ cục bộ trong dự án tại thư mục [docs/taste-skill/](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/). Khi được yêu cầu thiết kế, chỉnh sửa giao diện hoặc tạo assets, AI Agent **bắt buộc** phải tự động mở và đọc tệp tin `SKILL.md` của kỹ năng tương ứng dưới đây.

---

## Danh sách Kỹ năng Thiết kế (Kèm liên kết trực tiếp)

### 1. Kỹ năng Thiết kế Cốt lõi (Core Frontend Design)
- **`design-taste-frontend`**: Bộ quy tắc thiết kế giao diện chống AI slop cho Landing Pages, Portfolios. Đọc brief và tự điều chỉnh bộ 3 chỉ số (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`).
  - Hướng dẫn chi tiết: [taste-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/taste-skill/SKILL.md)
- **`redesign-existing-projects`**: Hướng dẫn audit và nâng cấp giao diện của các dự án có sẵn lên tiêu chuẩn premium mà không làm hỏng tính năng cũ.
  - Hướng dẫn chi tiết: [redesign-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/redesign-skill/SKILL.md)

### 2. Các Phong cách Giao diện Chuyên biệt (Aesthetic Styles)
- **`minimalist-ui`**: Phong cách thiết kế tối giản, biên tập (editorial), bento grids, tông màu monochrome ấm, loại bỏ gradient và đổ bóng đậm.
  - Hướng dẫn chi tiết: [minimalist-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/minimalist-skill/SKILL.md)
- **`industrial-brutalist-ui`**: Thiết kế thô mộc công nghiệp (raw mechanical), lưới cứng cáp, độ tương phản typography cực cao, dùng cho trang dashboard dữ liệu.
  - Hướng dẫn chi tiết: [brutalist-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/brutalist-skill/SKILL.md)
- **`high-end-visual-design`**: Phong cách thiết kế như các creative agency cao cấp (Apple, Linear), hướng dẫn tỉ mỉ về typography, khoảng cách (spacing), đổ bóng tự nhiên.
  - Hướng dẫn chi tiết: [soft-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/soft-skill/SKILL.md)
- **`gpt-taste`**: Quy chuẩn thiết kế chuyên nghiệp cho hiệu ứng chuyển động GSAP ScrollTriggers nâng cao (pinning, stacking, scrubbing).
  - Hướng dẫn chi tiết: [gpt-tasteskill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/gpt-tasteskill/SKILL.md)

### 3. Quy trình Tải ảnh và Sinh Assets (Visual Assets & Mockups)
- **`image-to-code`**: Quy chuẩn tạo dựng giao diện từ hình ảnh. Bắt buộc tự tạo hình ảnh thiết kế nháp trước, phân tích kỹ bố cục và typography, sau đó mới viết code tái hiện lại.
  - Hướng dẫn chi tiết: [image-to-code-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/image-to-code-skill/SKILL.md)
- **`imagegen-frontend-web`**: Quy tắc sinh ảnh chất lượng cao để làm tham chiếu thiết kế cho từng phần của website (Landing Page).
  - Hướng dẫn chi tiết: [imagegen-frontend-web/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/imagegen-frontend-web/SKILL.md)
- **`imagegen-frontend-mobile`**: Quy tắc thiết kế giao diện ứng dụng di động (iOS/Android), hiển thị trong mockup điện thoại.
  - Hướng dẫn chi tiết: [imagegen-frontend-mobile/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/imagegen-frontend-mobile/SKILL.md)
- **`brandkit`**: Thiết kế bộ nhận diện thương hiệu, logo và phong cách visual toàn cục.
  - Hướng dẫn chi tiết: [brandkit/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/brandkit/SKILL.md)

### 4. Semantic Design & Output Enforcement
- **`stitch-design-taste`**: Hệ thống thiết kế ngữ nghĩa dành cho Google Stitch.
  - Hướng dẫn chi tiết: [stitch-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/stitch-skill/SKILL.md)
- **`full-output-enforcement`**: Quy tắc chống việc AI viết code tắt, viết code dạng placeholder (`// giữ nguyên code cũ...`). Đảm bảo trả ra code hoàn chỉnh.
  - Hướng dẫn chi tiết: [output-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/output-skill/SKILL.md)


### 5. Thư mục Ví dụ & Nghiên cứu (Examples & Research)
- **Ví dụ tham chiếu (Examples)**: [docs/taste-skill/examples/](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/examples/) chứa các hình ảnh WebP tham chiếu cho thiết kế giao diện chất lượng cao (như Floria layout).
- **Tài liệu nghiên cứu (Research)**: [docs/taste-skill/research/](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/research/) chứa các bài phân tích và phát hiện về hành vi "lười biếng" của AI (laziness findings, root causes) và phương án khắc phục (remediation).

---

## Chỉ dẫn dành cho AI Agent
- Trước khi thực hiện bất kỳ thiết kế frontend hoặc tạo mới trang web nào, hãy đọc kỹ [taste-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/taste-skill/SKILL.md).
- Khi tìm kiếm giải pháp hoặc ví dụ thiết kế mẫu, hãy xem trực tiếp các file ảnh trong thư mục [examples/](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/examples/) và tài liệu trong [research/](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/research/).
- Không bao giờ sử dụng màu tím mặc định của AI, không bao giờ dùng hero text căn giữa mặc định khi variance cao, và tuân thủ chặt chẽ tỉ lệ tương phản.
