// 摘录自 server/src/services/chat.mjs；真实函数还包含消息持久化和实验统计。
const trimmed = String(question || "").trim();
const responseLocale = normalizeLocale(locale, trimmed);
const knowledgeVersion = getActiveKnowledgeVersion();
const cached = mode === "route"
  ? null
  : getCachedAnswer(trimmed, mode, knowledgeVersion, {
    locale: responseLocale,
    accessScopes: ["public"],
    tenantId: "default"
  });
let retrieval = null;
if (!cached && !detectSensitive(trimmed).sensitive && !detectOutOfScope(trimmed).outOfScope) {
  const retrievalStart = nowMs();
  retrieval = await hybridSearchAsync(trimmed, {
    locale: responseLocale,
    knowledgeScope: "visitor_qa",
    accessScopes: ["public"],
    tenantId: "default",
    limit: 5
  });
  retrievalMs = nowMs() - retrievalStart;
}
const scenarioInfo = classifyScenario({
  question: trimmed,
  retrieval: retrieval || { results: [], intents: [], spotMatches: [] },
  emotion
});
const results = scenarioInfo.scenario === "grounded" ? retrieval.results : [];
const messages = buildMessages({
  mode,
  question: trimmed,
  results,
  conflicts: retrieval?.conflicts || [],
  history,
  locale: responseLocale
});
// 生成后校验引用，未检索到的事实不进入游客答案。
const completion = await llmComplete({ messages, meta, signal });
const citations = results.slice(0, 3).map((item) => item.citation);
const enforced = scenarioInfo.scenario === "grounded"
  ? enforceAnswerCitations(completion.text, citations, results)
  : { answer: completion.text, removedUnsupportedSegments: [] };
const answer = formatPublicAssistantText(enforced.answer);
const label = qualityLabel({ scenario: scenarioInfo.scenario, mode, emotion });
return {
  answer,
  scenario: scenarioInfo.scenario,
  label,
  citations,
  retrieval: {
    indexVersion: retrieval?.indexVersion || knowledgeVersion,
    channels: retrieval?.channels || [],
    decision: retrieval?.decision || null,
    remote: retrieval?.remote || null
  },
  provider: completion.provider,
  digitalHuman: mapAnswerToDigitalHumanState({
    label,
    emotion,
    scenario: scenarioInfo.scenario
  })
};
