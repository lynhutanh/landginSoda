---
description: Quy chuẩn phát triển Backend NestJS
globs: "api/src/**/*.ts"
alwaysApply: false
---

# Quy tắc Phát triển Backend NestJS (`/api`)

Bộ quy tắc áp dụng khi chỉnh sửa hoặc tạo mới các tập tin trong thư mục `api/src/`.

<context>
  Backend được xây dựng bằng NestJS, sử dụng Mongoose (MongoDB) làm cơ sở dữ liệu chính, Redis cho bộ nhớ đệm/Socket.IO adapter và BullMQ cho hàng đợi tác vụ nền.
</context>

<architecture>
  - **Kiến trúc Module hóa (Modular Architecture)**:
    - Mỗi tính năng mới phải được tổ chức thành một Module riêng biệt trong `api/src/modules/` (bao gồm: `controllers`, `services`, `schemas`, `dtos`, `guards`).
    - Các thành phần hạ tầng dùng chung (DB, Queue, Events, Logger, Security) được đặt tại `api/src/kernel/`.
  - **Tách biệt Logic nghiệp vụ (Separation of Concerns)**:
    - **Controller**: Chỉ xử lý routing, nhận request, kiểm tra validation đầu vào sơ bộ và trả về HTTP response.
    - **Service**: Nơi chứa toàn bộ business logic. Controller bắt buộc phải gọi Service để xử lý dữ liệu.
</architecture>

<guidelines>
  - **Dữ liệu đầu vào (DTOs & Validation)**:
    - Bắt buộc khai báo DTO (Data Transfer Object) cho mọi request body, query params và path variables.
    - Sử dụng `class-validator` decorators (như `@IsString()`, `@IsEmail()`, `@IsNotEmpty()`) để kiểm soát chặt chẽ dữ liệu đầu vào.
  - **Xử lý lỗi (Error Handling)**:
    - Luôn ném (throw) các `HttpException` chuẩn của NestJS (ví dụ: `BadRequestException`, `NotFoundException`, `ForbiddenException`).
    - Các lỗi không mong muốn hoặc lỗi runtime hệ thống sẽ tự động được bắt bởi `GlobalExceptionFilter` để log vào MongoDB, do đó không cần bọc khối `try-catch` quá rộng ở Controller ngoại trừ các trường hợp cần xử lý logic fallback đặc biệt.
  - **Mongoose Schemas**:
    - Sử dụng decorators `@Schema()` và `@Prop()` của `@nestjs/mongoose`.
    - Phải luôn tạo các index thích hợp cho các trường thường xuyên tìm kiếm (ví dụ: `email`, `username`) bằng cách khai báo `{ unique: true }` hoặc sử dụng migrations.
  - **Redis & Hàng đợi (BullMQ)**:
    - Mọi tác vụ nặng (như gửi email, xử lý và xóa file vật lý) phải được xử lý bất đồng bộ qua hàng đợi BullMQ.
    - Sử dụng `FileQueueService` để đăng ký tác vụ xóa tệp chạy ẩn.
</guidelines>
