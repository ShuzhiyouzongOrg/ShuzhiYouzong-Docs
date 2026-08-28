// 摘录自 server/src/services/retrieval.mjs 与 retrieval/remoteProviders.mjs。
const config = buildRemoteRagConfig();
if (!isRemoteDenseReady(config)) {
  // 远程能力未配置时保持本地检索合同不变。
  return { ...hybridSearch(query, options), remote: { status: "disabled", dense: false } };
}

const local = hybridSearch(query, { ...options, limit: candidateLimit });
const plan = buildQueryPlan(query);
const denseQueries = plan.subQueries?.length > 1
  ? plan.subQueries.slice(0, 3)
  : [plan.original];
const embedded = await embedTexts(denseQueries, config);

const denseRows = await Promise.all(embedded.vectors.map((vector) => (
  queryQdrant(vector, config, {
    limit: candidateLimit,
    indexVersion: local.indexVersion,
    knowledgeScope: "visitor_qa",
    accessScopes: ["public"],
    tenantId: "default",
    scenicArea: local.filters?.scenicArea || null,
    language: options.strictLanguage ? normalizeLanguageFilter(options.locale) : null
  })
)));
const dense = reciprocalRankFusion(
  denseRows.map((rows, index) => rows.map((row) => ({
    chunk: chunkById.get(row.chunkId),
    score: row.score,
    channel: `dense_subquery_${index + 1}`
  })).filter((item) => item.chunk)),
  { limit: candidateLimit }
);

let fused = reciprocalRankFusion([localCandidates(local), dense], {
  limit: candidateLimit
});
if (fused.length > 0 && isRemoteRerankerReady(config)) {
  const order = await rerankDocuments(
    query,
    fused.map((item) => `${item.chunk.title}\n${item.chunk.content}`),
    config,
    { topN: fused.length }
  );
  fused = applyRerankOrder(fused, order);
}

return finalizeRetrieval(fused, {
  limit: options.limit || 5,
  factScope: resolveFactScenicArea(query, local.intents, local.spotMatches),
  remote: { status: "ready", dense: true, reranked: isRemoteRerankerReady(config) }
});
