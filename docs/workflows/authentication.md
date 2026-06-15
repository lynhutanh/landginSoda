# Quy trình Xác thực & Phân quyền (Authentication & Authorization)

Hệ thống cung cấp cơ chế xác thực không lưu trạng thái (Stateless Authentication) sử dụng mã thông báo JWT (JSON Web Token), kết hợp với quy trình đăng nhập cục bộ (Credentials) và đăng nhập bên thứ ba (Google OAuth). Phân quyền người dùng dựa trên vai trò (RBAC - Role-Based Access Control) được áp dụng chặt chẽ ở mức API Gateway.

---

## 1. Bản đồ tổng quan quy trình xác thực

![Bản đồ tổng quan quy trình xác thực](/Users/nguyendam/Documents/Study/base-code/docs/workflows/assets/auth_workflow.png)

---

## 2. Quy trình Xác thực Google OAuth

Hệ thống cho phép đăng nhập/đăng ký thông qua Google ID Token trực tiếp từ phía Client. 


### Luồng xử lý chi tiết:
1. **Phía Client**: Người dùng click "Đăng nhập với Google", mở popup đăng nhập và nhận về một chuỗi `idToken` từ Google API.
2. **Gửi yêu cầu**: Client gửi `idToken` lên backend qua endpoint:
   - User Portal: `POST /api-backend/auth/google` (gọi [AuthController](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/auth/controllers/auth.controller.ts))
3. **Backend Xác thực với Google**:
   - `AuthService` chuyển `idToken` qua `GoogleTokenVerifier` để gọi đến API của Google (`https://oauth2.googleapis.com/tokeninfo?id_token=...`) xác minh token là thật và lấy ra `email`, `name`, `sub` (Google ID).
4. **Kiểm tra tài khoản**:
   - Hệ thống tìm kiếm bản ghi trong bảng `Auth` với `provider: 'google'` và `email` tương ứng.
   - **Trường hợp đã tồn tại**: Tiến hành sinh JWT cho tài khoản này và trả về.
   - **Trường hợp chưa tồn tại (Đăng ký mới)**:
     - Tạo mới bản ghi `User` với thông tin tên và email lấy từ Google.
     - Tạo mới bản ghi `Auth` liên kết, đánh dấu `provider: 'google'`.
     - Sinh JWT và trả về thông tin đăng nhập thành công.

---

## 3. Cơ chế Phân quyền & Bảo vệ API (RBAC)

Hệ thống sử dụng các bộ lọc chặn (Guards) kết hợp với Metadata Decorators để bảo vệ các tuyến đường (routes).

### 3.1. AuthGuard ([auth.guard.ts](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/auth/guards/auth.guard.ts))
- Trích xuất JWT từ tiêu đề `Authorization` dạng `Bearer <token>`.
- Sử dụng `JwtService` để giải mã và kiểm tra tính hợp lệ của token (issuer, hạn dùng, chữ ký).
- Đính kèm thông tin giải mã (payload) vào đối tượng `request.user` để các middleware và controller phía sau sử dụng.

### 3.2. RolesGuard ([role.guard.ts](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/auth/guards/role.guard.ts))
- Được kích hoạt thông qua decorator `@Roles('admin', 'super-admin')`.
- Kiểm tra vai trò (`role`) của người dùng được đính kèm trong `request.user` so với danh sách các vai trò được phép truy cập endpoint. Nếu không khớp sẽ quăng lỗi `403 Forbidden`.

```typescript
// Ví dụ áp dụng Guard bảo vệ Route trong Admin Controller
@Controller('admin/users')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'super-admin')
export class AdminUserController {
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }
}
```

---

## 4. Cấu trúc bảng dữ liệu liên quan (Schemas)

### 4.1. User Schema ([user.schema.ts](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/user/schemas/user.schema.ts))
Lưu trữ thông tin profile hiển thị của người dùng.
- `name`: Tên hiển thị.
- `email`: Địa chỉ email (duy nhất, viết thường).
- `username`: Tên đăng nhập (duy nhất, viết thường).
- `role`: Vai trò (`user`, `admin`, `super-admin`).
- `status`: Trạng thái hoạt động (`active`, `blocked`).
- `phone`: Số điện thoại.
- `avatarId`: Liên kết đến bảng file metadata để làm ảnh đại diện.

### 4.2. Auth Schema ([auth.schema.ts](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/auth/schemas/auth.schema.ts))
Lưu trữ thông tin xác thực nhạy cảm.
- `userId`: Tham chiếu `ObjectId` tới bảng `User`.
- `email` & `username`: Để tìm kiếm nhanh khi đăng nhập.
- `password`: Mật khẩu đã được mã hóa băm SHA-256 kết hợp muối (salt).
- `salt`: Chuỗi muối ngẫu nhiên tạo riêng cho mỗi tài khoản.
- `provider`: Nguồn xác thực (`local`, `google`).
