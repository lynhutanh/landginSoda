---
description: Quy tắc ứng xử và tiêu chuẩn chất lượng chung cho toàn bộ dự án
globs: "*"
alwaysApply: true
---

# Tiêu chuẩn Phát triển Chung (Global Coding Standards)

Bộ quy tắc này bắt buộc phải tuân thủ đối với toàn bộ các tập tin và thư mục trong dự án.

<context>
  Dự án là một boilerplate Full-stack bao gồm Backend NestJS (`/api`) và hai Frontend Next.js (`/admin`, `/user`).
  Mục tiêu: Đảm bảo mã nguồn sạch (Clean Code), an toàn bảo mật, dễ bảo trì và mở rộng.
</context>

<principles>
  - **SOLID**: Áp dụng các nguyên lý thiết kế hướng đối tượng (đặc biệt ở Backend).
  - **DRY (Don't Repeat Yourself)**: Tránh lặp lại mã nguồn. Các logic dùng chung phải đưa vào kernel/helpers hoặc components dùng chung.
  - **KISS (Keep It Simple, Stupid)**: Ưu tiên giải pháp đơn giản, rõ ràng, tránh tối ưu hóa sớm khi chưa cần thiết.
  - **Superpowers Methodology**: Tuân thủ kỷ luật quy trình Lập kế hoạch (Planning), Kiểm thử trước khi code (TDD), và Xác thực toàn cục trước khi bàn giao.
</principles>

<guidelines>
  - **AI Agent Workflow**: AI Agent bắt buộc phải hoạt động theo các bộ kỹ năng mô tả chi tiết tại [.cursor/rules/superpowers-skills.md](file:///Users/nguyendam/Documents/Study/base-code/.cursor/rules/superpowers-skills.md).
  - **Ngôn ngữ**: 
    - Mã nguồn (tên biến, hàm, class, file) viết hoàn toàn bằng tiếng Anh.
    - Tài liệu kỹ thuật, git commit messages và các bình luận (comments) giải thích thuật toán phức tạp ưu tiên viết bằng tiếng Việt rõ ràng, mạch lạc.
  - **Đặt tên (Naming Conventions)**:
    - Thư mục và tập tin thường: Sử dụng `kebab-case` (ví dụ: `auth-helper.ts`, `date-picker.tsx`).
    - Class, Interface, Component: Sử dụng `PascalCase` (ví dụ: `UserService`, `AdminLayout`).
    - Biến, Hàm: Sử dụng `camelCase` (ví dụ: `currentUser`, `generateThumbnail`).
    - Hằng số: Sử dụng `UPPER_SNAKE_CASE` (ví dụ: `JWT_EXPIRATION`, `REMOVE_FILE_QUEUE_CHANNEL`).
  - **Git Workflow**:
    - Commit message phải mô tả rõ ràng hành động (ví dụ: `feat: tích hợp Google OAuth`, `fix: sửa lỗi hiển thị DatePicker trên Mobile`).
</guidelines>
