# 来源与限制

## 来源

- 对话脚本：DeepSeek 生成，按场景/话题配额筛选；事实、约束、探针为脚本字段。
- 输入语音：qwen3-tts-flash，24kHz。
- 被测：edge_native（EdgeInstant-Omni-2B 原生）、qwen35_4b、qwen35_2b、minicpm5_2b（级联 ASR+LLM+TTS）、qwen25_omni_3b（原生）。
- 判官：qwen3.8-omni-flash，阿里云 MaaS，音频输入，0–5，逐维锚点，温度 0。
- 框架：HomeVoiceBench-ZH v0.5 + mt-eval 多轮扩展。

## 限制

- 机器生成 + 机器判官，不等同人工审核。
- 每场景 100 段，单轮均值 CI 较宽；0.2 左右变化接近噪声。
- edge 3 条、2b 9 条模型 `output_token_limit`，对应检查点 NA。
- **工具口径**：新版使用 add_note/set_reminder/query_items，且工具触发轮是长上下文/指代式话术；edge/2b 在旧 bench 短指令工具题上有少量正确调用（edge 12/47、2b 6/47），但对我们的家居话术基本不触发。因此工具结果应读作“该提示与话术下的表现”，不能直接推断模型绝对无工具能力。
- 2b 的“声称已做但未调用”136 轮是独立问题，需单独报告。
- 隐私/危险项规则仍在收紧，计数偏高，未作为主结论。
