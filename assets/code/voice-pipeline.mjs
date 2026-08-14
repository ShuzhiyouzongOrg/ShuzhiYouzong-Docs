export async function voiceAsk(input) {
  const started = nowMs();
  // 有文本时跳过转写，否则调用语音识别适配器
  const asrStart = nowMs();
  const asr = input.question
    ? { text: String(input.question).trim(), provider: "direct" }
    : await transcribeAudio(input);
  const asrMs = nowMs() - asrStart;

  // 相同语音问题优先复用十分钟缓存
  const cacheKey = `voice::${asr.text}::${input.mode || "auto"}`;
  const cached = getCachedAnswer(cacheKey, "voice");
  let answer = cached?.answerPayload;
  if (!cached) {
    answer = await answerQuestion({
      question: asr.text,
      sessionId: input.sessionId,
      mode: input.mode,
      signal: input.signal
    });
    setCachedAnswer(cacheKey, "voice", { answerPayload: answer }, 600000);
  }

  // 合成答案语音并汇总各阶段时延
  const ttsStart = nowMs();
  const tts = await synthesizeSpeech({ text: answer.answer });
  const totalMs = nowMs() - started;
  return {
    transcript: asr.text,
    answer,
    tts,
    latency: {
      asrMs,
      ragMs: answer.latency?.retrievalMs || 0,
      llmMs: answer.latency?.llmMs || 0,
      ttsMs: nowMs() - ttsStart,
      totalMs,
      targetMs: 5000,
      withinTarget: totalMs <= 5000
    }
  };
}
