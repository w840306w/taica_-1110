// 檢查節點：在專案根目錄執行 node - < tools/check.js
// （這台電腦的 Node 從中文路徑載入腳本檔會 segfault，所以改用標準輸入）
// 1. wiki 內的相對連結是否都指向存在的檔案
// 2. 每張投影片引用的 wiki 頁面（data-wiki）是否存在
// 3. 投影片上的每個數字，是否都能在它引用的 wiki 頁面中找到（找不到就代表可能是幻覺）
// 4. 簡報是否包含排除族群與免責聲明
// 5. 統計 wiki 中還有多少 ⚠️ 待查證
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const wikiDir = path.join(root, 'wiki');
let fails = 0;
const fail = (msg) => { fails++; console.log('  ✗ ' + msg); };

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

console.log('[1] wiki 連結檢查');
const pages = walk(wikiDir);
let linkCount = 0;
for (const file of pages) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\]\(([^)#\s]+\.md)(#[^)]*)?\)/g)) {
    linkCount++;
    const target = path.resolve(path.dirname(file), decodeURI(m[1]));
    if (!fs.existsSync(target)) fail(`${path.relative(root, file)} → ${m[1]} 不存在`);
  }
}
console.log(`  檢查了 ${pages.length} 頁、${linkCount} 個連結`);

console.log('[0] ingest 溯源檢查：sources/ 頁面的數字是否都出現在 raw 原文中');
const numRe = (n) => new RegExp(`(^|[^\\d.])${n.replace('.', '\\.')}(?![\\d])`);
for (const file of walk(path.join(wikiDir, 'sources'))) {
  const text = fs.readFileSync(file, 'utf8');
  const rawRel = (text.match(/^raw:\s*(.+)$/m) || [])[1];
  if (!rawRel) { fail(`${path.basename(file)} 沒有標註 raw 路徑`); continue; }
  const rawPath = path.resolve(path.dirname(file), rawRel.trim());
  if (!fs.existsSync(rawPath)) { fail(`${path.basename(file)} 的 raw 檔不存在`); continue; }
  const raw = fs.readFileSync(rawPath, 'utf8');
  const body = text.replace(/^---[\s\S]*?---/, '').replace(/\]\([^)]*\)/g, ']');
  const nums = [...new Set(body.match(/\d+(?:\.\d+)?/g) || [])];
  const missing = nums.filter((n) => !numRe(n).test(raw));
  if (missing.length) fail(`${path.basename(file)}：數字 [${missing.join(', ')}] 在 raw 原文中找不到`);
}

console.log('[2][3] 簡報溯源檢查');
const html = fs.readFileSync(process.env.SLIDES || path.join(root, 'slides', 'index.html'), 'utf8');
const slides = [...html.matchAll(/<section class="slide" data-wiki="([^"]+)">([\s\S]*?)<\/section>/g)];
slides.forEach((s, idx) => {
  const refs = s[1].split(/\s+/);
  let corpus = '';
  for (const r of refs) {
    const p = path.join(wikiDir, r);
    if (!fs.existsSync(p)) { fail(`第 ${idx + 1} 張：引用的 ${r} 不存在`); continue; }
    corpus += fs.readFileSync(p, 'utf8');
  }
  const body = s[2]
    .replace(/<div class="src">[\s\S]*?<\/div>/g, '') // 來源註腳不檢查
    .replace(/<[^>]+>/g, ' ');
  const nums = [...new Set(body.match(/\d+(?:\.\d+)?/g) || [])];
  const missing = nums.filter((n) => !new RegExp(`(^|[^\\d.])${n.replace('.', '\\.')}(?![\\d])`).test(corpus));
  if (missing.length) fail(`第 ${idx + 1} 張：數字 [${missing.join(', ')}] 在引用的 wiki 頁面（${refs.join(', ')}）中找不到`);
});
console.log(`  檢查了 ${slides.length} 張投影片`);

console.log('[4] 安全聲明檢查');
if (!html.includes('不能取代醫療建議')) fail('簡報缺少免責聲明');
for (const k of ['孕婦', '糖尿病', '腎臟病', '飲食疾患']) if (!html.includes(k)) fail(`簡報沒有提到排除族群：${k}`);

console.log('[5] 待查證統計');
let warn = 0;
for (const f of pages) warn += (fs.readFileSync(f, 'utf8').match(/⚠️/g) || []).length;
console.log(`  wiki 中共有 ${warn} 個 ⚠️ 標記（資料缺口，不算錯誤）`);

console.log(fails ? `\n結果：${fails} 項不通過 → 退回修正` : '\n結果：全部通過 ✅');
process.exit(fails ? 1 : 0);
