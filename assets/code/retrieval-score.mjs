// 摘录自 server/src/services/retrieval.mjs；辅助函数在同一模块中定义。
function scoreChunk(chunk, context) {
  const title = normalize(chunk.title);
  const content = normalize(chunk.content);
  const keywordText = normalize((chunk.keywords || []).join(" "));
  const reasons = [];
  let score = 0;
  if (context.locale && languageMatches(chunk.language, context.locale)) {
    score += 30;
    reasons.push(`语种匹配：${context.locale}`);
  }
  for (const spot of context.spotMatches) {
    if (chunk.scenicSpotId === spot.id) {
      score += context.mode === "hybrid" ? 42 : 34;
      reasons.push(`景点实体命中：${spot.name}`);
    } else if (title.includes(spot.name) || content.includes(spot.name)) {
      score += 20;
      reasons.push(`景点名称命中：${spot.name}`);
    }
  }
  for (const token of context.tokens) {
    if (!token) continue;
    if (title.includes(token)) {
      score += 14;
      reasons.push(`标题命中：${token}`);
    }
    if (keywordText.includes(token)) {
      score += 9;
      reasons.push(`关键词命中：${token}`);
    }
    const count = countOccurrences(content, token);
    if (count > 0) {
      score += Math.min(count * 3, 18);
      reasons.push(`正文命中：${token}`);
    }
  }
  for (const term of context.expandedTerms) {
    if (content.includes(term) || title.includes(term) || keywordText.includes(term)) {
      score += 4;
      reasons.push(`扩展词命中：${term}`);
    }
  }
  for (const intent of context.intents) {
    const intentScore = scoreIntent(chunk, { title, content, keywordText, intent });
    if (intentScore.score > 0) {
      score += intentScore.score;
      reasons.push(...intentScore.reasons);
    }
    const directScore = scoreDirectIntent(chunk, intent);
    if (directScore.score > 0) {
      score += directScore.score;
      reasons.push(...directScore.reasons);
    }
  }
  if (context.mode === "hybrid") {
    const coverage = queryCoverage(context.tokens, `${title} ${keywordText} ${content}`);
    score += Math.round(coverage * 18);
    if (coverage > 0) reasons.push(`查询覆盖度：${coverage.toFixed(2)}`);
    if (score > 0 && chunk.documentId === "doc_structured_lingshan_spots") {
      score += 6;
      reasons.push("结构化景点资料加权");
    }
  }
  return { chunk, score, reasons: [...new Set(reasons)] };
}
