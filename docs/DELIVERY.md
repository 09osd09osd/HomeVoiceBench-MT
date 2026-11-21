# 交付说明

```text
HomeVoiceBench-MT/
  README.md
  启动人工评审.cmd
  docs/            # index.html 讲解页 + 本目录 md
  review/          # 听音台：index.html / app.js / style.css / data.json
  reports/         # rubric_data.json
  outputs/         # HomeVoiceBench-MT.xlsx
  assets/sample/   # 2 段样例音频（A-home-0001、B-child-0029）
  scripts/         # serve_review.py
```

## 音频

Git 只含样例音频；完整输入与五系统回答音频需从发布包/本机 `assets/` 放置到对应路径。缺失时听音台只展示判官分数与理由，不影响人工核对判官依据。

## 其他电脑

1. 克隆仓库；
2. 将完整音频放到本机；
3. 双击 `启动人工评审.cmd`；或直接打开 `docs/index.html`。
