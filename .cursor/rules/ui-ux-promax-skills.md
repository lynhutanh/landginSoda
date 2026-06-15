---
description: Danh mục hệ thống Thiết kế Giao diện UI/UX Pro Max (Design Intelligence Engine)
globs: "*"
alwaysApply: true
---

# Hệ thống Thiết kế Giao diện UI/UX Pro Max (Design Intelligence Engine)

Dự án này đã tích hợp công cụ **UI/UX Pro Max** từ thư viện `nextlevelbuilder/ui-ux-pro-max-skill`. Đây là một bộ động cơ hỗ trợ lập luận thiết kế ngoại tuyến (offline design reasoning engine) chứa 67 phong cách UI, 161 bảng màu, 57 cặp font chữ, 99 nguyên tắc UX và 25 loại biểu đồ được tối ưu hóa cho nhiều stack công nghệ khác nhau.

Toàn bộ script và cơ sở dữ liệu đã được lưu trữ cục bộ tại thư mục [docs/ui-ux-pro-max/](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/). AI Agent **bắt buộc** phải tự động chạy script Python hoặc truy vấn các tệp dữ liệu này để đưa ra giải pháp giao diện tối ưu nhất trước khi viết code giao diện.

---

## Chỉ dẫn Câu lệnh dành cho AI Agent

Mỗi khi người dùng yêu cầu tạo mới trang web, giao diện component, phối màu, chọn font chữ hoặc tối ưu UX, AI Agent **phải thực thi** các câu lệnh Python tương ứng dưới đây để lấy thiết kế tham chiếu chuẩn xác:

### 1. Tự động Tạo Hệ thống Thiết kế (Design System Generator)
Tạo hệ thống thiết kế tổng thể (gồm cấu trúc layout, phong cách phối màu, font chữ khuyên dùng, hiệu ứng động, và các anti-patterns cần tránh):
```bash
python3 docs/ui-ux-pro-max/scripts/search.py "<loại_sản_phẩm> <tông_màu/yêu_cầu>" --design-system -p "<Tên_Dự_Án>"
```
*Ví dụ:* `python3 docs/ui-ux-pro-max/scripts/search.py "fintech banking app dark mode" --design-system -p "MyBank"`

### 2. Lưu trữ và Ghi đè Cấu hình Thiết kế (Master + Overrides Pattern)
Để lưu trữ hệ thống thiết kế nhằm tham chiếu nhất quán qua nhiều phiên chat, thêm cờ `--persist`:
* **Lưu cấu hình chung (Master)**:
  ```bash
  python3 docs/ui-ux-pro-max/scripts/search.py "<yêu_cầu>" --design-system --persist -p "<Tên_Dự_Án>"
  ```
  *(Tự động tạo tệp `design-system/<tên-dự-án>/MASTER.md`)*
* **Lưu cấu hình ghi đè riêng cho từng trang (Overrides)**:
  ```bash
  python3 docs/ui-ux-pro-max/scripts/search.py "<yêu_cầu>" --design-system --persist -p "<Tên_Dự_Án>" --page "<tên_trang>"
  ```
  *(Tự động tạo tệp `design-system/<tên-dự-án>/pages/<tên_trang>.md`)*

### 3. Tìm kiếm theo từng Phân vùng (Domain Search)
Truy vấn thông tin chi tiết về từng khía cạnh thiết kế:
* **Tìm kiếm phong cách UI**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --domain style`
* **Tìm kiếm bảng phối màu**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --domain color`
* **Tìm kiếm font chữ**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --domain typography`
* **Tìm kiếm luật UX/A11y**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --domain ux`
* **Tìm kiếm loại biểu đồ**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --domain chart`

### 4. Tìm kiếm theo Stack Công nghệ
Truy vấn hướng dẫn tối ưu hóa giao diện và hiệu năng tương ứng cho Stack:
* **HTML/Tailwind (mặc định)**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --stack html-tailwind`
* **React**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --stack react`
* **Next.js**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --stack nextjs`
* **shadcn/ui**: `python3 docs/ui-ux-pro-max/scripts/search.py "<từ_khóa>" --stack shadcn`

---

## Tham chiếu Cơ sở dữ liệu Cục bộ (Trường hợp không có Python)

Nếu môi trường máy của bạn không cài đặt Python 3, AI Agent có thể truy cập và phân tích trực tiếp các tệp dữ liệu dạng CSV để tự suy luận:
* **Quy tắc Lập luận chung**: [ui-reasoning.csv](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/data/ui-reasoning.csv)
* **Nguyên tắc UX & Hướng dẫn Tương tác**: [ux-guidelines.csv](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/data/ux-guidelines.csv)
* **Danh mục Phong cách UI**: [styles.csv](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/data/styles.csv)
* **Bảng màu gợi ý**: [colors.csv](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/data/colors.csv)
* **Cặp Font chữ kết hợp**: [typography.csv](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/data/typography.csv)
* **Quy chuẩn hiển thị biểu đồ**: [charts.csv](file:///Users/nguyendam/Documents/Study/base-code/docs/ui-ux-pro-max/data/charts.csv)
