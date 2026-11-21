# 数据生成

1. DeepSeek 生成 10 轮对话脚本，含用户话术、facts、constraints、probe、tool_expect、turn_design。
2. 按场景/话题配额均衡抽样。
3. qwen3-tts-flash 合成 24kHz 输入语音；数字/单位按 SPEECH_NORMALIZATION 转写。
4. 级联：ASR → LLM → TTS；原生：音频进/音频出。
5. 判官 qwen3.8-omni-flash 听回答音频打分。

规模：家居 1,000 段、儿童 1,000 段，各 10 轮；评测抽样 200 段 / 2,000 轮。
