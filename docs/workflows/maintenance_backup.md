# Quy trình Bảo trì & Sao lưu (Maintenance & Backup)

Tài liệu này mô tả chi tiết cách thức hoạt động của Chế độ bảo trì hệ thống (Maintenance Mode) cùng Whitelist IP và Quy trình sao lưu dữ liệu cơ sở dữ liệu MongoDB dạng nén ZIP luồng trực tiếp (Streaming ZIP Backup).

---

## 1. Chế độ Bảo trì Hệ thống (Maintenance Mode)

Chế độ bảo trì cho phép đóng băng các hoạt động ghi/đọc của người dùng thường khi hệ thống nâng cấp, nhưng vẫn cho phép quản trị viên hoặc các IP phát triển (Whitelist) truy cập bình thường.

```mermaid
graph TD
    Request[HTTP Request từ Client] --> Mw[MaintenanceMiddleware]
    Mw --> Exclude{Thuộc đường dẫn bỏ qua?}
    
    %% Đường dẫn được bỏ qua
    Exclude -->|Đúng: /auth, /admin, /health, /settings/public/maintenance, /public/*| Next[Cho phép đi tiếp (next())]
    
    %% Đường dẫn bị chặn
    Exclude -->|Sai| CheckMode{Chế độ bảo trì bật?}
    CheckMode -->|Tắt| Next
    
    %% Bảo trì đang bật
    CheckMode -->|Bật| CheckIp{IP Client có trong Whitelist?}
    CheckIp -->|Có| Next
    CheckIp -->|Không| Block[Trả về HTTP 503 Service Unavailable + Tin nhắn bảo trì]
```

### 1.1. Các đường dẫn được miễn trừ (Excluded Prefix paths)
Định nghĩa trong [MaintenanceMiddleware](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/maintenance/middleware/maintenance.middleware.ts#L5-L14):
- `/auth/` và `/auth`: Để người dùng có thể thực hiện đăng nhập nếu được admin cấp quyền, hoặc admin đăng nhập.
- `/admin/`: Cho phép admin truy cập trang quản trị để tắt bảo trì hoặc kiểm tra.
- `/settings/public/maintenance`: Endpoint lấy thông tin trạng thái bảo trì cho trang block.
- `/public/`: Các tài nguyên tĩnh (logo, ảnh).
- `/health`: Kiểm tra sức khỏe hệ thống (Health check).

### 1.2. Cơ chế Whitelist IP / CIDR
- Khi bảo trì được bật, quản trị viên có thể nhập địa chỉ IP tĩnh hoặc dải CIDR (ví dụ: `192.168.1.1` hoặc `192.168.1.0/24`) vào cấu hình cho phép.
- Trình phân tích IP ([ip.utils.ts](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/maintenance/utils/ip.utils.ts)) sẽ trích xuất IP của client từ headers `x-forwarded-for` hoặc `req.socket.remoteAddress`, kiểm tra xem IP đó có thuộc dải CIDR hoặc khớp trực tiếp hay không. Nếu khớp, yêu cầu không bị chặn.

---

## 2. Quy trình Sao lưu Cơ sở dữ liệu (Database Backup)

Chức năng sao lưu cho phép xuất toàn bộ cơ sở dữ liệu MongoDB hiện tại về máy tính dưới dạng file nén ZIP. Quy trình được thiết kế tối ưu hóa bộ nhớ RAM bằng cách truyền trực tiếp dữ liệu dạng luồng (Streaming) thay vì tạo tệp tạm trên ổ cứng.

![Quy trình Sao lưu Cơ sở dữ liệu](/Users/nguyendam/Documents/Study/base-code/docs/workflows/assets/maintenance_backup_workflow.png)

### Điểm nổi bật trong thiết kế Backup:
1. **Truyền luồng trực tiếp (Streaming)**: Thư viện `yazl` (`ZipFile`) hỗ trợ đẩy luồng đầu ra (`outputStream`) trực tiếp vào đối tượng `Response` của Express. Không cần lưu file `.zip` tạm thời trên server, tránh tràn ổ đĩa cứng khi cơ sở dữ liệu lớn.
2. **Định dạng độc lập**: Dữ liệu của mỗi Collection được lưu thành một tệp tin `.json` riêng biệt (ví dụ: `users.json`, `settings.json`, `auths.json`) nằm trong file nén. Định dạng này giúp dễ dàng đọc bằng mắt, xử lý lại bằng các script Python hoặc import ngược lại vào bất kỳ database MongoDB nào.
3. **Phân tách collection**: Tự động lọc bỏ các collection của hệ thống MongoDB (những collection bắt đầu bằng `system.`) để tránh lỗi phân quyền và kích thước rác.

Cấu hình dịch vụ này nằm tại [backup.service.ts](file:///Users/nguyendam/Documents/Study/base-code/api/src/modules/backup/services/backup.service.ts).
