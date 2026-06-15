---
description: Quy chuẩn phát triển Frontend Next.js (Admin & User)
globs: "{admin,user}/**/*"
alwaysApply: false
---

# Quy tắc Phát triển Frontend Next.js (`/admin` & `/user`)

Bộ quy tắc áp dụng khi chỉnh sửa hoặc phát triển giao diện người dùng trên hai module `admin` và `user`.

<context>
  Frontend sử dụng Next.js (App Router), CSS thuần kết hợp TailwindCSS 4, quản lý trạng thái qua Zustand, lấy dữ liệu và cache qua SWR, các hiệu ứng động bằng Framer Motion.
</context>

<guidelines>
  - **Định tuyến API (API Proxy Routing)**:
    - **CẤM** gọi trực tiếp địa chỉ tuyệt đối của API Server (như `http://localhost:5001/auth`) từ phía trình duyệt (Client-side).
    - Tất cả các API request từ client bắt buộc phải định tuyến tương đối qua tiền tố `/api-backend/` (ví dụ: `/api-backend/auth/login`) để Next.js Server tự động rewrite/proxy, phòng tránh lỗi CORS và tăng tính bảo mật.
  - **Quản lý Component & UI**:
    - Sử dụng các UI components dùng chung tự xây dựng trong thư mục `src/components/ui/` (như `button.tsx`, `input.tsx`, `date-picker.tsx`).
    - Hạn chế viết các style CSS tùy biến tự phát (ad-hoc styles). Luôn tái sử dụng các class utility của TailwindCSS hoặc biến CSS toàn cục đã được định nghĩa tại `index.css` để giữ tính đồng nhất về mặt thiết kế.
    - Đảm bảo hiển thị tương thích (Responsive) trên cả thiết bị di động (viewport mobile/tablet) và máy tính để bàn.
  - **Quản lý Trạng thái (State Management)**:
    - Sử dụng React Local State (`useState`) cho các tương tác cục bộ của component.
    - Sử dụng Zustand cho các trạng thái toàn cục dùng chung giữa nhiều trang (như thông tin người dùng hiện tại `currentUserStore`, cài đặt hệ thống `publicSiteSettingsStore`).
  - **Báo cáo lỗi (Error Reporter)**:
    - Mọi component nặng hoặc trang chứa nhiều thành phần động phải được bao bọc trong `AppErrorBoundary` để tránh gây lỗi trắng trang toàn cục (Crash UI).
    - Luôn tích hợp thư viện báo cáo lỗi client-side `client-error-reporter.ts` để tự động đẩy thông tin lỗi runtime về API Backend lưu trữ.
</guidelines>
