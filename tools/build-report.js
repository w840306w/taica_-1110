// 產生視覺化檢查報告：在專案根目錄執行 node - < tools/build-report.js
// 終端機區塊的內容直接讀取 docs/check-*.txt（check.js 實際輸出的原始內容），不另外手寫
const fs = require('fs');
const read = (f) => fs.readFileSync('docs/' + f, 'utf8').trim();
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const term = (f) =>
  '<pre class="term">' +
  esc(read(f))
    .split('\n')
    .map((l) => (l.includes('✗') || l.includes('不通過') ? `<span class="bad">${l}</span>` : l.includes('全部通過') ? `<span class="ok">${l}</span>` : l))
    .join('\n') +
  '</pre>';

const collect = [
  ['國健署〈個人一天所需熱量〉', 'ok', '成功', '收錄 Tier 1'],
  ['國健署每日飲食指南手冊 PDF', 'bad', '403 被擋', '改收國健署網頁＋新聞稿'],
  ['Frankenfield 2005（PubMed）', 'bad', 'cookie 牆', '改用 Europe PMC 取得摘要'],
  ['FAO/WHO/UNU 2001', 'ok', '成功', '收錄 Tier 1'],
  ['ISSN 2017（PMC）', 'warn', '網址重新導向', '換新網址後成功，Tier 2'],
  ['全家「健康志向」官網', 'bad', '資料都是圖片', '放棄'],
  ['全家「食在購安心」網站', 'bad', '403 被擋', '放棄'],
  ['MoneySmart 超商蛋白質文章', 'bad', '410 已刪除', '改收 TVBS 營養師文章，Tier 4'],
  ['7-ELEVEN Simple Fit', 'warn', '數字沒有欄位名稱', '收錄 Tier 3，只採用可互相印證的 1 筆'],
];

