# 作業繳交：用 LLM Wiki 做一份教學 HTML 簡報

**繳交標題**：`學校 學號 系級 姓名 外食族與超商客製化健康減脂指南`（請自行填入）

## 1. LLM Wiki 主題與簡介

**主題：外食族與超商客製化健康減脂指南**

這是一份給台灣外食族的減脂知識庫，參考 Karpathy 提出的 LLM Wiki 架構，分成三層：
- `raw/`：原始資料，存入後不再修改。共 7 份：國健署 2 份、FAO/WHO/UNU、Frankenfield 2005 系統性回顧、ISSN 2017 立場聲明、7-ELEVEN 官網、TVBS 營養師文章
- `wiki/`：由 LLM 撰寫和維護的 22 頁知識頁，包含概念、指南、運動分級、商品、組合、個人化方案範例、來源摘要
- `CLAUDE.md`：schema，規定頁面格式、證據分級（Tier 1–4）、排除族群，以及 collect、ingest、query、lint、slides 五個流程

**特色**：使用者輸入身高、體重、運動習慣和預算，wiki 就能算出 BMR、TDEE、目標熱量和蛋白質，再搭配超商餐點。每個數字都可以從「簡報 → wiki → raw 原文」一路追溯。

## 2. LLM Wiki 成果
- 入口：[wiki/index.md](../wiki/index.md)、[wiki/overview.md](../wiki/overview.md)
- 操作日誌：[wiki/log.md](../wiki/log.md)
- Schema：[CLAUDE.md](../CLAUDE.md)
- （如果要提供線上連結，請把專案推到 GitHub，再附上 repo 網址）

## 3. 教學 HTML 簡報
- [slides/index.html](../slides/index.html)：共 13 張，單一檔案，直接用瀏覽器開啟即可。用方向鍵或右下角按鈕切換
- 每張投影片底部都標示引用了哪些 wiki 頁面

## 4. Loop / Graph 說明
- [docs/workflow.md](workflow.md)：含 Mermaid 流程圖

**取得資料 → 人工審核 → 存入 raw → 批次討論 → 生成 wiki → 檢查 0（溯源）→ 查詢 wiki → 產生簡報 → 檢查 1–4（程式）→ 語意審查（LLM）→ 視覺檢查 → 輸出**

## 5. 一次實際執行的結果與檢查紀錄
- [docs/run-log.md](run-log.md)：記錄擷取失敗 5 次、4 個討論決定、3 輪檢查和 1 次突變測試
- 原始檢查輸出：[check-round1.txt](check-round1.txt)、[check-round2.txt](check-round2.txt)、[check-round3.txt](check-round3.txt)
- 檢查工具：[tools/check.js](../tools/check.js)

## 6. 反思
- [docs/reflection.md](reflection.md)
- **最常出錯的節點**：資料取得。9 次擷取有 5 次失敗；另有 1 份資料的數字沒有欄位名稱；LLM 預設的活動係數也找不到出處
- **怎麼調整**：把檢查從「簡報後」往前移到「wiki 生成後」（新增 ingest 溯源檢查）和「擷取時」（檢查欄位是否清楚）；再加上突變測試和 LLM 語意審查
