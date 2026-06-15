---
description: Danh mục hệ thống Kỹ năng Superpowers tích hợp sẵn trong dự án
globs: "*"
alwaysApply: true
---

# Hệ thống Kỹ năng Superpowers (Superpowers Agentic Skills)

Dự án này đã tích hợp đầy đủ bộ kỹ năng **Superpowers** của tác giả Jesse Vincent từ thư viện `obra/superpowers`. Toàn bộ mã nguồn, cấu trúc và hướng dẫn vận hành chi tiết của từng kỹ năng đã được lưu trữ cục bộ trong dự án tại thư mục [docs/superpowers/](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/).

Khi thực hiện các tác vụ phát triển, gỡ lỗi hoặc kiểm thử, AI Agent **bắt buộc** phải tự động mở và đọc tệp tin `SKILL.md` của các kỹ năng tương ứng dưới đây để kích hoạt đúng quy trình làm việc.

---

## Danh sách Kỹ năng chi tiết (Kèm liên kết trực tiếp)

### 1. Nhóm Lập kế hoạch & Quản lý tác vụ (Collaboration & Planning)
- **`using-superpowers`**: Quy chuẩn chung về cách AI sử dụng và tương tác thông qua Superpowers.
  - Hướng dẫn chi tiết: [using-superpowers/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/using-superpowers/SKILL.md)
- **`writing-plans`**: Thiết lập spec kỹ thuật và tài liệu hóa kế hoạch thay đổi trước khi viết mã nguồn.
  - Hướng dẫn chi tiết: [writing-plans/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/writing-plans/SKILL.md)
- **`executing-plans`**: Hướng dẫn thực thi kế hoạch theo từng giai đoạn, sử dụng checklists để đảm bảo không bỏ sót việc.
  - Hướng dẫn chi tiết: [executing-plans/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/executing-plans/SKILL.md)
- **`brainstorming`**: Hướng dẫn thảo luận và tối ưu hóa các yêu cầu thiết kế nghiệp vụ phức tạp.
  - Hướng dẫn chi tiết: [brainstorming/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/brainstorming/SKILL.md)

### 2. Nhóm Kiểm thử & Gỡ lỗi (Testing & Debugging)
- **`test-driven-development`**: Quy trình phát triển hướng kiểm thử (TDD). Nguyên tắc *"Không viết code sản xuất trước khi có test thất bại"*.
  - Hướng dẫn chi tiết: [test-driven-development/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/test-driven-development/SKILL.md)
- **`systematic-debugging`**: Quy trình gỡ lỗi khoa học qua 4 giai đoạn, viết test tái hiện lỗi trước khi sửa.
  - Hướng dẫn chi tiết: [systematic-debugging/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/systematic-debugging/SKILL.md)
- **`verification-before-completion`**: Trình tự tự động kiểm tra biên dịch, lint, test suite để đảm bảo an toàn tuyệt đối trước khi kết thúc công việc.
  - Hướng dẫn chi tiết: [verification-before-completion/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/verification-before-completion/SKILL.md)

### 3. Nhóm Phối hợp & Subagents (Subagents & Review)
- **`subagent-driven-development`**: Phân chia công việc và ủy quyền cho các subagents thực thi song song dưới sự kiểm soát của Agent chính.
  - Hướng dẫn chi tiết: [subagent-driven-development/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/subagent-driven-development/SKILL.md)
- **`dispatching-parallel-agents`**: Cơ chế điều phối và thu thập kết quả từ nhiều subagents cùng một lúc.
  - Hướng dẫn chi tiết: [dispatching-parallel-agents/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/dispatching-parallel-agents/SKILL.md)
- **`requesting-code-review`**: Quy trình tự kiểm tra code và chuẩn bị tài liệu giải thích trước khi yêu cầu Code Review từ người dùng.
  - Hướng dẫn chi tiết: [requesting-code-review/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/requesting-code-review/SKILL.md)
- **`receiving-code-review`**: Quy trình tiếp thu ý kiến đóng góp của người dùng và sửa đổi code một cách có hệ thống.
  - Hướng dẫn chi tiết: [receiving-code-review/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/receiving-code-review/SKILL.md)

### 4. Nhóm Quản lý Git & Nhánh (Git & Branches)
- **`using-git-worktrees`**: Cách quản lý các không gian làm việc độc lập trên Git sử dụng Worktrees để tránh xung đột mã nguồn.
  - Hướng dẫn chi tiết: [using-git-worktrees/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/using-git-worktrees/SKILL.md)
- **`finishing-a-development-branch`**: Chuẩn hóa quy trình hoàn thành nhánh phát triển, tạo Pull Request và dọn dẹp môi trường.
  - Hướng dẫn chi tiết: [finishing-a-development-branch/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/finishing-a-development-branch/SKILL.md)

### 5. Meta-Skills (Kỹ năng Meta)
- **`writing-skills`**: Hướng dẫn tự viết và kiểm thử thêm các kỹ năng mới cho Agent trong dự án.
  - Hướng dẫn chi tiết: [writing-skills/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/superpowers/writing-skills/SKILL.md)

---

## Chỉ dẫn dành cho AI Agent
Khi nhận được bất kỳ nhiệm vụ nào:
1. Hãy tìm kiếm xem nhiệm vụ đó thuộc nhóm kỹ năng nào trên đây.
2. Dùng công cụ đọc file để đọc chi tiết file `SKILL.md` tương ứng trong thư mục `docs/superpowers/` để nhận chỉ dẫn.
3. Thực thi đúng theo các yêu cầu nghiêm ngặt được mô tả trong file skill đó.
