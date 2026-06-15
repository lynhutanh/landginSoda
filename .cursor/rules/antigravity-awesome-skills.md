---
description: Quy trình áp dụng các Kỹ năng Chuyên biệt từ Antigravity Awesome Skills (AAS)
globs: "*"
alwaysApply: true
---

# Quy trình Kỹ năng Chuyên biệt - Antigravity Awesome Skills (AAS)

Dự án này đã tích hợp các gói kỹ năng chuyên biệt được tuyển chọn từ thư viện **Antigravity Awesome Skills** của tác giả `sickn33/antigravity-awesome-skills`. Các kỹ năng này bao gồm hướng dẫn tối ưu cho lập trình viên full-stack, kiểm thử tự động, và bảo mật hệ thống.

Toàn bộ tài liệu chi tiết của các kỹ năng được lưu trữ tại thư mục [docs/antigravity-awesome-skills/](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/). AI Agent **bắt buộc** phải tự động tham chiếu và tuân thủ các chỉ dẫn tương ứng dưới đây khi thực hiện các tác vụ phát triển, gỡ lỗi, kiểm thử hoặc tối ưu hóa dự án mà không cần người dùng yêu cầu thủ công.

---

## Danh mục Kỹ năng & Liên kết Trực tiếp

### 1. Phát triển Web & API (Backend NestJS / Frontend Next.js)
* **`api-endpoint-builder`**: Tiêu chuẩn thiết kế, mở rộng và tài liệu hóa các RESTful/GraphQL API endpoints.
  * Chỉ dẫn chi tiết: [api-endpoint-builder/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/api-endpoint-builder/SKILL.md)
* **`performance-optimizer`**: Các mẫu thiết kế giúp tối ưu hóa thời gian phản hồi của server, tối ưu truy vấn database và giảm thiểu tài nguyên sử dụng.
  * Chỉ dẫn chi tiết: [performance-optimizer/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/performance-optimizer/SKILL.md)
* **`firecrawl-integration`**: Tích hợp cào/quét dữ liệu web bằng Firecrawl SDK phục vụ chatbot AI và RAG.
  * Chỉ dẫn chi tiết: [firecrawl-integration/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/firecrawl-integration/SKILL.md)

### 2. Gỡ lỗi & Kiểm soát Logic (Debugging)
* **`bug-hunter`**: Quy trình 5 bước phát hiện lỗi nhanh, phân tích nguyên nhân gốc rễ và đưa ra bản vá lỗi an toàn.
  * Chỉ dẫn chi tiết: [bug-hunter/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/bug-hunter/SKILL.md)
* **`logic-lens`**: Rà soát lỗi logic phức tạp, phát hiện các trường hợp biên nguy hiểm (edge cases) và đảm bảo tính đúng đắn của giải thuật.
  * Chỉ dẫn chi tiết: [logic-lens/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/logic-lens/SKILL.md)
* **`brooks-lint`**: Rà soát chất lượng code, độ phức tạp cấu trúc (coupling/complexity) dựa trên các nguyên tắc công nghệ phần mềm kinh điển.
  * Chỉ dẫn chi tiết: [brooks-lint/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/brooks-lint/SKILL.md)

### 3. Kiểm thử & Đo lường QA (Testing)
* **`k6-load-testing`**: Quy trình viết kịch bản và chạy thử nghiệm hiệu năng chịu tải (Load testing) với K6.
  * Chỉ dẫn chi tiết: [k6-load-testing/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/k6-load-testing/SKILL.md)
* **`codebase-audit-pre-push`**: Quy chuẩn rà soát chất lượng codebase trước khi đẩy commit lên Git hoặc khởi chạy quy trình CI/CD.
  * Chỉ dẫn chi tiết: [codebase-audit-pre-push/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/codebase-audit-pre-push/SKILL.md)

### 4. Bảo mật Hệ thống (Security)
* **`container-security-hardening`**: Các nguyên tắc đóng gói Docker an toàn, giảm thiểu diện tích tấn công và tối ưu hóa phân quyền container.
  * Chỉ dẫn chi tiết: [container-security-hardening/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/container-security-hardening/SKILL.md)
* **`security`**: Các kỹ năng và quy chuẩn bảo mật đám mây, xoay vòng khóa bảo mật và quản lý thông tin nhạy cảm.
  * Chỉ dẫn chi tiết: [security/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/antigravity-awesome-skills/security/SKILL.md)

---

## Hướng dẫn Tự động hóa dành cho AI Agent
Khi nhận bất kỳ yêu cầu nào từ người dùng:
1. **Phát triển API/Tính năng**: Hãy chủ động đọc `api-endpoint-builder` và `performance-optimizer` để đảm bảo code sạch, tối ưu. Nếu xây dựng tính năng Chatbot/RAG liên quan đến cào dữ liệu URL, hãy tham chiếu `firecrawl-integration`.
2. **Gặp lỗi/Sửa lỗi**: Không sửa lỗi tự phát. Bắt buộc rà soát mã nguồn theo quy trình của `bug-hunter` và kiểm tra biên với `logic-lens`.
3. **Trước khi kết thúc tác vụ**: Tự động chạy quét chất lượng hoặc đối chiếu với `codebase-audit-pre-push` để đảm bảo không để lại code rác hoặc lỗi cú pháp.
