// 摘录自 server/src/services/knowledgeBuild.mjs 与 knowledgeRepository.mjs。
const indexVersion = createIndexVersion({ documents, chunks });
const versionedDocuments = documents.map((document) => ({
  ...document,
  accessScope: normalizeAccessScope(document.accessScope, document.knowledgeScope),
  tenantId: normalizeTenantId(document.tenantId),
  indexVersion
}));
const versionedChunks = chunks.map((chunk) => ({
  ...chunk,
  indexVersion,
  enabled: chunk.enabled !== false,
  knowledgeScope: chunk.knowledgeScope || "visitor_qa",
  accessScope: normalizeAccessScope(chunk.accessScope, chunk.knowledgeScope || "visitor_qa"),
  tenantId: normalizeTenantId(chunk.tenantId),
  documentType: chunk.documentType || documentTypeFor(chunk.fileType)
}));
writeKnowledgeSnapshot(generatedDir, {
  generatedAt: new Date().toISOString(),
  indexVersion,
  chunkerVersion: CHUNKER_VERSION,
  documents: versionedDocuments,
  spots,
  guideSections,
  chunks: versionedChunks
});

// 活动指针只在目标快照通过校验后切换，旧快照保留以支持审计和回滚。
writeJson(join(generatedDir, "active-index.json"), {
  indexVersion,
  chunkerVersion: CHUNKER_VERSION,
  generatedAt: knowledge.generatedAt
});
