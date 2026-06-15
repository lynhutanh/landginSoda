---
description: Danh mục hệ thống Kỹ năng Lập trình Chuyên nghiệp của Addy Osmani (Agent Skills)
globs: "*"
alwaysApply: true
---

# Hệ thống Kỹ năng Lập trình Chuyên nghiệp của Addy Osmani (Agent Skills)

Dự án này đã tích hợp đầy đủ bộ kỹ năng lập trình chuyên nghiệp **Agent Skills** từ thư viện của tác giả Addy Osmani (`addyosmani/agent-skills`). Bộ kỹ năng này mã hóa các quy chuẩn kỹ nghệ đỉnh cao (TDD, bảo mật đầu vào, API design theo luật Hyrum's Law, rút gọn code theo luật Chesterton's Fence, lập luận hoài nghi Doubt-Driven Development, tối ưu hiệu năng...).

Toàn bộ tài liệu hướng dẫn chi tiết của các kỹ năng, nhân dạng AI (agents) và checklist tham chiếu đã được lưu trữ cục bộ tại thư mục [docs/agent-skills/](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/). AI Agent **bắt buộc** phải tự động tham chiếu và thực thi theo các chỉ dẫn tương ứng dưới đây.

---

## Danh sách Kỹ năng chi tiết (Kèm liên kết trực tiếp)

### 1. Kỹ năng Meta (Quy tắc chung)
- **`using-agent-skills`**: Cách AI Agent tự động khớp tác vụ với kỹ năng thích hợp và thiết lập quy tắc vận hành chung.
  - Hướng dẫn chi tiết: [using-agent-skills/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/using-agent-skills/SKILL.md)

### 2. Nhóm Lập định nghĩa & Thiết kế (Define & Design)
- **`interview-me`**: Quy trình vấn đáp một câu hỏi tại một thời điểm để làm rõ yêu cầu mờ nhạt từ phía người dùng.
  - Hướng dẫn chi tiết: [interview-me/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/interview-me/SKILL.md)
- **`idea-refine`**: Tinh chỉnh các ý tưởng thô sơ thành bản đề xuất cụ thể (divergent/convergent thinking).
  - Hướng dẫn chi tiết: [idea-refine/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/idea-refine/SKILL.md)
- **`spec-driven-development`**: Thiết lập PRD bao quát mục tiêu, thiết kế, kiểm thử và ranh giới trước khi viết bất kỳ mã nguồn nào.
  - Hướng dẫn chi tiết: [spec-driven-development/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/spec-driven-development/SKILL.md)
- **`api-and-interface-design`**: Thiết kế API contract-first, tuân thủ định luật Hyrum's Law và xác thực biên nghiêm ngặt.
  - Hướng dẫn chi tiết: [api-and-interface-design/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/api-and-interface-design/SKILL.md)

### 3. Nhóm Lập kế hoạch & Thực thi (Plan & Build)
- **`planning-and-task-breakdown`**: Phân rã spec thành các task nhỏ, có thứ tự phụ thuộc và tiêu chí chấp nhận (acceptance criteria).
  - Hướng dẫn chi tiết: [planning-and-task-breakdown/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/planning-and-task-breakdown/SKILL.md)
- **`incremental-implementation`**: Thực hiện lát cắt dọc (vertical slices), đặt cờ tính năng (feature flags) và gom nhỏ các commit.
  - Hướng dẫn chi tiết: [incremental-implementation/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/incremental-implementation/SKILL.md)
- **`test-driven-development`**: TDD thực tế, áp dụng mô hình Kim tự tháp kiểm thử (80/15/5), quy tắc DAMP over DRY, luật Beyoncé Rule (*"Nếu bạn thích nó, lẽ ra bạn phải đặt một cái test cho nó"*).
  - Hướng dẫn chi tiết: [test-driven-development/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/test-driven-development/SKILL.md)
- **`context-engineering`**: Phương pháp tối ưu và nén ngữ cảnh nạp vào AI, tận dụng quy tắc tệp và MCP.
  - Hướng dẫn chi tiết: [context-engineering/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/context-engineering/SKILL.md)
- **`source-driven-development`**: Trích dẫn nguồn tài liệu chính thống cho các thư viện/framework, loại bỏ ảo tưởng API lỗi thời.
  - Hướng dẫn chi tiết: [source-driven-development/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/source-driven-development/SKILL.md)
- **`doubt-driven-development`**: Quy trình tự phản biện đối đầu Fresh-Context để rà soát các quyết định rủi ro cao (CLAIM -> EXTRACT -> DOUBT -> RECONCILE -> STOP).
  - Hướng dẫn chi tiết: [doubt-driven-development/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/doubt-driven-development/SKILL.md)
- **`frontend-ui-engineering`**: Thiết kế giao diện thành phần, quản lý state và đáp ứng tiêu chuẩn tiếp cận WCAG 2.1 AA.
  - Hướng dẫn chi tiết: [frontend-ui-engineering/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/frontend-ui-engineering/SKILL.md)

