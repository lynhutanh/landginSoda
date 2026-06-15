# Base Code — Full-Stack Starter Template

Hệ thống **boilerplate full-stack** sản xuất-sẵn sàng, bao gồm một Backend API (NestJS) và hai Frontend portal riêng biệt — **Admin Dashboard** và **User Portal** (Next.js). Được thiết kế theo kiến trúc module hoá, tách biệt rõ ràng giữa logic nghiệp vụ, hạ tầng và giao diện, phù hợp làm nền tảng khởi động cho các dự án web thực tế.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Tính năng đã triển khai](#4-tính-năng-đã-triển-khai)
5. [Hướng dẫn cài đặt](#5-hướng-dẫn-cài-đặt)
6. [Biến môi trường](#6-biến-môi-trường)
7. [Các endpoint & cổng truy cập](#7-các-endpoint--cổng-truy-cập)
8. [Triển khai Production](#8-triển-khai-production)
9. [Kiểm thử (Testing)](#9-kiểm-thử-testing)
10. [API Proxy Rewrite](#10-api-proxy-rewrite)
11. [Tài liệu Quy trình (Workflows)](#11-tài-liệu-quy-trình-workflows)
12. [Hệ thống Kỹ năng Agentic & Thiết kế UI/UX](#12-hệ-thống-kỹ-năng-agentic--thiết-kế-uiux)

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                        Base Code                            │
│                                                             │
│   ┌───────────┐   ┌──────────────┐   ┌──────────────────┐  │
│   │  /admin   │   │    /user     │   │      /api        │  │
│   │ Next.js   │   │   Next.js    │   │     NestJS       │  │
│   │  :5003    │   │    :5002     │   │      :5001       │  │
│   └─────┬─────┘   └──────┬───────┘   └────────┬─────────┘  │
│         │                │                    │             │
│         └────────────────┴──── REST / WS ─────┘             │
│                                                             │
│                    ┌──────────────────┐                     │
│                    │   MongoDB :27017 │                     │
│                    │   Redis   :6379  │                     │
│                    └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

| Thành phần | Vai trò |
|---|---|
| `/api` | Backend NestJS — xử lý business logic, xác thực, lưu trữ, media, email, WebSocket |
| `/admin` | Dashboard quản trị — quản lý người dùng, cài đặt hệ thống, xem log |
| `/user` | Portal người dùng — đăng ký, đăng nhập, hồ sơ cá nhân |
| MongoDB | Lưu trữ dữ liệu chính — người dùng, cài đặt, file metadata, log |
| Redis | Cache, session, hàng đợi tác vụ (BullMQ), Socket.IO adapter |

---

## 2. Công nghệ sử dụng

### Backend — `/api`

| Nhóm | Thư viện | Phiên bản | Mục đích |
|---|---|---|---|
| **Core** | NestJS | 11.1.24 | Framework API modular |
| **Database** | Mongoose | 9.6.3 | ODM cho MongoDB |
| | MongoDB Driver | 7.2.0 | Kết nối trực tiếp |
| **Cache / Queue** | ioredis | 5.11.0 | Redis client |
| | BullMQ | 5.78.0 | Hàng đợi tác vụ bất đồng bộ |
| **Auth** | @nestjs/jwt | 11.0.2 | Tạo & xác minh JWT |
| | @nestjs/passport | 11.0.5 | Middleware xác thực |
| | passport | 0.7.0 | Auth strategies |
| **Real-time** | socket.io | 4.8.3 | WebSocket server |
| | @socket.io/redis-adapter | 8.3.0 | Scale WebSocket qua nhiều process |
| **Media** | sharp | 0.34.5 | Xử lý & tối ưu ảnh |
| | ffmpeg-static | 5.3.0 | Xử lý video (encode, transcode) |
| | ffprobe-static | 3.1.0 | Đọc metadata video |
| **Email** | nodemailer | 8.0.10 | Gửi email qua SMTP |
| | mustache | 4.2.0 | Template engine cho email |
| **Validation** | class-validator | 0.15.1 | Validate DTO |
| | class-transformer | 0.5.1 | Transform object |
| **Tài liệu** | @nestjs/swagger | 11.4.4 | Tự động sinh API docs |
| **Scheduler** | @nestjs/schedule | 6.1.3 | Cron job định kỳ |
| **HTTP** | axios | 1.16.1 | HTTP client |
| **Utilities** | yazl | 3.3.1 | Tạo file ZIP |
| **Runtime** | TypeScript | 6.0.3 | Ngôn ngữ lập trình |
| | Node.js | ≥ 18 LTS | Runtime |

### Frontend — `/admin` & `/user`

| Nhóm | Thư viện | Phiên bản | Mục đích |
|---|---|---|---|
| **Core** | Next.js | 16.2.7 | React framework (App Router, SSR/SSG) |
| | React | 19.2.7 | UI library |
| | TypeScript | 6.0.3 | Type safety |
| **Styling** | TailwindCSS | 4.3.0 | Utility-first CSS |
| | @tailwindcss/forms | 0.5.11 | Styled form elements |
| | @tailwindcss/typography | 0.5.19 | Prose styling |
| **UI Components** | @radix-ui/react-dialog | 1.1.15 | Accessible modal/dialog |
| | @radix-ui/react-dropdown-menu | 2.1.16 | Dropdown menu (admin) |
| | lucide-react | 1.17.0 | Icon library |
| | react-day-picker | 10.0.1 | Date picker component |
| **State** | zustand | 5.0.14 | Global state management |
| **Data Fetching** | swr | 2.4.1 | Data fetching + cache |
| | axios | 1.16.1 | HTTP client |
| **Real-time** | socket.io-client | 4.8.3 | WebSocket client |
| **Date** | date-fns | 4.4.0 | Tiện ích ngày tháng (user) |
| | dayjs | 1.11.21 | Tiện ích ngày tháng (admin) |
| **Notifications** | sweetalert2 | 11.26.25 | Alert dialog |
| | toaster-ui | 1.1.5 | Toast notifications |
| **Utilities** | js-cookie | 3.0.8 | Cookie management |
| | tailwind-merge | 3.6.0 | Merge Tailwind classes |
| | clsx | 2.1.1 | CSS class utilities |
| | lenis | 1.3.23 | Smooth scrolling |
| **Riêng Admin** | next-themes | 0.4.6 | Dark / Light mode |
| **Dùng chung** | react-lazy-hydration | 0.1.0 | Lazy hydration |

---

## 3. Cấu trúc thư mục

### API — `/api`

```
api/
├── src/
│   ├── app.module.ts              # Root module
│   ├── main.ts                    # Bootstrap (Express adapter, global filters)
│   ├── config/                    # Cấu hình theo nhóm
│   │   ├── app.ts                 # Port, URL, CORS
│   │   ├── redis.ts               # Redis host/port/db
│   │   ├── queue.ts               # BullMQ queue config
│   │   ├── file.ts                # Upload limits, directory
│   │   ├── image.ts               # Resize width/height/quality
│   │   ├── email.ts               # SMTP settings
│   │   └── env.ts                 # Env validation (Zod)
│   ├── kernel/                    # Cơ sở hạ tầng dùng chung
│   │   ├── logger/                # HTTP exception logger
│   │   ├── security/              # CORS, security headers
│   │   ├── exceptions/            # Custom exception classes
│   │   ├── infras/                # DB & queue providers
│   │   ├── events/                # Event system
│   │   ├── helpers/               # String utils, template render
│   │   ├── common/                # Pagination, search
│   │   └── models/                # Response models
│   └── modules/
│       ├── auth/                  # Xác thực JWT, Google OAuth
│       ├── user/                  # Quản lý người dùng
│       ├── settings/              # Cài đặt hệ thống
│       ├── file/                  # Upload, xử lý ảnh/video
│       ├── email/                 # Gửi email, SMTP config
│       ├── websocket/             # Socket.IO gateway + Redis adapter
│       ├── maintenance/           # Chế độ bảo trì
│       ├── monitoring/            # Log hệ thống, health check
│       └── backup/                # Sao lưu dữ liệu
├── migrations/                    # Migration MongoDB indexes
├── public/                        # Static files (uploads)
├── ecosystem.config.js            # PM2 production config
└── package.json
```

### Admin Dashboard — `/admin`

```
admin/
├── app/                           # Next.js App Router
│   ├── auth/                      # Trang đăng nhập admin
│   ├── dashboard/                 # Tổng quan hệ thống
│   ├── users/                     # Quản lý người dùng
│   ├── settings/                  # Cài đặt (Chung, Email, Xác thực, Sao lưu, Bảo trì)
│   ├── system-logs/               # Xem log hệ thống
│   ├── layout.tsx                 # Root layout
│   └── providers.tsx              # Error boundary, global error reporter
├── src/
│   ├── components/
│   │   ├── ui/                    # Component library tự xây
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx         # Custom Select (Radix DropdownMenu)
│   │   │   ├── date-picker.tsx    # DatePicker & DateRangePicker
│   │   │   ├── dialog.tsx
│   │   │   └── dropdown-menu.tsx
│   │   ├── common/                # AppErrorBoundary, UserAvatar, LazyHydrate
│   │   ├── settings/              # Tab components cho từng mục cài đặt
│   │   └── users/                 # User table, form, modal
│   ├── layouts/
│   │   └── AdminLayout.tsx        # Sidebar + Header + User dropdown
│   ├── services/                  # API service layer
│   │   ├── api-request.ts         # Base HTTP client (request ID, auto error report)
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── setting.service.ts
│   │   ├── backup.service.ts
│   │   ├── maintenance.service.ts
│   │   └── system-log.service.ts
│   ├── stores/                    # Zustand stores
│   │   ├── currentUserStore.ts
│   │   └── publicSiteSettingsStore.ts
│   └── lib/
│       ├── client-error-reporter.ts   # window.onerror, sendBeacon
│       ├── asset-url.ts
│       ├── date.ts
│       └── utils.ts
└── next.config.js                 # CSP headers, image domains, proxy
```

### User Portal — `/user`

```
user/
├── app/                           # Next.js App Router
│   ├── auth/                      # Đăng nhập / Đăng ký
│   ├── user/                      # Hồ sơ, cài đặt tài khoản
│   ├── maintenance/               # Trang thông báo bảo trì
│   ├── layout.tsx
│   └── providers.tsx              # Error boundary, global error reporter
├── src/
│   ├── components/
│   │   ├── ui/                    # Bộ component tương tự admin
│   │   ├── auth/                  # Form đăng nhập, đăng ký
│   │   ├── common/                # AppErrorBoundary, UserAvatar
│   │   ├── MaintenanceProvider.tsx
│   │   └── SiteSettingsHead.tsx   # SEO / meta từ settings API
│   ├── layouts/                   # UserLayout
│   ├── services/                  # API service layer
│   │   ├── api-request.ts         # Base HTTP client
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   ├── setting.service.ts
│   │   └── maintenance.service.ts
│   ├── stores/                    # Zustand stores (currentUser, siteSettings)
│   └── lib/
│       ├── client-error-reporter.ts
│       └── utils.ts
└── next.config.ts                 # CSP headers, image optimization
```

---

## 4. Tính năng đã triển khai

### Xác thực & Phân quyền
- JWT stateless authentication (issuer `base-code-api`, TTL 7 ngày)
- Google OAuth token verification
- Role-Based Access Control: `user`, `admin`, `super-admin`
- Auth guards và decorators cho từng endpoint
- Bộ controller riêng cho luồng user/admin
- Rate limiting: 20 request/15 phút cho auth, 60/10 phút cho upload

### Quản lý Người dùng
- CRUD người dùng đầy đủ (admin & self-service)
- Upload và quản lý avatar
- Phân trang, tìm kiếm, lọc danh sách
- Chặn / mở chặn tài khoản

### File & Media
- Upload file với validation loại và kích thước
  - Ảnh: tối đa 10 MB | Video: tối đa 100 MB
- Tối ưu ảnh bằng **Sharp**: resize (tối đa 1920×1080), nén chất lượng 82%, WebP
- Xử lý video bằng **FFmpeg**: transcode, thumbnail
- Metadata file lưu MongoDB; file vật lý tại `public/uploads/`
- Rate limit upload: 60 req / 10 phút

### Real-time — WebSocket
- Socket.IO gateway tích hợp trong API
- **Redis adapter** cho phép scale nhiều instance song song
- Gửi sự kiện live: thông báo, cập nhật trạng thái hệ thống
- Broadcast chế độ bảo trì đến tất cả client

### Email
- Cấu hình SMTP động qua trang Settings (không cần restart)
- Template HTML render bằng **Mustache**
- Hàng đợi gửi email async qua **BullMQ**

### Cài đặt Hệ thống
- Quản lý cài đặt chung: tên site, logo, thông tin liên hệ
- Cài đặt Email / SMTP
- Cài đặt xác thực (Google OAuth Client ID/Secret)
- Cài đặt sao lưu & bảo trì
- Endpoint public settings cho frontend đọc meta SEO

### Sao lưu & Bảo trì
- Tạo và tải xuống backup dữ liệu
- Bật / tắt chế độ bảo trì
- Middleware chặn request khi đang bảo trì
- Cron job dọn dẹp file tạm và log cũ

### Monitoring & Observability
- **Global Exception Filter** — bắt mọi exception, ghi vào MongoDB
- **Request Logging Interceptor** — log request chậm, gắn `X-Request-ID`
- **Process Error Handler** — `uncaughtException`, `unhandledRejection`, `SIGTERM`
- **Crash Detection** — Redis theo dõi active request, phát hiện crash khi bootstrap
- **Client Error Reporter** — frontend báo lỗi (`window.onerror`, `unhandledrejection`, React Error Boundary) về API qua `sendBeacon`
- **Health Check** endpoint — trả về trạng thái MongoDB + Redis
- **System Logs Viewer** — trang admin xem, lọc, export log với stats dashboard
- **AppErrorBoundary** — React error boundary ở cả hai frontend

### Giao diện Admin
- Sidebar có thể thu gọn (desktop) / ẩn qua Avatar Dropdown (mobile)
- Dark / Light mode (next-themes)
- Glassmorphism UI design
- Custom component library:
  - `Select` — dropdown đẹp với Radix DropdownMenu
  - `DatePicker` — single date, tự nhận vị trí top/bottom
  - `DateRangePicker` — 2 lịch độc lập, chiều cao cố định 6 hàng
  - `Dialog`, `Input`, `Button`, `DropdownMenu`
- Settings tab bar: kéo ngang không hiện scrollbar (drag-to-scroll)
- Lazy hydration cho các component nặng

### Bảo mật Frontend
- Content Security Policy (CSP) headers trên cả admin & user
- `X-Frame-Options: DENY`
- Permissions Policy (camera, microphone, payment)
- Referrer Policy
- Image optimization với TTL 7 ngày

---

## 5. Hướng dẫn cài đặt

### Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | 18 LTS (khuyến nghị 20+) |
| Yarn | 1.22+ |
| MongoDB | 6.0+ (chạy tại `localhost:27017`) |
| Redis | 6.0+ (chạy tại `localhost:6379`) |

### Bước 1 — Cấu hình biến môi trường

Dự án cung cấp script tự động:

```bash
# MacOS / Linux
bash setup-env.sh

# Hoặc force (không hỏi xác nhận)
bash setup-env-force.sh
```

Hoặc copy thủ công:

```bash
cp env/api.env.example   api/.env
cp env/admin.env.example admin/.env
cp env/user.env.example  user/.env
```

### Bước 2 — Cài đặt dependencies

```bash
# Chạy từng folder
cd api   && yarn install
cd user  && yarn install
cd admin && yarn install
```

### Bước 3 — Chạy migrations (tạo index MongoDB)

```bash
cd api && yarn migrate
```

### Bước 4 — Khởi động (mở 3 terminal riêng)

```bash
# Terminal 1 — API (port 5001)
cd api && yarn dev

# Terminal 2 — User Portal (port 5002)
cd user && yarn dev

# Terminal 3 — Admin Dashboard (port 5003)
cd admin && yarn dev
```

---

## 6. Biến môi trường

### API — `api/.env`

```env
NODE_ENV=development
HTTP_PORT=5001
BASE_URL=http://localhost:5001
USER_URL=http://localhost:5002
ADMIN_URL=http://localhost:5003
CORS_ORIGINS=http://localhost:5002,http://localhost:5003

# MongoDB
MONGO_URI=mongodb://localhost:27017/base-code

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# File upload
MAX_FILE_SIZE=104857600     # 100 MB

# Image processing
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
IMAGE_QUALITY=82

# Monitoring
MONITORING_ENABLED=true
SLOW_REQUEST_MS=1000
LOG_SUCCESS_REQUESTS=false
INSTANCE_ID=instance-1

LOG_LEVEL=debug
```

### Admin — `admin/.env`

```env
NODE_ENV=development
PORT=5003
NEXT_PUBLIC_API_ENDPOINT=http://localhost:5001
API_SERVER_ENDPOINT=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:5003
NEXT_PUBLIC_USER_URL=http://localhost:5002
NEXT_PUBLIC_SOCKET_ENDPOINT=http://localhost:5001
```

### User — `user/.env`

```env
NODE_ENV=development
PORT=5002
NEXT_PUBLIC_API_ENDPOINT=http://localhost:5001
API_SERVER_ENDPOINT=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:5002
NEXT_PUBLIC_SOCKET_ENDPOINT=http://localhost:5001
```

---

## 7. Các endpoint & cổng truy cập

| Dịch vụ | URL | Ghi chú |
|---|---|---|
| API | http://localhost:5001 | Backend chính |
| Swagger Docs | http://localhost:5001/api/docs | Tự động sinh từ decorators |
| Health Check | http://localhost:5001/health | Trạng thái MongoDB + Redis |
| User Portal | http://localhost:5002 | Frontend người dùng |
| Admin Dashboard | http://localhost:5003 | Frontend quản trị |

### Một số API routes chính

| Method | Path | Mô tả | Auth |
|---|---|---|---|
| POST | `/auth/login` | Đăng nhập | Public |
| POST | `/auth/register` | Đăng ký | Public |
| GET | `/users/me` | Thông tin bản thân | JWT |
| GET | `/admin/users` | Danh sách user | Admin |
| GET | `/admin/system-logs` | Xem logs | Admin |
| DELETE | `/admin/system-logs` | Xoá logs cũ | Admin |
| POST | `/logs/client-error` | Nhận lỗi client | Public |
| GET | `/health` | Health check | Public |
| GET | `/settings/public` | Cài đặt công khai | Public |
| POST | `/files/upload` | Upload file | JWT |

---

## 8. Triển khai Production

### Build

```bash
# API
cd api && yarn build
# Output: dist/

# Admin
cd admin && yarn build
# Output: .next/

# User
cd user && yarn build
# Output: .next/
```

### Chạy với PM2

Dự án đã có sẵn `api/ecosystem.config.js`:

```bash
cd api && pm2 start ecosystem.config.js

# Admin & User
pm2 start "yarn start" --name "admin" --cwd ./admin
pm2 start "yarn start" --name "user"  --cwd ./user
```

### Lưu ý Production

- Đặt `NODE_ENV=production` trong tất cả `.env`
- Thay `JWT_SECRET` bằng chuỗi ngẫu nhiên mạnh (≥ 32 ký tự)
- Cấu hình MongoDB replica set để đảm bảo HA
- Dùng Redis Sentinel hoặc Redis Cluster nếu cần HA
- Đặt `CORS_ORIGINS` đúng domain production
- Build API rồi copy thư mục `public/` vào `dist/` (script build đã làm tự động)
- Dùng reverse proxy (Nginx / Caddy) để phục vụ HTTPS

---

## Scripts tiện ích

| Script | Vị trí | Mô tả |
|---|---|---|
| `yarn dev` | Mỗi folder | Khởi động development server |
| `yarn build` | Mỗi folder | Build production |
| `yarn lint` | Mỗi folder | Kiểm tra & sửa lỗi ESLint |
| `yarn format` | Mỗi folder | Format code với Prettier |
| `yarn type-check` | Mỗi folder | Kiểm tra TypeScript |
| `yarn migrate` | `api/` | Chạy migration tạo indexes MongoDB |
| `yarn test:e2e` | `api/` | Chạy bộ kiểm thử E2E của Backend (Jest/Supertest) |
| `yarn test:e2e:watch` | `api/` | Chạy test E2E Backend ở chế độ Watch Mode |
| `yarn test:e2e:cov` | `api/` | Chạy test E2E Backend và xuất báo cáo coverage |
| `yarn test:e2e` | `admin/`, `user/` | Chạy bộ kiểm thử E2E của Frontend (Playwright) |
| `yarn test:e2e:ui` | `admin/`, `user/` | Chạy Playwright với giao diện tương tác UI Mode |
| `yarn test:e2e:report`| `admin/`, `user/` | Xem báo cáo kết quả kiểm thử HTML của Playwright |
| `setup-env.sh` | root | Tạo file `.env` từ template |
| `setup-env-force.sh` | root | Tạo file `.env` không hỏi xác nhận |

---

## 9. Kiểm thử (Testing)

Hệ thống được trang bị bộ kiểm thử toàn diện từ Backend đến Frontend để đảm bảo tính ổn định và tránh lỗi hồi quy (regression).

### 9.1. Backend Integration & E2E Testing (Jest + Supertest)

Thư mục: `api/test/`

Bộ test E2E kiểm tra toàn bộ luồng xử lý API thực tế bao gồm database và cache. Sử dụng `api/test/setup.ts` để khởi tạo NestJS Testing Module, áp dụng Validation Pipe giống hệt production và thực hiện clear database/Redis sau mỗi ca kiểm thử để đảm bảo tính độc lập.

#### Các test suite đã viết:
- `auth.e2e-spec.ts`: Đăng nhập, đăng ký, xác thực JWT, Google OAuth.
- `user.e2e-spec.ts`: Cập nhật thông tin profile, thay đổi mật khẩu, phân trang & lọc người dùng (Admin).
- `setting.e2e-spec.ts`: Đọc và cập nhật cấu hình hệ thống (SMTP, Google Auth, Chung), xử lý validation.
- `backup.e2e-spec.ts`: Quy trình tạo, tải xuống và quản lý backup.
- `file.e2e-spec.ts`: Upload avatar/file thường với validation dung lượng và định dạng.

#### Lệnh chạy test (tại thư mục `/api`):
```bash
# Chạy toàn bộ test suite E2E
yarn test:e2e

# Chạy ở chế độ Watch Mode (tự động chạy lại khi thay đổi code)
yarn test:e2e:watch

# Chạy test và tạo báo cáo độ phủ (Coverage Report)
yarn test:e2e:cov
```
> [!NOTE]
> Báo cáo Coverage sẽ được xuất ra thư mục `api/test/coverage/index.html`. Bạn có thể mở file này bằng trình duyệt để xem chi tiết các dòng code đã được chạy qua.

---

### 9.2. Frontend E2E Testing (Playwright)

Thư mục: `admin/e2e/` và `user/e2e/`

Playwright giả lập hành vi người dùng thật trên các môi trường trình duyệt phổ biến (Chromium, Firefox, WebKit) và các chế độ responsive (Mobile Safari, Mobile Chrome, Tablet Safari). Sử dụng kiến trúc Page Object Model (POM) để tách biệt giữa cấu trúc DOM và kịch bản kiểm thử.

#### Các kịch bản kiểm thử:
- **Admin Dashboard Portal (`admin/e2e/specs/`)**:
  - `auth.spec.ts`: Đăng nhập Admin, validation form, xử lý lỗi sai mật khẩu.
  - `dashboard.spec.ts`: Thống kê hệ thống, responsive sidebar (ẩn hiện khi đổi viewport).
  - `users.spec.ts`: Xem danh sách, tạo mới, chỉnh sửa, chặn/mở chặn tài khoản, bộ lọc và tìm kiếm.
  - `settings.spec.ts`: Lưu thông tin cấu hình và kiểm tra lưu trạng thái.
  - `system-logs.spec.ts`: Xem danh sách log, bộ lọc logs và xuất báo cáo logs.
  - `responsive.spec.ts`: Kiểm tra hiển thị tương thích trên Mobile/Tablet.
- **User Portal (`user/e2e/specs/`)**:
  - `auth.spec.ts`: Kịch bản đăng nhập, đăng ký, validate dữ liệu đầu vào.
  - `dashboard.spec.ts`: Truy cập trang profile cá nhân, kiểm tra hiển thị thông tin.
  - `settings.spec.ts`: Thay đổi thông tin cá nhân, cập nhật avatar.
  - `maintenance.spec.ts`: Kịch bản kích hoạt bảo trì và kiểm tra màn hình khóa, kiểm tra live-update qua WebSocket.
  - `responsive.spec.ts`: Kiểm tra hiển thị tương thích trên Mobile/Tablet.

#### Lệnh chạy test (tại thư mục `/admin` hoặc `/user`):
Trước tiên, hãy đảm bảo rằng bạn đã cài đặt các trình duyệt của Playwright:
```bash
npx playwright install
```

Sau đó chạy các lệnh sau:
```bash
# Chạy kiểm thử ở chế độ headless (chạy ngầm)
yarn test:e2e

# Chạy với giao diện tương tác UI Mode (Playwright Test Runner)
yarn test:e2e:ui

# Hiển thị báo cáo kết quả kiểm thử dưới dạng HTML
yarn test:e2e:report
```

> [!TIP]
> Trong quá trình chạy test, nếu xảy ra lỗi, Playwright sẽ tự động chụp ảnh màn hình (screenshot) và quay video lưu lại trong thư mục `test-results/` (đã được cấu hình gitignore để không commit lên).

---

## 10. API Proxy Rewrite

Nhằm nâng cao tính bảo mật và chuẩn hoá các kết nối API, dự án đã cấu hình Next.js Rewrites trong cả hai module `admin` và `user`.

### 10.1. Cơ chế hoạt động
Mọi yêu cầu gọi từ Client-side (trình duyệt) thay vì gọi trực tiếp đến API Server (port `5001`) sẽ được gửi đến endpoint tương đối `/api-backend/:path*` của Next.js Server. Next.js Server đóng vai trò là một Reverse Proxy nhận yêu cầu này và chuyển hướng (proxy) tới API Server được cấu hình qua biến môi trường.

![Sơ đồ hoạt động Next.js API Rewrite Proxy](/Users/nguyendam/Documents/Study/base-code/docs/workflows/assets/api_proxy_workflow.png)

### 10.2. Lợi ích mang lại
1. **Giải quyết CORS triệt để**: Tránh lỗi Cross-Origin Resource Sharing do Client gọi trực tiếp tới domain khác của API Server. Cả client và server (ảo) chạy trên cùng một origin.
2. **Ẩn thông tin backend**: Port/URL thực của Backend API Server không bị lộ trực tiếp trong code frontend của client, hỗ trợ bảo mật hệ thống.
3. **Cấu hình động dễ dàng**: Chỉ cần thay đổi biến môi trường `NEXT_PUBLIC_API_ENDPOINT` trên Server Next.js mà không cần sửa đổi bất kỳ code client nào.

Cấu hình chi tiết nằm ở [admin/next.config.js](file:///Users/nguyendam/Documents/Study/base-code/admin/next.config.js#L54-L61) và [user/next.config.ts](file:///Users/nguyendam/Documents/Study/base-code/user/next.config.ts#L61-L68).

---

## 11. Tài liệu Quy trình (Workflows)

Để xem chi tiết sơ đồ trình tự (Sequence Diagrams), cấu trúc thư mục code, schemas liên quan và luồng dữ liệu của từng tính năng lớn trong hệ thống, hãy truy cập thư mục tài liệu:

- **Tổng quan kiến trúc quy trình**: [workflows/README.md](file:///Users/nguyendam/Documents/Study/base-code/docs/workflows/README.md)
- **Luồng Xác thực & RBAC**: [workflows/authentication.md](file:///Users/nguyendam/Documents/Study/base-code/docs/workflows/authentication.md)
- **Luồng Quản lý người dùng & Avatar**: [workflows/user_management.md](file:///Users/nguyendam/Documents/Study/base-code/docs/workflows/user_management.md)
- **Luồng Tải lên & Xử lý Media (Sharp/FFmpeg)**: [workflows/file_media_processing.md](file:///Users/nguyendam/Documents/Study/base-code/docs/workflows/file_media_processing.md)
- **Luồng Đồng bộ WebSocket real-time & Redis**: [workflows/realtime_websocket.md](file:///Users/nguyendam/Documents/Study/base-code/docs/workflows/realtime_websocket.md)
- **Luồng Chế độ bảo trì & Streaming Backup**: [workflows/maintenance_backup.md](file:///Users/nguyendam/Documents/Study/base-code/docs/workflows/maintenance_backup.md)
- **Luồng Logging & Giám sát hệ thống**: [workflows/monitoring_observability.md](file:///Users/nguyendam/Documents/Study/base-code/docs/workflows/monitoring_observability.md)

---

## 12. Hệ thống Kỹ năng Agentic & Thiết kế UI/UX (Agentic Skills & UI/UX Guidelines)

Dự án tích hợp các bộ quy chuẩn kỹ nghệ, thiết kế giao diện và vận hành AI Agent chuyên nghiệp tại thư mục `docs/`. Khi AI Agent bắt đầu phiên làm việc, bắt buộc phải đối chiếu các chỉ dẫn này để đảm bảo chất lượng code và giao diện ở mức cao nhất.

### 12.1. Bộ Kỹ năng Vận hành AI Agent (Agentic Workflows)
- **Superpowers Agentic Skills**: Quy trình lập kế hoạch (`writing-plans`), thực thi (`executing-plans`), kiểm thử hướng phát triển (`test-driven-development`) và gỡ lỗi khoa học (`systematic-debugging`).
  - Hướng dẫn chi tiết: [docs/superpowers/](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/)
- **Addy Osmani Agent Skills**: Các quy chuẩn kỹ nghệ chuẩn quốc tế như Doubt-Driven Development, Hyrum's Law trong thiết kế API, Chesterton's Fence trong rút gọn code và quy tắc bảo mật.
  - Hướng dẫn chi tiết: [docs/agent-skills/](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/)
- **Matt Pocock Agentic Skills**: Quy trình làm rõ yêu cầu thô (`grill-me`), chẩn đoán lỗi (`diagnose`), phân rã spec (`to-issues`) và tối ưu kiến trúc.
  - Hướng dẫn chi tiết: [docs/matt-pocock-skills/](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/)
- **Everything Claude Code (ECC) Cherry-picked**: Kỹ năng chuyên biệt cho NestJS patterns, Turbopack và tối ưu hóa hiệu năng React.
  - Hướng dẫn chi tiết: [docs/everything-claude-code/](file:///Users/nguyendam/Documents/Study/base-code/docs/everything-claude-code/)
- **Antigravity Awesome Skills (AAS)**: Bộ chỉ dẫn phát triển API (`api-endpoint-builder`), tối ưu hiệu năng (`performance-optimizer`), tích hợp Firecrawl (`firecrawl-integration`), kiểm tra pre-push và bảo mật container.
  - Hướng dẫn chi tiết: [docs/antigravity-awesome-skills/](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/)

### 12.2. Quy chuẩn Thiết kế UI/UX & Giao diện Premium
- **Taste-Skill Frontend Guidelines**: Quy tắc chống thiết kế mặc định kiểu AI (AI slop), xây dựng bento grids, sử dụng typography chuyên nghiệp và phong cách tối giản.
  - Hướng dẫn chi tiết: [docs/taste-skill/](file:///Users/nguyendam/Documents/Study/base-code/docs/taste-skill/)
- **UI/UX Pro Max - Design Intelligence Engine**: Động cơ hỗ trợ lập luận thiết kế ngoại tuyến với cơ sở dữ liệu về 67 phong cách UI, 161 bảng phối màu, 99 luật UX và 25 biểu đồ. Hỗ trợ tạo cấu hình hệ thống thiết kế tổng thể (Master/Overrides) qua script Python.
  - Hướng dẫn chi tiết: [docs/ui-ux-pro-max/](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/)