const html = `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>一次實際執行的檢查紀錄｜外食族減脂 LLM Wiki</title>
<style>
 :root{--ink:#1f2a24;--muted:#5d6b63;--line:#dfe5df;--ok:#2f7d5b;--bad:#c0392b;--warn:#d68910;--bg:#f7f5ef}
 body{margin:0;background:var(--bg);color:var(--ink);font-family:"Noto Sans TC","Microsoft JhengHei",sans-serif;line-height:1.6}
 main{max-width:980px;margin:0 auto;padding:32px 20px 60px}
 h1{font-size:30px;margin:0 0 4px} h2{font-size:22px;margin:36px 0 12px;color:var(--ok)}
 .sub{color:var(--muted);margin:0 0 20px}
 .summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
 .stat{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px}
 .stat b{display:block;font-size:28px} .stat span{color:var(--muted);font-size:14px}
 table{width:100%;border-collapse:collapse;background:#fff;font-size:15px}
 th,td{border:1px solid var(--line);padding:7px 10px;text-align:left} th{background:#eaf3ee}
 .badge{display:inline-block;padding:1px 10px;border-radius:20px;color:#fff;font-size:13px;white-space:nowrap}
 .badge.ok{background:var(--ok)} .badge.bad{background:var(--bad)} .badge.warn{background:var(--warn)}
 .timeline{border-left:4px solid var(--line);margin-left:10px;padding-left:22px}
 .step{position:relative;margin-bottom:26px}
 .step:before{content:"";position:absolute;left:-33px;top:6px;width:18px;height:18px;border-radius:50%;background:var(--muted);border:3px solid var(--bg)}
 .step.ok:before{background:var(--ok)} .step.bad:before{background:var(--bad)} .step.warn:before{background:var(--warn)}
 .step h3{margin:0 0 6px;font-size:18px}
 .term{background:#14201a;color:#d9e8df;border-radius:10px;padding:14px 16px;font:13px/1.55 Consolas,monospace;overflow-x:auto;white-space:pre-wrap}
 .term .bad{color:#ff8a7a;font-weight:700} .term .ok{color:#7ee2a8;font-weight:700}
 .fix{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px}
 .fix div{background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 12px;font-size:14px}
 .fix .before{border-left:5px solid var(--bad)} .fix .after{border-left:5px solid var(--ok)}
 .note{color:var(--muted);font-size:14px}
 a{color:var(--ok)}
</style></head><body><main>
<h1>一次實際執行的檢查紀錄</h1>
<p class="sub">外食族與超商客製化健康減脂指南｜執行日期 2026-11-23｜流程說明見 <a href="workflow.md">workflow.md</a>，文字版紀錄見 <a href="run-log.md">run-log.md</a></p>

<div class="summary">
 <div class="stat"><b>9 → 7</b><span>嘗試擷取 → 最後收錄的來源</span></div>
 <div class="stat"><b style="color:var(--bad)">5</b><span>擷取失敗次數</span></div>
 <div class="stat"><b>4</b><span>批次討論時使用者決定的事項</span></div>
 <div class="stat"><b>3 + 1</b><span>檢查輪數＋突變測試</span></div>
 <div class="stat"><b style="color:var(--ok)">4</b><span>抓到並修正的問題</span></div>
</div>

<h2>① 資料取得（Collect）：最常出錯的節點</h2>
<table><tr><th>候選來源</th><th>結果</th><th>處理方式</th></tr>
${collect.map(([n, c, r, a]) => `<tr><td>${n}</td><td><span class="badge ${c}">${r}</span></td><td>${a}</td></tr>`).join('\n')}
</table>

<h2>② 先討論、後生成：使用者確認的 4 個決定</h2>
<table><tr><th>#</th><th>問題</th><th>決定</th></tr>
<tr><td>1</td><td>TDEE 用哪個方法算</td><td>以 Mifflin 公式 × 活動係數為主，國健署「每公斤大卡數」交叉驗算</td></tr>
<tr><td>2</td><td>活動係數 1.2／1.375／1.55 找不到出處</td><td>改用 FAO 分級：1.40／1.55／1.65／1.75／2.00</td></tr>
<tr><td>3</td><td>蛋白質三種說法不一致</td><td>採用 ISSN 的 1.4–2.0 g/kg，並列出 ⚖️ 來源分歧</td></tr>
<tr><td>4</td><td>7-ELEVEN 數字沒有欄位名稱</td><td>不採用，只保留可以和 TVBS 互相印證的豆漿蛋白質</td></tr>
</table>

<h2>③ 檢查 loop：tools/check.js 的實際輸出</h2>
<div class="timeline">
 <div class="step warn"><h3>第 1 輪：只檢查簡報端 → 全部通過，但令人懷疑</h3>
  <p class="note">全部通過，不代表內容沒錯，也可能是檢查太寬鬆。</p>${term('check-round1.txt')}</div>
 <div class="step ok"><h3>突變測試：故意改錯 2 個數字 → 兩個都抓到</h3>
  <p class="note">確認檢查真的有作用。（這次輸出是之後重跑的，所以連結數和 ⚠️ 數量和第 1 輪略有不同）</p>${term('check-mutation.txt')}</div>
 <div class="step bad"><h3>第 2 輪：把檢查往前移，加上「檢查 0：ingest 溯源」→ 抓到 1 個錯誤</h3>
  ${term('check-round2.txt')}
  <div class="fix"><div class="before">wiki：J Am Diet Assoc 105(5):<b>775-89</b></div><div class="after">raw 原文：105(5):<b>775-789</b> → 改回原文寫法</div></div></div>
 <div class="step bad"><h3>LLM 語意審查：程式抓不到的 2 個問題</h3>
  <div class="fix"><div class="before">第 2 張：動用儲存的<b>脂肪</b>（比 wiki 說得更多）</div><div class="after">改成：動用儲存的<b>能量</b>（和 wiki 一致）</div></div>
  <div class="fix"><div class="before">第 9 張：脂肪占總熱量的 20–30%（沒有標示待查證）</div><div class="after">加上：⚠️ 這個比例出自國健署手冊的搜尋摘要，原文還沒查證</div></div></div>
 <div class="step ok"><h3>第 3 輪：修正後重新檢查 → 全部通過</h3>${term('check-round3.txt')}</div>
 <div class="step ok"><h3>視覺檢查（瀏覽器）</h3>
  <p>1280×720 下 13 張投影片的內容都沒有蓋到來源註腳 ✅；修正 2 個問題：改網址 <code>#6</code> 不會跳頁、手機版內容蓋住註腳。</p></div>
</div>

<h2>④ 因此修改的 workflow</h2>
<ul>
 <li>新增「檢查 0：ingest 溯源」，在 wiki 生成後就比對 raw 原文，不等到簡報做完才檢查</li>
 <li>新增「突變測試」，確認檢查真的抓得到錯誤</li>
 <li>新增「LLM 語意審查」，處理程式比對不到的用詞過度推論</li>
 <li>擷取時就檢查數字有沒有欄位名稱，欄位不明的資料在討論時交給使用者決定</li>
</ul>
</main></body></html>`;
fs.writeFileSync('docs/check-report.html', html);
console.log('docs/check-report.html written,', html.length, 'chars');
