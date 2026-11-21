# HomeVoiceBench-MT

中文家庭多轮语音交互基准：**家居闲聊/便签提醒 + 儿童聊天，每段 10 轮，5 条语音链路，场景专属 Rubric v2.1 判官听音评分**。

## 入口

- [交互讲解网页](docs/index.html)：双击 HTML，浏览概览、逐轮 Quality/多轮/工具结果，以及逐案例的判官分数与理由。
- [本地人工听音评审台](docs/LOCAL_REVIEW.md)：双击 `启动人工评审.cmd`，逐题对照五个系统语音、判官理由、工具/探针与人工备注。
- [Excel 总览](outputs/HomeVoiceBench-MT.xlsx)：总览、Quality 曲线、维度明细、工具 Task、判官明细。
- [结果报告](docs/RESULTS.md)、[评分标准](docs/EVALUATION.md)、[场景与配额](docs/SCENARIOS.md)。
- [数据生成](docs/DATASET.md)、[字段字典](docs/FIELDS.md)、[运行复现](docs/REPRODUCIBILITY.md)。
- [来源与限制](docs/PROVENANCE.md)、[交付说明](docs/DELIVERY.md)、[数字与单位朗读转换](docs/SPEECH_NORMALIZATION.md)。

## 结论摘要

- **家居闲聊 Quality**：omni 最高（3.92→4.02），4b 3.79→3.78，2b 3.50→3.62，edge 3.64→3.48，minicpm 3.12→3.48。
- **儿童 Quality**：4b 最高（4.72→4.62），edge 4.56→4.61，2b 4.62→4.59，omni 4.49→4.33，minicpm 4.43→4.34。
- **多轮信号**：B9 故事连贯 4b 4.67→4.30（-0.37）、omni 4.31→4.05（-0.26）；B6 人设基本稳定。
- **家居工具 Task**：minicpm 78%、4b 64%、edge 4%、omni 7%、2b 0%；2b 有 136 轮“声称已记/已设但没调用”。
- 加权总分已拆成 Quality / 多轮 / Task / 多轮表现，不再用一个均分掩盖问题。

## 说明

- 判官只判检查点 R2/R4/R6/R8/R10；主观维度带逐维锚点，音频输入，温度 0。
- edge 3 条、2b 9 条 `output_token_limit` 记录无法补齐，对应检查点标 NA。
- edge/omni 原生模型基本没有文本工具接口，工具项应读作“不支持/NA”，不要当作 0 分能力。
- 隐私/危险项规则仍在收紧，暂不作为主结论。
