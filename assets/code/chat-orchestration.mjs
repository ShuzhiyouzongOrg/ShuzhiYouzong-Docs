// 先执行护栏，拒答场景不访问知识库或大模型
const sensitive = detectSensitive(question);
const outOfScope = detectOutOfScope(question);
let retrieval = { results: [], intents: [], spotMatches: [] };

if (!sensitive.sensitive && !outOfScope.outOfScope) {
  const retrievalStart = nowMs();
  try {
    retrieval = hybridSearch(query, { limit: 5 });
  } catch (error) {
    if (error.code !== "KNOWLEDGE_NOT_BUILT") throw error;
  }
  retrievalMs = nowMs() - retrievalStart;
}

// 根据护栏、检索证据和情绪识别问答场景
const scenarioInfo = classifyScenario({
  question,
  retrieval,
  emotion
});
const results = scenarioInfo.scenario === "grounded"
  ? retrieval.results
  : [];
const messages = buildMessages({ question, results, history });

// 大模型只消费重排后的证据，回答同时返回引用和数字人状态
const completion = await llmComplete({ messages, meta, signal });
const citations = results.slice(0, 3).map((item) => item.citation);
const label = qualityLabel({
  scenario: scenarioInfo.scenario,
  mode,
  emotion
});

return {
  answer: completion.text,
  scenario: scenarioInfo.scenario,
  label,
  citations,
  provider: completion.provider,
  digitalHuman: mapAnswerToDigitalHumanState({ label, emotion })
};
