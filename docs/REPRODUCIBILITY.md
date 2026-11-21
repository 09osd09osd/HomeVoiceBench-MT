# 运行复现

- 级联：qwen3-asr + 语言模型 + qwen3-tts；原生：edge worker / Qwen2.5-Omni。
- 判官：阿里云 MaaS `qwen3.8-omni-flash`。
- 主要脚本（mt-eval）：`prep`、`content`、`tts`、`rubric_judge_local.py`、`rubric_objective.py`、`rubric_aggregate.py`。
- Omni 需 16kHz 重采样；判官只跑检查点 R2/4/6/8/10。
- 密钥、模型权重、大体积音频不包含在仓库。
