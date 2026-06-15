---
description: Danh mục hệ thống Kỹ năng Kỹ thuật của Matt Pocock (Matt Pocock Agentic Skills)
globs: "*"
alwaysApply: true
---

# Hệ thống Kỹ năng Kỹ thuật của Matt Pocock (Matt Pocock Agentic Skills)

Dự án này đã tích hợp đầy đủ bộ kỹ năng thiết kế quy trình kỹ thuật **Matt Pocock Skills** từ thư viện `mattpocock/skills`. Bộ kỹ năng này tập trung vào các quy trình kỹ thuật chuẩn chỉnh (TDD, chuẩn bị PRD, phân rã công việc thành issue, debug khoa học, tạo dựng ngôn ngữ chung...) giúp tăng tính căn chỉnh, giao tiếp và chất lượng mã nguồn giữa AI Agent và Lập trình viên.

Toàn bộ tài liệu hướng dẫn và nguyên tắc chi tiết đã được lưu trữ cục bộ tại thư mục [docs/matt-pocock-skills/](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/). AI Agent **bắt buộc** phải tự động mở và đọc tệp tin `SKILL.md` tương ứng dưới đây khi thực hiện các tác vụ phát triển liên quan.

---

## Danh sách Kỹ năng chi tiết (Kèm liên kết trực tiếp)

### 1. Nhóm Kỹ nghệ & Quy trình Phát triển (Engineering Skills)
- **`grill-with-docs`**: Phiên vấn đáp (grilling) chuyên sâu để đối chiếu kế hoạch phát triển với mô hình nghiệp vụ (Domain Model), tinh chỉnh thuật ngữ và cập nhật `CONTEXT.md` / ADRs inline.
  - Hướng dẫn chi tiết: [grill-with-docs/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/grill-with-docs/SKILL.md)
- **`tdd`**: Quy trình phát triển hướng kiểm thử (TDD) với vòng lặp Red-Green-Refactor (Đỏ-Xanh-Tái cấu trúc).
  - Hướng dẫn chi tiết: [tdd/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/tdd/SKILL.md)
- **`diagnose`**: Quy trình chẩn đoán lỗi khoa học đối với các lỗi khó và suy giảm hiệu năng: Tái hiện -> Thu nhỏ phạm vi -> Giả thuyết -> Đo đạc -> Sửa lỗi -> Kiểm thử hồi quy.
  - Hướng dẫn chi tiết: [diagnose/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/diagnose/SKILL.md)
- **`improve-codebase-architecture`**: Tìm kiếm các cơ hội làm sâu sắc và tối ưu hóa kiến trúc codebase dựa trên ngôn ngữ chung trong `CONTEXT.md` và các quyết định thiết kế trong `docs/adr/`.
  - Hướng dẫn chi tiết: [improve-codebase-architecture/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/improve-codebase-architecture/SKILL.md)
- **`to-prd`**: Chuyển đổi ngữ cảnh cuộc hội thoại hiện tại thành tài liệu yêu cầu sản phẩm (PRD).
  - Hướng dẫn chi tiết: [to-prd/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/to-prd/SKILL.md)
- **`to-issues`**: Phân rã bất kỳ kế hoạch, spec hay PRD nào thành các issue độc lập theo từng lát cắt dọc (Vertical Slices).
  - Hướng dẫn chi tiết: [to-issues/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/to-issues/SKILL.md)
- **`triage`**: Quy trình phân loại và xử lý các lỗi/issue thông qua các vai trò phân loại cụ thể.
  - Hướng dẫn chi tiết: [triage/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/triage/SKILL.md)
- **`zoom-out`**: Yêu cầu AI lùi lại để giải thích mã nguồn trong ngữ cảnh toàn hệ thống thay vì tập trung vào chi tiết hẹp.
  - Hướng dẫn chi tiết: [zoom-out/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/zoom-out/SKILL.md)
- **`prototype`**: Xây dựng nguyên mẫu thử nghiệm nhanh dưới dạng ứng dụng terminal chạy được hoặc các phương án UI khác nhau.
  - Hướng dẫn chi tiết: [prototype/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/prototype/SKILL.md)
- **`setup-matt-pocock-skills`**: Thiết lập các cấu hình cần thiết trước khi chạy các kỹ năng kỹ thuật trên (thiết lập công cụ theo dõi issue, nhãn triage, tài liệu domain).
  - Hướng dẫn chi tiết: [setup-matt-pocock-skills/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/engineering/setup-matt-pocock-skills/SKILL.md)