### 4. Nhóm Xác minh & Sửa lỗi (Verify & Debug)
- **`browser-testing-with-devtools`**: Tận dụng Chrome DevTools MCP để phân tích DOM, theo dõi console log, network traces và đo đạc hiệu năng trực tiếp.
  - Hướng dẫn chi tiết: [browser-testing-with-devtools/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/browser-testing-with-devtools/SKILL.md)
- **`debugging-and-error-recovery`**: 5 bước gỡ lỗi khoa học: Tái hiện -> Khoanh vùng -> Thu nhỏ -> Sửa lỗi -> Phòng ngừa. Áp dụng quy tắc Stop-the-line.
  - Hướng dẫn chi tiết: [debugging-and-error-recovery/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/debugging-and-error-recovery/SKILL.md)

### 5. Nhóm Đánh giá & Rà soát (Review & Quality)
- **`code-review-and-quality`**: Đánh giá mã nguồn trên 5 trục, giữ kích thước thay đổi ~100 dòng, dán nhãn mức độ nghiêm trọng (Nit/Optional/FYI).
  - Hướng dẫn chi tiết: [code-review-and-quality/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/code-review-and-quality/SKILL.md)
- **`code-simplification`**: Rút gọn mã nguồn dựa trên luật Hàng rào Chesterton's Fence, quy tắc giới hạn 500 dòng code.
  - Hướng dẫn chi tiết: [code-simplification/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/code-simplification/SKILL.md)
- **`security-and-hardening`**: Ngăn ngừa OWASP Top 10, quản lý bí mật bảo mật và cứng hóa ranh giới dữ liệu.
  - Hướng dẫn chi tiết: [security-and-hardening/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/security-and-hardening/SKILL.md)
- **`performance-optimization`**: Đo lường Core Web Vitals, phân tích bundle và kiểm soát hồi quy hiệu năng.
  - Hướng dẫn chi tiết: [performance-optimization/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/performance-optimization/SKILL.md)

### 6. Nhóm Phát hành & Vòng đời (Ship & Lifecycle)
- **`git-workflow-and-versioning`**: Trunk-based development, commit dạng save-point, commit nguyên tử và kiểm soát kích thước thay đổi.
  - Hướng dẫn chi tiết: [git-workflow-and-versioning/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/git-workflow-and-versioning/SKILL.md)
- **`ci-cd-and-automation`**: Mô hình Shift Left, phản hồi sớm về lỗi build, tích hợp cờ tính năng để đưa code lên nhánh chính liên tục.
  - Hướng dẫn chi tiết: [ci-cd-and-automation/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/ci-cd-and-automation/SKILL.md)
- **`deprecation-and-migration`**: Tư duy loại bỏ zombie code và quản lý các thay đổi API cũ một cách tuần tự.
  - Hướng dẫn chi tiết: [deprecation-and-migration/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/deprecation-and-migration/SKILL.md)
- **`documentation-and-adrs`**: Ghi chép quyết định kiến trúc (ADRs), API docs và ghi nhận lý do tại sao code được viết.
  - Hướng dẫn chi tiết: [documentation-and-adrs/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/documentation-and-adrs/SKILL.md)
- **`shipping-and-launch`**: Checklist trước khi deploy, thiết lập giám sát lỗi (monitoring) và quy trình khôi phục (rollback).
  - Hướng dẫn chi tiết: [shipping-and-launch/SKILL.md](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/skills/shipping-and-launch/SKILL.md)

---

## Các Nhân dạng AI Chuyên biệt (Specialist Personas)

AI Agent có thể đóng vai các nhân dạng chuyên gia sau để review mã nguồn chéo:
- [Đánh giá viên mã nguồn (Code Reviewer)](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/agents/code-reviewer.md)
- [Kỹ sư kiểm thử (Test Engineer)](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/agents/test-engineer.md)
- [Chuyên gia kiểm toán bảo mật (Security Auditor)](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/agents/security-auditor.md)

---

## Checklists Tham chiếu Nhanh (Reference Checklists)

Các cẩm nang hướng dẫn bỏ túi:
- [Quy chuẩn viết và mock kiểm thử](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/references/testing-patterns.md)
- [Checklist rà soát bảo mật tiền commit](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/references/security-checklist.md)
- [Mục tiêu hiệu năng & Web Vitals](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/references/performance-checklist.md)
- [Quy chuẩn thiết kế tiếp cận Web (WCAG)](file:///Users/nguyendam/Documents/Study/base-code/docs/agent-skills/references/accessibility-checklist.md)

---

## Chỉ dẫn dành cho AI Agent
Khi bắt đầu phiên chat hoặc giải quyết nhiệm vụ:
1. Sử dụng kỹ năng `using-agent-skills` để lựa chọn quy trình kỹ nghệ thích hợp nhất.
2. Mở file `SKILL.md` hoặc checklist tương ứng của `agent-skills/` và tuân thủ tuyệt đối quy trình được thiết lập.
3. Không chấp nhận phán đoán cảm giác, luôn xuất trình bằng chứng kiểm thử/biên dịch đạt chuẩn tại mục **Verification**.
