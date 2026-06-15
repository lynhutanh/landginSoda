---
description: Quy chuẩn viết và chạy kiểm thử (Jest E2E & Playwright)
globs: "**/test/**/*,**/e2e/**/*"
alwaysApply: false
---

# Quy tắc Viết và Chạy Kiểm thử (Testing Guidelines)

Bộ quy tắc áp dụng khi viết test case mới hoặc chỉnh sửa các test suite trong dự án.

<context>
  Dự án tích hợp Jest & Supertest cho kiểm thử E2E API Backend, và Playwright cho kiểm thử E2E hành vi người dùng trên giao diện Frontend (Admin/User portal).
</context>

<guidelines>
  - **Backend E2E Testing (Jest + Supertest)**:
    - Đặt các file kiểm thử trong thư mục `api/test/` dưới dạng đặt tên `<feature>.e2e-spec.ts`.
    - Luôn tận dụng hàm tiện ích `createTestApp()` và `clearDatabase(app)` trong `setup.ts` trước mỗi ca test (`beforeEach`) để đảm bảo dữ liệu luôn sạch, tránh race conditions giữa các bài test.
    - Mock các dịch vụ bên ngoài (như Google Token Verifier, SMTP Mail Transport) trừ khi có cờ cấu hình chạy test thật (`TEST_REAL_EMAIL=true`, `TEST_REAL_GOOGLE=true`).
  - **Frontend E2E Testing (Playwright)**:
    - Đặt các kịch bản kiểm thử trong `admin/e2e/specs/` hoặc `user/e2e/specs/` dạng `<feature>.spec.ts`.
    - Áp dụng nghiêm ngặt mô hình **Page Object Model (POM)**:
      - Các tương tác với DOM, nút nhấn, điền input phải được viết trong các trang đại diện tại thư mục `e2e/pages/` (ví dụ: `LoginPage.ts`, `SettingsPage.ts`).
      - File spec chính chỉ được chứa kịch bản kiểm thử logic và các câu lệnh assert (`expect`).
    - Viết các hàm helper trong `e2e/helpers/` (như `auth-helper.ts`) để bypass đăng nhập nhanh cho các test suite phía sau, tránh việc lặp lại luồng đăng nhập thủ công gây chậm thời gian chạy test.
    - Luôn cấu hình workers bằng 1 (`workers: 1` trong config) để chạy tuần tự nhằm tránh database bị pollution hoặc lỗi xung đột trạng thái dữ liệu trong database khi chạy song song.
</guidelines>
