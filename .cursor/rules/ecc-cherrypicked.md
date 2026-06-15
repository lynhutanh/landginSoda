---
description: Danh mục Hệ thống Kỹ năng Chọn lọc từ Everything Claude Code (ECC Cherry-picked Skills)
globs: "*"
alwaysApply: true
---

# Hệ thống Kỹ năng Chọn lọc từ Everything Claude Code (ECC Cherry-picked Skills)

Dự án này đã tích hợp các kỹ năng kỹ thuật chọn lọc từ thư viện **Everything Claude Code (ECC)** của tác giả Affaan Mustafa (`affaan-m/everything-claude-code`). Nhằm tránh việc làm phình to ngữ cảnh (context bloat), chúng tôi chỉ lọc chọn ra các kỹ năng tương thích hoàn hảo với Stack công nghệ hiện tại của dự án: NestJS (Backend) và Next.js / React (Frontend).

Toàn bộ tài liệu hướng dẫn chi tiết của các kỹ năng đã được lưu trữ cục bộ tại thư mục [docs/everything-claude-code/](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/). AI Agent **bắt buộc** phải tự động tham chiếu và thực thi theo các chỉ dẫn tương ứng dưới đây khi làm việc trên backend NestJS hoặc frontend Next.js.

---

## Danh sách Kỹ năng Chọn lọc (Kèm liên kết trực tiếp)

### 1. Kỹ năng phát triển NestJS (Backend)
- **`nestjs-patterns`**: Quy chuẩn kiến trúc NestJS, thiết lập modules cấu trúc sạch, DTO validation, tích hợp Mongoose (MongoDB), xử lý lỗi và thiết kế REST API endpoints đồng bộ.
  - Hướng dẫn chi tiết: [nestjs-patterns/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/nestjs-patterns/SKILL.md)

### 2. Kỹ năng tối ưu hóa React (Frontend)
- **`react-performance`**: Các nguyên tắc tối ưu hóa hiệu năng React, tránh hiện tượng re-render thừa thãi, kiểm soát render loop, tận dụng hiệu quả `useMemo`/`useCallback`, và ảo hóa danh sách (virtualized lists).
  - Hướng dẫn chi tiết: [react-performance/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/react-performance/SKILL.md)

### 3. Kỹ năng kiểm thử React (Frontend)
- **`react-testing`**: Quy trình thiết lập kiểm thử đơn vị (Unit test) và kiểm thử tích hợp (Integration test) cho các thành phần React, cấu trúc assertions sạch và kiểm soát biên giao diện.
  - Hướng dẫn chi tiết: [react-testing/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/react-testing/SKILL.md)

### 4. Tối ưu hóa Build Next.js (Frontend)
- **`nextjs-turbopack`**: Các phương án tối ưu hóa thời gian build và phát triển trên Next.js sử dụng Turbopack, chiến lược cấu hình cache tối ưu cho bundler và asset pipelines.
  - Hướng dẫn chi tiết: [nextjs-turbopack/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/nextjs-turbopack/SKILL.md)

---

## Chỉ dẫn dành cho AI Agent
Khi làm việc trên các module của dự án:
1. Nếu chỉnh sửa các API NestJS trong thư mục `api/`, hãy đọc kỹ [nestjs-patterns/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/nestjs-patterns/SKILL.md).
2. Nếu chỉnh sửa giao diện Next.js trong thư mục `admin/` hoặc `user/`, hãy rà soát hiệu năng theo [react-performance/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/react-performance/SKILL.md) và thiết lập test theo [react-testing/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/react-testing/SKILL.md).
3. Tuyệt đối tuân thủ các chỉ dẫn chất lượng code và tránh các phản mẫu (anti-patterns) được mô tả trong các file trên.