### 2. Nhóm Năng suất (Productivity Skills)
- **`grill-me`**: Phỏng vấn liên tục người dùng về kế hoạch thiết kế cho đến khi giải quyết được mọi nhánh quyết định và điểm mơ hồ (áp dụng cho các tác vụ không chuyên về code).
  - Hướng dẫn chi tiết: [grill-me/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/productivity/grill-me/SKILL.md)
- **`handoff`**: Đóng gói cuộc hội thoại hiện tại thành tài liệu handoff ngắn gọn để AI Agent khác hoặc phiên làm việc khác tiếp tục thực hiện mà không mất ngữ cảnh.
  - Hướng dẫn chi tiết: [handoff/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/productivity/handoff/SKILL.md)
- **`caveman`**: Chế độ giao tiếp siêu nén giúp tiết kiệm 75% token bằng cách bỏ qua các từ đệm rườm rà nhưng vẫn giữ tính chính xác về mặt kỹ thuật.
  - Hướng dẫn chi tiết: [caveman/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/productivity/caveman/SKILL.md)
- **`write-a-skill`**: Hướng dẫn tạo mới một kỹ năng (skill) đúng cấu trúc và đầy đủ tài nguyên đi kèm.
  - Hướng dẫn chi tiết: [write-a-skill/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/productivity/write-a-skill/SKILL.md)

### 3. Nhóm Kỹ năng Tiện ích & Hỗ trợ (Misc & Utilities)
- **`git-guardrails-claude-code`**: Cấu hình hooks để ngăn AI chạy các lệnh git nguy hiểm (push, reset --hard, clean, v.v.).
  - Hướng dẫn chi tiết: [git-guardrails-claude-code/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/misc/git-guardrails-claude-code/SKILL.md)
- **`setup-pre-commit`**: Thiết lập Husky pre-commit hooks cùng lint-staged, Prettier, kiểm tra kiểu dữ liệu (TypeScript) và kiểm thử tự động.
  - Hướng dẫn chi tiết: [setup-pre-commit/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/misc/setup-pre-commit/SKILL.md)
- **`migrate-to-shoehorn`**: Quy trình di chuyển kiểm thử từ các ép kiểu thô `as` sang dùng thư viện `@total-typescript/shoehorn`.
  - Hướng dẫn chi tiết: [migrate-to-shoehorn/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/misc/migrate-to-shoehorn/SKILL.md)
- **`scaffold-exercises`**: Tạo khung thư mục bài tập chuẩn chỉnh (sections, problems, solutions, explainers).
  - Hướng dẫn chi tiết: [scaffold-exercises/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/misc/scaffold-exercises/SKILL.md)

### 4. Nhóm Kỹ năng đang Phát triển & Cá nhân (In Progress & Personal)
- **`review`**: Hướng dẫn đánh giá mã nguồn.
  - Hướng dẫn chi tiết: [review/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/in-progress/review/SKILL.md)
- **`teach`**: Phương pháp giảng dạy và giải thích kiến thức kỹ thuật.
  - Hướng dẫn chi tiết: [teach/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/in-progress/teach/SKILL.md)
- **`writing-beats` / `writing-fragments` / `writing-shape`**: Các kỹ thuật viết và biên soạn tài liệu chuyên nghiệp.
  - Chi tiết: [writing-beats/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/in-progress/writing-beats/SKILL.md) | [writing-fragments/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/in-progress/writing-fragments/SKILL.md) | [writing-shape/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/in-progress/writing-shape/SKILL.md)
- **`edit-article` / `obsidian-vault`**: Quản lý tài liệu cá nhân và bài viết.
  - Chi tiết: [edit-article/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/personal/edit-article/SKILL.md) | [obsidian-vault/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/personal/obsidian-vault/SKILL.md)

---

## Chỉ dẫn dành cho AI Agent
Khi nhận nhiệm vụ từ lập trình viên:
1. Xác định xem nhiệm vụ cần áp dụng quy trình kỹ nghệ hay kỹ năng nào của Matt Pocock ở trên.
2. Đọc file `SKILL.md` tương ứng trong thư mục cục bộ [docs/matt-pocock-skills/](file:///Users/nguyendam/Documents/Study/base-code/docs/matt-pocock-skills/) để hiểu rõ quy chuẩn.
3. Tuân thủ tuyệt đối quy trình và phương pháp kỹ thuật được đề cập (ví dụ: chạy `/grill-with-docs` trước khi thay đổi lớn, chạy `/tdd` khi viết tính năng/sửa bug).
