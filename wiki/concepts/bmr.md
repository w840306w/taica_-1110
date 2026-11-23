---
title: BMR 基礎代謝率
type: concept
tags: [熱量, 公式]
sources: [frankenfield-2005-rmr-equations, fao-who-unu-2001-energy]
updated: 2026-11-23
---
# BMR 基礎代謝率（Basal Metabolic Rate）

BMR 是身體**整天躺著不動**也要消耗的熱量，用來維持呼吸、心跳、體溫等基本功能。

## 本指南採用的公式：Mifflin-St Jeor
```
BMR = 10 × 體重(kg) + 6.25 × 身高(cm) − 5 × 年齡(歲) + s
s：男性 +5，女性 −161
```
- 選用原因：系統性回顧發現，在 4 個常用公式裡，它最常把預測值估在實測值 ±10% 以內（[Frankenfield 2005](../sources/frankenfield-2005-rmr-equations.md)）
- 也可以用 Schofield 公式交叉比對（[FAO/WHO/UNU](../sources/fao-who-unu-2001-energy.md)）

## 範例（用 `node` 計算）
30 歲男性，170 cm、70 kg：10×70 + 6.25×170 − 5×30 + 5 = **1617.5 kcal**

## 注意
- 公式算出來的只是**估計值**，個人誤差可能很大（[Frankenfield 2005](../sources/frankenfield-2005-rmr-equations.md)）
- BMR 也是本指南的熱量下限之一，詳見 [熱量赤字](caloric-deficit.md)

相關：[TDEE](tdee.md)、[活動量分級](../exercise/activity-level.md)
