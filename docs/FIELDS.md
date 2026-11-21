# 字段字典

## 案例（review/data.json cases）

| 字段 | 说明 |
|---|---|
| id | A-home-xxxx / B-child-xxxx |
| scenario | home / child |
| topic / tool_mode / age_band / turn_design | 话题、工具模式、年龄段、轮次设计 |
| facts / constraints | 对话事实与必须守住的约束 |
| turns[].turn | 检查点（2/4/6/8/10） |
| turns[].user | 用户话术 |
| turns[].tool_expect | 期望工具调用 |
| turns[].probe | 探针问题与标准答案 |
| turns[].systems.<sys> | 该系统：scores、note、violations、audio、objective |

## 判官分数

- 家居：A1/A2/A3；儿童：B2/B3/B5/B6/B7/B9。
- note 为判官一句话理由；violations 为违规项（如有）。
