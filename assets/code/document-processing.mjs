// 摘录自 server/src/services/pdfKnowledge.mjs 与 xlsxKnowledge.mjs。
const pdf = extractPdfKnowledge({
  buffer,
  documentId,
  fileName,
  knowledgeScope,
  scenicArea,
  language
});
if (pdf.needsOcr) {
  // 扫描型PDF不以空文本入库，转交可选的异步文档解析/OCR任务。
  return { status: "needs_ocr", chunks: [], pages: pdf.pages };
}

const workbook = extractXlsxKnowledge({
  buffer,
  documentId,
  fileName,
  knowledgeScope,
  scenicArea,
  language
});
// XLSX按工作表、表头和业务行形成可定位分块，而不是拼成无结构长文本。
return {
  status: "processed",
  chunks: workbook.chunks,
  sheets: workbook.sheets,
  skippedSheets: workbook.skippedSheets
};
