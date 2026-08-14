function scoreChunk(chunk, context) {
  const title = normalize(chunk.title);
  const content = normalize(chunk.content);
  const keywordText = normalize((chunk.keywords || []).join(" "));
  const reasons = [];
  let score = 0;

  // 景点实体优先于普通词项，保证专名问题稳定命中
  for (const spot of context.spotMatches) {
    if (chunk.scenicSpotId === spot.id) {
      score += context.mode === "hybrid" ? 42 : 34;
      reasons.push(`景点实体命中：${spot.name}`);
    } else if (title.includes(spot.name) || content.includes(spot.name)) {
      score += 20;
      reasons.push(`景点名称命中：${spot.name}`);
    }
  }

  // 标题、关键词与正文采用不同权重
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
    if (count > 0) score += Math.min(count * 3, 18);
  }

  // 混合模式进一步奖励查询覆盖度和结构化景点资料
  if (context.mode === "hybrid") {
    const text = `${title} ${keywordText} ${content}`;
    const coverage = queryCoverage(context.tokens, text);
    score += Math.round(coverage * 18);
    if (score > 0 && chunk.documentId === "doc_structured_lingshan_spots") {
      score += 6;
    }
  }
  return { chunk, score, reasons: [...new Set(reasons)] };
}
