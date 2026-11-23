# 操作日誌 Log

> 這份日誌只能往後新增。每筆的標題格式為 `## [YYYY-MM-DD] <collect|ingest|query|lint|schema> | <標題>`。

## [2026-11-23] schema | 建立 CLAUDE.md 與資料夾結構
- 新增 `CLAUDE.md`：定義目標、範圍、排除族群、目錄結構、寫作慣例、證據分級，以及 collect、ingest、query、lint 四個流程
- 建立 `raw/` 和 `wiki/` 子資料夾
- 新增 `wiki/index.md`、`wiki/log.md`、`wiki/overview.md`

## [2026-11-23] schema | 加入作業需求
- `CLAUDE.md` 新增「作業要求」（繳交項目與對應檔案）和「6.5 Slides 流程」（大綱 → 查詢 → 撰寫 → 檢查 → 修正 → 輸出）

## [2026-11-23] collect | 第一批 7 份來源
- 經使用者同意，收錄 7 份來源（Tier 1×4、Tier 2×1、Tier 3×1、Tier 4×1）
- `raw/guidelines/`：hpa-daily-calorie-weight-loss、hpa-daily-food-guide、fao-who-unu-2001-energy
- `raw/papers/`：frankenfield-2005-rmr-equations、issn-2017-protein
- `raw/products/`：711-simple-fit（⚠️ 頁面上的數字沒有標示欄位名稱）
- `raw/web/`：tvbs-2025-tea-egg-breakfast
- 取得失敗：每日飲食指南手冊 PDF（403）、PubMed 頁面（cookie 牆，改用 Europe PMC）、全家健康志向官網（商品資料都是圖片）、全家食在購安心網站（403）、MoneySmart 文章（410）

## [2026-11-23] ingest | 批次討論後生成 7 份來源（討論紀錄見 docs/run-log.md）
- 使用者確認 4 個決定：(1) TDEE 以 Mifflin 公式 × 活動係數為主，國健署方法交叉驗算；(2) 活動係數改用 FAO 分級（舊的 1.2／1.375… 沒有出處）；(3) 蛋白質採用 ISSN 的 1.4–2.0 g/kg，並列出 ⚖️ 來源分歧；(4) 7-ELEVEN 欄位不明的數字不採用，只保留豆漿的蛋白質
- 新增 sources/ 7 頁、concepts/ 6 頁、exercise/ 1 頁、guide/ 3 頁、stores/ 1 頁、products/ 2 頁、combos/ 1 頁、plans/ 1 頁
- 計算範例都用 `node -e` 驗算過
- 待處理的資料缺口：超商價格、鈉含量、外食類型的熱量、BMI 分級的原文、每公克營養素的熱量換算

## [2026-11-23] slides | 教學簡報 13 張與檢查 loop
- 產出 `slides/index.html`；檢查 3 輪＋1 次突變測試，修正 3 個問題（頁碼縮寫、「脂肪」說得比 wiki 多、漏掉 ⚠️ 標記），並修正 1 個換頁 bug
- 新增 `tools/check.js`（檢查 0–5），詳細紀錄見 `docs/run-log.md`

## [2026-11-23] schema | 依反思修改流程
- `CLAUDE.md`：ingest 加入「檢查 0」和擷取時的檢查；活動係數和營養素改成引用 wiki 定案的頁面；加入 Node 中文路徑的注意事項
