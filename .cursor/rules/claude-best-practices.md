---
description: Hướng dẫn kỹ nghệ Agent và tối ưu hiệu suất cho AI (Claude Code Best Practices)
globs: "*"
alwaysApply: true
---

# Kỹ nghệ Agentic & Tối ưu Hiệu suất AI (Agentic Engineering Practices)

Tài liệu này tích hợp các best practices thực chiến từ cộng đồng `shanraisshan/claude-code-best-practice`, hướng dẫn AI Agent cách tự quản lý bộ nhớ ngữ cảnh, tối ưu hiệu suất token và làm việc có kỷ luật.

---

## 1. Cơ chế Quản lý Ngữ cảnh (Context & Memory Management)

Để tránh hiện tượng AI bị "ảo giác" (hallucination) hoặc nhầm lẫn do bộ nhớ ngữ cảnh bị phình to và tích tụ quá nhiều log lệnh cũ, AI Agent phải tuân thủ:

- **Reset Ngữ cảnh chủ động (Context Reset)**:
  - Khi hoàn thành một giai đoạn công việc (ví dụ: chuyển từ Lên kế hoạch thiết kế sang Thực thi viết code, hoặc chuyển từ Viết code sang Viết test E2E), AI phải đề xuất người dùng bắt đầu một phiên chat mới (hoặc sử dụng lệnh `/clear` / `/reset` nếu chạy trên CLI).
  - Điều này giúp làm sạch token, giải phóng các thông tin rác từ các bước trước và tập trung 100% tài nguyên xử lý vào tác vụ hiện tại.
- **Đọc file có chọn lọc (Restrained File Reading)**:
  - Tránh việc đọc vô tội vạ toàn bộ file trong các thư mục lớn (`node_modules`, `dist`, `.next`).
  - Ưu tiên sử dụng `grep_search` để tìm chính xác từ khóa, sau đó chỉ dùng `view_file` trên các file thực sự liên quan đến tác vụ.

---

## 2. Chia nhỏ tác vụ (Task Decomposition)

- **Tác vụ nguyên tử (Atomic Tasks)**: Mọi yêu cầu lớn phải được AI tự động phân rã thành các tác vụ nhỏ hơn có thể hoàn thành và kiểm thử trong vòng 5 - 10 phút.
- **Lập kế hoạch trước khi làm (Plan-First)**:
  - Với các thay đổi chạm vào nhiều file hoặc liên quan đến cấu trúc thư mục, AI bắt buộc phải khởi chạy ở chế độ lập kế hoạch (Planning Mode) trước khi bắt tay viết code.
  - Sử dụng thẻ `<important if="...">` trong các cấu hình để AI ưu tiên xử lý các ràng buộc quan trọng nhất tùy thuộc vào file đang mở.

---

## 3. Vòng lặp Xác thực Chặt chẽ (Verification Loop)

AI Agent không được phép phán đoán xem code có chạy đúng hay không qua "cảm giác". Phải luôn chạy các lệnh xác thực cơ sở:

1. **Kiểm tra biên dịch**: Chạy `yarn type-check` để TypeScript kiểm tra lỗi cú pháp và kiểu dữ liệu.
2. **Kiểm tra tiêu chuẩn mã nguồn**: Chạy `yarn lint` để xác thực định dạng code.
3. **Chạy kiểm thử tự động**: Chạy các test suite liên quan trực tiếp đến file vừa sửa đổi (ví dụ: `yarn test:e2e` cho API hoặc Playwright).
4. **Không đoán kết quả**: Nếu lệnh chạy lỗi, bắt buộc phải đọc log lỗi đầy đủ, không tự ý giả định nguyên nhân.

---

## 4. Giao tiếp Kỷ luật (Disciplined Communication)

- **Tập trung vào hành động**: Tránh các câu giải thích dài dòng, lý thuyết hoặc lặp lại code cũ. Chỉ tập trung vào mã nguồn cần thay đổi dưới dạng diff hoặc code block hoàn chỉnh.
- **Không dùng placeholder**: Tuyệt đối không viết code chứa bình luận bỏ lửng kiểu `// viết tiếp ở đây...` hoặc `// giữ nguyên code cũ...`. Mọi code xuất ra phải là code hoàn chỉnh, chạy được ngay.
- **Thành thực về giới hạn**: Nếu thiếu thông tin hoặc gặp lỗi không thể tự giải quyết bằng các công cụ hiện có, AI phải dừng lại lập tức để thảo luận trực tiếp với người dùng, không tự ý đoán mò hoặc thử sai vô tội vạ.
